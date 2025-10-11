import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MotionDiv } from './MotionComponents';
import dataSourceManager from '../services/DataSourceManager';
import { MELBOURNE_REGIONS, getStationRegion } from '../config/regions';
import './DirectoryPageModern.css';

// Brand image mapping for uploaded images
const BRAND_IMAGES = {
  'shell': '/images/stations/shell-station.jpg',
  'bp': '/images/stations/bp-station.jpg',
  '7-eleven': '/images/stations/seven-eleven.jpg',
  'seven eleven': '/images/stations/seven-eleven.jpg',
  'mobil': '/images/stations/seven-eleven.jpg', // Uses 7-Eleven image as shown
  'default': '/images/fuel-nozzles.jpg'
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
  if (brandLower.includes('shell')) return BRAND_IMAGES.shell;
  if (brandLower.includes('bp')) return BRAND_IMAGES.bp;
  if (brandLower.includes('7') || brandLower.includes('seven')) return BRAND_IMAGES['7-eleven'];
  if (brandLower.includes('mobil')) return BRAND_IMAGES.mobil;
  return BRAND_IMAGES.default;
};

const ITEMS_PER_PAGE = 10;

const DirectoryPageNew = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const regionParam = searchParams.get('region');
  const selectedRegion = regionParam ? MELBOURNE_REGIONS[regionParam.toUpperCase()] : null;

  // Load all stations
  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        const data = await dataSourceManager.fetchStations();
        setStations(data);
      } catch (error) {
        console.error('Error loading stations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // Filter stations by region and search
  useEffect(() => {
    let filtered = [...stations];

    // Filter by region
    if (selectedRegion) {
      filtered = filtered.filter(station => {
        const stationRegion = getStationRegion(
          station.lat || station.Latitude,
          station.lng || station.Longitude,
          station.city || station.City
        );
        return stationRegion.id === selectedRegion.id;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(station => {
        const name = (station.name || station['Station Name'] || '').toLowerCase();
        const city = (station.city || station.City || '').toLowerCase();
        const address = (station.address || station.Address || '').toLowerCase();
        
        return name.includes(search) || city.includes(search) || address.includes(search);
      });
    }

    setFilteredStations(filtered);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [stations, selectedRegion, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStations = filteredStations.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="directory-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Station Directory...</h2>
          <p>Fetching {stations.length > 0 ? stations.length : ''} petrol stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="directory-page">
      {/* Header */}
      <div className="directory-header">
        <div className="container">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="header-content">
              <Link to="/" className="back-link">← Back to Regions</Link>
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

      {/* Search Bar */}
      <div className="search-section">
        <div className="container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by station name, suburb, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="clear-search"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Station Grid - 3 Columns */}
      <div className="directory-content">
        <div className="container">
          {currentStations.length === 0 ? (
            <div className="no-results">
              <h3>No stations found</h3>
              <p>Try adjusting your search or selecting a different region</p>
              <Link to="/" className="btn btn-primary">
                ← Back to Regions
              </Link>
            </div>
          ) : (
            <>
              <div className="stations-grid">
                {currentStations.map((station, index) => {
                  const stationName = station.name || station['Station Name'] || 'Unknown Station';
                  const address = station.address || station.Address || 'Address not available';
                  const city = station.city || station.City || '';
                  const postalCode = station.postalCode || station['Postal Code'] || '';
                  const brand = station.brand || station.Brand || '';
                  const brandStr = typeof brand === 'string' ? brand : '';
                  const brandClass = getBrandClass(brandStr);
                  const brandImage = getBrandImage(brandStr);
                  
                  return (
                    <MotionDiv
                      key={station.id || index}
                      className="station-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.5) }}
                    >
                      {/* Premium Image Header */}
                      <div className="station-image-header">
                        <img 
                          src={brandImage}
                          alt={`${brandStr || 'Petrol'} station`}
                          className="station-brand-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/images/fuel-nozzles.jpg';
                          }}
                        />
                        <div className="station-brand-overlay">
                          {brandStr && (
                            <span className={`station-brand ${brandClass}`}>
                              {brandStr}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Station Content */}
                      <div className="station-content">
                        <div className="station-header">
                          <h3 className="station-name">{stationName}</h3>
                        </div>
                        
                        <div className="station-details">
                          <div className="detail-item">
                            <span className="detail-icon">📍</span>
                            <span className="detail-text">
                              {address}
                              {city && <><br />{city} {postalCode}</>}
                            </span>
                          </div>
                          
                          {station.prices && Object.keys(station.prices).length > 0 && (
                            <div className="station-prices">
                              <strong>💰 Current Prices</strong>
                              <div className="prices-list">
                                {Object.entries(station.prices)
                                  .filter(([_, price]) => price && price > 0)
                                  .slice(0, 3)
                                  .map(([type, price]) => (
                                    <div key={type} className="price-item">
                                      <span className="fuel-type">{type}</span>
                                      <span className="fuel-price">{price.toFixed(1)}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                          
                          {(station.lat && station.lng) && (
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary btn-sm directions-btn"
                            >
                              <span>🧭</span>
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
                <div className="pagination">
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
                        // Show first, last, current, and adjacent pages
                        return page === 1 || 
                               page === totalPages || 
                               Math.abs(page - currentPage) <= 1;
                      })
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="pagination-ellipsis">...</span>
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
              <div className="results-info">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredStations.length)} of {filteredStations.length} stations
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectoryPageNew;

