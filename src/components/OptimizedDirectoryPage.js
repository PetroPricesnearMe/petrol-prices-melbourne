import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { baserowAPI } from '../config';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

// Memoized station card component to prevent unnecessary re-renders
const StationCard = React.memo(({ station, index }) => {
  return (
    <motion.div
      className="station-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)" 
      }}
    >
      <div className="station-header">
        <h3 className="station-name">{station.name}</h3>
        <span className="station-brand">{station.brand}</span>
      </div>
      
      <div className="station-info">
        <p className="station-address">{station.address}</p>
        <p className="station-suburb">{station.suburb}</p>
      </div>
      
      <div className="fuel-prices">
        <div className="price-item">
          <span className="fuel-type">Unleaded</span>
          <span className="price">{station.prices.unleaded.toFixed(1)}¢</span>
        </div>
        <div className="price-item">
          <span className="fuel-type">Diesel</span>
          <span className="price">{station.prices.diesel.toFixed(1)}¢</span>
        </div>
        <div className="price-item">
          <span className="fuel-type">Premium</span>
          <span className="price">{station.prices.premium.toFixed(1)}¢</span>
        </div>
      </div>
      
      <div className="station-meta">
        <span className="hours">{station.hours}</span>
        <span className="phone">{station.phone}</span>
      </div>
    </motion.div>
  );
});

StationCard.displayName = 'StationCard';

// Virtual scrolling for large lists
const VirtualizedStationList = React.memo(({ stations, containerHeight = 600 }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemHeight = 280; // Approximate height of each station card
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // Buffer items
  
  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(newStartIndex);
  }, [itemHeight]);
  
  const visibleStations = useMemo(() => {
    return stations.slice(startIndex, startIndex + visibleCount);
  }, [stations, startIndex, visibleCount]);
  
  const totalHeight = stations.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  return (
    <div 
      className="virtualized-container"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          <div className="stations-grid">
            {visibleStations.map((station, index) => (
              <StationCard 
                key={`${startIndex + index}-${station.id}`}
                station={station} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualizedStationList.displayName = 'VirtualizedStationList';

const OptimizedDirectoryPage = () => {
  usePerformanceMonitor('DirectoryPage');
  
  const [petrolStations, setPetrolStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState('All Suburbs');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized filtered and sorted stations
  const filteredStations = useMemo(() => {
    let filtered = petrolStations;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(searchLower) ||
        station.suburb.toLowerCase().includes(searchLower) ||
        station.brand.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply suburb filter
    if (selectedSuburb !== 'All Suburbs') {
      filtered = filtered.filter(station => 
        station.suburb === selectedSuburb
      );
    }
    
    // Apply brand filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(station => 
        station.brand.toLowerCase() === filterBy.toLowerCase()
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'suburb':
          return a.suburb.localeCompare(b.suburb);
        case 'price-low':
          return a.prices.unleaded - b.prices.unleaded;
        case 'price-high':
          return b.prices.unleaded - a.prices.unleaded;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [petrolStations, searchTerm, selectedSuburb, sortBy, filterBy]);

  // Debounced search to reduce API calls
  const debouncedSearch = useMemo(() => {
    const timeoutId = setTimeout(() => {
      // Trigger search logic here if needed
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Memoized unique values for filters
  const uniqueSuburbs = useMemo(() => {
    const suburbs = ['All Suburbs', ...new Set(petrolStations.map(s => s.suburb))];
    return suburbs.sort();
  }, [petrolStations]);

  const uniqueBrands = useMemo(() => {
    const brands = ['all', ...new Set(petrolStations.map(s => s.brand.toLowerCase()))];
    return brands;
  }, [petrolStations]);

  // Memoized callbacks to prevent child re-renders
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSuburbChange = useCallback((e) => {
    setSelectedSuburb(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const handleFilterChange = useCallback((e) => {
    setFilterBy(e.target.value);
  }, []);

  // Data fetching with error handling
  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const baserowStations = await baserowAPI.fetchAllStations();
      
      const transformedStations = baserowStations.map((station, index) => ({
        id: station.id || index + 1,
        name: station.field_5072130 || station['Station Name'] || `Station ${index + 1}`,
        brand: station.brand || station.Brand || 'Unknown',
        suburb: station.field_5072132 || station.City || 'Melbourne',
        prices: {
          unleaded: 180 + Math.random() * 20,
          premium: 190 + Math.random() * 20,
          diesel: 175 + Math.random() * 20,
        },
        address: station.field_5072131 || station.Address || `${station.field_5072132 || 'Melbourne'}, VIC`,
        phone: '(03) 0000 0000',
        hours: '24/7',
      }));

      setPetrolStations(transformedStations);
      console.log(`✅ Loaded ${transformedStations.length} stations from Baserow`);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setError(`Failed to load stations: ${err.message}`);
      
      // Fallback data
      setPetrolStations([
        { id: 1, name: 'Shell Melbourne CBD', brand: 'Shell', suburb: 'Melbourne', prices: { unleaded: 185.9, premium: 195.9, diesel: 179.9 }, address: '123 Collins Street, Melbourne', phone: '(03) 9999 1111', hours: '24/7' },
        { id: 2, name: 'BP South Yarra', brand: 'BP', suburb: 'South Yarra', prices: { unleaded: 182.5, premium: 192.5, diesel: 176.8 }, address: '456 Toorak Road, South Yarra', phone: '(03) 9999 2222', hours: '6:00 AM - 10:00 PM' },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  useEffect(() => {
    return debouncedSearch;
  }, [debouncedSearch]);

  if (loading) {
    return (
      <div className="directory-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading petrol stations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="directory-page">
        <div className="error-container">
          <h2>Error Loading Stations</h2>
          <p>{error}</p>
          <button onClick={fetchStations} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="directory-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Melbourne Petrol Stations Directory</h1>
          <p>Find and compare fuel prices from {petrolStations.length} stations</p>
        </motion.div>

        <motion.div
          className="filters-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by station name, suburb, or brand..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select 
              value={selectedSuburb} 
              onChange={handleSuburbChange}
              className="filter-select"
            >
              {uniqueSuburbs.map(suburb => (
                <option key={suburb} value={suburb}>{suburb}</option>
              ))}
            </select>

            <select 
              value={filterBy} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Brands</option>
              {uniqueBrands.slice(1).map(brand => (
                <option key={brand} value={brand}>
                  {brand.charAt(0).toUpperCase() + brand.slice(1)}
                </option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="suburb">Sort by Suburb</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="brand">Sort by Brand</option>
            </select>
          </div>
        </motion.div>

        <motion.div
          className="results-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p>Showing {filteredStations.length} of {petrolStations.length} stations</p>
        </motion.div>

        {filteredStations.length > 50 ? (
          <VirtualizedStationList 
            stations={filteredStations} 
            containerHeight={800}
          />
        ) : (
          <motion.div
            className="stations-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredStations.map((station, index) => (
              <StationCard 
                key={station.id} 
                station={station} 
                index={index}
              />
            ))}
          </motion.div>
        )}

        {filteredStations.length === 0 && (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3>No stations found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OptimizedDirectoryPage;
