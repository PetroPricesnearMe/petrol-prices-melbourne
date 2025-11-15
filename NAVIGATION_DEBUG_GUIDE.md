# 🔍 Navigation & Loading Debug Guide

## Issues Fixed

### ✅ 1. Region Links Not Clickable

**Problem:** Framer Motion's `whileHover` on parent div was intercepting clicks  
**Solution:** Moved hover effects to the Link component itself

### ✅ 2. Spinner Gets Stuck Forever

**Problem:** No timeout or error handling when data fetch fails  
**Solution:** Added 10-second timeout with user-friendly error UI

---

## How to Debug in Your Browser

Since I can't access your browser directly, here's how to debug yourself:

### Step 1: Open DevTools Console

1. **Open your site:** `http://localhost:3000`
2. **Press F12** (or Cmd+Option+I on Mac)
3. **Go to Console tab**

### Step 2: Click a Region Link

Watch for these console messages:

```
✅ Good Flow:
🔗 Region link clicked: northern
📍 Navigation URL: /directory?region=northern
🗺️ DirectoryPageNew mounted
📋 Region param from URL: northern
🎯 Selected region: Northern Suburbs
⏳ Starting to load stations...
✅ Data loaded successfully: 250 stations
📊 Stations set in state: 250
✅ Loading complete, loading state set to false
```

```
❌ Bad Flow (Stuck Spinner):
🔗 Region link clicked: northern
📍 Navigation URL: /directory?region=northern
🗺️ DirectoryPageNew mounted
⏳ Starting to load stations...
⏱️ LoadingSpinner mounted, starting timeout timer
(NO further messages - data fetch is stuck!)
⏰ LoadingSpinner TIMEOUT reached after 10000 ms
```

### Step 3: Check Network Tab

1. **Go to Network tab** in DevTools
2. **Click a region link**
3. **Look for these requests:**
   - `/data/stations.geojson` - Should load or fail fast
   - Baserow API calls (if geojson fails)

**Red flags:**

- ⚠️ Request pending for > 10 seconds
- ⚠️ Request shows "(cancelled)"
- ⚠️ CORS errors
- ⚠️ 404 Not Found on `/data/stations.geojson`

### Step 4: Test Different Scenarios

```bash
# Scenario A: Normal Click
1. Click "Northern Suburbs" card
2. Should navigate to /directory?region=northern
3. Should load within 10 seconds

# Scenario B: Right-Click → Open in New Tab
1. Right-click "Northern Suburbs"
2. Select "Open link in new tab"
3. New tab should load (may be slower, but timeout will catch it)

# Scenario C: Middle-Click
1. Middle-click (scroll wheel) on card
2. Should open in new tab
3. Check console in new tab for errors
```

---

## Console Log Reference

### Navigation Logs

| Log                           | Meaning                    | Status  |
| ----------------------------- | -------------------------- | ------- |
| `🔗 Region link clicked`      | User clicked a region      | ✅ Good |
| `📍 Navigation URL`           | React Router is navigating | ✅ Good |
| `🗺️ DirectoryPageNew mounted` | Component loaded           | ✅ Good |
| `📋 Region param from URL`    | URL parsed successfully    | ✅ Good |

### Data Loading Logs

| Log                                      | Meaning            | Status     |
| ---------------------------------------- | ------------------ | ---------- |
| `⏳ Starting to load stations`           | Fetch initiated    | ✅ Good    |
| `🗺️ Loading stations from local GeoJSON` | Trying local data  | ✅ Good    |
| `✅ Loaded X stations from GeoJSON`      | Success!           | ✅ Good    |
| `⚠️ Local data failed, trying Baserow`   | Fallback triggered | ⚠️ Warning |
| `❌ Error loading stations`              | Complete failure   | ❌ Bad     |
| `⏰ LoadingSpinner TIMEOUT`              | Taking too long    | ❌ Bad     |

### Spinner Logs

| Log                                     | Meaning             | Status  |
| --------------------------------------- | ------------------- | ------- |
| `⏱️ LoadingSpinner mounted`             | Spinner started     | ✅ Good |
| `✅ LoadingSpinner unmounted after Xms` | Loaded successfully | ✅ Good |
| `⏰ LoadingSpinner TIMEOUT reached`     | 10s timeout hit     | ❌ Bad  |

---

## Common Problems & Solutions

### Problem 1: Clicks Don't Navigate

**Symptoms:**

- No console logs when clicking
- Link doesn't change browser URL
- Nothing happens

**Debug:**

```javascript
// In browser console:
document.querySelectorAll('a[href*="directory"]').forEach((link, i) => {
  console.log(`Link ${i}:`, link.href, 'Clickable:', !link.style.pointerEvents);
});
```

**Solution:**

- Check for CSS `pointer-events: none`
- Check for overlapping elements with higher z-index
- Verify Link component renders actual `<a>` tag

### Problem 2: Navigation Works But Spinner Never Stops

**Symptoms:**

- URL changes to `/directory?region=northern`
- Console shows "Starting to load stations"
- No further console logs
- Spinner runs forever (or until 10s timeout)

**Debug:**

```javascript
// Check if data files exist
fetch('/data/stations.geojson')
  .then((r) => console.log('GeoJSON status:', r.status))
  .catch((e) => console.error('GeoJSON error:', e));
```

**Possible Causes:**

1. `/data/stations.geojson` file missing
2. Network request blocked by CORS
3. Promise never resolves/rejects
4. React state not updating

**Solution:**

- Check `public/data/stations.geojson` exists
- Verify file is valid JSON
- Check browser's Network tab for failed requests

### Problem 3: Spinner Shows Error After 10 Seconds

**Symptoms:**

- Spinner appears
- After 10 seconds, shows error message
- "Loading is taking longer than expected"

**This is WORKING AS INTENDED!**

The timeout caught a hung request. Now debug why:

**Debug:**

```javascript
// In browser console, check what's failing:
console.log('Checking data sources...');

// Test local data
fetch('/data/stations.geojson')
  .then((r) => r.json())
  .then((d) =>
    console.log('✅ Local data works:', d.features?.length, 'stations')
  )
  .catch((e) => console.error('❌ Local data failed:', e));

// Test Baserow (if local fails)
fetch(
  'https://api.baserow.io/api/database/rows/table/623329/?user_field_names=true&size=10&public_token=YOUR_TOKEN'
)
  .then((r) => r.json())
  .then((d) => console.log('✅ Baserow works:', d.results?.length, 'stations'))
  .catch((e) => console.error('❌ Baserow failed:', e));
```

---

## Advanced Debugging

### Check React Router State

```javascript
// In browser console after clicking a link:
console.log('Current pathname:', window.location.pathname);
console.log('Current search:', window.location.search);
console.log('Full URL:', window.location.href);
```

### Monitor Component Lifecycle

The code now logs automatically, but you can add custom logging:

```javascript
// In DirectoryPageNew.js useEffect, add:
useEffect(() => {
  console.log('🔍 DEBUG: stations state changed:', {
    count: stations.length,
    first: stations[0],
    loading: loading,
  });
}, [stations, loading]);
```

### Check Event Listeners

```javascript
// In browser console:
const link = document.querySelector('a[href*="directory"]');
console.log('Event listeners:', getEventListeners(link));
```

### Monitor Network Requests

```javascript
// In browser console before clicking:
const originalFetch = window.fetch;
window.fetch = function (...args) {
  console.log('🌐 FETCH:', args[0]);
  return originalFetch
    .apply(this, args)
    .then((r) => {
      console.log('✅ FETCH SUCCESS:', args[0], r.status);
      return r;
    })
    .catch((e) => {
      console.error('❌ FETCH ERROR:', args[0], e);
      throw e;
    });
};
// Now click the link and watch all fetch calls
```

---

## Quick Test Checklist

Run through this checklist in your browser:

- [ ] **Console is open** (F12 → Console tab)
- [ ] **No existing errors** in console before clicking
- [ ] **Click region card** → See "Region link clicked" log
- [ ] **URL changes** to `/directory?region=...`
- [ ] **"DirectoryPageNew mounted"** appears in console
- [ ] **"Starting to load stations"** appears
- [ ] **Either:**
  - [ ] "Data loaded successfully" within 10s, OR
  - [ ] "LoadingSpinner TIMEOUT" after 10s
- [ ] **Spinner disappears** and content shows, OR
- [ ] **Error UI appears** with retry buttons

---

## Still Stuck?

### Share These Details:

1. **Full console log** (copy entire console output)
2. **Network tab screenshot** showing failed requests
3. **Browser and version** (Chrome 120, Firefox 115, etc.)
4. **Does it work on:**
   - [ ] Normal left-click
   - [ ] Right-click → Open in new tab
   - [ ] Direct URL entry: `http://localhost:3000/directory?region=northern`

### Common Environment Issues:

```bash
# Check if dev server is running:
netstat -ano | findstr :3000

# Check if data files exist:
dir public\data\stations.geojson

# Restart dev server with clean cache:
npm run build
npm start
```

---

## Success Criteria

✅ **Working correctly when:**

1. Click triggers navigation within 100ms
2. Console shows all expected logs in order
3. Data loads within 10 seconds
4. Spinner disappears when done
5. Station list appears
6. No red errors in console

❌ **Still broken if:**

1. Click does nothing
2. Console silent after click
3. Spinner never disappears
4. Console shows red errors
5. Network requests fail/pending forever

---

## Next Steps

1. **Test now:** Open browser, follow Step 1-4 above
2. **Copy console logs:** Share them with me
3. **Check Network tab:** Screenshot any red/failed requests
4. **Report results:** Tell me which scenario matches your issue

The enhanced logging will tell us exactly where the flow breaks! 🔍
