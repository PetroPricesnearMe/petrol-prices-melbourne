# Melbourne Petrol Stations Backend

A comprehensive TypeScript backend API for Melbourne petrol stations with real-time data, caching, and GraphQL support.

## 🚀 Features

- **TypeScript**: Full TypeScript migration with strict typing
- **Real-time Updates**: Socket.io with Redis adapter for clustering
- **API Caching**: Redis-based caching for expensive endpoints
- **Rate Limiting**: Express rate limiting with Redis support
- **GraphQL**: Apollo Server integration for flexible queries
- **Error Monitoring**: Sentry integration for production monitoring
- **Compression**: Response compression for better performance
- **Security**: Helmet.js for security headers
- **Logging**: Morgan for HTTP request logging

## 📋 Prerequisites

- Node.js 18+ 
- Redis (optional, for caching and rate limiting)
- Baserow API access

## 🛠️ Installation

1. **Clone and install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `BASEROW_TOKEN` | Baserow API token | Required |
| `BASEROW_API_URL` | Baserow API URL | `https://api.baserow.io/api` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `REDIS_HOST` | Redis host (optional) | - |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | - |
| `REDIS_DB` | Redis database | `0` |
| `SENTRY_DSN` | Sentry DSN (optional) | - |
| `SENTRY_ENVIRONMENT` | Sentry environment | `NODE_ENV` |
| `SENTRY_TRACES_SAMPLE_RATE` | Sentry sample rate | `0.1` |

## 🚀 Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Clean build directory |

## 📡 API Endpoints

### REST API

#### Health Check
- `GET /health` - Server health status

#### Petrol Stations
- `GET /api/stations` - Get paginated stations
- `GET /api/stations/all` - Get all stations
- `GET /api/stations/:id` - Get specific station
- `POST /api/stations` - Create new station
- `PUT /api/stations/:id` - Update station
- `DELETE /api/stations/:id` - Delete station

#### Fuel Prices
- `GET /api/fuel-prices` - Get fuel prices
- `POST /api/fuel-prices` - Create fuel price
- `POST /api/stations/:id/link-prices` - Link prices to station

#### Baserow Metadata
- `GET /api/baserow/test` - Test Baserow connection
- `GET /api/baserow/tables` - Get all tables
- `GET /api/baserow/fields/:tableId` - Get table fields

### GraphQL

GraphQL endpoint available at `/graphql` with Apollo Studio interface.

#### Example Queries

```graphql
# Get all stations
query {
  allStations {
    id
    stationName
    address
    city
    latitude
    longitude
  }
}

# Get paginated stations
query {
  stations(size: 10, page: 1) {
    results {
      id
      stationName
      address
    }
    count
    next
    previous
  }
}

# Get specific station
query {
  station(id: "123") {
    id
    stationName
    address
    fuelPrices {
      fuelType
      pricePerLiter
      lastUpdated
    }
  }
}
```

## 🔌 WebSocket Events

### Client Events
- `requestLiveUpdates` - Request real-time updates

### Server Events
- `stationsData` - Initial stations data
- `liveUpdatesEnabled` - Confirmation of live updates
- `error` - Error messages

## 🏗️ Architecture

### Directory Structure
```
src/
├── config/          # Configuration files
├── middleware/      # Express middleware
│   ├── cache.ts     # Redis caching
│   ├── errorHandler.ts # Error handling
│   └── rateLimiter.ts # Rate limiting
├── services/        # Business logic
│   ├── BaserowClient.ts # Baserow API client
│   └── graphql.ts   # GraphQL schema & resolvers
├── types/           # TypeScript type definitions
└── server.ts        # Main server file
```

### Key Components

#### BaserowClient
- Handles all Baserow API interactions
- Supports CRUD operations for stations and prices
- Includes error handling and request/response logging

#### Caching Middleware
- Redis-based caching for GET endpoints
- Configurable TTL per endpoint type
- Automatic cache invalidation on mutations

#### Rate Limiting
- Different limits for different endpoint types
- Redis-backed for distributed deployments
- Configurable windows and limits

#### Error Handling
- Centralized error handling with Sentry integration
- Development vs production error responses
- Async error wrapper for route handlers

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Protection against abuse
- **Input Validation**: TypeScript type safety
- **Error Sanitization**: No sensitive data in error responses

## 📊 Monitoring

### Sentry Integration
- Automatic error tracking
- Performance monitoring
- Environment-specific configuration

### Health Checks
- `/health` endpoint for monitoring
- Uptime and environment information

## 🚀 Deployment

### Docker (Recommended)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure Redis for caching and rate limiting
3. Set up Sentry for error monitoring
4. Configure CORS for your frontend domain

## 🔧 Development

### TypeScript Configuration
- Strict type checking enabled
- Path mapping for clean imports
- Source maps for debugging

### Code Quality
- ESLint with TypeScript rules
- Prettier for code formatting
- Pre-commit hooks recommended

### Testing
```bash
npm test
```

## 📝 API Documentation

### Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {},
  "count": 0,
  "next": null,
  "previous": null
}
```

### Error Format
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/stations",
  "method": "GET"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details. 