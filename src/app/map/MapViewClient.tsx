/**
 * MapView Client Component
 * Interactive map with search, filtering, and station management
 * Features:
 * - Mapbox integration with clustering
 * - Search and filter integration
 * - Station selection and popovers
 * - Mobile responsive design
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';

import { MapView } from '@/components/molecules/MapView/MapView';
import { SortDropdown, type SortOption } from '@/components/molecules/SortDropdown';
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
  latitude: number;
  longitude: number;
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

export function MapViewClient({ initialStations, metadata }: Props) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    fuelType: 'all',
    brand: 'all',
    suburb: 'all',
    sortBy: 'price-low',
    priceMax: '',
  });
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mapView, setMapView] = useState<'map' | 'list'>('map');

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

    // Fuel type filter (only apply if a specific fuel type is selected)
    if (filters.fuelType !== 'all') {
      result = result.filter((s) => s.fuelPrices[filters.fuelType as keyof FuelPrices] !== null);
    }

    // Max price filter
    if (filters.priceMax) {
      const maxPrice = parseFloat(filters.priceMax);
      if (filters.fuelType !== 'all') {
        result = result.filter((s) => {
          const price = s.fuelPrices[filters.fuelType as keyof FuelPrices];
          return price !== null && price <= maxPrice;
        });
      } else {
        // If 'all' is selected, check all fuel types
        result = result.filter((s) => {
          const prices = Object.values(s.fuelPrices).filter(p => p !== null) as number[];
          return prices.length > 0 && Math.min(...prices) <= maxPrice;
        });
      }
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low': {
          if (filters.fuelType !== 'all') {
            const priceA = a.fuelPrices[filters.fuelType as keyof FuelPrices] || Infinity;
            const priceB = b.fuelPrices[filters.fuelType as keyof FuelPrices] || Infinity;
            return priceA - priceB;
          } else {
            // If 'all' is selected, use minimum price across all fuel types
            const pricesA = Object.values(a.fuelPrices).filter(p => p !== null) as number[];
            const pricesB = Object.values(b.fuelPrices).filter(p => p !== null) as number[];
            const minPriceA = pricesA.length > 0 ? Math.min(...pricesA) : Infinity;
            const minPriceB = pricesB.length > 0 ? Math.min(...pricesB) : Infinity;
            return minPriceA - minPriceB;
          }
        }
        case 'price-high': {
          if (filters.fuelType !== 'all') {
            const priceA = a.fuelPrices[filters.fuelType] || 0;
            const priceB = b.fuelPrices[filters.fuelType] || 0;
            return priceB - priceA;
          } else {
            // If 'all' is selected, use minimum price across all fuel types
            const pricesA = Object.values(a.fuelPrices).filter(p => p !== null) as number[];
            const pricesB = Object.values(b.fuelPrices).filter(p => p !== null) as number[];
            const minPriceA = pricesA.length > 0 ? Math.min(...pricesA) : 0;
            const minPriceB = pricesB.length > 0 ? Math.min(...pricesB) : 0;
            return minPriceB - minPriceA;
          }
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

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      fuelType: 'all',
      brand: 'all',
      suburb: 'all',
      sortBy: 'price-low',
      priceMax: '',
    });
  }, []);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value && value !== 'all' && value !== 'price-low' && key !== 'sortBy' && key !== 'fuelType'
  ).length;

  const handleStationSelect = useCallback((station: Station) => {
    setSelectedStation(station);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-primary text-white py-8 print-hidden">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <h1 className={cn(patterns.text.h1, 'text-white mb-4 text-center')}>
              Melbourne Petrol Stations Map
            </h1>
            <p className={cn(patterns.text.body, 'text-white/90 text-center max-w-2xl mb-6')}>
              Explore {metadata.totalStations}+ stations across {metadata.suburbs.length}+ suburbs on our interactive map
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

      {/* Controls */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 print-hidden sticky top-0 z-10 shadow-sm">
        <div className={patterns.container()}>
          <div className="py-4 space-y-4">
            {/* View Toggle */}
            <div className="flex gap-4 flex-wrap items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMapView('map')}
                  className={cn(
                    'btn btn-sm',
                    mapView === 'map' ? 'btn-primary' : 'btn-outline'
                  )}
                >
                  🗺️ Map View
                </button>
                <button
                  onClick={() => setMapView('list')}
                  className={cn(
                    'btn btn-sm',
                    mapView === 'list' ? 'btn-primary' : 'btn-outline'
                  )}
                >
                  📋 List View
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredStations.length} station{filteredStations.length !== 1 ? 's' : ''} found
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'btn btn-sm',
                    showFilters ? 'btn-primary' : 'btn-outline'
                  )}
                >
                  ⚙️ Filters
                  {activeFilterCount > 0 && (
                    <span className="badge badge-secondary ml-2">{activeFilterCount}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                      <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🔍 Search
                      </label>
                      <input
                        id="search"
                        type="text"
                        placeholder="Search stations..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="input w-full"
                      />
                    </div>

                    {/* Fuel Type */}
                    <div>
                      <label htmlFor="fuel-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ⛽ Fuel Type
                      </label>
                      <select
                        id="fuel-type"
                        value={filters.fuelType}
                        onChange={(e) => handleFilterChange('fuelType', e.target.value)}
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
                      <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🏪 Brand
                      </label>
                      <select
                        id="brand"
                        value={filters.brand}
                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                        className="input w-full"
                      >
                        <option value="all">All Brands</option>
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
                        <option value="all">All Suburbs</option>
                        {metadata.suburbs.map((suburb) => (
                          <option key={suburb} value={suburb}>
                            {suburb}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sort */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🔄 Sort By
                      </label>
                      <SortDropdown
                        value={filters.sortBy}
                        onChange={(value) => handleFilterChange('sortBy', value)}
                        syncWithUrl={false}
                      />
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
                        className="input w-full"
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Map/List View */}
      <section className="flex-1">
        {mapView === 'map' ? (
          <div className="h-[calc(100vh-200px)] min-h-[500px]">
            <MapView
              stations={filteredStations}
              selectedStation={selectedStation}
              onStationSelect={handleStationSelect}
              showClustering={true}
              defaultZoom={10}
              defaultCenter={[144.9631, -37.8136]}
            />
          </div>
        ) : (
          <div className="py-8">
            <div className={patterns.container()}>
              <div className={patterns.grid(4, 'md')}>
                {filteredStations.map((station) => (
                  <div
                    key={station.id}
                    className="card card-hover cursor-pointer"
                    onClick={() => handleStationSelect(station)}
                  >
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                        {station.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {station.brand} • {station.suburb}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {station.address}
                      </p>
                      {filters.fuelType !== 'all' && station.fuelPrices[filters.fuelType as keyof FuelPrices] ? (
                        <div className="mt-2">
                          <span className="text-lg font-bold text-green-600">
                            {station.fuelPrices[filters.fuelType as keyof FuelPrices]?.toFixed(1)}¢/L
                          </span>
                        </div>
                      ) : filters.fuelType === 'all' ? (
                        <div className="mt-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Multiple fuel types available
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default MapViewClient;
