/**
 * Enhanced Station Directory with Map Integration
 *
 * Features:
 * - Toggle between List, Grid, and Map views
 * - Interactive map with clustering
 * - Full-screen map support
 * - Color-coded pins based on fuel prices
 * - Responsive design for all devices
 */

'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useMemo, useEffect } from 'react';

import {
  SortDropdown,
  QuickSortBar,
  type SortOption,
} from '@/components/molecules/SortDropdown';
import { cn, patterns } from '@/styles/system/css-in-js';

// Dynamically import map components to avoid SSR issues
const InteractiveStationMap = dynamic(
  () => import('@/components/InteractiveStationMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />
    ),
  }
);

const ViewToggle = dynamic(() => import('@/components/ViewToggle'), {
  ssr: false,
});

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
  category?: string;
  latitude: number | null;
  longitude: number | null;
  fuelPrices: FuelPrices;
  amenities?: any;
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

type ViewMode = 'list' | 'grid' | 'map';

const ITEMS_PER_PAGE = 24;

export function StationDirectoryWithMap({ initialStations, metadata }: Props) {
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
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<any>(null);

  // Filter and sort stations
  const filteredStations = useMemo(() => {
    let result = [...initialStations];

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
        // Only show stations with selected fuel type when price sorting/filtering is active
        result = result.filter((s) => s.fuelPrices[filters.fuelType] !== null);
      }
    }

    // Max price filter
    if (filters.priceMax && filters.fuelType !== 'all') {
      const maxPrice = parseFloat(filters.priceMax);
      result = result.filter((s) => {
        const price = s.fuelPrices[filters.fuelType];
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
  }, [initialStations, filters]);

  // Filter stations with valid coordinates for map
  const mapStations = useMemo(() => {
    return filteredStations.filter((s) => s.latitude && s.longitude);
  }, [filteredStations]);

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
      fuelType: 'unleaded',
      brand: 'all',
      suburb: 'all',
      sortBy: 'price-low',
      priceMax: '',
    });
    setCurrentPage(1);
  }, []);

  const handleStationClick = useCallback((station: Record<string, unknown>) => {
    setSelectedStation(station);
    console.log('Station clicked:', station);
  }, []);

  const handleMapFullScreenToggle = useCallback(() => {
    setIsMapFullScreen((prev) => !prev);
  }, []);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) =>
      value &&
      value !== 'all' &&
      value !== 'unleaded' &&
      value !== 'price-low' &&
      key !== 'sortBy' &&
      key !== 'fuelType'
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

      {/* Filters & View Toggle */}
      <section className="print-hidden sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className={patterns.container()}>
          <div className="space-y-4 py-6">
            {/* Search Bar & View Toggle */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="min-w-[280px] flex-1">
                <input
                  type="search"
                  placeholder="Search by station name, address, or suburb..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input w-full"
                  aria-label="Search stations"
                />
              </div>

              <ViewToggle
                currentView={viewMode}
                onViewChange={setViewMode}
                showGrid={true}
                size="md"
              />

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
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      🔄 Sort By
                    </label>
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
        {/* Map View */}
        {viewMode === 'map' && (
          <div className={isMapFullScreen ? '' : patterns.container()}>
            {!isMapFullScreen && (
              <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="mb-1 font-bold">🗺️ Interactive Map View</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {mapStations.length} stations with location data
                    </p>
                  </div>
                  {selectedStation && (
                    <div className="badge badge-primary">
                      Selected: {selectedStation.name}
                    </div>
                  )}
                </div>
              </div>
            )}

            <InteractiveStationMap
              stations={mapStations}
              onStationClick={handleStationClick}
              selectedStation={selectedStation}
              height={isMapFullScreen ? '100vh' : 600}
              fullScreen={isMapFullScreen}
              onFullScreenToggle={handleMapFullScreenToggle}
              showUserLocation={true}
              center={[-37.8136, 144.9631]}
              zoom={11}
            />
          </div>
        )}

        {/* Grid/List Views */}
        {viewMode !== 'map' && (
          <div className={patterns.container()}>
            {/* Quick Sort Bar */}
            <div className="mb-6">
              <QuickSortBar
                sortValue={filters.sortBy}
                onSortChange={(value) => handleFilterChange('sortBy', value)}
                totalResults={filteredStations.length}
                currentPage={currentPage}
                totalPages={totalPages}
                syncWithUrl={true}
              />
            </div>

            {/* Station Grid/List */}
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
                <div
                  className={cn(
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'space-y-4'
                  )}
                >
                  {paginatedStations.map((station) => (
                    <article
                      key={station.id}
                      className="card card-hover print-avoid-break"
                      itemScope
                      itemType="https://schema.org/GasStation"
                    >
                      {/* Header */}
                      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h3
                            className="text-lg font-bold text-gray-900 dark:text-white"
                            itemProp="name"
                          >
                            {station.name}
                          </h3>
                          {station.verified && (
                            <span className="text-success-600" title="Verified">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="badge badge-primary">
                          {station.brand}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-4 p-6">
                        <div
                          className="text-sm text-gray-600 dark:text-gray-400"
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
                          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Current Prices
                          </h4>
                          <div className="space-y-2">
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
                                    <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                                      {type === 'premium95'
                                        ? 'Premium 95'
                                        : type === 'premium98'
                                          ? 'Premium 98'
                                          : type}
                                    </span>
                                    <span
                                      className={cn(
                                        'text-lg font-bold',
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
                      <div className="print-hidden flex gap-2 border-t border-gray-200 p-6 dark:border-gray-700">
                        {station.latitude && station.longitude && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedStation(station);
                                setViewMode('map');
                              }}
                              className="btn-outline btn-sm btn flex-1"
                            >
                              🗺️ Map
                            </button>
                            <a
                              href={`https://www.google.com/maps/search/${encodeURIComponent(station.address + ' ' + station.suburb)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary btn-sm btn flex-1"
                            >
                              🧭 Directions
                            </a>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="print-hidden mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn-outline btn"
                      aria-label="Previous page"
                    >
                      ← Previous
                    </button>

                    <div className="flex gap-2">
                      {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                        let page;
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
                              'btn',
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
                      className="btn-outline btn"
                      aria-label="Next page"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
