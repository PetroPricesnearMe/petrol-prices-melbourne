import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import { ApolloServer } from 'apollo-server-express';

// Import configuration and services
import config from './config';
import { BaserowClient } from './services/BaserowClient';
import { typeDefs, resolvers } from './services/graphql';

// Import middleware
import { errorHandler, notFoundHandler, asyncHandler } from './middleware/errorHandler';
import { 
  apiLimiter, 
  createLimiter, 
  updateLimiter, 
  deleteLimiter,
  healthCheckLimiter,
  redisClient 
} from './middleware/rateLimiter';
import { 
  stationCache, 
  priceCache, 
  tableCache,
  invalidateCache 
} from './middleware/cache';

// Import types
import { ExpressRequest, ExpressResponse, ApiResponse } from './types';

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Sentry if configured
if (config.sentry) {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.sentry.environment,
    tracesSampleRate: config.sentry.tracesSampleRate,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app })
    ]
  });

  // Request handler creates a separate execution context
  app.use(Sentry.Handlers.requestHandler());
}

// Initialize Socket.io with Redis adapter for clustering
const io = new SocketIOServer(server, {
  cors: {
    origin: config.cors.origin,
    methods: config.cors.methods
  },
  ...(redisClient && { adapter: createAdapter(redisClient, redisClient.duplicate()) })
});

// Initialize Baserow client
const baserowClient = new BaserowClient();

// ==================== MIDDLEWARE SETUP ====================

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// CORS middleware
app.use(cors({
  origin: config.cors.origin,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
  credentials: config.cors.credentials
}));

// CORS debug middleware for development
if (config.nodeEnv === 'development') {
  app.use((req: ExpressRequest, _res: ExpressResponse, next) => {
    console.log(`🌐 CORS: ${req.method} ${req.path} from origin: ${req.headers.origin || 'no origin'}`);
    next();
  });
}

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== APOLLO GRAPHQL SETUP ====================

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      ...error,
      locations: error.locations || [],
      path: error.path || []
    } as any;
  },
  plugins: [
    {
      requestDidStart: () => {
        return Promise.resolve({
          willSendResponse({ response }: { response: any }) {
            console.log(`📊 GraphQL Response: ${response.errors?.length || 0} errors`);
            return Promise.resolve();
          },
        });
      },
    },
  ],
});

// Apply Apollo Server to Express
apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app: app as any, path: '/graphql' });
});

// ==================== SOCKET.IO SETUP ====================

io.on('connection', async (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  try {
    // Send initial data from Baserow
    const stations = await baserowClient.getAllPetrolStations();
    socket.emit('stationsData', stations);
  } catch (error) {
    console.error('❌ Error fetching initial stations for socket:', error);
    socket.emit('error', { message: 'Failed to load stations' });
  }
  
  // Handle client requesting live updates
  socket.on('requestLiveUpdates', () => {
    console.log('📡 Client requested live updates');
    socket.emit('liveUpdatesEnabled', true);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// ==================== API ROUTES ====================

// Health check endpoint
app.get('/health', healthCheckLimiter, (_req: ExpressRequest, res: ExpressResponse) => {
  const healthResponse: ApiResponse = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: config.nodeEnv,
      uptime: process.uptime()
    }
  };
  res.json(healthResponse);
});

// API root endpoint
app.get('/', (_req: ExpressRequest, res: ExpressResponse) => {
  const apiInfo: ApiResponse = {
    success: true,
    data: {
      message: 'Melbourne Petrol Stations API',
      version: '1.0.0',
      endpoints: {
        'GET /api/stations': 'Get all petrol stations',
        'GET /api/stations/:id': 'Get specific station',
        'GET /api/stations/search': 'Search stations by query',
        'GET /api/prices/lowest': 'Get stations with lowest prices',
        'POST /graphql': 'GraphQL endpoint'
      }
    }
  };
  res.json(apiInfo);
});

// ==================== BASEROW API ENDPOINTS ====================

// Test connection endpoint
app.get('/api/baserow/test', apiLimiter, asyncHandler(async (_req: ExpressRequest, res: ExpressResponse) => {
  const result = await baserowClient.testConnection();
  res.json({
    success: true,
    ...result
  });
}));

// Get all tables
app.get('/api/baserow/tables', apiLimiter, tableCache, asyncHandler(async (_req: ExpressRequest, res: ExpressResponse) => {
  const tables = await baserowClient.getAllTables();
  res.json({
    success: true,
    data: tables
  });
}));

// Get table fields
app.get('/api/baserow/fields/:tableId', apiLimiter, tableCache, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  const { tableId } = req.params;
  const fields = await baserowClient.getTableFields(parseInt(tableId || '0', 10));
  res.json({
    success: true,
    data: fields
  });
}));

// ==================== PETROL STATIONS ENDPOINTS ====================

// Get all petrol stations (complete dataset)
app.get('/api/stations/all', apiLimiter, stationCache, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  console.log('📍 Fetching ALL stations from Baserow...');
  const allStations = await baserowClient.getAllPetrolStations(req.query);
  console.log(`✅ Successfully fetched ${allStations.length} stations`);
  
  res.json({
    success: true,
    data: allStations,
    count: allStations.length
  });
}));

// Get specific petrol station by ID
app.get('/api/stations/:id', apiLimiter, stationCache, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;
  
  if (!isNaN(parseInt(id || '0', 10))) {
    const station = await baserowClient.getPetrolStation(parseInt(id || '0', 10));
    res.json({
      success: true,
      data: station
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Invalid station ID'
    });
  }
}));

// Get petrol stations (paginated)
app.get('/api/stations', apiLimiter, stationCache, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  console.log('📍 Fetching paginated stations from Baserow...');
  const stations = await baserowClient.getPetrolStations(req.query);
  
  res.json({
    success: true,
    data: stations.results || stations,
    count: stations.count || (stations.results ? stations.results.length : 0),
    next: stations.next || null,
    previous: stations.previous || null
  });
}));

// Create new petrol station
app.post('/api/stations', createLimiter, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  const newStation = await baserowClient.createPetrolStation(req.body);
  
  // Invalidate cache
  await invalidateCache('api:stations:*');
  
  res.status(201).json({
    success: true,
    data: newStation
  });
}));

// Update petrol station
app.put('/api/stations/:id', updateLimiter, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;
  const updatedStation = await baserowClient.updatePetrolStation(parseInt(id || '0', 10), req.body);
  
  // Invalidate cache
  await invalidateCache('api:stations:*');
  
  res.json({
    success: true,
    data: updatedStation
  });
}));

// Delete petrol station
app.delete('/api/stations/:id', deleteLimiter, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;
  await baserowClient.deletePetrolStation(parseInt(id || '0', 10));
  
  // Invalidate cache
  await invalidateCache('api:stations:*');
  
  res.json({
    success: true,
    message: `Station ${id} deleted successfully`
  });
}));

// ==================== FUEL PRICES ENDPOINTS ====================

// Get fuel prices
app.get('/api/fuel-prices', apiLimiter, priceCache, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  const prices = await baserowClient.getFuelPrices(req.query);
  res.json({
    success: true,
    data: prices
  });
}));

// Create fuel price entry
app.post('/api/fuel-prices', createLimiter, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  const newPrice = await baserowClient.createFuelPrice(req.body);
  
  // Invalidate cache
  await invalidateCache('api:prices:*');
  
  res.status(201).json({
    success: true,
    data: newPrice
  });
}));

// Link fuel prices to station
app.post('/api/stations/:id/link-prices', updateLimiter, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;
  const { priceIds } = req.body;
  
  if (!Array.isArray(priceIds)) {
    return res.status(400).json({
      success: false,
      error: 'priceIds must be an array'
    });
  }
  
  const updatedStation = await baserowClient.linkFuelPricesToStation(parseInt(id || '0', 10), priceIds);
  
  // Invalidate cache
  await invalidateCache('api:stations:*');
  await invalidateCache('api:prices:*');
  
  return res.json({
    success: true,
    data: updatedStation
  });
}));

// ==================== LEGACY COMPATIBILITY ENDPOINTS ====================

// Legacy endpoint for backward compatibility
app.get('/api/baserow/all-rows/:tableId', apiLimiter, asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  const { tableId } = req.params;
  let allRows;
  
  if (parseInt(tableId || '0', 10) === config.baserow.tables.petrolStations.id) {
    allRows = await baserowClient.getAllPetrolStations(req.query);
  } else if (parseInt(tableId || '0', 10) === config.baserow.tables.fuelPrices.id) {
    const result = await baserowClient.getFuelPrices(req.query);
    allRows = result.results || result;
  } else {
    return res.status(400).json({
      success: false,
      error: `Unknown table ID: ${tableId}`
    });
  }
  
  return res.json({
    success: true,
    data: allRows,
    count: Array.isArray(allRows) ? allRows.length : (allRows as any)?.results?.length || 0
  });
}));

// ==================== ERROR HANDLING ====================

// Sentry error handler (must be first)
if (config.sentry) {
  app.use(Sentry.Handlers.errorHandler());
}

// Custom error handling middleware
app.use(errorHandler);

// 404 handler (must be last)
app.use(notFoundHandler);

// ==================== SERVER STARTUP ====================

server.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📊 API available at http://localhost:${config.port}`);
  console.log(`🔌 WebSocket server ready for connections`);
  console.log(`📈 GraphQL endpoint available at http://localhost:${config.port}/graphql`);
  console.log(`🏥 Health check available at http://localhost:${config.port}/health`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  
  if (config.redis) {
    console.log(`📦 Redis connected at ${config.redis.host}:${config.redis.port}`);
  }
  
  if (config.sentry) {
    console.log(`📊 Sentry monitoring enabled for environment: ${config.sentry.environment}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  
  if (config.sentry) {
    Sentry.captureException(reason);
  }
  
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  
  if (config.sentry) {
    Sentry.captureException(error);
  }
  
  process.exit(1);
}); 