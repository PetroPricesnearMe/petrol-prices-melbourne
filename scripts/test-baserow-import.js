/**
 * Test Baserow Import Script
 * This script tests importing a few sample records to Baserow via MCP
 */

const fs = require('fs');
const path = require('path');

// Read the mapped data
const dataPath = path.join(__dirname, '../database/baserow-import-data.json');
const allData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Take first 5 records as a test
const testData = allData.slice(0, 5);

console.log('📋 Test Data for Baserow Import:');
console.log('================================');

testData.forEach((record, index) => {
  console.log(`\n${index + 1}. ${record['Station Name']}`);
  console.log(`   Address: ${record.Address}`);
  console.log(`   City: ${record.City}`);
  console.log(`   Coordinates: ${record.Latitude}, ${record.Longitude}`);
  console.log(`   Brand: ${record.brand.join(', ')}`);
});

console.log('\n\nTo import these records to Baserow:');
console.log('1. Use the Baserow MCP tools from Cursor');
console.log('2. Call mcp_Baserow_MCP_create_row_table_623329 for each record');
console.log('3. Or use the Baserow UI to bulk import the JSON file');

// Create a CSV format for Baserow UI import
const csvHeader = 'Station Name,Address,City,Postal Code,Region,Country,Latitude,Longitude,Location Details,Category';
const csvRows = allData.map(row => {
  // Round coordinates to 4 decimal places
  const lat = row.Latitude ? parseFloat(row.Latitude.toFixed(4)) : '';
  const lng = row.Longitude ? parseFloat(row.Longitude.toFixed(4)) : '';

  return [
    `"${row['Station Name']}"`,
    `"${row.Address}"`,
    `"${row.City}"`,
    `"${row['Postal Code']}"`,
    `"${row.Region}"`,
    `"${row.Country}"`,
    lat,
    lng,
    `"${row['Location Details']}"`,
    row.Category
  ].join(',');
});

const csvContent = [csvHeader, ...csvRows].join('\n');
const csvPath = path.join(__dirname, '../database/baserow-import.csv');
fs.writeFileSync(csvPath, csvContent);

console.log(`\n✅ CSV file created for bulk import: ${csvPath}`);
console.log(`   Total records: ${allData.length}`);
console.log('\nTo bulk import:');
console.log('1. Open your Baserow table in the browser');
console.log('2. Click the table dropdown menu');
console.log('3. Select "Import from file"');
console.log('4. Upload the baserow-import.csv file');
console.log('5. Map the columns to match your table fields');

