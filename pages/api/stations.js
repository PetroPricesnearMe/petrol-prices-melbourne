import { loadStationsFromGeoJSON } from '../../lib/data/loadStations';

/**
 * API Route: Get all stations
 * GET /api/stations
 * 
 * Used for client-side data fetching if needed
 */
export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📡 [API] /api/stations called');
    
    const stations = await loadStationsFromGeoJSON();
    
    // Normalize data
    const normalizedStations = stations.map(station => ({
      ...station,
      fuelPrices: station.prices ? Object.entries(station.prices).map(([fuelType, price]) => ({
        fuelType,
        price: parseFloat(price || 0)
      })) : []
    }));

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({
      success: true,
      data: normalizedStations,
      count: normalizedStations.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [API] Error fetching stations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stations',
      message: error.message
    });
  }
}

