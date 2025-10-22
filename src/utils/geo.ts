import type { Coordinates } from '@/types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param from - Starting coordinates
 * @param to - Ending coordinates
 * @returns Distance in kilometers
 */
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Get user's current geolocation
 * @returns Promise with coordinates or null
 */
export function getCurrentPosition(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      }
    );
  });
}

/**
 * Calculate bounding box for a given center and radius
 * @param center - Center coordinates
 * @param radiusKm - Radius in kilometers
 * @returns Bounding box coordinates
 */
export function getBoundingBox(
  center: Coordinates,
  radiusKm: number
): {
  northEast: Coordinates;
  southWest: Coordinates;
} {
  const latDiff = radiusKm / 111; // 1 degree latitude ≈ 111 km
  const lngDiff = radiusKm / (111 * Math.cos(toRad(center.lat)));

  return {
    northEast: {
      lat: center.lat + latDiff,
      lng: center.lng + lngDiff,
    },
    southWest: {
      lat: center.lat - latDiff,
      lng: center.lng - lngDiff,
    },
  };
}

