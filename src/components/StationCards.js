import Image from 'next/image';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import dataSourceManager from '../services/DataSourceManager';
import { trackSearch, trackFilter } from '../utils/analytics';

/**
 * Station Cards Component - Fully Responsive with Tailwind CSS
 * Mobile-first approach with fluid typography and touch-friendly interfaces
 *
 * @component
 */
const StationCards = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterSuburb, setFilterSuburb] = useState('all');
  const [filterFuelType, setFilterFuelType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Parse CSV data
  const parseCSV = useCallback((text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line, index) => {
        const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
        const station = {};

        headers.forEach((header, i) => {
          station[header] = values[i] || '';
        });

        // Normalize field names and create fuel prices array
        const fuelPrices = [];

        // Extract fuel prices from various possible columns
        Object.keys(station).forEach((key) => {
          if (key.toLowerCase().includes('price') && station[key]) {
            const fuelType = key.toLowerCase().includes('unleaded')
              ? 'Unleaded'
              : key.toLowerCase().includes('premium')
                ? 'Premium'
                : key.toLowerCase().includes('diesel')
                  ? 'Diesel'
                  : key.toLowerCase().includes('lpg')
                    ? 'LPG'
                    : 'Fuel';

            const price = parseFloat(station[key]);
            if (!isNaN(price) && price > 0) {
              fuelPrices.push({
                type: fuelType,
                price: price,
              });
            }
          }
        });

        return {
          id: index + 1,
          name: station['Station Name'] || station.name || '',
          address: station['Address'] || station.address || '',
          city: station['City'] || station.city || '',
          postalCode: station['Postal Code'] || station.postalCode || '',
          region: station['Region'] || station.region || '',
          brand: station['brand'] || station.Brand || '',
          latitude: parseFloat(station['Latitude'] || station.lat || 0),
          longitude: parseFloat(station['Longitude'] || station.lng || 0),
          category: station['Category'] || station.category || '',
          locationDetails:
            station['Location Details'] || station.locationDetails || '',
          lastUpdated: station['Last Updated'] || new Date().toISOString(),
          fuelPrices:
            fuelPrices.length > 0
              ? fuelPrices
              : [
                  { type: 'Unleaded', price: 0 },
                  { type: 'Premium', price: 0 },
                  { type: 'Diesel', price: 0 },
                ],
        };
      })
      .filter((s) => s.name);
  }, []);

  // Load CSV file from public folder
  const loadCSV = useCallback(async () => {
    try {
      const response = await fetch('/export-Petrol-Stations-Grid-view.csv');
      if (!response.ok) return null;

      const text = await response.text();
      return parseCSV(text);
    } catch (error) {
      console.log('CSV not available, using Baserow API');
      return null;
    }
  }, [parseCSV]);

  // Load stations from Baserow or CSV
  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);

        // Try to load CSV first if available
        const csvData = await loadCSV();
        if (csvData && csvData.length > 0) {
          setStations(csvData);
          return;
        }

        // Fallback to Baserow API
        const data = await dataSourceManager.fetchStations();
        setStations(data);
      } catch (error) {
        console.error('Error loading stations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, [loadCSV]);

  // Get unique filter options dynamically from CSV data
  const brands = useMemo(() => {
    const uniqueBrands = [
      ...new Set(stations.map((s) => s.brand).filter(Boolean)),
    ];
    return ['all', ...uniqueBrands.sort()];
  }, [stations]);

  const regions = useMemo(() => {
    const uniqueRegions = [
      ...new Set(stations.map((s) => s.region).filter(Boolean)),
    ];
    return ['all', ...uniqueRegions.sort()];
  }, [stations]);

  const suburbs = useMemo(() => {
    const uniqueSuburbs = [
      ...new Set(stations.map((s) => s.city).filter(Boolean)),
    ];
    return ['all', ...uniqueSuburbs.sort()];
  }, [stations]);

  const fuelTypes = useMemo(() => {
    const allFuelTypes = stations.flatMap((s) => {
      if (!Array.isArray(s.fuelPrices)) return [];
      return s.fuelPrices
        .filter((f) => f && typeof f === 'object' && f.type)
        .map((f) => f.type);
    });
    const uniqueFuelTypes = [...new Set(allFuelTypes.filter(Boolean))];
    return ['all', ...uniqueFuelTypes.sort()];
  }, [stations]);

  // Filter and search stations
  const filteredStations = useMemo(() => {
    let filtered = [...stations];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (station) =>
          station.name?.toLowerCase().includes(search) ||
          station.address?.toLowerCase().includes(search) ||
          station.city?.toLowerCase().includes(search) ||
          station.brand?.toLowerCase().includes(search) ||
          station.postalCode?.includes(search)
      );
      trackSearch(searchTerm, filtered.length);
    }

    if (filterBrand !== 'all') {
      filtered = filtered.filter((s) => s.brand === filterBrand);
      trackFilter('brand', filterBrand);
    }

    if (filterRegion !== 'all') {
      filtered = filtered.filter((s) => s.region === filterRegion);
      trackFilter('region', filterRegion);
    }

    if (filterSuburb !== 'all') {
      filtered = filtered.filter((s) => s.city === filterSuburb);
      trackFilter('suburb', filterSuburb);
    }

    if (filterFuelType !== 'all') {
      filtered = filtered.filter(
        (s) =>
          Array.isArray(s.fuelPrices) &&
          s.fuelPrices.some((fuel) => fuel && fuel.type === filterFuelType)
      );
      trackFilter('fuelType', filterFuelType);
    }

    return filtered;
  }, [
    stations,
    searchTerm,
    filterBrand,
    filterRegion,
    filterSuburb,
    filterFuelType,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Brand image mapping
  const BRAND_IMAGES = {
    shell: '/images/brands/shell.svg',
    bp: '/images/brands/bp.svg',
    '7-eleven': '/images/brands/7-eleven.svg',
    'seven eleven': '/images/brands/7-eleven.svg',
    mobil: '/images/brands/mobil.svg',
    'coles express': '/images/brands/coles-express.svg',
    united: '/images/brands/united.svg',
    liberty: '/images/brands/liberty.svg',
    apco: '/images/brands/apco.svg',
    caltex: '/images/brands/caltex.svg',
    ampol: '/images/brands/caltex.svg',
    default: '/images/brands/default-logo.svg',
  };

  // Get brand logo
  const getBrandLogo = (brand) => {
    if (!brand) return BRAND_IMAGES.default;
    const brandLower = (typeof brand === 'string' ? brand : '').toLowerCase();

    if (BRAND_IMAGES[brandLower]) return BRAND_IMAGES[brandLower];

    if (brandLower.includes('shell')) return BRAND_IMAGES.shell;
    if (brandLower.includes('bp')) return BRAND_IMAGES.bp;
    if (brandLower.includes('7') || brandLower.includes('seven'))
      return BRAND_IMAGES['7-eleven'];
    if (brandLower.includes('mobil')) return BRAND_IMAGES.mobil;
    if (brandLower.includes('coles')) return BRAND_IMAGES['coles express'];
    if (brandLower.includes('united')) return BRAND_IMAGES.united;
    if (brandLower.includes('liberty')) return BRAND_IMAGES.liberty;
    if (brandLower.includes('apco')) return BRAND_IMAGES.apco;
    if (brandLower.includes('caltex') || brandLower.includes('ampol'))
      return BRAND_IMAGES.caltex;

    return BRAND_IMAGES.default;
  };

  // Format price
  const formatPrice = (price) => {
    if (!price || price === 0) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 sm:p-12">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500 sm:h-16 sm:w-16" />
        <p className="text-base font-medium text-gray-600 sm:text-lg">
          Loading stations...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        {/* Header - Responsive */}
        <header className="mb-8 text-center sm:mb-10 lg:mb-12">
          <h2 className="mb-3 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:mb-4 sm:text-3xl lg:text-4xl xl:text-5xl">
            Melbourne Petrol Stations
          </h2>
          <p className="mx-auto max-w-2xl px-4 text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
            Find the best fuel prices near you •{' '}
            <span className="font-semibold text-primary-600">
              {filteredStations.length}
            </span>{' '}
            stations available
          </p>
        </header>

        {/* Filters - Mobile-First Layout */}
        <div className="shadow-soft mb-6 rounded-2xl border border-gray-200 bg-white/80 p-4 backdrop-blur-xl sm:mb-8 sm:rounded-3xl sm:p-6 lg:mb-10 lg:p-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-5">
            {/* Search Input */}
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
              <label
                htmlFor="search"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-700 sm:mb-2 sm:text-sm"
              >
                🔍 Search
              </label>
              <input
                id="search"
                name="search"
                type="search"
                placeholder="Name, address, suburb..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-h-[44px] w-full touch-manipulation rounded-xl border-2 border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 sm:px-4 sm:py-3 sm:text-base"
              />
            </div>

            {/* Brand Filter */}
            <div className="col-span-1">
              <label
                htmlFor="brand-filter"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-700 sm:mb-2 sm:text-sm"
              >
                🏪 Brand
              </label>
              <select
                id="brand-filter"
                name="brand-filter"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="min-h-[44px] w-full cursor-pointer touch-manipulation rounded-xl border-2 border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 sm:px-4 sm:py-3 sm:text-base"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand === 'all' ? 'All Brands' : brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Suburb Filter */}
            <div className="col-span-1">
              <label
                htmlFor="suburb-filter"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-700 sm:mb-2 sm:text-sm"
              >
                🏘️ Suburb
              </label>
              <select
                id="suburb-filter"
                name="suburb-filter"
                value={filterSuburb}
                onChange={(e) => setFilterSuburb(e.target.value)}
                className="min-h-[44px] w-full cursor-pointer touch-manipulation rounded-xl border-2 border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 sm:px-4 sm:py-3 sm:text-base"
              >
                {suburbs.map((suburb) => (
                  <option key={suburb} value={suburb}>
                    {suburb === 'all' ? 'All Suburbs' : suburb}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel Type Filter */}
            <div className="col-span-1">
              <label
                htmlFor="fuel-filter"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-700 sm:mb-2 sm:text-sm"
              >
                ⛽ Fuel Type
              </label>
              <select
                id="fuel-filter"
                name="fuel-filter"
                value={filterFuelType}
                onChange={(e) => setFilterFuelType(e.target.value)}
                className="min-h-[44px] w-full cursor-pointer touch-manipulation rounded-xl border-2 border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 sm:px-4 sm:py-3 sm:text-base"
              >
                {fuelTypes.map((fuelType) => (
                  <option key={fuelType} value={fuelType}>
                    {fuelType === 'all' ? 'All Fuel Types' : fuelType}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="col-span-1">
              <label
                htmlFor="region-filter"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-700 sm:mb-2 sm:text-sm"
              >
                📍 Region
              </label>
              <select
                id="region-filter"
                name="region-filter"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="min-h-[44px] w-full cursor-pointer touch-manipulation rounded-xl border-2 border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 sm:px-4 sm:py-3 sm:text-base"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards Grid - Responsive Layout */}
        {paginatedStations.length > 0 ? (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:gap-8">
            {paginatedStations.map((station) => {
              const unleadedPrice = Array.isArray(station.fuelPrices)
                ? station.fuelPrices.find(
                    (f) =>
                      f && f.type && f.type.toLowerCase().includes('unleaded')
                  )
                : null;

              const dieselPrice = Array.isArray(station.fuelPrices)
                ? station.fuelPrices.find(
                    (f) =>
                      f && f.type && f.type.toLowerCase().includes('diesel')
                  )
                : null;

              return (
                <article
                  key={station.id}
                  className="shadow-soft hover:shadow-strong group relative flex min-h-[400px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] sm:min-h-[420px] lg:min-h-[440px]"
                >
                  {/* Top Gradient Border */}
                  <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Card Header with Brand Logo */}
                  <header className="relative flex h-24 items-start justify-between border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 sm:h-28 sm:p-5">
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                      {station.brand || 'Independent'}
                    </div>
                    <div className="relative flex h-10 w-16 items-center justify-end sm:h-12 sm:w-20">
                      <img
                        src={getBrandLogo(station.brand)}
                        alt={`${station.brand || 'Station'} logo`}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = '/images/brands/default-logo.svg';
                        }}
                        loading="lazy"
                      />
                    </div>
                  </header>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col space-y-4 p-5 sm:p-6">
                    <div className="space-y-2">
                      <h3 className="line-clamp-2 text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-primary-600 sm:text-xl">
                        {station.name}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
                        {station.address && `${station.address}, `}
                        {station.city && `${station.city} `}
                        {station.postalCode && station.postalCode}
                      </p>
                    </div>

                    {/* Fuel Prices - Touch-Friendly */}
                    <div className="grid flex-1 grid-cols-2 gap-3 sm:gap-4">
                      {/* Unleaded Price */}
                      <div className="from-green-50 border-green-200 hover:border-green-400 relative flex min-h-[100px] touch-manipulation flex-col items-center justify-center rounded-2xl border-2 bg-gradient-to-br to-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="from-green-500 to-green-600 flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white shadow-sm">
                            U
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                            Unleaded
                          </span>
                        </div>
                        <div className="text-green-600 text-xl font-bold sm:text-2xl">
                          {unleadedPrice && unleadedPrice.price
                            ? formatPrice(unleadedPrice.price)
                            : 'N/A'}
                        </div>
                      </div>

                      {/* Diesel Price */}
                      <div className="from-blue-50 border-blue-200 hover:border-blue-400 relative flex min-h-[100px] touch-manipulation flex-col items-center justify-center rounded-2xl border-2 bg-gradient-to-br to-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="from-blue-500 to-blue-600 flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white shadow-sm">
                            D
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                            Diesel
                          </span>
                        </div>
                        <div className="text-blue-600 text-xl font-bold sm:text-2xl">
                          {dieselPrice && dieselPrice.price
                            ? formatPrice(dieselPrice.price)
                            : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions - Touch-Friendly Buttons */}
                    <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                      {station.latitude && station.longitude ? (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-[44px] touch-manipulation items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
                        >
                          <span aria-hidden="true">🧭</span>
                          <span>Directions</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="flex min-h-[44px] cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-300 px-4 py-3 text-sm font-bold text-gray-500"
                        >
                          <span aria-hidden="true">📍</span>
                          <span>No Location</span>
                        </button>
                      )}
                      <button className="flex min-h-[44px] touch-manipulation items-center justify-center gap-2 rounded-xl border-2 border-primary-500 bg-white px-4 py-3 text-sm font-bold text-primary-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 hover:text-white hover:shadow-lg active:scale-95">
                        <span aria-hidden="true">ℹ️</span>
                        <span>More Info</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16 lg:py-20">
            <div className="mb-4 text-6xl sm:mb-6 sm:text-7xl lg:text-8xl">
              🔍
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 sm:mb-3 sm:text-2xl lg:text-3xl">
              No stations found
            </h3>
            <p className="max-w-md text-center text-sm text-gray-600 sm:text-base lg:text-lg">
              Try adjusting your search criteria or filters to find stations
            </p>
          </div>
        )}

        {/* Pagination - Mobile-Friendly */}
        {totalPages > 1 && (
          <nav
            className="mb-6 flex flex-col items-center justify-center gap-4 sm:mb-8 sm:flex-row sm:gap-6"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="min-h-[44px] w-full touch-manipulation rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-600 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 sm:w-auto"
              aria-label="Previous page"
            >
              ← Previous
            </button>

            <span className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 sm:text-base">
              Page{' '}
              <span className="font-bold text-primary-600">{currentPage}</span>{' '}
              of <span className="font-bold">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="min-h-[44px] w-full touch-manipulation rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-600 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 sm:w-auto"
              aria-label="Next page"
            >
              Next →
            </button>
          </nav>
        )}

        {/* Footer Info */}
        <footer className="rounded-2xl border border-gray-200 bg-gray-100 p-4 text-center sm:p-6">
          <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredStations.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-primary-600">
              {filteredStations.length}
            </span>{' '}
            stations
            {(searchTerm ||
              filterBrand !== 'all' ||
              filterRegion !== 'all' ||
              filterSuburb !== 'all' ||
              filterFuelType !== 'all') &&
              ` (filtered from ${stations.length} total)`}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default StationCards;
