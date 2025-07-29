const axios = require('axios');
const config = require('./config');

class BaserowClient {
  constructor() {
    this.apiUrl = config.baserow.apiUrl;
    this.token = config.baserow.token;
    this.mcpServerUrl = config.baserow.mcpServerUrl;
    
    // Create axios instance with default headers
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Token ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Get all databases
  async getDatabases() {
    try {
      const response = await this.client.get('/database/');
      return response.data;
    } catch (error) {
      console.error('Error fetching databases:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get tables from a database
  async getTables(databaseId) {
    try {
      const response = await this.client.get(`/database/${databaseId}/table/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get rows from a table
  async getRows(tableId, params = {}) {
    try {
      const response = await this.client.get(`/database/table/${tableId}/row/`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching rows:', error.response?.data || error.message);
      throw error;
    }
  }

  // Fetch all rows from a table using cursor-based pagination
  async getAllRows(tableId, params = {}) {
    try {
      let allRows = [];
      let next = null;
      const baseParams = {
        user_field_names: true,
        size: 100,
        ...params
      };

      do {
        const requestParams = { ...baseParams };
        if (next) {
          requestParams.offset = next;
        }

        const response = await this.client.get(`/database/table/${tableId}/row/`, { 
          params: requestParams 
        });
        
        const data = response.data;
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

      console.log(`✅ Successfully fetched all ${allRows.length} rows from table ${tableId}`);
      return allRows;
    } catch (error) {
      console.error('Error fetching all rows:', error.response?.data || error.message);
      throw error;
    }
  }

  // Create a new row
  async createRow(tableId, data) {
    try {
      const response = await this.client.post(`/database/table/${tableId}/row/`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating row:', error.response?.data || error.message);
      throw error;
    }
  }

  // Update a row
  async updateRow(tableId, rowId, data) {
    try {
      const response = await this.client.patch(`/database/table/${tableId}/row/${rowId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating row:', error.response?.data || error.message);
      throw error;
    }
  }

  // Delete a row
  async deleteRow(tableId, rowId) {
    try {
      await this.client.delete(`/database/table/${tableId}/row/${rowId}/`);
      return true;
    } catch (error) {
      console.error('Error deleting row:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get MCP server connection info
  getMCPServerUrl() {
    return this.mcpServerUrl;
  }

  // Test connection to Baserow
  async testConnection() {
    try {
      const databases = await this.getDatabases();
      console.log('✅ Baserow connection successful');
      console.log(`📊 Found ${databases.results?.length || 0} databases`);
      return true;
    } catch (error) {
      console.error('❌ Baserow connection failed:', error.message);
      return false;
    }
  }
}

module.exports = BaserowClient; 