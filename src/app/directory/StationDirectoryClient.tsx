/**
 * Station Directory Client Component
 * Interactive directory with filtering, search, sorting, and pagination
 * Optimized for performance with virtual scrolling capability
 */

'use client';

import Image from 'next/image';
import { useState, useCallback, useMemo } from 'react';

import {
  SortDropdown,
  QuickSortBar,
  type SortOption,
} from '@/components/molecules/SortDropdown';
import { cn, patterns } from '@/styles/system/css-in-js';

interface FuelPrices {
  unleaded: number | null;
  diesel: number | null;
  premium95: number | null;
  premium98: number | null;
  lpg: number | null;
}

interface Station {
  id: number;
  name: string;
  brand: string;
  brandLogo: string | null;
  address: string;
  suburb: string;
  postcode: string;
  region: string;
  fuelPrices: FuelPrices;
  lastUpdated: string;
  verified: boolean;
}

interface Metadata {
  totalStations: number;
  suburbs: string[];
  brands: string[];
  priceRange: {
    unleaded: {
      min: number;
      max: number;
      average: string;
    };
  };
}

interface Props {
  initialStations: Station[];
  metadata: Metadata;
}

interface SearchFilters {
  search: string;
  fuelType: keyof FuelPrices | 'all';
  brand: string;
  suburb: string;
  sortBy: SortOption;
  priceMax: string;
}

const ITEMS_PER_PAGE = 24;

// Brand utility functions
const getBrandInfo = (brand: string) => {
  const brandMap: Record<
    string,
    { name: string; logo: string; color: string; fallback: string }
  > = {
    BP: {
      name: 'BP',
      logo: '/images/brands/bp.png',
      color: '#00A651',
      fallback: '#00A651',
    },
    Shell: {
      name: 'Shell',
      logo: '/images/brands/shell.png',
      color: '#FFD700',
      fallback: '#FFD700',
    },
    Caltex: {
      name: 'Caltex',
      logo: '/images/brands/caltex.png',
      color: '#FF6B35',
      fallback: '#FF6B35',
    },
    '7-Eleven': {
      name: '7-Eleven',
      logo: '/images/brands/7eleven.png',
      color: '#FF6900',
      fallback: '#FF6900',
    },
    'Coles Express': {
      name: 'Coles Express',
      logo: '/images/brands/coles.png',
      color: '#E31837',
      fallback: '#E31837',
    },
    Woolworths: {
      name: 'Woolworths',
      logo: '/images/brands/woolworths.png',
      color: '#1B5E20',
      fallback: '#1B5E20',
    },
    United: {
      name: 'United',
      logo: '/images/brands/united.png',
      color: '#1976D2',
      fallback: '#1976D2',
    },
    Puma: {
      name: 'Puma',
      logo: '/images/brands/puma.png',
      color: '#E91E63',
      fallback: '#E91E63',
    },
  };
  return (
    brandMap[brand] || {
      name: brand,
      logo: '/images/brands/default-logo.svg',
      color: '#6B7280',
      fallback: '#6B7280',
    }
  );
};

const getBrandClass = (brand: string) => {
  const brandClassMap: Record<string, string> = {
    BP: 'badge-success',
    Shell: 'badge-warning',
    Caltex: 'badge-error',
    '7-Eleven': 'badge-primary',
    'Coles Express': 'badge-error',
    Woolworths: 'badge-success',
    United: 'badge-primary',
    Puma: 'badge-secondary',
  };
  return brandClassMap[brand] || 'badge-secondary';
};

// Advanced Search Bar component (simplified for now)
function AdvancedSearchBar({
  placeholder,
  onSearch,
  data,
}: {
  placeholder?: string;
  onSearch?: (value: string, data: unknown) => void;
  data?: unknown;
}) {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch?.(value, data || []);
  };

  return (
    <div className="relative">
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="input w-full"
        aria-label="Search stations"
      />
    </div>
  );
}

export function StationDirectoryClient({ initialStations, metadata }: Props) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    fuelType: 'all',
    brand: 'all',
    suburb: 'all',
    sortBy: 'name',
    priceMax: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] =
    useState<Station[]>(initialStations);
  // Filter and sort stations
  const filteredStations = useMemo(() => {
    let result = [...searchResults];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.address.toLowerCase().includes(search) ||
          s.suburb.toLowerCase().includes(search) ||
          s.brand.toLowerCase().includes(search)
      );
    }

    // Brand filter
    if (filters.brand !== 'all') {
      result = result.filter((s) => s.brand === filters.brand);
    }

    // Suburb filter
    if (filters.suburb !== 'all') {
      result = result.filter((s) => s.suburb === filters.suburb);
    }

    // Filter by fuel type only if not 'all' and when user is actively sorting by price or filtering by max price
    // This ensures all stations show by default instead of just those with the selected fuel type
    if (filters.fuelType !== 'all') {
      const isPriceSorting =
        filters.sortBy === 'price-low' || filters.sortBy === 'price-high';
      const hasPriceFilter = filters.priceMax !== '';

      if (isPriceSorting || hasPriceFilter) {
        const fuelKey = filters.fuelType as keyof FuelPrices;
        // Only show stations with selected fuel type when price sorting/filtering is active
        result = result.filter((s) => s.fuelPrices[fuelKey] !== null);
      }
    }

    // Max price filter
    if (filters.priceMax && filters.fuelType !== 'all') {
      const maxPrice = parseFloat(filters.priceMax);
      result = result.filter((s) => {
        const fuelKey = filters.fuelType as keyof FuelPrices;
        const price = s.fuelPrices[fuelKey];
        return price !== null && price <= maxPrice;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low': {
          // If fuelType is 'all', use the minimum price across all fuel types
          if (filters.fuelType === 'all') {
            const pricesA = Object.values(a.fuelPrices).filter((p): p is number => p !== null);
            const pricesB = Object.values(b.fuelPrices).filter((p): p is number => p !== null);
            const minPriceA = pricesA.length > 0 ? Math.min(...pricesA) : Infinity;
            const minPriceB = pricesB.length > 0 ? Math.min(...pricesB) : Infinity;
            return minPriceA - minPriceB;
          }
          const priceA = a.fuelPrices[filters.fuelType] || Infinity;
          const priceB = b.fuelPrices[filters.fuelType] || Infinity;
          return priceA - priceB;
        }
        case 'price-high': {
          // If fuelType is 'all', use the minimum price across all fuel types
          if (filters.fuelType === 'all') {
            const pricesA = Object.values(a.fuelPrices).filter((p): p is number => p !== null);
            const pricesB = Object.values(b.fuelPrices).filter((p): p is number => p !== null);
            const minPriceA = pricesA.length > 0 ? Math.min(...pricesA) : 0;
            const minPriceB = pricesB.length > 0 ? Math.min(...pricesB) : 0;
            return minPriceB - minPriceA;
          }
          const priceA = a.fuelPrices[filters.fuelType] || 0;
          const priceB = b.fuelPrices[filters.fuelType] || 0;
          return priceB - priceA;
        }
        case 'suburb':
          return (
            a.suburb.localeCompare(b.suburb) || a.name.localeCompare(b.name)
          );
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [searchResults, filters]);

  // Handle advanced search
  const handleAdvancedSearch = useCallback(
    (query: string, data: unknown) => {
      const stations = Array.isArray(data) ? (data as Station[]) : initialStations;
      setSearchResults(stations);
      setFilters((prev) => ({ ...prev, search: query }));
      setCurrentPage(1);
    },
    [initialStations]
  );

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE);
  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      fuelType: 'all',
      brand: 'all',
      suburb: 'all',
      sortBy: 'name',
      priceMax: '',
    });
    setCurrentPage(1);
  }, []);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) =>
      value &&
      value !== 'all' &&
      value !== 'name' &&
      key !== 'sortBy' &&
      (key !== 'fuelType' || value !== 'all')
  ).length;

  // Get price color based on value
  const getPriceColor = (price: number | null): string => {
    if (price === null) return 'text-gray-400';
    if (price < 200) return 'text-success-600 dark:text-success-400';
    if (price <= 210) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="print-hidden bg-gradient-primary py-12 text-white">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <h1 className={cn(patterns.text.h1, 'mb-4 text-center text-white')}>
              Melbourne Petrol Stations Directory
            </h1>
            <p
              className={cn(
                patterns.text.body,
                'mb-6 max-w-2xl text-center text-white/90'
              )}
            >
              Browse {metadata.totalStations}+ stations across{' '}
              {metadata.suburbs.length}+ suburbs with live fuel prices
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <strong>{metadata.totalStations}</strong> Total Stations
              </div>
              <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <strong>{metadata.suburbs.length}+</strong> Suburbs
              </div>
              <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                Average Price:{' '}
                <strong>{metadata.priceRange.unleaded.average}¢/L</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="print-hidden sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className={patterns.container()}>
          <div className="space-y-4 py-6">
            {/* Advanced Search Bar */}
            <div className="mb-4">
              <AdvancedSearchBar
                data={initialStations}
                placeholder="Search stations by name, brand, suburb, or address..."
                onSearch={handleAdvancedSearch}
              />
            </div>

            {/* Filters Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredStations.length} station
                {filteredStations.length !== 1 ? 's' : ''} found
                {filters.search && (
                  <span className="ml-2">
                    for <strong>&quot;{filters.search}&quot;</strong>
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'btn',
                  showFilters ? 'btn-primary' : 'btn-outline',
                  'whitespace-nowrap'
                )}
              >
                ⚙️ Filters
                {activeFilterCount > 0 && (
                  <span className="badge badge-secondary ml-2">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
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
                      value={filters.fuelType}
                      onChange={(e) =>
                        handleFilterChange(
                          'fuelType',
                          e.target.value as keyof FuelPrices | 'all'
                        )
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
                      value={filters.brand}
                      onChange={(e) =>
                        handleFilterChange('brand', e.target.value)
                      }
                      className="input w-full"
                    >
                      <option value="all">
                        All Brands ({metadata.brands.length})
                      </option>
                      {metadata.brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
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
                      value={filters.suburb}
                      onChange={(e) =>
                        handleFilterChange('suburb', e.target.value)
                      }
                      className="input w-full"
                    >
                      <option value="all">
                        All Suburbs ({metadata.suburbs.length})
                      </option>
                      {metadata.suburbs.map((suburb) => (
                        <option key={suburb} value={suburb}>
                          {suburb}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <p className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      🔄 Sort By
                    </p>
                    <SortDropdown
                      value={filters.sortBy}
                      onChange={(value) => handleFilterChange('sortBy', value)}
                      syncWithUrl={true}
                    />
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
                    value={filters.priceMax}
                    onChange={(e) =>
                      handleFilterChange('priceMax', e.target.value)
                    }
                    className="input max-w-xs"
                  />
                </div>

                {/* Filter Actions */}
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <button
                    onClick={clearFilters}
                    className="btn-ghost btn-sm btn"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="btn-primary btn-sm btn"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className={patterns.container()}>
          {/* Quick Sort Bar */}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <QuickSortBar
              sortValue={filters.sortBy}
              onSortChange={(value) => handleFilterChange('sortBy', value)}
              totalResults={filteredStations.length}
              currentPage={currentPage}
              totalPages={totalPages}
              syncWithUrl={true}
            />
          </div>

          {/* Station Grid */}
          {filteredStations.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className={patterns.text.h3}>No stations found</h3>
              <p className={patterns.text.body + ' mb-6 mt-2'}>
                Try adjusting your filters or search criteria
              </p>
              <button onClick={clearFilters} className="btn-primary btn">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={patterns.grid(4, 'md')}>
                {paginatedStations.map((station) => {
                  const brandInfo = getBrandInfo(station.brand);
                  const brandClass = getBrandClass(station.brand);

                  return (
                    <article
                      key={station.id}
                      className="card card-hover print-avoid-break flex h-full flex-col overflow-hidden"
                      itemScope
                      itemType="https://schema.org/GasStation"
                    >
                      {/* Brand Header with Logo */}
                      <div
                        className={cn(
                          'relative flex h-20 flex-shrink-0 items-center justify-center sm:h-24',
                          'bg-gradient-to-br from-gray-50 to-gray-100',
                          'dark:from-gray-800 dark:to-gray-900',
                          brandClass
                        )}
                        style={{
                          background: `linear-gradient(135deg, ${brandInfo.color}15 0%, ${brandInfo.fallback}05 100%)`,
                        }}
                      >
                        <div className="relative h-12 w-24 sm:h-16 sm:w-32">
                          <Image
                            src={brandInfo.logo}
                            alt={`${brandInfo.name} logo`}
                            fill
                            className="object-contain"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              // Fallback to default logo
                              (e.currentTarget as HTMLImageElement).src =
                                '/images/brands/default-logo.svg';
                            }}
                          />
                        </div>
                        {station.verified && (
                          <div className="absolute right-1.5 top-1.5 rounded-full bg-white p-0.5 shadow-sm dark:bg-gray-800 sm:right-2 sm:top-2 sm:p-1">
                            <span
                              className="text-sm text-success-600 sm:text-lg"
                              title="Verified"
                            >
                              ✓
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Station Info */}
                      <div className="flex-shrink-0 border-b border-gray-200 p-4 dark:border-gray-700 sm:p-5 lg:p-6">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h3
                            className="text-base font-bold leading-tight text-gray-900 dark:text-white sm:text-lg"
                            itemProp="name"
                          >
                            {station.name}
                          </h3>
                        </div>
                        <span className={cn('badge text-xs', brandClass)}>
                          {station.brand}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-grow space-y-3 p-4 sm:space-y-4 sm:p-5 lg:p-6">
                        <div
                          className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm"
                          itemProp="address"
                          itemScope
                          itemType="https://schema.org/PostalAddress"
                        >
                          <p itemProp="streetAddress">📍 {station.address}</p>
                          <p className="mt-1">
                            <span itemProp="addressLocality">
                              {station.suburb}
                            </span>{' '}
                            <span itemProp="postalCode">
                              {station.postcode}
                            </span>
                          </p>
                        </div>

                        {/* Fuel Prices */}
                        <div>
                          <h4 className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300 sm:text-sm">
                            Current Prices
                          </h4>
                          <div className="space-y-1.5 sm:space-y-2">
                            {Object.entries(station.fuelPrices).map(
                              ([type, price]) => {
                                if (price === null) return null;
                                const isSelected = type === filters.fuelType;
                                return (
                                  <div
                                    key={type}
                                    className={cn(
                                      'flex items-center justify-between',
                                      isSelected && 'font-semibold'
                                    )}
                                  >
                                    <span className="text-xs capitalize text-gray-600 dark:text-gray-400 sm:text-sm">
                                      {type === 'premium95'
                                        ? 'Premium 95'
                                        : type === 'premium98'
                                          ? 'Premium 98'
                                          : type}
                                    </span>
                                    <span
                                      className={cn(
                                        'text-sm font-bold sm:text-lg',
                                        getPriceColor(price)
                                      )}
                                    >
                                      {price.toFixed(1)}¢
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Updated:{' '}
                          {new Date(station.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="print-hidden flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700 sm:p-5 lg:p-6">
                        <a
                          href={`https://www.google.com/maps/search/${encodeURIComponent(station.address + ' ' + station.suburb)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary btn-sm btn w-full text-xs sm:text-sm"
                        >
                          🧭 Get Directions
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="print-hidden mt-8 flex items-center justify-center gap-2 sm:mt-10 lg:mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn-outline btn-sm btn"
                    aria-label="Previous page"
                  >
                    ← Previous
                  </button>

                  <div className="flex gap-1 sm:gap-2">
                    {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                      let page: number;
                      if (totalPages <= 7) {
                        page = i + 1;
                      } else if (currentPage <= 4) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + i;
                      } else {
                        page = currentPage - 3 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            'btn-sm btn',
                            currentPage === page ? 'btn-primary' : 'btn-ghost'
                          )}
                          aria-label={`Page ${page}`}
                          aria-current={
                            currentPage === page ? 'page' : undefined
                          }
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="btn-outline btn-sm btn"
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* SEO Content */}
              <div className="prose dark:prose-invert mt-16 max-w-none">
                <h2>Melbourne Petrol Station Directory</h2>
                <p>
                  Find the cheapest fuel prices across Melbourne with our
                  comprehensive directory of {metadata.totalStations}+ petrol
                  stations. Compare prices from major brands including BP,
                  Shell, Caltex, 7-Eleven, and independent operators across{' '}
                  {metadata.suburbs.length}+ suburbs.
                </p>
                <h3>Why Use Our Directory?</h3>
                <ul>
                  <li>Real-time fuel price comparisons</li>
                  <li>Filter by fuel type, brand, and location</li>
                  <li>Find stations in your suburb or along your route</li>
                  <li>Save money on every fill-up</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
