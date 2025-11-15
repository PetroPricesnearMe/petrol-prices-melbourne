# Google Analytics 4 Setup Guide

## 🎯 Overview

This application uses **Google Analytics 4 (GA4)** with proper environment variable configuration and enhanced tracking capabilities.

## ✅ What's Been Updated

### 1. **Environment Variable Integration**

- ✅ Removed hardcoded GA measurement IDs
- ✅ Uses `REACT_APP_GA_MEASUREMENT_ID` environment variable
- ✅ Gracefully handles missing configuration (won't break if not set)

### 2. **New Google Analytics Module** (`src/utils/googleAnalytics.js`)

- ✅ Centralized GA4 initialization
- ✅ Custom tracking functions for fuel price app
- ✅ Enhanced measurement configuration
- ✅ Proper session tracking

### 3. **Enhanced Event Tracking**

- ✅ Fuel price searches
- ✅ Station interactions (views, directions, calls)
- ✅ Price comparisons
- ✅ Filter usage
- ✅ User conversions
- ✅ Page views with proper routing

### 4. **Updated Files**

- ✅ `public/index.html` - Removed hardcoded GA script
- ✅ `src/index.js` - Added GA initialization on app load
- ✅ `src/utils/analytics.js` - Enhanced with GA4 integration
- ✅ `src/utils/googleAnalytics.js` - New dedicated GA4 module
- ✅ `public/sitemap.xml` - Fixed image reference (jpg → svg)

---

## 🚀 Setup Instructions

### Step 1: Create Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left gear icon)
3. In the **Account** column, select your account or create a new one
4. In the **Property** column, click **Create Property**
5. Fill in property details:
   - **Property name**: `Petrol Prices Near Me`
   - **Time zone**: `Australia/Melbourne`
   - **Currency**: `Australian Dollar (AUD)`
6. Click **Next** and complete the setup wizard
7. Under **Data Streams**, click **Add stream** → **Web**
8. Enter your website URL: `https://petrolpricesnearme.com.au`
9. **Copy the Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Configure Environment Variable

#### For Local Development:

Create a `.env.local` file in your project root:

```bash
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### For Production (Vercel):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `REACT_APP_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
4. Click **Save**
5. Redeploy your application

#### For Production (Netlify):

1. Go to **Site Settings** → **Environment Variables**
2. Click **Add a variable**
3. Set:
   - **Key**: `REACT_APP_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX`
4. Click **Create variable**
5. Trigger a new deploy

### Step 3: Verify Installation

1. **Restart your development server** if running locally:

   ```bash
   npm start
   ```

2. **Open your browser console** (F12) and look for:

   ```
   📊 Initializing Google Analytics 4: G-XXXXXXXXXX
   ✅ Google Analytics 4 initialized successfully
   ```

3. **Test tracking in real-time:**
   - Go to GA4 → **Reports** → **Realtime**
   - Navigate your site and watch events appear
   - Should see: `page_view`, `fuel_search`, `station_interaction`, etc.

---

## 📊 Custom Events Tracked

### Automatic Events

- `page_view` - Every page navigation
- `session_start` - When user starts session
- `session_end` - When user leaves/closes tab
- `scroll` - 90% scroll depth
- `outbound_clicks` - External link clicks
- `site_search` - Search queries
- `file_downloads` - Downloaded files

### Custom Events

| Event Name            | Description                          | Parameters                         |
| --------------------- | ------------------------------------ | ---------------------------------- |
| `fuel_search`         | User searches for fuel prices        | `fuel_type`, `search_location`     |
| `station_interaction` | User interacts with station          | `station_name`, `interaction_type` |
| `price_comparison`    | User compares prices                 | `fuel_type`, `station_count`       |
| `filter_applied`      | User applies filters                 | `filter_type`, `filter_value`      |
| `conversion`          | User takes action (directions, call) | `conversion_type`, `station_name`  |

### Custom Dimensions

- **Dimension 1**: `fuel_type` - Type of fuel searched
- **Dimension 2**: `station_brand` - Brand of petrol station
- **Dimension 3**: `region` - Melbourne region
- **Dimension 4**: `price_range` - Price category

---

## 🔧 Usage in Components

### Track Custom Event

```javascript
import { trackGAEvent } from '../utils/googleAnalytics';

// Track a custom event
trackGAEvent('custom_event_name', {
  parameter1: 'value1',
  parameter2: 'value2',
});
```

### Track Fuel Search

```javascript
import { trackFuelSearch } from '../utils/googleAnalytics';

trackFuelSearch('Unleaded', 'Melbourne CBD');
```

### Track Station Interaction

```javascript
import { trackStationInteraction } from '../utils/googleAnalytics';

trackStationInteraction('Shell Melbourne', 'directions');
```

### Track Price Comparison

```javascript
import { trackPriceComparison } from '../utils/googleAnalytics';

trackPriceComparison('Diesel', 15); // compared 15 stations
```

### Track Conversion

```javascript
import { trackConversion } from '../utils/googleAnalytics';

trackConversion('directions', 'BP South Yarra');
```

---

## 🎯 Enhanced Measurement Features

GA4 Enhanced Measurement is automatically enabled for:

- ✅ **Scrolls** - Tracks 90% scroll depth
- ✅ **Outbound clicks** - External link tracking
- ✅ **Site search** - Query parameter tracking
- ✅ **File downloads** - PDF, CSV, etc. downloads
- ❌ **Video engagement** - Disabled (no video content)

---

## 📈 Recommended GA4 Setup

### 1. Create Custom Reports

- **Fuel Type Performance**: Which fuel types are most searched
- **Regional Analysis**: Most active Melbourne regions
- **Station Popularity**: Top viewed/clicked stations
- **Conversion Funnel**: Search → View → Directions/Call

### 2. Set Up Conversions

Mark these events as conversions in GA4:

1. `conversion` - Primary conversion event
2. `station_interaction` (type: directions)
3. `station_interaction` (type: phone)

### 3. Configure Audiences

Create audiences for:

- **Active Price Shoppers**: Users who search frequently
- **Regional Users**: Users from specific Melbourne areas
- **Mobile Users**: Mobile device users
- **Returning Users**: Users with 2+ sessions

### 4. Link Google Ads (Optional)

- Connect GA4 to Google Ads for remarketing
- Target users who searched but didn't convert
- Show ads for stations in their region

---

## 🐛 Troubleshooting

### GA Not Initializing

**Symptom**: Console shows "Measurement ID not configured"

**Solution**:

1. Check `.env.local` file exists with correct variable
2. Restart development server (`npm start`)
3. Verify environment variable in Vercel/Netlify dashboard
4. Ensure variable starts with `REACT_APP_`

### Events Not Showing in GA4

**Symptom**: Events tracked but not appearing in GA4

**Solution**:

1. Check **Realtime** report (not standard reports)
2. Wait 24-48 hours for historical reports to populate
3. Verify Measurement ID is correct
4. Check browser console for gtag errors
5. Disable ad blockers (they block GA)

### Build Errors

**Symptom**: Build fails with GA-related errors

**Solution**:

1. Ensure all imports are correct
2. Check `src/utils/googleAnalytics.js` exists
3. Run `npm install` to ensure dependencies are installed
4. Clear cache: `npm run build -- --reset-cache`

---

## 🔐 Privacy & Compliance

### GDPR Compliance

- ✅ GA loads with user consent (1-second delay)
- ✅ No personally identifiable information (PII) tracked
- ✅ IP anonymization enabled by default in GA4
- ✅ User can opt-out via browser settings

### Recommended Privacy Policy Updates

Add to your privacy policy:

```
We use Google Analytics to understand how visitors use our site.
Google Analytics collects information such as:
- Pages you visit
- Time spent on pages
- Browser type and version
- Device type (mobile/desktop)
- Geographic location (city level)

No personally identifiable information is collected.
You can opt-out using browser plugins or privacy settings.
```

---

## 📚 Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Tracking Guide](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 vs Universal Analytics](https://support.google.com/analytics/answer/11583528)
- [Debug Mode for GA4](https://support.google.com/analytics/answer/7201382)

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Environment variable is set correctly
- [ ] GA initializes successfully (check console)
- [ ] Realtime reports show your visits
- [ ] Custom events appear in DebugView
- [ ] Page views tracked on navigation
- [ ] Fuel searches tracked
- [ ] Station interactions tracked
- [ ] No console errors related to GA
- [ ] Production deployment works correctly
- [ ] Sitemap.xml has correct image reference

---

## 🎉 Success!

Your Google Analytics 4 is now properly configured with:

- ✅ Environment variable support
- ✅ Enhanced event tracking
- ✅ Custom dimensions for fuel data
- ✅ Proper session management
- ✅ Privacy-focused implementation

**Need help?** Check the troubleshooting section or review the code in:

- `src/utils/googleAnalytics.js`
- `src/utils/analytics.js`
- `src/index.js`
