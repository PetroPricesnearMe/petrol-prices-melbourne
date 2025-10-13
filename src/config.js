// Frontend Configuration
const config = {
  // Baserow API Configuration
  baserow: {
    // Public share token (for public grids - no authentication needed)
    publicToken: process.env.REACT_APP_BASEROW_PUBLIC_TOKEN || 'MIhg-ye0C_K99qvwTzoH6MCvTMAHLbwHR0C4aZKP674',
    // Database token (for authenticated API access)
    token: process.env.REACT_APP_BASEROW_TOKEN || 'G2bhijqxqtg0O05dc176fwDpaUPDSIgj',
    apiUrl: process.env.REACT_APP_BASEROW_API_URL || 'https://api.baserow.io/api',
    databaseId: 265358,
    // MCP SSE URL for real-time updates
    mcpSseUrl: process.env.REACT_APP_BASEROW_SSE_URL || 'https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse'
  },

  // Backend API Configuration - ALWAYS use backend as proxy to avoid CORS issues
  api: {
    // Default to localhost in development, require explicit URL in production
    baseUrl: process.env.REACT_APP_API_URL ||
      (window.location.hostname === 'localhost' ? 'http://localhost:3001' :
        '/api') // Use relative path in production (assumes backend is on same domain)
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
  /**
   * Fetch with exponential backoff retry logic
   * @param {string} url - URL to fetch
   * @param {object} options - Fetch options
   * @param {number} maxRetries - Maximum number of retries
   * @returns {Promise<Response>} Fetch response
   */
  async fetchWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Add timeout to each attempt
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Handle rate limiting (429)
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
          if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ Rate limited (429). Waiting ${waitTime / 1000}s before retry...`);
          }
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        // Don't retry client errors (except 429) 
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Success or server error (which we should retry)
        if (response.ok) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Request successful after ${attempt + 1} attempt(s)`);
          }
          return response;
        }

        // Server error - will retry
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      } catch (error) {
        lastError = error;

        // Don't retry on AbortError timeout after max retries
        if (process.env.NODE_ENV === 'development') {
          if (error.name === 'AbortError') {
            console.warn(`⚠️ Request timeout on attempt ${attempt + 1}/${maxRetries}`);
          } else {
            console.warn(`⚠️ Request failed on attempt ${attempt + 1}/${maxRetries}: ${error.message}`);
          }
        }

        // If this was the last attempt, throw the error
        if (attempt === maxRetries - 1) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`❌ Request failed after ${maxRetries} attempts`);
          }
          throw lastError;
        }

        // Exponential backoff: 1s, 2s, 4s, 8s, etc.
        const backoffTime = Math.pow(2, attempt) * 1000;
        if (process.env.NODE_ENV === 'development') {
          console.log(`⏳ Waiting ${backoffTime / 1000}s before retry...`);
        }
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }

    throw lastError;
  },

  // Fetch all stations using the new API endpoints
  async fetchAllStations() {
    // In production (no backend), use direct Baserow API
    if (!config.api.baseUrl || config.api.baseUrl === '/api') {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Production mode: Using direct Baserow API...');
      }
      try {
        return await this.fetchAllStationsDirect(config.tables.petrolStations.id);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Direct API failed:', error.message);
        }
        throw error;
      }
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Fetching all stations from: ${config.api.baseUrl}/api/stations/all`);
      }

      // Use retry logic for backend API calls
      const response = await this.fetchWithRetry(`${config.api.baseUrl}/api/stations/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }, 3);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch stations');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Successfully fetched ${data.data.length} stations from backend`);
      }
      return data.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error fetching all stations:', error.message);
      }

      // If backend is not available, try direct API call as fallback
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch') || error.name === 'AbortError') {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Backend unavailable, trying direct Baserow API as fallback...');
        }
        try {
          return await this.fetchAllStationsDirect(config.tables.petrolStations.id);
        } catch (directError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Direct API also failed:', directError.message);
          }
          throw directError;
        }
      }

      throw error;
    }
  },

  // Create a new petrol station
  async createStation(stationData) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Creating new station: ${stationData.stationName}`);
      }

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

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Successfully created station: ${stationData.stationName}`);
      }
      return data.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error creating station:', error.message);
      }
      throw error;
    }
  },

  // Update a petrol station
  async updateStation(stationId, updateData) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Updating station ${stationId}`);
      }

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

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Successfully updated station ${stationId}`);
      }
      return data.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ Error updating station ${stationId}:`, error.message);
      }
      throw error;
    }
  },

  // Delete a petrol station
  async deleteStation(stationId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Deleting station ${stationId}`);
      }

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

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Successfully deleted station ${stationId}`);
      }
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ Error deleting station ${stationId}:`, error.message);
      }
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

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Successfully fetched fields for table ${tableId}`);
      }
      return data.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ Error fetching table fields:`, error.message);
      }
      throw error;
    }
  },

  /**
   * Fetch all stations from Baserow, handling cursor-based pagination.
   * Note: This method should only be used as a fallback. Prefer using the backend API.
   * @param {number|string} tableId
   * @returns {Promise<Array>} All station rows
   */
  async fetchAllStationsDirect(tableId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Using direct Baserow API access. Consider using backend proxy instead.');
    }

    let rows = [];
    // Use public token if available, otherwise use authenticated token
    const usePublicToken = config.baserow.publicToken && config.baserow.publicToken !== 'your_public_token_here';
    let nextUrl = usePublicToken
      ? `${config.baserow.apiUrl}/database/rows/table/${tableId}/?user_field_names=true&size=100&public_token=${config.baserow.publicToken}`
      : `${config.baserow.apiUrl}/database/rows/table/${tableId}/?user_field_names=true&size=100`;

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Fetching directly from Baserow API: ${nextUrl.replace(config.baserow.publicToken, 'PUBLIC_TOKEN')}`);
      console.log(`📊 Database ID: ${config.baserow.databaseId}`);
      console.log(`🔑 Using ${usePublicToken ? 'public token' : 'auth token'}: ${(usePublicToken ? config.baserow.publicToken : config.baserow.token).substring(0, 8)}...`);
    }

    try {
      while (nextUrl) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`📡 Making request to: ${nextUrl.replace(config.baserow.publicToken, 'PUBLIC_TOKEN')}`);
        }

        // Build headers - only add Authorization if using auth token
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        if (!usePublicToken) {
          headers['Authorization'] = `Token ${config.baserow.token}`;
        }

        // Use exponential backoff retry logic
        const response = await this.fetchWithRetry(nextUrl, {
          method: 'GET',
          headers,
          mode: 'cors',
          credentials: 'omit'
        }, 3);

        const data = await response.json();

        if (!Array.isArray(data.results)) {
          throw new Error('Unexpected API response structure');
        }

        rows.push(...data.results);
        // Update nextUrl, preserving public_token if present
        nextUrl = data.next ? (usePublicToken ? `${data.next}&public_token=${config.baserow.publicToken}` : data.next) : null;

        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 Progress: ${rows.length} stations fetched so far...`);
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Successfully fetched ${rows.length} stations from Baserow`);
      }
      return rows;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error fetching stations from Baserow:', error.message);
      }
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error testing connection:', error.message);
      }
      throw error;
    }
  }
};

export default config; 