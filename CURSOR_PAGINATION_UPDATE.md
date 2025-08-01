# Baserow API Cursor-Based Pagination Update

## Overview

This document explains the cursor-based pagination implementation for fetching data from Baserow API. The main changes ensure we use the `next` URL directly instead of manually building URLs with offset parameters.

## Key Changes Made

### 1. Backend - `baserowClient.js`

Updated the `getAllPetrolStations` method to:
- Use the correct API endpoint: `/database/rows/table/{table_id}/`
- Directly use the `next` URL from the response for subsequent requests
- Handle both relative and full URLs properly

```javascript
// Initial request
let nextUrl = `/database/rows/table/${this.config.tables.petrolStations.id}/?user_field_names=true&size=50`;

// Use the next URL directly
while (nextUrl) {
  const response = await fetch(nextUrl, ...);
  const data = response.data;
  
  // Process results
  allStations = allStations.concat(data.results);
  
  // Use the next URL directly - DON'T extract offset!
  nextUrl = data.next;
}
```

### 2. Frontend - `src/config.js`

Updated the `fetchAllStationsDirect` method to:
- Use the correct API endpoint format
- Implement proper cursor-based pagination
- Remove manual URL building with offset parameters

## Correct API Usage

### ✅ CORRECT Approach:

```javascript
let nextUrl = "https://api.baserow.io/api/database/rows/table/623329/?user_field_names=true&size=50";

while (nextUrl) {
  const response = await fetch(nextUrl, {
    headers: {
      "Authorization": `Token ${token}`
    }
  });
  const data = await response.json();
  
  // Process data.results
  processRows(data.results);
  
  // Use the next URL directly
  nextUrl = data.next; // This is the key!
}
```

### ❌ INCORRECT Approach (Old):

```javascript
// DON'T DO THIS - extracting offset and building URLs manually
if (data.next) {
  const nextUrl = new URL(data.next);
  const offset = nextUrl.searchParams.get('offset');
  // Building URL manually with offset - WRONG!
}
```

## Key Points

1. **Always use the correct endpoint**: `/api/database/rows/table/{table_id}/`
2. **Use the pagination "next" link directly**: The returned JSON has a "next" value that contains the complete URL for the next batch
3. **Process each results array**: These contain your actual data entries
4. **Don't build URLs manually**: Always use the "next" URL returned by Baserow

## Benefits

- **Simpler code**: No need to parse URLs or manage offset parameters
- **More reliable**: Follows Baserow's intended pagination pattern
- **Future-proof**: If Baserow changes their pagination implementation, your code will still work

## Testing

To test the implementation:

1. **Backend Test**:
   ```bash
   cd backend
   node test-baserow-direct.js
   ```

2. **API Endpoint Test**:
   ```bash
   curl http://localhost:3001/api/stations/all
   ```

3. **Frontend Test**:
   - Open the application in your browser
   - Navigate to the Map page
   - Check the console for pagination logs

## Example Response Structure

```json
{
  "count": 650,
  "next": "https://api.baserow.io/api/database/rows/table/623329/?user_field_names=true&size=50&offset=50",
  "previous": null,
  "results": [
    {
      "id": 1,
      "Station Name": "Shell Melbourne",
      "Latitude": -37.8136,
      "Longitude": 144.9631,
      // ... other fields
    }
    // ... 49 more results
  ]
}
```

## Migration Notes

If you have other parts of your application that fetch from Baserow:
1. Update the API endpoint format
2. Replace offset-based pagination with cursor-based (using `next` directly)
3. Test thoroughly with large datasets to ensure all pages are fetched