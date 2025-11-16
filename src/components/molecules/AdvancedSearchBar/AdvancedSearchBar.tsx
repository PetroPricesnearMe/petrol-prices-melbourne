/**
 * Advanced Search Bar with Autocomplete and Fuzzy Search
 *
 * Features:
 * - Autocomplete suggestions with fuzzy matching (Fuse.js)
 * - Category filters (Brand, Fuel Type, Suburb)
 * - Keyboard navigation (Arrow keys, Enter, Esc)
 * - Recent searches
 * - Highlighted search terms
 * - Mobile responsive
 * - Accessible (WCAG 2.1 AA)
 */

'use client';

import Fuse from 'fuse.js';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';

import { FocusTrap } from '@/components/accessibility/FocusTrap';
import './AdvancedSearchBar.css';

export interface SearchCategory {
  id: string;
  label: string;
  icon?: string;
}

export interface SearchResult<T = any> {
  item: T;
  score?: number;
  matches?: unknown[];
}

export interface AdvancedSearchBarProps<T = any> {
  /** Data to search through */
  data: T[];
  /** Fields to search in */
  searchKeys: string[];
  /** Placeholder text */
  placeholder?: string;
  /** Search callback */
  onSearch: (query: string, results: T[]) => void;
  /** Category selection callback */
  onCategoryChange?: (category: string) => void;
  /** Categories for filtering */
  categories?: SearchCategory[];
  /** Selected category */
  selectedCategory?: string;
  /** Maximum suggestions to show */
  maxSuggestions?: number;
  /** Debounce delay in ms */
  debounceDelay?: number;
  /** Enable recent searches */
  enableRecentSearches?: boolean;
  /** Custom result renderer */
  renderResult?: (result: T) => React.ReactNode;
  /** Custom className */
  className?: string;
  /** Loading state */
  loading?: boolean;
}

const RECENT_SEARCHES_KEY = 'advanced_search_recent';
const MAX_RECENT_SEARCHES = 5;

export function AdvancedSearchBar<T = any>({
  data,
  searchKeys,
  placeholder = 'Search stations, brands, suburbs...',
  onSearch,
  onCategoryChange,
  categories = [],
  selectedCategory = 'all',
  maxSuggestions = 8,
  debounceDelay = 150,
  enableRecentSearches = true,
  renderResult,
  className = '',
  loading = false,
}: AdvancedSearchBarProps<T>) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult<T>[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys: searchKeys,
      threshold: 0.3, // Lower = more strict, Higher = more fuzzy
      distance: 100,
      minMatchCharLength: 2,
      includeScore: true,
      includeMatches: true,
      findAllMatches: false,
      ignoreLocation: true,
    });
  }, [data, searchKeys]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (enableRecentSearches && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, [enableRecentSearches]);

  // Save recent search
  const saveRecentSearch = useCallback(
    (searchQuery: string) => {
      if (!enableRecentSearches || !searchQuery.trim()) return;

      setRecentSearches((prev) => {
        const updated = [
          searchQuery,
          ...prev.filter((s) => s !== searchQuery),
        ].slice(0, MAX_RECENT_SEARCHES);

        try {
          localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error('Error saving recent search:', error);
        }

        return updated;
      });
    },
    [enableRecentSearches]
  );

  // Perform fuzzy search with debounce
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (!searchQuery.trim()) {
          setSuggestions([]);
          setShowSuggestions(false);
          onSearch('', data);
          return;
        }

        // Perform fuzzy search
        const results = fuse.search(searchQuery).slice(0, maxSuggestions);
        setSuggestions(results);
        setShowSuggestions(true);

        // Callback with all matching results
        const allResults = fuse.search(searchQuery).map((r) => r.item);
        onSearch(searchQuery, allResults);
      }, debounceDelay);
    },
    [data, fuse, maxSuggestions, debounceDelay, onSearch]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    performSearch(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (result: SearchResult<T>) => {
    const item = result.item as any;
    const displayText = item.name || item.title || item.label || String(item);

    setQuery(displayText);
    setShowSuggestions(false);
    saveRecentSearch(displayText);
    onSearch(displayText, [item]);

    // Return focus to input
    inputRef.current?.focus();
  };

  // Handle recent search click
  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    performSearch(search);
    saveRecentSearch(search);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === 'ArrowDown' && query.trim()) {
        setShowSuggestions(true);
      }
      return;
    }

    const totalItems =
      suggestions.length +
      (recentSearches.length > 0 && !query ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (
          selectedIndex >= suggestions.length &&
          recentSearches.length > 0
        ) {
          const recentIndex = selectedIndex - suggestions.length;
          handleRecentSearchClick(recentSearches[recentIndex]);
        } else if (query.trim()) {
          saveRecentSearch(query);
          setShowSuggestions(false);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matching text
  const highlightMatch = (text: string, matches: unknown[] = []) => {
    if (!matches.length) return text;
    const indices: Array<[number, number]> = [];

    matches.forEach((match) => {
      if (match.indices) {
        indices.push(...match.indices);
      }
    });

    if (indices.length === 0) return text;

    // Sort indices
    indices.sort((a, b) => a[0] - b[0]);

    // Build highlighted string
    let highlighted = '';
    let lastIndex = 0;

    indices.forEach(([start, end]) => {
      highlighted += text.slice(lastIndex, start);
      highlighted += `<mark class="search-highlight">${text.slice(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    });

    highlighted += text.slice(lastIndex);
    return highlighted;
  };

  // Default result renderer
  const defaultRenderResult = (result: SearchResult<T>) => {
    const item = result.item as any;
    const name = item.name || item.title || item.label || 'Unknown';
    const subtitle = item.address || item.suburb || item.brand || '';

    return (
      <div className="suggestion-content">
        <div
          className="suggestion-title"
          dangerouslySetInnerHTML={{
            __html: highlightMatch(name, result.matches),
          }}
        />
        {subtitle && <div className="suggestion-subtitle">{subtitle}</div>}
      </div>
    );
  };

  const showRecentInDropdown =
    !query.trim() && recentSearches.length > 0 && isFocused;

  return (
    <div className={`advanced-search-bar ${className}`}>
      {/* Category Filters */}
      {categories.length > 0 && (
        <div
          className="search-categories"
          role="group"
          aria-label="Search categories"
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Filter by ${category.label}`}
                className={`category-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onCategoryChange?.(category.id)}
              >
                {category.icon && (
                  <span aria-hidden="true">{category.icon}</span>
                )}
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Search Input Container */}
      <div className="search-input-container">
        <div className="search-input-wrapper">
          {/* Search Icon */}
          <div className="search-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              if (query.trim() || recentSearches.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="search-input"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions"
            aria-activedescendant={
              selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
            }
            aria-label="Search"
          />

          {/* Loading Spinner */}
          {loading && (
            <div className="search-loading" aria-label="Searching...">
              <div className="spinner" />
            </div>
          )}

          {/* Clear Button */}
          {query && !loading && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
                onSearch('', data);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <FocusTrap active={false}>
            <div className="suggestions-dropdown">
              {/* Recent Searches */}
              {showRecentInDropdown && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <span>Recent Searches</span>
                    <button
                      type="button"
                      className="clear-recent-btn"
                      onClick={clearRecentSearches}
                      aria-label="Clear recent searches"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Search Results Header */}
              {query.trim() && suggestions.length > 0 && !showRecentInDropdown && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <span>Suggestions ({suggestions.length})</span>
                  </div>
                </div>
              )}

              {/* Listbox with all options */}
              <div
                ref={suggestionsRef}
                id="search-suggestions"
                role="listbox"
                aria-label="Search suggestions"
                aria-multiselectable="false"
              >
                {showRecentInDropdown &&
                  recentSearches.map((search, index) => {
                    const itemIndex = suggestions.length + index;
                    const isSelected = selectedIndex === itemIndex;
                    return (
                      <div
                        key={`recent-${index}`}
                        data-index={itemIndex}
                        className={`suggestion-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleRecentSearchClick(search)}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={-1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRecentSearchClick(search);
                          }
                        }}
                      >
                        <span className="suggestion-icon" aria-hidden="true">
                          🕐
                        </span>
                        <span className="suggestion-text">{search}</span>
                      </div>
                    );
                  })}

                {query.trim() &&
                  suggestions.map((result, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                      <div
                        key={`suggestion-${index}`}
                        id={`suggestion-${index}`}
                        data-index={index}
                        className={`suggestion-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSuggestionClick(result)}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={-1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSuggestionClick(result);
                          }
                        }}
                      >
                        <span className="suggestion-icon" aria-hidden="true">
                          🔍
                        </span>
                        {renderResult
                          ? renderResult(result.item)
                          : defaultRenderResult(result)}
                        {result.score !== undefined && (
                          <span
                            className="suggestion-score"
                            title="Match quality"
                          >
                            {Math.round((1 - result.score) * 100)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* No Results */}
              {query.trim() && suggestions.length === 0 && !loading && (
                <div className="no-results">
                  <span className="no-results-icon" aria-hidden="true">
                    🔍
                  </span>
                  <div className="no-results-text">
                    <strong>No results found</strong>
                    <p>Try different keywords or check spelling</p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="suggestions-loading">
                  <div className="spinner" />
                  <span>Searching...</span>
                </div>
              )}
            </div>
          </FocusTrap>
        )}
      </div>

      {/* Search Stats */}
      {query && suggestions.length > 0 && (
        <div className="search-stats" aria-live="polite" aria-atomic="true">
          Found {suggestions.length} result{suggestions.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

export default AdvancedSearchBar;
