# 🏗️ System Architecture

## Overview

Melbourne Petrol Stations is a full-stack web application that provides real-time fuel pricing and location data for petrol stations in Melbourne.

## Technology Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Leaflet** - Interactive maps
- **Framer Motion** - Animations and transitions
- **Socket.io Client** - Real-time updates
- **Styled Components** - Component-based styling

### Backend

- **Node.js + Express** - TypeScript-based API server
- **Socket.io** - Real-time bidirectional communication
- **Apollo Server** - GraphQL API (advanced features)
- **Helmet + Compression** - Security and performance middleware
- **Redis** - Caching and session storage (optional)
- **Sentry** - Error monitoring (optional)

### Database

- **Baserow** - No-code database platform
- **REST API** - Database access via Baserow API

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express Server │────│  Baserow API    │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    WebSocket              REST API               HTTP API
    Connection             Endpoints              Requests
         │                       │                       │
         └───────────────────────┴───────────────────────┘
```

## Data Flow

1. **Frontend** makes HTTP requests to backend API
2. **Backend** processes requests and queries Baserow API
3. **Real-time updates** via WebSocket connections
4. **Caching layer** (Redis) improves performance
5. **Error monitoring** (Sentry) tracks issues

## Key Components

### Backend Services

- **BaserowClient** - Handles all database operations
- **Socket.io Server** - Real-time communication
- **GraphQL Resolver** - Advanced query capabilities
- **Rate Limiting** - API protection
- **Caching Middleware** - Performance optimization

### Frontend Components

- **MapPage** - Interactive map with station markers
- **DirectoryPage** - Searchable station directory
- **HomePage** - Landing page with features
- **Data Services** - API communication layer

## Database Schema (Baserow)

### Petrol Stations Table (ID: 623329)

- Station Name, Address, City, Postal Code
- Latitude, Longitude (for mapping)
- Region, Country, Category
- Linked to Fuel Prices

### Fuel Prices Table (ID: 623330)

- Fuel Type (Unleaded, Premium, Diesel, LPG)
- Price Per Liter, Last Updated
- Price Trend (Increasing/Stable/Decreasing)
- Linked to Petrol Stations

## Security Considerations

- **Environment Variables** - All secrets stored in .env
- **CORS Configuration** - Restricted origin access
- **Rate Limiting** - API endpoint protection
- **Helmet Middleware** - Security headers
- **Input Validation** - Data sanitization

## Performance Optimizations

- **Redis Caching** - Frequently accessed data
- **Compression** - Gzip response compression
- **Rate Limiting** - Prevent API abuse
- **Pagination** - Large dataset handling
- **WebSocket** - Efficient real-time updates
