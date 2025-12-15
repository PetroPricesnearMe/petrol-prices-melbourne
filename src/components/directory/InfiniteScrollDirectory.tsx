/**
 * Infinite Scroll Directory Component
 *
 * Main directory component with infinite scrolling, smooth transitions,
 * and optimized performance
 *
 * @module components/directory/InfiniteScrollDirectory
 */

'use client';

import { Suspense, useCallback, useState, useRef } from 'react';

import { StationDetailsModal } from '@/components/modals/Modal';
import { SuburbAutoSuggest } from '@/components/molecules/SuburbAutoSuggest';
import {
  ViewToggle,
  DirectoryView,
  StationCardGrid,
  StationCardList,
} from '@/components/toggle/ViewToggle';
import {
  LoadingSpinner,
  SkeletonGrid,
} from '@/components/transitions/SmoothTransitions';
import { useAdvancedInfiniteStations } from '@/hooks/useInfiniteStations';
import type { Station } from '@/types/station.d';
import { cn } from '@/utils/cn';

// ============================================================================
// TYPES
// ============================================================================

type FuelTypeKey = 'unleaded' | 'diesel' | 'premium95' | 'premium98' | 'lpg';

interface InfiniteScrollDirectoryProps {
  initialFilters?: {
    search?: string;
    fuelType?: FuelTypeKey | 'all';
    brand?: string;
    suburb?: string;
    sortBy?: 'price-low' | 'price-high' | 'name' | 'suburb';
    priceMax?: number;
  };
  className?: string;
  onStationClick?: (station: Station) => void;
}

interface FilterBarProps {
  filters: Record<string, unknown>;
  onFiltersChange: (filters: Record<string, unknown>) => void;
  totalCount: number;
  currentView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  className?: string;
}

interface LoadingStatesProps {
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  loadingProgress: number;
  className?: string;
}

// ============================================================================
// FILTER BAR COMPONENT
// ============================================================================

/**
 * Filter bar component for the directory
 */
export function FilterBar({
  filters,
  onFiltersChange,
  totalCount,
  currentView,
  onViewChange,
  className,
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuburbSuggestions, setShowSuburbSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleFilterChange = useCallback(
    (key: string, value: unknown) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const clearFilters = useCallback(() => {
    onFiltersChange({
      search: '',
      fuelType: 'all',
      brand: 'all',
      suburb: 'all',
      sortBy: 'price-low',
      priceMax: undefined,
    });
  }, [onFiltersChange]);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) =>
      value &&
      value !== 'all' &&
      value !== 'price-low' &&
      key !== 'sortBy' &&
      key !== 'fuelType'
  ).length;

  return (
    <div
      className={cn(
        'sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
        className
      )}
    >
      <div className="container mx-auto space-y-4 px-4 py-6">
        {/* Search Bar with Suburb Auto-Suggest */}
        <div className="relative mb-4">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search stations by name, brand, suburb, or address..."
              value={(filters.search as string) || ''}
              onChange={(e) => {
                handleFilterChange('search', e.target.value);
                setShowSuburbSuggestions(
                  e.target.value.length >= 2 || e.target.value.length === 0
                );
              }}
              onFocus={() => setShowSuburbSuggestions(true)}
              onBlur={(e) => {
                // Delay hiding to allow click on suggestion
                setTimeout(() => {
                  if (!e.currentTarget.contains(document.activeElement)) {
                    setShowSuburbSuggestions(false);
                  }
                }, 200);
              }}
              className="input w-full pr-10"
              aria-label="Search stations"
              aria-autocomplete="list"
              aria-expanded={showSuburbSuggestions}
            />
            {/* Suburb Auto-Suggest */}
            {showSuburbSuggestions && (
              <SuburbAutoSuggest
                query={(filters.search as string) || ''}
                onSelect={(suburb) => {
                  handleFilterChange('search', suburb);
                  setShowSuburbSuggestions(false);
                  searchInputRef.current?.blur();
                }}
                onClose={() => setShowSuburbSuggestions(false)}
                maxResults={6}
                minChars={2}
                showPopular={true}
                className="top-full mt-1"
              />
            )}
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {totalCount} station{totalCount !== 1 ? 's' : ''} found
            {(() => {
              const searchValue = filters.search as string | undefined;
              return searchValue ? (
                <span className="ml-2">
                  for <strong>&quot;{searchValue}&quot;</strong>
                </span>
              ) : null;
            })()}
          </div>

          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <ViewToggle
              currentView={currentView}
              onViewChange={onViewChange}
              size="sm"
            />

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                'btn',
                showAdvanced ? 'btn-primary' : 'btn-outline',
                'whitespace-nowrap'
              )}
              aria-label="Toggle filters"
            >
              <span aria-hidden="true">⚙️</span> Filters
              {activeFilterCount > 0 && (
                <span className="badge badge-secondary ml-2">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="animate-fade-in space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Fuel Type */}
              <div>
                <label
                  htmlFor="fuel-type"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  ⛽ Fuel Type
                </label>
                <select
                  id="fuel-type"
                  value={(filters.fuelType as string) || 'all'}
                  onChange={(e) =>
                    handleFilterChange('fuelType', e.target.value)
                  }
                  className="input w-full"
                >
                  <option value="all">All Fuel Types</option>
                  <option value="unleaded">Unleaded 91</option>
                  <option value="diesel">Diesel</option>
                  <option value="premium95">Premium 95</option>
                  <option value="premium98">Premium 98</option>
                  <option value="lpg">LPG</option>
                </select>
              </div>

              {/* Brand */}
              <div>
                <label
                  htmlFor="brand"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  🏪 Brand
                </label>
                <select
                  id="brand"
                  value={(filters.brand as string) || 'all'}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="input w-full"
                >
                  <option value="all">All Brands</option>
                  <option value="BP">BP</option>
                  <option value="Shell">Shell</option>
                  <option value="Caltex">Caltex</option>
                  <option value="7-Eleven">7-Eleven</option>
                  <option value="Coles Express">Coles Express</option>
                  <option value="Woolworths">Woolworths</option>
                  <option value="United">United</option>
                  <option value="Puma">Puma</option>
                </select>
              </div>

              {/* Suburb */}
              <div>
                <label
                  htmlFor="suburb"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  📍 Suburb
                </label>
                <select
                  id="suburb"
                  value={(filters.suburb as string) || 'all'}
                  onChange={(e) => handleFilterChange('suburb', e.target.value)}
                  className="input w-full"
                >
                  <option value="all">All Suburbs</option>
                  <option value="Melbourne">Melbourne</option>
                  <option value="Richmond">Richmond</option>
                  <option value="Fitzroy">Fitzroy</option>
                  <option value="Brunswick">Brunbourne</option>
                  <option value="Preston">Preston</option>
                  <option value="Coburg">Coburg</option>
                  <option value="Broadmeadows">Broadmeadows</option>
                  <option value="Werribee">Werribee</option>
                  <option value="Dandenong">Dandenong</option>
                  <option value="Frankston">Frankston</option>
                  <option value="Box Hill">Box Hill</option>
                  <option value="Ringwood">Ringwood</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label
                  htmlFor="sort"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  🔄 Sort By
                </label>
                <select
                  id="sort"
                  value={(filters.sortBy as string) || 'price-low'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input w-full"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="suburb">Suburb</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label
                htmlFor="price-max"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                💰 Maximum Price (¢/L)
              </label>
              <input
                id="price-max"
                type="number"
                placeholder="e.g., 210"
                step="0.1"
                value={(filters.priceMax as number | undefined) || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'priceMax',
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="input max-w-xs"
              />
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button onClick={clearFilters} className="btn-ghost btn-sm btn">
                Clear All
              </button>
              <button
                onClick={() => setShowAdvanced(false)}
                className="btn-primary btn-sm btn"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// LOADING STATES COMPONENT
// ============================================================================

/**
 * Loading states component
 */
export function LoadingStates({
  isInitialLoading,
  isLoadingMore,
  loadingProgress: _loadingProgress,
  className,
}: LoadingStatesProps) {
  if (!isInitialLoading && !isLoadingMore) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {isInitialLoading && (
        <div className="py-8 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading stations...
          </p>
        </div>
      )}

      {isLoadingMore && (
        <div className="py-4 text-center">
          <LoadingSpinner size="md" className="mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading more stations...
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Infinite Scroll Directory Component
 */
export function InfiniteScrollDirectory({
  initialFilters = {},
  className,
  onStationClick,
}: InfiniteScrollDirectoryProps) {
  const [filters, setFilters] = useState<{
    search: string;
    fuelType: FuelTypeKey | 'all';
    brand: string;
    suburb: string;
    sortBy: 'price-low' | 'price-high' | 'name' | 'suburb';
    priceMax?: number;
  }>({
    search: '',
    fuelType: 'all',
    brand: 'all',
    suburb: 'all',
    sortBy: 'price-low',
    priceMax: undefined,
    ...initialFilters,
  });

  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: stations,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: _fetchNextPage,
    refetch,
    totalCount,
    loadedPages,
    isTransitioning: _isTransitioning,
    transitionDirection: _transitionDirection,
    triggerRef,
  } = useAdvancedInfiniteStations(filters, {
    pageSize: 24,
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleFiltersChange = useCallback(
    (newFilters: Record<string, unknown>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    },
    []
  );

  const handleStationClick = useCallback(
    (station: Station) => {
      // Navigation is now handled by Link components in the cards
      // This callback can be used for analytics or other side effects
      if (onStationClick) {
        onStationClick(station);
      }
    },
    [onStationClick]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedStation(null);
  }, []);

  // Error state
  if (isError) {
    return (
      <div className="py-20 text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Something went wrong
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {error?.message || 'Failed to load stations'}
        </p>
        <button onClick={() => refetch()} className="btn-primary btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={totalCount}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading States */}
        <LoadingStates
          isInitialLoading={isLoading}
          isLoadingMore={isFetchingNextPage}
          loadingProgress={0}
        />

        {/* Stations Grid/List */}
        {!isLoading && stations.length > 0 && (
          <Suspense fallback={<SkeletonGrid count={12} />}>
            <DirectoryView
              view={currentView}
              items={stations}
              renderItem={(station: unknown) => {
                const s = station as Station;
                return currentView === 'grid' ? (
                  <StationCardGrid
                    key={s.id}
                    station={s as any}
                    onCardClickAction={handleStationClick as any}
                  />
                ) : (
                  <StationCardList
                    key={s.id}
                    station={s as any}
                    onCardClickAction={handleStationClick as any}
                  />
                );
              }}
            />
          </Suspense>
        )}

        {/* Empty State */}
        {!isLoading && stations.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              No stations found
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  fuelType: 'all',
                  brand: 'all',
                  suburb: 'all',
                  sortBy: 'price-low',
                  priceMax: undefined,
                })
              }
              className="btn-primary btn"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        {hasNextPage && (
          <div
            ref={triggerRef}
            className="flex h-20 items-center justify-center"
          >
            {isFetchingNextPage && (
              <div className="text-center">
                <LoadingSpinner size="md" className="mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading more stations...
                </p>
              </div>
            )}
          </div>
        )}

        {/* End of Results */}
        {!hasNextPage && stations.length > 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              You&apos;ve reached the end of the results
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              {totalCount} stations loaded across {loadedPages} pages
            </p>
          </div>
        )}
      </div>

      {/* Station Details Modal */}
      {selectedStation && (
        <StationDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          station={selectedStation as any}
        />
      )}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { InfiniteScrollDirectoryProps };
