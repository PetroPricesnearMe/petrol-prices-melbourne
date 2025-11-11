/**
 * Advanced Search Bar Component Tests
 *
 * Tests all functionality:
 * - Autocomplete
 * - Fuzzy search
 * - Category filters
 * - Keyboard navigation
 * - Recent searches
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { act } from 'react';

import { AdvancedSearchBar } from '../AdvancedSearchBar';

// Mock data
const mockStations = [
  {
    id: 1,
    name: 'Shell Carlton',
    brand: 'Shell',
    suburb: 'Carlton',
    address: '123 Carlton Road',
  },
  {
    id: 2,
    name: 'BP Richmond',
    brand: 'BP',
    suburb: 'Richmond',
    address: '456 Richmond Street',
  },
  {
    id: 3,
    name: '7-Eleven Fitzroy',
    brand: '7-Eleven',
    suburb: 'Fitzroy',
    address: '789 Fitzroy Avenue',
  },
];

const mockCategories = [
  { id: 'all', label: 'All', icon: '🔍' },
  { id: 'brand', label: 'Brand', icon: '🏢' },
  { id: 'suburb', label: 'Suburb', icon: '📍' },
];

describe('AdvancedSearchBar', () => {
  let mockOnSearch: jest.Mock;
  let mockOnCategoryChange: jest.Mock;

  beforeEach(() => {
    mockOnSearch = jest.fn();
    mockOnCategoryChange = jest.fn();
    localStorage.clear();
    
    // Mock scrollIntoView which is not implemented in jsdom
    Element.prototype.scrollIntoView = jest.fn();
  });

  describe('Basic Rendering', () => {
    it('should render search input', () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name', 'brand']}
          onSearch={mockOnSearch}
        />
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('should render category buttons', () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
          categories={mockCategories}
        />
      );

      expect(screen.getByLabelText('Filter by All')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by Brand')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by Suburb')).toBeInTheDocument();
    });
  });

  describe('Autocomplete Functionality', () => {
    it('should show suggestions when typing', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name', 'brand']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      await act(async () => {
        await userEvent.type(input, 'Shell');
      });

      await waitFor(() => {
        expect(screen.getByRole('option', { name: /Shell.*Carlton/i })).toBeInTheDocument();
      });
    });

    it('should call onSearch with results', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      // ACT REQUIRED: typing triggers debounced search which updates component state asynchronously
      await act(async () => {
        await userEvent.type(input, 'Shell');
      });

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalled();
        const results = mockOnSearch.mock.calls[mockOnSearch.mock.calls.length - 1][1];
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].name).toContain('Shell');
      });
    });

    it('should clear suggestions when input is cleared', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      await act(async () => {
        await userEvent.type(input, 'Shell');
      });

      await waitFor(() => {
        expect(screen.getByRole('option', { name: /Shell.*Carlton/i })).toBeInTheDocument();
      });

      const clearButton = screen.getByLabelText('Clear search');
      await act(async () => {
        await userEvent.click(clearButton);
      });

      expect(input).toHaveValue('');
    });
  });

  describe('Fuzzy Search', () => {
    it('should find results with typos', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name', 'brand']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      // ACT REQUIRED: fuzzy search triggers debounced async state updates
      await act(async () => {
        await userEvent.type(input, 'Shel'); // Typo: missing 'l'
      });

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalled();
        const results = mockOnSearch.mock.calls[mockOnSearch.mock.calls.length - 1][1];
        expect(results.some((r: Record<string, unknown>) => r.brand === 'Shell')).toBe(true);
      });
    });

    it('should find results with partial matches', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['suburb']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      // ACT REQUIRED: partial match search triggers debounced state updates
      await act(async () => {
        await userEvent.type(input, 'Carl'); // Partial: "Carlton"
      });

      await waitFor(() => {
        const results = mockOnSearch.mock.calls[mockOnSearch.mock.calls.length - 1][1];
        expect(results.some((r: Record<string, unknown>) => r.suburb === 'Carlton')).toBe(true);
      });
    });
  });

  describe('Category Filters', () => {
    it('should change category when button clicked', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
          onCategoryChange={mockOnCategoryChange}
          categories={mockCategories}
          selectedCategory="all"
        />
      );

      const brandButton = screen.getByLabelText('Filter by Brand');
      // ACT REQUIRED: clicking category button may trigger re-render with new props
      await act(async () => {
        await userEvent.click(brandButton);
      });

      expect(mockOnCategoryChange).toHaveBeenCalledWith('brand');
    });

    it('should highlight selected category', () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
          categories={mockCategories}
          selectedCategory="brand"
        />
      );

      const brandButton = screen.getByLabelText('Filter by Brand');
      expect(brandButton).toHaveClass('active');
      expect(brandButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate with arrow keys', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      // ACT REQUIRED: typing triggers debounced performSearch() with setTimeout
      // which asynchronously updates setSuggestions and setShowSuggestions state
      await act(async () => {
        await userEvent.type(input, 'Shell');
      });

      await waitFor(() => {
        expect(screen.getByRole('option', { name: /Shell.*Carlton/i })).toBeInTheDocument();
      });

      // ACT REQUIRED: ArrowDown keypress triggers setSelectedIndex state update
      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown' });
      });

      // First suggestion should be selected
      const firstSuggestion = screen.getByRole('option', { name: /Shell.*Carlton/i });
      expect(firstSuggestion).toHaveClass('selected');
    });

    it('should select suggestion with Enter key', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      // ACT REQUIRED: typing triggers debounced state updates via performSearch setTimeout
      await act(async () => {
        await userEvent.type(input, 'Shell');
      });

      await waitFor(() => {
        expect(screen.getByRole('option', { name: /Shell.*Carlton/i })).toBeInTheDocument();
      });

      // ACT REQUIRED: ArrowDown updates selectedIndex, Enter updates query/suggestions/showSuggestions
      // and triggers saveRecentSearch which calls setRecentSearches
      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown' });
      });
      
      act(() => {
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await waitFor(() => {
        expect(input).toHaveValue('Shell Carlton');
      });
    });

    it('should close dropdown with Escape key', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      // ACT REQUIRED: typing triggers debounced search with async state updates
      await act(async () => {
        await userEvent.type(input, 'Shell');
      });

      await waitFor(() => {
        expect(screen.getByRole('option', { name: /Shell.*Carlton/i })).toBeInTheDocument();
      });

      // ACT REQUIRED: Escape key triggers setShowSuggestions(false) and setSelectedIndex(-1)
      act(() => {
        fireEvent.keyDown(input, { key: 'Escape' });
      });

      await waitFor(() => {
        expect(screen.queryByRole('option', { name: /Shell.*Carlton/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('Recent Searches', () => {
    it('should save recent searches', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
          enableRecentSearches={true}
        />
      );

      const input = screen.getByRole('combobox');
      // ACT REQUIRED: typing triggers debounced performSearch with setTimeout
      // which calls setSuggestions asynchronously
      await act(async () => {
        await userEvent.type(input, 'Shell Carlton');
      });
      
      // Wait for suggestions to appear
      await waitFor(() => {
        expect(screen.getByRole('option', { name: /Shell Carlton/i })).toBeInTheDocument();
      });
      
      // ACT REQUIRED: Enter key triggers saveRecentSearch which updates setRecentSearches state
      // and also calls setShowSuggestions to close the dropdown
      act(() => {
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      // Check localStorage
      await waitFor(() => {
        const stored = localStorage.getItem('advanced_search_recent');
        expect(stored).toBeTruthy();
        const recent = JSON.parse(stored!);
        expect(recent).toContain('Shell Carlton');
      });
    });

    it('should show recent searches when input is focused and empty', async () => {
      // Pre-populate recent searches
      localStorage.setItem('advanced_search_recent', JSON.stringify(['Shell', 'BP']));

      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
          enableRecentSearches={true}
        />
      );

      const input = screen.getByRole('combobox');
      // ACT REQUIRED: clicking triggers onFocus which calls setIsFocused(true) and setShowSuggestions(true)
      // These state updates must happen within act() to avoid warnings
      await act(async () => {
        await userEvent.click(input);
      });

      await waitFor(() => {
        expect(screen.getByText('Shell')).toBeInTheDocument();
        expect(screen.getByText('BP')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded');
      expect(input).toHaveAttribute('aria-controls', 'search-suggestions');
    });

    it('should update aria-expanded when dropdown opens', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'false');

      // ACT REQUIRED: typing triggers debounced search which updates setShowSuggestions(true)
      // This changes aria-expanded attribute, so must be wrapped in act()
      await act(async () => {
        await userEvent.type(input, 'Shell');
      });

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have aria-selected on suggestions', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      // ACT REQUIRED: typing triggers debounced search which updates state asynchronously
      await act(async () => {
        await userEvent.type(input, 'Shell');
      });

      await waitFor(() => {
        const suggestion = screen.getByRole('option', { name: /Shell Carlton/i });
        expect(suggestion).toHaveAttribute('aria-selected');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty data gracefully', () => {
      render(
        <AdvancedSearchBar
          data={[]}
          searchKeys={['name']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();
    });

    it('should show no results message when no matches', async () => {
      render(
        <AdvancedSearchBar
          data={mockStations}
          searchKeys={['name']}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('combobox');
      // ACT REQUIRED: typing triggers debounced search with setTimeout
      // which updates setSuggestions([]) and setShowSuggestions(true)
      await act(async () => {
        await userEvent.type(input, 'NonexistentStation');
      });

      await waitFor(() => {
        expect(screen.getByText(/no results found/i)).toBeInTheDocument();
      });
    });
  });
});
