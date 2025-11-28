/**
 * Listing Types - Shared TypeScript types for petrol station listings
 *
 * This module provides comprehensive type definitions for petrol station listings
 * used consistently across hooks, components, and pages
 *
 * @module types/listing
 */

import type { ID, Coordinates } from './common';
import { formatPriceCents } from '@/lib/utils/price';
import { formatDistance as formatDistanceUtil } from '@/lib/utils/distance';
import { getBrandColor as getBrandColorUtil } from '@/lib/utils/colors';

// ============================================================================
// Fuel Price Types
// ============================================================================

/** Fuel prices for all available fuel types */
export interface FuelPrices {
  /** Unleaded fuel price per liter (cents) */
  unleaded: number | null;
  /** Diesel fuel price per liter (cents) */
  diesel: number | null;
  /** Premium 95 octane fuel price per liter (cents) */
  premium95: number | null;
  /** Premium 98 octane fuel price per liter (cents) */
  premium98: number | null;
  /** LPG fuel price per liter (cents) */
  lpg: number | null;
  /** E10 ethanol blend fuel price per liter (cents) */
  e10?: number | null;
  /** E85 ethanol blend fuel price per liter (cents) */
  e85?: number | null;
}

/** Fuel type keys for filtering and selection */
export type FuelTypeKey = keyof FuelPrices;

/** Fuel type display names */
export const FUEL_TYPE_LABELS: Record<FuelTypeKey, string> = {
  unleaded: 'Unleaded',
  diesel: 'Diesel',
  premium95: 'Premium 95',
  premium98: 'Premium 98',
  lpg: 'LPG',
  e10: 'E10',
  e85: 'E85',
};

// ============================================================================
// Amenity Types
// ============================================================================

/** Station amenities and facilities */
export interface StationAmenities {
  /** Has car wash facility */
  carWash?: boolean;
  /** Has convenience store or shop */
  cafe?: boolean;
  /** Has ATM machine */
  atm?: boolean;
  /** Has air pump for tires */
  airPump?: boolean;
  /** Has restroom facilities */
  toilets?: boolean;
  /** Has disabled access facilities */
  disabled?: boolean;
  /** Open 24 hours */
  open24Hours?: boolean;
  /** Has electric vehicle charging */
  evCharging?: boolean;
  /** Has truck parking */
  truckParking?: boolean;
  /** Has restaurant */
  restaurant?: boolean;
}

// ============================================================================
// Listing/Station Types
// ============================================================================

/** Base petrol station listing */
export interface Listing {
  /** Unique identifier */
  id: ID;
  /** Station name */
  name: string;
  /** Brand name (e.g., BP, Shell, Caltex) */
  brand: string;
  /** Brand logo URL */
  brandLogo: string | null;
  /** Street address */
  address: string;
  /** Suburb name */
  suburb: string;
  /** Postal code */
  postcode: string;
  /** State/Region (e.g., Victoria, NSW) */
  region: string;
  /** Station category */
  category?: string;
  /** Latitude coordinate */
  latitude: number | null;
  /** Longitude coordinate */
  longitude: number | null;
  /** Fuel prices for all fuel types */
  fuelPrices: FuelPrices;
  /** Station amenities */
  amenities?: StationAmenities;
  /** Last price update timestamp */
  lastUpdated: string;
  /** Whether price data is verified */
  verified: boolean;
  /** Distance from user location (km) */
  distance?: number;
  /** Station rating (0-5) */
  rating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Station phone number */
  phone?: string;
  /** Station website URL */
  website?: string;
  /** Operating hours */
  hours?: string;
}

/** Listing with computed properties */
export interface ListingWithMetrics extends Listing {
  /** Cheapest available fuel price */
  cheapestPrice: number | null;
  /** Most expensive available fuel price */
  mostExpensivePrice: number | null;
  /** Number of fuel types available */
  availableFuelTypes: number;
  /** Whether station has premium fuel */
  hasPremium: boolean;
  /** Price comparison to average (percentage) */
  priceVsAverage?: number;
}

/** Listing card display props */
export interface ListingCardData {
  listing: Listing;
  /** Highlight specific fuel type */
  highlightFuelType?: FuelTypeKey;
  /** Show distance from user */
  showDistance?: boolean;
  /** Show amenities */
  showAmenities?: boolean;
  /** Compact display mode */
  compact?: boolean;
}

// ============================================================================
// Metadata Types
// ============================================================================

/** Metadata about listings collection */
export interface ListingMetadata {
  /** Total number of stations */
  totalStations: number;
  /** Unique suburbs */
  suburbs: string[];
  /** Unique brands */
  brands: string[];
  /** Unique regions */
  regions?: string[];
  /** Price statistics */
  priceRange: {
    unleaded: PriceStats;
    diesel?: PriceStats;
    premium95?: PriceStats;
    premium98?: PriceStats;
    lpg?: PriceStats;
  };
  /** Last data update */
  lastUpdated?: string;
}

/** Price statistics for a fuel type */
export interface PriceStats {
  /** Minimum price */
  min: number;
  /** Maximum price */
  max: number;
  /** Average price */
  average: string | number;
  /** Median price */
  median?: number;
  /** Number of stations with this fuel type */
  count?: number;
}

// ============================================================================
// Collection Types
// ============================================================================

/** Collection of listings with metadata */
export interface ListingCollection {
  /** Array of listings */
  listings: Listing[];
  /** Collection metadata */
  metadata: ListingMetadata;
  /** Total count (may differ from listings.length if paginated) */
  total: number;
  /** Current page (1-indexed) */
  page?: number;
  /** Items per page */
  pageSize?: number;
  /** Total pages */
  totalPages?: number;
}

/** Paginated listing response */
export interface PaginatedListings {
  /** Current page items */
  items: Listing[];
  /** Current page number (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total items across all pages */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrevious: boolean;
}

// ============================================================================
// Type Guards
// ============================================================================

/** Check if value is a valid Listing */
export function isListing(value: unknown): value is Listing {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'brand' in value &&
    'suburb' in value &&
    'fuelPrices' in value
  );
}

/** Check if listing has valid coordinates */
export function hasValidCoordinates(listing: Listing): boolean {
  return (
    typeof listing.latitude === 'number' &&
    typeof listing.longitude === 'number' &&
    !isNaN(listing.latitude) &&
    !isNaN(listing.longitude)
  );
}

/** Check if listing has any fuel prices */
export function hasFuelPrices(listing: Listing): boolean {
  return Object.values(listing.fuelPrices).some(price => price !== null && price > 0);
}

/** Get available fuel types for a listing */
export function getAvailableFuelTypes(listing: Listing): FuelTypeKey[] {
  return Object.entries(listing.fuelPrices)
    .filter(([, price]) => price !== null && price > 0)
    .map(([type]) => type as FuelTypeKey);
}

/** Get cheapest fuel price from a listing */
export function getCheapestPrice(listing: Listing): number | null {
  const prices = Object.values(listing.fuelPrices).filter(
    (price): price is number => price !== null && price > 0
  );
  return prices.length > 0 ? Math.min(...prices) : null;
}

/** Get listing coordinates */
export function getListingCoordinates(listing: Listing): Coordinates | null {
  if (!hasValidCoordinates(listing)) return null;
  return {
    latitude: listing.latitude!,
    longitude: listing.longitude!,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format price for display
 * @deprecated Use formatPriceCents from '@/lib/utils/price' instead
 */
export function formatListingPrice(price: number | null): string {
  return formatPriceCents(price);
}

/**
 * Format distance for display
 * @deprecated Use formatDistance from '@/lib/utils/distance' instead
 */
export function formatDistance(distance: number | undefined): string {
  return formatDistanceUtil(distance);
}

/**
 * Get brand color/theme
 * @deprecated Use getBrandColor from '@/lib/utils/colors' instead
 */
export function getBrandColor(brand: string): string {
  return getBrandColorUtil(brand);
}

/** Sort listings by criteria */
export function sortListings(
  listings: Listing[],
  sortBy: string
): Listing[] {
  const sorted = [...listings];

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => {
        const priceA = getCheapestPrice(a) || Infinity;
        const priceB = getCheapestPrice(b) || Infinity;
        return priceA - priceB;
      });

    case 'price-high':
      return sorted.sort((a, b) => {
        const priceA = getCheapestPrice(a) || -Infinity;
        const priceB = getCheapestPrice(b) || -Infinity;
        return priceB - priceA;
      });

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'suburb':
      return sorted.sort((a, b) => a.suburb.localeCompare(b.suburb));

    case 'distance':
      return sorted.sort((a, b) => {
        const distA = a.distance || Infinity;
        const distB = b.distance || Infinity;
        return distA - distB;
      });

    case 'top-rated':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    default:
      return sorted;
  }
}
