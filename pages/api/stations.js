import { baserowServerService } from '../../lib/services/BaserowServerService';
import { loadStationsFromGeoJSON } from '../../lib/data/loadStations';

/**
 * API Route: Get all stations with real fuel prices
 * GET /api/stations
 * 
 * Features:
 * - Fetches from Baserow API (real data)
 * - Falls back to GeoJSON if Baserow fails
 * - Caching with ISR
 */
export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📡 [API] /api/stations called');
    
    let stations;
    let source = 'baserow';
    
    try {
      // Try to fetch real data from Baserow
      console.log('🔄 [API] Attempting to fetch from Baserow...');
      stations = await baserowServerService.fetchStationsWithPrices();
      
      if (!stations || stations.length === 0) {
        throw new Error('No stations returned from Baserow');
      }
      
      console.log(`✅ [API] Successfully fetched ${stations.length} stations from Baserow`);
      
    } catch (baserowError) {
      // Fallback to GeoJSON with mock prices
      console.warn('⚠️ [API] Baserow fetch failed, falling back to GeoJSON:', baserowError.message);
      stations = await loadStationsFromGeoJSON();
      source = 'geojson-fallback';
    }
    
    // Normalize data structure for consistency
    const normalizedStations = stations.map(station => ({
      ...station,
      fuelPrices: station.fuelPrices || (station.prices ? Object.entries(station.prices).map(([fuelType, price]) => ({
        fuelType,
        price: parseFloat(price || 0)
      })) : [])
    }));

    // Cache for 15 minutes for real data, 1 hour for fallback
    const cacheMaxAge = source === 'baserow' ? 900 : 3600;
    res.setHeader('Cache-Control', `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=86400`);
    
    res.status(200).json({
      success: true,
      data: normalizedStations,
      count: normalizedStations.length,
      source: source,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [API] Error fetching stations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stations',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

