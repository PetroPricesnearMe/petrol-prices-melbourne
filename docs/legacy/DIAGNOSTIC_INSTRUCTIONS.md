# 🔬 Comprehensive Diagnostic Instructions

## How to Use the Diagnostic Tools

### **Option 1: In-Browser Diagnostic Panel** (Recommended)

1. **Navigate to the Map page** that shows the error
2. **Click the "🔬 Run Diagnostics" button**
3. **Review the results** in the diagnostic panel
4. **Check details** by clicking "Show Details"

**What it tests:**
- ✅ Environment variables
- ✅ API configuration
- ✅ Backend connection
- ✅ CORS headers
- ✅ Baserow connectivity
- ✅ Spatial data fetch
- ✅ Mapbox token

**Interpreting Results:**
- **✅ Green** = Working correctly
- **⚠️ Yellow** = Warning (may work with fallbacks)
- **❌ Red** = Error (needs fixing)

---

### **Option 2: Backend Health Check Script**

Run from terminal to test backend independently:

```bash
node test-backend-health.js
```

**Expected Output (Healthy):**
```
🔬 Backend Health Check
==================================================
Testing: http://localhost:3001
==================================================

Testing: Root Endpoint... ✅ PASS (45ms)
   └─ Message: Melbourne Petrol Stations API

Testing: Spatial Data... ✅ PASS (123ms)
   └─ API Success: true
   └─ Data Count: 250

Testing: All Stations... ✅ PASS (156ms)
   └─ Data Count: 250

Testing: Paginated Stations... ✅ PASS (89ms)
   └─ Data Count: 100

Testing: Baserow Test... ✅ PASS (234ms)
   └─ API Success: true

==================================================
Summary:
✅ Passed: 5/5
❌ Failed: 0/5
==================================================

🎉 All tests passed! Backend is healthy.
```

**Expected Output (Backend Not Running):**
```
Testing: Root Endpoint... ❌ FAIL
   └─ Error: connect ECONNREFUSED 127.0.0.1:3001
   └─ Code: ECONNREFUSED
   └─ 💡 Backend server is not running
   └─ 🔧 Fix: cd backend && npm start

🚨 ALL TESTS FAILED - Backend server is likely not running

Quick Fix:
  1. Open a new terminal
  2. Run: cd backend
  3. Run: npm start
  4. Wait for: "🚀 Server running on port 3001"
  5. Rerun this test: node test-backend-health.js
```

---

## 📊 Diagnostic Results Interpretation

### **Test 1: Environment Variables**

**Success:**
```
✅ Environment variables configured
Details:
- REACT_APP_API_URL: http://localhost:3001
- REACT_APP_MAPBOX_ACCESS_TOKEN: pk.eyJ1Iwm...
- NODE_ENV: development
- hostname: localhost
```

**Warning:**
```
⚠️ REACT_APP_API_URL not set, using default
```
**Fix:** Create `.env` file with `REACT_APP_API_URL=http://localhost:3001`

---

### **Test 2: Backend Connection**

**Success:**
```
✅ Backend is running (45ms)
Details:
- status: 200
- responseTime: 45ms
- message: Melbourne Petrol Stations API
- version: 1.0.0
```

**Error:**
```
❌ Backend not running: connect ECONNREFUSED
Details:
- error: Failed to fetch
- suggestion: Start backend server: cd backend && npm start
```
**Fix:** Start the backend server (see below)

---

### **Test 3: CORS Check**

**Success:**
```
✅ CORS properly configured
Details:
- Access-Control-Allow-Origin: http://localhost:3000
- Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

**Error:**
```
❌ CORS policy blocking requests
```
**Fix:** Check `backend/server.js` CORS configuration

---

### **Test 4: Spatial Data Fetch**

**Success (Real Data):**
```
✅ Fetched 250 spatial points
Details:
- count: 250
- fetchTime: 123ms
```

**Warning (Fallback Data):**
```
⚠️ Using fallback data (backend unavailable)
Details:
- count: 5
- fetchTime: 12ms
- note: Fallback data being used
```
**Fix:** Start backend to get real data

**Error:**
```
❌ Fetch failed: Network error
```
**Fix:** Check network connectivity and backend status

---

### **Test 5: Mapbox Token**

**Success:**
```
✅ Mapbox token configured
Details:
- tokenPreview: pk.eyJ1Ijoienp...
```

**Warning:**
```
⚠️ Mapbox token not configured
Details:
- token: Not set
- suggestion: Set REACT_APP_MAPBOX_ACCESS_TOKEN in .env
```
**Fix:** Get token from https://mapbox.com and add to `.env`

---

## 🔧 Common Issues and Fixes

### Issue #1: Backend Not Running (MOST COMMON)

**Symptoms:**
- All diagnostics fail
- "ECONNREFUSED" error
- "Failed to fetch" errors

**Fix:**
```bash
# Terminal 1 - Start Backend
cd backend
npm install  # First time only
npm start

# Wait for:
# 🚀 Server running on port 3001
# 📊 API available at http://localhost:3001
# 🔌 WebSocket server ready for connections

# Terminal 2 - Keep Frontend Running
npm start
```

---

### Issue #2: Wrong API URL

**Symptoms:**
- 404 Not Found errors
- Requests going to wrong URL

**Fix:**
Create/update `.env` file in root:
```bash
REACT_APP_API_URL=http://localhost:3001
REACT_APP_MAPBOX_ACCESS_TOKEN=your_token_here
```

Restart frontend: `npm start`

---

### Issue #3: Port Already in Use

**Symptoms:**
- "EADDRINUSE" error
- Backend won't start

**Fix:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9

# Or use different port
# In backend/.env:
PORT=3002

# In root .env:
REACT_APP_API_URL=http://localhost:3002
```

---

### Issue #4: CORS Errors

**Symptoms:**
- "CORS policy" error in browser console
- Preflight request fails

**Fix:**
Check `backend/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',  // Must match frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

### Issue #5: Baserow Connection Issues

**Symptoms:**
- Backend starts but no data
- "Failed to connect to Baserow" errors

**Fix:**
Check `backend/.env`:
```bash
BASEROW_TOKEN=your_actual_token_here
BASEROW_API_URL=https://api.baserow.io/api
```

Test Baserow connection:
```bash
curl http://localhost:3001/api/baserow/test
```

---

## 🎯 Step-by-Step Troubleshooting Workflow

### Step 1: Run Backend Health Check
```bash
node test-backend-health.js
```

**If all tests fail → Backend not running**  
**If some tests fail → Configuration issues**  
**If all pass → Problem is elsewhere**

### Step 2: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors in red
4. Check Network tab for failed requests

### Step 3: Run In-Browser Diagnostics
1. Navigate to /map
2. Click "Run Diagnostics" button
3. Review all test results
4. Click "Show Details" for more info

### Step 4: Fix Issues in Order
1. **Backend Connection** (highest priority)
2. **Environment Variables**
3. **CORS Configuration**
4. **Baserow Connection**
5. **Mapbox Token**

### Step 5: Retest After Each Fix
```bash
# Retest backend
node test-backend-health.js

# Refresh browser
Ctrl + Shift + R

# Rerun diagnostics
Click "🔄 Rerun Tests" in diagnostic panel
```

---

## 📝 Checklist for Full Functionality

- [ ] Backend server is running (port 3001)
- [ ] Frontend server is running (port 3000)
- [ ] `.env` file exists with correct values
- [ ] `backend/.env` file exists with Baserow token
- [ ] Backend health check passes all tests
- [ ] Browser diagnostic panel shows all green
- [ ] Map page loads without errors
- [ ] Station markers appear on map
- [ ] Clicking markers shows popups
- [ ] Directory page loads with data

---

## 🆘 Still Having Issues?

### Advanced Debugging

1. **Enable Verbose Logging:**
   ```bash
   # In backend
   DEBUG=* node server.js
   ```

2. **Check All Ports:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   
   # Mac/Linux
   lsof -i :3000
   lsof -i :3001
   ```

3. **Test Direct API Calls:**
   ```bash
   curl -v http://localhost:3001/
   curl -v http://localhost:3001/api/stations/spatial
   ```

4. **Check Backend Logs:**
   Look in the backend terminal for:
   - 🗺️ Spatial data requests
   - ❌ Error messages
   - 📦 Cache hits/misses

5. **Clear Everything and Restart:**
   ```bash
   # Kill all node processes
   # Windows: Task Manager → End node.exe
   # Mac/Linux: killall node
   
   # Clear caches
   rm -rf node_modules package-lock.json
   npm install
   
   # Restart fresh
   cd backend && npm start
   # New terminal
   npm start
   ```

---

## 📚 Related Documentation

- `BACKEND_QUICK_START.md` - Backend setup guide
- `DIAGNOSTIC_ANALYSIS.md` - Technical analysis
- `SETUP_GUIDE.md` - Full setup instructions
- `DEBUGGING_GUIDE.md` - General debugging tips

---

**Status Codes:**
- `200` = Success ✅
- `404` = Not Found (wrong URL) ❌
- `500` = Server Error (backend issue) ❌
- `ECONNREFUSED` = Server not running ❌
- `ETIMEDOUT` = Request timeout ⚠️

**Need more help?** Check browser console and backend logs for specific error messages.

