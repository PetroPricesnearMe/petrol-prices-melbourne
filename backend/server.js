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

// Sample petrol station data
let petrolStations = [
  { 
    id: 1, 
    name: 'Shell Melbourne CBD', 
    brand: 'Shell', 
    lat: -37.8136, 
    lng: 144.9631, 
    suburb: 'Melbourne',
    prices: { unleaded: 185.9, premium: 195.9, diesel: 179.9 }, 
    address: '123 Collins Street, Melbourne', 
    phone: '(03) 9999 1111', 
    hours: '24/7',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 2, 
    name: 'BP South Yarra', 
    brand: 'BP', 
    lat: -37.8387, 
    lng: 144.9924, 
    suburb: 'South Yarra',
    prices: { unleaded: 182.5, premium: 192.5, diesel: 176.8 }, 
    address: '456 Toorak Road, South Yarra', 
    phone: '(03) 9999 2222', 
    hours: '6:00 AM - 10:00 PM',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 3, 
    name: 'Caltex Richmond', 
    brand: 'Caltex', 
    lat: -37.8197, 
    lng: 145.0058, 
    suburb: 'Richmond',
    prices: { unleaded: 188.9, premium: 198.9, diesel: 183.2 }, 
    address: '789 Swan Street, Richmond', 
    phone: '(03) 9999 3333', 
    hours: '24/7',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 4, 
    name: '7-Eleven Carlton', 
    brand: '7-Eleven', 
    lat: -37.7983, 
    lng: 144.9648, 
    suburb: 'Carlton',
    prices: { unleaded: 179.9, premium: 189.9, diesel: 175.5 }, 
    address: '321 Lygon Street, Carlton', 
    phone: '(03) 9999 4444', 
    hours: '24/7',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 5, 
    name: 'United Petroleum Fitzroy', 
    brand: 'United', 
    lat: -37.7979, 
    lng: 144.9796, 
    suburb: 'Fitzroy',
    prices: { unleaded: 177.5, premium: 187.5, diesel: 173.9 }, 
    address: '654 Brunswick Street, Fitzroy', 
    phone: '(03) 9999 5555', 
    hours: '5:00 AM - 11:00 PM',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 6, 
    name: 'Shell St Kilda', 
    brand: 'Shell', 
    lat: -37.8688, 
    lng: 144.9842, 
    suburb: 'St Kilda',
    prices: { unleaded: 183.9, premium: 193.9, diesel: 178.5 }, 
    address: '987 Acland Street, St Kilda', 
    phone: '(03) 9999 6666', 
    hours: '24/7',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 7, 
    name: 'BP Hawthorn', 
    brand: 'BP', 
    lat: -37.8208, 
    lng: 145.0290, 
    suburb: 'Hawthorn',
    prices: { unleaded: 186.9, premium: 196.9, diesel: 181.3 }, 
    address: '159 Burke Road, Hawthorn', 
    phone: '(03) 9999 7777', 
    hours: '6:00 AM - 10:00 PM',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 8, 
    name: 'Ampol Prahran', 
    brand: 'Ampol', 
    lat: -37.8468, 
    lng: 144.9896, 
    suburb: 'Prahran',
    prices: { unleaded: 184.5, premium: 194.5, diesel: 179.8 }, 
    address: '753 High Street, Prahran', 
    phone: '(03) 9999 8888', 
    hours: '24/7',
    lastUpdated: new Date().toISOString()
  }
];

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

// Get all petrol stations
app.get('/api/stations', (req, res) => {
  try {
    res.json({
      success: true,
      count: petrolStations.length,
      data: petrolStations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get specific station by ID
app.get('/api/stations/:id', (req, res) => {
  try {
    const station = petrolStations.find(s => s.id === parseInt(req.params.id));
    
    if (!station) {
      return res.status(404).json({
        success: false,
        error: 'Station not found'
      });
    }
    
    res.json({
      success: true,
      data: station
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Search stations
app.get('/api/stations/search', (req, res) => {
  try {
    const { q, brand, suburb } = req.query;
    let filteredStations = [...petrolStations];
    
    if (q) {
      const query = q.toLowerCase();
      filteredStations = filteredStations.filter(station => 
        station.name.toLowerCase().includes(query) ||
        station.suburb.toLowerCase().includes(query) ||
        station.brand.toLowerCase().includes(query)
      );
    }
    
    if (brand) {
      filteredStations = filteredStations.filter(station => 
        station.brand.toLowerCase() === brand.toLowerCase()
      );
    }
    
    if (suburb) {
      filteredStations = filteredStations.filter(station => 
        station.suburb.toLowerCase() === suburb.toLowerCase()
      );
    }
    
    res.json({
      success: true,
      count: filteredStations.length,
      data: filteredStations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get stations with lowest prices
app.get('/api/prices/lowest', (req, res) => {
  try {
    const { fuelType = 'unleaded', limit = 5 } = req.query;
    
    const sortedStations = [...petrolStations]
      .sort((a, b) => a.prices[fuelType] - b.prices[fuelType])
      .slice(0, parseInt(limit));
    
    res.json({
      success: true,
      fuelType,
      count: sortedStations.length,
      data: sortedStations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  socket.emit('stationsData', petrolStations);
  
  // Handle client requesting live updates
  socket.on('requestLiveUpdates', () => {
    console.log('Client requested live updates');
    socket.emit('liveUpdatesEnabled', true);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate real-time price updates
setInterval(() => {
  // Update random stations with small price changes
  const stationsToUpdate = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < stationsToUpdate; i++) {
    const randomStationIndex = Math.floor(Math.random() * petrolStations.length);
    const station = petrolStations[randomStationIndex];
    
    // Small random price fluctuations
    const priceChange = (Math.random() - 0.5) * 2; // -1 to +1 cents
    
    station.prices.unleaded = Math.max(160, Math.min(220, station.prices.unleaded + priceChange));
    station.prices.premium = Math.max(170, Math.min(230, station.prices.premium + priceChange));
    station.prices.diesel = Math.max(150, Math.min(210, station.prices.diesel + priceChange));
    station.lastUpdated = new Date().toISOString();
  }
  
  // Broadcast updated prices to all connected clients
  io.emit('priceUpdate', petrolStations);
}, 15000); // Update every 15 seconds

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

// Get all petrol stations (paginated)
app.get('/api/stations', async (req, res) => {
  try {
    const stations = await baserowClient.getPetrolStations(req.query);
    res.json({
      success: true,
      data: stations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all petrol stations (complete dataset)
app.get('/api/stations/all', async (req, res) => {
  try {
    const allStations = await baserowClient.getAllPetrolStations(req.query);
    res.json({
      success: true,
      data: allStations,
      count: allStations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific petrol station
app.get('/api/stations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const station = await baserowClient.getPetrolStation(id);
    res.json({
      success: true,
      data: station
    });
  } catch (error) {
    res.status(error.status || 500).json({
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