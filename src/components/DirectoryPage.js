import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import './DirectoryPage.css';

const DirectoryPage = () => {
  const [petrolStations, setPetrolStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);

  // Sample petrol station data for Melbourne
  const sampleStations = useMemo(() => [
    { id: 1, name: 'Shell Melbourne CBD', brand: 'Shell', suburb: 'Melbourne', prices: { unleaded: 185.9, premium: 195.9, diesel: 179.9 }, address: '123 Collins Street, Melbourne', phone: '(03) 9999 1111', hours: '24/7' },
    { id: 2, name: 'BP South Yarra', brand: 'BP', suburb: 'South Yarra', prices: { unleaded: 182.5, premium: 192.5, diesel: 176.8 }, address: '456 Toorak Road, South Yarra', phone: '(03) 9999 2222', hours: '6:00 AM - 10:00 PM' },
    { id: 3, name: 'Caltex Richmond', brand: 'Caltex', suburb: 'Richmond', prices: { unleaded: 188.9, premium: 198.9, diesel: 183.2 }, address: '789 Swan Street, Richmond', phone: '(03) 9999 3333', hours: '24/7' },
    { id: 4, name: '7-Eleven Carlton', brand: '7-Eleven', suburb: 'Carlton', prices: { unleaded: 179.9, premium: 189.9, diesel: 175.5 }, address: '321 Lygon Street, Carlton', phone: '(03) 9999 4444', hours: '24/7' },
    { id: 5, name: 'United Petroleum Fitzroy', brand: 'United', suburb: 'Fitzroy', prices: { unleaded: 177.5, premium: 187.5, diesel: 173.9 }, address: '654 Brunswick Street, Fitzroy', phone: '(03) 9999 5555', hours: '5:00 AM - 11:00 PM' },
    { id: 6, name: 'Shell St Kilda', brand: 'Shell', suburb: 'St Kilda', prices: { unleaded: 183.9, premium: 193.9, diesel: 178.5 }, address: '987 Acland Street, St Kilda', phone: '(03) 9999 6666', hours: '24/7' },
    { id: 7, name: 'BP Hawthorn', brand: 'BP', suburb: 'Hawthorn', prices: { unleaded: 186.9, premium: 196.9, diesel: 181.3 }, address: '159 Burke Road, Hawthorn', phone: '(03) 9999 7777', hours: '6:00 AM - 10:00 PM' },
    { id: 8, name: 'Ampol Prahran', brand: 'Ampol', suburb: 'Prahran', prices: { unleaded: 184.5, premium: 194.5, diesel: 179.8 }, address: '753 High Street, Prahran', phone: '(03) 9999 8888', hours: '24/7' },
    { id: 9, name: 'Shell Docklands', brand: 'Shell', suburb: 'Docklands', prices: { unleaded: 187.9, premium: 197.9, diesel: 182.5 }, address: '246 Collins Street, Docklands', phone: '(03) 9999 9999', hours: '24/7' },
    { id: 10, name: 'BP Southbank', brand: 'BP', suburb: 'Southbank', prices: { unleaded: 185.5, premium: 195.5, diesel: 180.8 }, address: '135 City Road, Southbank', phone: '(03) 9999 0000', hours: '6:00 AM - 10:00 PM' },
    { id: 11, name: 'Caltex Port Melbourne', brand: 'Caltex', suburb: 'Port Melbourne', prices: { unleaded: 183.9, premium: 193.9, diesel: 178.2 }, address: '678 Bay Street, Port Melbourne', phone: '(03) 9999 1234', hours: '24/7' },
    { id: 12, name: '7-Eleven Collingwood', brand: '7-Eleven', suburb: 'Collingwood', prices: { unleaded: 181.9, premium: 191.9, diesel: 177.5 }, address: '456 Smith Street, Collingwood', phone: '(03) 9999 5678', hours: '24/7' },
  ], []);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setPetrolStations(sampleStations);
      setFilteredStations(sampleStations);
      setLoading(false);
    }, 800);
  }, [sampleStations]);

  useEffect(() => {
    let filtered = petrolStations.filter(station => {
      const searchMatch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const brandMatch = filterBy === 'all' || station.brand.toLowerCase() === filterBy.toLowerCase();
      
      return searchMatch && brandMatch;
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
  }, [petrolStations, searchTerm, sortBy, filterBy]);

  const getBrandColor = (brand) => {
    const colors = {
      'Shell': '#FFD100',
      'BP': '#00A651',
      'Caltex': '#E31837',
      '7-Eleven': '#FF6600',
      'United': '#0066CC',
      'Ampol': '#E31837'
    };
    return colors[brand] || '#6B7280';
  };

  const getLowestPrice = (prices) => {
    return Math.min(prices.unleaded, prices.premium, prices.diesel);
  };

  if (loading) {
    return (
      <div className="directory-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Petrol Station Directory...</h2>
          <p>Gathering latest information from Melbourne stations</p>
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
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1>Petrol Station Directory</h1>
            <p>Browse all petrol stations in Melbourne with current fuel prices</p>
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
                  placeholder="Search by station name, suburb, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filters-section">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="suburb">Sort by Suburb</option>
              </select>

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
                      <span className="fuel-type">🚛 Diesel</span>
                      <span className="price">{station.prices.diesel.toFixed(1)}¢</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn btn-primary btn-sm">
                    Get Directions
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    View on Map
                  </button>
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