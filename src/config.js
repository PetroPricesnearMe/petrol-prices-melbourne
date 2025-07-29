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
  
  // Application Settings
  app: {
    name: process.env.REACT_APP_APP_NAME || 'Petrol Prices Near Me',
    description: process.env.REACT_APP_APP_DESCRIPTION || 'Melbourne Petrol Stations'
  }
};

// Utility functions for Baserow API calls
export const baserowAPI = {
  // Fetch all stations using pagination (via backend)
  async fetchAllStations(tableId) {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/baserow/all-rows/${tableId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch stations');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching all stations:', error.message);
      throw error;
    }
  },

  // Direct Baserow API call with pagination
  async fetchAllStationsDirect(tableId) {
    let allRows = [];
    let next = null;
    const baseUrl = `${config.baserow.apiUrl}/database/table/${tableId}/row/`;

    try {
      do {
        const url = new URL(baseUrl);
        url.searchParams.set('user_field_names', 'true');
        url.searchParams.set('size', '100');
        if (next) {
          url.searchParams.set('offset', next);
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Token ${config.baserow.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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

        console.log(`Fetched ${data.results.length} rows, total: ${allRows.length}`);
      } while (next);

      console.log(`✅ Successfully fetched all ${allRows.length} stations`);
      return allRows;
    } catch (error) {
      console.error('Error fetching stations directly:', error.message);
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