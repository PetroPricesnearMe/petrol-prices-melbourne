# 🚀 Backend Server Quick Start Guide

## The "No Spatial Data Available" Error

This error occurs when the **backend server is not running**. The frontend React app needs the backend API to fetch station data.

---

## ✅ Quick Fix - Start the Backend Server

### Option 1: Start Backend Server (Recommended)

1. **Open a new terminal/command prompt**

2. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

3. **Install dependencies (first time only):**
   ```bash
   npm install
   ```

4. **Start the backend server:**
   ```bash
   npm start
   # OR
   node server.js
   ```

5. **You should see:**
   ```
   🚀 Server running on port 3001
   📊 API available at http://localhost:3001
   🔌 WebSocket server ready for connections
   ```

6. **Keep this terminal open** while using the app

7. **Refresh your browser** - the map should now load with data!

---

### Option 2: Start Both Frontend & Backend Together

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
npm start
```

---

## 🔧 Troubleshooting

### Issue: "Port 3001 is already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
cd backend
npm install
```

### Issue: "CORS error"

**Solution:** The CORS headers are already configured. Make sure:
- Backend is running on port 3001
- Frontend is running on port 3000
- Check `backend/config.js` for CORS settings

### Issue: "Baserow connection failed"

**Solution:** Check your `.env` file in the backend directory:
```bash
# backend/.env
BASEROW_TOKEN=your_token_here
BASEROW_API_URL=https://api.baserow.io/api
PORT=3001
```

---

## 🎯 Understanding the Architecture

### Frontend (Port 3000)
- React app with map interface
- Fetches data from backend API
- Uses `SpatialDataService` to get map data

### Backend (Port 3001)
- Express.js API server
- Connects to Baserow database
- Provides `/api/stations/spatial` endpoint
- Implements caching and rate limiting

### Data Flow:
```
Frontend → Backend API → Baserow → Backend API → Frontend
(React)    (Express)      (Database)  (Cached)     (Map)
```

---

## 📝 Environment Variables

### Frontend (.env in root):
```bash
REACT_APP_API_URL=http://localhost:3001
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### Backend (backend/.env):
```bash
PORT=3001
BASEROW_TOKEN=your_baserow_token
BASEROW_API_URL=https://api.baserow.io/api
NODE_ENV=development
```

---

## 🔍 Verify Backend is Running

### Test the API:
```bash
# Test if backend is responding
curl http://localhost:3001/api/stations/spatial

# OR open in browser:
http://localhost:3001/api/stations/spatial
```

**Expected response:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "Shell Melbourne CBD", "lat": -37.8136, "lng": 144.9631},
    ...
  ],
  "count": 250
}
```

---

## 🎨 Development Workflow

### Recommended Setup:

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev  # Or: nodemon server.js
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   npm start
   ```

3. **Terminal 3 - Available for commands:**
   ```bash
   # Run tests, git commands, etc.
   ```

---

## 🚀 Production Deployment

### Deploy Backend (e.g., Heroku, Railway, Render):
```bash
cd backend
git push heroku main
```

### Update Frontend .env:
```bash
REACT_APP_API_URL=https://your-backend.herokuapp.com
```

### Deploy Frontend (e.g., Vercel, Netlify):
```bash
npm run build
vercel deploy
```

---

## 🆘 Still Having Issues?

### Check Backend Logs:
The backend server prints helpful debug information:
- 🗺️ When spatial data is requested
- 📦 When cache is used
- ❌ When errors occur
- ✅ When requests succeed

### Check Browser Console:
Open DevTools (F12) → Console tab to see:
- Frontend → Backend communication
- Error messages
- API responses

### Common Solutions:
1. ✅ Make sure both frontend AND backend are running
2. ✅ Check port 3001 is available
3. ✅ Verify .env files are configured
4. ✅ Restart both servers after config changes
5. ✅ Clear browser cache (Ctrl+Shift+R)

---

## 📚 Related Documentation

- `SETUP_GUIDE.md` - Full setup instructions
- `DEBUGGING_GUIDE.md` - Debugging tips
- `backend/README.md` - Backend specific docs
- `AUDIT_FIXES_COMPLETED.md` - All recent fixes

---

## 🎉 Success!

Once the backend is running, you should see:
- ✅ Map loads with station markers
- ✅ No "No Spatial Data Available" error
- ✅ Clicking stations shows popup with details
- ✅ Console shows successful API calls

**Happy mapping! 🗺️**

