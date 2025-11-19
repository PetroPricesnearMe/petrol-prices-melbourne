/**
 * Slug Generation Utilities
 * 
 * Utilities for generating SEO-friendly slugs from station names and other text
 */

/**
 * Generate a URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a slug from station name and ID for unique identification
 */
export function generateStationSlug(name: string, id: string | number): string {
  const nameSlug = generateSlug(name);
  const idStr = id.toString();
  
  // Combine name and ID for uniqueness: "station-name-123"
  return `${nameSlug}-${idStr}`;
}

/**
 * Extract ID from a slug (reverse of generateStationSlug)
 */
export function extractIdFromSlug(slug: string): string | null {
  // Extract the last segment after the last hyphen (assuming it's the ID)
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  // Check if last part is numeric (ID)
  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }
  
  return null;
}

/**
 * Generate a slug from station data
 */
export function generateStationSlugFromData(station: {
  name: string;
  id: string | number;
  suburb?: string;
}): string {
  const nameSlug = generateSlug(station.name);
  const idStr = station.id.toString();
  
  // Optionally include suburb for better SEO: "station-name-suburb-123"
  if (station.suburb) {
    const suburbSlug = generateSlug(station.suburb);
    return `${nameSlug}-${suburbSlug}-${idStr}`;
  }
  
  return `${nameSlug}-${idStr}`;
}

/**
 * Normalize a slug (remove extra hyphens, ensure proper format)
 */
export function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

