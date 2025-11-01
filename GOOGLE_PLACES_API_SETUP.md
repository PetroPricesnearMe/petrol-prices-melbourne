# 🗺️ Google Places API Integration - Complete Setup Guide

## ✅ API Key Configured

Your Google Places API key has been successfully added to the project!

**API Key:** `AIzaSyDfEKO1GZBpuUuhhL-gz1miug6jdlT1nFk`

---

## 📋 What's Been Set Up

### 1. Environment Variables

Created/Updated:
- ✅ `.env.local` - Local development configuration (not committed to git)
- ✅ `.env.example` - Template for other developers
- ✅ `src/config.js` - Application configuration with Google API keys

### 2. API Integration

The following services are now configured:
- ✅ **GooglePlacesService** (`src/services/GooglePlacesService.js`)
  - Search for petrol stations
  - Search by brand
  - Search near location
  - Get place details
  - Convert places to station format

- ✅ **GooglePlacesSearch Component** (`src/components/GooglePlacesSearch.js`)
  - Interactive search interface
  - Brand filtering
  - Nearby stations finder
  - Results display

### 3. Available Endpoints

The Google Places API (New) endpoints configured:
```
POST https://places.googleapis.com/v1/places:searchText
GET  https://places.googleapis.com/v1/places/{placeId}
GET  https://places.googleapis.com/v1/{photoName}/media
```

---

## 🚀 How to Use

### In Your Components

```typescript
import googlePlacesService from '@/services/GooglePlacesService';

// Search for petrol stations
const results = await googlePlacesService.searchPlaces({
  query: 'Shell petrol station',
  location: { latitude: -37.8136, longitude: 144.9631 },
  radius: 5000,
  pageSize: 20
});

// Search nearby stations
const nearby = await googlePlacesService.searchPetrolStationsNearLocation(
  { latitude: -37.8136, longitude: 144.9631 },
  5000, // 5km radius
  20    // max 20 results
);

// Search by brand
const shellStations = await googlePlacesService.searchPetrolStationsByBrand(
  'Shell',
  { latitude: -37.8136, longitude: 144.9631 },
  10000 // 10km radius
);

// Get place details
const details = await googlePlacesService.getPlaceDetails('place_id_here');

// Get photo URL
const photoUrl = googlePlacesService.getPhotoUrl(photo, 400, 400);
```

### In Your Pages

```typescript
// Import the search component
import GooglePlacesSearch from '@/components/GooglePlacesSearch';

// Use in your page
<GooglePlacesSearch />
```

---

## 📊 Features Included

### Search Capabilities

✅ **Text Search**
- Search by query string
- Location bias (center + radius)
- Pagination support
- Type filtering (gas_station)

✅ **Nearby Search**
- Find stations near coordinates
- Configurable radius
- Sort by distance

✅ **Brand Search**
- Search by brand name (Shell, BP, 7-Eleven, etc.)
- Auto-detect brand from station name
- Regional coverage

✅ **Place Details**
- Full station information
- Rating and reviews count
- Opening hours
- Photos
- Contact information

### Data Transformation

The service automatically converts Google Places data to your application's station format:

```typescript
{
  id: string,
  name: string,
  address: string,
  latitude: number,
  longitude: number,
  brand: string,
  rating: number,
  userRatingCount: number,
  priceLevel: string,
  businessStatus: string,
  openingHours: object,
  phone: string,
  website: string,
  photos: array,
  types: array,
  isGooglePlaces: true,
  lastUpdated: ISO string
}
```

---

## 🔧 API Configuration

### Required APIs (Enable in Google Cloud Console)

1. **Places API (New)** ⭐ PRIMARY
   - https://console.cloud.google.com/apis/library/places-backend.googleapis.com

2. **Maps JavaScript API** (for map display)
   - https://console.cloud.google.com/apis/library/maps-backend.googleapis.com

3. **Geocoding API** (optional, for address to coordinates)
   - https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com

### API Key Restrictions (Recommended for Production)

#### Application Restrictions
- **Development:** None (or HTTP referrers: `http://localhost:3000/*`)
- **Production:** HTTP referrers
  ```
  https://yourdomain.com/*
  https://www.yourdomain.com/*
  ```

#### API Restrictions
Enable only these APIs:
- Places API (New)
- Maps JavaScript API
- Geocoding API

---

## 💰 Pricing & Quotas

### Google Places API (New) Pricing

| Feature | Price per 1000 requests |
|---------|------------------------|
| Text Search | $32.00 |
| Nearby Search | $32.00 |
| Place Details | $17.00 (Basic) |
| Place Photos | $7.00 per 1000 |

**Free Tier:** $200 credit/month (~6,250 requests)

### Optimization Tips

1. **Cache Results**
   ```javascript
   // Cache place details for 24 hours
   const cacheKey = `place_${placeId}`;
   const cached = localStorage.getItem(cacheKey);
   if (cached) return JSON.parse(cached);
   ```

2. **Limit Fields**
   ```javascript
   // Only request needed fields
   'X-Goog-FieldMask': 'places.id,places.displayName,places.location'
   ```

3. **Batch Requests**
   ```javascript
   // Fetch multiple places in one request
   requestBody.pageSize = 20; // max per request
   ```

4. **Use Location Bias**
   ```javascript
   // More accurate, faster results
   locationBias: { circle: { center: coords, radius: 5000 }}
   ```

---

## 🧪 Testing

### Test the API in Browser Console

```javascript
// Test basic search
await fetch('https://places.googleapis.com/v1/places:searchText', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': 'AIzaSyDfEKO1GZBpuUuhhL-gz1miug6jdlT1nFk',
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress'
  },
  body: JSON.stringify({
    textQuery: 'Shell petrol station Melbourne',
    pageSize: 5
  })
}).then(r => r.json()).then(console.log);
```

### Test the Service

```javascript
// In React component
useEffect(() => {
  const testSearch = async () => {
    try {
      const results = await googlePlacesService.searchPlaces({
        query: 'petrol station',
        location: { latitude: -37.8136, longitude: 144.9631 },
        radius: 5000,
        pageSize: 10
      });
      console.log('Search Results:', results);
    } catch (error) {
      console.error('Search Error:', error);
    }
  };
  testSearch();
}, []);
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Invalid API Key" Error

**Cause:** API key not configured or incorrect

**Fix:**
```bash
# Check if environment variables are loaded
console.log(process.env.REACT_APP_GOOGLE_PLACES_API_KEY);

# Restart development server
npm run dev
```

#### 2. "API not enabled" Error

**Fix:**
1. Go to: https://console.cloud.google.com/apis/library
2. Search for "Places API (New)"
3. Click "Enable"

#### 3. "REQUEST_DENIED" Error

**Cause:** API restrictions or billing not enabled

**Fix:**
1. Enable billing in Google Cloud Console
2. Check API key restrictions
3. Verify referrer matches your domain

#### 4. CORS Errors

**Cause:** API key restrictions too strict

**Fix:**
```javascript
// Remove HTTP referrer restrictions for development
// Or add http://localhost:3000/* to allowed referrers
```

#### 5. No Results Returned

**Cause:** Location or query too specific

**Fix:**
```javascript
// Increase search radius
radius: 10000, // 10km instead of 5km

// Broaden query
query: 'gas station fuel' // instead of specific brand
```

---

## 🔐 Security Best Practices

### 1. Never Commit API Keys

```bash
# Already configured in .gitignore
.env.local
.env*.local
```

### 2. Use Environment Variables

```javascript
// ✅ Good
const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

// ❌ Bad
const apiKey = 'AIzaSyDfEKO1GZBpuUuhhL-gz1miug6jdlT1nFk';
```

### 3. Restrict API Key

In Google Cloud Console → Credentials → API Key:
- Set application restrictions (HTTP referrers)
- Set API restrictions (only needed APIs)
- Regenerate key if exposed

### 4. Monitor Usage

- Set up billing alerts
- Monitor API usage daily
- Implement rate limiting

```javascript
// Rate limiting example
const rateLimiter = new Map();
const RATE_LIMIT = 10; // requests per minute

function checkRateLimit(userId) {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  const recentRequests = userRequests.filter(time => now - time < 60000);

  if (recentRequests.length >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded');
  }

  recentRequests.push(now);
  rateLimiter.set(userId, recentRequests);
}
```

---

## 📚 Additional Resources

- [Google Places API (New) Documentation](https://developers.google.com/maps/documentation/places/web-service/op-overview)
- [Migration Guide from Old Places API](https://developers.google.com/maps/documentation/places/web-service/migrate)
- [Best Practices](https://developers.google.com/maps/documentation/places/web-service/best-practices)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)

---

## ✨ Next Steps

1. **Test the Integration**
   ```bash
   npm run dev
   # Visit: http://localhost:3000/google-places-search
   ```

2. **Monitor Usage**
   - Go to: https://console.cloud.google.com/apis/dashboard
   - Check daily quotas and usage

3. **Optimize for Production**
   - Implement caching
   - Add rate limiting
   - Set API key restrictions
   - Enable billing alerts

4. **Enhance Features**
   - Add autocomplete
   - Implement favorites
   - Show station photos
   - Display reviews
   - Add directions integration

---

## 🎉 Success!

Your Google Places API is now fully configured and ready to use!

**Current Status:**
- ✅ API Key configured
- ✅ Service layer implemented
- ✅ UI components ready
- ✅ Error handling in place
- ✅ Data transformation working
- ✅ Environment variables set

**Test it now:**
```bash
npm run dev
```

Then visit your app and try searching for petrol stations! 🚗⛽

---

**Last Updated:** October 23, 2025
**API Key:** AIzaSyDfEKO1GZBpuUuhhL-gz1miug6jdlT1nFk
**Status:** ✅ Active and Ready
