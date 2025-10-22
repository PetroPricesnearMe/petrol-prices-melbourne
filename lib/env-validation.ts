/**
 * Environment Variable Validation
 * Validates all required environment variables at build time
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Application URLs
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),

  // NextAuth Configuration
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),

  // Database Configuration (Baserow)
  BASEROW_API_URL: z.string().url().default('https://api.baserow.io'),
  BASEROW_API_TOKEN: z.string().optional(),
  BASEROW_DATABASE_ID: z.string().optional(),
  BASEROW_PETROL_STATIONS_TABLE_ID: z.string().optional(),
  BASEROW_FUEL_PRICES_TABLE_ID: z.string().optional(),

  // Mapbox
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().optional(),
  REACT_APP_MAPBOX_ACCESS_TOKEN: z.string().optional(),

  // Analytics & Monitoring
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),

  // Error Tracking (Sentry)
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Performance Monitoring
  NEXT_PUBLIC_VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),

  // Uptime Monitoring
  UPTIME_ROBOT_API_KEY: z.string().optional(),
  HEALTHCHECK_IO_URL: z.string().url().optional(),

  // Rate Limiting & Security
  RATE_LIMIT_MAX: z.string().transform(Number).optional(),
  RATE_LIMIT_WINDOW: z.string().transform(Number).optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').optional(),
  NEXT_PUBLIC_ENABLE_ERROR_TRACKING: z.string().transform(val => val === 'true').optional(),

  // Version Info
  NEXT_PUBLIC_APP_VERSION: z.string().optional(),
  NEXT_PUBLIC_BUILD_TIME: z.string().optional(),
});

// Extract the type from the schema
export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables
 * Throws an error if validation fails
 */
export function validateEnv(): Env {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BASEROW_API_URL: process.env.BASEROW_API_URL,
    BASEROW_API_TOKEN: process.env.BASEROW_API_TOKEN,
    BASEROW_DATABASE_ID: process.env.BASEROW_DATABASE_ID,
    BASEROW_PETROL_STATIONS_TABLE_ID: process.env.BASEROW_PETROL_STATIONS_TABLE_ID,
    BASEROW_FUEL_PRICES_TABLE_ID: process.env.BASEROW_FUEL_PRICES_TABLE_ID,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    REACT_APP_MAPBOX_ACCESS_TOKEN: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    UPTIME_ROBOT_API_KEY: process.env.UPTIME_ROBOT_API_KEY,
    HEALTHCHECK_IO_URL: process.env.HEALTHCHECK_IO_URL,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_ERROR_TRACKING: process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME,
  };

  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');

      console.error('❌ Invalid environment variables:\n', missingVars);

      // In production, we should fail fast
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Missing required environment variables:\n${missingVars}`);
      }

      // In development, just warn
      console.warn('⚠️  Some environment variables are missing or invalid');
    }
    throw error;
  }
}

/**
 * Get validated environment variables
 * Safe to use throughout the application
 */
export const env = validateEnv();

/**
 * Check if we're in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if we're in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if we're in test environment
 */
export const isTest = env.NODE_ENV === 'test';
