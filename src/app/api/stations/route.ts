import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import { stationsRepository } from '@/lib/repositories/stations.repository';
import type { PetrolStation, FuelType, SortOption } from '@/types/index';


export const dynamic = 'force-dynamic';

/**
 * GET /api/stations
 * Get all stations with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fuelType = searchParams.get('fuelType');
    const maxDistance = searchParams.get('maxDistance');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy');
    const brands = searchParams.get('brands');

    const filters = {
      fuelType: fuelType as FuelType | undefined,
      maxDistance: maxDistance ? parseFloat(maxDistance) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy: sortBy as SortOption | undefined,
      brands: brands ? brands.split(',') : undefined,
    };

    const stations = await stationsRepository.findAll(filters);

    return NextResponse.json(
      {
        data: stations,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch stations',
        status: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stations
 * Create a new station (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add authentication and authorization
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const station: Partial<PetrolStation> = body;
    const newStation = await stationsRepository.create(station);

    return NextResponse.json(
      {
        data: newStation,
        status: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating station:', error);
    return NextResponse.json(
      {
        message: 'Failed to create station',
        status: 500,
      },
      { status: 500 }
    );
  }
}
