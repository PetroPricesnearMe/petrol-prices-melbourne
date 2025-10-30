/**
 * Baserow Query Functions
 *
 * Optimized server-side data fetching with:
 * - ISR support
 * - Error boundaries
 * - Type safety
 * - Caching strategies
 */

import { BASEROW_TABLES } from './types';
import type { PetrolStation, FuelPrice, FetchOptions } from './types';

// Get client singleton
function getClient() {
  // Dynamic import to avoid build-time errors if env vars are missing
  const { getBaserowClient } = require('./client');
  return getBaserowClient();
}

/**
 * Fetch all petrol stations with optional filters
 */
export async function fetchPetrolStations(
  options: FetchOptions = {}
): Promise<{
  stations: PetrolStation[];
  total: number;
}> {
  try {
    const client = getClient();
    const results = await client.fetchTableRows<PetrolStation>(
      'database', // databaseId
      BASEROW_TABLES.PETROL_STATIONS,
      options
    );

    return {
      stations: results,
      total: results.length,
    };
  } catch (error) {
    console.error('Error fetching petrol stations:', error);
    return {
      stations: [],
      total: 0,
    };
  }
}

/**
 * Fetch petrol stations by region
 */
export async function fetchStationsByRegion(region: string): Promise<PetrolStation[]> {
  const { stations } = await fetchPetrolStations({
    filters: [
      {
        field: 'Region',
        type: 'equal',
        value: region,
      },
    ],
  });

  return stations;
}

/**
 * Fetch nearby stations by coordinates
 */
export async function fetchNearbyStations(
  latitude: number,
  longitude: number,
  radiusKm: number = 10
): Promise<PetrolStation[]> {
  // Note: Baserow doesn't have built-in geo queries
  // We fetch all stations and filter client-side
  // For production, consider using PostGIS extension in Baserow

  const { stations } = await fetchPetrolStations();

  return stations.filter((station) => {
    const distance = calculateDistance(
      latitude,
      longitude,
      station.Latitude,
      station.Longitude
    );
    return distance <= radiusKm;
  }).sort((a, b) => {
    const distA = calculateDistance(latitude, longitude, a.Latitude, a.Longitude);
    const distB = calculateDistance(latitude, longitude, b.Latitude, b.Longitude);
    return distA - distB;
  });
}

/**
 * Fetch a single station by ID
 */
export async function fetchStationById(id: number): Promise<PetrolStation | null> {
  try {
    const client = getClient();
    return await client.fetchRowById<PetrolStation>(
      BASEROW_TABLES.PETROL_STATIONS,
      id
    );
  } catch (error) {
    console.error('Error fetching station:', error);
    return null;
  }
}

/**
 * Fetch fuel prices
 */
export async function fetchFuelPrices(
  options: FetchOptions = {}
): Promise<FuelPrice[]> {
  try {
    const client = getClient();
    return await client.fetchTableRows<FuelPrice>(
      'database',
      BASEROW_TABLES.FUEL_PRICES,
      options
    );
  } catch (error) {
    console.error('Error fetching fuel prices:', error);
    return [];
  }
}

/**
 * Fetch prices for a specific station
 */
export async function fetchPricesForStation(
  stationId: number
): Promise<FuelPrice[]> {
  const prices = await fetchFuelPrices({
    filters: [
      {
        field: 'Petrol_Station',
        type: 'contains',
        value: stationId,
      },
    ],
  });

  return prices;
}

/**
 * Search stations by name or address
 */
export async function searchStations(query: string): Promise<PetrolStation[]> {
  const { stations } = await fetchPetrolStations();

  const lowerQuery = query.toLowerCase();

  return stations.filter((station) => {
    return (
      station.Station_Name?.toLowerCase().includes(lowerQuery) ||
      station.Address?.toLowerCase().includes(lowerQuery) ||
      station.City?.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * ISR: Revalidate every hour
 */
export const REVALIDATE_TIME = 3600; // 1 hour

/**
 * Static generation paths for ISR
 */
export async function generateStaticParams() {
  const { stations } = await fetchPetrolStations();

  return stations.map((station) => ({
    id: station.id.toString(),
  }));
}
