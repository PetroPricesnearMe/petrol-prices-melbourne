import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './StationAmenitiesPage.css';

const StationAmenitiesPage = () => {
  const [selectedAmenity, setSelectedAmenity] = useState('all');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const amenitiesList = [
    { key: 'all', label: 'All Amenities', icon: '🏪', count: 0 },
    { key: 'car_wash', label: 'Car Wash', icon: '🚿', count: 0 },
    { key: 'atm', label: 'ATM', icon: '🏧', count: 0 },
    { key: 'food', label: 'Food & Drinks', icon: '🍔', count: 0 },
    { key: 'toilets', label: 'Toilets', icon: '🚻', count: 0 },
    { key: 'air_water', label: 'Air & Water', icon: '💨', count: 0 },
    { key: 'lpg', label: 'LPG', icon: '🔥', count: 0 },
    { key: 'truck_friendly', label: 'Truck Friendly', icon: '🚛', count: 0 },
    { key: '24_hours', label: '24 Hours', icon: '🕐', count: 0 },
    { key: 'ev_charging', label: 'EV Charging', icon: '⚡', count: 0 }
  ];

  // Mock station data with amenities
  const mockStations = [
    {
      id: 1,
      name: 'Shell Melbourne CBD',
      address: '123 Collins Street, Melbourne',
      suburb: 'Melbourne',
      brand: 'Shell',
      amenities: ['car_wash', 'atm', 'food', 'toilets', 'air_water', '24_hours'],
      prices: { unleaded: 185.9, premium: 195.9, diesel: 179.9 }
    },
    {
      id: 2,
      name: 'BP South Yarra',
      address: '456 Toorak Road, South Yarra',
      suburb: 'South Yarra',
      brand: 'BP',
      amenities: ['atm', 'food', 'toilets', 'air_water', 'lpg'],
      prices: { unleaded: 182.5, premium: 192.5, diesel: 176.8 }
    },
    {
      id: 3,
      name: 'Caltex Richmond',
      address: '789 Swan Street, Richmond',
      suburb: 'Richmond',
      brand: 'Caltex',
      amenities: ['car_wash', 'atm', 'food', 'toilets', 'air_water', 'truck_friendly', '24_hours'],
      prices: { unleaded: 188.9, premium: 198.9, diesel: 183.2 }
    },
    {
      id: 4,
      name: '7-Eleven Fitzroy',
      address: '321 Brunswick Street, Fitzroy',
      suburb: 'Fitzroy',
      brand: '7-Eleven',
      amenities: ['atm', 'food', 'toilets', '24_hours'],
      prices: { unleaded: 180.5, premium: 190.5, diesel: 175.5 }
    },
    {
      id: 5,
      name: 'United St Kilda',
      address: '654 Acland Street, St Kilda',
      suburb: 'St Kilda',
      brand: 'United',
      amenities: ['car_wash', 'atm', 'food', 'toilets', 'air_water', 'lpg', 'ev_charging'],
      prices: { unleaded: 187.2, premium: 197.2, diesel: 182.2 }
    },
    {
      id: 6,
      name: 'Ampol Carlton',
      address: '987 Lygon Street, Carlton',
      suburb: 'Carlton',
      brand: 'Ampol',
      amenities: ['atm', 'food', 'toilets', 'air_water', 'truck_friendly'],
      prices: { unleaded: 184.8, premium: 194.8, diesel: 179.8 }
    }
  ];

  useEffect(() => {
    // Simulate loading
    const loadStations = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStations(mockStations);
      
      // Count amenities
      const amenityCounts = { ...amenitiesList.reduce((acc, amenity) => ({ ...acc, [amenity.key]: 0 }), {}) };
      mockStations.forEach(station => {
        station.amenities.forEach(amenity => {
          if (amenityCounts[amenity] !== undefined) {
            amenityCounts[amenity]++;
          }
        });
      });
      
      // Update amenities with counts
      const updatedAmenities = amenitiesList.map(amenity => ({
        ...amenity,
        count: amenityCounts[amenity.key] || 0
      }));
      
      setLoading(false);
    };
    
    loadStations();
  }, []);

  const filteredStations = selectedAmenity === 'all' 
    ? stations 
    : stations.filter(station => station.amenities.includes(selectedAmenity));

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

  const getAmenityIcon = (amenityKey) => {
    const amenity = amenitiesList.find(a => a.key === amenityKey);
    return amenity ? amenity.icon : '❓';
  };

  const getAmenityLabel = (amenityKey) => {
    const amenity = amenitiesList.find(a => a.key === amenityKey);
    return amenity ? amenity.label : amenityKey;
  };

  return (
    <motion.div 
      className="station-amenities-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="amenities-header">
        <div className="container">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Station Amenities</h1>
            <p>Find petrol stations with the services and facilities you need</p>
          </motion.div>

          <motion.div 
            className="amenities-filters"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="amenity-buttons">
              {amenitiesList.map(amenity => (
                <button
                  key={amenity.key}
                  className={`amenity-btn ${selectedAmenity === amenity.key ? 'active' : ''}`}
                  onClick={() => setSelectedAmenity(amenity.key)}
                >
                  <span className="amenity-icon">{amenity.icon}</span>
                  <span className="amenity-label">{amenity.label}</span>
                  {amenity.count > 0 && (
                    <span className="amenity-count">{amenity.count}</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="amenities-content">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h3>Loading station amenities...</h3>
            </div>
          ) : (
            <motion.div 
              className="stations-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                    <div className="station-location">
                      <span className="suburb">{station.suburb}</span>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="station-name">{station.name}</h3>
                    <p className="station-address">{station.address}</p>
                    
                    <div className="amenities-list">
                      <h4>Available Amenities</h4>
                      <div className="amenities-grid">
                        {station.amenities.map(amenity => (
                          <div key={amenity} className="amenity-item">
                            <span className="amenity-icon">{getAmenityIcon(amenity)}</span>
                            <span className="amenity-text">{getAmenityLabel(amenity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="fuel-prices">
                      <h4>Current Prices</h4>
                      <div className="prices-grid">
                        <div className="price-item">
                          <span>⛽ Unleaded</span>
                          <span>{station.prices.unleaded}¢</span>
                        </div>
                        <div className="price-item">
                          <span>🔋 Premium</span>
                          <span>{station.prices.premium}¢</span>
                        </div>
                        <div className="price-item">
                          <span>🚛 Diesel</span>
                          <span>{station.prices.diesel}¢</span>
                        </div>
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
                    >
                      🗺️ Get Directions
                    </button>
                    <Link 
                      to="/map" 
                      className="btn btn-secondary btn-sm"
                    >
                      📍 View on Map
                    </Link>
                  </div>
                </motion.div>
              ))}

              {filteredStations.length === 0 && (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No stations found</h3>
                  <p>Try selecting a different amenity or check back later for more stations.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Amenity Guide */}
          <motion.div 
            className="amenity-guide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3>Understanding Station Amenities</h3>
            <div className="guide-grid">
              <div className="guide-item">
                <span className="guide-icon">🚿</span>
                <div>
                  <h4>Car Wash</h4>
                  <p>Self-service or automated car wash facilities available</p>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon">🏧</span>
                <div>
                  <h4>ATM</h4>
                  <p>ATM machines for cash withdrawals and banking services</p>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon">🍔</span>
                <div>
                  <h4>Food & Drinks</h4>
                  <p>Convenience store with snacks, drinks, and food items</p>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon">🚻</span>
                <div>
                  <h4>Toilets</h4>
                  <p>Public restroom facilities for customer use</p>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon">💨</span>
                <div>
                  <h4>Air & Water</h4>
                  <p>Free air and water services for tire inflation and cleaning</p>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon">🔥</span>
                <div>
                  <h4>LPG</h4>
                  <p>Liquefied Petroleum Gas refueling available</p>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon">🚛</span>
                <div>
                  <h4>Truck Friendly</h4>
                  <p>Accommodates large vehicles and trucks with appropriate facilities</p>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon">🕐</span>
                <div>
                  <h4>24 Hours</h4>
                  <p>Open 24 hours a day, 7 days a week</p>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon">⚡</span>
                <div>
                  <h4>EV Charging</h4>
                  <p>Electric vehicle charging stations available</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StationAmenitiesPage;
