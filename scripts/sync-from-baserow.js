#!/usr/bin/env node

/**
 * Sync Petrol Stations Data from Baserow
 * Fetches all stations from Baserow API and updates local JSON files
 * Run: node scripts/sync-from-baserow.js
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

require('dotenv').config();

const BASEROW_API_URL = process.env.BASEROW_API_URL || 'https://api.baserow.io';
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN;
const PETROL_STATIONS_TABLE_ID =
  process.env.BASEROW_PETROL_STATIONS_TABLE_ID || '623329';
const FUEL_PRICES_TABLE_ID =
  process.env.BASEROW_FUEL_PRICES_TABLE_ID || '623330';

const JSON_PATH = path.join(__dirname, '../src/data/stations.json');
const METADATA_PATH = path.join(
  __dirname,
  '../src/data/stations-metadata.json'
);

// Brand logo mapping
const BRAND_LOGOS = {
  BP: '/images/brands/bp.png',
  Shell: '/images/brands/shell.png',
  Caltex: '/images/brands/caltex.png',
  '7-Eleven': '/images/brands/7eleven.png',
  'Coles Express': '/images/brands/coles.png',
  Ampol: '/images/brands/ampol.png',
  United: '/images/brands/united.png',
  Mobil: '/images/brands/mobil.png',
};

const baserowClient = axios.create({
  baseURL: `${BASEROW_API_URL}/api/database/rows/table`,
  headers: {
    Authorization: `Token ${BASEROW_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all stations from Baserow with pagination
 */
async function fetchAllStations() {
  console.log('🔄 Fetching stations from Baserow...\n');

  let allStations = [];
  let url = `/${PETROL_STATIONS_TABLE_ID}/?size=200`;
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      console.log(`   Fetching page ${page}...`);
      const response = await baserowClient.get(url);

      allStations = allStations.concat(response.data.results);
      console.log(
        `   ✓ Got ${response.data.results.length} stations (Total: ${allStations.length})`
      );

      // Check if there's a next page
      if (response.data.next) {
        const nextUrl = new URL(response.data.next);
        url = `/${PETROL_STATIONS_TABLE_ID}/${nextUrl.search}`;
        page++;
      } else {
        hasMore = false;
      }
    }

    console.log(
      `\n✅ Successfully fetched ${allStations.length} stations from Baserow\n`
    );
    return allStations;
  } catch (error) {
    console.error('❌ Error fetching stations from Baserow:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Fetch all fuel prices from Baserow with pagination
 */
async function fetchAllFuelPrices() {
  console.log('🔄 Fetching fuel prices from Baserow...\n');

  let allPrices = [];
  let url = `/${FUEL_PRICES_TABLE_ID}/?size=200`;
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      console.log(`   Fetching page ${page}...`);
      const response = await baserowClient.get(url);

      allPrices = allPrices.concat(response.data.results);
      console.log(
        `   ✓ Got ${response.data.results.length} prices (Total: ${allPrices.length})`
      );

      // Check if there's a next page
      if (response.data.next) {
        const nextUrl = new URL(response.data.next);
        url = `/${FUEL_PRICES_TABLE_ID}/${nextUrl.search}`;
        page++;
      } else {
        hasMore = false;
      }
    }

    console.log(
      `\n✅ Successfully fetched ${allPrices.length} fuel prices from Baserow\n`
    );
    return allPrices;
  } catch (error) {
    console.error('❌ Error fetching fuel prices from Baserow:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    // Don't throw - prices are optional
    return [];
  }
}

/**
 * Convert Baserow station to app format
 */
function convertStation(baserowStation, fuelPricesMap) {
  const stationId = baserowStation.id;
  const brand =
    Array.isArray(baserowStation.brand) && baserowStation.brand.length > 0
      ? baserowStation.brand[0]
      : 'Independent';

  // Get fuel prices for this station
  const stationPrices = fuelPricesMap.get(stationId) || {};

  return {
    id: stationId,
    name: baserowStation['Station Name'] || 'Unknown Station',
    brand,
    brandLogo: BRAND_LOGOS[brand] || null,
    address: baserowStation.Address || '',
    suburb: baserowStation.City || 'Unknown',
    postcode: baserowStation['Postal Code'] || '',
    region: baserowStation.Region || 'Victoria',
    latitude: baserowStation.Latitude || null,
    longitude: baserowStation.Longitude || null,
    fuelPrices: {
      unleaded: stationPrices.unleaded || null,
      diesel: stationPrices.diesel || null,
      premium95: stationPrices.premium95 || null,
      premium98: stationPrices.premium98 || null,
      lpg: stationPrices.lpg || null,
    },
    lastUpdated: stationPrices.lastUpdated || new Date().toISOString(),
    verified: true,
  };
}

/**
 * Map fuel type option ID to fuel type name
 */
const FUEL_TYPE_MAP = {
  3812408: 'unleaded',
  3812409: 'premium95',
  3812410: 'diesel',
  3812411: 'lpg',
  3812412: 'premium95',
};

/**
 * Convert Baserow fuel prices to a map by station ID
 */
function buildFuelPricesMap(fuelPrices) {
  const pricesMap = new Map();

  fuelPrices.forEach((price) => {
    const stationIds = price['Petrol Station'] || [];
    const fuelTypeId = price['Fuel Type'];
    const fuelType = FUEL_TYPE_MAP[fuelTypeId] || 'unknown';
    const priceValue = parseFloat(price['Price Per Liter']);

    if (isNaN(priceValue) || fuelType === 'unknown') return;

    stationIds.forEach((stationId) => {
      if (!pricesMap.has(stationId)) {
        pricesMap.set(stationId, {
          lastUpdated: price['Last Updated'] || new Date().toISOString(),
        });
      }

      pricesMap.get(stationId)[fuelType] = priceValue;
    });
  });

  return pricesMap;
}

/**
 * Generate metadata from stations
 */
function generateMetadata(stations) {
  const suburbs = new Set();
  const brands = new Set();
  const regions = new Set();
  const prices = [];

  const stats = {
    byBrand: {},
    bySuburb: {},
  };

  stations.forEach((station) => {
    suburbs.add(station.suburb);
    brands.add(station.brand);
    regions.add(station.region);

    stats.byBrand[station.brand] = (stats.byBrand[station.brand] || 0) + 1;
    stats.bySuburb[station.suburb] = (stats.bySuburb[station.suburb] || 0) + 1;

    if (station.fuelPrices.unleaded) {
      prices.push(station.fuelPrices.unleaded);
    }
  });

  const avgPrice =
    prices.length > 0
      ? (prices.reduce((sum, p) => sum + p, 0) / prices.length).toFixed(1)
      : '0.0';

  return {
    totalStations: stations.length,
    lastUpdated: new Date().toISOString(),
    suburbs: Array.from(suburbs).sort(),
    brands: Array.from(brands).sort(),
    regions: Array.from(regions).sort(),
    priceRange: {
      unleaded: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0,
        average: avgPrice,
      },
    },
    stats,
  };
}

/**
 * Main sync function
 */
async function syncFromBaserow() {
  console.log('🚀 Starting Baserow sync...\n');

  if (!BASEROW_API_TOKEN) {
    console.error(
      '❌ Error: BASEROW_API_TOKEN environment variable is not set'
    );
    console.error('   Please add it to your .env file');
    process.exit(1);
  }

  try {
    // Fetch data from Baserow
    const [baserowStations, fuelPrices] = await Promise.all([
      fetchAllStations(),
      fetchAllFuelPrices(),
    ]);

    // Build fuel prices map
    const fuelPricesMap = buildFuelPricesMap(fuelPrices);
    console.log(`📊 Mapped prices for ${fuelPricesMap.size} stations\n`);

    // Convert stations
    console.log('🔄 Converting stations...\n');
    const stations = baserowStations
      .map((bs) => convertStation(bs, fuelPricesMap))
      .filter((s) => s.name && s.suburb)
      .sort((a, b) => {
        const suburbCompare = a.suburb.localeCompare(b.suburb);
        return suburbCompare !== 0
          ? suburbCompare
          : a.name.localeCompare(b.name);
      });

    console.log(`✅ Converted ${stations.length} stations\n`);

    // Generate metadata
    console.log('🔄 Generating metadata...\n');
    const metadata = generateMetadata(stations);

    // Ensure data directory exists
    const dataDir = path.dirname(JSON_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write JSON files
    fs.writeFileSync(JSON_PATH, JSON.stringify(stations, null, 2));
    fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));

    console.log('✅ Successfully synced data from Baserow!');
    console.log(`\n📊 Summary:`);
    console.log(`   Total Stations: ${metadata.totalStations}`);
    console.log(`   Unique Suburbs: ${metadata.suburbs.length}`);
    console.log(`   Unique Brands: ${metadata.brands.length}`);
    console.log(`   Average Price: ${metadata.priceRange.unleaded.average}¢/L`);
    console.log(`\n📁 Output Files:`);
    console.log(`   ${JSON_PATH}`);
    console.log(`   ${METADATA_PATH}`);

    // Print top brands
    console.log(`\n🏪 Top Brands:`);
    Object.entries(metadata.stats.byBrand)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([brand, count]) => {
        console.log(`   ${brand}: ${count} stations`);
      });

    console.log('\n✨ Done!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run sync
syncFromBaserow();
