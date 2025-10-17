import { baserowServerService } from '../../lib/services/BaserowServerService';

/**
 * API Route: Get all fuel prices
 * GET /api/fuel-prices
 * 
 * Returns fuel prices from Baserow with station relationships
 */
export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📡 [API] /api/fuel-prices called');
    
    const prices = await baserowServerService.fetchFuelPrices();
    
    // Cache for 15 minutes
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=1800');
    
    res.status(200).json({
      success: true,
      data: prices,
      count: prices.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [API] Error fetching fuel prices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fuel prices',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

