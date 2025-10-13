# Setup Instructions - Petrol Prices Near Me

## Quick Setup

### 1. Environment Configuration ✅ COMPLETED

Your `.env.local` file has been automatically created with all required credentials:

```env
# Mapbox for interactive maps
REACT_APP_MAPBOX_TOKEN=pk.eyJ1IjoicGV0cm9scHJpY2VzIiwiYSI6ImNtZW82a2ZkbzEzZzEycHB4bnN2a3d6MWYifQ.hOEEwKVHFhA2_IAxvj59SA

# Baserow database token for live fuel price data
REACT_APP_BASEROW_TOKEN=G2bhijqxqtg0O05dc176fwDpaUPDSIgj

# Baserow SSE endpoint for real-time updates
REACT_APP_BASEROW_SSE_URL=https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse
```

**All credentials are configured! ✅** 

Your Baserow database URL: https://baserow.io/public/grid/MIhg-ye0C_K99qvwTzoH6MCvTMAHLbwHR0C4aZKP674

### 2. Install Dependencies

```bash
npm install
```

This will install:
- react-helmet-async (for SEO)
- All existing dependencies

### 3. Run Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

---

## What's New

### ✅ Features Enabled

With all credentials configured, you now have access to:

#### Live Baserow Data (661 Stations!)
- 🏪 **Real Petrol Stations** - Connected to your Baserow database with 661+ Melbourne stations
- 💰 **Live Fuel Prices** - Real-time pricing data from your database
- 📊 **Station Details** - Names, addresses, postal codes, regions, brands
- 🔄 **Real-time Updates** - SSE connection for instant price updates

#### Interactive Maps
- 🗺️ **Map View** - View all 661 stations on interactive Mapbox
- 📍 **Geolocation** - Auto-detect your location to find nearby stations
- 🎨 **Color-coded Markers** - Visual price indicators (green=cheap, red=expensive)
- 🧭 **Directions** - Get directions to any station

#### Your Database Includes:
- **7-Eleven** stations (Hoppers Crossing, Kings Park, etc.)
- **BP** stations (over 50 locations)
- **Ampol** stations (Beechworth, Brooklyn, Wollert, etc.)
- **Shell**, **Mobil**, **Caltex**, and more
- Coverage across Melbourne regions: North, South, East, West, CBD

### 🎛️ Advanced Filtering

- Search by name, address, suburb
- Filter by fuel type (Unleaded, Premium, Diesel, etc.)
- Filter by brand (Shell, BP, 7-Eleven, etc.)
- Filter by region (North, South, East, West Melbourne, CBD)
- Sort by name, price, distance, or update time
- Price range filtering

### 📊 Analytics Dashboard

Access analytics data:

```javascript
import { getAnalyticsReport } from './utils/analytics';
const report = getAnalyticsReport('7days');
console.log(report);
```

---

## Optional Configuration

### Google Analytics (Optional)

Add to `.env.local`:
```env
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Custom Analytics Endpoint (Optional)

Add to `.env.local`:
```env
REACT_APP_ANALYTICS_ENDPOINT=https://your-analytics.com/track
```

---

## Testing the Setup

1. **Start the app**: `npm start`
2. **Visit**: http://localhost:3000
3. **Navigate to**: Directory page
4. **Click**: "Map" view toggle
5. **Verify**: Interactive map loads with station markers

If the map doesn't load, check:
- `.env.local` file exists in project root
- Token is correctly copied
- Development server was restarted after creating `.env.local`

---

## Deployment to Vercel

### Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable Name | Value |
|--------------|-------|
| `REACT_APP_MAPBOX_TOKEN` | `pk.eyJ1IjoicGV0cm9scHJpY2VzIiwiYSI6ImNtZW82a2ZkbzEzZzEycHB4bnN2a3d6MWYifQ.hOEEwKVHFhA2_IAxvj59SA` |

### Deploy Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or push to GitHub and connect repository in Vercel dashboard.

---

## File Structure

```
PPNM/
├── .env.local                    # ← Create this file
├── src/
│   ├── components/
│   │   ├── AdvancedFilters.js   # New: Advanced filtering
│   │   ├── StationMap.js        # New: Interactive map
│   │   ├── Breadcrumbs.js       # New: Navigation
│   │   ├── SEO.js              # New: SEO management
│   │   └── ...
│   ├── utils/
│   │   └── analytics.js         # New: Analytics tracking
│   └── styles/
│       └── design-system.css    # New: Design system
└── package.json
```

---

## Troubleshooting

### Map Not Loading

**Problem**: Map shows loading spinner or error

**Solutions**:
1. Check `.env.local` exists: `dir .env.local`
2. Verify token format (should start with `pk.`)
3. Restart dev server: Stop and run `npm start` again
4. Clear browser cache and reload
5. Check browser console for errors

### Analytics Not Working

**Problem**: Events not being tracked

**Solutions**:
1. Open browser DevTools → Console
2. Look for "📊 Analytics Event:" logs (development mode)
3. Check localStorage: `localStorage.getItem('ppnm_analytics')`
4. Verify analytics.js is imported correctly

### Build Errors

**Problem**: Build fails with errors

**Solutions**:
1. Delete node_modules: `rm -r node_modules`
2. Reinstall: `npm install`
3. Clear cache: `npm cache clean --force`
4. Build again: `npm run build`

---

## Next Steps

1. ✅ Create `.env.local` with your Mapbox token
2. ✅ Run `npm install`
3. ✅ Start development: `npm start`
4. ✅ Test all features (map, filters, search)
5. ✅ Build for production: `npm run build`
6. ✅ Deploy to Vercel

---

## Support

- **Design Guide**: See `DESIGN_SYSTEM_GUIDE.md`
- **Features Overview**: See `MODERNIZATION_SUMMARY.md`
- **Implementation**: See `IMPLEMENTATION_COMPLETE.md`

---

**Your Mapbox Token**: `pk.eyJ1IjoicGV0cm9scHJpY2VzIiwiYSI6ImNtZW82a2ZkbzEzZzEycHB4bnN2a3d6MWYifQ.hOEEwKVHFhA2_IAxvj59SA`

Save this token safely - you'll need it for production deployment!

---

**Setup Time**: ~2 minutes  
**Status**: Ready to run! 🚀

