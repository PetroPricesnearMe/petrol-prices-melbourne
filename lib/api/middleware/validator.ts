/**
 * Request Validation Middleware
 * Validates request data using Zod schemas
 */

import type { NextApiRequest } from 'next';
import { z } from 'zod';

import { errors } from './errorHandler';

export type ValidationSchema = {
  query?: z.ZodSchema;
  body?: z.ZodSchema;
  params?: z.ZodSchema;
};

export function validate(schema: ValidationSchema) {
  return async (req: NextApiRequest): Promise<void> => {
    const validationErrors: Record<string, string[]> = {};

    // Validate query parameters
    if (schema.query) {
      const result = schema.query.safeParse(req.query);
      if (!result.success) {
        validationErrors.query = result.error.errors.map(err =>
          `${err.path.join('.')}: ${err.message}`
        );
      }
    }

    // Validate body
    if (schema.body) {
      const result = schema.body.safeParse(req.body);
      if (!result.success) {
        validationErrors.body = result.error.errors.map(err =>
          `${err.path.join('.')}: ${err.message}`
        );
      } else {
        req.body = result.data;
      }
    }

    // Validate params
    if (schema.params) {
      const result = schema.params.safeParse(req.query);
      if (!result.success) {
        validationErrors.params = result.error.errors.map(err =>
          `${err.path.join('.')}: ${err.message}`
        );
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      throw errors.badRequest('Validation failed', { validationErrors });
    }
  };
}

// Common validation schemas
export const commonSchemas = {
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20),
  }),

  coordinates: z.object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
  }),

  id: z.object({
    id: z.coerce.number().int().positive(),
  }),

  search: z.object({
    q: z.string().min(1).max(100),
  }),

  sorting: z.object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
};

// Station-specific schemas
export const stationSchemas = {
  getNearby: z.object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    radius: z.coerce.number().positive().max(50).default(10), // max 50km
    fuelType: z.string().optional(),
    brand: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20),
  }),

  getById: z.object({
    id: z.coerce.number().int().positive(),
  }),

  search: z.object({
    city: z.string().optional(),
    region: z.string().optional(),
    brand: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20),
  }),
};

// Fuel price schemas
export const priceSchemas = {
  getByStation: z.object({
    stationId: z.coerce.number().int().positive(),
    fuelType: z.string().optional(),
  }),

  search: z.object({
    fuelType: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20),
  }),
};
