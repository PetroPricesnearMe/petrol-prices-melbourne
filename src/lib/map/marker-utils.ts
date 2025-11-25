/**
 * Marker utility functions for map markers
 */

import type { Station } from '@/types/station';

/**
 * Get brand color for marker styling
 */
export function getBrandColor(brand?: string): string {
  const brandColors: Record<string, string> = {
    BP: '#00A651',
    Shell: '#FFD700',
    Caltex: '#FF6B35',
    '7-Eleven': '#FF6900',
    'Coles Express': '#E31837',
    Woolworths: '#1B5E20',
    United: '#1976D2',
    Puma: '#E91E63',
    Liberty: '#6B46C1',
    Metro: '#059669',
    Independent: '#6B7280',
  };

  return brandColors[brand || ''] || '#6B7280';
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
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) return 'N/A';
  return `${price.toFixed(1)}¢/L`;
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
 */
export function getPriceColor(price: number | null): string {
  if (price === null) return 'text-gray-400';
  if (price < 200) return 'text-green-600';
  if (price <= 210) return 'text-yellow-600';
  return 'text-red-600';
}

