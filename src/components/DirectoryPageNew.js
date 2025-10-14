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
import { getBrandClass as getBrandStyleClass } from '../utils/brandLogo';
import './DirectoryPageNew.css';

/**
 * Directory Page Component
 * Main listing page with advanced filtering, map view, and comprehensive search
 * Optimized for performance and mobile responsiveness
 */

const ITEMS_PER_PAGE = 12;

// Brand image mapping
const BRAND_IMAGES = {
  'shell': '/images/stations/shell-station.jpg',
  'bp': '/images/stations/bp-station.jpg',
  '7-eleven': '/images/stations/seven-eleven.jpg',
  'seven eleven': '/images/stations/seven-eleven.jpg',
  'mobil': '/images/stations/seven-eleven.jpg',
  'default': '/images/fuel-nozzles.svg'
};

// Get brand-specific CSS class for directory cards
const getBrandClass = (brand) => {
  if (!brand) return '';
  const baseClass = getBrandStyleClass(brand);
  return baseClass ? `brand-${baseClass}` : '';
};

// Get brand image
const getBrandImage = (brand) => {
  if (!brand) return BRAND_IMAGES.default;
  const brandLower = (typeof brand === 'string' ? brand : '').toLowerCase();
  if (brandLower.includes('shell')) return BRAND_IMAGES.shell;
  if (brandLower.includes('bp')) return BRAND_IMAGES.bp;
  if (brandLower.includes('7') || brandLower.includes('seven')) return BRAND_IMAGES['7-eleven'];
  if (brandLower.includes('mobil')) return BRAND_IMAGES.mobil;
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

  // Track page view on mount
  useEffect(() => {
    trackPageView(selectedRegion ? `Directory - ${selectedRegion.name}` : 'Directory - All Stations');
  }, [selectedRegion]);

  // Load all stations
  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        const data = await dataSourceManager.fetchStations();

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
          // Use fuelPrices array if available (from Baserow), otherwise convert prices object
          fuelPrices: station.fuelPrices && station.fuelPrices.length > 0 
            ? station.fuelPrices 
            : (station.prices ? Object.entries(station.prices).map(([fuelType, price]) => ({
                fuelType,
                price: parseFloat(price || 0)
              })) : [])
        }));

        setStations(normalizedData);
      } catch (error) {
        console.error('Error loading stations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // Apply filters
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

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    ? `${selectedRegion.name} Petrol Prices 2025 | Compare ${filteredStations.length}+ Stations - Save Up to 30c/L`
    : 'Melbourne Petrol Stations Directory 2025 | Live Fuel Price Comparison - 250+ Stations';

  const pageDescription = selectedRegion
    ? `🚗 Find the cheapest petrol prices in ${selectedRegion.name}, Melbourne. Compare live fuel prices from ${filteredStations.length}+ stations with real-time updates. ${selectedRegion.description} Save money on unleaded, diesel & premium fuel today!`
    : `🚗 Browse and compare live fuel prices from ${filteredStations.length}+ petrol stations across Melbourne. Interactive map, advanced filters, and real-time price updates. Find the cheapest petrol near you now! FREE price alerts.`;

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
        keywords={`petrol prices ${selectedRegion?.name || 'melbourne'} 2025, fuel prices ${selectedRegion?.name || 'melbourne'} today, cheapest petrol ${selectedRegion?.name || 'melbourne'}, ${selectedRegion?.name || 'melbourne'} petrol stations map, fuel price comparison ${selectedRegion?.name || 'melbourne'}, live petrol prices ${selectedRegion?.name || 'melbourne'}, unleaded diesel premium prices ${selectedRegion?.name || 'melbourne'}, ${selectedRegion?.name || 'melbourne'} fuel station directory, petrol near me ${selectedRegion?.name || 'melbourne'}, shell bp caltex ${selectedRegion?.name || 'melbourne'}`}
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
                <Link to="/" className="back-link" aria-label="Back to home page">
                  ← Back to Home
                </Link>
                <h1>
                  {selectedRegion 
                    ? `${selectedRegion.name} Petrol Prices - Compare Live Fuel Prices Today` 
                    : 'Melbourne Petrol Stations Directory - Compare 250+ Live Fuel Prices'}
                </h1>
                {selectedRegion && (
                  <p className="region-description">
                    {selectedRegion.description} Find the cheapest unleaded, diesel & premium fuel in {selectedRegion.name} with real-time price updates.
                  </p>
                )}
                {!selectedRegion && (
                  <p className="region-description">
                    Browse all petrol stations across Melbourne with live price updates. Use filters to find the cheapest fuel by type, brand, or location. Save money on every fill-up!
                  </p>
                )}
                <div className="header-stats">
                  <span className="stat">
                    <strong>{filteredStations.length}</strong> {filteredStations.length === 1 ? 'station' : 'stations'} with live prices
                  </span>
                  {selectedRegion && (
                    <span className="region-badge" style={{ backgroundColor: selectedRegion.color }}>
                      📍 {selectedRegion.name}
                    </span>
                  )}
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="container">
          <AdvancedFilters
            onFilterChange={handleFilterChange}
            stations={stations}
            activeFilters={activeFilters}
          />

          {/* View Toggle */}
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
          <StationCards />
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
                  <h2>No Petrol Stations Found</h2>
                  <p>We couldn't find any stations matching your search criteria. Try:</p>
                  <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '1rem auto' }}>
                    <li>Adjusting your price range filters</li>
                    <li>Selecting a different fuel type</li>
                    <li>Clearing all filters to see all stations</li>
                    <li>Browsing by region instead</li>
                  </ul>
                  <Link to="/" className="btn btn-primary">
                    ← View All Melbourne Regions
                  </Link>
                </div>
              ) : (
                <>
                  <div className="stations-grid">
                    {currentStations.map((station, index) => {
                      const brandClass = getBrandClass(station.brand);
                      const brandImage = getBrandImage(station.brand);

                      return (
                        <MotionDiv
                          key={station.id}
                          className="station-card"
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
                          <div className="station-content">
                            <div className="station-header">
                              <h3 className="station-name">{station.name}</h3>
                            </div>

                            <div className="station-details">
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
                                <div className="station-prices">
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

                              {station.latitude && station.longitude && (
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-primary btn-sm directions-btn"
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination" role="navigation" aria-label="Pagination">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                        aria-label="Previous page"
                      >
                        ← Previous
                      </button>

                      <div className="pagination-pages">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => {
                            return (
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - currentPage) <= 1
                            );
                          })
                          .map((page, index, array) => (
                            <React.Fragment key={page}>
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="pagination-ellipsis" aria-hidden="true">...</span>
                              )}
                              <button
                                onClick={() => goToPage(page)}
                                className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                                aria-label={`Page ${page}`}
                                aria-current={page === currentPage ? 'page' : undefined}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          ))}
                      </div>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                        aria-label="Next page"
                      >
                        Next →
                      </button>
                    </div>
                  )}

                  {/* Results Info */}
                  <div className="results-info" role="status" aria-live="polite">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredStations.length)} of {filteredStations.length} stations
                    {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                  </div>
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
