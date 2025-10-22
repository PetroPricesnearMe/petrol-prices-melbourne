/**
 * Station Directory Client Component
 * Interactive directory with filtering, search, and pagination
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn, patterns, animations } from '@/styles/system/css-in-js';

// Mock data - replace with actual API call
const mockStations = [
  {
    id: 1,
    name: 'Shell Coles Express',
    brand: 'Shell',
    address: '123 Main St, Melbourne VIC 3000',
    city: 'Melbourne',
    region: 'CBD',
    latitude: -37.8136,
    longitude: 144.9631,
    fuelPrices: [
      { type: 'Unleaded', price: 1.85 },
      { type: 'Diesel', price: 1.75 },
      { type: 'Premium', price: 1.95 },
    ],
    distance: 2.5,
  },
  // Add more mock stations as needed
];

interface SearchFilters {
  search: string;
  fuelType: string;
  brand: string;
  region: string;
  sortBy: string;
  minPrice: string;
  maxPrice: string;
}

export function StationDirectoryClient() {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    fuelType: 'all',
    brand: 'all',
    region: 'all',
    sortBy: 'distance',
    minPrice: '',
    maxPrice: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  // Fetch stations
  const { data: stations = mockStations, isLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      // Replace with actual API call
      return mockStations;
    },
  });

  // Filter and sort stations
  const filteredStations = useMemo(() => {
    let result = [...stations];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.address.toLowerCase().includes(search) ||
          s.city.toLowerCase().includes(search)
      );
    }

    // Fuel type filter
    if (filters.fuelType !== 'all') {
      result = result.filter((s) =>
        s.fuelPrices.some((p) => p.type.toLowerCase() === filters.fuelType.toLowerCase())
      );
    }

    // Brand filter
    if (filters.brand !== 'all') {
      result = result.filter((s) => s.brand.toLowerCase() === filters.brand.toLowerCase());
    }

    // Region filter
    if (filters.region !== 'all') {
      result = result.filter((s) => s.region === filters.region);
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      const min = parseFloat(filters.minPrice) || 0;
      const max = parseFloat(filters.maxPrice) || Infinity;
      result = result.filter((s) => {
        const prices = s.fuelPrices.map((p) => p.price);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        return avgPrice >= min && avgPrice <= max;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'price-low':
          const avgA = a.fuelPrices.reduce((sum, p) => sum + p.price, 0) / a.fuelPrices.length;
          const avgB = b.fuelPrices.reduce((sum, p) => sum + p.price, 0) / b.fuelPrices.length;
          return avgA - avgB;
        case 'price-high':
          const avgA2 = a.fuelPrices.reduce((sum, p) => sum + p.price, 0) / a.fuelPrices.length;
          const avgB2 = b.fuelPrices.reduce((sum, p) => sum + p.price, 0) / b.fuelPrices.length;
          return avgB2 - avgA2;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [stations, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      fuelType: 'all',
      brand: 'all',
      region: 'all',
      sortBy: 'distance',
      minPrice: '',
      maxPrice: '',
    });
  }, []);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value && value !== 'all' && value !== 'distance' && key !== 'sortBy'
  ).length;

  if (isLoading) {
    return (
      <div className={patterns.container()}>
        <div className="py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-primary text-white py-12 print-hidden">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <h1 className={cn(patterns.text.h1, 'text-white mb-4 text-center')}>
              Melbourne Petrol Stations Directory
            </h1>
            <p className={cn(patterns.text.body, 'text-white/90 text-center max-w-2xl')}>
              Browse {stations.length}+ stations with live fuel prices. Find the cheapest petrol
              near you.
            </p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 print-hidden">
        <div className={patterns.container()}>
          <div className="py-6 space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[280px]">
                <input
                  type="search"
                  placeholder="Search stations, addresses, suburbs..."
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
              <div
                className={cn(
                  'bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4',
                  animations.safe('animate-slide-down')
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Fuel Type */}
                  <div>
                    <label htmlFor="fuel-type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ⛽ Fuel Type
                    </label>
                    <select
                      id="fuel-type-filter"
                      value={filters.fuelType}
                      onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                      className="input w-full"
                    >
                      <option value="all">All Types</option>
                      <option value="unleaded">Unleaded</option>
                      <option value="diesel">Diesel</option>
                      <option value="premium">Premium</option>
                      <option value="lpg">LPG</option>
                    </select>
                  </div>

                  {/* Brand */}
                  <div>
                    <label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🏪 Brand
                    </label>
                    <select
                      id="brand-filter"
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="input w-full"
                    >
                      <option value="all">All Brands</option>
                      <option value="shell">Shell</option>
                      <option value="bp">BP</option>
                      <option value="7-eleven">7-Eleven</option>
                      <option value="caltex">Caltex</option>
                    </select>
                  </div>

                  {/* Region */}
                  <div>
                    <label htmlFor="region-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📍 Region
                    </label>
                    <select
                      id="region-filter"
                      value={filters.region}
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                      className="input w-full"
                    >
                      <option value="all">All Regions</option>
                      <option value="CBD">CBD</option>
                      <option value="North">North Melbourne</option>
                      <option value="South">South Melbourne</option>
                      <option value="East">East Melbourne</option>
                      <option value="West">West Melbourne</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label htmlFor="sort-by-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🔄 Sort By
                    </label>
                    <select
                      id="sort-by-filter"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="input w-full"
                    >
                      <option value="distance">Distance</option>
                      <option value="price-low">Price (Low to High)</option>
                      <option value="price-high">Price (High to Low)</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    💰 Price Range
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      step="0.01"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="input flex-1"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      step="0.01"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="input flex-1"
                    />
                  </div>
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
          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              Showing <strong>{paginatedStations.length}</strong> of{' '}
              <strong>{filteredStations.length}</strong> stations
            </p>
          </div>

          {/* Station Grid */}
          {paginatedStations.length === 0 ? (
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
            <div className={patterns.grid(3, 'lg')}>
              {paginatedStations.map((station, index) => (
                <div
                  key={station.id}
                  className={cn(
                    'card-hover print-avoid-break',
                    animations.safe('animate-fade-in')
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Header */}
                  <div className={patterns.flex.between + ' p-6 border-b border-gray-200 dark:border-gray-700'}>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {station.name}
                      </h3>
                      {station.brand && (
                        <span className="badge badge-primary">{station.brand}</span>
                      )}
                    </div>
                    {station.distance && (
                      <span className="badge badge-secondary">{station.distance.toFixed(1)} km</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>📍 {station.address}</p>
                      <p className="mt-1">{station.city}</p>
                    </div>

                    {/* Fuel Prices */}
                    {station.fuelPrices.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Current Prices
                        </h4>
                        <div className="space-y-2">
                          {station.fuelPrices.map((price, i) => (
                            <div key={i} className={patterns.flex.between}>
                              <span className="text-gray-600 dark:text-gray-400">{price.type}</span>
                              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                ${price.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700 print-hidden">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full"
                    >
                      🧭 Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 print-hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline"
              >
                ← Previous
              </button>

              <div className="flex gap-2">
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'btn',
                        currentPage === page ? 'btn-primary' : 'btn-ghost'
                      )}
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
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
