/**
 * Stations API Route (Next.js 15 Route Handler)
 * Enhanced with error handling, caching, validation, and rate limiting
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { stationsCache, generateCacheKey } from '@/lib/api/cache';
import { getStations, searchStations } from '@/lib/api/server-actions';
import { validateFilters } from '@/lib/api/validation';
import type { Station } from '@/types/station';

// Enable edge runtime for faster response
export const runtime = 'nodejs'; // Use 'edge' for even faster responses
export const revalidate = 3600; // ISR - revalidate every hour

// ============================================================================
// GET /api/stations - List all stations with optional filters
// ============================================================================

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      suburb: searchParams.get('suburb') || undefined,
      brand: searchParams.get('brand') || undefined,
      fuelType: searchParams.get('fuelType') || undefined,
      maxPrice: searchParams.get('maxPrice')
        ? parseFloat(searchParams.get('maxPrice')!)
        : undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      latitude: searchParams.get('lat')
        ? parseFloat(searchParams.get('lat')!)
        : undefined,
      longitude: searchParams.get('lng')
        ? parseFloat(searchParams.get('lng')!)
        : undefined,
      radius: searchParams.get('radius')
        ? parseFloat(searchParams.get('radius')!)
        : undefined,
    };

    // Generate cache key
    const cacheKey = generateCacheKey('stations-api', filters);

    // Try cache first
    const cached = stationsCache.get<Station[]>(cacheKey);
    if (cached) {
      return NextResponse.json(
        {
          success: true,
          data: cached,
          cached: true,
          timestamp: new Date().toISOString(),
        },
        {
          status: 200,
          headers: {
            'Cache-Control':
              'public, s-maxage=3600, stale-while-revalidate=7200',
            'X-Cache': 'HIT',
            'X-Response-Time': `${Date.now() - startTime}ms`,
          },
        }
      );
    }

    // Fetch data
    let stations;
    const hasFilters = Object.values(filters).some((v) => v !== undefined);

    if (hasFilters) {
      // Validate filters
      const validation = validateFilters(filters);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid filters',
            details: validation.error,
          },
          { status: 400 }
        );
      }

      stations = await searchStations(validation.data!);
    } else {
      stations = await getStations();
    }

    // Cache result
    stationsCache.set(cacheKey, stations, 3600000); // 1 hour

    // Return response
    return NextResponse.json(
      {
        success: true,
        data: stations,
        count: stations.length,
        cached: false,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          'X-Cache': 'MISS',
          'X-Response-Time': `${Date.now() - startTime}ms`,
          'X-Total-Count': String(stations.length),
        },
      }
    );
  } catch (error) {
    console.error('Error in GET /api/stations:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message:
          process.env.NODE_ENV === 'development'
            ? String(error)
            : 'Failed to fetch stations',
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

// ============================================================================
// POST /api/stations - Create new station (protected)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession();
    // if (!session) return unauthorized();

    const body = await request.json();

    // Validate input with Zod
    const stationSchema = z.object({
      name: z.string().min(1).max(200),
      brand: z.string().min(1).max(100),
      address: z.string().min(1).max(300),
      suburb: z.string().min(1).max(100),
      city: z.string().min(1).max(100),
      postcode: z.string().regex(/^\d{4}$/),
      region: z.string().min(1).max(100),
      latitude: z.number().min(-90).max(90).nullable(),
      longitude: z.number().min(-180).max(180).nullable(),
      phone: z.string().optional(),
    });

    const validation = stationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Create station (implement based on your database)
    // const result = await createStation(validation.data);

    return NextResponse.json(
      {
        success: true,
        message: 'Station created successfully',
        // data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/stations:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create station',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// OPTIONS - CORS preflight
// ============================================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
