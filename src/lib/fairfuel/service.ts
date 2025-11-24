'use server';

import { randomUUID } from 'crypto';

import { config } from '@/config/environment';
import { stationsCache } from '@/lib/api/cache';
import type { FairFuelPriceResponse } from '@/types/fairfuel';
import type { Station } from '@/types/station';
import logger from '@/utils/logger';
import { safeReadBody, transformPriceDetailToStation } from './utils';

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

