/**
 * CMS Configuration & Validation
 *
 * Centralized configuration with environment variable validation
 */

import type { CMSProvider } from './types';

/**
 * CMS configuration schema
 */
export interface CMSConfigSchema {
  // Provider settings
  provider: CMSProvider;
  apiUrl: string;
  apiToken?: string;
  projectId?: string;
  dataset?: string;

  // Cache settings
  cacheEnabled: boolean;
  cacheTime: number; // seconds
  cacheMaxSize: number;
  staleWhileRevalidate: number; // seconds

  // Retry settings
  retryAttempts: number;
  retryDelay: number; // milliseconds
  retryMaxDelay: number; // milliseconds
  retryBackoffMultiplier: number;

  // Timeout settings
  timeout: number; // milliseconds

  // Feature flags
  enableCircuitBreaker: boolean;
  enableErrorReporting: boolean;
  enableDebugLogging: boolean;

  // Revalidation
  revalidationSecret?: string;
}

/**
 * Default configuration
 */
const defaultConfig: Partial<CMSConfigSchema> = {
  provider: 'baserow',
  cacheEnabled: true,
  cacheTime: 3600,
  cacheMaxSize: 1000,
  staleWhileRevalidate: 3600,
  retryAttempts: 3,
  retryDelay: 1000,
  retryMaxDelay: 10000,
  retryBackoffMultiplier: 2,
  timeout: 15000,
  enableCircuitBreaker: true,
  enableErrorReporting: true,
  enableDebugLogging: false,
};

/**
 * Validation errors
 */
export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public errors: string[]
  ) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

/**
 * Validate configuration
 */
function validateConfig(config: Partial<CMSConfigSchema>): string[] {
  const errors: string[] = [];

  // Required fields
  if (!config.provider) {
    errors.push('Provider is required');
  }

  if (!config.apiUrl) {
    errors.push('API URL is required');
  } else {
    try {
      new URL(config.apiUrl);
    } catch {
      errors.push('API URL must be a valid URL');
    }
  }

  // Provider-specific validation
  if (config.provider === 'airtable' && !config.projectId) {
    errors.push('Airtable requires projectId (Base ID)');
  }

  if (config.provider === 'sanity') {
    if (!config.projectId) {
      errors.push('Sanity requires projectId');
    }
    if (!config.dataset) {
      errors.push('Sanity requires dataset (e.g., "production")');
    }
  }

  // Numeric validations
  if (config.cacheTime !== undefined && config.cacheTime < 0) {
    errors.push('Cache time must be non-negative');
  }

  if (config.retryAttempts !== undefined && config.retryAttempts < 0) {
    errors.push('Retry attempts must be non-negative');
  }

  if (config.timeout !== undefined && config.timeout < 1000) {
    errors.push('Timeout must be at least 1000ms');
  }

  return errors;
}

/**
 * Load configuration from environment variables
 */
export function loadConfig(): CMSConfigSchema {
  const config: Partial<CMSConfigSchema> = {
    ...defaultConfig,

    // Provider settings
    provider:
      (process.env.CMS_PROVIDER as CMSProvider) || defaultConfig.provider,
    apiUrl: process.env.CMS_API_URL || process.env.BASEROW_API_URL || '',
    apiToken: process.env.CMS_API_TOKEN || process.env.BASEROW_API_TOKEN,
    projectId: process.env.CMS_PROJECT_ID,
    dataset: process.env.CMS_DATASET,

    // Cache settings
    cacheEnabled: process.env.CMS_CACHE_ENABLED !== 'false',
    cacheTime: parseInt(
      process.env.CMS_CACHE_TIME || String(defaultConfig.cacheTime)
    ),
    cacheMaxSize: parseInt(
      process.env.CMS_CACHE_MAX_SIZE || String(defaultConfig.cacheMaxSize)
    ),
    staleWhileRevalidate: parseInt(
      process.env.CMS_STALE_WHILE_REVALIDATE ||
        String(defaultConfig.staleWhileRevalidate)
    ),

    // Retry settings
    retryAttempts: parseInt(
      process.env.CMS_RETRY_ATTEMPTS || String(defaultConfig.retryAttempts)
    ),
    retryDelay: parseInt(
      process.env.CMS_RETRY_DELAY || String(defaultConfig.retryDelay)
    ),
    retryMaxDelay: parseInt(
      process.env.CMS_RETRY_MAX_DELAY || String(defaultConfig.retryMaxDelay)
    ),
    retryBackoffMultiplier: parseFloat(
      process.env.CMS_RETRY_BACKOFF_MULTIPLIER ||
        String(defaultConfig.retryBackoffMultiplier)
    ),

    // Timeout
    timeout: parseInt(process.env.CMS_TIMEOUT || String(defaultConfig.timeout)),

    // Feature flags
    enableCircuitBreaker: process.env.CMS_ENABLE_CIRCUIT_BREAKER !== 'false',
    enableErrorReporting: process.env.CMS_ENABLE_ERROR_REPORTING !== 'false',
    enableDebugLogging: process.env.CMS_ENABLE_DEBUG_LOGGING === 'true',

    // Revalidation
    revalidationSecret: process.env.REVALIDATION_SECRET,
  };

  // Validate configuration
  const errors = validateConfig(config);

  if (errors.length > 0) {
    throw new ConfigValidationError(
      `CMS configuration validation failed:\n- ${errors.join('\n- ')}`,
      errors
    );
  }

  return config as CMSConfigSchema;
}

/**
 * Get configuration with caching
 */
let cachedConfig: CMSConfigSchema | null = null;

export function getConfig(): CMSConfigSchema {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }

  return cachedConfig;
}

/**
 * Reset configuration (useful for testing)
 */
export function resetConfig(): void {
  cachedConfig = null;
}

/**
 * Log configuration (without sensitive data)
 */
export function logConfig(): void {
  const config = getConfig();

  const safeConfig = {
    provider: config.provider,
    apiUrl: config.apiUrl,
    hasApiToken: !!config.apiToken,
    projectId: config.projectId,
    dataset: config.dataset,
    cacheEnabled: config.cacheEnabled,
    cacheTime: config.cacheTime,
    retryAttempts: config.retryAttempts,
    enableCircuitBreaker: config.enableCircuitBreaker,
    enableErrorReporting: config.enableErrorReporting,
    enableDebugLogging: config.enableDebugLogging,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('CMS Configuration:', JSON.stringify(safeConfig, null, 2));
  }
}

/**
 * Verify configuration is valid
 */
export function verifyConfig(): boolean {
  try {
    getConfig();
    return true;
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error('Configuration validation failed:');
      error.errors.forEach((err) => console.error(`  - ${err}`));
    } else {
      console.error('Unexpected error during configuration validation:', error);
    }
    return false;
  }
}
