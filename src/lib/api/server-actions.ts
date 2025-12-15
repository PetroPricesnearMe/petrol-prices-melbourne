/**
 * Next.js 15 Server Actions
 * Modern server-side data fetching with automatic caching and revalidation
 *
 * Benefits:
 * - Type-safe server functions
 * - Automatic deduplication
 * - Built-in caching
 * - No API routes needed
 * - Progressive enhancement
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cache } from 'react';

import {
  calculateDistance,
  flattenStationFuelPrices,
  sortStations,
  transformBaserowToFuelPrices,
  transformBaserowToStation,
  transformBaserowToStations,
  transformStationToBaserow,
} from './server-action-utils';
import { validateStationId, validateFilters } from './validation';

import {
  getLiveStationsFromFairFuel,
  isFairFuelConfigured,
} from '@/lib/fairfuel/service';
import type { Station, FuelPrice, StationFilters } from '@/types/station';
import logger from '@/utils/logger';

const BASEROW_API_URL = process.env.BASEROW_API_URL || 'https://api.baserow.io';
const BASEROW_STATIONS_TABLE_ID =
  process.env.BASEROW_STATIONS_TABLE_ID || '623329';
const BASEROW_PRICES_TABLE_ID = process.env.BASEROW_PRICES_TABLE_ID || '623330';
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN || '';
const BASEROW_BASE_ENDPOINT = `${BASEROW_API_URL}/api/database/rows/table`;
const BASEROW_HEADERS = {
  Authorization: `Token ${BASEROW_API_TOKEN}`,
  'Content-Type': 'application/json',
};

// ============================================================================
// CACHED DATA FETCHERS (React Cache + Next.js Cache)
// ============================================================================

/**
 * Get all stations with automatic caching
 * Uses React cache() for request-level deduplication
 * Uses Next.js cache tags for revalidation
 */
export const getStations = cache(async (): Promise<Station[]> => {
  if (await isFairFuelConfigured()) {
    try {
      return await getLiveStationsFromFairFuel();
    } catch (error) {
      logger.error(
        'FairFuel integration failed while fetching stations, falling back to Baserow:',
        error
      );
    }
  }

  return fetchStationsFromBaserow();
});

/**
 * Get single station by ID with caching
 */
export const getStationById = cache(
  async (id: number | string): Promise<Station | null> => {
    const stringId = id?.toString();

    if (await isFairFuelConfigured()) {
      try {
        const stations = await getLiveStationsFromFairFuel();
        const station = stations.find(
          (entry) => entry.id?.toString() === stringId
        );
        if (station) {
          return station;
        }
      } catch (error) {
        logger.error(
          `FairFuel integration failed while fetching station ${stringId}, falling back to Baserow:`,
          error
        );
      }
    }

    const validationResult = validateStationId(id);
    if (!validationResult.success) {
      throw new Error(validationResult.error);
    }

    if (typeof validationResult.data === 'string') {
      // Non-numeric IDs are not stored in Baserow.
      return null;
    }

    return fetchStationByIdFromBaserow(validationResult.data);
  }
);

/**
 * Get stations by suburb with caching
 */
export const getStationsBySuburb = cache(
  async (suburb: string): Promise<Station[]> => {
    try {
      const allStations = await getStations();
      return allStations.filter(
        (station) => station.suburb?.toLowerCase() === suburb.toLowerCase()
      );
    } catch (error) {
      console.error(`Error fetching stations for suburb ${suburb}:`, error);
      return [];
    }
  }
);

/**
 * Get fuel prices with caching
 */
export const getFuelPrices = cache(async (): Promise<FuelPrice[]> => {
  if (await isFairFuelConfigured()) {
    try {
      const stations = await getLiveStationsFromFairFuel();
      return flattenStationFuelPrices(stations);
    } catch (error) {
      logger.error(
        'FairFuel integration failed while fetching fuel prices, falling back to Baserow:',
        error
      );
    }
  }

  return fetchFuelPricesFromBaserow();
});

/**
 * Search stations with filters
 * Server Action for form submissions
 */
export async function searchStations(
  filters: StationFilters
): Promise<Station[]> {
  // Validate filters
  const validationResult = validateFilters(filters);
  if (!validationResult.success) {
    throw new Error(validationResult.error);
  }

  try {
    const allStations = await getStations();

    let filtered = allStations;

    // Apply filters
    if (filters.suburb) {
      filtered = filtered.filter((s) =>
        s.suburb?.toLowerCase().includes(filters.suburb!.toLowerCase())
      );
    }

    if (filters.brand) {
      filtered = filtered.filter(
        (s) => s.brand?.toLowerCase() === filters.brand!.toLowerCase()
      );
    }

    if (filters.fuelType) {
      filtered = filtered.filter((s) => {
        if (!s.fuelPrices) return false;
        if (Array.isArray(s.fuelPrices)) {
          return s.fuelPrices.some(
            (fp: FuelPrice) => fp.fuelType === filters.fuelType
          );
        }
        return false;
      });
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((s) => {
        if (!s.fuelPrices) return false;
        if (Array.isArray(s.fuelPrices)) {
          return s.fuelPrices.some(
            (fp: FuelPrice) => (fp.pricePerLiter || 0) <= filters.maxPrice!
          );
        }
        return false;
      });
    }

    if (filters.amenities) {
      filtered = filtered.filter((s) =>
        filters.amenities!.every((amenity) => s.amenities?.[amenity])
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered = sortStations(filtered, filters.sortBy);
    }

    return filtered;
  } catch (error) {
    console.error('Error searching stations:', error);
    throw new Error('Failed to search stations');
  }
}

/**
 * Get nearby stations using geolocation
 * Server Action
 */
export async function getNearbyStations(
  latitude: number,
  longitude: number,
  radiusKm: number = 5
): Promise<Station[]> {
  try {
    const allStations = await getStations();

    // Filter out stations with invalid coordinates FIRST
    // Don't default null to (0,0) as that's in the Atlantic Ocean!
    const validStations = allStations.filter(
      (station) => station.latitude !== null && station.longitude !== null
    );

    return validStations
      .map((station) => ({
        ...station,
        distance: calculateDistance(
          latitude,
          longitude,
          station.latitude!, // Safe to use ! after filter
          station.longitude!
        ),
      }))
      .filter((station) => station.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error finding nearby stations:', error);
    return [];
  }
}

// ============================================================================
// MUTATIONS (Server Actions for data updates)
// ============================================================================

/**
 * Update station data
 * Server Action with revalidation
 */
export async function updateStation(
  id: number,
  data: Partial<Station>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.BASEROW_API_URL}/api/database/rows/table/${process.env.BASEROW_STATIONS_TABLE_ID}/${id}/`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${process.env.BASEROW_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformStationToBaserow(data)),
      }
    );

    if (!response.ok) {
      return { success: false, error: response.statusText };
    }

    // Revalidate cached data
    revalidateTag(`station-${id}`);
    revalidateTag('stations');
    revalidatePath('/directory');
    revalidatePath(`/stations/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating station:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Create new station
 * Server Action with revalidation
 */
export async function createStation(
  data: Omit<Station, 'id'>
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.BASEROW_API_URL}/api/database/rows/table/${process.env.BASEROW_STATIONS_TABLE_ID}/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${process.env.BASEROW_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformStationToBaserow(data)),
      }
    );

    if (!response.ok) {
      return { success: false, error: response.statusText };
    }

    const result = await response.json();

    // Revalidate cached data
    revalidateTag('stations');
    revalidatePath('/directory');

    return { success: true, id: result.id };
  } catch (error) {
    logger.error('Error creating station:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete station
 * Server Action with revalidation
 */
export async function deleteStation(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.BASEROW_API_URL}/api/database/rows/table/${process.env.BASEROW_STATIONS_TABLE_ID}/${id}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${process.env.BASEROW_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return { success: false, error: response.statusText };
    }

    // Revalidate cached data
    revalidateTag(`station-${id}`);
    revalidateTag('stations');
    revalidatePath('/directory');

    return { success: true };
  } catch (error) {
    logger.error('Error deleting station:', error);
    return { success: false, error: String(error) };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function fetchStationsFromBaserow(): Promise<Station[]> {
  try {
    const response = await fetch(
      `${BASEROW_BASE_ENDPOINT}/${BASEROW_STATIONS_TABLE_ID}/?size=200`,
      {
        headers: BASEROW_HEADERS,
        next: {
          revalidate: 3600,
          tags: ['stations'],
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.statusText}`);
    }

    const data = await response.json();
    return transformBaserowToStations(data.results);
  } catch (error) {
    logger.error('Error fetching stations from Baserow:', error);
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    throw error;
  }
}

async function fetchStationByIdFromBaserow(
  id: number
): Promise<Station | null> {
  try {
    const response = await fetch(
      `${BASEROW_BASE_ENDPOINT}/${BASEROW_STATIONS_TABLE_ID}/${id}/`,
      {
        headers: BASEROW_HEADERS,
        next: {
          revalidate: 1800,
          tags: ['stations', `station-${id}`],
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch station ${id}: ${response.statusText}`);
    }

    const data = await response.json();
    return transformBaserowToStation(data);
  } catch (error) {
    logger.error(`Error fetching station ${id} from Baserow:`, error);
    return null;
  }
}

async function fetchFuelPricesFromBaserow(): Promise<FuelPrice[]> {
  const REQUEST_TIMEOUT_MS = 10_000; // 10 seconds timeout
  const MIN_TIMEOUT = 1_000;
  const timeout = Math.max(REQUEST_TIMEOUT_MS, MIN_TIMEOUT);
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(
      `${BASEROW_BASE_ENDPOINT}/${BASEROW_PRICES_TABLE_ID}/?size=200`,
      {
        headers: BASEROW_HEADERS,
        signal: controller.signal,
        next: {
          revalidate: 300,
          tags: ['fuel-prices'],
        },
      }
    );

    if (!response.ok) {
      // Safe body reading for error responses
      let errorBody: string | null = null;
      try {
        const text = await response.text();
        errorBody = text?.slice(0, 500) || null;
      } catch {
        // Ignore body reading errors
      }

      // Better error messages for different status codes
      let errorMessage = `Failed to fetch fuel prices from Baserow: ${response.status} ${response.statusText}`;
      if (errorBody) {
        errorMessage += ` - ${errorBody}`;
      }

      if (response.status === 401) {
        errorMessage =
          'Baserow API authentication failed. Please check API token.';
      } else if (response.status === 403) {
        errorMessage =
          'Baserow API access forbidden. Please check permissions.';
      } else if (response.status === 404) {
        errorMessage = 'Baserow fuel prices table not found.';
      } else if (response.status === 429) {
        errorMessage =
          'Baserow API rate limit exceeded. Please try again later.';
      } else if (response.status >= 500) {
        errorMessage = 'Baserow API server error. Please try again later.';
      }

      logger.error(`[Baserow] ${errorMessage}`);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Validate response structure
    if (!data || !Array.isArray(data.results)) {
      logger.warn(
        '[Baserow] Invalid response structure, expected array in results field'
      );
      return [];
    }

    return transformBaserowToFuelPrices(data.results);
  } catch (error) {
    // Handle timeout errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      const message = `[Baserow] Request timed out after ${timeout}ms`;
      logger.error(message);
      return [];
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      logger.error(
        '[Baserow] Network error - Unable to connect to Baserow API'
      );
      return [];
    }

    // Re-throw if it's our custom error (already logged)
    if (error instanceof Error && error.message.includes('Baserow')) {
      return [];
    }

    logger.error('Error fetching fuel prices from Baserow:', error);
    return [];
  } finally {
    clearTimeout(timeoutHandle);
  }
}
