/**
 * Server-side data loading for Next.js
 * Loads station data from Baserow or GeoJSON
 */

import fs from 'fs';
import path from 'path';

// Dynamic import for Baserow service (optional)
let baserowService;
try {
  const { baserowServerService } = require('../services/BaserowServerService');
  baserowService = baserowServerService;
} catch (error) {
  console.warn('⚠️ BaserowServerService not available, will use GeoJSON only');
}

/**
 * Load stations from GeoJSON file (server-side only)
 * Used in getStaticProps for pre-rendering
 */
export async function loadStationsFromGeoJSON() {
  try {
    console.log('🗺️ [Server] Loading stations from GeoJSON...');
    
    const filePath = path.join(process.cwd(), 'public', 'data', 'stations.geojson');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const geojson = JSON.parse(fileContents);

    if (!geojson.features || !Array.isArray(geojson.features)) {
      throw new Error('Invalid GeoJSON format');
    }

    const stations = geojson.features.map((feature, index) => {
      const props = feature.properties || {};
      const coords = feature.geometry?.coordinates || [0, 0];

      // Extract brand from station owner
      const owner = props.station_owner || '';
      let brand = owner;

      // Normalize brand names
      if (owner.includes('7-ELEVEN') || owner.includes('7 ELEVEN')) {
        brand = '7-Eleven';
      } else if (owner.includes('BP')) {
        brand = 'BP';
      } else if (owner.includes('SHELL')) {
        brand = 'Shell';
      } else if (owner.includes('CALTEX')) {
        brand = 'Caltex';
      } else if (owner.includes('AMPOL')) {
        brand = 'Ampol';
      } else if (owner.includes('MOBIL')) {
        brand = 'Mobil';
      } else if (owner.includes('UNITED')) {
        brand = 'United';
      }

      return {
        id: props.objectid || index + 1,
        name: props.station_name || 'Unknown Station',
        address: props.station_address || props.gnaf_formatted_address || '',
        city: props.station_suburb || props.gnaf_suburb || '',
        postalCode: props.station_postcode || props.gnaf_postcode || '',
        state: props.station_state || 'VIC',
        brand: brand,
        latitude: coords[1],  // GeoJSON is [lng, lat]
        longitude: coords[0],
        lat: coords[1],
        lng: coords[0],
        // Generate mock prices
        prices: generateMockPrices(brand),
        lastUpdated: props.station_revised_date || new Date().toISOString(),
      };
    });

    console.log(`✅ [Server] Loaded ${stations.length} stations from GeoJSON`);
    return stations;

  } catch (error) {
    console.error('❌ [Server] Error loading stations:', error);
    return [];
  }
}

/**
 * Generate mock fuel prices
 */
function generateMockPrices(brand) {
  const brandPricing = {
    'BP': { base: 1.95, variance: 0.05 },
    'Shell': { base: 1.93, variance: 0.05 },
    'Caltex': { base: 1.94, variance: 0.05 },
    'Ampol': { base: 1.92, variance: 0.05 },
    '7-Eleven': { base: 1.89, variance: 0.05 },
    'Mobil': { base: 1.96, variance: 0.05 },
    'United': { base: 1.88, variance: 0.05 },
    'default': { base: 1.94, variance: 0.08 }
  };

  const pricing = brandPricing[brand] || brandPricing.default;
  const basePrice = pricing.base + (Math.random() - 0.5) * pricing.variance * 2;

  return {
    unleaded: parseFloat(basePrice.toFixed(2)),
    premium: parseFloat((basePrice + 0.15).toFixed(2)),
    diesel: parseFloat((basePrice - 0.03).toFixed(2)),
    e10: parseFloat((basePrice - 0.05).toFixed(2)),
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Load stations from Baserow (real data with prices)
 * Falls back to GeoJSON if Baserow is unavailable
 */
export async function loadStationsFromBaserow() {
  if (!baserowService) {
    console.warn('⚠️ [Server] Baserow service not available, falling back to GeoJSON');
    return await loadStationsFromGeoJSON();
  }

  try {
    console.log('🔄 [Server] Loading stations from Baserow...');
    const stations = await baserowService.fetchStationsWithPrices();
    
    if (!stations || stations.length === 0) {
      console.warn('⚠️ [Server] No stations from Baserow, falling back to GeoJSON');
      return await loadStationsFromGeoJSON();
    }
    
    console.log(`✅ [Server] Loaded ${stations.length} stations from Baserow`);
    return stations;
    
  } catch (error) {
    console.error('❌ [Server] Error loading from Baserow, falling back to GeoJSON:', error.message);
    return await loadStationsFromGeoJSON();
  }
}

/**
 * Load stations (tries Baserow first, falls back to GeoJSON)
 */
export async function loadStations() {
  return await loadStationsFromBaserow();
}

/**
 * Get stations with ISR (Incremental Static Regeneration)
 * Cache for 24 hours, then regenerate
 * Uses Baserow data when available
 */
export async function getStationsWithISR() {
  const stations = await loadStations();
  
  return {
    stations,
    revalidate: 86400, // 24 hours in seconds
  };
}

