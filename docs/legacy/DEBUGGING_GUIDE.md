# Step-by-Step Debugging Guide
## Isolating and Resolving Persistent Bugs in React Components

---

## Table of Contents
1. [Quick Start - Immediate Debugging](#1-quick-start---immediate-debugging)
2. [Component-Specific Debugging](#2-component-specific-debugging)
3. [Network & API Debugging](#3-network--api-debugging)
4. [Memory Leak Detection](#4-memory-leak-detection)
5. [Production Issue Debugging](#5-production-issue-debugging)
6. [Common Patterns & Solutions](#6-common-patterns--solutions)

---

## 1. Quick Start - Immediate Debugging

### Step 1: Check for Console Errors (5 minutes)

**Open Browser DevTools:**
- Chrome/Edge: `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Firefox: `F12` or `Ctrl+Shift+K`

**What to Look For:**
```
❌ Red errors - Critical issues that break functionality
⚠️  Yellow warnings - Potential issues
ℹ️  Blue info - Informational messages
```

**Common Errors & Quick Fixes:**

| Error Message | Likely Cause | Quick Fix |
|--------------|-------------|-----------|
| `Cannot read property 'X' of undefined` | Missing null checks | Add optional chaining `?.` |
| `Network request failed` | Backend not running or CORS | Start backend, check CORS config |
| `Invalid hook call` | React version mismatch | Check `react` and `react-dom` versions match |
| `Maximum update depth exceeded` | Infinite re-render loop | Check useEffect dependencies |

### Step 2: Run Health Check Script (2 minutes)

```bash
# Make sure backend is running first
cd backend
npm start

# In another terminal, run health check
node test-frontend-health.js
```

**Interpret Results:**
- ✅ All pass → Backend is healthy, issue is frontend-specific
- ❌ Some fail → Backend or network issue
- 🚨 Critical fail → Start backend or check configuration

### Step 3: Test with Mock Data (5 minutes)

**Temporarily disable real API calls:**

```javascript
// In src/services/DataSourceManager.js
// Add at the top of the file
const FORCE_MOCK = true; // Set to true for testing

// In fetchStations method
async fetchStations(forceRefresh = false) {
  if (FORCE_MOCK) {
    console.log('🧪 Using mock data for testing');
    return this.getMockStations();
  }
  // ... rest of code
}
```

**If this fixes the issue:**
→ Problem is with API integration, network, or data format

**If issue persists:**
→ Problem is with component logic or rendering

---

## 2. Component-Specific Debugging

### Debugging MapPage/MapboxMap Component

#### Issue: Map Not Loading

**Checklist:**
```bash
# 1. Check Mapbox token
echo $REACT_APP_MAPBOX_ACCESS_TOKEN

# 2. Verify token in browser console
console.log('Token:', process.env.REACT_APP_MAPBOX_ACCESS_TOKEN?.substring(0, 10));

# 3. Check if token is valid
# Token should start with 'pk.' and be ~100 characters long
```

**Common Issues:**
1. **Token not set** → Create `.env` file with token
2. **Invalid token** → Get new token from mapbox.com
3. **Token revoked** → Generate new token in Mapbox dashboard

**Debug Steps:**
```javascript
// Add to MapboxMap.js, before return statement
console.log('🗺️ Debug Info:', {
  hasToken: !!MAPBOX_TOKEN,
  tokenLength: MAPBOX_TOKEN?.length,
  tokenPreview: MAPBOX_TOKEN?.substring(0, 10),
  stationCount: petrolStations.length,
  loading,
  error
});
```

#### Issue: Stations Not Appearing on Map

**Step 1: Verify Data**
```javascript
// Add to MapboxMap.js in fetchStations success block
console.log('📊 Station Data Sample:', {
  total: stations.length,
  first: stations[0],
  hasValidCoords: stations.every(s => s.lat && s.lng),
  coordRanges: {
    lat: [Math.min(...stations.map(s => s.lat)), Math.max(...stations.map(s => s.lat))],
    lng: [Math.min(...stations.map(s => s.lng)), Math.max(...stations.map(s => s.lng))]
  }
});
```

**Step 2: Check GeoJSON Generation**
```javascript
// Add to createClusterData function
const geoJSON = {
  type: 'FeatureCollection',
  features
};

console.log('🗺️ GeoJSON Debug:', {
  featureCount: geoJSON.features.length,
  firstFeature: geoJSON.features[0],
  allValid: geoJSON.features.every(f => 
    f.geometry && 
    Array.isArray(f.geometry.coordinates) &&
    f.geometry.coordinates.length === 2
  )
});

return geoJSON;
```

**Step 3: Inspect Mapbox Layer**
```javascript
// Add onLoad handler to Map component
onLoad={(e) => {
  console.log('🗺️ Map loaded:', {
    style: e.target.getStyle(),
    layers: e.target.getStyle().layers.map(l => l.id),
    sources: Object.keys(e.target.getStyle().sources)
  });
}}
```

#### Issue: Map Performance Issues

**Profile Re-renders:**
```javascript
// Wrap component with profiler
import { Profiler } from 'react';

function onRenderCallback(
  id, phase, actualDuration, baseDuration, startTime, commitTime
) {
  console.log(`🔍 ${id} ${phase} render took ${actualDuration}ms`);
}

<Profiler id="MapboxMap" onRender={onRenderCallback}>
  <MapboxMap />
</Profiler>
```

**Check for Excessive Updates:**
```javascript
// Add to component
useEffect(() => {
  console.log('🔄 MapboxMap re-render triggered');
  console.trace(); // Shows what caused re-render
});
```

**Fix:** Memoize expensive computations
```javascript
const clusterData = useMemo(
  () => createClusterData(), 
  [petrolStations, selectedFuelType]
);
```

### Debugging DirectoryPage Component

#### Issue: Stations Not Loading

**Step 1: Check API Call**
```javascript
// Add to fetchStationsFromBaserow
console.log('🔍 Fetching stations...');
const baserowStations = await baserowAPI.fetchAllStations();
console.log('📊 Raw API Response:', {
  type: typeof baserowStations,
  isArray: Array.isArray(baserowStations),
  length: baserowStations?.length,
  sample: baserowStations?.[0]
});
```

**Step 2: Verify Data Transformation**
```javascript
// Add after transformation
console.log('🔄 Transformation Results:', {
  input: baserowStations.length,
  output: transformedStations.length,
  dropped: baserowStations.length - transformedStations.length,
  sampleTransformed: transformedStations[0]
});
```

**Step 3: Check Filtering Logic**
```javascript
// Add to useEffect
console.log('🔍 Filter Debug:', {
  total: petrolStations.length,
  searchTerm,
  selectedSuburb,
  filterBy,
  filtered: filtered.length
});
```

### Debugging DataSourceManager

#### Issue: Data Not Fetching

**Step 1: Check Active Source**
```javascript
// In browser console
import dataSourceManager from './services/DataSourceManager';
console.log(dataSourceManager.getStatus());
```

**Step 2: Test Connection**
```javascript
// In browser console or component
async function testDataSource() {
  const status = dataSourceManager.getStatus();
  console.log('📊 Data Source Status:', status);
  
  try {
    const stations = await dataSourceManager.fetchStations(true); // Force refresh
    console.log('✅ Fetch successful:', stations.length, 'stations');
  } catch (error) {
    console.error('❌ Fetch failed:', error);
  }
}
testDataSource();
```

**Step 3: Check Cache**
```javascript
// Add to DataSourceManager
getDebugInfo() {
  return {
    activeSource: this.activeSource,
    cacheSize: this.dataCache.size,
    cacheKeys: Array.from(this.dataCache.keys()),
    lastFetch: this.lastFetchTime,
    cacheValid: this.isCacheValid(),
    isLoading: this.isLoading
  };
}
```

---

## 3. Network & API Debugging

### Step 1: Monitor Network Traffic

**Open Network Tab:**
1. DevTools → Network tab
2. Reload page
3. Filter by `XHR` or `Fetch`

**What to Check:**

| Column | What to Look For | Good | Bad |
|--------|------------------|------|-----|
| Status | HTTP status code | 200 | 404, 500, CORS error |
| Type | Request type | xhr, fetch | (failed) |
| Size | Response size | > 0 KB | 0 B or failed |
| Time | Response time | < 1s | > 5s or timeout |

**Common Network Issues:**

#### CORS Errors
```
Access to fetch at 'https://api.baserow.io/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Fixes:**
1. **Use backend as proxy** (recommended):
   ```javascript
   // In src/config.js
   api: {
     baseUrl: 'http://localhost:3001' // Always use backend
   }
   ```

2. **Configure CORS on Baserow** (if you control it):
   - Add your domain to allowed origins
   - Enable credentials if needed

3. **Temporary: Use CORS proxy** (development only):
   ```javascript
   corsProxy: 'https://cors-anywhere.herokuapp.com/'
   ```

#### Timeout Errors
```
Error: Request timeout after 10000ms
```

**Fixes:**
1. Increase timeout:
   ```javascript
   signal: AbortSignal.timeout(30000) // 30 seconds
   ```

2. Add retry logic:
   ```javascript
   async function fetchWithRetry(url, options = {}, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         return await fetch(url, options);
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   }
   ```

#### 404 Not Found
```
GET http://localhost:3001/api/stations/all 404 (Not Found)
```

**Fixes:**
1. Check backend is running: `curl http://localhost:3001/health`
2. Verify API route exists in `backend/src/server.ts`
3. Check for typos in URL

### Step 2: Inspect Request/Response

**Click on failed request → Headers tab:**

```
General:
  Request URL: http://localhost:3001/api/stations/all
  Request Method: GET
  Status Code: 500 Internal Server Error

Request Headers:
  Content-Type: application/json
  Authorization: Token xyz...

Response Headers:
  Content-Type: application/json
  Access-Control-Allow-Origin: *
```

**Check Response tab for error details:**
```json
{
  "success": false,
  "error": "Database connection failed",
  "details": "..."
}
```

### Step 3: Test API Directly

**Using curl:**
```bash
# Test backend health
curl http://localhost:3001/health

# Test stations endpoint
curl http://localhost:3001/api/stations/all

# Test with headers
curl -H "Content-Type: application/json" \
     http://localhost:3001/api/stations/all
```

**Using browser console:**
```javascript
// Test fetch
fetch('http://localhost:3001/api/stations/all')
  .then(r => r.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err));
```

**Using Postman or Thunder Client:**
1. Create new request
2. Set URL: `http://localhost:3001/api/stations/all`
3. Set Method: `GET`
4. Click Send
5. Inspect response

---

## 4. Memory Leak Detection

### Symptoms of Memory Leaks
- Browser becomes slow over time
- Page freezes after extended use
- Console shows "Out of memory" errors
- High memory usage in Task Manager

### Step 1: Profile Memory Usage

**Chrome DevTools → Performance tab:**
1. Click Record
2. Interact with your app (navigate, click buttons)
3. Stop recording
4. Look for increasing memory pattern (sawtooth is normal, continuous climb is bad)

**Chrome DevTools → Memory tab:**
1. Take heap snapshot
2. Use app for 5 minutes
3. Take another snapshot
4. Compare snapshots
5. Look for "Detached" objects

### Step 2: Common Memory Leak Patterns

#### Pattern 1: Event Listeners Not Removed
```javascript
// ❌ BAD - Leak
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // Missing cleanup!
}, []);

// ✅ GOOD - No leak
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

#### Pattern 2: Intervals Not Cleared
```javascript
// ❌ BAD - Leak
useEffect(() => {
  setInterval(() => {
    updatePrices();
  }, 1000);
}, []);

// ✅ GOOD - No leak
useEffect(() => {
  const intervalId = setInterval(() => {
    updatePrices();
  }, 1000);
  
  return () => clearInterval(intervalId);
}, []);
```

#### Pattern 3: Fetch Requests Not Cancelled
```javascript
// ❌ BAD - Leak
useEffect(() => {
  fetch('/api/data').then(data => setState(data));
}, []);

// ✅ GOOD - No leak
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(data => setState(data))
    .catch(err => {
      if (err.name === 'AbortError') return;
      console.error(err);
    });
  
  return () => controller.abort();
}, []);
```

### Step 3: Fix Memory Leaks in Your Code

**Check MapboxMap.js:**
```javascript
// Current issue in lines 79-99
useEffect(() => {
  const fetchStations = async () => {
    // ...
    const priceUpdateInterval = setInterval(() => { ... }, 30000);
    
    // ❌ This return only runs if fetch succeeds
    return () => {
      clearInterval(priceUpdateInterval);
    };
  };
  
  fetchStations(); // Return value is ignored!
}, []);
```

**Fixed version:**
```javascript
useEffect(() => {
  let isMounted = true;
  let priceUpdateInterval = null;
  const controller = new AbortController();
  
  const fetchStations = async () => {
    try {
      const stations = await dataSourceManager.fetchStations({
        signal: controller.signal
      });
      
      if (!isMounted) return;
      
      setPetrolStations(stations);
      
      // Set up interval only after success
      priceUpdateInterval = setInterval(() => {
        if (!isMounted) return;
        updatePrices();
      }, 30000);
      
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error:', error);
    }
  };
  
  fetchStations();
  
  // ✅ Cleanup always runs
  return () => {
    isMounted = false;
    controller.abort();
    if (priceUpdateInterval) {
      clearInterval(priceUpdateInterval);
    }
  };
}, []);
```

---

## 5. Production Issue Debugging

### Step 1: Simulate Production Locally

```bash
# Build production bundle
npm run build

# Serve production build
npx serve -s build

# Open http://localhost:3000
```

**Check for production-only issues:**
- Console errors not seen in development
- Missing environment variables
- Minification breaking code
- Missing assets

### Step 2: Check Environment Variables

**Create `.env.production`:**
```bash
REACT_APP_API_URL=https://your-api.com
REACT_APP_MAPBOX_ACCESS_TOKEN=your_production_token
REACT_APP_BASEROW_TOKEN=your_production_token
```

**Verify they're loaded:**
```javascript
// In browser console on production site
console.log('API URL:', process.env.REACT_APP_API_URL);
console.log('Has Mapbox token:', !!process.env.REACT_APP_MAPBOX_ACCESS_TOKEN);
```

### Step 3: Enable Production Error Tracking

**Install Sentry (or similar):**
```bash
npm install @sentry/react
```

**Configure:**
```javascript
// src/index.js
import * as Sentry from "@sentry/react";

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "your-sentry-dsn",
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay()
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

---

## 6. Common Patterns & Solutions

### Pattern: "Cannot read property 'X' of undefined"

**Cause:** Trying to access property on undefined/null object

**Debug:**
```javascript
// Add before the error line
console.log('Debug:', { object, property: object?.X });
```

**Solution:**
```javascript
// Use optional chaining
const value = object?.property?.nested;

// Or default values
const value = object?.property ?? 'default';

// Or early return
if (!object) return null;
```

### Pattern: "Maximum update depth exceeded"

**Cause:** Infinite re-render loop

**Debug:**
```javascript
// Add to component
let renderCount = 0;
console.log('Render #', ++renderCount);

// Add to useEffect
useEffect(() => {
  console.log('Effect triggered by:', dependencies);
}, dependencies);
```

**Common causes:**
```javascript
// ❌ Creating new object in render
<Component data={{ x: 1 }} /> // New object every render

// ✅ Use state or memo
const data = useMemo(() => ({ x: 1 }), []);
<Component data={data} />

// ❌ Missing dependency
useEffect(() => {
  setState(data.value); // data not in deps
}, []); // Missing: [data]

// ✅ Include all dependencies
useEffect(() => {
  setState(data.value);
}, [data]); // Correct
```

### Pattern: "React Hook useEffect has a missing dependency"

**Warning message:**
```
React Hook useEffect has a missing dependency: 'someFunction'. 
Either include it or remove the dependency array.
```

**Solutions:**

**Option 1:** Add to dependencies
```javascript
useEffect(() => {
  someFunction();
}, [someFunction]); // Add dependency
```

**Option 2:** Wrap function in useCallback
```javascript
const someFunction = useCallback(() => {
  // function body
}, []); // With its own dependencies

useEffect(() => {
  someFunction();
}, [someFunction]);
```

**Option 3:** Move function inside useEffect
```javascript
useEffect(() => {
  const someFunction = () => {
    // function body
  };
  someFunction();
}, []); // No external dependencies
```

### Pattern: "Network request failed"

**Checklist:**
- [ ] Backend is running
- [ ] CORS is configured
- [ ] URL is correct
- [ ] Network connection exists
- [ ] No firewall blocking

**Debug:**
```javascript
try {
  const response = await fetch(url);
  console.log('Response:', {
    ok: response.ok,
    status: response.status,
    headers: Object.fromEntries(response.headers)
  });
} catch (error) {
  console.error('Fetch error:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
}
```

---

## Quick Reference Commands

### Start Development Environment
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
npm install
npm start
```

### Run Tests
```bash
# Health check
node test-frontend-health.js

# Unit tests
npm test

# E2E tests (if configured)
npm run test:e2e
```

### Build Production
```bash
npm run build
npx serve -s build
```

### Debug Tools
```bash
# Check bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Check for unused dependencies
npx depcheck

# Check for security issues
npm audit

# Check for outdated packages
npm outdated
```

---

## Troubleshooting Flowchart

```
Issue occurs
    ↓
Is there a console error?
    ├─ YES → Fix the error first
    └─ NO → Continue
        ↓
Does it work with mock data?
    ├─ YES → Issue is API/Network related
    │         → Check Network tab
    │         → Test API directly
    │         → Check CORS, auth, backend
    └─ NO → Issue is component/logic related
              → Add console.logs
              → Check state updates
              → Profile re-renders
              → Check for memory leaks
```

---

## Getting Help

If you're still stuck after following this guide:

1. **Gather Debug Info:**
   ```javascript
   // Run this in browser console
   const debugInfo = {
     userAgent: navigator.userAgent,
     url: window.location.href,
     consoleErrors: /* copy console errors */,
     networkErrors: /* copy from Network tab */,
     componentState: /* relevant state */
   };
   console.log(JSON.stringify(debugInfo, null, 2));
   ```

2. **Check Documentation:**
   - React: https://react.dev
   - Mapbox: https://docs.mapbox.com
   - Baserow: https://baserow.io/docs

3. **Search for Similar Issues:**
   - Stack Overflow
   - GitHub issues
   - React DevTools Discord

4. **Create a Minimal Reproduction:**
   - Isolate the bug in a small example
   - Share on CodeSandbox or similar

---

**Last Updated:** October 9, 2025
**Version:** 1.0

