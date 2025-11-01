import React, { useState, useEffect } from 'react';

import googlePlacesService from '../services/GooglePlacesService';

import { MotionDiv } from './MotionComponents';
// CSS imported in pages/_app.js

/**
 * Google Places Search Component
 * Demonstrates Google Places API integration for finding petrol stations
 */
const GooglePlacesSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Could not get user location:', error);
        }
      );
    }
  }, []);

  // Search for petrol stations using Google Places API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const location = userLocation;
      const results = await googlePlacesService.searchPlaces({
        query: searchQuery,
        location: location,
        radius: 10000, // 10km radius
        pageSize: 20
      });

      const formattedResults = results.places?.map(place => 
        googlePlacesService.formatPlaceToStation(place)
      ) || [];

      setSearchResults(formattedResults);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search for nearby petrol stations
  const searchNearbyStations = async () => {
    if (!userLocation) {
      setError('Location not available. Please enable location access.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await googlePlacesService.searchPetrolStationsNearLocation(
        userLocation,
        5000, // 5km radius
        20
      );

      const formattedResults = results.map(place => 
        googlePlacesService.formatPlaceToStation(place)
      );

      setSearchResults(formattedResults);
    } catch (err) {
      console.error('Nearby search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search by brand
  const searchByBrand = async (brand) => {
    setLoading(true);
    setError(null);

    try {
      const location = userLocation;
      const results = await googlePlacesService.searchPetrolStationsByBrand(
        brand,
        location,
        20000 // 20km radius
      );

      const formattedResults = results.map(place => 
        googlePlacesService.formatPlaceToStation(place)
      );

      setSearchResults(formattedResults);
    } catch (err) {
      console.error('Brand search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-places-search">
      <div className="search-header">
        <h2>🔍 Find Petrol Stations with Google Places</h2>
        <p>Search for petrol stations using Google Places API integration</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for petrol stations, gas stations, fuel..."
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-btn"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? '🔍' : 'Search'}
          </button>
        </div>
      </form>

      {/* Quick Search Buttons */}
      <div className="quick-search">
        <button 
          onClick={searchNearbyStations}
          className="quick-btn"
          disabled={loading || !userLocation}
        >
          📍 Nearby Stations
        </button>
        
        <div className="brand-buttons">
          {['Shell', 'BP', '7-Eleven', 'Mobil', 'Caltex'].map(brand => (
            <button
              key={brand}
              onClick={() => searchByBrand(brand)}
              className="brand-btn"
              disabled={loading}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Found {searchResults.length} stations</h3>
          <div className="results-grid">
            {searchResults.map((station, index) => (
              <MotionDiv
                key={station.id}
                className="result-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card-header">
                  <h4 className="station-name">{station.name}</h4>
                  <span className="station-brand">{station.brand}</span>
                </div>
                
                <div className="card-content">
                  <p className="station-address">{station.address}</p>
                  
                  {station.rating > 0 && (
                    <div className="station-rating">
                      <span className="rating-stars">
                        {'★'.repeat(Math.floor(station.rating))}
                        {'☆'.repeat(5 - Math.floor(station.rating))}
                      </span>
                      <span className="rating-text">
                        {station.rating.toFixed(1)} ({station.userRatingCount} reviews)
                      </span>
                    </div>
                  )}

                  {station.phone && (
                    <p className="station-phone">📞 {station.phone}</p>
                  )}

                  {station.website && (
                    <a 
                      href={station.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="station-website"
                    >
                      🌐 Website
                    </a>
                  )}

                  <div className="card-actions">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn directions-btn"
                    >
                      🧭 Directions
                    </a>
                    
                    {station.photos && station.photos.length > 0 && (
                      <button className="action-btn photos-btn">
                        📸 Photos ({station.photos.length})
                      </button>
                    )}
                  </div>
                </div>

                {station.isGooglePlaces && (
                  <div className="google-badge">
                    <span>Powered by Google Places</span>
                  </div>
                )}
              </MotionDiv>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Searching Google Places...</p>
        </div>
      )}
    </div>
  );
};

export default GooglePlacesSearch;