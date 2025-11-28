/**
 * Distance formatting utilities
 * 
 * Provides consistent distance formatting across the application
 * with automatic unit conversion (meters for short distances, kilometers for longer)
 */

/**
 * Format distance to human-readable string
 * Automatically converts to meters for distances < 1km
 * @param distance - Distance in kilometers
 * @param options - Formatting options
 * @returns Formatted distance string (e.g., "500m" or "2.5km")
 */
export function formatDistance(
  distance: number | null | undefined,
  options: {
    unit?: 'auto' | 'km' | 'm';
    decimals?: number;
    showUnit?: boolean;
  } = {}
): string {
  const {
    unit = 'auto',
    decimals = 1,
    showUnit = true,
  } = options;

  if (distance === null || distance === undefined || isNaN(distance)) {
    return '';
  }

  // Force unit mode
  if (unit === 'km') {
    const value = distance.toFixed(decimals);
    return showUnit ? `${value}km` : value;
  }

  if (unit === 'm') {
    const value = (distance * 1000).toFixed(0);
    return showUnit ? `${value}m` : value;
  }

  // Auto mode: use meters for < 1km, kilometers otherwise
  if (distance < 1) {
    const value = Math.round(distance * 1000);
    return showUnit ? `${value}m` : value.toString();
  }

  const value = distance.toFixed(decimals);
  return showUnit ? `${value}km` : value;
}

/**
 * Format distance with space before unit (e.g., "500 m" or "2.5 km")
 * @param distance - Distance in kilometers
 * @returns Formatted distance string with space
 */
export function formatDistanceWithSpace(
  distance: number | null | undefined
): string | null {
  if (distance === null || distance === undefined || isNaN(distance)) {
    return null;
  }

  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

/**
 * Convert kilometers to meters
 * @param km - Distance in kilometers
 * @returns Distance in meters
 */
export function kmToMeters(km: number): number {
  return km * 1000;
}

/**
 * Convert meters to kilometers
 * @param meters - Distance in meters
 * @returns Distance in kilometers
 */
export function metersToKm(meters: number): number {
  return meters / 1000;
}

