import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { stationsRepository } from '@/lib/repositories/stations.repository';

export const dynamic = 'force-dynamic';

/**
 * GET /api/stations/[id]
 * Get a single station by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid station ID', status: 400 },
        { status: 400 }
      );
    }

    const station = await stationsRepository.findById(id);

    if (!station) {
      return NextResponse.json(
        { message: 'Station not found', status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: station,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching station:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch station',
        status: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/stations/[id]
 * Update a station (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid station ID', status: 400 },
        { status: 400 }
      );
    }

    const body = await request.json();

    // TODO: Add authentication and authorization
    const updatedStation = await stationsRepository.update(id, body);

    return NextResponse.json(
      {
        data: updatedStation,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating station:', error);
    return NextResponse.json(
      {
        message: 'Failed to update station',
        status: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/stations/[id]
 * Delete a station (admin only)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid station ID', status: 400 },
        { status: 400 }
      );
    }

    // TODO: Add authentication and authorization
    await stationsRepository.delete(id);

    return NextResponse.json(
      {
        message: 'Station deleted successfully',
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting station:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete station',
        status: 500,
      },
      { status: 500 }
    );
  }
}
