# Baserow Integration Documentation

## Overview

This document provides comprehensive information for developers working with the Baserow database integration for the "Petrol Stations Melbourne" / "Petrol Prices Near Me" application.

## Table of Contents

1. [Authentication & Configuration](#authentication--configuration)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [CRUD Operations](#crud-operations)
5. [Field Metadata](#field-metadata)
6. [MCP Server Integration](#mcp-server-integration)
7. [Error Handling](#error-handling)
8. [Security Considerations](#security-considerations)
9. [Examples](#examples)

## Authentication & Configuration

### API Token
```
Authorization Token: WXGOdiCeNmvdj5NszzAdvIug3InwQQXP
⚠️ Development use only - use environment variables in production
```

### Base API URL
```
https://api.baserow.io/api
```

### Environment Variables

#### Backend (.env)
```env
BASEROW_TOKEN=WXGOdiCeNmvdj5NszzAdvIug3InwQQXP
BASEROW_API_URL=https://api.baserow.io/api
MCP_SERVER_URL=https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse
```

#### Frontend (.env)
```env
REACT_APP_BASEROW_TOKEN=WXGOdiCeNmvdj5NszzAdvIug3InwQQXP
REACT_APP_BASEROW_API_URL=https://api.baserow.io/api
REACT_APP_MCP_SERVER_URL=https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse
```

## Database Schema

### Tables

| Table Name | ID | Description |
|------------|----|-----------| 
| Petrol Stations | 623329 | Main stations data |
| Fuel Prices | 623330 | Linked price records |
| Airtable import report | 623331 | Migration tracking |

### Petrol Stations Table Fields

| Field Name | Field ID | Type | Description |
|------------|----------|------|-------------|
| Station Name | field_5072130 | String | Name of the petrol station |
| Address | field_5072131 | String | Street address |
| City | field_5072132 | String | City/suburb |
| Postal Code | field_5072133 | Number | Postal/ZIP code |
| Region | field_5072134 | String | State/region |
| Country | field_5072135 | String | Country |
| Latitude | field_5072136 | Decimal(4) | GPS latitude |
| Longitude | field_5072137 | Decimal(4) | GPS longitude |
| Category | field_5072138 | Integer/String | Station category/type |
| Fuel Prices | field_5072139 | Array | Links to Fuel Prices table |
| Location Details | field_5072140 | String | Additional location info |

## API Endpoints

### Base Endpoints

#### Get All Tables
```http
GET https://api.baserow.io/api/database/tables/all-tables/
Authorization: Token WXGOdiCeNmvdj5NszzAdvIug3InwQQXP
```

#### Get Table Fields
```http
GET https://api.baserow.io/api/database/fields/table/623329/
Authorization: Token WXGOdiCeNmvdj5NszzAdvIug3InwQQXP
```

#### List Rows (Paginated)
```http
GET https://api.baserow.io/api/database/rows/table/623329/?user_field_names=true
Authorization: Token WXGOdiCeNmvdj5NszzAdvIug3InwQQXP
```

### Backend API Endpoints

#### Petrol Stations
```http
GET    /api/stations          # Get paginated stations
GET    /api/stations/all      # Get all stations
GET    /api/stations/:id      # Get specific station
POST   /api/stations          # Create new station
PUT    /api/stations/:id      # Update station
DELETE /api/stations/:id      # Delete station
```

#### Fuel Prices
```http
GET    /api/fuel-prices                    # Get fuel prices
POST   /api/fuel-prices                    # Create fuel price
POST   /api/stations/:id/link-prices       # Link prices to station
```

#### Metadata
```http
GET    /api/baserow/test              # Test connection
GET    /api/baserow/tables            # Get all tables
GET    /api/baserow/fields/:tableId   # Get table fields
```

## CRUD Operations

### JavaScript/Axios Examples

#### Setup
```javascript
const axios = require('axios');
const token = 'WXGOdiCeNmvdj5NszzAdvIug3InwQQXP';

const baserowAPI = axios.create({
  baseURL: 'https://api.baserow.io/api',
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  }
});
```

#### Create Station
```javascript
async function createStation(stationData) {
  try {
    const response = await baserowAPI.post('/database/rows/table/623329/', {
      field_5072130: stationData.stationName,    // Station Name
      field_5072131: stationData.address,        // Address
      field_5072132: stationData.city,           // City
      field_5072133: stationData.postalCode,     // Postal Code
      field_5072134: stationData.region,         // Region
      field_5072135: stationData.country,        // Country
      field_5072136: stationData.latitude,       // Latitude
      field_5072137: stationData.longitude,      // Longitude
      field_5072138: stationData.category,       // Category
      field_5072140: stationData.locationDetails // Location Details
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating station:', error.response?.data);
    throw error;
  }
}
```

#### Read Stations (All)
```javascript
async function getAllStations() {
  try {
    let allStations = [];
    let next = null;
    
    do {
      const params = {
        user_field_names: true,
        size: 50
      };
      
      if (next) {
        params.offset = next;
      }
      
      const response = await baserowAPI.get('/database/rows/table/623329/', { params });
      const data = response.data;
      
      allStations = allStations.concat(data.results);
      
      if (data.next) {
        const nextUrl = new URL(data.next);
        next = nextUrl.searchParams.get('offset');
      } else {
        next = null;
      }
    } while (next);
    
    return allStations;
  } catch (error) {
    console.error('Error fetching stations:', error.response?.data);
    throw error;
  }
}
```

#### Update Station
```javascript
async function updateStation(stationId, updateData) {
  try {
    const response = await baserowAPI.patch(`/database/rows/table/623329/${stationId}/`, {
      field_5072130: updateData.stationName,    // Station Name
      field_5072131: updateData.address,        // Address
      field_5072136: updateData.latitude,       // Latitude
      field_5072137: updateData.longitude,      // Longitude
      // ... other fields as needed
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating station:', error.response?.data);
    throw error;
  }
}
```

#### Delete Station
```javascript
async function deleteStation(stationId) {
  try {
    await baserowAPI.delete(`/database/rows/table/623329/${stationId}/`);
    return true;
  } catch (error) {
    console.error('Error deleting station:', error.response?.data);
    throw error;
  }
}
```

#### Link Fuel Prices
```javascript
async function linkFuelPrices(stationId, priceIds) {
  try {
    const response = await baserowAPI.patch(`/database/rows/table/623329/${stationId}/`, {
      field_5072139: priceIds  // Fuel Prices array
    });
    
    return response.data;
  } catch (error) {
    console.error('Error linking fuel prices:', error.response?.data);
    throw error;
  }
}
```

### Using Backend API (Recommended)

#### Frontend Usage
```javascript
import { baserowAPI } from '../config';

// Get all stations
const stations = await baserowAPI.fetchAllStations();

// Create station
const newStation = await baserowAPI.createStation({
  stationName: 'Shell Melbourne CBD',
  address: '123 Collins Street',
  city: 'Melbourne',
  postalCode: 3000,
  region: 'Victoria',
  country: 'Australia',
  latitude: -37.8136,
  longitude: 144.9631,
  category: 'Premium',
  locationDetails: 'Corner of Collins and Elizabeth Streets'
});

// Update station
const updatedStation = await baserowAPI.updateStation(stationId, {
  stationName: 'Updated Station Name',
  latitude: -37.8140
});

// Delete station
await baserowAPI.deleteStation(stationId);
```

## Field Metadata

### Fetching Field Metadata
```javascript
async function getTableFields(tableId) {
  try {
    const response = await baserowAPI.get(`/database/fields/table/${tableId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching fields:', error.response?.data);
    throw error;
  }
}

// Usage
const petrolStationFields = await getTableFields(623329);
const fuelPriceFields = await getTableFields(623330);
```

### Dynamic Form Generation
```javascript
function generateFormFields(fields) {
  return fields.map(field => ({
    id: field.id,
    name: field.name,
    type: field.type,
    required: !field.nullable,
    options: field.select_options || null
  }));
}
```

## MCP Server Integration

### Cursor Configuration

Add to Cursor > Settings > MCP tab:

```json
{
  "mcpServers": {
    "Baserow MCP": {
      "url": "https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse"
    }
  }
}
```

This enables Cursor to perform actions on your behalf via the MCP protocol.

## Error Handling

### Common Error Responses

#### Authentication Error (401)
```json
{
  "error": "Invalid token.",
  "detail": "Token authentication failed."
}
```

#### Not Found (404)
```json
{
  "error": "The requested resource was not found.",
  "detail": "Row with id 999 does not exist."
}
```

#### Validation Error (400)
```json
{
  "error": {
    "field_5072130": [
      {
        "error": "This field is required.",
        "code": "required"
      }
    ]
  }
}
```

#### Rate Limiting (429)
```json
{
  "error": "Request was throttled."
}
```

### Error Handling Best Practices

```javascript
async function handleBaserowRequest(requestFn) {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limited - exponential backoff
        const waitTime = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retryCount++;
        continue;
      }
      
      if (error.response?.status >= 500) {
        // Server error - retry
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // Client error or other - don't retry
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

## Security Considerations

### Production Security

1. **Environment Variables**: Never hardcode API tokens
```javascript
const token = process.env.BASEROW_TOKEN;
if (!token) {
  throw new Error('BASEROW_TOKEN environment variable is required');
}
```

2. **CORS Configuration**: Restrict origins in production
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true
}));
```

3. **Input Validation**: Validate all inputs
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/stations', [
  body('stationName').isLength({ min: 1, max: 100 }),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request...
});
```

4. **Rate Limiting**: Implement rate limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Examples

### Complete Integration Example

```javascript
// backend/routes/stations.js
const express = require('express');
const BaserowClient = require('../baserowClient');

const router = express.Router();
const baserowClient = new BaserowClient();

// Get all stations with error handling
router.get('/', async (req, res) => {
  try {
    const stations = await baserowClient.getAllPetrolStations(req.query);
    res.json({
      success: true,
      data: stations,
      count: stations.length
    });
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create station with validation
router.post('/', async (req, res) => {
  try {
    const { stationName, address, city, latitude, longitude } = req.body;
    
    // Validation
    if (!stationName || !address || !city) {
      return res.status(400).json({
        success: false,
        error: 'stationName, address, and city are required'
      });
    }
    
    if (latitude && (latitude < -90 || latitude > 90)) {
      return res.status(400).json({
        success: false,
        error: 'Latitude must be between -90 and 90'
      });
    }
    
    if (longitude && (longitude < -180 || longitude > 180)) {
      return res.status(400).json({
        success: false,
        error: 'Longitude must be between -180 and 180'
      });
    }
    
    const newStation = await baserowClient.createPetrolStation(req.body);
    
    res.status(201).json({
      success: true,
      data: newStation
    });
  } catch (error) {
    console.error('Error creating station:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

### Frontend Component Example

```jsx
// src/components/StationManager.jsx
import React, { useState, useEffect } from 'react';
import { baserowAPI } from '../config';

const StationManager = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      const data = await baserowAPI.fetchAllStations();
      setStations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStation = async (stationData) => {
    try {
      const newStation = await baserowAPI.createStation(stationData);
      setStations(prev => [...prev, newStation]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateStation = async (stationId, updateData) => {
    try {
      const updatedStation = await baserowAPI.updateStation(stationId, updateData);
      setStations(prev => 
        prev.map(station => 
          station.id === stationId ? updatedStation : station
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteStation = async (stationId) => {
    try {
      await baserowAPI.deleteStation(stationId);
      setStations(prev => prev.filter(station => station.id !== stationId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Station Manager</h2>
      {/* Station list and forms would go here */}
    </div>
  );
};

export default StationManager;
```

## Quick Start Checklist

- [ ] Set up environment variables
- [ ] Configure CORS for your domain
- [ ] Test API connection with `/api/baserow/test`
- [ ] Fetch table fields with `/api/baserow/fields/623329`
- [ ] Test CRUD operations
- [ ] Add MCP server to Cursor settings
- [ ] Implement error handling and validation
- [ ] Set up rate limiting for production

## Support

For additional help:
- Baserow API Documentation: https://api.baserow.io/api/redoc/
- MCP Protocol: https://github.com/modelcontextprotocol/specification
- Project Repository: https://github.com/PetroPricesnearMe/petrol-prices-melbourne 