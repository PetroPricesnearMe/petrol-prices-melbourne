import React, { useState, useEffect } from 'react';
// CSS imported in pages/_app.js

/**
 * Station Map Component
 * Interactive map for visualizing petrol stations with geolocation
 * Simplified version compatible with react-map-gl
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.stations - Array of station objects with lat/lng
 * @param {Function} props.onStationClick - Callback when station marker is clicked
 * @param {Object} props.selectedStation - Currently selected station
 * @param {number} props.height - Map height in pixels
 */
const StationMap = ({
  stations = [],
  onStationClick,
  selectedStation,
  height = 500
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Mapbox access token from environment variables
  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Get marker color based on fuel price
  const getMarkerColor = (station) => {
    if (!station.fuelPrices || station.fuelPrices.length === 0) return '#6B7280';

    const avgPrice = station.fuelPrices.reduce((sum, fp) =>
      sum + parseFloat(fp.price || 0), 0
    ) / station.fuelPrices.length;

    if (avgPrice < 1.80) return '#10B981'; // Green - cheap
    if (avgPrice < 2.00) return '#F59E0B'; // Orange - moderate
    return '#EF4444'; // Red - expensive
  };

  const handleMarkerClick = (station) => {
    if (onStationClick) {
      onStationClick(station);
    }
  };

  // Filter valid stations with coordinates
  const validStations = stations.filter(s => s.latitude && s.longitude);

  // Calculate map center
  const mapCenter = validStations.length > 0
    ? {
      lat: validStations.reduce((sum, s) => sum + s.latitude, 0) / validStations.length,
      lng: validStations.reduce((sum, s) => sum + s.longitude, 0) / validStations.length
    }
    : { lat: -37.8136, lng: 144.9631 }; // Default to Melbourne

  // Build map URL with markers
  const buildMapUrl = () => {
    const baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';

    // Add markers for stations (limit to first 50 for performance)
    const markers = validStations.slice(0, 50).map(station => {
      const color = getMarkerColor(station).replace('#', '');
      return `pin-s+${color}(${station.longitude},${station.latitude})`;
    }).join(',');

    // If user location is available, add it
    const userMarker = userLocation
      ? `,pin-l-marker+3B82F6(${userLocation.longitude},${userLocation.latitude})`
      : '';

    const width = 800;
    const mapHeight = 500;
    const zoom = 11;

    return `${baseUrl}/${markers}${userMarker}/${mapCenter.lng},${mapCenter.lat},${zoom}/${width}x${mapHeight}@2x?access_token=${MAPBOX_TOKEN}`;
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="station-map-container" style={{ height }}>
        <div className="map-error">
          <p>⚠️ Mapbox token not configured</p>
          <p>Please add REACT_APP_MAPBOX_TOKEN to your .env.local file</p>
        </div>
      </div>
    );
  }

  return (
    <div className="station-map-container" style={{ height }}>
      {/* Static Map Image */}
      <div className="map-static-view">
        <img
          src={buildMapUrl()}
          alt="Petrol stations map"
          className="static-map-image"
          onLoad={() => setMapLoaded(true)}
          onError={(e) => {
            console.error('Map loading error');
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Station List Overlay */}
      <div className="map-station-list">
        <h3>📍 Nearby Stations</h3>
        <div className="station-list-items">
          {validStations.slice(0, 10).map((station, index) => (
            <div
              key={station.id || index}
              className={`station-list-item ${selectedStation?.id === station.id ? 'selected' : ''}`}
              onClick={() => handleMarkerClick(station)}
            >
              <div
                className="station-color-indicator"
                style={{ background: getMarkerColor(station) }}
              ></div>
              <div className="station-info">
                <strong>{station.name}</strong>
                <small>{station.address}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#10B981' }}></span>
          Low Price
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#F59E0B' }}></span>
          Medium Price
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#EF4444' }}></span>
          High Price
        </div>
      </div>

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="map-info-banner">
        <p>📍 Showing {validStations.slice(0, 50).length} stations on map</p>
        {validStations.length > 50 && (
          <small>Limited to 50 stations for performance</small>
        )}
      </div>
    </div>
  );
};

export default StationMap;
