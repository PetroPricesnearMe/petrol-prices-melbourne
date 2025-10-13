# Quick Debug Reference Card

## 🚨 When Something Goes Wrong - First Steps

### 1. Check Console (30 seconds)
```
F12 → Console Tab
```
- 🔴 Red errors? → Fix those first
- ⚠️ Warnings? → Note for later
- No errors? → Check Network tab

### 2. Check Network (1 minute)
```
F12 → Network Tab → Filter: Fetch/XHR
```
- All requests `200 OK`? → Problem is frontend
- `CORS error`? → Backend or proxy issue
- `404`? → Check backend is running
- `500`? → Backend error (check server logs)

### 3. Quick Test (2 minutes)
```javascript
// In browser console
fetch('http://localhost:3001/health')
  .then(r => r.json())
  .then(console.log)
```
- ✅ Success? → Backend works, frontend issue
- ❌ Error? → Backend problem

---

## 🔍 Common Error Messages & Fixes

| Error | Quick Fix |
|-------|-----------|
| `Cannot read property 'X' of undefined` | Add `?.` optional chaining |
| `Network request failed` | Start backend: `cd backend && npm start` |
| `CORS policy blocked` | Use backend API URL, not direct Baserow |
| `Maximum update depth` | Check useEffect dependencies |
| `Mapbox token invalid` | Check `.env` file has `REACT_APP_MAPBOX_ACCESS_TOKEN` |
| `Module not found` | Run `npm install` |
| `Port 3000 in use` | Kill process or use different port |

---

## 🛠️ Component-Specific Issues

### MapboxMap Not Loading
```bash
# Check token
echo $REACT_APP_MAPBOX_ACCESS_TOKEN

# Should be ~100 chars starting with 'pk.'
# Not set? Add to .env and restart
```

### No Stations Showing
```javascript
// In browser console on Map page
console.log('Stations:', 
  document.querySelector('.map-container') ? 'Container exists' : 'Missing',
  window.mapboxgl ? 'Mapbox loaded' : 'Not loaded'
);
```

### DirectoryPage Empty
```javascript
// Check data
localStorage.clear(); // Clear cache
window.location.reload(); // Refresh
```

---

## 📡 API Debugging

### Test Backend Health
```bash
# Should return { success: true }
curl http://localhost:3001/health
```

### Test Stations Endpoint
```bash
# Should return array of stations
curl http://localhost:3001/api/stations/all | head -c 200
```

### Test Baserow Connection
```bash
# Should return { connected: true }
curl http://localhost:3001/api/baserow/test
```

---

## 🔧 Quick Fixes You Can Try Right Now

### Fix 1: Clear Everything & Restart
```bash
# Stop all servers (Ctrl+C)
rm -rf node_modules package-lock.json
npm install
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..

# Start backend
cd backend && npm start &

# Start frontend
npm start
```

### Fix 2: Reset Configuration
```bash
# Create/update .env file
cat > .env << EOL
REACT_APP_API_URL=http://localhost:3001
REACT_APP_MAPBOX_ACCESS_TOKEN=your_token_here
REACT_APP_BASEROW_TOKEN=your_token_here
EOL

# Restart server
```

### Fix 3: Use Mock Data (Emergency)
```javascript
// In src/services/DataSourceManager.js
// Add at line 12:
this.activeSource = 'mock'; // Force mock data
```

---

## 🏥 Health Check Script

Save and run when something is broken:

```bash
#!/bin/bash
# save as check-health.sh

echo "🔍 Checking Backend..."
curl -s http://localhost:3001/health > /dev/null && echo "✅ Backend OK" || echo "❌ Backend DOWN"

echo "🔍 Checking Frontend..."
curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend OK" || echo "❌ Frontend DOWN"

echo "🔍 Checking Stations API..."
curl -s http://localhost:3001/api/stations/all > /dev/null && echo "✅ API OK" || echo "❌ API DOWN"

echo "🔍 Checking Environment..."
[ -f .env ] && echo "✅ .env exists" || echo "⚠️  .env missing"
[ -n "$REACT_APP_MAPBOX_ACCESS_TOKEN" ] && echo "✅ Mapbox token set" || echo "⚠️  Mapbox token not set"
```

---

## 🐛 Debug Mode Activation

### Enable Verbose Logging
```javascript
// Add to src/index.js at the top
window.DEBUG = true;
localStorage.setItem('debug', 'true');
```

### Check React DevTools
```
F12 → Components Tab
```
- See component tree
- Check props and state
- See which components re-render

### Enable Network Throttling
```
F12 → Network Tab → Throttling: Slow 3G
```
- Test how app handles slow connections
- Find timeout issues

---

## 💾 Emergency Data Recovery

### If Data Disappears
```javascript
// In browser console
// Check what's stored
console.log('Cache:', localStorage.getItem('stations_cache'));

// Force refresh from API
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

### If API Fails, Use Mock Data
```javascript
// In any component
import dataSourceManager from '../services/DataSourceManager';

// Switch to mock
dataSourceManager.setActiveSource('mock');

// Force refresh
const stations = await dataSourceManager.fetchStations(true);
console.log('Mock stations:', stations);
```

---

## 📊 Performance Issues

### App Running Slow?
```javascript
// Check memory
console.log('Memory:', performance.memory);

// Profile renders
import { Profiler } from 'react';
<Profiler id="App" onRender={(id, phase, actualDuration) => {
  console.log(`${id} took ${actualDuration}ms`);
}}>
  <App />
</Profiler>
```

### Too Many Re-renders?
```javascript
// Add to component causing issues
useEffect(() => {
  console.log('Component rendered');
  console.trace(); // See what triggered render
});
```

### Memory Leak?
```
F12 → Performance Tab → Record → Use app → Stop
Look for: Rising memory usage
```

---

## 🔐 Authentication/Token Issues

### Invalid Baserow Token
```javascript
// Test token
fetch('https://api.baserow.io/api/user/', {
  headers: {
    'Authorization': 'Token YOUR_TOKEN'
  }
})
.then(r => r.json())
.then(console.log);

// Should return user info if valid
```

### Invalid Mapbox Token
```javascript
// Test token
const token = 'YOUR_TOKEN';
fetch(`https://api.mapbox.com/tokens/v2?access_token=${token}`)
  .then(r => r.json())
  .then(console.log);

// Should return token info if valid
```

---

## 🚀 Production Debugging

### Build Locally
```bash
npm run build
npx serve -s build

# Open http://localhost:3000
# Check console for errors
```

### Check Environment Variables
```javascript
// In production site console
console.log({
  api: process.env.REACT_APP_API_URL,
  hasMapbox: !!process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  hasBaserow: !!process.env.REACT_APP_BASEROW_TOKEN
});
```

### Enable Source Maps
```javascript
// In production, errors show minified code
// To see actual code, build with:
GENERATE_SOURCEMAP=true npm run build
```

---

## 🎯 Targeted Debugging

### Map Not Rendering
```javascript
// Check map container
console.log('Map container:', document.querySelector('.map-container'));

// Check Mapbox loaded
console.log('Mapbox GL:', window.mapboxgl);

// Check token
console.log('Token:', !!process.env.REACT_APP_MAPBOX_ACCESS_TOKEN);

// Check stations data
console.log('Stations:', petrolStations.length);
```

### Stations Not Fetching
```javascript
// Test data source manager
import dataSourceManager from './services/DataSourceManager';

async function test() {
  console.log('Status:', dataSourceManager.getStatus());
  
  try {
    const stations = await dataSourceManager.fetchStations(true);
    console.log('Success:', stations.length, 'stations');
  } catch (error) {
    console.error('Failed:', error);
  }
}

test();
```

### Filters Not Working
```javascript
// Check filter state
console.log({
  searchTerm,
  selectedSuburb,
  sortBy,
  filterBy,
  totalStations: petrolStations.length,
  filteredStations: filteredStations.length
});

// Test filter logic
const testFilter = petrolStations.filter(station => 
  station.name.toLowerCase().includes(searchTerm.toLowerCase())
);
console.log('Should show:', testFilter.length);
```

---

## 📞 Getting Help

### Before Asking for Help, Provide:

1. **Console Errors**
   ```javascript
   // Copy full error from console
   ```

2. **Network Errors**
   ```
   F12 → Network → Failed requests → Right-click → Copy as cURL
   ```

3. **Environment**
   ```javascript
   console.log({
     node: process.version,
     browser: navigator.userAgent,
     env: process.env.NODE_ENV
   });
   ```

4. **Steps to Reproduce**
   ```
   1. Go to /map
   2. Click on station
   3. Error appears
   ```

---

## ⚡ Pro Tips

### Bookmark These Shortcuts
- `Ctrl + Shift + I` - DevTools
- `Ctrl + Shift + C` - Element inspector
- `Ctrl + Shift + J` - Console
- `Ctrl + Shift + M` - Mobile view

### Useful Console Commands
```javascript
// Clear console
clear()

// Find elements
$('.class-name')
$('#id-name')

// Monitor function calls
monitor(functionName)

// Copy to clipboard
copy(objectToCopy)

// List all event listeners
getEventListeners(element)
```

### Browser Extensions to Install
- React Developer Tools
- Redux DevTools (if using Redux)
- Lighthouse (performance audit)

---

## 📋 Quick Checklist

Before deploying or when stuck, check:

- [ ] No console errors
- [ ] All network requests successful
- [ ] Backend running (`curl http://localhost:3001/health`)
- [ ] Environment variables set
- [ ] Tokens valid and not expired
- [ ] No memory leaks (check with DevTools)
- [ ] Works in production build
- [ ] Works in different browsers
- [ ] Works on mobile
- [ ] Handles slow network (test with throttling)
- [ ] Handles errors gracefully
- [ ] Loading states show correctly

---

## 🆘 Emergency Commands

### Nuclear Option - Reset Everything
```bash
# WARNING: This will delete everything and start fresh
rm -rf node_modules backend/node_modules
rm package-lock.json backend/package-lock.json
npm cache clean --force
npm install
cd backend && npm install
cd ..
```

### Kill All Node Processes
```bash
# If servers won't stop
killall node        # Mac/Linux
taskkill /F /IM node.exe  # Windows
```

### Clear All Browser Data
```
Ctrl + Shift + Delete
→ Check All
→ Time Range: All Time
→ Clear Data
```

---

**Keep this card handy for quick troubleshooting!**

*Last updated: October 9, 2025*

