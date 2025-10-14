# Baserow Data Import Guide

This guide explains how to import the petrol station data from CSV into Baserow.

## Overview

- **Source Data**: `database/Petrol_Stations.csv` (6,651 total stations)
- **Filtered Data**: 1,141 VIC (Victoria) stations
- **Baserow Table**: Petrol Stations (ID: 623329)

## Data Structure Mapping

### CSV Fields → Baserow Fields

| CSV Column | Baserow Field | Type | Notes |
|------------|---------------|------|-------|
| X | Longitude | Decimal | Max 4 decimal places |
| Y | Latitude | Decimal | Max 4 decimal places |
| station_name | Station Name | Text | Required |
| station_address | Address | Text | |
| station_suburb | City | Text | |
| station_postcode | Postal Code | Text | |
| station_state | Region | Text | VIC, NSW, etc. |
| station_owner | brand | Multiple Select | |
| station_description | Location Details | Long Text | |
| feature_type | Category | Single Select | Option ID: 3812407 |

### Baserow Field Validation Rules

**Important**: The Baserow table has specific validation rules:

1. **Latitude**: Decimal field with max 4 decimal places
2. **Longitude**: Decimal field with max 4 decimal places
3. **Category**: Single select with predefined options:
   - `3812405` = "petrol-stations"
   - `3812406` = "feature_type"
   - `3812407` = "PETROL STATION"

## Import Methods

### Method 1: Bulk Import via Baserow UI (Recommended)

This is the fastest method for importing all 1,141 records.

1. **Navigate to Baserow**
   - Go to your Baserow workspace
   - Open the "Petrol Stations" table (ID: 623329)

2. **Use the Import Feature**
   - Click the table dropdown menu (top left)
   - Select "Import from file"
   - Upload `database/baserow-import.csv`

3. **Map Columns**
   - The import wizard will show column mapping
   - Ensure each CSV column maps to the correct Baserow field:
     - Station Name → Station Name
     - Address → Address
     - City → City
     - Postal Code → Postal Code
     - Region → Region
     - Country → Country
     - Latitude → Latitude
     - Longitude → Longitude
     - Location Details → Location Details
     - Category → Category

4. **Import Options**
   - Choose "Add new rows" (don't replace existing data)
   - Click "Import"
   - Wait for the import to complete (may take a few minutes)

5. **Verify Import**
   - Check that all 1,141 rows were imported
   - Spot check a few records for accuracy
   - Verify coordinates display correctly on the map

### Method 2: MCP Tools (For Single Records or Testing)

Use this method for testing or importing individual records.

1. **Read Test Data**
   ```bash
   node scripts/single-row-import-test.js
   ```

2. **Import Single Record**
   - Use Cursor's MCP integration
   - Call the function with properly formatted data

Example record format:
```json
{
  "Station Name": "INDEPENDENT KALKALLO",
  "Address": "1330 HUME FREEWAY",
  "City": "KALKALLO",
  "Postal Code": "3064",
  "Region": "VIC",
  "Country": "AUSTRALIA",
  "Latitude": -37.5264,
  "Longitude": 144.9483,
  "Location Details": "AN ESTABLISHMENT WHERE A RANGE OF FUEL PRODUCTS CAN BE PURCHASED BY MOTORISTS",
  "Category": 3812407
}
```

### Method 3: Baserow API (For Automation)

For automated imports or integrations, use the Baserow API directly.

1. **Authentication**
   - Use the token from `src/config.js`
   - Token: `G2bhijqxqtg0O05dc176fwDpaUPDSIgj`

2. **API Endpoint**
   ```
   POST https://api.baserow.io/api/database/rows/table/623329/
   ```

3. **Headers**
   ```
   Authorization: Token G2bhijqxqtg0O05dc176fwDpaUPDSIgj
   Content-Type: application/json
   ```

4. **Body Format**
   - Use the JSON format shown in Method 2
   - Ensure coordinates have exactly 4 decimal places

## Files Generated

The import scripts generate the following files:

1. **`database/baserow-import-data.json`**
   - Complete mapped data in JSON format
   - 1,141 VIC station records
   - Ready for programmatic import

2. **`database/baserow-import.csv`**
   - CSV format for Baserow UI bulk import
   - Properly formatted coordinates (4 decimal places)
   - Includes all required fields

3. **`scripts/import-csv-to-baserow.js`**
   - Main import script
   - Parses CSV and maps fields
   - Filters for VIC stations only
   - Applies coordinate rounding

4. **`scripts/test-baserow-import.js`**
   - Generates CSV for bulk import
   - Shows sample records for testing
   - Creates import-ready CSV file

## Troubleshooting

### Common Issues

#### 1. Coordinate Validation Error
**Error**: "Ensure that there are no more than 4 decimal places"

**Solution**: The import scripts now automatically round coordinates to 4 decimal places. If you're manually importing, use:
```javascript
const lat = parseFloat(latitude.toFixed(4));
const lng = parseFloat(longitude.toFixed(4));
```

#### 2. Missing Required Fields
**Error**: "Field is required"

**Solution**: Ensure these fields are always provided:
- Station Name (required)
- Latitude (required)
- Longitude (required)

#### 3. Invalid Category ID
**Error**: "Invalid option selected"

**Solution**: Use one of the valid category option IDs:
- `3812407` for "PETROL STATION"
- `3812405` for "petrol-stations"

#### 4. Brand Field Format
**Error**: "Invalid format for brand field"

**Solution**: The brand field is a multiple select, not text. In the CSV, it should be a simple text value that Baserow will map to the correct option.

## DataSourceManager Integration

The `DataSourceManager` has been updated to handle all field name variations:

- CSV field names (X, Y, station_name, etc.)
- Baserow field names (Latitude, Longitude, Station Name, etc.)
- Legacy field IDs (field_5072136, etc.)

No code changes needed after import - the app will automatically recognize the Baserow data format.

## Next Steps

After importing the data:

1. **Verify Data Quality**
   - Check for missing coordinates
   - Validate address information
   - Ensure brands are mapped correctly

2. **Add Fuel Prices**
   - Import fuel price data to the Fuel Prices table (ID: 623330)
   - Link prices to stations using the relationship field

3. **Test the Application**
   - Run the app and verify stations display on the map
   - Test filtering by brand, region, etc.
   - Check that station details show correctly

4. **Set Up Data Source**
   - The app will automatically use Baserow as the data source
   - Local CSV files will be used as fallback
   - Mock data is available if both fail

## Support

For issues or questions:
- Check the DataSourceManager logs in browser console
- Review validation errors in the import results
- Verify field mappings in Baserow table settings

