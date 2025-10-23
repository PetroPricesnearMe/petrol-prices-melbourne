/**
 * Station Directory Client Component
 * Interactive directory with filtering, search, sorting, and pagination
 * Optimized for performance with virtual scrolling capability
 */

'use client';

import Link from 'next/link';
import { useState, useCallback, useMemo } from 'react';

import { SortDropdown, QuickSortBar, type SortOption } from '@/components/molecules/SortDropdown';
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
  fuelType: keyof FuelPrices;
  brand: string;
  suburb: string;
  sortBy: SortOption;
  priceMax: string;
}

const ITEMS_PER_PAGE = 24;

export function StationDirectoryClient({ initialStations, metadata }: Props) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    fuelType: 'unleaded',
    brand: 'all',
    suburb: 'all',
    sortBy: 'price-low',
    priceMax: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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

    // Price filter (only show stations with selected fuel type)
    result = result.filter((s) => s.fuelPrices[filters.fuelType] !== null);

    // Max price filter
    if (filters.priceMax) {
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
          const priceA = a.fuelPrices[filters.fuelType] || Infinity;
          const priceB = b.fuelPrices[filters.fuelType] || Infinity;
          return priceA - priceB;
        }
        case 'price-high': {
          const priceA = a.fuelPrices[filters.fuelType] || 0;
          const priceB = b.fuelPrices[filters.fuelType] || 0;
          return priceB - priceA;
        }
        case 'suburb':
          return a.suburb.localeCompare(b.suburb) || a.name.localeCompare(b.name);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [initialStations, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE);
  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

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

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value && value !== 'all' && value !== 'unleaded' && value !== 'price-low' && key !== 'sortBy' && key !== 'fuelType'
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
      <header className="bg-gradient-primary text-white py-12 print-hidden">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <h1 className={cn(patterns.text.h1, 'text-white mb-4 text-center')}>
              Melbourne Petrol Stations Directory
            </h1>
            <p className={cn(patterns.text.body, 'text-white/90 text-center max-w-2xl mb-6')}>
              Browse {metadata.totalStations}+ stations across {metadata.suburbs.length}+ suburbs with live fuel prices
            </p>
            <div className="flex gap-4 flex-wrap justify-center text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <strong>{metadata.totalStations}</strong> Total Stations
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <strong>{metadata.suburbs.length}+</strong> Suburbs
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                Average Price: <strong>{metadata.priceRange.unleaded.average}¢/L</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 print-hidden sticky top-0 z-10 shadow-sm">
        <div className={patterns.container()}>
          <div className="py-6 space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[280px]">
                <input
                  type="search"
                  placeholder="Search by station name, address, or suburb..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input w-full"
                  aria-label="Search stations"
                />
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
                  <span className="badge badge-secondary ml-2">{activeFilterCount}</span>
                )}
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Fuel Type */}
                  <div>
                    <label htmlFor="fuel-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ⛽ Fuel Type
                    </label>
                    <select
                      id="fuel-type"
                      value={filters.fuelType}
                      onChange={(e) => handleFilterChange('fuelType', e.target.value as keyof FuelPrices)}
                      className="input w-full"
                    >
                      <option value="unleaded">Unleaded 91</option>
                      <option value="diesel">Diesel</option>
                      <option value="premium95">Premium 95</option>
                      <option value="premium98">Premium 98</option>
                      <option value="lpg">LPG</option>
                    </select>
                  </div>

                  {/* Brand */}
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🏪 Brand
                    </label>
                    <select
                      id="brand"
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="input w-full"
                    >
                      <option value="all">All Brands ({metadata.brands.length})</option>
                      {metadata.brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Suburb */}
                  <div>
                    <label htmlFor="suburb" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📍 Suburb
                    </label>
                    <select
                      id="suburb"
                      value={filters.suburb}
                      onChange={(e) => handleFilterChange('suburb', e.target.value)}
                      className="input w-full"
                    >
                      <option value="all">All Suburbs ({metadata.suburbs.length})</option>
                      {metadata.suburbs.map((suburb) => (
                        <option key={suburb} value={suburb}>
                          {suburb}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  <label htmlFor="price-max" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    💰 Maximum Price (¢/L)
                    </label>
                  <input
                    id="price-max"
                    type="number"
                    placeholder="e.g., 210"
                    step="0.1"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="input max-w-xs"
                  />
                </div>

                {/* Filter Actions */}
                <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
                  <button onClick={clearFilters} className="btn btn-ghost btn-sm">
                    Clear All
                  </button>
                  <button onClick={() => setShowFilters(false)} className="btn btn-primary btn-sm">
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

          {/* Station Grid */}
          {filteredStations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className={patterns.text.h3}>No stations found</h3>
              <p className={patterns.text.body + ' mt-2 mb-6'}>
                Try adjusting your filters or search criteria
              </p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedStations.map((station) => (
                  <article
                    key={station.id}
                    className="card card-hover print-avoid-break"
                    itemScope
                    itemType="https://schema.org/GasStation"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white" itemProp="name">
                          {station.name}
                        </h3>
                        {station.verified && (
                          <span className="text-success-600" title="Verified">✓</span>
                        )}
                      </div>
                      <span className="badge badge-primary">{station.brand}</span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                        <p itemProp="streetAddress">📍 {station.address}</p>
                        <p className="mt-1">
                          <span itemProp="addressLocality">{station.suburb}</span> <span itemProp="postalCode">{station.postcode}</span>
                        </p>
                      </div>

                      {/* Fuel Prices */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Current Prices
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(station.fuelPrices).map(([type, price]) => {
                            if (price === null) return null;
                            const isSelected = type === filters.fuelType;
                            return (
                              <div
                                key={type}
                                className={cn(
                                  'flex justify-between items-center',
                                  isSelected && 'font-semibold'
                                )}
                              >
                                <span className="text-gray-600 dark:text-gray-400 capitalize text-sm">
                                  {type === 'premium95' ? 'Premium 95' : type === 'premium98' ? 'Premium 98' : type}
                                </span>
                                <span className={cn('text-lg font-bold', getPriceColor(price))}>
                                  {price.toFixed(1)}¢
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Updated: {new Date(station.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 print-hidden">
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(station.address + ' ' + station.suburb)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-full btn-sm"
                      >
                        🧭 Get Directions
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2 print-hidden">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-outline"
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
                          aria-current={currentPage === page ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline"
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* SEO Content */}
              <div className="mt-16 prose dark:prose-invert max-w-none">
                <h2>Melbourne Petrol Station Directory</h2>
                <p>
                  Find the cheapest fuel prices across Melbourne with our comprehensive directory of {metadata.totalStations}+ petrol stations.
                  Compare prices from major brands including BP, Shell, Caltex, 7-Eleven, and independent operators across {metadata.suburbs.length}+ suburbs.
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
