import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Map, Marker, Popup, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MotionDiv } from './MotionComponents';
import dataSourceManager from '../services/DataSourceManager';
import './MapPage.css';

// Mapbox access token - you'll need to set this
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoicGV0cm9scHJpY2VzIiwiYSI6ImNtZW82a2ZkbzEzZzEycHB4bnN2a3d6MWYifQ.hOEEwKVHFhA2_IAxvj59SA'; // Replace with your token

// Check if we have a valid Mapbox token
const hasValidMapboxToken = MAPBOX_TOKEN && 
  MAPBOX_TOKEN !== 'pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV0ZXN0In0.test' &&
  MAPBOX_TOKEN.length > 50;

const MapboxMap = () => {
  const [petrolStations, setPetrolStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFuelType, setSelectedFuelType] = useState('unleaded');
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 144.9631,
    latitude: -37.8136,
    zoom: 11
  });

  const mapRef = useRef();

  // Check Mapbox token availability
  useEffect(() => {
    if (!hasValidMapboxToken) {
      setError('Mapbox access token not configured. Please set REACT_APP_MAPBOX_ACCESS_TOKEN environment variable.');
      setLoading(false);
      return;
    }
  }, []);

  // Fetch stations using centralized data source manager
  useEffect(() => {
    if (!hasValidMapboxToken) return; // Don't fetch if no valid token
    
    const fetchStations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🚀 Fetching stations using centralized data source manager...');
        const stations = await dataSourceManager.fetchStations();
        
        console.log(`📊 Stations loaded: ${stations.length} from ${dataSourceManager.getActiveSource()}`);
        
        // Set stations data
        setPetrolStations(stations);
        console.log(`✅ Successfully loaded ${stations.length} stations for map rendering`);
        
        // Set up price update simulation only after successful data load
        const priceUpdateInterval = setInterval(() => {
          setPetrolStations(prev => 
            prev.map(station => ({
              ...station,
              prices: {
                unleaded: Math.max(150, Math.min(220, station.prices.unleaded + (Math.random() - 0.5) * 4)),
                premium: Math.max(160, Math.min(230, station.prices.premium + (Math.random() - 0.5) * 4)),
                premium98: Math.max(170, Math.min(240, station.prices.premium98 + (Math.random() - 0.5) * 4)),
                diesel: Math.max(145, Math.min(215, station.prices.diesel + (Math.random() - 0.5) * 4)),
                gas: Math.max(70, Math.min(110, station.prices.gas + (Math.random() - 0.5) * 3)),
              }
            }))
          );
        }, 30000);

        return () => clearInterval(priceUpdateInterval);
      } catch (err) {
        console.error('❌ Error fetching stations:', err);
        
        // Provide user-friendly error message
        let errorMessage = 'Failed to load stations';
        if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to data source. Using sample data instead.';
        } else {
          errorMessage = `Failed to load stations: ${err.message}`;
        }
        
        setError(errorMessage);
        
        // Data source manager will handle fallback data
        const fallbackStations = dataSourceManager.getMockStations();
        setPetrolStations(fallbackStations);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Create GeoJSON for clustering with validation
  const createClusterData = useCallback(() => {
    console.log(`🗺️ Creating GeoJSON for ${petrolStations.length} stations`);
    
    // Validate stations data before creating GeoJSON
    if (!Array.isArray(petrolStations) || petrolStations.length === 0) {
      console.warn('⚠️ No valid stations data available for GeoJSON creation');
      return {
        type: 'FeatureCollection',
        features: []
      };
    }
    
    const geoJsonData = {
      type: 'FeatureCollection',
      features: petrolStations.map((station, index) => {
        // Validate station data before creating feature
        if (!station || typeof station.lat !== 'number' || typeof station.lng !== 'number') {
          console.warn(`⚠️ Invalid station data at index ${index}:`, station);
          return null;
        }
        
        const feature = {
          type: 'Feature',
          properties: {
            id: station.id,
            name: station.name || `Station ${index + 1}`,
            price: station.prices?.[selectedFuelType] || 0,
            address: station.address || 'Unknown address',
            ...station.prices
          },
          geometry: {
            type: 'Point',
            coordinates: [station.lng, station.lat]
          }
        };
        
        if (index < 5) { // Log first 5 features for debugging
          console.log(`📍 Feature ${index + 1}:`, feature);
        }
        
        return feature;
      }).filter(feature => feature !== null) // Remove invalid features
    };
    
    console.log(`✅ GeoJSON created with ${geoJsonData.features.length} valid features`);
    
    // Validate GeoJSON structure
    if (geoJsonData.features.length === 0) {
      console.error('❌ No valid features in GeoJSON - this will cause map rendering issues');
    }
    
    return geoJsonData;
  }, [petrolStations, selectedFuelType]);

  // Get marker color based on price
  const getMarkerColor = (price) => {
    if (price < 180) return '#10b981'; // Green - cheap
    if (price < 190) return '#f59e0b'; // Yellow - average
    return '#ef4444'; // Red - expensive
  };

  const fuelTypes = [
    { key: 'unleaded', label: 'Unleaded 91', icon: '⛽' },
    { key: 'premium', label: 'Premium 95', icon: '🔋' },
    { key: 'premium98', label: 'Premium 98', icon: '⚡' },
    { key: 'diesel', label: 'Diesel', icon: '🚛' },
    { key: 'gas', label: 'Gas', icon: '🔥' }
  ];

  // Cluster layer configuration
  const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'stations',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        10,
        '#f1f075',
        20,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        10,
        30,
        20,
        40
      ]
    }
  };

  const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'stations',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  };

  const unclusteredPointLayer = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'stations',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': [
        'case',
        ['<', ['get', 'price'], 180], '#10b981',
        ['<', ['get', 'price'], 190], '#f59e0b',
        '#ef4444'
      ],
      'circle-radius': 8,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff'
    }
  };

  // Early return if no valid Mapbox token
  if (!hasValidMapboxToken) {
    return (
      <div className="map-page">
        <div className="map-header">
          <div className="container">
            <div className="map-title-section">
              <h1>Map Configuration Required</h1>
              <div style={{ 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: '8px', 
                padding: '1rem',
                marginTop: '1rem',
                color: '#dc2626'
              }}>
                <h3>⚠️ Mapbox Access Token Missing</h3>
                <p>To display the interactive map, you need to configure a valid Mapbox access token.</p>
                <div style={{ marginTop: '1rem' }}>
                  <h4>Setup Instructions:</h4>
                  <ol style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                    <li>Get a free Mapbox access token from <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>Mapbox</a></li>
                    <li>Create a <code>.env</code> file in your project root</li>
                    <li>Add: <code>REACT_APP_MAPBOX_ACCESS_TOKEN=your_token_here</code></li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <a href="/directory" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                    View Station Directory Instead
                  </a>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.location.reload()}
                  >
                    Retry After Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="map-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Enhanced Fuel Map...</h2>
          <p>Fetching all {petrolStations.length > 0 ? petrolStations.length + ' ' : ''}stations from Baserow database...</p>
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#1e40af'
          }}>
            <strong>🔍 Debug Info:</strong>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Mapbox Token: {hasValidMapboxToken ? '✅ Valid' : '❌ Invalid/Missing'}</li>
              <li>Data Source: Baserow API</li>
              <li>Validation: Checking coordinates and data structure</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Validate data before rendering map
  if (!Array.isArray(petrolStations) || petrolStations.length === 0) {
    return (
      <div className="map-page">
        <div className="loading-container">
          <div style={{ 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '2rem',
            textAlign: 'center',
            color: '#dc2626'
          }}>
            <h2>❌ No Station Data Available</h2>
            <p>Unable to load petrol station data for map rendering.</p>
            {error && <p><strong>Error:</strong> {error}</p>}
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
              style={{ marginTop: '1rem' }}
            >
              🔄 Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MotionDiv 
      className="map-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="map-header">
        <div className="container">
          <MotionDiv 
            className="map-title-section"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1>Live Fuel Price Map - Mapbox Edition</h1>
            <p>All {petrolStations.length} petrol stations across Melbourne with smart clustering</p>
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
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '6px',
              fontSize: '0.9rem',
              color: '#1e40af'
            }}>
              <strong>📊 Data Status:</strong> {petrolStations.length} valid stations loaded • 
              <strong> Mapbox:</strong> {hasValidMapboxToken ? '✅ Ready' : '❌ Not configured'} • 
              <strong> Source:</strong> {dataSourceManager.getActiveSource().toUpperCase()} API
              {dataSourceManager.getStatus().cacheValid && (
                <span> • <strong>Cache:</strong> ✅ Valid</span>
              )}
            </div>
          </MotionDiv>

          <MotionDiv 
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
          </MotionDiv>
        </div>
      </div>

      <MotionDiv 
        className="map-container-wrapper"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div style={{ height: '70vh', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
          <Map
            ref={mapRef}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            onClick={() => setSelectedStation(null)}
          >
            {/* Add clustering source and layers */}
            <Source
              id="stations"
              type="geojson"
              data={createClusterData()}
              cluster={true}
              clusterMaxZoom={14}
              clusterRadius={50}
            >
              <Layer {...clusterLayer} />
              <Layer {...clusterCountLayer} />
              <Layer {...unclusteredPointLayer} />
            </Source>

            {/* Individual markers for selected stations */}
            {petrolStations.map((station, index) => {
              if (index < 3) { // Log first 3 markers for debugging
                console.log(`🎯 Rendering marker ${index + 1}:`, {
                  id: station.id,
                  name: station.name,
                  coordinates: [station.lng, station.lat],
                  price: station.prices[selectedFuelType]
                });
              }
              
              return (
                <Marker
                  key={station.id}
                  longitude={station.lng}
                  latitude={station.lat}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    console.log(`🖱️ Marker clicked:`, station.name);
                    setSelectedStation(station);
                  }}
                >
                  <div
                    style={{
                      backgroundColor: getMarkerColor(station.prices[selectedFuelType]),
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: '3px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    ⛽
                  </div>
                </Marker>
              );
            })}

            {/* Popup for selected station */}
            {selectedStation && (
              <Popup
                longitude={selectedStation.lng}
                latitude={selectedStation.lat}
                anchor="top"
                onClose={() => setSelectedStation(null)}
                closeButton={true}
              >
                <div className="popup-content">
                  <h3>{selectedStation.name}</h3>
                  <p className="popup-address">{selectedStation.address}</p>
                  
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
                          {selectedStation.prices[fuel.key].toFixed(1)}¢
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="popup-actions">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        // Open directions in default map app
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedStation.lat},${selectedStation.lng}`;
                        window.open(url, '_blank');
                      }}
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </MotionDiv>

      <div className="map-legend">
        <div className="container">
          <div className="legend-content">
            <h3>Enhanced Map Features</h3>
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
              <div className="legend-item">
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#51bbd6',
                  display: 'inline-block',
                  marginRight: '8px'
                }}></span>
                <span>Clusters show nearby stations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

export default MapboxMap;