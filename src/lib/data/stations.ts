/**
 * Station Data Access Layer
 * Provides functions to fetch station data with caching and error handling
 */
import stationsData from '@/data/stations.json';
import type { Station } from '@/types/station';

// Import station data

/**
 * Get all stations
 */
export async function getAllStations(): Promise<Station[]> {
  try {
    return stationsData as Station[];
  } catch (error) {
    console.error('Error loading stations:', error);
    return [];
  }
}

/**
 * Get station by ID
 */
export async function getStationById(id: string): Promise<Station | null> {
  try {
    const stations = await getAllStations();
    const station = stations.find(
      (s) => s.id?.toString() === id || s.stationCode === id
    );
    return station || null;
  } catch (error) {
    console.error(`Error loading station ${id}:`, error);
    return null;
  }
}

/**
 * Get all station IDs for static generation
 */
export async function getAllStationIds(): Promise<string[]> {
  try {
    const stations = await getAllStations();
    return stations
      .map((s) => s.id?.toString() || s.stationCode)
      .filter((id): id is string => Boolean(id));
  } catch (error) {
    console.error('Error loading station IDs:', error);
    return [];
  }
}

/**
 * Get stations by suburb
 */
export async function getStationsBySuburb(suburb: string): Promise<Station[]> {
  try {
    const stations = await getAllStations();
    const normalizedSuburb = suburb.toLowerCase().replace(/\s+/g, '-');

    return stations.filter((s) => {
      const stationSuburb = s.suburb?.toLowerCase().replace(/\s+/g, '-');
      return stationSuburb === normalizedSuburb;
    });
  } catch (error) {
    console.error(`Error loading stations for suburb ${suburb}:`, error);
    return [];
  }
}

/**
 * Get stations by region
 */
export async function getStationsByRegion(region: string): Promise<Station[]> {
  try {
    const stations = await getAllStations();

    return stations.filter((s) => {
      const stationRegion = s.region?.toLowerCase().replace(/\s+/g, '-');
      return stationRegion === region.toLowerCase();
    });
  } catch (error) {
    console.error(`Error loading stations for region ${region}:`, error);
    return [];
  }
}

/**
 * Get all unique suburbs
 */
export async function getAllSuburbs(): Promise<string[]> {
  try {
    const stations = await getAllStations();
    const suburbs = new Set(
      stations
        .map((s) => s.suburb)
        .filter((suburb): suburb is string => Boolean(suburb))
    );
    return Array.from(suburbs).sort();
  } catch (error) {
    console.error('Error loading suburbs:', error);
    return [];
  }
}

/**
 * Get all unique regions
 */
export async function getAllRegions(): Promise<string[]> {
  try {
    const stations = await getAllStations();
    const regions = new Set(
      stations
        .map((s) => s.region)
        .filter((region): region is string => Boolean(region))
    );
    return Array.from(regions).sort();
  } catch (error) {
    console.error('Error loading regions:', error);
    return [];
  }
}

/**
 * Search stations by query
 */
export async function searchStations(query: string): Promise<Station[]> {
  try {
    const stations = await getAllStations();
    const lowerQuery = query.toLowerCase();

    return stations.filter((s) => {
      return (
        s.name?.toLowerCase().includes(lowerQuery) ||
        s.suburb?.toLowerCase().includes(lowerQuery) ||
        s.address?.toLowerCase().includes(lowerQuery) ||
        s.brand?.toLowerCase().includes(lowerQuery)
      );
    });
  } catch (error) {
    console.error(`Error searching stations with query "${query}":`, error);
    return [];
  }
}

/**
 * Get nearby stations based on coordinates
 */
export async function getNearbyStations(
  lat: number,
  lng: number,
  radiusKm: number = 5
): Promise<Station[]> {
  try {
    const stations = await getAllStations();

    return stations
      .filter((s) => s.latitude && s.longitude)
      .map((s) => ({
        ...s,
        distance: calculateDistance(
          lat,
          lng,
          s.latitude!,
          s.longitude!
        ),
      }))
      .filter((s) => s.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error loading nearby stations:', error);
    return [];
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
