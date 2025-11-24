'use server';

import { randomUUID } from 'crypto';

import { safeReadBody, transformPriceDetailToStation } from './utils';

import { config } from '@/config/environment';
import { stationsCache } from '@/lib/api/cache';
import type {
  FairFuelBrandsResponse,
  FairFuelFuelTypesResponse,
  FairFuelPriceResponse,
} from '@/types/fairfuel';
import type { Station } from '@/types/station';
import logger from '@/utils/logger';

const {
  fairFuel: {
    enabled,
    baseUrl,
    consumerId,
    userAgent,
    cacheTtlMs,
    requestTimeoutMs,
  },
} = config;

const FAIRFUEL_CACHE_KEY = 'fairfuel:stations';
const FAIRFUEL_BRANDS_CACHE_KEY = 'fairfuel:brands';
const FAIRFUEL_FUEL_TYPES_CACHE_KEY = 'fairfuel:fuel-types';
const MIN_TIMEOUT = 1_000;

export async function isFairFuelConfigured(): Promise<boolean> {
  return Boolean(enabled && consumerId);
}

export async function getLiveStationsFromFairFuel(options?: {
  force?: boolean;
}): Promise<Station[]> {
  if (!(await isFairFuelConfigured())) {
    throw new Error('FairFuel Open Data API is not configured.');
  }

  if (!options?.force) {
    const cached = stationsCache.get<Station[]>(FAIRFUEL_CACHE_KEY);
    if (cached) {
      return cached;
    }
  }

  const payload = await fetchFairFuelPriceDetails();
  const details = payload.fuelPriceDetails || [];

  const stations = details
    .map(transformPriceDetailToStation)
    .filter((station): station is Station => Boolean(station));

  if (stations.length > 0) {
    stationsCache.set(FAIRFUEL_CACHE_KEY, stations, cacheTtlMs);
  }

  return stations;
}

async function fetchFairFuelPriceDetails(): Promise<FairFuelPriceResponse> {
  const transactionId = randomUUID();
  const controller = new AbortController();
  const timeout = Math.max(requestTimeoutMs, MIN_TIMEOUT);
  const timeoutHandle = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${baseUrl}/fuel/prices`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': userAgent,
        'x-consumer-id': consumerId as string,
        'x-transactionid': transactionId,
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await safeReadBody(response);
      const message = `[FairFuel] Request failed (${response.status}) ${response.statusText}${
        errorBody ? ` - ${errorBody}` : ''
      }`;
      logger.error(message);
      throw new Error(message);
    }

    return (await response.json()) as FairFuelPriceResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      const message = `[FairFuel] Request timed out after ${timeout}ms`;
      logger.error(message);
      throw new Error(message);
    }

    logger.error('[FairFuel] Failed to fetch prices', error);
    throw error;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

/**
 * Fetch fuel brands from FairFuel API
 * @returns List of available fuel brands
 */
export async function getFuelBrandsFromFairFuel(options?: {
  force?: boolean;
}): Promise<FairFuelBrandsResponse['brands']> {
  if (!(await isFairFuelConfigured())) {
    throw new Error('FairFuel Open Data API is not configured.');
  }

  if (!options?.force) {
    const cached = stationsCache.get<FairFuelBrandsResponse['brands']>(
      FAIRFUEL_BRANDS_CACHE_KEY
    );
    if (cached) {
      return cached;
    }
  }

  const response = await fetchFairFuelBrands();
  const brands = response.brands || [];

  if (brands.length > 0) {
    // Cache for 24 hours (brands don't change frequently)
    stationsCache.set(FAIRFUEL_BRANDS_CACHE_KEY, brands, 24 * 60 * 60 * 1000);
  }

  return brands;
}

/**
 * Fetch fuel types from FairFuel API
 * @returns List of available fuel types
 */
export async function getFuelTypesFromFairFuel(options?: {
  force?: boolean;
}): Promise<FairFuelFuelTypesResponse['fuelTypes']> {
  if (!(await isFairFuelConfigured())) {
    throw new Error('FairFuel Open Data API is not configured.');
  }

  if (!options?.force) {
    const cached = stationsCache.get<FairFuelFuelTypesResponse['fuelTypes']>(
      FAIRFUEL_FUEL_TYPES_CACHE_KEY
    );
    if (cached) {
      return cached;
    }
  }

  const response = await fetchFairFuelFuelTypes();
  const fuelTypes = response.fuelTypes || [];

  if (fuelTypes.length > 0) {
    // Cache for 24 hours (fuel types don't change frequently)
    stationsCache.set(
      FAIRFUEL_FUEL_TYPES_CACHE_KEY,
      fuelTypes,
      24 * 60 * 60 * 1000
    );
  }

  return fuelTypes;
}

async function fetchFairFuelBrands(): Promise<FairFuelBrandsResponse> {
  const transactionId = randomUUID();
  const controller = new AbortController();
  const timeout = Math.max(requestTimeoutMs, MIN_TIMEOUT);
  const timeoutHandle = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${baseUrl}/fuel/reference-data/brands`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': userAgent,
        'x-consumer-id': consumerId as string,
        'x-transactionid': transactionId,
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await safeReadBody(response);
      const message = `[FairFuel] Brands request failed (${response.status}) ${response.statusText}${
        errorBody ? ` - ${errorBody}` : ''
      }`;
      logger.error(message);
      throw new Error(message);
    }

    return (await response.json()) as FairFuelBrandsResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      const message = `[FairFuel] Brands request timed out after ${timeout}ms`;
      logger.error(message);
      throw new Error(message);
    }

    logger.error('[FairFuel] Failed to fetch brands', error);
    throw error;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

async function fetchFairFuelFuelTypes(): Promise<FairFuelFuelTypesResponse> {
  const transactionId = randomUUID();
  const controller = new AbortController();
  const timeout = Math.max(requestTimeoutMs, MIN_TIMEOUT);
  const timeoutHandle = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${baseUrl}/fuel/reference-data/types`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': userAgent,
        'x-consumer-id': consumerId as string,
        'x-transactionid': transactionId,
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await safeReadBody(response);
      const message = `[FairFuel] Fuel types request failed (${response.status}) ${response.statusText}${
        errorBody ? ` - ${errorBody}` : ''
      }`;
      logger.error(message);
      throw new Error(message);
    }

    return (await response.json()) as FairFuelFuelTypesResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      const message = `[FairFuel] Fuel types request timed out after ${timeout}ms`;
      logger.error(message);
      throw new Error(message);
    }

    logger.error('[FairFuel] Failed to fetch fuel types', error);
    throw error;
  } finally {
    clearTimeout(timeoutHandle);
  }
}
