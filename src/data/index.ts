/**
 * Data Layer - Centralized Data Access
 * 
 * This module provides a clean abstraction layer for all data access.
 * It exports functions for fetching stations, listings, and related data.
 * 
 * @module data
 */

// Station data access
export {
  getAllStations,
  getStationById,
  getAllStationIds,
  getStationsBySuburb,
  getStationsByRegion,
  getAllSuburbs,
  getAllRegions,
  searchStations,
  getNearbyStations,
} from '@/lib/data/stations';

// Station slug utilities
export {
  getStationBySlug,
  getAllStationSlugs,
  getStationIdFromSlug,
} from '@/lib/data/stations-slugs';

// Re-export types
export type { Station } from '@/types/station';
export type { FuelPrice } from '@/types/station';

