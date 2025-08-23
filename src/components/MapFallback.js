import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { baserowAPI } from '../config';
import './MapFallback.css';

const MapFallback = ({ error }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Try to load station data even if map fails
    const loadStations = async () => {
      try {
        const stationsData = await baserowAPI.fetchAllStations();
        const transformedStations = stationsData.slice(0, 10).map((station, index) => ({
          id: station.id || index + 1,
          name: station['Station Name'] || station.field_5072130 || `Station ${index + 1}`,
          address: station.Address || station.field_5072131 || 'Melbourne, VIC',
          city: station.City || station.field_5072132 || 'Melbourne',
          prices: {
            unleaded: 180 + Math.random() * 20,
            premium: 190 + Math.random() * 20,
            diesel: 175 + Math.random() * 20,
          }
        }));
        setStations(transformedStations);
      } catch (err) {
        console.error('Failed to load stations for fallback:', err);
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner 
        message="Loading station data..." 
        showTips={true}
        fullScreen={false}
      />
    );
  }

  return (
    <div className="map-fallback">
      <div className="fallback-header">
        <div className="error-icon">🗺️</div>
        <h2>Interactive Map Temporarily Unavailable</h2>
        <p className="error-description">
          {error?.includes('Mapbox') || error?.includes('token') 
            ? "Map service configuration needed. Please check your Mapbox access token."
            : "The interactive map is currently experiencing issues, but you can still view station data below."
          }
        </p>
      </div>

      <div className="fallback-actions">
        <Link to="/directory" className="btn btn-primary">
          <span>📋 View Full Directory</span>
        </Link>
        <button 
          className="btn btn-secondary" 
          onClick={() => window.location.reload()}
        >
          <span>🔄 Retry Map</span>
        </button>
      </div>

      {!showError && stations.length > 0 && (
        <div className="nearby-stations">
          <h3>📍 Recent Petrol Stations</h3>
          <div className="stations-grid">
            {stations.map(station => (
              <div key={station.id} className="station-card">
                <div className="station-header">
                  <h4>{station.name}</h4>
                  <span className="station-city">{station.city}</span>
                </div>
                <div className="station-address">
                  <small>{station.address}</small>
                </div>
                <div className="station-prices">
                  <div className="price-item">
                    <span className="fuel-type">Unleaded</span>
                    <span className="price">{station.prices.unleaded.toFixed(1)}¢</span>
                  </div>
                  <div className="price-item">
                    <span className="fuel-type">Premium</span>
                    <span className="price">{station.prices.premium.toFixed(1)}¢</span>
                  </div>
                  <div className="price-item">
                    <span className="fuel-type">Diesel</span>
                    <span className="price">{station.prices.diesel.toFixed(1)}¢</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="map-help">
        <h3>🔧 Fix Map Issues</h3>
        <div className="help-grid">
          <div className="help-item">
            <h4>For Users:</h4>
            <ul>
              <li>Try refreshing the page</li>
              <li>Check your internet connection</li>
              <li>Clear browser cache and cookies</li>
              <li>Use the Directory page instead</li>
            </ul>
          </div>
          <div className="help-item">
            <h4>For Developers:</h4>
            <ul>
              <li>Check REACT_APP_MAPBOX_ACCESS_TOKEN environment variable</li>
              <li>Verify Mapbox token permissions</li>
              <li>Check browser console for errors</li>
              <li>Ensure Baserow API is accessible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFallback;
