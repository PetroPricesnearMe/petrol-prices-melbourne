/**
 * Single Row Import Test
 * This file contains the exact MCP command to import one test record
 */

// Test record to import:
const testRecord = {
  'Station Name': 'INDEPENDENT KALKALLO',
  Address: '1330 HUME FREEWAY',
  City: 'KALKALLO',
  'Postal Code': '3064',
  Region: 'VIC',
  Country: 'AUSTRALIA',
  Latitude: -37.5264,
  Longitude: 144.9483,
  'Location Details':
    'AN ESTABLISHMENT WHERE A RANGE OF FUEL PRODUCTS CAN BE PURCHASED BY MOTORISTS',
  Category: 3812407,
};

console.log('Test Record for Baserow Import:');
console.log(JSON.stringify(testRecord, null, 2));
console.log('\nUse this with mcp_Baserow_MCP_create_row_table_623329');
console.log(
  '\nNote: Decimal format for Latitude/Longitude must be exactly 4 decimal places'
);
console.log('Baserow validation requires: max_decimal_places = 4');
