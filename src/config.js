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
  // Fetch all stations directly from Baserow API
  async fetchAllStations() {
    return await this.fetchAllStationsDirect(config.tables.petrolStations.id);
  },

  // Get table field metadata directly from Baserow
  async getTableFields(tableId) {
    try {
      const response = await fetch(`${config.baserow.apiUrl}/database/fields/table/${tableId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${config.baserow.token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log(`✅ Successfully fetched fields for table ${tableId}`);
      return data;
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

    console.log(`🔄 Fetching directly from Baserow API: ${baseUrl}`);

    try {
      do {
        const url = new URL(baseUrl);
        url.searchParams.set('user_field_names', 'true');
        url.searchParams.set('size', '50'); // Reduced size to avoid rate limits
        if (next) {
          url.searchParams.set('offset', next);
        }

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
            
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          } catch (fetchError) {
            if (attempt === maxRetries) throw fetchError;
            console.log(`⚠️ Attempt ${attempt + 1} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }

        const data = await response.json();
        allRows = allRows.concat(data.results);
        
        // Extract offset from next URL if it exists
        if (data.next) {
          const nextUrl = new URL(data.next);
          next = nextUrl.searchParams.get('offset');
        } else {
          next = null;
        }

        console.log(`📥 Fetched ${data.results.length} rows, total: ${allRows.length}`);
        
        // Add small delay between requests to be nice to the API
        if (next) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } while (next);

      console.log(`✅ Successfully fetched all ${allRows.length} stations directly from Baserow`);
      return allRows;
    } catch (error) {
      console.error('❌ Error fetching stations directly:', error.message);
      throw error;
    }
  },

  // Test connection to Baserow
  async testConnection() {
    try {
      const response = await fetch(`${config.baserow.apiUrl}/database/tables/all-tables/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${config.baserow.token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const tables = await response.json();
      
      console.log('✅ Baserow connection successful');
      return {
        connected: true,
        tablesCount: tables.length || 0,
        config: {
          apiUrl: config.baserow.apiUrl,
          hasToken: !!config.baserow.token,
          mcpServerUrl: config.baserow.mcpServerUrl
        }
      };
    } catch (error) {
      console.error('❌ Baserow connection failed:', error.message);
      return {
        connected: false,
        error: error.message,
        config: {
          apiUrl: config.baserow.apiUrl,
          hasToken: !!config.baserow.token
        }
      };
    }
  }
};

export default config; 