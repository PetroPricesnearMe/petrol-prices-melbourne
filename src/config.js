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

export default config; 