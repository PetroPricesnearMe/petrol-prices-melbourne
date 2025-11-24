import { NextResponse } from 'next/server';

import {
  getFuelTypesFromFairFuel,
  isFairFuelConfigured,
} from '@/lib/fairfuel/service';
import logger from '@/utils/logger';

/**
 * GET /api/fuel/types
 * Returns list of fuel types from FairFuel API
 */
export async function GET() {
  try {
    if (!(await isFairFuelConfigured())) {
      return NextResponse.json(
        { error: 'FairFuel API is not configured' },
        { status: 503 }
      );
    }

    const fuelTypes = await getFuelTypesFromFairFuel();
    return NextResponse.json({ fuelTypes }, { status: 200 });
  } catch (error) {
    logger.error('[API] Failed to fetch fuel types', error);
    return NextResponse.json(
      { error: 'Failed to fetch fuel types' },
      { status: 500 }
    );
  }
}
