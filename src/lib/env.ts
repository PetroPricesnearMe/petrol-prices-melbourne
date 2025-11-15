/**
 * Environment Variables Utility
 * Safe access to environment variables with validation and defaults
 *
 * @module lib/env
 */

/**
 * Get environment variable with type safety
 */
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

/**
 * Get optional environment variable
 */
function getOptionalEnv(
  key: string,
  defaultValue?: string
): string | undefined {
  return process.env[key] ?? defaultValue;
}

/**
 * Get boolean environment variable
 */
function getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];

  if (value === undefined) {
    return defaultValue;
  }

  return value === 'true' || value === '1' || value === 'yes';
}

/**
 * Get number environment variable
 */
function getNumberEnv(key: string, defaultValue?: number): number {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }

  const parsed = Number(value);

  if (isNaN(parsed)) {
    throw new Error(`Invalid number for environment variable ${key}: ${value}`);
  }

  return parsed;
}

// ============================================================================
// PUBLIC ENVIRONMENT VARIABLES (Browser-accessible)
// ============================================================================

/**
 * Application base URL
 */
export const APP_URL = getOptionalEnv(
  'NEXT_PUBLIC_APP_URL',
  'https://petrolpricenearme.com.au'
)!;

/**
 * Google Analytics ID
 */
export const GA_ID = getOptionalEnv('NEXT_PUBLIC_GA_ID');

/**
 * Google Tag Manager ID
 */
export const GTM_ID = getOptionalEnv('NEXT_PUBLIC_GTM_ID');

/**
 * Mapbox API Token
 */
export const MAPBOX_TOKEN = getOptionalEnv('NEXT_PUBLIC_MAPBOX_TOKEN');

/**
 * Google Places API Key
 */
export const GOOGLE_PLACES_API_KEY = getOptionalEnv(
  'NEXT_PUBLIC_GOOGLE_PLACES_API_KEY'
);

// ============================================================================
// SERVER-ONLY ENVIRONMENT VARIABLES
// ============================================================================

/**
 * Baserow API Configuration
 */
export const BASEROW_CONFIG = {
  apiUrl: getOptionalEnv('BASEROW_API_URL', 'https://api.baserow.io'),
  apiToken: getOptionalEnv('BASEROW_API_TOKEN'),
  stationsTableId: getOptionalEnv('BASEROW_STATIONS_TABLE_ID'),
  fuelPricesTableId: getOptionalEnv('BASEROW_FUEL_PRICES_TABLE_ID'),
} as const;

/**
 * Database URL
 */
export const DATABASE_URL = getOptionalEnv('DATABASE_URL');

/**
 * NextAuth Configuration
 */
export const NEXTAUTH_CONFIG = {
  url: getOptionalEnv('NEXTAUTH_URL', APP_URL),
  secret: getOptionalEnv('NEXTAUTH_SECRET'),
} as const;

/**
 * Email Configuration
 */
export const EMAIL_CONFIG = {
  host: getOptionalEnv('SMTP_HOST'),
  port: getNumberEnv('SMTP_PORT', 587),
  user: getOptionalEnv('SMTP_USER'),
  password: getOptionalEnv('SMTP_PASSWORD'),
  from: getOptionalEnv('SMTP_FROM', 'petrolpricesnearme@gmail.com'),
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  analytics: getBooleanEnv('ENABLE_ANALYTICS', true),
  maps: getBooleanEnv('ENABLE_MAPS', true),
  chat: getBooleanEnv('ENABLE_CHAT', false),
} as const;

// ============================================================================
// RUNTIME CONFIGURATION
// ============================================================================

/**
 * Check if running in production
 */
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Check if running in development
 */
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

/**
 * Debug mode
 */
export const DEBUG = getBooleanEnv('DEBUG', false);

/**
 * Cache TTL in seconds
 */
export const CACHE_TTL = getNumberEnv('CACHE_TTL_SECONDS', 3600);

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT = {
  maxRequests: getNumberEnv('RATE_LIMIT_MAX_REQUESTS', 100),
  windowMs: getNumberEnv('RATE_LIMIT_WINDOW_MS', 60000),
} as const;

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate required environment variables
 * Call this at app startup
 */
export function validateEnv(): void {
  const errors: string[] = [];

  // Validate public variables
  if (!APP_URL) {
    errors.push('NEXT_PUBLIC_APP_URL is required');
  }

  // Validate server variables (only in production)
  if (IS_PRODUCTION) {
    if (!BASEROW_CONFIG.apiToken) {
      errors.push('BASEROW_API_TOKEN is required in production');
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    );
  }
}

// ============================================================================
// TYPE-SAFE ENV GETTERS
// ============================================================================

/**
 * Type-safe environment variable accessor
 * Use this for accessing env vars in components
 */
export const env = {
  // Public
  appUrl: APP_URL,
  gaId: GA_ID,
  gtmId: GTM_ID,
  mapboxToken: MAPBOX_TOKEN,
  googlePlacesKey: GOOGLE_PLACES_API_KEY,

  // Server (undefined in browser)
  baserow: typeof window === 'undefined' ? BASEROW_CONFIG : undefined,
  databaseUrl: typeof window === 'undefined' ? DATABASE_URL : undefined,
  nextauth: typeof window === 'undefined' ? NEXTAUTH_CONFIG : undefined,
  email: typeof window === 'undefined' ? EMAIL_CONFIG : undefined,

  // Features
  features: FEATURES,

  // Runtime
  isProduction: IS_PRODUCTION,
  isDevelopment: IS_DEVELOPMENT,
  debug: DEBUG,
} as const;

export default env;
