/**
 * Station Slug Utilities
 *
 * Functions for working with station slugs and IDs
 */

import { getAllStations, getStationById } from './stations';

import {
  generateStationSlugFromData,
  extractIdFromSlug,
} from '@/lib/utils/slugs';
import type { Station } from '@/types/station';

/**
 * Get station by slug (extracts ID from slug and fetches station)
 */
export async function getStationBySlug(slug: string): Promise<Station | null> {
  const id = extractIdFromSlug(slug);
  if (!id) {
    return null;
  }
  return getStationById(id);
}

/**
 * Get all station slugs for static generation
 */
export async function getAllStationSlugs(): Promise<string[]> {
  const stations = await getAllStations();
  return stations.map((station) =>
    generateStationSlugFromData({
      name: station.name,
      id: station.id || station.stationCode || '',
      suburb: station.suburb,
    })
  );
}

/**
 * Get station ID from slug
 */
export function getStationIdFromSlug(slug: string): string | null {
  return extractIdFromSlug(slug);
}
