/**
 * Suburb Utilities
 * 
 * Helper functions for working with suburbs and finding nearby suburbs
 * 
 * @module lib/utils/suburbs
 */

import metadataJson from '@/data/stations-metadata.json';
import type stationsData from '@/data/stations.json';

type StationData = typeof stationsData[number];

/**
 * Get nearby suburbs based on station proximity
 * Returns suburbs that have stations and are alphabetically close
 * (as a simple heuristic - in production, use geographic proximity)
 */
export function getNearbySuburbs(
  currentSuburb: string,
  limit: number = 6
): Array<{ name: string; stationCount: number; url: string }> {
  const currentSuburbLower = currentSuburb.toLowerCase().trim();
  
  // Get all suburbs with their station counts
  const suburbStats = metadataJson.stats?.bySuburb || {};
  const allSuburbs = Object.keys(suburbStats)
    .map((suburb) => ({
      name: suburb,
      stationCount: suburbStats[suburb] || 0,
      url: `/directory/${suburb.toLowerCase().replace(/\s+/g, '-')}`,
    }))
    .filter((suburb) => suburb.stationCount > 0)
    .filter((suburb) => suburb.name.toLowerCase() !== currentSuburbLower);

  // Simple alphabetical proximity (in production, use geographic coordinates)
  // Sort by name similarity or alphabetical proximity
  const sorted = allSuburbs.sort((a, b) => {
    // Prefer suburbs that start with the same letter
    const aStartsWithSame = a.name.charAt(0).toLowerCase() === currentSuburb.charAt(0).toLowerCase();
    const bStartsWithSame = b.name.charAt(0).toLowerCase() === currentSuburb.charAt(0).toLowerCase();
    
    if (aStartsWithSame && !bStartsWithSame) return -1;
    if (!aStartsWithSame && bStartsWithSame) return 1;
    
    // Then sort by station count (more stations = more relevant)
    return b.stationCount - a.stationCount;
  });

  return sorted.slice(0, limit);
}

/**
 * Calculate average, lowest, and highest prices for a suburb
 */
export function calculateSuburbPriceStats(stations: StationData[]) {
  const pricesWithUnleaded = stations
    .filter((s) => s.fuelPrices?.unleaded && s.fuelPrices.unleaded > 0)
    .map((s) => s.fuelPrices!.unleaded!);

  if (pricesWithUnleaded.length === 0) {
    return {
      average: undefined,
      lowest: undefined,
      highest: undefined,
    };
  }

  const average =
    pricesWithUnleaded.reduce((sum, price) => sum + price, 0) / pricesWithUnleaded.length;
  const lowest = Math.min(...pricesWithUnleaded);
  const highest = Math.max(...pricesWithUnleaded);

  return { average, lowest, highest };
}

/**
 * Format suburb name for display (capitalize properly)
 */
export function formatSuburbName(suburb: string): string {
  return suburb
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Convert suburb name to URL slug
 */
export function suburbToSlug(suburb: string): string {
  return suburb.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Convert URL slug back to suburb name
 */
export function slugToSuburb(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
