/**
 * Configuration - Central Export
 * 
 * All configuration files in one place for easy importing.
 * 
 * @example
 * ```typescript
 * import { siteConfig, env, routes } from '@/config';
 * ```
 * 
 * @module config
 */

// ========================================
// METADATA & SEO
// ========================================

export * from './metadata';
export {
  siteConfig,
  defaultMetadata,
  generateMetadata,
  organizationSchema,
  websiteSchema,
} from './metadata';

// ========================================
// ENVIRONMENT VARIABLES
// ========================================

export * from './environment';
export { env } from './environment';

// ========================================
// CONSTANTS
// ========================================

export * from './constants';

// ========================================
// ROUTES
// ========================================

// TODO: Create routes.ts file
// export * from './routes';
// export { routes } from './routes';

// ========================================
// REGIONAL CONFIGURATION
// ========================================

export * from './regions';
export { regions } from './regions';

// ========================================
// FOOTER CONFIGURATION
// ========================================

export * from './footerConfig';

/**
 * Type exports for configuration objects
 */
export type { Metadata } from 'next';

