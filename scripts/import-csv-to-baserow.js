/**
 * CSV to Baserow Import Script
 * This script reads the Petrol_Stations.csv file and imports it into Baserow
 */

const fs = require('fs');
const path = require('path');

// Read CSV file
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;

    const values = parseCSVLine(lines[i]);
    const row = {};

    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : '';
    });

    data.push(row);
  }

  return data;
}

// Parse CSV line handling quoted values
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

// Map CSV data to Baserow format
function mapToBaserowFormat(csvRow) {
  // Round coordinates to 4 decimal places to match Baserow validation
  const lat = csvRow.Y ? parseFloat(parseFloat(csvRow.Y).toFixed(4)) : null;
  const lng = csvRow.X ? parseFloat(parseFloat(csvRow.X).toFixed(4)) : null;

  return {
    'Station Name': csvRow.station_name || '',
    Address: csvRow.station_address || '',
    City: csvRow.station_suburb || '',
    'Postal Code': csvRow.station_postcode || '',
    Region: csvRow.station_state || '',
    Country: 'AUSTRALIA',
    Latitude: lat,
    Longitude: lng,
    'Location Details': csvRow.station_description || '',
    Category: getCategoryId(csvRow.feature_type),
    brand: csvRow.station_owner ? [csvRow.station_owner] : [],
  };
}

// Get category ID based on feature type
function getCategoryId(featureType) {
  const categoryMap = {
    'PETROL STATION': 3812407,
  };
  return categoryMap[featureType] || 3812405;
}

// Main import function
async function importData() {
  console.log('🚀 Starting CSV to Baserow import...');

  const csvPath = path.join(__dirname, '../database/Petrol_Stations.csv');
  const data = parseCSV(csvPath);

  console.log(`📊 Parsed ${data.length} rows from CSV`);

  // Filter for Victoria (VIC) stations only for initial import
  const vicStations = data.filter((row) => row.station_state === 'VIC');
  console.log(`📍 Found ${vicStations.length} VIC stations`);

  // Create output file with mapped data
  const outputPath = path.join(
    __dirname,
    '../database/baserow-import-data.json'
  );
  const mappedData = vicStations.map((row) => mapToBaserowFormat(row));

  fs.writeFileSync(outputPath, JSON.stringify(mappedData, null, 2));
  console.log(`✅ Mapped data saved to ${outputPath}`);
  console.log(`📝 Total records to import: ${mappedData.length}`);

  // Show sample of first record
  console.log('\n📋 Sample record:');
  console.log(JSON.stringify(mappedData[0], null, 2));
}

// Run import
importData().catch(console.error);
