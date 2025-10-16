/**
 * Centralized Data Source Manager
 * 
 * This service manages all data sources and ensures only one source is active at a time.
 * It prevents conflicts between different data sources and provides a unified interface.
 */

import { baserowAPI } from '../config';
import { validateAndTransformStation, getUserFriendlyError } from '../utils/validation';
import localDataService from './LocalDataService';
// validateStations currently unused - commented out to fix ESLint warning

class DataSourceManager {
  constructor() {
    this.activeSource = 'local'; // Default to local GeoJSON/CSV data
    this.dataCache = new Map();
    this.isLoading = false;
    this.lastFetchTime = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Get the currently active data source
   * @returns {string} Active data source name
   */
  getActiveSource() {
    return this.activeSource;
  }

  /**
   * Set the active data source
   * @param {string} source - Data source name ('baserow', 'airtable', 'mock')
   */
  setActiveSource(source) {
    console.log(`🔄 Switching data source from ${this.activeSource} to ${source}`);
    this.activeSource = source;
    this.clearCache(); // Clear cache when switching sources
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    console.log('🗑️ Clearing data cache');
    this.dataCache.clear();
    this.lastFetchTime = null;
  }

  /**
   * Check if cached data is still valid
   * @returns {boolean} True if cache is valid
   */
  isCacheValid() {
    if (!this.lastFetchTime) return false;
    return Date.now() - this.lastFetchTime < this.cacheTimeout;
  }

  /**
   * Validate station data structure
   * Enhanced with comprehensive field mapping for Baserow compatibility
   * @param {Object} station - Station data to validate
   * @param {number} index - Station index for logging
   * @returns {Object} Validation result
   */
  validateStationData(station, index) {
    if (!station || typeof station !== 'object') {
      return { valid: false, reason: 'Invalid station object' };
    }

    // Extract coordinates with comprehensive fallback options
    // Priority: Standard names -> Baserow field IDs -> Common alternatives
    // This handles both human-readable field names and Baserow's auto-generated field IDs
    let lat =
      station.Latitude ||
      station.latitude ||
      station.lat ||
      station.Y ||
      station.field_5072136 || // Baserow field ID format
      station.field5072136 ||
      null;

    let lng =
      station.Longitude ||
      station.longitude ||
      station.lng ||
      station.X ||
      station.field_5072137 || // Baserow field ID format
      station.field5072137 ||
      null;

    // Convert to numbers if they're strings
    if (lat !== null && typeof lat === 'string') lat = parseFloat(lat);
    if (lng !== null && typeof lng === 'string') lng = parseFloat(lng);

    // Enhanced coordinate validation with detailed logging
    if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
      console.warn(`⚠️ Station ${index + 1} has invalid coordinates:`, {
        lat,
        lng,
        stationId: station.id,
        stationName: station['Station Name'] || station.station_name || station.name,
        availableFields: Object.keys(station).filter(k =>
          k.toLowerCase().includes('lat') ||
          k.toLowerCase().includes('long') ||
          k.toLowerCase().includes('x') ||
          k.toLowerCase().includes('y')
        )
      });
      return { valid: false, reason: 'Invalid coordinates' };
    }

    // Validate coordinate ranges for Australia
    if (lat < -45.0 || lat > -10.0 || lng < 110.0 || lng > 155.0) {
      console.warn(`⚠️ Station ${index + 1} outside Australia:`, {
        lat,
        lng,
        name: station['Station Name'] || station.station_name || station.name
      });
      return { valid: false, reason: 'Coordinates outside Australia' };
    }

    return { valid: true, lat, lng };
  }

  /**
   * Transform station data with consistent field mapping
   * Uses comprehensive validation and enhanced coordinate extraction
   * @param {Object} station - Raw station data
   * @param {number} index - Station index
   * @returns {Object|null} Transformed station data or null if invalid
   */
  transformStationData(station, index) {
    // First validate coordinates using our enhanced validation
    const validation = this.validateStationData(station, index);

    if (!validation.valid) {
      return null;
    }

    // Use the comprehensive validation and transformation utility
    const result = validateAndTransformStation(station, index);

    if (!result.valid) {
      console.warn(`⚠️ Skipping invalid station at index ${index}:`, result.errors);
      return null;
    }

    // Ensure coordinates are properly set from our validation
    // This guarantees we have valid lat/lng even if the transform utility missed them
    const transformedStation = {
      ...result.station,
      latitude: validation.lat,
      longitude: validation.lng,
      lat: validation.lat,
      lng: validation.lng,
      source: this.activeSource,
      // Ensure fuelPrices is always an array
      fuelPrices: Array.isArray(result.station.fuelPrices)
        ? result.station.fuelPrices.filter(f => f && typeof f === 'object')
        : []
    };

    return transformedStation;
  }

  /**
   * Fetch stations from the active data source
   * @param {boolean} forceRefresh - Force refresh even if cache is valid
   * @returns {Promise<Array>} Array of transformed station data
   */
  async fetchStations(forceRefresh = false) {
    const cacheKey = `stations_${this.activeSource}`;

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.isCacheValid() && this.dataCache.has(cacheKey)) {
      console.log('📦 Returning cached station data');
      return this.dataCache.get(cacheKey);
    }

    // Prevent multiple simultaneous requests
    if (this.isLoading) {
      console.log('⏳ Data fetch already in progress, waiting...');
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const maxWaitTime = 15000; // 15 seconds max wait
        
        const checkLoading = () => {
          const elapsed = Date.now() - startTime;
          
          if (!this.isLoading) {
            console.log(`✅ Wait completed after ${elapsed}ms`);
            resolve(this.dataCache.get(cacheKey) || []);
          } else if (elapsed >= maxWaitTime) {
            console.error(`⏰ Wait timeout after ${elapsed}ms - isLoading flag stuck!`);
            this.isLoading = false; // Force reset the flag
            reject(new Error('Data fetch wait timeout - concurrent request took too long'));
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    try {
      this.isLoading = true;
      console.log(`🚀 Fetching stations from ${this.activeSource}...`);

      let rawStations = [];

      switch (this.activeSource) {
        case 'local':
          try {
            rawStations = await localDataService.fetchStations();
          } catch (error) {
            console.warn('⚠️ Local data failed, trying Baserow...', error.message);
            this.setActiveSource('baserow');
            try {
              rawStations = await baserowAPI.fetchAllStations();
            } catch (baserowError) {
              console.warn('⚠️ Baserow also failed, using mock data', baserowError.message);
              this.setActiveSource('mock');
              rawStations = this.getMockStations();
            }
          }
          break;
        case 'baserow':
          try {
            rawStations = await baserowAPI.fetchAllStations();
          } catch (error) {
            console.warn('⚠️ Baserow API failed, falling back to mock data:', error.message);
            console.log('🔄 Switching to mock data source due to API issues');
            this.setActiveSource('mock');
            rawStations = this.getMockStations();
          }
          break;
        case 'airtable':
          // Airtable integration would go here
          throw new Error('Airtable integration not implemented');
        case 'mock':
          rawStations = this.getMockStations();
          break;
        default:
          throw new Error(`Unknown data source: ${this.activeSource}`);
      }

      console.log(`📊 Raw data received: ${rawStations.length} stations from ${this.activeSource}`);

      // Validate that we received data
      if (!Array.isArray(rawStations) || rawStations.length === 0) {
        throw new Error(`No station data received from ${this.activeSource}`);
      }

      // Transform and validate all station data
      const transformedStations = rawStations
        .map((station, index) => this.transformStationData(station, index))
        .filter(station => station !== null); // Remove invalid stations

      console.log(`📈 Data transformation complete:`);
      console.log(`   - Raw stations: ${rawStations.length}`);
      console.log(`   - Valid stations: ${transformedStations.length}`);
      console.log(`   - Invalid stations: ${rawStations.length - transformedStations.length}`);

      // Validate that we have enough valid stations
      if (transformedStations.length === 0) {
        throw new Error('No valid stations found after data transformation');
      }

      if (transformedStations.length < 10) {
        console.warn(`⚠️ Only ${transformedStations.length} valid stations found - this may indicate data quality issues`);
      }

      // Cache the transformed data
      this.dataCache.set(cacheKey, transformedStations);
      this.lastFetchTime = Date.now();

      console.log(`✅ Successfully loaded ${transformedStations.length} stations from ${this.activeSource}`);
      return transformedStations;

    } catch (error) {
      console.error(`❌ Error fetching stations from ${this.activeSource}:`, error);

      // Create user-friendly error message
      const userMessage = getUserFriendlyError(error, 'loading station data');
      console.log(`💬 User-friendly message: ${userMessage}`);

      // Store the user-friendly error message
      this.lastError = {
        technical: error.message,
        userFriendly: userMessage,
        timestamp: new Date().toISOString()
      };

      // Return fallback data if available
      if (this.dataCache.has(cacheKey)) {
        console.log('🔄 Returning cached data due to error');
        return this.dataCache.get(cacheKey);
      }

      // Return mock data as last resort
      console.log('🔄 Returning mock data as fallback');
      return this.getMockStations();

    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get mock station data for testing/fallback
   * @returns {Array} Array of mock station data
   */
  getMockStations() {
    return [
      {
        id: 1,
        name: 'Shell Melbourne CBD',
        lat: -37.8136,
        lng: 144.9631,
        prices: { unleaded: 185.9, premium: 195.9, premium98: 210.5, diesel: 179.9, gas: 95.2 },
        address: '123 Collins Street, Melbourne',
        city: 'Melbourne',
        source: 'mock',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 2,
        name: 'BP South Yarra',
        lat: -37.8387,
        lng: 144.9924,
        prices: { unleaded: 182.5, premium: 192.5, premium98: 207.8, diesel: 176.8, gas: 92.1 },
        address: '456 Toorak Road, South Yarra',
        city: 'South Yarra',
        source: 'mock',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Caltex Richmond',
        lat: -37.8197,
        lng: 145.0058,
        prices: { unleaded: 188.9, premium: 198.9, premium98: 213.2, diesel: 183.2, gas: 97.5 },
        address: '789 Swan Street, Richmond',
        city: 'Richmond',
        source: 'mock',
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  /**
   * Get the last error with user-friendly message
   * @returns {Object|null} Last error information or null
   */
  getLastError() {
    return this.lastError || null;
  }

  /**
   * Clear the last error
   */
  clearError() {
    this.lastError = null;
  }

  /**
   * Get data source status information
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      activeSource: this.activeSource,
      isLoading: this.isLoading,
      lastFetchTime: this.lastFetchTime,
      cacheValid: this.isCacheValid(),
      cacheSize: this.dataCache.size,
      availableSources: ['local', 'baserow', 'airtable', 'mock'],
      lastError: this.lastError
    };
  }

  /**
   * Test connection to the active data source
   * @returns {Promise<Object>} Connection test result
   */
  async testConnection() {
    try {
      switch (this.activeSource) {
        case 'local':
          // Test if local files are accessible
          try {
            const response = await fetch('/data/stations.geojson', { method: 'HEAD' });
            return { connected: response.ok, source: 'local (GeoJSON)' };
          } catch {
            return { connected: false, error: 'Local data files not accessible' };
          }
        case 'baserow':
          return await baserowAPI.testConnection();
        case 'airtable':
          throw new Error('Airtable integration not implemented');
        case 'mock':
          return { connected: true, source: 'mock' };
        default:
          throw new Error(`Unknown data source: ${this.activeSource}`);
      }
    } catch (error) {
      console.error(`❌ Connection test failed for ${this.activeSource}:`, error);
      return { connected: false, error: error.message };
    }
  }
}

// Create singleton instance
const dataSourceManager = new DataSourceManager();

export default dataSourceManager;
