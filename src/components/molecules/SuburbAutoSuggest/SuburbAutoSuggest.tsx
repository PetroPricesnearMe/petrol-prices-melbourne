/**
 * Suburb Auto-Suggest Component
 * 
 * Dropdown component for suburb suggestions that integrates with search inputs
 * 
 * @module components/molecules/SuburbAutoSuggest
 */

'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';

import { useSuburbSuggestions, type SuburbSuggestion } from '@/hooks/useSuburbSuggestions';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface SuburbAutoSuggestProps {
  query: string;
  onSelect?: (suburb: string) => void;
  onClose?: () => void;
  className?: string;
  maxResults?: number;
  minChars?: number;
  showPopular?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SuburbAutoSuggest({
  query,
  onSelect,
  onClose,
  className,
  maxResults = 8,
  minChars = 2,
  showPopular = true,
}: SuburbAutoSuggestProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);

  const { suggestions, loading, popularSuburbs, hasResults } = useSuburbSuggestions(
    query,
    {
      minChars,
      maxResults,
      debounceMs: 200,
      enabled: isOpen,
    }
  );

  // Show popular suburbs when query is empty
  const displaySuggestions = query.length >= minChars ? suggestions : (showPopular ? popularSuburbs : []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || displaySuggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < displaySuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : displaySuggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < displaySuggestions.length) {
            const selected = displaySuggestions[selectedIndex];
            onSelect?.(selected.displayName);
            setIsOpen(false);
            onClose?.();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          onClose?.();
          break;
      }
    },
    [isOpen, displaySuggestions, selectedIndex, onSelect, onClose]
  );

  // Handle suggestion selection
  const handleSelect = useCallback(
    (suburb: SuburbSuggestion) => {
      onSelect?.(suburb.displayName);
      setIsOpen(false);
      onClose?.();
    },
    [onSelect, onClose]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [displaySuggestions]);

  if (!isOpen || displaySuggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute z-50 mt-1 w-full',
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'rounded-lg shadow-lg',
        'max-h-80 overflow-y-auto',
        'focus:outline-none',
        className
      )}
      role="listbox"
      aria-label="Suburb suggestions"
      onKeyDown={handleKeyDown}
    >
      {loading && (
        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            Searching suburbs...
          </div>
        </div>
      )}

      {!loading && (
        <>
          {query.length < minChars && showPopular && (
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
              Popular Suburbs
            </div>
          )}

          {query.length >= minChars && (
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
              Suburb Suggestions
            </div>
          )}

          <div role="group">
            {displaySuggestions.map((suburb, index) => {
              const isSelected = index === selectedIndex;
              const ItemComponent = onSelect ? 'button' : Link;
              const itemProps = onSelect
                ? {
                    onClick: () => handleSelect(suburb),
                    type: 'button' as const,
                  }
                : {
                    href: suburb.url,
                  };

              return (
                <ItemComponent
                  key={suburb.name}
                  ref={(el) => {
                    itemRefs.current[index] = el as HTMLButtonElement & HTMLAnchorElement;
                  }}
                  {...itemProps}
                  className={cn(
                    'w-full px-4 py-3 text-left',
                    'flex items-center justify-between gap-3',
                    'transition-colors duration-150',
                    'focus:outline-none',
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100',
                    'border-b border-gray-100 dark:border-gray-700 last:border-0'
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{suburb.displayName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {suburb.stationCount} station{suburb.stationCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </ItemComponent>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Re-export type for convenience
export type { SuburbSuggestion } from '@/hooks/useSuburbSuggestions';

