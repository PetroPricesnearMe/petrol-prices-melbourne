// ⚠️ DEPRECATED: This file is deprecated. Use the TypeScript version in src/server.ts
// This file is kept for reference only and will be removed in a future version.
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const BaserowClient = require('./baserowClient');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.cors.origin,
    methods: config.cors.methods
  }
});

const PORT = config.port;

// Initialize Baserow client
const baserowClient = new BaserowClient();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
  credentials: config.cors.credentials
}));

// CORS debug middleware for development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`🌐 CORS: ${req.method} ${req.path} from origin: ${req.headers.origin || 'no origin'}`);
    next();
  });
}

app.use(morgan('combined'));
app.use(express.json());

// Petrol station data now comes from Baserow database
// Table ID: 623329 (Petrol Stations)
// Using baserowClient.getAllPetrolStations() to fetch all records

// API Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Melbourne Petrol Stations API', 
    version: '1.0.0',
    endpoints: {
      'GET /api/stations': 'Get all petrol stations',
      'GET /api/stations/:id': 'Get specific station',
      'GET /api/stations/search': 'Search stations by query',
      'GET /api/prices/lowest': 'Get stations with lowest prices'
    }
  });
});

// Note: Station routes have been moved to the BASEROW section below for proper integration
// The old hardcoded sample data routes have been removed

// Socket.io connection handling
io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);
  
  try {
    // Send initial data from Baserow
    const stations = await baserowClient.getAllPetrolStations();
    socket.emit('stationsData', stations);
  } catch (error) {
    console.error('Error fetching initial stations for socket:', error);
    socket.emit('error', { message: 'Failed to load stations' });
  }
  
  // Handle client requesting live updates
  socket.on('requestLiveUpdates', () => {
    console.log('Client requested live updates');
    socket.emit('liveUpdatesEnabled', true);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Note: Real-time price updates would come from Baserow webhooks or polling
// For now, this is disabled as it requires the actual data source

// ==================== BASEROW API ENDPOINTS ====================

// Test connection endpoint
app.get('/api/baserow/test', async (req, res) => {
  try {
    const result = await baserowClient.testConnection();
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all tables
app.get('/api/baserow/tables', async (req, res) => {
  try {
    const tables = await baserowClient.getAllTables();
    res.json({
      success: true,
      data: tables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get table fields
app.get('/api/baserow/fields/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;
    const fields = await baserowClient.getTableFields(tableId);
    res.json({
      success: true,
      data: fields
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== PETROL STATIONS ENDPOINTS ====================

// IMPORTANT: More specific routes must come BEFORE generic ones to avoid route conflicts

// Get minimal spatial data for map rendering (coordinates + basic identifiers only)
app.get('/api/stations/spatial', async (req, res) => {
  try {
    console.log('🗺️ Fetching minimal spatial data for map rendering...');
    const allStations = await baserowClient.getAllPetrolStations();
    
    // Extract only the minimal data needed for map rendering
    const spatialData = allStations
      .map((station) => {
        // Extract coordinates with multiple fallback options
        let lat = station.Latitude || station.field_5072136 || station.lat;
        let lng = station.Longitude || station.field_5072137 || station.lng;
        
        // Convert to numbers
        lat = parseFloat(lat);
        lng = parseFloat(lng);
        
        // Validate coordinates
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
          return null; // Invalid coordinates, exclude from spatial data
        }
        
        // Return only minimal spatial data
        return {
          id: station.id,
          name: station['Station Name'] || station.field_5072130 || `Station ${station.id}`,
          lat: lat,
          lng: lng
        };
      })
      .filter(station => station !== null); // Remove invalid entries
    
    console.log(`✅ Extracted ${spatialData.length} valid spatial points from ${allStations.length} total stations`);
    
    res.json({
      success: true,
      data: spatialData,
      count: spatialData.length,
      type: 'spatial',
      note: 'This endpoint provides minimal data for map rendering only. Use /api/stations for complete directory data.'
    });
  } catch (error) {
    console.error('❌ Error in /api/stations/spatial:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to fetch spatial data from Baserow'
    });
  }
});

// Get all petrol stations (complete dataset) - MOVED BEFORE generic route
app.get('/api/stations/all', async (req, res) => {
  try {
    console.log('📍 Fetching ALL stations from Baserow...');
    const allStations = await baserowClient.getAllPetrolStations(req.query);
    console.log(`✅ Successfully fetched ${allStations.length} stations`);
    
    res.json({
      success: true,
      data: allStations,
      count: allStations.length
    });
  } catch (error) {
    console.error('❌ Error in /api/stations/all:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to fetch stations from Baserow'
    });
  }
});

// Get specific petrol station by ID - MOVED BEFORE generic route  
app.get('/api/stations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if it's a number (Baserow ID) or other identifier
    if (!isNaN(id)) {
      const station = await baserowClient.getPetrolStation(id);
      res.json({
        success: true,
        data: station
      });
    } else {
      // Not a valid station ID
      res.status(404).json({
        success: false,
        error: 'Invalid station ID'
      });
    }
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message
    });
  }
});

// Get petrol stations (paginated) - Now comes AFTER specific routes
app.get('/api/stations', async (req, res) => {
  try {
    console.log('📍 Fetching paginated stations from Baserow...');
    const stations = await baserowClient.getPetrolStations(req.query);
    
    res.json({
      success: true,
      data: stations.results || stations,
      count: stations.count || (stations.results ? stations.results.length : stations.length),
      next: stations.next || null,
      previous: stations.previous || null
    });
  } catch (error) {
    console.error('❌ Error in /api/stations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new petrol station
app.post('/api/stations', async (req, res) => {
  try {
    const newStation = await baserowClient.createPetrolStation(req.body);
    res.status(201).json({
      success: true,
      data: newStation
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message
    });
  }
});

// Update petrol station
app.put('/api/stations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStation = await baserowClient.updatePetrolStation(id, req.body);
    res.json({
      success: true,
      data: updatedStation
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete petrol station
app.delete('/api/stations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await baserowClient.deletePetrolStation(id);
    res.json({
      success: true,
      message: `Station ${id} deleted successfully`
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== FUEL PRICES ENDPOINTS ====================

// Get fuel prices
app.get('/api/fuel-prices', async (req, res) => {
  try {
    const prices = await baserowClient.getFuelPrices(req.query);
    res.json({
      success: true,
      data: prices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create fuel price entry
app.post('/api/fuel-prices', async (req, res) => {
  try {
    const newPrice = await baserowClient.createFuelPrice(req.body);
    res.status(201).json({
      success: true,
      data: newPrice
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message
    });
  }
});

// Link fuel prices to station
app.post('/api/stations/:id/link-prices', async (req, res) => {
  try {
    const { id } = req.params;
    const { priceIds } = req.body;
    
    if (!Array.isArray(priceIds)) {
      return res.status(400).json({
        success: false,
        error: 'priceIds must be an array'
      });
    }
    
    const updatedStation = await baserowClient.linkFuelPricesToStation(id, priceIds);
    res.json({
      success: true,
      data: updatedStation
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== LEGACY COMPATIBILITY ENDPOINTS ====================

// Legacy endpoint for backward compatibility
app.get('/api/baserow/all-rows/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;
    let allRows;
    
    if (tableId == config.baserow.tables.petrolStations.id) {
      allRows = await baserowClient.getAllPetrolStations(req.query);
    } else if (tableId == config.baserow.tables.fuelPrices.id) {
      const result = await baserowClient.getFuelPrices(req.query);
      allRows = result.results || result;
    } else {
      return res.status(400).json({
        success: false,
        error: `Unknown table ID: ${tableId}`
      });
    }
    
    res.json({
      success: true,
      data: allRows,
      count: Array.isArray(allRows) ? allRows.length : allRows?.results?.length || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready for connections`);
}); 