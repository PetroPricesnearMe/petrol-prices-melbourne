import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { stationsRepository } from '@/lib/repositories/stations.repository';

export const dynamic = 'force-dynamic';

/**
 * GET /api/stations/nearby
 * Get stations near a location
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');

    if (!lat || !lng) {
      return NextResponse.json(
        { message: 'Latitude and longitude are required', status: 400 },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = radius ? parseFloat(radius) : 10;

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { message: 'Invalid coordinates', status: 400 },
        { status: 400 }
      );
    }

    const stations = await stationsRepository.findNearby(
      latitude,
      longitude,
      radiusKm
    );

    return NextResponse.json(
      {
        data: stations,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching nearby stations:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch nearby stations',
        status: 500,
      },
      { status: 500 }
    );
  }
}
