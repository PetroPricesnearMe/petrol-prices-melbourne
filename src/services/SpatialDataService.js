/**
 * Spatial Data Service
 * 
 * This service handles ONLY minimal spatial data (coordinates + basic identifiers) 
 * required for map rendering. It enforces separation of concerns by keeping 
 * spatial data separate from complete directory data.
 * 
 * PURPOSE:
 * - Fetch minimal data for map rendering (lat/lng/name/id only)
 * - Optimize map performance with lightweight data
 * - Maintain Baserow as single source of truth
 * - Separate spatial visualization from directory management
 */

class SpatialDataService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.spatialCache = null;
    this.lastFetchTime = null;
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache (longer than directory data)
    this.isLoading = false;
  }

  /**
   * Check if spatial cache is still valid
   * @returns {boolean} True if cache is valid
   */
  isCacheValid() {
    if (!this.lastFetchTime || !this.spatialCache) return false;
    return Date.now() - this.lastFetchTime < this.cacheTimeout;
  }

  /**
   * Clear spatial data cache
   */
  clearCache() {
    console.log('🗑️ Clearing spatial data cache');
    this.spatialCache = null;
    this.lastFetchTime = null;
  }

  /**
   * Fetch minimal spatial data for map rendering
   * This method enforces the separation of concerns by only returning
   * coordinates and basic identifiers needed for map visualization.
   * 
   * @param {boolean} forceRefresh - Force refresh even if cache is valid
   * @returns {Promise<Array>} Array of minimal spatial data points
   */
  async fetchSpatialData(forceRefresh = false) {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.isCacheValid()) {
      console.log('📦 Returning cached spatial data for map rendering');
      return this.spatialCache;
    }

    // Prevent multiple simultaneous requests
    if (this.isLoading) {
      console.log('⏳ Spatial data fetch already in progress, waiting...');
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.isLoading) {
            resolve(this.spatialCache || []);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    try {
      this.isLoading = true;
      console.log('🗺️ Fetching minimal spatial data from backend...');

      const response = await fetch(`${this.baseUrl}/api/stations/spatial`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout for the request
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch spatial data');
      }

      const spatialData = result.data || [];

      // Validate spatial data structure
      const validatedData = spatialData.filter(point => {
        if (!point || typeof point !== 'object') return false;
        if (typeof point.lat !== 'number' || typeof point.lng !== 'number') return false;
        if (isNaN(point.lat) || isNaN(point.lng)) return false;
        if (!point.id || typeof point.name !== 'string') return false;
        return true;
      });

      console.log(`✅ Spatial data validation complete:`);
      console.log(`   - Raw points: ${spatialData.length}`);
      console.log(`   - Valid points: ${validatedData.length}`);
      console.log(`   - Invalid points: ${spatialData.length - validatedData.length}`);

      // Ensure we have some valid data
      if (validatedData.length === 0) {
        console.warn('⚠️ No valid spatial points received');
        return this.getFallbackSpatialData();
      }

      // Cache the validated spatial data
      this.spatialCache = validatedData;
      this.lastFetchTime = Date.now();

      console.log(`🗺️ Successfully cached ${validatedData.length} spatial points for map rendering`);
      return validatedData;

    } catch (error) {
      console.error('❌ Error fetching spatial data:', error);

      // Return cached data if available
      if (this.spatialCache) {
        console.log('🔄 Returning cached spatial data due to error');
        return this.spatialCache;
      }

      // Return fallback spatial data as last resort
      console.log('🔄 Returning fallback spatial data');
      return this.getFallbackSpatialData();

    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get fallback spatial data for testing/emergency use
   * Only contains coordinates and basic identifiers - no pricing or detailed info
   * @returns {Array} Array of minimal spatial data points
   */
  getFallbackSpatialData() {
    return [
      { 
        id: 1, 
        name: 'Shell Melbourne CBD', 
        lat: -37.8136, 
        lng: 144.9631
      },
      { 
        id: 2, 
        name: 'BP South Yarra', 
        lat: -37.8387, 
        lng: 144.9924
      },
      { 
        id: 3, 
        name: 'Caltex Richmond', 
        lat: -37.8197, 
        lng: 145.0058
      },
      { 
        id: 4, 
        name: 'Shell St Kilda', 
        lat: -37.8687, 
        lng: 144.9786
      },
      { 
        id: 5, 
        name: 'BP Carlton', 
        lat: -37.7982, 
        lng: 144.9672
      }
    ];
  }

  /**
   * Get service status information
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      serviceName: 'SpatialDataService',
      purpose: 'Minimal spatial data for map rendering only',
      isLoading: this.isLoading,
      lastFetchTime: this.lastFetchTime,
      cacheValid: this.isCacheValid(),
      cacheSize: this.spatialCache ? this.spatialCache.length : 0,
      endpoint: `${this.baseUrl}/api/stations/spatial`,
      separationOfConcerns: {
        spatialData: 'This service (coordinates only)',
        directoryData: 'DataSourceManager (complete station info)',
        dataSource: 'Baserow (single source of truth)'
      }
    };
  }

  /**
   * Test connection to spatial data endpoint
   * @returns {Promise<Object>} Connection test result
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/api/stations/spatial`, {
        method: 'HEAD', // Just check if endpoint exists
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      return {
        connected: response.ok,
        status: response.status,
        endpoint: `${this.baseUrl}/api/stations/spatial`
      };
    } catch (error) {
      console.error('❌ Spatial data connection test failed:', error);
      return {
        connected: false,
        error: error.message,
        endpoint: `${this.baseUrl}/api/stations/spatial`
      };
    }
  }
}

// Create singleton instance
const spatialDataService = new SpatialDataService();

export default spatialDataService;
