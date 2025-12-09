# Fuel Prices API Test Results

## ✅ API Endpoint Created

**Endpoint:** `GET /api/fuel/prices`

**Location:** `src/app/api/fuel/prices/route.ts`

## 📋 API Features

### Query Parameters

- `stationId` - Filter prices by station ID (number)
- `fuelType` - Filter prices by fuel type (e.g., 'unleaded', 'diesel', 'premium')
- `suburb` - Filter prices by suburb (requires station lookup)
- `brand` - Filter prices by brand (requires station lookup)

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "price-id",
      "fuelType": "unleaded",
      "stationId": 123,
      "pricePerLiter": 1.85,
      "lastUpdated": "2024-12-09T06:00:00Z",
      "currency": "AUD",
      "isAvailable": true
    }
  ],
  "count": 1,
  "total": 1,
  "timestamp": "2024-12-09T06:15:39.655Z"
}
```

## 🧪 Test Commands

### Basic Test

```bash
curl http://localhost:3000/api/fuel/prices
```

### Filter by Fuel Type

```bash
curl "http://localhost:3000/api/fuel/prices?fuelType=unleaded"
```

### Filter by Station ID

```bash
curl "http://localhost:3000/api/fuel/prices?stationId=123"
```

### Filter by Suburb

```bash
curl "http://localhost:3000/api/fuel/prices?suburb=coburg"
```

### Filter by Brand

```bash
curl "http://localhost:3000/api/fuel/prices?brand=bp"
```

### Combined Filters

```bash
curl "http://localhost:3000/api/fuel/prices?fuelType=unleaded&suburb=coburg"
```

## ⚙️ Configuration Required

The API will return empty data if neither FairFuel nor Baserow is configured.

### FairFuel API Configuration

Set these environment variables:

```env
FAIRFUEL_API_BASE_URL=https://api.fuel.service.vic.gov.au/open-data/v1
FAIRFUEL_CONSUMER_ID=your_consumer_id_here
FAIRFUEL_USER_AGENT=petrol-price-near-me/2.0.0
FAIRFUEL_CACHE_TTL_MS=900000
FAIRFUEL_REQUEST_TIMEOUT_MS=15000
```

### Baserow API Configuration

Set these environment variables:

```env
BASEROW_API_URL=https://api.baserow.io
BASEROW_API_TOKEN=your_token_here
BASEROW_DATABASE_ID=your_database_id
BASEROW_STATIONS_TABLE_ID=623329
BASEROW_PRICES_TABLE_ID=623330
```

## 🔄 Data Source Priority

1. **FairFuel API** (if configured) - Real-time fuel prices from Service Victoria
2. **Baserow** (fallback) - Stored fuel price data

## ✅ Current Status

- ✅ API endpoint created and working
- ✅ Query parameter filtering implemented
- ✅ Station lookup for suburb/brand filtering
- ✅ Error handling and logging
- ✅ Caching headers configured
- ⚠️ Returns empty data (no data source configured)

## 📝 Next Steps

1. Configure FairFuel API with `FAIRFUEL_CONSUMER_ID`
2. OR configure Baserow API with `BASEROW_API_TOKEN`
3. Test with actual data once configured

## 🔍 Testing with PowerShell

```powershell
# Basic test
Invoke-WebRequest -Uri "http://localhost:3000/api/fuel/prices" | ConvertFrom-Json

# With filters
Invoke-WebRequest -Uri "http://localhost:3000/api/fuel/prices?fuelType=unleaded" | ConvertFrom-Json

# Pretty print
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/fuel/prices"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```
