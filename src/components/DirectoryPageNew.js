import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MotionDiv } from './MotionComponents';
import dataSourceManager from '../services/DataSourceManager';
import { MELBOURNE_REGIONS, getStationRegion } from '../config/regions';
import AdvancedFilters from './AdvancedFilters';
import StationMap from './StationMap';
import StationCards from './StationCards';
import Breadcrumbs from './Breadcrumbs';
import SEO, { generateFuelPriceListingData } from './SEO';
import { trackPageView, trackSearch, trackFilter, trackStationInteraction } from '../utils/analytics';
import Pagination from './common/Pagination';
// CSS imported in pages/_app.js

/**
 * Directory Page Component
 * Main listing page with advanced filtering, map view, and comprehensive search
 * Optimized for performance and mobile responsiveness
 */

const ITEMS_PER_PAGE = 12;

// Brand image mapping
const BRAND_IMAGES = {
  'shell': '/images/fuel-nozzles.svg', // Using default image (shell-station.jpg not available)
  'bp': '/images/fuel-nozzles.svg', // Using default image (bp-station.jpg not available)
  '7-eleven': '/images/stations/seven-eleven.jpg',
  'seven eleven': '/images/stations/seven-eleven.jpg',
  'mobil': '/images/stations/seven-eleven.jpg',
  'default': '/images/fuel-nozzles.svg'
};

// Get brand-specific CSS class
const getBrandClass = (brand) => {
  if (!brand) return '';
  const brandLower = (typeof brand === 'string' ? brand : '').toLowerCase();
  if (brandLower.includes('shell')) return 'brand-shell';
  if (brandLower.includes('bp')) return 'brand-bp';
  if (brandLower.includes('caltex') || brandLower.includes('ampol')) return 'brand-caltex';
  if (brandLower.includes('7') || brandLower.includes('seven')) return 'brand-seven-eleven';
  if (brandLower.includes('mobil')) return 'brand-mobil';
  if (brandLower.includes('united')) return 'brand-united';
  return '';
};

// Get brand image
const getBrandImage = (brand) => {
  if (!brand) return BRAND_IMAGES.default;
  const brandLower = (typeof brand === 'string' ? brand : '').toLowerCase();

  // Check for exact matches first
  if (BRAND_IMAGES[brandLower]) return BRAND_IMAGES[brandLower];

  // Check for partial matches
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

const DirectoryPageNew = () => {
  const [searchParams] = useSearchParams();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'grid', or 'map'
  const [selectedStation, setSelectedStation] = useState(null);

  const regionParam = searchParams.get('region');
  const selectedRegion = regionParam ? MELBOURNE_REGIONS[regionParam.toUpperCase()] : null;

  // Debug logging
  useEffect(() => {
    console.log('🗺️ DirectoryPageNew mounted');
    console.log('📋 Region param from URL:', regionParam);
    console.log('🎯 Selected region:', selectedRegion?.name || 'All Stations');
  }, [regionParam, selectedRegion]);

  // Track page view on mount
  useEffect(() => {
    trackPageView(selectedRegion ? `Directory - ${selectedRegion.name}` : 'Directory - All Stations');
  }, [selectedRegion]);

  // Load all stations
  useEffect(() => {
    const loadStations = async () => {
      try {
        console.log('⏳ Starting to load stations...');
        setLoading(true);

        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Loading timeout')), 10000)
        );

        const dataPromise = dataSourceManager.fetchStations();

        // Race between data fetch and timeout
        const data = await Promise.race([dataPromise, timeoutPromise]);
        console.log('✅ Data loaded successfully:', data.length, 'stations');

        // Normalize station data
        const normalizedData = data.map(station => ({
          ...station,
          id: station.id || `station-${Math.random().toString(36).substr(2, 9)}`,
          name: station.name || station['Station Name'] || 'Unknown Station',
          address: station.address || station.Address || '',
          city: station.city || station.City || '',
          postalCode: station.postalCode || station['Postal Code'] || '',
          latitude: parseFloat(station.lat || station.Latitude || 0),
          longitude: parseFloat(station.lng || station.Longitude || 0),
          brand: station.brand || station.Brand || '',
          fuelPrices: station.prices ? Object.entries(station.prices).map(([fuelType, price]) => ({
            fuelType,
            price: parseFloat(price || 0)
          })) : []
        }));

        setStations(normalizedData);
        console.log('📊 Stations set in state:', normalizedData.length);
      } catch (error) {
        console.error('❌ Error loading stations:', error);
        // Set empty array on error to prevent infinite loading
        setStations([]);
        console.warn('⚠️ Set empty stations array due to error');
      } finally {
        setLoading(false);
        console.log('✅ Loading complete, loading state set to false');
      }
    };

    loadStations();
  }, []);

  // Apply filters - Optimized with correct dependencies
  const applyFilters = useCallback((filters) => {
    let filtered = [...stations];

    // Filter by region
    if (selectedRegion) {
      filtered = filtered.filter(station => {
        const stationRegion = getStationRegion(
          station.latitude,
          station.longitude,
          station.city
        );
        return stationRegion.id === selectedRegion.id;
      });
    }

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(search) ||
        station.city.toLowerCase().includes(search) ||
        station.address.toLowerCase().includes(search)
      );
      trackSearch(filters.search, filtered.length);
    }

    // Fuel type filter
    if (filters.fuelType && filters.fuelType !== 'all') {
      filtered = filtered.filter(station =>
        station.fuelPrices?.some(fp => fp.fuelType.toLowerCase() === filters.fuelType.toLowerCase())
      );
      trackFilter('fuel_type', filters.fuelType);
    }

    // Brand filter
    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(station =>
        station.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
      trackFilter('brand', filters.brand);
    }

    // Region filter (additional to URL param)
    if (filters.region && filters.region !== 'all') {
      filtered = filtered.filter(station => {
        const stationRegion = getStationRegion(
          station.latitude,
          station.longitude,
          station.city
        );
        return stationRegion.name === filters.region;
      });
      trackFilter('region', filters.region);
    }

    // Price range filter
    if (filters.priceRange?.min || filters.priceRange?.max) {
      filtered = filtered.filter(station => {
        if (!station.fuelPrices || station.fuelPrices.length === 0) return false;

        const avgPrice = station.fuelPrices.reduce((sum, fp) => sum + fp.price, 0) / station.fuelPrices.length;
        const min = parseFloat(filters.priceRange.min) || 0;
        const max = parseFloat(filters.priceRange.max) || Infinity;

        return avgPrice >= min && avgPrice <= max;
      });
      trackFilter('price_range', `${filters.priceRange.min}-${filters.priceRange.max}`);
    }

    // Sort stations
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price-low':
            const avgPriceA = a.fuelPrices?.reduce((sum, fp) => sum + fp.price, 0) / (a.fuelPrices?.length || 1) || Infinity;
            const avgPriceB = b.fuelPrices?.reduce((sum, fp) => sum + fp.price, 0) / (b.fuelPrices?.length || 1) || Infinity;
            return avgPriceA - avgPriceB;
          case 'price-high':
            const avgPriceA2 = a.fuelPrices?.reduce((sum, fp) => sum + fp.price, 0) / (a.fuelPrices?.length || 1) || 0;
            const avgPriceB2 = b.fuelPrices?.reduce((sum, fp) => sum + fp.price, 0) / (b.fuelPrices?.length || 1) || 0;
            return avgPriceB2 - avgPriceA2;
          default:
            return 0;
        }
      });
    }

    setFilteredStations(filtered);
    setCurrentPage(1);
  }, [stations, selectedRegion]);

  // Handle filter changes
  const handleFilterChange = useCallback((filters) => {
    setActiveFilters(filters);
    applyFilters(filters);
  }, [applyFilters]);

  // Initial filter application
  useEffect(() => {
    applyFilters(activeFilters);
  }, [stations, applyFilters, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStations = filteredStations.slice(startIndex, endIndex);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Handle station interactions
  const handleStationClick = (station) => {
    setSelectedStation(station);
    trackStationInteraction(station.id, 'view', { name: station.name });
  };

  const handleDirectionsClick = (station) => {
    trackStationInteraction(station.id, 'directions', { name: station.name });
  };

  // SEO data
  const pageTitle = selectedRegion
    ? `${selectedRegion.name} Petrol Stations - Live Fuel Prices`
    : 'Melbourne Petrol Stations Directory - Live Fuel Prices';

  const pageDescription = selectedRegion
    ? `Find the cheapest petrol prices in ${selectedRegion.name}, Melbourne. Compare real-time fuel prices from ${filteredStations.length}+ stations. ${selectedRegion.description}`
    : `Browse ${filteredStations.length}+ petrol stations across Melbourne. Compare live fuel prices and find the cheapest petrol near you.`;

  if (loading) {
    return (
      <div className="directory-page">
        <div className="loading-container fullscreen">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <span className="fuel-icon">⛽</span>
          </div>
          <div className="loading-message">
            <h3>Loading Station Directory...</h3>
            <p className="loading-tip">Finding the best fuel prices for you...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`petrol prices ${selectedRegion?.name || 'melbourne'}, fuel prices ${selectedRegion?.name || 'melbourne'}, cheapest petrol, station directory`}
        canonical={`/directory${regionParam ? `?region=${regionParam}` : ''}`}
        structuredData={generateFuelPriceListingData(filteredStations.slice(0, 10))}
      />

      <div className="directory-page">
        <Breadcrumbs customCrumbs={selectedRegion ? [
          { label: 'Home', path: '/', icon: '🏠' },
          { label: 'Station Directory', path: '/directory' },
          { label: selectedRegion.name, path: `/directory?region=${regionParam}`, isActive: true }
        ] : undefined} />

        {/* Header */}
        <div className="directory-header">
          <div className="container">
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="header-content">
                <Link to="/" className="back-link" aria-label="Back to regions">
                  ← Back to Regions
                </Link>
                <h1>
                  {selectedRegion ? selectedRegion.name : 'All Melbourne Petrol Stations'}
                </h1>
                {selectedRegion && (
                  <p className="region-description">
                    {selectedRegion.description}
                  </p>
                )}
                <div className="header-stats">
                  <span className="stat">
                    <strong>{filteredStations.length}</strong> stations found
                  </span>
                  {selectedRegion && (
                    <span className="region-badge" style={{ backgroundColor: selectedRegion.color }}>
                      {selectedRegion.name}
                    </span>
                  )}
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>

        {/* Note: StationCards view has its own built-in filters, so we only show filters for Grid and Map views */}
        {viewMode !== 'cards' && (
          <div className="container">
            <AdvancedFilters
              onFilterChange={handleFilterChange}
              stations={stations}
              activeFilters={activeFilters}
            />
          </div>
        )}

        {/* View Toggle */}
        <div className="container">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              aria-label="Cards view"
              aria-pressed={viewMode === 'cards'}
            >
              <span>🃏</span> Cards
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <span>⊞</span> Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
              aria-label="Map view"
              aria-pressed={viewMode === 'map'}
            >
              <span>🗺️</span> Map
            </button>
          </div>
        </div>

        {/* Cards View */}
        {viewMode === 'cards' && (
          <div className="container">
            <StationCards />
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="container">
            <StationMap
              stations={filteredStations}
              onStationClick={handleStationClick}
              selectedStation={selectedStation}
              height={600}
            />
          </div>
        )}

        {/* Station Grid */}
        {viewMode === 'grid' && (
          <div className="directory-content">
            <div className="container">
              {currentStations.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No stations found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                  <Link to="/" className="btn btn-primary">
                    ← Explore All Regions
                  </Link>
                </div>
              ) : (
                <>
                  {/* Responsive Grid with Fluid Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                    {currentStations.map((station, index) => {
                      const brandClass = getBrandClass(station.brand);
                      const brandImage = getBrandImage(station.brand);

                      return (
                        <MotionDiv
                          key={station.id}
                          className="station-card h-full flex flex-col"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: Math.min(index * 0.05, 0.3) }}
                          whileHover={{ y: -4 }}
                        >
                          {/* Station Image */}
                          <div className="station-image-header">
                            <img
                              src={brandImage}
                              alt={`${station.brand || 'Petrol'} station`}
                              className="station-brand-image"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = '/images/fuel-nozzles.svg';
                              }}
                            />
                            <div className="station-brand-overlay">
                              {station.brand && (
                                <span className={`station-brand ${brandClass}`}>
                                  {station.brand}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Station Content */}
                          <div className="station-content flex-1 flex flex-col">
                            <div className="station-header">
                              <h3 className="station-name">{station.name}</h3>
                            </div>

                            <div className="station-details flex-1 flex flex-col justify-between">
                              <div>
                                <div className="detail-item">
                                  <span className="detail-icon" aria-hidden="true">📍</span>
                                  <span className="detail-text">
                                    {station.address}
                                    {station.city && (
                                      <>
                                        <br />
                                        {station.city} {station.postalCode}
                                      </>
                                    )}
                                  </span>
                                </div>

                                {station.fuelPrices && station.fuelPrices.length > 0 && (
                                  <div className="station-prices mt-4">
                                    <strong>💰 Current Prices</strong>
                                    <div className="prices-list">
                                      {station.fuelPrices
                                        .filter(fp => fp.price > 0)
                                        .slice(0, 3)
                                        .map((fp, i) => (
                                          <div key={i} className="price-item">
                                            <span className="fuel-type">{fp.fuelType}</span>
                                            <span className="fuel-price">${fp.price.toFixed(2)}</span>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {station.latitude && station.longitude && (
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-primary btn-sm directions-btn mt-4"
                                  onClick={() => handleDirectionsClick(station)}
                                  aria-label={`Get directions to ${station.name}`}
                                >
                                  <span aria-hidden="true">🧭</span>
                                  <span>Get Directions</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </MotionDiv>
                      );
                    })}
                  </div>

                  {/* Modern Pagination with Accessibility */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                        totalItems={filteredStations.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        showItemsInfo={true}
                        scrollToTop={true}
                        size="md"
                        animationType="fade"
                        siblingCount={1}
                        showFirstLast={true}
                        showPrevNext={true}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DirectoryPageNew;
