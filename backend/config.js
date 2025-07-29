// Backend Configuration
require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Baserow API Configuration
  baserow: {
    token: process.env.BASEROW_TOKEN || 'WXGOdiCeNmvdj5NszzAdvIug3InwQQXP',
    apiUrl: process.env.BASEROW_API_URL || 'https://api.baserow.io/api',
    mcpServerUrl: process.env.MCP_SERVER_URL || 'https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse'
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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