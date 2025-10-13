# Data Source Integration Guide

This document provides comprehensive guidance for managing data sources in the Melbourne Petrol Stations application, including troubleshooting map loading issues and ensuring proper data flow.

## Overview

The application uses a centralized data source management system to prevent conflicts and ensure reliable data flow to the Mapbox integration. This system supports multiple data sources with automatic fallback mechanisms.

## Data Source Architecture

### Centralized Data Source Manager

The `DataSourceManager` service (`src/services/DataSourceManager.js`) provides:

- **Single Source of Truth**: Only one data source is active at a time
- **Automatic Validation**: All station data is validated before use
- **Caching**: Intelligent caching to reduce API calls
- **Fallback Mechanisms**: Automatic fallback to mock data if primary source fails
- **Error Handling**: Comprehensive error handling and logging

### Supported Data Sources

1. **Baserow** (Primary)
   - Table ID: 623329 (Petrol Stations)
   - API: `https://api.baserow.io/api`
   - Authentication: Bearer Token

2. **Airtable** (Planned)
   - Currently not implemented
   - Reserved for future integration

3. **Mock Data** (Fallback)
   - Used when primary sources fail
   - Provides sample Melbourne stations

## Data Structure Requirements

### Required Station Data Format

All station data must conform to this structure:

```javascript
{
  id: number | string,           // Unique identifier
  name: string,                  // Station name
  lat: number,                   // Latitude (-38.5 to -37.0 for Melbourne)
  lng: number,                   // Longitude (144.0 to 146.0 for Melbourne)
  prices: {                      // Fuel prices in cents
    unleaded: number,
    premium: number,
    premium98: number,
    diesel: number,
    gas: number
  },
  address: string,               // Full address
  city: string,                  // City name
  category: string,              // Station category
  fuelPrices: array,             // Linked fuel price records
  source: string,                // Data source identifier
  lastUpdated: string            // ISO timestamp
}
```

### Baserow Field Mapping

The system maps Baserow fields to the standard format:

| Baserow Field | Field ID | Mapped To |
|---------------|----------|-----------|
| Station Name | field_5072130 | name |
| Address | field_5072131 | address |
| City | field_5072132 | city |
| Postal Code | field_5072133 | postalCode |
| Region | field_5072134 | region |
| Country | field_5072135 | country |
| Latitude | field_5072136 | lat |
| Longitude | field_5072137 | lng |
| Category | field_5072138 | category |
| Fuel Prices | field_5072139 | fuelPrices |
| Location Details | field_5072140 | locationDetails |

## Mapbox Integration

### Initialization Requirements

1. **Valid Mapbox Token**: Set `REACT_APP_MAPBOX_ACCESS_TOKEN` environment variable
2. **Valid Station Data**: At least one station with valid coordinates
3. **Data Validation**: All coordinates must be within Melbourne area bounds

### Data Validation Process

1. **Coordinate Validation**:
   - Latitude: -38.5 to -37.0
   - Longitude: 144.0 to 146.0
   - Must be valid numbers

2. **Required Fields**:
   - Station name
   - Valid coordinates
   - Address information

3. **Data Quality Checks**:
   - Minimum 10 stations recommended
   - Coordinates within Melbourne metropolitan area
   - Valid price data structure

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Map Not Loading

**Symptoms**: Blank map area, loading spinner continues indefinitely

**Causes & Solutions**:
- **Missing Mapbox Token**: Set `REACT_APP_MAPBOX_ACCESS_TOKEN` in `.env` file
- **Invalid Coordinates**: Check data validation logs in console
- **No Valid Stations**: Ensure at least one station passes validation
- **API Connection Issues**: Check network connectivity and API endpoints

**Debug Steps**:
1. Open browser developer tools
2. Check console for error messages
3. Use debug panel (click "Show Debug" button)
4. Test data source connection
5. Verify Mapbox token validity

#### 2. Empty Map with Valid Token

**Symptoms**: Map loads but shows no markers

**Causes & Solutions**:
- **Data Validation Failures**: Check console for validation warnings
- **Coordinate Range Issues**: Ensure coordinates are within Melbourne bounds
- **Empty Data Source**: Verify data source has valid records
- **Caching Issues**: Clear cache and refresh data

**Debug Steps**:
1. Check data source status in debug panel
2. Verify station count in console logs
3. Test data source connection
4. Force refresh data

#### 3. Inconsistent Data Display

**Symptoms**: Different data shown on different page loads

**Causes & Solutions**:
- **Multiple Data Sources**: Ensure only one source is active
- **Caching Issues**: Clear cache and refresh
- **Race Conditions**: Data source manager prevents this automatically

**Debug Steps**:
1. Check active data source in debug panel
2. Verify cache status
3. Test data source switching
4. Check for duplicate API calls

### Debug Tools

#### Debug Panel

The debug panel provides real-time information about:

- Active data source
- Loading status
- Cache validity
- Last fetch time
- Connection test results

**Access**: Click "Show Debug" button on map page

#### Console Logging

The system provides detailed console logging:

- `🚀` - Data fetching operations
- `📊` - Data statistics and counts
- `✅` - Successful operations
- `❌` - Errors and failures
- `⚠️` - Warnings and validation issues
- `🔍` - Debug information

#### Network Monitoring

Check browser Network tab for:

- Failed API requests
- Slow response times
- Authentication errors
- CORS issues

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Mapbox Configuration
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Baserow Configuration
REACT_APP_BASEROW_TOKEN=your_baserow_token_here
REACT_APP_BASEROW_API_URL=https://api.baserow.io/api

# API Configuration
REACT_APP_API_URL=http://localhost:3001
```

### Data Source Configuration

To switch data sources programmatically:

```javascript
import dataSourceManager from './services/DataSourceManager';

// Switch to Baserow
dataSourceManager.setActiveSource('baserow');

// Switch to mock data
dataSourceManager.setActiveSource('mock');

// Force refresh data
await dataSourceManager.fetchStations(true);
```

## Best Practices

### Data Quality

1. **Validate Coordinates**: Ensure all coordinates are within Melbourne area
2. **Consistent Naming**: Use consistent field names across data sources
3. **Error Handling**: Implement proper error handling for all API calls
4. **Fallback Data**: Always provide fallback data for critical features

### Performance

1. **Caching**: Use data source manager caching to reduce API calls
2. **Lazy Loading**: Load map components only when needed
3. **Error Boundaries**: Use React error boundaries to prevent crashes
4. **Loading States**: Show appropriate loading states during data fetching

### Monitoring

1. **Console Logging**: Monitor console for errors and warnings
2. **Debug Panel**: Use debug panel for real-time status monitoring
3. **Network Monitoring**: Check network requests for issues
4. **User Feedback**: Provide clear error messages to users

## Testing

### Manual Testing

1. **Data Source Switching**: Test switching between different sources
2. **Error Scenarios**: Test with invalid tokens, network failures
3. **Data Validation**: Test with invalid coordinate data
4. **Cache Behavior**: Test cache validity and refresh behavior

### Automated Testing

```javascript
// Test data source manager
import dataSourceManager from './services/DataSourceManager';

describe('DataSourceManager', () => {
  test('should fetch stations from active source', async () => {
    const stations = await dataSourceManager.fetchStations();
    expect(Array.isArray(stations)).toBe(true);
    expect(stations.length).toBeGreaterThan(0);
  });

  test('should validate station data', () => {
    const validStation = {
      lat: -37.8136,
      lng: 144.9631,
      name: 'Test Station'
    };
    const result = dataSourceManager.validateStationData(validStation, 0);
    expect(result.valid).toBe(true);
  });
});
```

## Maintenance

### Regular Tasks

1. **Monitor API Limits**: Check Baserow API usage and limits
2. **Update Tokens**: Rotate API tokens regularly
3. **Data Quality**: Review data quality and validation rules
4. **Performance**: Monitor loading times and optimize as needed

### Updates

1. **Data Source Changes**: Update field mappings when Baserow schema changes
2. **New Sources**: Add new data sources through the centralized manager
3. **Validation Rules**: Update validation rules as requirements change
4. **Error Handling**: Improve error handling based on real-world issues

## Support

For issues related to data source integration:

1. Check this documentation first
2. Use the debug panel to identify issues
3. Check browser console for detailed error messages
4. Test with different data sources to isolate issues
5. Verify environment variables and configuration

## Changelog

### Version 1.0.0
- Initial centralized data source manager
- Baserow integration with field mapping
- Mapbox integration with data validation
- Debug panel for troubleshooting
- Comprehensive error handling and fallback mechanisms
