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

  // List Schemas
  getItemListSchema,

  // FAQ Schema
  getFAQSchema as getFAQPageSchema,

  // Article Schema
  getArticleSchema,

  // Breadcrumb Schema
  getBreadcrumbSchema as getBreadcrumbListSchema,

  // Utility Functions
  combineSchemas,
  toJsonLd,
} from './structured-data';

// Additional helper functions for complete page schemas
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getGasStationSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  getArticleSchema,
  getItemListSchema,
} from './structured-data';

import type { Station, FuelPrice } from '@/types/station';

/**
 * Generate all schemas for station detail page
 */
export function generateStationPageSchemas(station: Station) {
  return [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getGasStationSchema(station as Station & { fuelPrices?: FuelPrice[] }),
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Directory', url: '/directory' },
      { name: station.name, url: `/stations/${station.id}` },
    ]),
  ];
}

/**
 * Generate all schemas for directory page
 */
export function generateDirectoryPageSchemas(
  stations: Station[],
  suburb?: string
) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Directory', url: '/directory' },
  ];

  if (suburb) {
    breadcrumbs.push({
      name: suburb,
      url: `/directory/${suburb.toLowerCase()}`,
    });
  }

  return [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getItemListSchema(stations),
    getBreadcrumbSchema(breadcrumbs),
  ];
}

/**
 * Generate all schemas for home page
 */
export function generateHomePageSchemas() {
  return [getOrganizationSchema(), getWebSiteSchema()];
}

/**
 * Generate all schemas for FAQ page
 */
export function generateFAQPageSchemas(
  faqs: Array<{ question: string; answer: string }>
) {
  return [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getFAQSchema(faqs),
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'FAQ', url: '/faq' },
    ]),
  ];
}

/**
 * Generate all schemas for blog post page
 */
export function generateBlogPostSchemas(article: {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  slug: string;
  keywords?: string[];
}) {
  return [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getArticleSchema({
      ...article,
      url: `/blog/${article.slug}`,
    }),
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: article.title, url: `/blog/${article.slug}` },
    ]),
  ];
}
