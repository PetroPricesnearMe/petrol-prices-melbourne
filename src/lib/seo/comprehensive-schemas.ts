/**
 * Re-export comprehensive schemas from structured-data.ts
 *
 * This file serves as an alias for backward compatibility and better naming.
 * All schema functions are available from this module.
 *
 * @module lib/seo/comprehensive-schemas
 */

export {
  // Organization & Website
  getOrganizationSchema,
  getWebSiteSchema,

  // Business Schemas
  getGasStationSchema,

  // Product Schemas
  getFuelProductSchema as generateFuelProductSchema,

  // List Schemas
  getStationListSchema as getItemListSchema,

  // FAQ Schema
  getFAQPageSchema,

  // Article Schema
  getArticleSchema,

  // Breadcrumb Schema
  getBreadcrumbListSchema,

  // Review Schema
  getReviewSchema,

  // Complete Page Schemas
  generateStationPageSchemas,
  generateDirectoryPageSchemas,
  generateHomePageSchemas,
  generateFAQPageSchemas,
  generateBlogPostSchemas,

  // Utility Functions
  combineSchemas,
  toJsonLd,
} from './structured-data';

// Re-export types if needed
export type {
  Organization,
  WebSite,
  LocalBusiness,
  BreadcrumbList,
  FAQPage,
} from './structured-data';
