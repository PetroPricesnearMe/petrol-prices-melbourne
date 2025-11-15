# API Documentation

## Overview

The Petrol Price Near Me API follows RESTful design principles and provides endpoints for accessing petrol station and fuel price data.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## API Versioning

The API uses URL versioning. Current version: **v1**

All endpoints are prefixed with `/api/v1/`

## Authentication

Most endpoints are publicly accessible. Admin endpoints require authentication.

```http
Authorization: Bearer YOUR_TOKEN
```

## Rate Limiting

- **Default**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes

Rate limit headers are included in all responses:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the limit resets (ISO 8601)

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_1234567890_abc123"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_1234567890_abc123",
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "statusCode": 404,
    "details": { ... }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_1234567890_abc123"
  }
}
```

## Error Codes

| Code                  | HTTP Status | Description                     |
| --------------------- | ----------- | ------------------------------- |
| `BAD_REQUEST`         | 400         | Invalid request parameters      |
| `UNAUTHORIZED`        | 401         | Authentication required         |
| `FORBIDDEN`           | 403         | Insufficient permissions        |
| `NOT_FOUND`           | 404         | Resource not found              |
| `VALIDATION_ERROR`    | 400         | Request validation failed       |
| `RATE_LIMIT_EXCEEDED` | 429         | Too many requests               |
| `INTERNAL_ERROR`      | 500         | Server error                    |
| `SERVICE_UNAVAILABLE` | 503         | Service temporarily unavailable |

## Endpoints

### Stations

#### List/Search Stations

```http
GET /api/v1/stations
```

**Query Parameters:**

| Parameter   | Type   | Required | Description                                |
| ----------- | ------ | -------- | ------------------------------------------ |
| `city`      | string | No       | Filter by city                             |
| `region`    | string | No       | Filter by region                           |
| `brand`     | string | No       | Filter by brand                            |
| `page`      | number | No       | Page number (default: 1)                   |
| `pageSize`  | number | No       | Items per page (default: 20, max: 100)     |
| `sortBy`    | string | No       | Sort field: `name`, `distance`             |
| `sortOrder` | string | No       | Sort order: `asc`, `desc` (default: `asc`) |

**Example Request:**

```bash
curl "http://localhost:3000/api/v1/stations?city=Sydney&page=1&pageSize=20"
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "stationName": "Shell Service Station",
      "address": "123 Main St",
      "city": "Sydney",
      "region": "NSW",
      "postalCode": "2000",
      "country": "Australia",
      "latitude": -33.8688,
      "longitude": 151.2093,
      "brand": ["Shell"],
      "category": "petrol-stations"
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_1234567890_abc123",
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 50,
      "totalPages": 3,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

#### Get Nearby Stations

```http
GET /api/v1/stations/nearby
```

**Query Parameters:**

| Parameter   | Type   | Required | Description                                |
| ----------- | ------ | -------- | ------------------------------------------ |
| `latitude`  | number | **Yes**  | Latitude (-90 to 90)                       |
| `longitude` | number | **Yes**  | Longitude (-180 to 180)                    |
| `radius`    | number | No       | Search radius in km (default: 10, max: 50) |
| `fuelType`  | string | No       | Filter by fuel type                        |
| `brand`     | string | No       | Filter by brand                            |
| `page`      | number | No       | Page number                                |
| `pageSize`  | number | No       | Items per page                             |

**Example Request:**

```bash
curl "http://localhost:3000/api/v1/stations/nearby?latitude=-33.8688&longitude=151.2093&radius=5"
```

#### Get Station by ID

```http
GET /api/v1/stations/{id}
```

**Path Parameters:**

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | number | **Yes**  | Station ID  |

**Example Request:**

```bash
curl "http://localhost:3000/api/v1/stations/1"
```

#### Create Station (Admin)

```http
POST /api/v1/stations
```

**Request Body:**

```json
{
  "stationName": "New Station",
  "address": "123 Main St",
  "city": "Sydney",
  "region": "NSW",
  "postalCode": "2000",
  "country": "Australia",
  "latitude": -33.8688,
  "longitude": 151.2093,
  "brand": ["Shell"]
}
```

#### Update Station (Admin)

```http
PUT /api/v1/stations/{id}
```

#### Delete Station (Admin)

```http
DELETE /api/v1/stations/{id}
```

### Health Check

#### API Health

```http
GET /api/health
```

Returns API status and version information.

## Best Practices

### 1. Always Include Error Handling

```typescript
try {
  const response = await fetch('/api/v1/stations');
  const data = await response.json();

  if (!data.success) {
    console.error('API Error:', data.error);
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

### 2. Respect Rate Limits

Check rate limit headers and implement exponential backoff:

```typescript
const response = await fetch('/api/v1/stations');
const remaining = response.headers.get('X-RateLimit-Remaining');

if (parseInt(remaining) < 10) {
  // Slow down requests
}
```

### 3. Use Pagination

Always use pagination for large datasets:

```typescript
const params = new URLSearchParams({
  page: '1',
  pageSize: '20',
});

const response = await fetch(`/api/v1/stations?${params}`);
```

### 4. Cache Responses

Implement caching for frequently accessed data:

```typescript
const cacheKey = `stations_${city}_${page}`;
const cached = cache.get(cacheKey);

if (cached) {
  return cached;
}

const response = await fetch('/api/v1/stations');
cache.set(cacheKey, response, 300); // 5 minutes
```

## Client Libraries

### JavaScript/TypeScript

```typescript
import type { ApiResponse, Station } from '@/lib/api/types';

async function getStations(city: string): Promise<Station[]> {
  const response = await fetch(`/api/v1/stations?city=${city}`);
  const data: ApiResponse<Station[]> = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message);
  }

  return data.data || [];
}
```

## Support

For API support, please:

1. Check this documentation
2. Review error messages and codes
3. Contact support at support@example.com

## Changelog

### v1.0.0 (2024-01-15)

- Initial API release
- Stations CRUD endpoints
- Nearby search functionality
- Rate limiting implementation
- Comprehensive error handling
