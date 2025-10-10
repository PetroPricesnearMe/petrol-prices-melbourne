// Backend Configuration
require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Baserow API Configuration
  baserow: {
    token: process.env.BASEROW_TOKEN,
    apiUrl: process.env.BASEROW_API_URL || 'https://api.baserow.io/api',
    databaseId: 265358,
    // MCP SSE URL for real-time updates
    mcpSseUrl: 'https://api.baserow.io/mcp/Anoz1pnwOGAZb7wHqKGwJIxPmu6jbbNN/sse',
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
    fieldIds: {
      petrolStations: {
        stationName: 'field_5072130',
        address: 'field_5072131',
        city: 'field_5072132',
        postalCode: 'field_5072133',
        region: 'field_5072134',
        country: 'field_5072135',
        latitude: 'field_5072136',
        longitude: 'field_5072137',
        category: 'field_5072138',
        fuelPrices: 'field_5072139',
        locationDetails: 'field_5072140'
      }
    }
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  
  // Application Settings
  app: {
    name: process.env.APP_NAME || 'Petrol Prices Near Me',
    description: process.env.APP_DESCRIPTION || 'Melbourne Petrol Stations'
  }
};

module.exports = config; 