/**
 * FilterSearchBar Component
 * 
 * A comprehensive filter and search bar component with:
 * - Debounced search input
 * - Filter dropdowns (Fuel Type, Distance, Rating)
 * - Reset button
 * - URL query parameter synchronization
 * - Sticky positioning
 * - Glassmorphism styling
 * - Full accessibility support
 * - Responsive design
 * 
 * @module components/molecules/FilterSearchBar
 */

'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

import { useDebounce } from '@/hooks/usePerformance';
import { cn } from '@/utils/cn';

import { FilterDropdown } from './FilterDropdown';
import type {
  FilterSearchBarProps,
  FilterSearchBarState,
  FuelType,
  DistanceOption,
  RatingOption,
} from './FilterSearchBar.types';

// Default filter options
const DEFAULT_FUEL_TYPE_OPTIONS = [
  { value: 'all' as FuelType, label: 'All Fuel Types', icon: '⛽' },
  { value: 'unleaded' as FuelType, label: 'Unleaded', icon: '🛢️' },
  { value: 'diesel' as FuelType, label: 'Diesel', icon: '⛽' },
  { value: 'premium95' as FuelType, label: 'Premium 95', icon: '⭐' },
  { value: 'premium98' as FuelType, label: 'Premium 98', icon: '💎' },
  { value: 'e10' as FuelType, label: 'E10', icon: '🌱' },
  { value: 'e85' as FuelType, label: 'E85', icon: '🌿' },
  { value: 'lpg' as FuelType, label: 'LPG', icon: '🔥' },
];

const DEFAULT_DISTANCE_OPTIONS = [
  { value: 'all' as DistanceOption, label: 'Any Distance' },
  { value: '5' as DistanceOption, label: 'Within 5 miles' },
  { value: '10' as DistanceOption, label: 'Within 10 miles' },
  { value: '25' as DistanceOption, label: 'Within 25 miles' },
  { value: '50' as DistanceOption, label: 'Within 50 miles' },
  { value: '100' as DistanceOption, label: 'Within 100 miles' },
];

const DEFAULT_RATING_OPTIONS = [
  { value: 'all' as RatingOption, label: 'Any Rating', icon: '⭐' },
  { value: '5' as RatingOption, label: '5 Stars', icon: '⭐⭐⭐⭐⭐' },
  { value: '4' as RatingOption, label: '4+ Stars', icon: '⭐⭐⭐⭐' },
  { value: '3' as RatingOption, label: '3+ Stars', icon: '⭐⭐⭐' },
  { value: '2' as RatingOption, label: '2+ Stars', icon: '⭐⭐' },
  { value: '1' as RatingOption, label: '1+ Star', icon: '⭐' },
];

const DEFAULT_STATE: FilterSearchBarState = {
  search: '',
  fuelType: 'all',
  distance: 'all',
  rating: 'all',
};

export function FilterSearchBar({
  initialSearch = '',
  initialFuelType = 'all',
  initialDistance = 'all',
  initialRating = 'all',
  onFiltersChange,
  onSearchChange,
  searchPlaceholder = 'Search stations, locations...',
  debounceDelay = 300,
  syncWithUrl = true,
  className,
  disabled = false,
  showResetButton = true,
  fuelTypeOptions = DEFAULT_FUEL_TYPE_OPTIONS,
  distanceOptions = DEFAULT_DISTANCE_OPTIONS,
  ratingOptions = DEFAULT_RATING_OPTIONS,
}: FilterSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params or props
  const [state, setState] = useState<FilterSearchBarState>(() => {
    if (syncWithUrl) {
      return {
        search: searchParams.get('search') || initialSearch,
        fuelType: (searchParams.get('fuelType') as FuelType) || initialFuelType,
        distance: (searchParams.get('distance') as DistanceOption) || initialDistance,
        rating: (searchParams.get('rating') as RatingOption) || initialRating,
      };
    }
    return {
      search: initialSearch,
      fuelType: initialFuelType,
      distance: initialDistance,
      rating: initialRating,
    };
  });

  // Debounced search value
  const debouncedSearch = useDebounce(state.search, debounceDelay);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      state.search !== '' ||
      state.fuelType !== 'all' ||
      state.distance !== 'all' ||
      state.rating !== 'all'
    );
  }, [state]);

  // Update URL query parameters
  const updateUrlParams = useCallback(
    (newState: FilterSearchBarState) => {
      if (!syncWithUrl) return;

      const params = new URLSearchParams(searchParams.toString());

      // Update search
      if (newState.search) {
        params.set('search', newState.search);
      } else {
        params.delete('search');
      }

      // Update fuel type
      if (newState.fuelType !== 'all') {
        params.set('fuelType', newState.fuelType);
      } else {
        params.delete('fuelType');
      }

      // Update distance
      if (newState.distance !== 'all') {
        params.set('distance', newState.distance);
      } else {
        params.delete('distance');
      }

      // Update rating
      if (newState.rating !== 'all') {
        params.set('rating', newState.rating);
      } else {
        params.delete('rating');
      }

      // Update URL without page reload
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [syncWithUrl, searchParams, pathname, router]
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setState((prev) => ({ ...prev, search: newValue }));
    },
    []
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (key: keyof FilterSearchBarState, value: string) => {
      setState((prev) => {
        const newState = { ...prev, [key]: value };
        updateUrlParams(newState);
        onFiltersChange?.(newState);
        return newState;
      });
    },
    [updateUrlParams, onFiltersChange]
  );

  // Handle reset
  const handleReset = useCallback(() => {
    const resetState = { ...DEFAULT_STATE };
    setState(resetState);
    updateUrlParams(resetState);
    onFiltersChange?.(resetState);
    onSearchChange?.('');

    // Clear URL params
    if (syncWithUrl) {
      router.push(pathname, { scroll: false });
    }
  }, [updateUrlParams, onFiltersChange, onSearchChange, syncWithUrl, pathname, router]);

  // Notify parent of debounced search changes
  useEffect(() => {
    if (debouncedSearch !== state.search) {
      // Only notify if debounced value differs from current (debounce in progress)
      return;
    }
    onSearchChange?.(debouncedSearch);
    updateUrlParams(state);
    onFiltersChange?.(state);
  }, [debouncedSearch, state, onSearchChange, updateUrlParams, onFiltersChange]);

  // Sync with URL params on mount/change
  useEffect(() => {
    if (!syncWithUrl) return;

    const urlSearch = searchParams.get('search') || '';
    const urlFuelType = (searchParams.get('fuelType') as FuelType) || 'all';
    const urlDistance = (searchParams.get('distance') as DistanceOption) || 'all';
    const urlRating = (searchParams.get('rating') as RatingOption) || 'all';

    // Only update if URL params differ from current state
    if (
      urlSearch !== state.search ||
      urlFuelType !== state.fuelType ||
      urlDistance !== state.distance ||
      urlRating !== state.rating
    ) {
      const urlState = {
        search: urlSearch,
        fuelType: urlFuelType,
        distance: urlDistance,
        rating: urlRating,
      };
      setState(urlState);
      onFiltersChange?.(urlState);
      if (urlSearch) {
        onSearchChange?.(urlSearch);
      }
    }
  }, [searchParams, syncWithUrl]); // Only depend on searchParams to avoid loops

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'sticky top-0 z-40 w-full',
        'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
        'border-b border-white/20 dark:border-gray-700/50',
        'shadow-lg',
        className
      )}
      role="search"
      aria-label="Filter and search controls"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          {/* Search Input */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="search"
                value={state.search}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                disabled={disabled}
                className={cn(
                  'w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5',
                  'min-h-[44px]',
                  'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md',
                  'border border-white/20 dark:border-gray-600/50',
                  'rounded-lg',
                  'text-sm md:text-base',
                  'text-gray-900 dark:text-white',
                  'placeholder-gray-400 dark:placeholder-gray-500',
                  'shadow-sm hover:shadow-md',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-transparent',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'touch-manipulation'
                )}
                aria-label="Search input"
                aria-describedby="search-description"
              />
              {state.search && (
                <button
                  type="button"
                  onClick={() => handleSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                  className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <p id="search-description" className="sr-only">
              Search for stations and locations. Results update as you type.
            </p>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-shrink-0">
            {/* Fuel Type Dropdown */}
            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <FilterDropdown
                label="Fuel"
                value={state.fuelType}
                options={fuelTypeOptions}
                onChange={(value) => handleFilterChange('fuelType', value)}
                disabled={disabled}
                ariaLabel="Filter by fuel type"
                icon="⛽"
              />
            </div>

            {/* Distance Dropdown */}
            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <FilterDropdown
                label="Distance"
                value={state.distance}
                options={distanceOptions}
                onChange={(value) => handleFilterChange('distance', value)}
                disabled={disabled}
                ariaLabel="Filter by distance"
                icon="📍"
              />
            </div>

            {/* Rating Dropdown */}
            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <FilterDropdown
                label="Rating"
                value={state.rating}
                options={ratingOptions}
                onChange={(value) => handleFilterChange('rating', value)}
                disabled={disabled}
                ariaLabel="Filter by rating"
                icon="⭐"
              />
            </div>

            {/* Reset Button */}
            {showResetButton && (
              <motion.button
                type="button"
                onClick={handleReset}
                disabled={disabled || !hasActiveFilters}
                whileHover={!disabled && hasActiveFilters ? { scale: 1.02 } : {}}
                whileTap={!disabled && hasActiveFilters ? { scale: 0.98 } : {}}
                className={cn(
                  'px-4 md:px-6 py-3 md:py-3.5',
                  'min-h-[44px]',
                  'rounded-lg',
                  'text-sm md:text-base font-medium',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  'touch-manipulation',
                  hasActiveFilters
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                aria-label="Reset all filters"
                aria-disabled={!hasActiveFilters || disabled}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="hidden sm:inline">Reset</span>
                </span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/20 dark:border-gray-700/50"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Active filters:</span>
              {state.search && (
                <span className="px-2 py-1 bg-primary-100/50 dark:bg-primary-900/30 rounded-md">
                  Search: &quot;{state.search}&quot;
                </span>
              )}
              {state.fuelType !== 'all' && (
                <span className="px-2 py-1 bg-primary-100/50 dark:bg-primary-900/30 rounded-md">
                  {fuelTypeOptions.find((opt) => opt.value === state.fuelType)?.label}
                </span>
              )}
              {state.distance !== 'all' && (
                <span className="px-2 py-1 bg-primary-100/50 dark:bg-primary-900/30 rounded-md">
                  {distanceOptions.find((opt) => opt.value === state.distance)?.label}
                </span>
              )}
              {state.rating !== 'all' && (
                <span className="px-2 py-1 bg-primary-100/50 dark:bg-primary-900/30 rounded-md">
                  {ratingOptions.find((opt) => opt.value === state.rating)?.label}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default FilterSearchBar;

