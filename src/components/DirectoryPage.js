import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { baserowAPI } from '../config';
import './DirectoryPage.css';
import { Link } from 'react-router-dom'; // Added Link import

// Melbourne suburbs list for dropdown
const MELBOURNE_SUBURBS = [
  'All Suburbs', 'Abbotsford', 'Airport West', 'Albert Park', 'Alphington', 'Armadale', 'Ascot Vale',
  'Ashburton', 'Aspendale', 'Auburn', 'Balaclava', 'Balwyn', 'Balwyn North', 'Bentleigh', 'Bentleigh East',
  'Blackburn', 'Blackburn North', 'Blackburn South', 'Box Hill', 'Box Hill North', 'Box Hill South',
  'Brighton', 'Brighton East', 'Brunswick', 'Brunswick East', 'Brunswick West', 'Bulleen', 'Burwood',
  'Camberwell', 'Canterbury', 'Carlton', 'Carlton North', 'Carnegie', 'Caulfield', 'Caulfield East',
  'Caulfield North', 'Caulfield South', 'Chadstone', 'Cheltenham', 'Clayton', 'Clifton Hill',
  'Coburg', 'Coburg North', 'Collingwood', 'Cremorne', 'Dandenong', 'Dandenong North', 'Dandenong South',
  'Docklands', 'Doncaster', 'Doncaster East', 'Donvale', 'East Melbourne', 'Elsternwick', 'Elwood',
  'Essendon', 'Essendon North', 'Fairfield', 'Fitzroy', 'Fitzroy North', 'Footscray', 'Frankston',
  'Gardenvale', 'Glen Iris', 'Glen Waverley', 'Glenroy', 'Greensborough', 'Hampton', 'Hampton East',
  'Hawthorn', 'Hawthorn East', 'Heidelberg', 'Heidelberg Heights', 'Heidelberg West', 'Highett',
  'Ivanhoe', 'Ivanhoe East', 'Kensington', 'Keilor', 'Keilor East', 'Kew', 'Kew East', 'Keysborough',
  'Kooyong', 'Lalor', 'Laverton', 'Malvern', 'Malvern East', 'Maribyrnong', 'McKinnon', 'Melbourne',
  'Melbourne CBD', 'Middle Park', 'Mitcham', 'Mont Albert', 'Montmorency', 'Moonee Ponds', 'Moorabbin',
  'Mooroolbark', 'Mount Waverley', 'Mulgrave', 'Murrumbeena', 'Narre Warren', 'Newport', 'Noble Park',
  'North Melbourne', 'Northcote', 'Nunawading', 'Oakleigh', 'Oakleigh East', 'Oakleigh South',
  'Ormond', 'Pakenham', 'Parkville', 'Pascoe Vale', 'Prahran', 'Preston', 'Reservoir', 'Richmond',
  'Ringwood', 'Ringwood East', 'Ringwood North', 'Ripponlea', 'Rowville', 'Sandringham', 'Seaford',
  'South Melbourne', 'South Yarra', 'Southbank', 'Spotswood', 'Springvale', 'St Kilda', 'St Kilda East',
  'St Kilda West', 'Surrey Hills', 'Templestowe', 'Thornbury', 'Toorak', 'Tullamarine', 'Vermont',
  'Vermont South', 'Wantirna', 'Wantirna South', 'Warrandyte', 'Wheelers Hill', 'Williamstown',
  'Windsor', 'Yarraville', 'Yarra Glen', 'Yarrambat'
];

const DirectoryPage = () => {
  const [petrolStations, setPetrolStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState('All Suburbs');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Utility functions for pricing and branding
  const getBrandColor = (brand) => {
    const colors = {
      'Shell': '#FFD700',
      'BP': '#00A651', 
      'Caltex': '#E31837',
      'Ampol': '#E31837',
      '7-Eleven': '#F47920',
      'Seven Eleven': '#F47920',
      'United': '#1E3A8A',
      'Mobil': '#E31837',
      'Esso': '#E31837',
      'Liberty': '#003DA5',
      'Puma': '#FFD700',
      'Metro': '#FF6B35',
      'Independent': '#10B981',
      'Unknown': '#6B7280',
      'Other': '#8B5CF6'
    };
    return colors[brand] || colors['Unknown'];
  };

  const getLowestPrice = (prices) => {
    const priceValues = Object.values(prices).filter(price => typeof price === 'number' && price > 0);
    return Math.min(...priceValues);
  };

  // Note: Now using the new Baserow table structure with table ID 623329

  const fetchStationsFromBaserow = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all stations from Baserow using pagination
      const baserowStations = await baserowAPI.fetchAllStations();
      
      // Transform Baserow data to match expected format
      const transformedStations = baserowStations.map((station, index) => {
        // Handle brand field - it might be a file object from Baserow
        let brandValue = 'Unknown';
        if (station.brand) {
          if (typeof station.brand === 'string') {
            brandValue = station.brand;
          } else if (Array.isArray(station.brand) && station.brand.length > 0) {
            // If it's an array of file objects, get the name of the first one
            brandValue = station.brand[0]?.visible_name || station.brand[0]?.name || 'Unknown';
          } else if (typeof station.brand === 'object' && station.brand.visible_name) {
            // If it's a single file object
            brandValue = station.brand.visible_name || station.brand.name || 'Unknown';
          }
        } else if (station.Brand) {
          if (typeof station.Brand === 'string') {
            brandValue = station.Brand;
          } else if (Array.isArray(station.Brand) && station.Brand.length > 0) {
            brandValue = station.Brand[0]?.visible_name || station.Brand[0]?.name || 'Unknown';
          } else if (typeof station.Brand === 'object' && station.Brand.visible_name) {
            brandValue = station.Brand.visible_name || station.Brand.name || 'Unknown';
          }
        }
        
        return {
        id: station.id || index + 1,
        name: station.field_5072130 || station['Station Name'] || `Station ${index + 1}`,
        brand: brandValue,
        suburb: station.field_5072132 || station.City || 'Melbourne',
        prices: {
          // Generate realistic prices for demo - in production, get from linked Fuel Prices
          unleaded: 180 + Math.random() * 20,
          premium: 190 + Math.random() * 20,
          premium98: 200 + Math.random() * 25,
          diesel: 175 + Math.random() * 20,
          gas: 85 + Math.random() * 15
        },
        address: station.field_5072131 || station.Address || `${station.field_5072132 || 'Melbourne'}, VIC`,
        phone: '(03) 0000 0000', // Could be added as a field later
        hours: '24/7', // Could be added as a field later
        category: station.field_5072138 || station.Category,
        region: station.field_5072134 || station.Region,
        country: station.field_5072135 || station.Country || 'Australia',
        postalCode: station.field_5072133 || station['Postal Code'],
        locationDetails: station.field_5072140 || station['Location Details'],
        fuelPrices: station.field_5072139 || station['Fuel Prices'] || []
        };
      });

      setPetrolStations(transformedStations);
      setFilteredStations(transformedStations);
      console.log(`✅ Loaded ${transformedStations.length} stations from Baserow`);
    } catch (err) {
      console.error('Error fetching stations from Baserow:', err);
      setError(`Failed to load stations: ${err.message}`);
      
      // Fallback to sample data if Baserow fails
      const fallbackStations = [
        { id: 1, name: 'Shell Melbourne CBD', brand: 'Shell', suburb: 'Melbourne', prices: { unleaded: 185.9, premium: 195.9, premium98: 210.5, diesel: 179.9, gas: 95.2 }, address: '123 Collins Street, Melbourne', phone: '(03) 9999 1111', hours: '24/7' },
        { id: 2, name: 'BP South Yarra', brand: 'BP', suburb: 'South Yarra', prices: { unleaded: 182.5, premium: 192.5, premium98: 207.8, diesel: 176.8, gas: 92.1 }, address: '456 Toorak Road, South Yarra', phone: '(03) 9999 2222', hours: '6:00 AM - 10:00 PM' },
        { id: 3, name: 'Caltex Richmond', brand: 'Caltex', suburb: 'Richmond', prices: { unleaded: 188.9, premium: 198.9, premium98: 213.2, diesel: 183.2, gas: 97.5 }, address: '789 Swan Street, Richmond', phone: '(03) 9999 3333', hours: '24/7' }
      ];
      setPetrolStations(fallbackStations);
      setFilteredStations(fallbackStations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStationsFromBaserow();
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchStationsFromBaserow();
  };

  useEffect(() => {
    let filtered = petrolStations.filter(station => {
      const searchMatch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const suburbMatch = selectedSuburb === 'All Suburbs' || 
                         station.suburb.toLowerCase() === selectedSuburb.toLowerCase();
      
      const brandMatch = filterBy === 'all' || station.brand.toLowerCase() === filterBy.toLowerCase();
      
      return searchMatch && suburbMatch && brandMatch;
    });

    // Sort stations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.prices.unleaded - b.prices.unleaded;
        case 'price-high':
          return b.prices.unleaded - a.prices.unleaded;
        case 'suburb':
          return a.suburb.localeCompare(b.suburb);
        default:
          return 0;
      }
    });

    setFilteredStations(filtered);
  }, [petrolStations, searchTerm, selectedSuburb, sortBy, filterBy]);

  if (loading) {
    return (
      <div className="directory-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Petrol Station Directory...</h2>
          <p>Fetching latest data from Baserow database...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="directory-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="directory-header">
        <div className="container">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Petrol Station Directory</h1>
            <p>Find and compare fuel prices across Melbourne's petrol stations</p>
            
            {/* Error Display */}
            {error && (
              <motion.div 
                className="error-banner"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '1rem',
                  color: '#dc2626'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span>⚠️</span>
                  <strong>Error Loading Stations</strong>
                </div>
                <p style={{ marginBottom: '1rem' }}>{error}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleRetry}
                    disabled={retryCount >= 3}
                  >
                    {retryCount >= 3 ? 'Max Retries Reached' : '🔄 Retry'}
                  </button>
                  {retryCount >= 3 && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => window.location.reload()}
                    >
                      🔄 Refresh Page
                    </button>
                  )}
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Showing fallback data
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="directory-controls"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="search-section">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by station name or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filters-section">
              <div className="filter-group">
                <label className="filter-label">📍 Suburb</label>
                <select 
                  value={selectedSuburb} 
                  onChange={(e) => setSelectedSuburb(e.target.value)}
                  className="filter-select suburb-select"
                >
                  {MELBOURNE_SUBURBS.map(suburb => (
                    <option key={suburb} value={suburb}>{suburb}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">🏷️ Brand</label>
                <select 
                  value={filterBy} 
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Brands</option>
                  <option value="shell">Shell</option>
                  <option value="bp">BP</option>
                  <option value="caltex">Caltex</option>
                  <option value="7-eleven">7-Eleven</option>
                  <option value="united">United</option>
                  <option value="ampol">Ampol</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">📊 Sort By</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="suburb">Suburb A-Z</option>
                </select>
              </div>
            </div>

            <div className="results-count">
              <span>{filteredStations.length} stations found</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="directory-content">
        <div className="container">
          <motion.div 
            className="stations-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredStations.map((station, index) => (
              <motion.div
                key={station.id}
                className="station-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index % 10) }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="card-header">
                  <div 
                    className="brand-badge"
                    style={{ backgroundColor: getBrandColor(station.brand) }}
                  >
                    {station.brand}
                  </div>
                  <div className="best-price">
                    {getLowestPrice(station.prices).toFixed(1)}¢
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="station-name">{station.name}</h3>
                  <p className="station-address">{station.address}</p>
                  
                  <div className="station-info">
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <span>{station.suburb}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📞</span>
                      <span>{station.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">🕐</span>
                      <span>{station.hours}</span>
                    </div>
                  </div>

                  <div className="fuel-prices">
                    <div className="price-item">
                      <span className="fuel-type">⛽ Unleaded</span>
                      <span className="price">{station.prices.unleaded.toFixed(1)}¢</span>
                    </div>
                    <div className="price-item">
                      <span className="fuel-type">🔋 Premium</span>
                      <span className="price">{station.prices.premium.toFixed(1)}¢</span>
                    </div>
                    <div className="price-item">
                      <span className="fuel-type">⚡ Premium 98</span>
                      <span className="price">{station.prices.premium98.toFixed(1)}¢</span>
                    </div>
                    <div className="price-item">
                      <span className="fuel-type">🚛 Diesel</span>
                      <span className="price">{station.prices.diesel.toFixed(1)}¢</span>
                    </div>
                    <div className="price-item">
                      <span className="fuel-type">🔥 Gas</span>
                      <span className="price">{station.prices.gas.toFixed(1)}¢</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${station.address}`;
                      window.open(url, '_blank');
                    }}
                    aria-label={`Get directions to ${station.name}`}
                  >
                    🗺️ Get Directions
                  </button>
                  <Link 
                    to="/map" 
                    className="btn btn-secondary btn-sm"
                    aria-label={`View ${station.name} on map`}
                  >
                    📍 View on Map
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredStations.length === 0 && (
            <motion.div 
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="no-results-icon">🔍</div>
              <h3>No stations found</h3>
              <p>Try adjusting your search terms or filters</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DirectoryPage; 