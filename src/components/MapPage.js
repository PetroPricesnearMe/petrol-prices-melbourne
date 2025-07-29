import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import { baserowAPI } from '../config';
import './MapPage.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Create custom fuel station icon
const createFuelIcon = (price) => {
  const color = price < 180 ? '#10b981' : price < 190 ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: white;
      ">⛽</div>
    `,
    className: 'fuel-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const MapPage = () => {
  const [petrolStations, setPetrolStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFuelType, setSelectedFuelType] = useState('unleaded');
  const [error, setError] = useState(null);

  // Note: Now using the new Baserow table structure with table ID 623329

  useEffect(() => {
    const fetchStationsFromBaserow = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all stations from Baserow using pagination
        const baserowStations = await baserowAPI.fetchAllStations();
        
        // Transform Baserow data to match expected format for map
        const transformedStations = baserowStations.map((station, index) => ({
          id: station.id || index + 1,
          name: station.field_5072130 || station['Station Name'] || `Station ${index + 1}`,
          lat: parseFloat(station.field_5072136 || station.Latitude || (-37.8136 + (Math.random() - 0.5) * 0.1)),
          lng: parseFloat(station.field_5072137 || station.Longitude || (144.9631 + (Math.random() - 0.5) * 0.1)),
          prices: {
            // Generate realistic prices for demo - in production, get from linked Fuel Prices
            unleaded: 180 + Math.random() * 20,
            premium: 190 + Math.random() * 20,
            diesel: 175 + Math.random() * 20
          },
          address: station.field_5072131 || station.Address || `${station.field_5072132 || 'Melbourne'}, VIC`,
          category: station.field_5072138 || station.Category,
          fuelPrices: station.field_5072139 || station['Fuel Prices'] || []
        }));

        // Limit markers to prevent performance issues
        const maxMarkers = 100;
        const limitedStations = transformedStations.slice(0, maxMarkers);
        
        setPetrolStations(limitedStations);
        console.log(`✅ Loaded ${limitedStations.length} stations for map from Baserow${transformedStations.length > maxMarkers ? ` (limited from ${transformedStations.length})` : ''}`);
        
        // Set up price update simulation
        const priceUpdateInterval = setInterval(() => {
          setPetrolStations(prev => 
            prev.map(station => ({
              ...station,
              prices: {
                unleaded: Math.max(150, Math.min(220, station.prices.unleaded + (Math.random() - 0.5) * 4)),
                premium: Math.max(160, Math.min(230, station.prices.premium + (Math.random() - 0.5) * 4)),
                diesel: Math.max(145, Math.min(215, station.prices.diesel + (Math.random() - 0.5) * 4)),
              }
            }))
          );
        }, 30000);

        return () => clearInterval(priceUpdateInterval);
      } catch (err) {
        console.error('Error fetching stations from Baserow:', err);
        setError(`Failed to load stations: ${err.message}`);
        
        // Fallback to sample data if Baserow fails
        const fallbackStations = [
          { id: 1, name: 'Shell Melbourne CBD', lat: -37.8136, lng: 144.9631, prices: { unleaded: 185.9, premium: 195.9, diesel: 179.9 }, address: '123 Collins Street, Melbourne' },
          { id: 2, name: 'BP South Yarra', lat: -37.8387, lng: 144.9924, prices: { unleaded: 182.5, premium: 192.5, diesel: 176.8 }, address: '456 Toorak Road, South Yarra' },
          { id: 3, name: 'Caltex Richmond', lat: -37.8197, lng: 145.0058, prices: { unleaded: 188.9, premium: 198.9, diesel: 183.2 }, address: '789 Swan Street, Richmond' }
        ];
        setPetrolStations(fallbackStations);
      } finally {
        setLoading(false);
      }
    };

    fetchStationsFromBaserow();

    // Simulate WebSocket connection for live updates
    const socket = io('ws://localhost:3001', { 
      autoConnect: false 
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fuelTypes = [
    { key: 'unleaded', label: 'Unleaded 91', icon: '⛽' },
    { key: 'premium', label: 'Premium 95', icon: '🔋' },
    { key: 'diesel', label: 'Diesel', icon: '🚛' }
  ];

  if (loading) {
    return (
      <div className="map-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Live Fuel Map...</h2>
          <p>Fetching station data from Baserow database...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="map-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="map-header">
        <div className="container">
          <motion.div 
            className="map-title-section"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1>Live Fuel Price Map</h1>
            <p>Real-time fuel prices across Melbourne</p>
            {error && (
              <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '5px', 
                padding: '10px', 
                marginTop: '10px',
                color: '#856404'
              }}>
                <strong>⚠️ Warning:</strong> {error}. Showing fallback data.
              </div>
            )}
          </motion.div>

          <motion.div 
            className="fuel-type-selector"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {fuelTypes.map(fuel => (
              <button
                key={fuel.key}
                className={`fuel-btn ${selectedFuelType === fuel.key ? 'active' : ''}`}
                onClick={() => setSelectedFuelType(fuel.key)}
              >
                <span className="fuel-icon">{fuel.icon}</span>
                <span className="fuel-label">{fuel.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="map-container-wrapper"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <MapContainer
          center={[-37.8136, 144.9631]}
          zoom={12}
          className="fuel-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {petrolStations.map(station => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={createFuelIcon(station.prices[selectedFuelType])}
            >
              <Popup className="fuel-popup">
                <div className="popup-content">
                  <h3>{station.name}</h3>
                  <p className="popup-address">{station.address}</p>
                  
                  <div className="popup-prices">
                    {fuelTypes.map(fuel => (
                      <div 
                        key={fuel.key}
                        className={`price-row ${selectedFuelType === fuel.key ? 'highlighted' : ''}`}
                      >
                        <span className="fuel-type">
                          <span className="fuel-icon">{fuel.icon}</span>
                          {fuel.label}
                        </span>
                        <span className="price">
                          {station.prices[fuel.key].toFixed(1)}¢
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="popup-actions">
                    <button className="btn btn-primary btn-sm">
                      Get Directions
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </motion.div>

      <div className="map-legend">
        <div className="container">
          <div className="legend-content">
            <h3>Price Guide</h3>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color green"></span>
                <span>Under 180¢ - Great Price</span>
              </div>
              <div className="legend-item">
                <span className="legend-color yellow"></span>
                <span>180-190¢ - Average Price</span>
              </div>
              <div className="legend-item">
                <span className="legend-color red"></span>
                <span>Over 190¢ - High Price</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MapPage; 