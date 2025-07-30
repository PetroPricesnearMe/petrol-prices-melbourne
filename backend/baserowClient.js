const axios = require('axios');
const config = require('./config');

/**
 * Comprehensive Baserow API Client
 * Supports full CRUD operations for Petrol Stations and Fuel Prices tables
 * 
 * Authentication: Uses Bearer Token authentication
 * API Documentation: https://api.baserow.io/api/redoc/
 */
class BaserowClient {
  constructor() {
    this.config = config.baserow;
    
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: this.config.apiUrl,
      headers: {
        'Authorization': `Token ${this.config.token}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000 // 15 second timeout
    });

    // Add request/response interceptors for better error handling
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error.message);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // ==================== FIELD METADATA OPERATIONS ====================

  /**
   * Get field metadata for a table
   * @param {number} tableId - Table ID
   * @returns {Promise<Object>} Field metadata
   */
  async getTableFields(tableId) {
    try {
      const response = await this.client.get(`/database/fields/table/${tableId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fields for table ${tableId}:`, error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get all tables in the database
   * @returns {Promise<Object>} All tables metadata
   */
  async getAllTables() {
    try {
      const response = await this.client.get('/database/tables/all-tables/');
      return response.data;
    } catch (error) {
      console.error('Error fetching all tables:', error.message);
      throw this.handleError(error);
    }
  }

  // ==================== PETROL STATIONS OPERATIONS ====================

  /**
   * Get all petrol stations with pagination support
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Petrol stations data
   */
  async getPetrolStations(params = {}) {
    try {
      const defaultParams = {
        user_field_names: true,
        size: 50,
        ...params
      };
      
      const response = await this.client.get(
        `/database/rows/table/${this.config.tables.petrolStations.id}/`,
        { params: defaultParams }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching petrol stations:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get all petrol stations using pagination (fetches all pages)
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} All petrol stations
   */
  async getAllPetrolStations(params = {}) {
    try {
      let allStations = [];
      let next = null;
      let pageCount = 0;
      const maxRetries = 3;
      
      // Baserow API max size is 200 per request
      const pageSize = 200;
      
      console.log('🔄 Starting to fetch all petrol stations from Baserow...');
      
      do {
        const requestParams = {
          user_field_names: true,
          size: pageSize,
          ...params
        };
        
        if (next) {
          requestParams.offset = next;
        }

        let response;
        let retryCount = 0;
        
        // Retry logic for resilience
        while (retryCount < maxRetries) {
          try {
            response = await this.client.get(
              `/database/rows/table/${this.config.tables.petrolStations.id}/`,
              { params: requestParams }
            );
            break; // Success, exit retry loop
          } catch (error) {
            retryCount++;
            if (retryCount >= maxRetries) throw error;
            
            console.log(`⚠️ Request failed, retry ${retryCount}/${maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
        
        const data = response.data;
        pageCount++;
        
        // Validate response data
        if (!data.results || !Array.isArray(data.results)) {
          console.error('⚠️ Invalid response format:', data);
          throw new Error('Invalid response format from Baserow API');
        }
        
        allStations = allStations.concat(data.results);
        
        // Extract offset from next URL if it exists
        if (data.next) {
          const nextUrl = new URL(data.next);
          next = nextUrl.searchParams.get('offset');
        } else {
          next = null;
        }

        console.log(`📥 Page ${pageCount}: Fetched ${data.results.length} stations, total: ${allStations.length}${next ? ', continuing...' : ', done!'}`);
        
        // Add small delay between requests to avoid rate limiting
        if (next) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } while (next);

      console.log(`✅ Successfully fetched all ${allStations.length} petrol stations in ${pageCount} pages`);
      
      // Validate we got a reasonable number of stations
      if (allStations.length === 0) {
        console.warn('⚠️ No stations found in Baserow table');
      } else if (allStations.length < 100) {
        console.warn(`⚠️ Only ${allStations.length} stations found - expected more (e.g., 650)`);
      }
      
      return allStations;
    } catch (error) {
      console.error('❌ Error fetching all petrol stations:', error.message);
      console.error('Stack trace:', error.stack);
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific petrol station by ID
   * @param {number} stationId - Station ID
   * @returns {Promise<Object>} Petrol station data
   */
  async getPetrolStation(stationId) {
    try {
      const response = await this.client.get(
        `/database/rows/table/${this.config.tables.petrolStations.id}/${stationId}/`,
        { params: { user_field_names: true } }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching petrol station ${stationId}:`, error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new petrol station
   * @param {Object} stationData - Station data using field names or IDs
   * @returns {Promise<Object>} Created station data
   */
  async createPetrolStation(stationData) {
    try {
      // Transform field names to field IDs if using field names
      const transformedData = this.transformStationData(stationData);
      
      const response = await this.client.post(
        `/database/rows/table/${this.config.tables.petrolStations.id}/`,
        transformedData
      );
      
      console.log(`✅ Created petrol station: ${stationData.stationName || stationData[this.config.fieldIds.petrolStations.stationName]}`);
      return response.data;
    } catch (error) {
      console.error('Error creating petrol station:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Update a petrol station
   * @param {number} stationId - Station ID
   * @param {Object} updateData - Updated station data
   * @returns {Promise<Object>} Updated station data
   */
  async updatePetrolStation(stationId, updateData) {
    try {
      const transformedData = this.transformStationData(updateData);
      
      const response = await this.client.patch(
        `/database/rows/table/${this.config.tables.petrolStations.id}/${stationId}/`,
        transformedData
      );
      
      console.log(`✅ Updated petrol station ${stationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating petrol station ${stationId}:`, error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Delete a petrol station
   * @param {number} stationId - Station ID
   * @returns {Promise<boolean>} Success status
   */
  async deletePetrolStation(stationId) {
    try {
      await this.client.delete(
        `/database/rows/table/${this.config.tables.petrolStations.id}/${stationId}/`
      );
      
      console.log(`✅ Deleted petrol station ${stationId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting petrol station ${stationId}:`, error.message);
      throw this.handleError(error);
    }
  }

  // ==================== FUEL PRICES OPERATIONS ====================

  /**
   * Get fuel prices for a station or all fuel prices
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Fuel prices data
   */
  async getFuelPrices(params = {}) {
    try {
      const defaultParams = {
        user_field_names: true,
        size: 50,
        ...params
      };
      
      const response = await this.client.get(
        `/database/rows/table/${this.config.tables.fuelPrices.id}/`,
        { params: defaultParams }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching fuel prices:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new fuel price entry
   * @param {Object} priceData - Fuel price data
   * @returns {Promise<Object>} Created price data
   */
  async createFuelPrice(priceData) {
    try {
      const response = await this.client.post(
        `/database/rows/table/${this.config.tables.fuelPrices.id}/`,
        priceData
      );
      
      console.log(`✅ Created fuel price entry`);
      return response.data;
    } catch (error) {
      console.error('Error creating fuel price:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Link fuel prices to a petrol station
   * @param {number} stationId - Station ID
   * @param {Array<number>} priceIds - Array of fuel price IDs to link
   * @returns {Promise<Object>} Updated station data
   */
  async linkFuelPricesToStation(stationId, priceIds) {
    try {
      const updateData = {
        [this.config.fieldIds.petrolStations.fuelPrices]: priceIds
      };
      
      return await this.updatePetrolStation(stationId, updateData);
    } catch (error) {
      console.error(`Error linking fuel prices to station ${stationId}:`, error.message);
      throw this.handleError(error);
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Transform station data from field names to field IDs
   * @param {Object} data - Station data with field names
   * @returns {Object} Station data with field IDs
   */
  transformStationData(data) {
    const transformed = {};
    const fieldMapping = {
      stationName: this.config.fieldIds.petrolStations.stationName,
      address: this.config.fieldIds.petrolStations.address,
      city: this.config.fieldIds.petrolStations.city,
      postalCode: this.config.fieldIds.petrolStations.postalCode,
      region: this.config.fieldIds.petrolStations.region,
      country: this.config.fieldIds.petrolStations.country,
      latitude: this.config.fieldIds.petrolStations.latitude,
      longitude: this.config.fieldIds.petrolStations.longitude,
      category: this.config.fieldIds.petrolStations.category,
      fuelPrices: this.config.fieldIds.petrolStations.fuelPrices,
      locationDetails: this.config.fieldIds.petrolStations.locationDetails
    };

    // Transform field names to field IDs
    Object.keys(data).forEach(key => {
      if (fieldMapping[key]) {
        transformed[fieldMapping[key]] = data[key];
      } else {
        // If it's already a field ID or unknown field, keep as is
        transformed[key] = data[key];
      }
    });

    return transformed;
  }

  /**
   * Handle API errors with proper formatting
   * @param {Error} error - Original error
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // API responded with error status
      const { status, data } = error.response;
      const message = data?.error || data?.detail || `HTTP ${status} Error`;
      const formattedError = new Error(message);
      formattedError.status = status;
      formattedError.data = data;
      return formattedError;
    } else if (error.request) {
      // Network error
      return new Error('Network error: Unable to connect to Baserow API');
    } else {
      // Other error
      return error;
    }
  }

  /**
   * Test connection to Baserow API
   * @returns {Promise<Object>} Connection test results
   */
  async testConnection() {
    try {
      const tables = await this.getAllTables();
      const petrolStationsFields = await this.getTableFields(this.config.tables.petrolStations.id);
      
      console.log('✅ Baserow connection successful');
      console.log(`📊 Found ${tables.length || 0} tables`);
      console.log(`🏪 Petrol Stations table has ${petrolStationsFields.length || 0} fields`);
      
      return {
        connected: true,
        tablesCount: tables.length || 0,
        petrolStationsFields: petrolStationsFields.length || 0,
        config: {
          apiUrl: this.config.apiUrl,
          hasToken: !!this.config.token,
          mcpServerUrl: this.config.mcpServerUrl
        }
      };
    } catch (error) {
      console.error('❌ Baserow connection failed:', error.message);
      return {
        connected: false,
        error: error.message,
        config: {
          apiUrl: this.config.apiUrl,
          hasToken: !!this.config.token
        }
      };
    }
  }
}

module.exports = BaserowClient; 