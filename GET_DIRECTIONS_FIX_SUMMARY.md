# Get Directions Link Fix - Summary

## Issue
The "Get Directions" buttons throughout the application were using Google Maps **Search** API instead of the **Directions** API. This meant when customers clicked "Get Directions", it would search for the location rather than opening turn-by-turn directions.

## Solution
Updated all "Get Directions" links to use the proper Google Maps Directions API format:

### Before (Search API - ❌ Incorrect)
```javascript
https://www.google.com/maps/search/${encodeURIComponent(address + ' ' + suburb)}
```

### After (Directions API - ✅ Correct)
```javascript
// For stations with latitude/longitude coordinates:
https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}

// For stations with only address:
https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address + ', ' + suburb)}
```

## Files Modified

1. **src/components/molecules/StationCard/ModernStationCard.tsx**
   - Updated directions link from search to directions API
   - Uses address-based directions
   - Cleaned up unused imports (`Image`, unused `id` parameter)

2. **src/components/modals/Modal.tsx**
   - Fixed StationDetailsModal directions button
   - Now properly opens Google Maps directions
   - Removed unused imports (`motion`, `AnimatePresence`)
   - Removed unused `closeOnEscape` parameter

3. **src/app/directory/[suburb]/page.tsx**
   - Updated station card directions links
   - Prefers lat/long coordinates when available, falls back to address

4. **src/app/directory/StationDirectoryClient.tsx**
   - Fixed directions button in station cards
   - Uses address-based directions
   - Cleaned up AdvancedSearchBar component (removed unused parameters)
   - Removed unused `Link` import

5. **src/app/directory/StationDirectoryWithMap.tsx**
   - Updated directions link in station cards
   - Uses lat/long coordinates for accuracy

6. **src/components/molecules/MapView/MapView.tsx**
   - Fixed popup directions button
   - Uses lat/long coordinates
   - Cleaned up unused imports (`Image`, `useEffect`, `Source`, `Layer`)
   - Removed unused variables and parameters

7. **src/components/map/StationPopup.tsx**
   - Updated from search API to directions API
   - Uses lat/long coordinates for precise navigation

8. **src/components/map/MapLibreMapCore.tsx**
   - Fixed inline popup HTML directions link
   - Uses lat/long coordinates

## Benefits

✅ **Better User Experience**: Clicking "Get Directions" now opens turn-by-turn navigation instead of a search
✅ **More Accurate**: Using latitude/longitude coordinates ensures exact location targeting
✅ **Consistent**: All "Get Directions" buttons across the entire app now work the same way
✅ **Mobile-Friendly**: Automatically opens in Google Maps app on mobile devices
✅ **Cleaner Code**: Removed unused imports and variables, fixed all linting errors

## Testing Recommendations

1. Test "Get Directions" button on various station cards
2. Verify it opens Google Maps with directions (not search)
3. Test on both desktop and mobile devices
4. Confirm it works for stations with and without coordinates
5. Check map popups and modals

## Google Maps Directions API Reference

The Directions API format used:
- `api=1` - Required parameter for URL format
- `destination` - Can be either:
  - Coordinates: `lat,lng` (e.g., `-37.8136,144.9631`)
  - Address: URL-encoded address string (e.g., `123%20Main%20St%2C%20Melbourne`)

Documentation: https://developers.google.com/maps/documentation/urls/get-started#directions-action

