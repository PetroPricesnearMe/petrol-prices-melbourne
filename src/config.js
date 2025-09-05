// Frontend Configuration
const config = {
  // Baserow API Configuration
  baserow: {
    token: process.env.REACT_APP_BASEROW_TOKEN || 'WXGOdiCeNmvdj5NszzAdvIug3InwQQXP',
    apiUrl: process.env.REACT_APP_BASEROW_API_URL || 'https://api.baserow.io/api',
    databaseId: 265358,
    // CORS proxy for development
    corsProxy: process.env.REACT_APP_CORS_PROXY || 'https://cors-anywhere.herokuapp.com/'
  },
  
  // Backend API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : null)
  },

  // Baserow Table Configuration
  tables: {
    petrolStations: {
      id: 623329,
      name: 'Petrol Stations'
    },
    fuelPrices: {
      id: 623330,
      name: 'Fuel Prices'  
    },
    airtableImport: {
      id: 623331,
      name: 'Airtable import report'
    }
  },
  
  // Application Settings
  app: {
    name: process.env.REACT_APP_APP_NAME || 'Petrol Prices Near Me',
    description: process.env.REACT_APP_APP_DESCRIPTION || 'Melbourne Petrol Stations'
  }
};

// Utility functions for Baserow API calls
export const baserowAPI = {
  // Fetch all stations using the new API endpoints
  async fetchAllStations() {
    // In production (no backend), use direct Baserow API
    if (!config.api.baseUrl) {
      console.log('🔄 Production mode: Using direct Baserow API...');
      try {
        return await this.fetchAllStationsDirect(config.tables.petrolStations.id);
      } catch (error) {
        console.error('❌ Direct API failed:', error.message);
        throw error;
      }
    }

    try {
      console.log(`🔄 Fetching all stations from: ${config.api.baseUrl}/api/stations/all`);
      
      const response = await fetch(`${config.api.baseUrl}/api/stations/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch stations');
      }
      
      console.log(`✅ Successfully fetched ${data.data.length} stations from backend`);
      return data.data;
    } catch (error) {
      console.error('❌ Error fetching all stations:', error.message);
      
      // If backend is not available, try direct API call as fallback
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        console.log('🔄 Backend unavailable, trying direct Baserow API...');
        try {
          return await this.fetchAllStationsDirect(config.tables.petrolStations.id);
        } catch (directError) {
          console.error('❌ Direct API also failed:', directError.message);
        }
      }
      
      throw error;
    }
  },

  // Create a new petrol station
  async createStation(stationData) {
    try {
      console.log(`🔄 Creating new station: ${stationData.stationName}`);
      
      const response = await fetch(`${config.api.baseUrl}/api/stations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stationData),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create station');
      }
      
      console.log(`✅ Successfully created station: ${stationData.stationName}`);
      return data.data;
    } catch (error) {
      console.error('❌ Error creating station:', error.message);
      throw error;
    }
  },

  // Update a petrol station
  async updateStation(stationId, updateData) {
    try {
      console.log(`🔄 Updating station ${stationId}`);
      
      const response = await fetch(`${config.api.baseUrl}/api/stations/${stationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update station');
      }
      
      console.log(`✅ Successfully updated station ${stationId}`);
      return data.data;
    } catch (error) {
      console.error(`❌ Error updating station ${stationId}:`, error.message);
      throw error;
    }
  },

  // Delete a petrol station
  async deleteStation(stationId) {
    try {
      console.log(`🔄 Deleting station ${stationId}`);
      
      const response = await fetch(`${config.api.baseUrl}/api/stations/${stationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete station');
      }
      
      console.log(`✅ Successfully deleted station ${stationId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting station ${stationId}:`, error.message);
      throw error;
    }
  },

  // Get table field metadata
  async getTableFields(tableId) {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/baserow/fields/${tableId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch table fields');
      }
      
      console.log(`✅ Successfully fetched fields for table ${tableId}`);
      return data.data;
    } catch (error) {
      console.error(`❌ Error fetching table fields:`, error.message);
      throw error;
    }
  },

  /**
   * Fetch all stations from Baserow, handling cursor-based pagination.
   * @param {number|string} tableId
   * @returns {Promise<Array>} All station rows
   */
  async fetchAllStationsDirect(tableId) {
    let rows = [];
    let nextUrl = `${config.baserow.apiUrl}/database/rows/table/${tableId}/?user_field_names=true&size=100`;
    
    console.log(`🔄 Fetching directly from Baserow API: ${nextUrl}`);
    console.log(`📊 Database ID: ${config.baserow.databaseId}`);
    console.log(`🔑 Using token: ${config.baserow.token.substring(0, 8)}...`);
    
    try {
      while (nextUrl) {
        console.log(`📡 Making request to: ${nextUrl}`);
        
        let retryCount = 0;
        const maxRetries = 3;
        let response;
        
        while (retryCount < maxRetries) {
          try {
            // Try direct API first
            response = await fetch(nextUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Token ${config.baserow.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              mode: 'cors',
              credentials: 'omit',
              signal: AbortSignal.timeout(10000)
            });
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            break; // Success, exit retry loop
          } catch (error) {
            console.warn(`⚠️ Direct API attempt ${retryCount + 1} failed:`, error.message);
            
            // If CORS error, try with a different approach
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
              console.log('🔄 Trying CORS proxy...');
              try {
                const proxyUrl = `${config.baserow.corsProxy}${nextUrl}`;
                response = await fetch(proxyUrl, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Token ${config.baserow.token}`,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                  },
                  mode: 'cors',
                  credentials: 'omit',
                  signal: AbortSignal.timeout(15000)
                });
                
                if (!response.ok) {
                  throw new Error(`Proxy HTTP ${response.status}: ${response.statusText}`);
                }
                break;
              } catch (corsError) {
                console.warn('⚠️ CORS proxy also failed:', corsError.message);
                throw error; // Re-throw original error
              }
            }
            
            retryCount++;
            if (retryCount >= maxRetries) {
              console.error(`❌ Failed after ${maxRetries} attempts:`, error.message);
              throw error;
            }
            console.log(`⚠️ Attempt ${retryCount} failed, retrying...`);
            // eslint-disable-next-line no-loop-func
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data.results)) {
          throw new Error('Unexpected API response structure');
        }
        
        rows.push(...data.results);
        nextUrl = data.next; // Will be null when done
      }
      
      console.log(`✅ Successfully fetched ${rows.length} stations from Baserow`);
      return rows;
    } catch (error) {
      console.error('❌ Error fetching stations from Baserow:', error.message);
      throw error;
    }
  },

  // Test connection to Baserow
  async testConnection() {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/baserow/test`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error testing connection:', error.message);
      throw error;
    }
  }
};

export default config; 