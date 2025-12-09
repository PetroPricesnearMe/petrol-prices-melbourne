import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getFuelPrices, getStations } from '@/lib/api/server-actions';
import logger from '@/utils/logger';

/**
 * GET /api/fuel/prices
 * Returns list of fuel prices from FairFuel API or Baserow
 *
 * Query parameters:
 * - stationId: Filter prices by station ID
 * - fuelType: Filter prices by fuel type (e.g., 'unleaded', 'diesel', 'premium')
 * - suburb: Filter prices by suburb (requires station lookup)
 * - brand: Filter prices by brand (requires station lookup)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const stationId = searchParams.get('stationId');
    const fuelType = searchParams.get('fuelType');
    const suburb = searchParams.get('suburb');
    const brand = searchParams.get('brand');

    // Fetch all fuel prices
    const allPrices = await getFuelPrices();

    // If we need to filter by suburb or brand, we need station data
    let stationsMap: Map<number, { suburb?: string; brand?: string }> | null =
      null;
    if (suburb || brand) {
      try {
        const stations = await getStations();
        stationsMap = new Map(
          stations.map((station) => [
            station.id,
            { suburb: station.suburb, brand: station.brand },
          ])
        );
      } catch (error) {
        logger.warn('[API] Failed to fetch stations for filtering', error);
      }
    }

    // Apply filters if provided
    let filteredPrices = allPrices;

    if (stationId) {
      const id = parseInt(stationId, 10);
      if (!isNaN(id)) {
        filteredPrices = filteredPrices.filter(
          (price) => price.stationId === id
        );
      }
    }

    if (fuelType) {
      filteredPrices = filteredPrices.filter(
        (price) => price.fuelType?.toLowerCase() === fuelType.toLowerCase()
      );
    }

    if (suburb && stationsMap) {
      filteredPrices = filteredPrices.filter((price) => {
        if (!price.stationId) return false;
        const station = stationsMap!.get(price.stationId);
        return station?.suburb?.toLowerCase().includes(suburb.toLowerCase());
      });
    }

    if (brand && stationsMap) {
      filteredPrices = filteredPrices.filter((price) => {
        if (!price.stationId) return false;
        const station = stationsMap!.get(price.stationId);
        return station?.brand?.toLowerCase().includes(brand.toLowerCase());
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: filteredPrices,
        count: filteredPrices.length,
        total: allPrices.length,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  } catch (error) {
    logger.error('[API] Failed to fetch fuel prices', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch fuel prices',
        message:
          process.env.NODE_ENV === 'development'
            ? String(error)
            : 'An error occurred while fetching fuel prices',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  }
}
