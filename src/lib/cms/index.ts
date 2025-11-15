/**
 * Unified CMS Client
 *
 * Factory pattern for creating CMS provider instances
 * Supports multiple CMS backends with a unified interface
 */

import { CMSConfig, ICMSProvider } from './types';
import { BaserowProvider } from './providers/baserow';
import { SanityProvider } from './providers/sanity';
import { AirtableProvider } from './providers/airtable';

// Re-export types for convenience
export * from './types';
export { getCMSCache, generateCacheKey } from './cache';
export {
  createCMSError,
  parseCMSError,
  retryWithBackoff,
  withTimeout,
  withFallback,
  CircuitBreaker,
} from './error-handler';

/**
 * Create a CMS provider instance
 */
export function createCMSProvider(config: CMSConfig): ICMSProvider {
  switch (config.provider) {
    case 'baserow':
      return new BaserowProvider(config);

    case 'sanity':
      return new SanityProvider(config);

    case 'airtable':
      return new AirtableProvider(config);

    case 'contentful':
      // Add Contentful provider if needed
      throw new Error('Contentful provider not yet implemented');

    case 'strapi':
      // Add Strapi provider if needed
      throw new Error('Strapi provider not yet implemented');

    default:
      throw new Error(`Unsupported CMS provider: ${config.provider}`);
  }
}

/**
 * Get CMS provider from environment variables
 */
export function getCMSProvider(): ICMSProvider {
  const provider = (process.env.CMS_PROVIDER ||
    'baserow') as CMSConfig['provider'];

  const config: CMSConfig = {
    provider,
    apiUrl: getRequiredEnv('CMS_API_URL'),
    apiToken: process.env.CMS_API_TOKEN,
    projectId: process.env.CMS_PROJECT_ID,
    dataset: process.env.CMS_DATASET,
    cacheTime: parseInt(process.env.CMS_CACHE_TIME || '3600'),
    retryAttempts: parseInt(process.env.CMS_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.CMS_RETRY_DELAY || '1000'),
  };

  return createCMSProvider(config);
}

/**
 * Get required environment variable
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

/**
 * Singleton CMS provider instance
 */
let cmsProviderInstance: ICMSProvider | null = null;

/**
 * Get or create singleton CMS provider
 */
export function getCMS(): ICMSProvider {
  if (!cmsProviderInstance) {
    cmsProviderInstance = getCMSProvider();
  }

  return cmsProviderInstance;
}

/**
 * Reset CMS provider (useful for testing)
 */
export function resetCMS(): void {
  cmsProviderInstance = null;
}
