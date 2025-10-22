/**
 * Optimized API Route for Stations
 * Implements caching, compression, and efficient data fetching
 */

import type { NextApiRequest, NextApiResponse } from 'next';

import { loadStations } from '../../lib/data/loadStations';

// In-memory cache
let cachedStations: any[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Response cache headers
function setCacheHeaders(res: NextApiResponse, maxAge: number = 3600) {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`
  );
  res.setHeader('CDN-Cache-Control', `public, max-age=${maxAge}`);
  res.setHeader('Vercel-CDN-Cache-Control', `public, max-age=${maxAge}`);
}

// Compression hint
// function _setCompressionHeaders(res: NextApiResponse) {
//   res.setHeader('Content-Encoding', 'gzip');
//   res.setHeader('Vary', 'Accept-Encoding');
// }

// Main handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = Date.now();

    // Check cache
    if (cachedStations && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('📦 Returning cached stations');
      setCacheHeaders(res, 3600);
      return res.status(200).json({
        stations: cachedStations,
        cached: true,
        timestamp: cacheTimestamp,
      });
    }

    // Load fresh data
    console.log('🔄 Loading fresh stations data...');
    const stations = await loadStations();

    // Update cache
    cachedStations = stations;
    cacheTimestamp = now;

    // Set cache headers
    setCacheHeaders(res, 3600);

    // Handle query parameters for filtering
    const { region, brand, limit } = req.query;
    let filteredStations = stations;

    if (region && typeof region === 'string') {
      filteredStations = filteredStations.filter(
        (station: any) => station.region?.toLowerCase() === region.toLowerCase()
      );
    }

    if (brand && typeof brand === 'string') {
      filteredStations = filteredStations.filter(
        (station: any) => station.brand?.toLowerCase().includes(brand.toLowerCase())
      );
    }

    if (limit && typeof limit === 'string') {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum)) {
        filteredStations = filteredStations.slice(0, limitNum);
      }
    }

    // Return optimized response
    return res.status(200).json({
      stations: filteredStations,
      total: stations.length,
      filtered: filteredStations.length,
      cached: false,
      timestamp: now,
    });
  } catch (error) {
    console.error('❌ Error loading stations:', error);

    // Return cached data if available, even if stale
    if (cachedStations) {
      console.log('⚠️ Returning stale cached data due to error');
      return res.status(200).json({
        stations: cachedStations,
        cached: true,
        stale: true,
        error: 'Using cached data',
      });
    }

    return res.status(500).json({
      error: 'Failed to load stations',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
}

// Edge function configuration (for Vercel)
export const config = {
  runtime: 'nodejs',
  maxDuration: 10, // 10 seconds max
  // Enable edge caching
  regions: ['syd1'], // Sydney region for Australian users
};
