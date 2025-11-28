/**
 * Marker utility functions for map markers
 */

import { getBrandColor as getBrandColorUtil } from '@/lib/utils/colors';
import { formatPriceCentsPerLiter } from '@/lib/utils/price';
import { getPriceColorClass } from '@/lib/utils/price';
import type { Station } from '@/types/station';

/**
 * Get brand color for marker styling
 * @deprecated Use getBrandColor from '@/lib/utils/colors' instead
 */
export function getBrandColor(brand?: string): string {
  return getBrandColorUtil(brand);
}

/**
 * Get marker icon URL or fallback
 */
export function getMarkerIconUrl(station: Station): string | null {
  return station.image || station.logoUrl || null;
}

/**
 * Get brand initial for marker fallback
 */
export function getBrandInitial(station: Station): string {
  return (station.brand || station.name || 'S').charAt(0).toUpperCase();
}

/**
 * Format price for display
 * @deprecated Use formatPriceCentsPerLiter from '@/lib/utils/price' instead
 */
export function formatPrice(price: number | null | undefined): string {
  return formatPriceCentsPerLiter(price);
}

/**
 * Get cheapest price from station
 */
export function getCheapestPrice(station: Station): number | null {
  if (!station.fuelPrices) return null;

  const prices = Object.values(station.fuelPrices).filter(
    (p): p is number => typeof p === 'number' && p > 0
  );

  return prices.length > 0 ? Math.min(...prices) : null;
}

/**
 * Get price color class based on price
 * @deprecated Use getPriceColorClass from '@/lib/utils/price' instead
 */
export function getPriceColor(price: number | null): string {
  return getPriceColorClass(price);
}

