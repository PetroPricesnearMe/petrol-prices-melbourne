import { NextResponse } from 'next/server';

import {
  getFuelBrandsFromFairFuel,
  isFairFuelConfigured,
} from '@/lib/fairfuel/service';
import logger from '@/utils/logger';

/**
 * GET /api/fuel/brands
 * Returns list of fuel brands from FairFuel API
 */
export async function GET() {
  try {
    if (!(await isFairFuelConfigured())) {
      return NextResponse.json(
        { error: 'FairFuel API is not configured' },
        { status: 503 }
      );
    }

    const brands = await getFuelBrandsFromFairFuel();
    return NextResponse.json({ brands }, { status: 200 });
  } catch (error) {
    logger.error('[API] Failed to fetch fuel brands', error);
    return NextResponse.json(
      { error: 'Failed to fetch fuel brands' },
      { status: 500 }
    );
  }
}
