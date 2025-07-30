// Frontend Configuration
const config = {
  // Baserow API Configuration
  baserow: {
    token: process.env.REACT_APP_BASEROW_TOKEN || 'WXGOdiCeNmvdj5NszzAdvIug3InwQQXP',
    apiUrl: process.env.REACT_APP_BASEROW_API_URL || 'https://api.baserow.io/api',
    mcpServerUrl: process.env.REACT_APP_MCP_SERVER_URL || 'https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse'
  },
  
  // Backend API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001'
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
    try {
      console.log(`🔄 Fetching all stations from: ${config.api.baseUrl}/api/stations/all`);
      
      const response = await fetch(`${config.api.baseUrl}/api/stations/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(30000) // Increased timeout to 30 seconds
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
        console.error(`❌ Response body: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        console.error(`❌ API returned error: ${data.error || 'Unknown error'}`);
        throw new Error(data.error || 'Failed to fetch stations');
      }
      
      if (!data.data || !Array.isArray(data.data)) {
        console.error(`❌ Invalid data format received:`, data);
        throw new Error('Invalid data format received from API');
      }
      
      console.log(`✅ Successfully fetched ${data.data.length} stations from backend`);
      console.log(`📊 Data summary:`, {
        totalStations: data.data.length,
        count: data.count,
        hasData: !!data.data,
        isArray: Array.isArray(data.data)
      });
      
      return data.data;
    } catch (error) {
      console.error('❌ Error fetching all stations:', error.message);
      
      // If backend is not available, try direct API call as fallback
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch') || error.message.includes('timeout')) {
        console.log('🔄 Backend unavailable, trying direct Baserow API...');
        try {
          const directData = await this.fetchAllStationsDirect(config.tables.petrolStations.id);
          console.log(`✅ Direct API call successful, got ${directData.length} stations`);
          return directData;
        } catch (directError) {
          console.error('❌ Direct API also failed:', directError.message);
          throw new Error(`Both backend and direct API failed. Backend: ${error.message}, Direct: ${directError.message}`);
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

  // Direct Baserow API call with pagination
  async fetchAllStationsDirect(tableId) {
    let allRows = [];
    let next = null;
    const baseUrl = `${config.baserow.apiUrl}/database/table/${tableId}/row/`;
    const maxRetries = 3;
    const maxPages = 50; // Safety limit
    let pageCount = 0;

    console.log(`🔄 Fetching directly from Baserow API: ${baseUrl}`);

    try {
      do {
        pageCount++;
        if (pageCount > maxPages) {
          console.warn(`⚠️ Reached maximum page limit (${maxPages}), stopping pagination`);
          break;
        }
        
        const url = new URL(baseUrl);
        url.searchParams.set('user_field_names', 'true');
        url.searchParams.set('size', '100'); // Increased size to reduce requests
        if (next) {
          url.searchParams.set('offset', next);
        }

        console.log(`📄 Fetching page ${pageCount}${next ? ` (offset: ${next})` : ''}...`);

        let response;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            response = await fetch(url.toString(), {
              headers: {
                'Authorization': `Token ${config.baserow.token}`,
                'Content-Type': 'application/json'
              },
              signal: AbortSignal.timeout(15000) // 15 second timeout
            });

            if (response.ok) break;
            
            if (response.status === 429) { // Rate limited
              const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
              console.log(`⏳ Rate limited, waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries + 1}`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
            
            const errorText = await response.text();
            console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
            console.error(`❌ Response body: ${errorText}`);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          } catch (fetchError) {
            if (attempt === maxRetries) throw fetchError;
            console.log(`⚠️ Attempt ${attempt + 1} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }

        const data = await response.json();
        
        if (!data.results || !Array.isArray(data.results)) {
          console.error('❌ Invalid response format from Baserow API:', data);
          throw new Error('Invalid response format from Baserow API');
        }
        
        allRows = allRows.concat(data.results);
        
        // Extract offset from next URL if it exists
        if (data.next) {
          const nextUrl = new URL(data.next);
          next = nextUrl.searchParams.get('offset');
        } else {
          next = null;
        }

        console.log(`📥 Fetched ${data.results.length} rows from page ${pageCount}, total: ${allRows.length}`);
        
        // Add small delay between requests to be nice to the API
        if (next) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } while (next);

      console.log(`✅ Successfully fetched all ${allRows.length} stations directly from Baserow in ${pageCount} pages`);
      
      if (allRows.length === 0) {
        console.warn('⚠️ No stations found in Baserow database');
      }
      
      return allRows;
    } catch (error) {
      console.error('❌ Error fetching stations directly:', error.message);
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