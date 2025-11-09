/**
 * API Input Validation using Zod
 * Ensures type safety and security for all API inputs
 */

import { z } from 'zod';

import type { StationFilters } from '@/types/station';

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Station ID validation schema
 */
export const stationIdSchema = z.number().int().positive();

/**
 * Coordinates validation schema
 */
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

/**
 * Station filters validation schema
 */
export const stationFiltersSchema = z.object({
  suburb: z.string().min(1).max(100).optional(),
  brand: z.string().min(1).max(50).optional(),
  fuelType: z.enum(['Unleaded', 'Premium 95', 'Premium 98', 'Diesel', 'LPG', 'E10']).optional(),
  maxPrice: z.number().positive().max(1000).optional(),
  amenities: z.array(z.string()).optional(),
  sortBy: z.enum(['nearest', 'price-low', 'price-high', 'name', 'suburb', 'top-rated']).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().positive().max(50).optional(),
});

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().optional(),
});

/**
 * Search query schema
 */
export const searchQuerySchema = z.object({
  query: z.string().min(1).max(200),
  type: z.enum(['station', 'suburb', 'brand']).optional(),
  limit: z.number().int().positive().max(50).default(10),
});

/**
 * Fuel price update schema
 */
export const fuelPriceUpdateSchema = z.object({
  stationId: z.number().int().positive(),
  fuelType: z.string().min(1).max(50),
  price: z.number().positive().max(1000),
  source: z.string().max(200).optional(),
});

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validateStationId(id: number | string): { success: boolean; data?: number; error?: string } {
  try {
    const parsed = typeof id === 'string' ? parseInt(id, 10) : id;
    const result = stationIdSchema.parse(parsed);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Invalid station ID' };
    }
    return { success: false, error: 'Invalid station ID' };
  }
}

export function validateFilters(filters: unknown): { success: boolean; data?: StationFilters; error?: string } {
  try {
    const result = stationFiltersSchema.parse(filters);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Invalid filters' };
    }
    return { success: false, error: 'Invalid filters' };
  }
}

export function validateCoordinates(lat: number, lng: number): { success: boolean; data?: { latitude: number; longitude: number }; error?: string } {
  try {
    const result = coordinatesSchema.parse({ latitude: lat, longitude: lng });
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Invalid coordinates' };
    }
    return { success: false, error: 'Invalid coordinates' };
  }
}

export function validatePagination(pagination: unknown): { success: boolean; data?: z.infer<typeof paginationSchema>; error?: string } {
  try {
    const result = paginationSchema.parse(pagination);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Invalid pagination' };
    }
    return { success: false, error: 'Invalid pagination' };
  }
}

export function validateSearchQuery(query: unknown): { success: boolean; data?: z.infer<typeof searchQuerySchema>; error?: string } {
  try {
    const result = searchQuerySchema.parse(query);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Invalid search query' };
    }
    return { success: false, error: 'Invalid search query' };
  }
}

export function validateFuelPriceUpdate(data: unknown): { success: boolean; data?: z.infer<typeof fuelPriceUpdateSchema>; error?: string } {
  try {
    const result = fuelPriceUpdateSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Invalid fuel price data' };
    }
    return { success: false, error: 'Invalid fuel price data' };
  }
}

// ============================================================================
// SANITIZATION
// ============================================================================

/**
 * Sanitize user input to prevent XSS and injection
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .slice(0, 200); // Limit length
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Only allow alphanumeric, spaces, hyphens
    .slice(0, 100);
}

