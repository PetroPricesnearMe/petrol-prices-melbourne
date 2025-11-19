/**
 * Canonical URL Utilities
 * 
 * Utilities for generating canonical URLs for SEO
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';

/**
 * Generate canonical URL for a page
 */
export function generateCanonicalUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}/${cleanPath}`;
}

/**
 * Generate canonical URL for station detail page
 */
export function generateStationCanonicalUrl(idOrSlug: string): string {
  return generateCanonicalUrl(`stations/${idOrSlug}`);
}

/**
 * Generate canonical URL for listing detail page
 */
export function generateListingCanonicalUrl(slug: string): string {
  return generateCanonicalUrl(`listings/${slug}`);
}

/**
 * Generate canonical URL for directory page
 */
export function generateDirectoryCanonicalUrl(suburb?: string): string {
  if (suburb) {
    return generateCanonicalUrl(`directory/${suburb}`);
  }
  return generateCanonicalUrl('directory');
}

/**
 * Generate canonical URL for region page
 */
export function generateRegionCanonicalUrl(region: string): string {
  return generateCanonicalUrl(`regions/${region}`);
}

/**
 * Get base URL for the application
 */
export function getBaseUrl(): string {
  return BASE_URL;
}

