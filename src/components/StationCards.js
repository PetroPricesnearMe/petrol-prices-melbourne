import Image from 'next/image';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import dataSourceManager from '../services/DataSourceManager';
import { trackSearch, trackFilter } from '../utils/analytics';
import logger from '../utils/logger';

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
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    return lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const station = {};

        headers.forEach((header, i) => {
          station[header] = values[i] || '';
        });

        // Normalize field names and create fuel prices array
        const fuelPrices = [];

        // Extract fuel prices from various possible columns
        Object.keys(station).forEach(key => {
          if (key.toLowerCase().includes('price') && station[key]) {
            const fuelType = key.toLowerCase().includes('unleaded') ? 'Unleaded' :
              key.toLowerCase().includes('premium') ? 'Premium' :
                key.toLowerCase().includes('diesel') ? 'Diesel' :
                  key.toLowerCase().includes('lpg') ? 'LPG' : 'Fuel';

            const price = parseFloat(station[key]);
            if (!isNaN(price) && price > 0) {
              fuelPrices.push({
                type: fuelType,
                price: price
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
          locationDetails: station['Location Details'] || station.locationDetails || '',
          lastUpdated: station['Last Updated'] || new Date().toISOString(),
          fuelPrices: fuelPrices.length > 0 ? fuelPrices : [
            { type: 'Unleaded', price: 0 },
            { type: 'Premium', price: 0 },
            { type: 'Diesel', price: 0 }
          ]
        };
      })
      .filter(s => s.name);
  }, []);

  // Load CSV file from public folder
  const loadCSV = useCallback(async () => {
    try {
      const response = await fetch('/export-Petrol-Stations-Grid-view.csv');
      if (!response.ok) return null;

      const text = await response.text();
      return parseCSV(text);
    } catch (_error) {
      logger.warn('CSV not available, using Baserow API');
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
        logger.error('Error loading stations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, [loadCSV]);

  // Get unique filter options dynamically from CSV data
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(stations.map(s => s.brand).filter(Boolean))];
    return ['all', ...uniqueBrands.sort()];
  }, [stations]);

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(stations.map(s => s.region).filter(Boolean))];
    return ['all', ...uniqueRegions.sort()];
  }, [stations]);

  const suburbs = useMemo(() => {
    const uniqueSuburbs = [...new Set(stations.map(s => s.city).filter(Boolean))];
    return ['all', ...uniqueSuburbs.sort()];
  }, [stations]);

  const fuelTypes = useMemo(() => {
    const allFuelTypes = stations.flatMap(s => {
      if (!Array.isArray(s.fuelPrices)) return [];
      return s.fuelPrices
        .filter(f => f && typeof f === 'object' && f.type)
        .map(f => f.type);
    });
    const uniqueFuelTypes = [...new Set(allFuelTypes.filter(Boolean))];
    return ['all', ...uniqueFuelTypes.sort()];
  }, [stations]);

  // Filter and search stations
  const filteredStations = useMemo(() => {
    let filtered = [...stations];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(station =>
        station.name?.toLowerCase().includes(search) ||
        station.address?.toLowerCase().includes(search) ||
        station.city?.toLowerCase().includes(search) ||
        station.brand?.toLowerCase().includes(search) ||
        station.postalCode?.includes(search)
      );
      trackSearch(searchTerm, filtered.length);
    }

    if (filterBrand !== 'all') {
      filtered = filtered.filter(s => s.brand === filterBrand);
      trackFilter('brand', filterBrand);
    }

    if (filterRegion !== 'all') {
      filtered = filtered.filter(s => s.region === filterRegion);
      trackFilter('region', filterRegion);
    }

    if (filterSuburb !== 'all') {
      filtered = filtered.filter(s => s.city === filterSuburb);
      trackFilter('suburb', filterSuburb);
    }

    if (filterFuelType !== 'all') {
      filtered = filtered.filter(s =>
        Array.isArray(s.fuelPrices) &&
        s.fuelPrices.some(fuel => fuel && fuel.type === filterFuelType)
      );
      trackFilter('fuelType', filterFuelType);
    }

    return filtered;
  }, [stations, searchTerm, filterBrand, filterRegion, filterSuburb, filterFuelType]);

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Brand image mapping
  const BRAND_IMAGES = {
    'shell': '/images/brands/shell.svg',
    'bp': '/images/brands/bp.svg',
    '7-eleven': '/images/brands/7-eleven.svg',
    'seven eleven': '/images/brands/7-eleven.svg',
    'mobil': '/images/brands/mobil.svg',
    'coles express': '/images/brands/coles-express.svg',
    'united': '/images/brands/united.svg',
    'liberty': '/images/brands/liberty.svg',
    'apco': '/images/brands/apco.svg',
    'caltex': '/images/brands/caltex.svg',
    'ampol': '/images/brands/caltex.svg',
    'default': '/images/brands/default-logo.svg'
  };

  // Get brand logo
  const getBrandLogo = (brand) => {
    if (!brand) return BRAND_IMAGES.default;
    const brandLower = (typeof brand === 'string' ? brand : '').toLowerCase();
    
    if (BRAND_IMAGES[brandLower]) return BRAND_IMAGES[brandLower];
    
    if (brandLower.includes('shell')) return BRAND_IMAGES.shell;
    if (brandLower.includes('bp')) return BRAND_IMAGES.bp;
    if (brandLower.includes('7') || brandLower.includes('seven')) return BRAND_IMAGES['7-eleven'];
    if (brandLower.includes('mobil')) return BRAND_IMAGES.mobil;
    if (brandLower.includes('coles')) return BRAND_IMAGES['coles express'];
    if (brandLower.includes('united')) return BRAND_IMAGES.united;
    if (brandLower.includes('liberty')) return BRAND_IMAGES.liberty;
    if (brandLower.includes('apco')) return BRAND_IMAGES.apco;
    if (brandLower.includes('caltex') || brandLower.includes('ampol')) return BRAND_IMAGES.caltex;
    
    return BRAND_IMAGES.default;
  };

  // Format price using centralized utility
  // Note: Using require() here because this is a .js file and we want to avoid
  // potential circular dependency issues. The formatPriceDecimal function formats
  // prices as currency with 2 decimal places (e.g., $1.50)
  const { formatPriceDecimal } = require('@/lib/utils/price');
  const formatPrice = (price) => formatPriceDecimal(price, 2);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 sm:p-12">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-base sm:text-lg text-gray-600 font-medium">Loading stations...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header - Responsive */}
        <header className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3 sm:mb-4 tracking-tight">
            Melbourne Petrol Stations
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Find the best fuel prices near you • <span className="font-semibold text-primary-600">{filteredStations.length}</span> stations available
          </p>
        </header>

        {/* Filters - Mobile-First Layout */}
        <div className="mb-6 sm:mb-8 lg:mb-10 p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-200 shadow-soft">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {/* Search Input */}
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
              <label htmlFor="search" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5 sm:mb-2">
                🔍 Search
              </label>
              <input
                id="search"
                name="search"
                type="search"
                placeholder="Name, address, suburb..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 hover:border-gray-400 bg-white shadow-sm min-h-[44px] touch-manipulation"
              />
            </div>

            {/* Brand Filter */}
            <div className="col-span-1">
              <label htmlFor="brand-filter" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5 sm:mb-2">
                🏪 Brand
              </label>
              <select
                id="brand-filter"
                name="brand-filter"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 hover:border-gray-400 bg-white shadow-sm cursor-pointer min-h-[44px] touch-manipulation"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand === 'all' ? 'All Brands' : brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Suburb Filter */}
            <div className="col-span-1">
              <label htmlFor="suburb-filter" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5 sm:mb-2">
                🏘️ Suburb
              </label>
              <select
                id="suburb-filter"
                name="suburb-filter"
                value={filterSuburb}
                onChange={(e) => setFilterSuburb(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 hover:border-gray-400 bg-white shadow-sm cursor-pointer min-h-[44px] touch-manipulation"
              >
                {suburbs.map(suburb => (
                  <option key={suburb} value={suburb}>
                    {suburb === 'all' ? 'All Suburbs' : suburb}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel Type Filter */}
            <div className="col-span-1">
              <label htmlFor="fuel-filter" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5 sm:mb-2">
                ⛽ Fuel Type
              </label>
              <select
                id="fuel-filter"
                name="fuel-filter"
                value={filterFuelType}
                onChange={(e) => setFilterFuelType(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 hover:border-gray-400 bg-white shadow-sm cursor-pointer min-h-[44px] touch-manipulation"
              >
                {fuelTypes.map(fuelType => (
                  <option key={fuelType} value={fuelType}>
                    {fuelType === 'all' ? 'All Fuel Types' : fuelType}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="col-span-1">
              <label htmlFor="region-filter" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5 sm:mb-2">
                📍 Region
              </label>
              <select
                id="region-filter"
                name="region-filter"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 hover:border-gray-400 bg-white shadow-sm cursor-pointer min-h-[44px] touch-manipulation"
              >
                {regions.map(region => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8 mb-8 sm:mb-10">
            {paginatedStations.map((station) => {
              const unleadedPrice = Array.isArray(station.fuelPrices) 
                ? station.fuelPrices.find(f => f && f.type && f.type.toLowerCase().includes('unleaded'))
                : null;
              
              const dieselPrice = Array.isArray(station.fuelPrices)
                ? station.fuelPrices.find(f => f && f.type && f.type.toLowerCase().includes('diesel'))
                : null;

              return (
                <article 
                  key={station.id} 
                  className="group relative flex flex-col bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-soft hover:shadow-strong border border-gray-200 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] min-h-[400px] sm:min-h-[420px] lg:min-h-[440px]"
                >
                  {/* Top Gradient Border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Card Header with Brand Logo */}
                  <header className="relative h-24 sm:h-28 bg-gradient-to-br from-gray-50 to-white flex items-start justify-between p-4 sm:p-5 border-b border-gray-100">
                    <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                      {station.brand || 'Independent'}
                    </div>
                    <div className="w-16 h-10 sm:w-20 sm:h-12 relative flex items-center justify-end">
                      <div className="relative w-full h-full">
                        <Image
                          src={getBrandLogo(station.brand)}
                          alt={`${station.brand || 'Station'} logo`}
                          fill
                          sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                          className="object-contain transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                          quality={85}
                        />
                      </div>
                    </div>
                  </header>

                  {/* Card Content */}
                  <div className="flex-1 flex flex-col p-5 sm:p-6 space-y-5 sm:space-y-4">
                    <div className="space-y-2.5 sm:space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {station.name}
                      </h3>
                      <p className="text-sm sm:text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {station.address && `${station.address}, `}
                        {station.city && `${station.city} `}
                        {station.postalCode && station.postalCode}
                      </p>
                    </div>

                    {/* Fuel Prices - Touch-Friendly */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-4 flex-1">
                      {/* Unleaded Price */}
                      <div className="relative flex flex-col items-center justify-center p-4 sm:p-4 bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl transition-all duration-300 hover:border-green-400 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] min-h-[120px] sm:min-h-[100px] touch-manipulation">
                        <div className="flex items-center gap-2 mb-2.5 sm:mb-2">
                          <span className="flex items-center justify-center w-7 h-7 sm:w-6 sm:h-6 bg-gradient-to-br from-green-500 to-green-600 text-white text-xs sm:text-xs font-bold rounded-lg shadow-sm">
                            U
                          </span>
                          <span className="text-xs sm:text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Unleaded
                          </span>
                        </div>
                        <div className="text-2xl sm:text-2xl font-bold text-green-600">
                          {unleadedPrice && unleadedPrice.price ? formatPrice(unleadedPrice.price) : 'N/A'}
                        </div>
                      </div>

                      {/* Diesel Price */}
                      <div className="relative flex flex-col items-center justify-center p-4 sm:p-4 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl transition-all duration-300 hover:border-blue-400 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] min-h-[120px] sm:min-h-[100px] touch-manipulation">
                        <div className="flex items-center gap-2 mb-2.5 sm:mb-2">
                          <span className="flex items-center justify-center w-7 h-7 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs sm:text-xs font-bold rounded-lg shadow-sm">
                            D
                          </span>
                          <span className="text-xs sm:text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Diesel
                          </span>
                        </div>
                        <div className="text-2xl sm:text-2xl font-bold text-blue-600">
                          {dieselPrice && dieselPrice.price ? formatPrice(dieselPrice.price) : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions - Touch-Friendly Buttons */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-3 pt-5 sm:pt-4 border-t border-gray-100">
                      {station.latitude && station.longitude ? (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 sm:px-4 py-4 sm:py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[48px] sm:min-h-[44px] touch-manipulation active:scale-95"
                        >
                          <span aria-hidden="true">🧭</span>
                          <span>Directions</span>
                        </a>
                      ) : (
                        <button 
                          disabled 
                          className="flex items-center justify-center gap-2 px-4 sm:px-4 py-4 sm:py-3 bg-gray-300 text-gray-500 text-sm sm:text-sm font-bold rounded-xl cursor-not-allowed min-h-[48px] sm:min-h-[44px]"
                        >
                          <span aria-hidden="true">📍</span>
                          <span>No Location</span>
                        </button>
                      )}
                      <button className="flex items-center justify-center gap-2 px-4 sm:px-4 py-4 sm:py-3 bg-white text-primary-600 text-sm sm:text-sm font-bold rounded-xl border-2 border-primary-500 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 hover:text-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[48px] sm:min-h-[44px] touch-manipulation active:scale-95">
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
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6">🔍</div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">No stations found</h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 text-center max-w-md">
              Try adjusting your search criteria or filters to find stations
            </p>
          </div>
        )}

        {/* Pagination - Mobile-Friendly */}
        {totalPages > 1 && (
          <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-primary-600 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px] touch-manipulation"
              aria-label="Previous page"
            >
              ← Previous
            </button>

            <span className="text-sm sm:text-base font-medium text-gray-700 px-4 py-2 bg-gray-100 rounded-xl">
              Page <span className="font-bold text-primary-600">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-primary-600 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px] touch-manipulation"
              aria-label="Next page"
            >
              Next →
            </button>
          </nav>
        )}

        {/* Footer Info */}
        <footer className="text-center p-4 sm:p-6 bg-gray-100 rounded-2xl border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Showing <span className="font-semibold text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredStations.length)}</span> of <span className="font-semibold text-primary-600">{filteredStations.length}</span> stations
            {(searchTerm || filterBrand !== 'all' || filterRegion !== 'all' || filterSuburb !== 'all' || filterFuelType !== 'all') && 
              ` (filtered from ${stations.length} total)`
            }
          </p>
        </footer>
      </div>
    </div>
  );
};

export default StationCards;
