#!/usr/bin/env node

/**
 * CSV to JSON Converter for Petrol Stations Data
 * Converts stations.csv to optimized JSON format
 * Run: node scripts/convert-stations.js
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../public/data/stations.csv');
const JSON_PATH = path.join(__dirname, '../src/data/stations.json');
const METADATA_PATH = path.join(__dirname, '../src/data/stations-metadata.json');

// Brand logo mapping
const BRAND_LOGOS = {
  'BP': '/images/brands/bp.png',
  'Shell': '/images/brands/shell.png',
  'Caltex': '/images/brands/caltex.png',
  '7-Eleven': '/images/brands/7eleven.png',
  'Coles Express': '/images/brands/coles.png',
  'Ampol': '/images/brands/ampol.png',
  'United': '/images/brands/united.png',
  'Mobil': '/images/brands/mobil.png',
};

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === '|' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function cleanBrandName(brand) {
  if (!brand) return 'Independent';
  
  // Extract brand from image URL or text
  if (brand.includes('BP')) return 'BP';
  if (brand.includes('Shell') || brand.includes('shell')) return 'Shell';
  if (brand.includes('CALTEX') || brand.includes('Caltex')) return 'Caltex';
  if (brand.includes('7')) return '7-Eleven';
  if (brand.includes('Coles') || brand.includes('COLES')) return 'Coles Express';
  if (brand.includes('Ampol') || brand.includes('AMPOL')) return 'Ampol';
  if (brand.includes('United') || brand.includes('UNITED')) return 'United';
  if (brand.includes('Mobil') || brand.includes('MOBIL')) return 'Mobil';
  
  return 'Independent';
}

function convertCSVToJSON() {
  console.log('🔄 Converting stations.csv to JSON...\n');

  // Read CSV file
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // Parse header
  const headers = parseCSVLine(lines[0]);
  console.log(`📋 Headers: ${headers.join(', ')}\n`);
  
  const stations = [];
  const suburbs = new Set();
  const brands = new Set();
  const regions = new Set();
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length < headers.length) continue;
    
    const id = parseInt(values[0]) || i;
    const stationName = values[1] || 'Unknown Station';
    const address = values[2] || '';
    const city = values[3] || '';
    const postalCode = values[4] || '';
    const region = values[5] || 'VIC';
    const category = values[6] || 'PETROL STATION';
    const rawBrand = values[9] || '';
    const brand = cleanBrandName(rawBrand);
    
    // Skip invalid entries
    if (!stationName || stationName === 'Station Name') continue;
    
    const station = {
      id,
      name: stationName,
      brand,
      brandLogo: BRAND_LOGOS[brand] || null,
      address: address || city,
      suburb: city || 'Unknown',
      postcode: postalCode,
      region: region === 'VIC' ? 'Victoria' : region,
      category,
      latitude: null,
      longitude: null,
      fuelPrices: {
        unleaded: null,
        diesel: null,
        premium95: null,
        premium98: null,
        lpg: null,
      },
      amenities: {
        carWash: false,
        cafe: false,
        atm: false,
        airPump: false,
        toilets: true,
        disabled: false,
        open24Hours: false,
      },
      lastUpdated: new Date().toISOString(),
      verified: false,
    };
    
    // Generate sample prices (in production, these would come from API)
    if (brand !== 'Independent') {
      station.fuelPrices.unleaded = parseFloat((185 + Math.random() * 25).toFixed(1));
      station.fuelPrices.diesel = parseFloat((190 + Math.random() * 20).toFixed(1));
      station.fuelPrices.premium95 = parseFloat((195 + Math.random() * 25).toFixed(1));
    }
    
    stations.push(station);
    
    // Collect metadata
    suburbs.add(city);
    brands.add(brand);
    regions.add(region);
  }
  
  // Sort stations by suburb, then name
  stations.sort((a, b) => {
    const suburbCompare = a.suburb.localeCompare(b.suburb);
    return suburbCompare !== 0 ? suburbCompare : a.name.localeCompare(b.name);
  });
  
  // Create metadata
  const metadata = {
    totalStations: stations.length,
    lastUpdated: new Date().toISOString(),
    suburbs: Array.from(suburbs).sort(),
    brands: Array.from(brands).sort(),
    regions: Array.from(regions).sort(),
    priceRange: {
      unleaded: {
        min: Math.min(...stations.filter(s => s.fuelPrices.unleaded).map(s => s.fuelPrices.unleaded)),
        max: Math.max(...stations.filter(s => s.fuelPrices.unleaded).map(s => s.fuelPrices.unleaded)),
        average: (stations.filter(s => s.fuelPrices.unleaded).reduce((sum, s) => sum + s.fuelPrices.unleaded, 0) / stations.filter(s => s.fuelPrices.unleaded).length).toFixed(1),
      }
    },
    stats: {
      byBrand: {},
      bySuburb: {},
    }
  };
  
  // Count by brand
  stations.forEach(station => {
    metadata.stats.byBrand[station.brand] = (metadata.stats.byBrand[station.brand] || 0) + 1;
    metadata.stats.bySuburb[station.suburb] = (metadata.stats.bySuburb[station.suburb] || 0) + 1;
  });
  
  // Ensure data directory exists
  const dataDir = path.dirname(JSON_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Write JSON files
  fs.writeFileSync(JSON_PATH, JSON.stringify(stations, null, 2));
  fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
  
  console.log(`✅ Successfully converted ${stations.length} stations`);
  console.log(`📊 Unique suburbs: ${suburbs.size}`);
  console.log(`🏪 Unique brands: ${brands.size}`);
  console.log(`📁 Output: ${JSON_PATH}`);
  console.log(`📁 Metadata: ${METADATA_PATH}\n`);
  
  // Print brand distribution
  console.log('Brand Distribution:');
  Object.entries(metadata.stats.byBrand)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([brand, count]) => {
      console.log(`  ${brand}: ${count} stations`);
    });
}

// Run conversion
try {
  convertCSVToJSON();
  process.exit(0);
} catch (error) {
  console.error('❌ Error converting CSV:', error.message);
  process.exit(1);
}

