import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dataSourceManager from '../services/DataSourceManager';
import { trackSearch, trackFilter } from '../utils/analytics';
import BrandLogoManager from './BrandLogoManager';
// CSS imported in pages/_app.js

/**
 * Station Cards Component
 * Displays Melbourne petrol stations with customizable brand logos
 * Simplified design focusing on Unleaded & Diesel prices
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
  const [showLogoManager, setShowLogoManager] = useState(false);
  const [brandLogos, setBrandLogos] = useState({});
  const itemsPerPage = 12;

  // Load brand logos from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const loadBrandLogos = () => {
      const savedLogos = localStorage.getItem('brandLogos');
      if (savedLogos) {
        try {
          setBrandLogos(JSON.parse(savedLogos));
        } catch (error) {
          console.error('Error loading brand logos:', error);
        }
      }
    };

    loadBrandLogos();

    // Listen for storage changes (when logos are updated in BrandLogoManager)
    const handleStorageChange = (e) => {
      if (e.key === 'brandLogos') {
        loadBrandLogos();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
      .filter(s => s.name); // Filter out empty rows
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
      // Ensure fuelPrices is an array and contains objects with type property
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

    // Search filter
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

    // Brand filter
    if (filterBrand !== 'all') {
      filtered = filtered.filter(s => s.brand === filterBrand);
      trackFilter('brand', filterBrand);
    }

    // Region filter
    if (filterRegion !== 'all') {
      filtered = filtered.filter(s => s.region === filterRegion);
      trackFilter('region', filterRegion);
    }

    // Suburb filter
    if (filterSuburb !== 'all') {
      filtered = filtered.filter(s => s.city === filterSuburb);
      trackFilter('suburb', filterSuburb);
    }

    // Fuel type filter
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

  // Get brand logo (custom uploaded or default)
  const getBrandLogo = (brand) => {
    // Check if brand has a custom uploaded logo
    if (brand && brandLogos[brand]) {
      return brandLogos[brand];
    }
    // Return default logo
    return '/images/brands/default-logo.svg';
  };

  // Refresh logos when manager is closed
  const handleLogoManagerClose = () => {
    setShowLogoManager(false);
    // Reload logos from localStorage
    const savedLogos = localStorage.getItem('brandLogos');
    if (savedLogos) {
      try {
        setBrandLogos(JSON.parse(savedLogos));
      } catch (error) {
        console.error('Error reloading brand logos:', error);
      }
    }
  };

  // Format fuel type for display
  const getFuelIcon = (type) => {
    const icons = {
      'Unleaded': 'U',
      'Premium': 'P',
      'Diesel': 'D',
      'LPG': 'L'
    };
    return icons[type] || 'F';
  };

  // Format price
  const formatPrice = (price) => {
    if (!price || price === 0) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  // Format last updated date
  const formatLastUpdated = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-AU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="station-cards-loading">
        <div className="loading-spinner"></div>
        <p>Loading stations...</p>
      </div>
    );
  }

  return (
    <div className="station-cards-container">
      {/* Header */}
      <div className="cards-header">
        <h2>Melbourne Petrol Stations</h2>
        <p className="cards-subtitle">
          Find the best fuel prices near you • {filteredStations.length} stations available
        </p>
        <button 
          onClick={() => setShowLogoManager(true)}
          className="admin-btn"
          title="Manage Brand Logos"
        >
          🎨 Manage Logos
        </button>
      </div>

      {/* Brand Logo Manager Modal */}
      {showLogoManager && (
        <BrandLogoManager onClose={handleLogoManagerClose} />
      )}

      {/* Enhanced Filters */}
      <div className="cards-filters">
        <div className="filter-group">
          <label htmlFor="search">🔍 Search Stations</label>
          <input
            id="search"
            name="search"
            type="search"
            placeholder="Search by name, address, suburb..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="brand-filter">🏪 Brand</label>
          <select
            id="brand-filter"
            name="brand-filter"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="filter-select"
          >
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand === 'all' ? 'All Brands' : brand}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="suburb-filter">🏘️ Suburb</label>
          <select
            id="suburb-filter"
            name="suburb-filter"
            value={filterSuburb}
            onChange={(e) => setFilterSuburb(e.target.value)}
            className="filter-select"
          >
            {suburbs.map(suburb => (
              <option key={suburb} value={suburb}>
                {suburb === 'all' ? 'All Suburbs' : suburb}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="fuel-filter">⛽ Fuel Type</label>
          <select
            id="fuel-filter"
            name="fuel-filter"
            value={filterFuelType}
            onChange={(e) => setFilterFuelType(e.target.value)}
            className="filter-select"
          >
            {fuelTypes.map(fuelType => (
              <option key={fuelType} value={fuelType}>
                {fuelType === 'all' ? 'All Fuel Types' : fuelType}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="region-filter">📍 Region</label>
          <select
            id="region-filter"
            name="region-filter"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="filter-select"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {paginatedStations.length > 0 ? (
        <div className="cards-grid">
          {paginatedStations.map((station) => {
            // Filter to show only Unleaded and Diesel prices
            const unleadedPrice = Array.isArray(station.fuelPrices) 
              ? station.fuelPrices.find(f => f && f.type && f.type.toLowerCase().includes('unleaded'))
              : null;
            
            const dieselPrice = Array.isArray(station.fuelPrices)
              ? station.fuelPrices.find(f => f && f.type && f.type.toLowerCase().includes('diesel'))
              : null;

            return (
              <div key={station.id} className="station-card">
                {/* Card Header with Brand Logo */}
                <div className="card-header">
                  <img
                    src={getBrandLogo(station.brand)}
                    alt={`${station.brand || 'Station'} logo`}
                    className="brand-logo"
                    onError={(e) => {
                      e.target.src = '/images/brands/default-logo.svg';
                    }}
                  />
                  <div className="brand-badge">{station.brand || 'Independent'}</div>
                </div>

                {/* Card Content */}
                <div className="card-content">
                  <h3 className="station-name">{station.name}</h3>
                  <p className="station-address">
                    {station.address && `${station.address}, `}
                    {station.city && `${station.city} `}
                    {station.postalCode && station.postalCode}
                  </p>

                  {/* Fuel Prices - Only Unleaded & Diesel */}
                  <div className="fuel-prices">
                    {/* Unleaded Price */}
                    <div className={`fuel-price-item ${unleadedPrice ? 'unleaded' : ''}`}>
                      <div className="fuel-type">
                        <div className="fuel-icon unleaded">U</div>
                        Unleaded
                      </div>
                      <div className="price">
                        {unleadedPrice && unleadedPrice.price 
                          ? formatPrice(unleadedPrice.price)
                          : 'N/A'}
                      </div>
                    </div>

                    {/* Diesel Price */}
                    <div className={`fuel-price-item ${dieselPrice ? 'diesel' : ''}`}>
                      <div className="fuel-type">
                        <div className="fuel-icon diesel">D</div>
                        Diesel
                      </div>
                      <div className="price">
                        {dieselPrice && dieselPrice.price 
                          ? formatPrice(dieselPrice.price)
                          : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="card-actions">
                    {station.latitude && station.longitude ? (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn"
                      >
                        🧭 Directions
                      </a>
                    ) : (
                      <button className="action-btn" disabled>
                        📍 No Location
                      </button>
                    )}
                    <button className="action-btn secondary">
                      ℹ️ More Info
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-results">
          <h3>No stations found</h3>
          <p>Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="cards-pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ← Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="cards-footer">
        <p>
          Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredStations.length)} of {filteredStations.length} stations
          {(searchTerm || filterBrand !== 'all' || filterRegion !== 'all' || filterSuburb !== 'all' || filterFuelType !== 'all') && ` (filtered from ${stations.length} total)`}
        </p>
      </div>
    </div>
  );
};

export default StationCards;
