/**
 * Melbourne Stations Data Access
 * Fetches and filters stations for Melbourne, Victoria
 */

import { getAllStations } from './stations';

import type { Station } from '@/types/station';
import logger from '@/utils/logger';

/**
 * Get all stations in Melbourne, Victoria
 */
export async function getMelbourneStations(): Promise<Station[]> {
  try {
    const allStations = await getAllStations();

    // Filter for Melbourne stations
    // Melbourne postcodes: 3000-3207, 8000-8999 (some outer areas)
    const melbourneStations = allStations.filter((station) => {
      // Check if station is in Melbourne region
      const region = station.region?.toLowerCase() || '';
      const suburb = station.suburb?.toLowerCase() || '';
      const postcode = station.postcode || '';

      // Melbourne CBD and inner suburbs
      const isMelbourneRegion =
        region.includes('melbourne') ||
        suburb.includes('melbourne') ||
        (postcode && parseInt(postcode) >= 3000 && parseInt(postcode) <= 3207);

      return isMelbourneRegion;
    });

    return melbourneStations;
  } catch (error) {
    logger.error('Error fetching Melbourne stations:', error);
    return [];
  }
}

/**
 * Get station by ID (for individual listing pages)
 */
export async function getMelbourneStationById(
  id: string
): Promise<Station | null> {
  try {
    const stations = await getMelbourneStations();
    return stations.find((s) => s.id?.toString() === id) || null;
  } catch (error) {
    console.error(`Error fetching Melbourne station ${id}:`, error);
    return null;
  }
}
