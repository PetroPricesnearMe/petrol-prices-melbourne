/**
 * MapView Client Component - SEO Pillar Page
 * Interactive map with search, filtering, and station management
 * Features:
 * - Mapbox integration with clustering
 * - Search and filter integration
 * - Station selection and popovers
 * - Mobile responsive design
 * - SEO-optimized pillar page structure
 * - Live fuel price snapshots
 * - Suburb quick links for internal linking
 * - FAQ section with JSON-LD schema
 * - Internal linking hub
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useCallback, useMemo } from 'react';

import {
  SortDropdown,
  type SortOption,
} from '@/components/molecules/SortDropdown';
import { getStationUrl } from '@/lib/seo/station-seo';
import { cn, patterns } from '@/styles/system/css-in-js';

// Lazy load heavy MapView component (maplibre-gl is ~200KB+)
const MapView = dynamic(
  () =>
    import('@/components/molecules/MapView/MapViewMapLibre').then((mod) => ({
      default: mod.MapView,
    })),
  {
    ssr: false, // Maps don't need SSR
    loading: () => <MapViewSkeleton />,
  }
);

// Lazy load SEO sections for performance
const LiveFuelPriceSnapshot = dynamic(
  () =>
    import('@/components/map/LiveFuelPriceSnapshot').then((mod) => ({
      default: mod.LiveFuelPriceSnapshot,
    })),
  { ssr: true }
);

const SuburbQuickLinks = dynamic(
  () =>
    import('@/components/map/SuburbQuickLinks').then((mod) => ({
      default: mod.SuburbQuickLinks,
    })),
  { ssr: true }
);

const MapFAQs = dynamic(
  () =>
    import('@/components/map/MapFAQs').then((mod) => ({
      default: mod.MapFAQs,
    })),
  { ssr: true }
);

const InternalLinkingHub = dynamic(
  () =>
    import('@/components/map/InternalLinkingHub').then((mod) => ({
      default: mod.InternalLinkingHub,
    })),
  { ssr: true }
);

const LocationToggle = dynamic(
  () =>
    import('@/components/map/LocationToggle').then((mod) => ({
      default: mod.LocationToggle,
    })),
  { ssr: false }
);

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
  fuelType: keyof FuelPrices;
  brand: string;
  suburb: string;
  sortBy: SortOption;
  priceMax: string;
}

export function MapViewClient({ initialStations, metadata }: Props) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    fuelType: 'unleaded',
    brand: 'all',
    suburb: 'all',
    sortBy: 'name',
    priceMax: '',
  });
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mapView, setMapView] = useState<'map' | 'list'>('map');
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    144.9631, -37.8136,
  ]);
  const [mapZoom, setMapZoom] = useState(10);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

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

    // ONLY filter by fuel type when user is actively sorting by price or filtering by max price
    // This ensures all stations show by default instead of just those with the selected fuel type
    const isPriceSorting =
      filters.sortBy === 'price-low' || filters.sortBy === 'price-high';
    const hasPriceFilter = filters.priceMax !== '';

    if (isPriceSorting || hasPriceFilter) {
      // Only show stations with selected fuel type when price sorting/filtering is active
      result = result.filter((s) => s.fuelPrices[filters.fuelType] !== null);
    }

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

  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      fuelType: 'unleaded',
      brand: 'all',
      suburb: 'all',
      sortBy: 'name',
      priceMax: '',
    });
  }, []);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) =>
      value &&
      value !== 'all' &&
      value !== 'unleaded' &&
      value !== 'name' &&
      key !== 'sortBy' &&
      key !== 'fuelType'
  ).length;

  const handleStationSelect = useCallback((station: Station) => {
    setSelectedStation(station);
  }, []);

  const handleUseLocation = useCallback(() => {
    setIsLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([longitude, latitude]);
          setMapZoom(14);
          setIsLocationLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocationLoading(false);
        }
      );
    } else {
      setIsLocationLoading(false);
    }
  }, []);

  const handleSearchSuburb = useCallback(
    (query: string) => {
      // Find suburb in metadata
      const matchingSuburb = metadata.suburbs.find(
        (s) =>
          s.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase().includes(s.toLowerCase())
      );

      if (matchingSuburb) {
        setFilters((prev) => ({ ...prev, suburb: matchingSuburb }));
        // Find a station in that suburb to center map
        const stationInSuburb = initialStations.find(
          (s) => s.suburb === matchingSuburb
        );
        if (stationInSuburb) {
          setMapCenter([stationInSuburb.longitude, stationInSuburb.latitude]);
          setMapZoom(13);
        }
      } else {
        // Try to find by postcode
        const stationByPostcode = initialStations.find(
          (s) => s.postcode === query
        );
        if (stationByPostcode) {
          setMapCenter([
            stationByPostcode.longitude,
            stationByPostcode.latitude,
          ]);
          setMapZoom(13);
          setFilters((prev) => ({ ...prev, suburb: stationByPostcode.suburb }));
        }
      }
    },
    [initialStations, metadata.suburbs]
  );

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <nav className="print-hidden border-b border-gray-200 bg-gray-100 py-2 dark:border-gray-700 dark:bg-gray-800">
        <div className={patterns.container()}>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-primary-600 dark:hover:text-primary-400"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">
              Cheapest Petrol Near Me – Melbourne Fuel Price Map
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section - SEO Optimized */}
      <header className="print-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-12 text-white">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            {/* SEO: Updated H1 with "near me" keywords */}
            <h1
              className={cn(
                patterns.text.h1,
                'mb-4 max-w-4xl text-center text-white'
              )}
            >
              Live Petrol Prices Near Me (Updated Today)
            </h1>
            {/* SEO: Updated H2 with "near me" keywords */}
            <h2 className="mb-6 max-w-3xl text-center text-xl font-normal text-white/90 md:text-2xl">
              Find cheap petrol near me with live prices updated daily. Compare
              cheap fuel near me from {metadata.totalStations}+ petrol stations
              across {metadata.suburbs.length}+ suburbs. Petrol prices near me,
              fuel prices near me, cheap petrol near me.
            </h2>

            {/* Location Toggle */}
            <div className="mb-6 w-full max-w-2xl">
              <LocationToggle
                onUseLocation={handleUseLocation}
                onSearchSuburb={handleSearchSuburb}
                isLocationLoading={isLocationLoading}
              />
            </div>

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

      {/* Controls */}
      <section className="print-hidden sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className={patterns.container()}>
          <div className="space-y-4 py-4">
            {/* View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMapView('map')}
                  className={cn(
                    'btn-sm btn',
                    mapView === 'map' ? 'btn-primary' : 'btn-outline'
                  )}
                >
                  🗺️ Map View
                </button>
                <button
                  onClick={() => setMapView('list')}
                  className={cn(
                    'btn-sm btn',
                    mapView === 'list' ? 'btn-primary' : 'btn-outline'
                  )}
                >
                  📋 List View
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredStations.length} station
                  {filteredStations.length !== 1 ? 's' : ''} found
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'btn-sm btn',
                    showFilters ? 'btn-primary' : 'btn-outline'
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
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden rounded-xl bg-gray-50 p-6 dark:bg-gray-900"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Search */}
                    <div>
                      <label
                        htmlFor="search"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        🔍 Search
                      </label>
                      <input
                        id="search"
                        type="text"
                        placeholder="Search stations..."
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange('search', e.target.value)
                        }
                        className="input w-full"
                      />
                    </div>

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
                            e.target.value as keyof FuelPrices
                          )
                        }
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
                        <option value="all">All Suburbs</option>
                        {metadata.suburbs.map((suburb) => (
                          <option key={suburb} value={suburb}>
                            {suburb}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Sort */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        🔄 Sort By
                      </label>
                      <SortDropdown
                        value={filters.sortBy}
                        onChange={(value) =>
                          handleFilterChange('sortBy', value)
                        }
                        syncWithUrl={false}
                      />
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
                        className="input w-full"
                      />
                    </div>
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
              defaultZoom={mapZoom}
              defaultCenter={mapCenter}
            />
          </div>
        ) : (
          <div className="py-8">
            <div className={patterns.container()}>
              <div className={patterns.grid(4, 'md')}>
                {filteredStations.map((station) => (
                  <Link
                    key={station.id}
                    href={getStationUrl(station)}
                    className="card card-hover block h-full cursor-pointer"
                    onClick={() => handleStationSelect(station)}
                  >
                    <div className="p-4">
                      <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                        {station.name}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        {station.brand} • {station.suburb}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {station.address}
                      </p>
                      {station.fuelPrices[filters.fuelType] && (
                        <div className="mt-2">
                          <span className="text-green-600 text-lg font-bold">
                            {station.fuelPrices[filters.fuelType]?.toFixed(1)}
                            ¢/L
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Content Sections - Below the fold, lazy loaded */}

      {/* Section 2: Live Fuel Price Snapshot */}
      <LiveFuelPriceSnapshot stations={initialStations} />

      {/* Section 3: Suburb Quick Links */}
      <SuburbQuickLinks suburbs={metadata.suburbs} maxLinks={50} />

      {/* Section 5: FAQs */}
      <MapFAQs />

      {/* Section 6: Internal Linking Hub */}
      <InternalLinkingHub />
    </div>
  );
}

/**
 * Map View Skeleton - Prevents layout shift while map loads
 */
function MapViewSkeleton() {
  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[500px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
        <svg
          className="h-6 w-6 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      </div>
      <p className="text-base font-medium text-gray-700 dark:text-gray-300">
        Loading interactive map...
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Visualising all Melbourne petrol stations
      </p>
    </div>
  );
}

export default MapViewClient;
