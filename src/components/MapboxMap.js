import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Map, Popup, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MotionDiv } from './MotionComponents';
import spatialDataService from '../services/SpatialDataService';
import dataSourceManager from '../services/DataSourceManager';
import DiagnosticPanel from './DiagnosticPanel';
import './MapPage.css';

// Mapbox access token - you'll need to set this
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; // Replace with your token

// Check if we have a valid Mapbox token
const hasValidMapboxToken = MAPBOX_TOKEN && 
  MAPBOX_TOKEN !== 'pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV0ZXN0In0.test' &&
  MAPBOX_TOKEN.length > 50;

const MapboxMap = () => {
  // Spatial data for map rendering (minimal: coordinates + basic identifiers only)
  const [spatialData, setSpatialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected station detailed data (fetched from Baserow when needed)
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedStationDetails, setSelectedStationDetails] = useState(null);
  const [loadingStationDetails, setLoadingStationDetails] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
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

  // Fetch minimal spatial data for map rendering (enforces separation of concerns)
  useEffect(() => {
    if (!hasValidMapboxToken) return; // Don't fetch if no valid token
    
    let isMounted = true; // Prevent state updates after unmount
    
    const fetchSpatialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🗺️ Fetching minimal spatial data for map rendering...');
        console.log('📋 Separation of concerns: Map uses only coordinates + basic identifiers');
        
        const spatialPoints = await spatialDataService.fetchSpatialData();
        
        if (!isMounted) return; // Component unmounted, don't update state
        
        // Additional null check for robustness
        if (!Array.isArray(spatialPoints)) {
          console.error('❌ Invalid spatial data format received');
          throw new Error('Invalid spatial data format');
        }
        
        console.log(`✅ Spatial data loaded: ${spatialPoints.length} points for map rendering`);
        console.log('🎯 Data type: Minimal (coordinates + name + id only)');
        
        setSpatialData(spatialPoints);
        
      } catch (err) {
        if (!isMounted) return; // Component unmounted, don't update state
        
        console.error('❌ Error fetching spatial data:', err);
        
        // Provide user-friendly error message
        let errorMessage = 'Failed to load map data';
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to data source. Using sample data instead.';
        } else {
          errorMessage = `Failed to load map data: ${err.message}`;
        }
        
        setError(errorMessage);
        
        // Use fallback spatial data
        const fallbackSpatial = spatialDataService.getFallbackSpatialData();
        setSpatialData(fallbackSpatial);
        
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSpatialData();
    
    // Cleanup function - always runs on unmount
    return () => {
      console.log('🧹 Cleaning up MapboxMap spatial data resources...');
      isMounted = false;
    };
  }, []);

  // Fetch detailed station information from Baserow when user clicks on a station
  // This maintains separation of concerns: spatial data for map, detailed data on-demand
  const fetchStationDetails = async (stationId) => {
    if (!stationId) return;
    
    try {
      setLoadingStationDetails(true);
      console.log(`🔍 Fetching detailed information for station ${stationId} from Baserow...`);
      
      // Use the full DataSourceManager to get complete station data from Baserow
      const allStations = await dataSourceManager.fetchStations();
      const stationDetails = allStations.find(station => station.id === stationId);
      
      if (stationDetails) {
        console.log(`✅ Retrieved detailed data for station: ${stationDetails.name}`);
        setSelectedStationDetails(stationDetails);
      } else {
        console.warn(`⚠️ Station ${stationId} not found in directory data`);
        setSelectedStationDetails(null);
      }
      
    } catch (error) {
      console.error(`❌ Error fetching station details for ${stationId}:`, error);
      setSelectedStationDetails(null);
    } finally {
      setLoadingStationDetails(false);
    }
  };

  // Create GeoJSON for clustering using minimal spatial data (separation of concerns)
  // Memoized to prevent unnecessary re-renders
  const clusterData = useMemo(() => {
    // Early return for empty data
    if (!Array.isArray(spatialData) || spatialData.length === 0) {
      return {
        type: 'FeatureCollection',
        features: []
      };
    }
    
    // Process spatial points efficiently - only coordinates and basic identifiers
    const features = spatialData
      .filter(point => {
        // Validate spatial point data before creating feature
        return point && 
               typeof point.lat === 'number' && 
               typeof point.lng === 'number' &&
               !isNaN(point.lat) && 
               !isNaN(point.lng) &&
               point.lat >= -90 && point.lat <= 90 &&
               point.lng >= -180 && point.lng <= 180 &&
               point.id && point.name;
      })
      .map((point) => ({
        type: 'Feature',
        properties: {
          id: point.id,
          name: point.name,
          // No pricing data - enforces separation of concerns
          // Detailed data will be fetched on-demand when user clicks
        },
        geometry: {
          type: 'Point',
          coordinates: [point.lng, point.lat]
        }
      }));
    
    console.log(`🗺️ Created GeoJSON with ${features.length} spatial points out of ${spatialData.length} total`);
    console.log('🎯 Data separation: Map uses minimal spatial data, directory data fetched on-demand');
    
    return {
      type: 'FeatureCollection',
      features
    };
  }, [spatialData]);

  // Map styling constants (no price-based coloring due to separation of concerns)
  const STATION_COLOR = '#2563eb'; // Blue - consistent for all stations
  const CLUSTER_COLORS = {
    small: '#51bbd6',   // Light blue for small clusters
    medium: '#f1f075',  // Yellow for medium clusters  
    large: '#f28cb1'    // Pink for large clusters
  };

  // Cluster layer configuration (optimized for low zoom levels)
  const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'stations',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        CLUSTER_COLORS.small,
        10,
        CLUSTER_COLORS.medium,
        20,
        CLUSTER_COLORS.large
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        10,
        30,
        20,
        40
      ],
      'circle-opacity': 0.8
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
    },
    paint: {
      'text-color': '#ffffff'
    }
  };

  const unclusteredPointLayer = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'stations',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': STATION_COLOR, // Consistent color - no price data available at map level
      'circle-radius': 10,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 0.9
    }
  };

  // Layer for station icons
  const unclusteredSymbolLayer = {
    id: 'unclustered-symbol',
    type: 'symbol',
    source: 'stations',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': '⛽',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 14,
      'text-allow-overlap': true
    },
    paint: {
      'text-color': '#ffffff'
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
          <h2>Loading Spatial Map Data...</h2>
          <p>Fetching {spatialData.length > 0 ? spatialData.length + ' ' : ''}station locations from Baserow...</p>
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#1e40af'
          }}>
            <strong>🔍 Separation of Concerns:</strong>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Mapbox Token: {hasValidMapboxToken ? '✅ Valid' : '❌ Invalid/Missing'}</li>
              <li>Spatial Data: Minimal coordinates + identifiers only</li>
              <li>Directory Data: Complete station info in Baserow</li>
              <li>Performance: Optimized clustering for low zoom levels</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Validate spatial data before rendering map
  if (!Array.isArray(spatialData) || spatialData.length === 0) {
    return (
      <div className="map-page">
        <div className="loading-container">
          <div style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '8px', 
            padding: '2rem',
            textAlign: 'center',
            color: '#856404'
          }}>
            <h2>⚠️ Loading Station Data...</h2>
            <p>The backend service may be starting up or temporarily unavailable.</p>
            {error && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderRadius: '4px',
                color: '#dc2626'
              }}>
                <strong>Error Details:</strong> {error}
              </div>
            )}
            <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6 }}>
              <p><strong>Possible solutions:</strong></p>
              <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '1rem auto', paddingLeft: '1.5rem' }}>
                <li>Check if the backend server is running on port 3001</li>
                <li>Verify API_URL environment variable is set correctly</li>
                <li>Try the <a href="/directory" style={{ color: '#2563eb', textDecoration: 'underline' }}>Station Directory</a> instead</li>
                <li>Refresh the page in a few moments</li>
              </ul>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSpatialData([]);
                  setError(null);
                  window.location.reload();
                }}
              >
                🔄 Retry Loading
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDiagnostics(true)}
                style={{ background: '#f59e0b', color: 'white', border: 'none' }}
              >
                🔬 Run Diagnostics
              </button>
              <a href="/directory" className="btn btn-secondary">
                📋 View Station Directory
              </a>
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>
              <p>💡 <strong>Tip:</strong> The map uses minimal spatial data for performance. Complete station details are in the directory.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showDiagnostics && <DiagnosticPanel />}
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
            <h1>Station Location Map - Optimized Clustering</h1>
            <p>Showing {spatialData.length} petrol station locations with intelligent clustering</p>
            {error && (
              <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '5px', 
                padding: '10px', 
                marginTop: '10px',
                color: '#856404'
              }}>
                <strong>⚠️ Warning:</strong> {error}. Showing fallback spatial data.
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
              <strong>📊 Separation of Concerns:</strong> Map shows {spatialData.length} spatial points • 
              <strong> Mapbox:</strong> {hasValidMapboxToken ? '✅ Ready' : '❌ Not configured'} • 
              <strong> Directory Data:</strong> Managed in Baserow • 
              <strong> Performance:</strong> Optimized clustering
              {spatialDataService.getStatus().cacheValid && (
                <span> • <strong>Spatial Cache:</strong> ✅ Valid</span>
              )}
            </div>
            <div style={{ 
              marginTop: '0.5rem', 
              padding: '0.5rem', 
              backgroundColor: '#fef3c7', 
              borderRadius: '4px',
              fontSize: '0.8rem',
              color: '#92400e'
            }}>
              <strong>💡 Note:</strong> Click any station marker to view detailed information including prices, amenities, and contact details from Baserow.
            </div>
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
            onClick={(e) => {
              // Check if clicking on a station
              const features = e.features;
              if (features && features.length > 0) {
                const feature = features[0];
                
                if (feature.layer.id === 'unclustered-point') {
                  // Clicked on a single station - set spatial data and fetch detailed data
                  const spatialPoint = {
                    id: feature.properties.id,
                    name: feature.properties.name,
                    lat: feature.geometry.coordinates[1],
                    lng: feature.geometry.coordinates[0]
                  };
                  
                  setSelectedStation(spatialPoint);
                  setSelectedStationDetails(null); // Clear previous details
                  
                  // Fetch detailed station information from Baserow (separation of concerns)
                  fetchStationDetails(feature.properties.id);
                  
                } else if (feature.layer.id === 'clusters') {
                  // Clicked on a cluster - zoom in for better performance at low zoom levels
                  const zoom = mapRef.current.getZoom();
                  mapRef.current.easeTo({
                    center: feature.geometry.coordinates,
                    zoom: Math.min(zoom + 2, 16), // Limit max zoom
                    duration: 800
                  });
                }
              } else {
                // Clicked on empty area - clear selection
                setSelectedStation(null);
                setSelectedStationDetails(null);
              }
            }}
            // Performance optimizations
            optimizeForTerrain={true}
            renderWorldCopies={false}
            maxZoom={18}
            minZoom={8}
            // Reduce map load time
            initialViewState={viewState}
            // Disable unnecessary features for better performance
            attributionControl={false}
            logoPosition="bottom-left"
            interactiveLayerIds={['clusters', 'unclustered-point']}
            onMouseEnter={(e) => {
              if (e.features?.length > 0) {
                mapRef.current.getCanvas().style.cursor = 'pointer';
              }
            }}
            onMouseLeave={() => {
              mapRef.current.getCanvas().style.cursor = '';
            }}
            onLoad={() => {
              console.log('🗺️ Map loaded successfully');
            }}
          >
            {/* Add clustering source and layers */}
            <Source
              id="stations"
              type="geojson"
              data={clusterData}
              cluster={true}
              clusterMaxZoom={14}
              clusterRadius={50}
            >
              <Layer {...clusterLayer} />
              <Layer {...clusterCountLayer} />
              <Layer {...unclusteredPointLayer} />
              <Layer {...unclusteredSymbolLayer} />
            </Source>

            {/* The clustering layers handle all station markers efficiently */}
            {/* Individual markers are already rendered through the unclusteredPointLayer */}

            {/* Popup for selected station with separation of concerns */}
            {selectedStation && (
              <Popup
                longitude={selectedStation.lng}
                latitude={selectedStation.lat}
                anchor="top"
                onClose={() => {
                  setSelectedStation(null);
                  setSelectedStationDetails(null);
                }}
                closeButton={true}
              >
                <div className="popup-content">
                  <h3>{selectedStation.name}</h3>
                  <p className="popup-address">
                    Coordinates: {selectedStation.lat.toFixed(4)}, {selectedStation.lng.toFixed(4)}
                  </p>
                  
                  {loadingStationDetails ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '1rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      margin: '0.5rem 0'
                    }}>
                      <div className="loading-spinner" style={{ width: '20px', height: '20px', marginBottom: '0.5rem' }}></div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                        Loading detailed station information from Baserow...
                      </p>
                    </div>
                  ) : selectedStationDetails ? (
                    <div>
                      <p className="popup-address">{selectedStationDetails.address || 'Address not available'}</p>
                      
                      {selectedStationDetails.prices && (
                        <div className="popup-prices">
                          <h4 style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#374151' }}>Current Fuel Prices:</h4>
                          {Object.entries(selectedStationDetails.prices).map(([fuelType, price]) => (
                            <div key={fuelType} className="price-row">
                              <span className="fuel-type">
                                {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}
                              </span>
                              <span className="price">
                                {typeof price === 'number' ? price.toFixed(1) + '¢' : 'N/A'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#6b7280', 
                        marginTop: '0.5rem',
                        fontStyle: 'italic'
                      }}>
                        Complete directory data from Baserow
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      padding: '0.5rem',
                      backgroundColor: '#fef3c7',
                      borderRadius: '4px',
                      margin: '0.5rem 0'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e' }}>
                        Detailed information not available. Click refresh or check Baserow data.
                      </p>
                    </div>
                  )}
                  
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
                    {!loadingStationDetails && !selectedStationDetails && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => fetchStationDetails(selectedStation.id)}
                        style={{ marginLeft: '0.5rem' }}
                      >
                        Retry Loading Details
                      </button>
                    )}
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
            <h3>Spatial Map Features - Separation of Concerns</h3>
            <div className="legend-items">
              <div className="legend-item">
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: STATION_COLOR,
                  display: 'inline-block',
                  marginRight: '8px'
                }}></span>
                <span>Individual petrol stations</span>
              </div>
              <div className="legend-item">
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: CLUSTER_COLORS.small,
                  display: 'inline-block',
                  marginRight: '8px'
                }}></span>
                <span>Small clusters (&lt;10 stations)</span>
              </div>
              <div className="legend-item">
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: CLUSTER_COLORS.medium,
                  display: 'inline-block',
                  marginRight: '8px'
                }}></span>
                <span>Medium clusters (10-20 stations)</span>
              </div>
              <div className="legend-item">
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: CLUSTER_COLORS.large,
                  display: 'inline-block',
                  marginRight: '8px'
                }}></span>
                <span>Large clusters (20+ stations)</span>
              </div>
            </div>
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '6px',
              fontSize: '0.9rem',
              color: '#1e40af'
            }}>
              <strong>💡 Architecture:</strong> This map displays only spatial data (coordinates + identifiers) for optimal performance. 
              All detailed station information including prices, amenities, and directory data is managed in Baserow and loaded on-demand when you click a station.
            </div>
          </div>
        </div>
      </div>
      </MotionDiv>
    </>
  );
};

export default MapboxMap;