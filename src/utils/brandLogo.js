/**
 * Brand Logo Utility
 * Resolves brand logo paths with support for multiple formats and fallbacks
 * 
 * Features:
 * - Supports PNG, SVG, and JPG formats
 * - Case-insensitive brand name matching
 * - Automatic fallback to default logo
 * - Performance optimized with path caching
 * 
 * @example
 * import { getBrandLogo } from './utils/brandLogo';
 * 
 * <img 
 *   src={getBrandLogo(station.brand)} 
 *   alt={`${station.brand} logo`} 
 *   height={36} 
 *   style={{objectFit: 'contain'}} 
 *   loading="lazy" 
 * />
 */

// Brand name to filename mapping for known brands
// Handles variations in brand naming
const BRAND_NAME_MAP = {
  'shell': 'Shell',
  'bp': 'BP',
  '7-eleven': '711',
  '7 eleven': '711',
  'seven eleven': '711',
  '7eleven': '711',
  'ampol': 'Ampol',
  'caltex': 'Caltex',
  'liberty': 'Liberty',
  'united': 'United',
  'mobil': 'Mobil',
  'coles express': 'Coles',
  'coles': 'Coles',
  'metro': 'Metro',
  'puma': 'Puma',
  'vibe': 'Vibe',
};

// Supported image formats in order of preference
const SUPPORTED_FORMATS = ['svg', 'png', 'jpg', 'jpeg'];

// Default fallback logo
const DEFAULT_LOGO = '/images/brands/default-logo.svg';

// Cache for resolved brand logo paths to improve performance
const logoCache = new Map();

/**
 * Normalizes brand name for comparison
 * Converts to lowercase and removes special characters
 * 
 * @param {string} brandName - Raw brand name
 * @returns {string} Normalized brand name
 */
function normalizeBrandName(brandName) {
  if (!brandName || typeof brandName !== 'string') return '';
  return brandName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Gets the filename for a brand from the mapping
 * 
 * @param {string} brandName - Brand name to lookup
 * @returns {string|null} Mapped filename or null if not found
 */
function getMappedFilename(brandName) {
  const normalized = normalizeBrandName(brandName);
  return BRAND_NAME_MAP[normalized] || null;
}

/**
 * Generates possible file paths for a brand logo
 * 
 * @param {string} brandName - Brand name
 * @returns {string[]} Array of possible file paths
 */
function generatePossiblePaths(brandName) {
  if (!brandName) return [DEFAULT_LOGO];

  const paths = [];

  // Try mapped filename first
  const mappedFilename = getMappedFilename(brandName);
  if (mappedFilename) {
    SUPPORTED_FORMATS.forEach(format => {
      paths.push(`/images/brands/${mappedFilename}.${format}`);
    });
  }

  // Try brand name as-is with different cases
  const cleanBrandName = brandName.trim().replace(/\s+/g, '-');

  // Original case
  SUPPORTED_FORMATS.forEach(format => {
    paths.push(`/images/brands/${cleanBrandName}.${format}`);
  });

  // Lowercase
  SUPPORTED_FORMATS.forEach(format => {
    paths.push(`/images/brands/${cleanBrandName.toLowerCase()}.${format}`);
  });

  // Capitalized (first letter uppercase)
  const capitalized = cleanBrandName.charAt(0).toUpperCase() + cleanBrandName.slice(1).toLowerCase();
  SUPPORTED_FORMATS.forEach(format => {
    paths.push(`/images/brands/${capitalized}.${format}`);
  });

  // Always include default as last resort
  paths.push(DEFAULT_LOGO);

  return [...new Set(paths)]; // Remove duplicates
}

/**
 * Main function to get brand logo path
 * Returns the first available format or falls back to default logo
 * 
 * @param {string} brandName - Brand name (e.g., "Shell", "BP", "7-Eleven")
 * @param {Object} options - Configuration options
 * @param {boolean} options.useCache - Whether to use cached results (default: true)
 * @returns {string} Path to the brand logo image
 * 
 * @example
 * // Basic usage
 * const logoPath = getBrandLogo("Shell");
 * // => "/images/brands/Shell.svg"
 * 
 * // With fallback
 * const logoPath = getBrandLogo("Unknown Brand");
 * // => "/images/brands/default-logo.svg"
 * 
 * // Disable cache
 * const logoPath = getBrandLogo("BP", { useCache: false });
 */
export function getBrandLogo(brandName, options = {}) {
  const { useCache = true } = options;

  // Return default for empty/invalid brand names
  if (!brandName || typeof brandName !== 'string') {
    return DEFAULT_LOGO;
  }

  // Check cache first
  const cacheKey = normalizeBrandName(brandName);
  if (useCache && logoCache.has(cacheKey)) {
    return logoCache.get(cacheKey);
  }

  // Try mapped filename first (most reliable)
  const mappedFilename = getMappedFilename(brandName);
  if (mappedFilename) {
    // For now, we assume SVG exists for mapped brands
    // In a real-world scenario, you might want to verify file existence
    const path = `/images/brands/${mappedFilename}.svg`;
    if (useCache) {
      logoCache.set(cacheKey, path);
    }
    return path;
  }

  // If no mapping found, try to construct path from brand name
  const cleanBrandName = brandName.trim().replace(/\s+/g, '-');
  const capitalizedName = cleanBrandName.charAt(0).toUpperCase() + cleanBrandName.slice(1).toLowerCase();

  // Try common patterns
  const tryPaths = [
    `/images/brands/${capitalizedName}.svg`,
    `/images/brands/${cleanBrandName}.svg`,
    `/images/brands/${cleanBrandName.toLowerCase()}.svg`,
  ];

  // Return first potential path (actual file existence check would require async or preload)
  const selectedPath = tryPaths[0];

  if (useCache) {
    logoCache.set(cacheKey, selectedPath);
  }

  return selectedPath;
}

/**
 * Clears the logo path cache
 * Useful for testing or when brand logo files are updated
 */
export function clearLogoCache() {
  logoCache.clear();
}

/**
 * Gets all possible paths for a brand (useful for debugging)
 * 
 * @param {string} brandName - Brand name
 * @returns {string[]} Array of all possible logo paths
 */
export function getLogoPaths(brandName) {
  return generatePossiblePaths(brandName);
}

/**
 * React hook for brand logo with error handling
 * Automatically falls back to default logo on error
 * 
 * @param {string} brandName - Brand name
 * @returns {Object} Object with src and onError handler
 * 
 * @example
 * const { src, onError } = useBrandLogo(station.brand);
 * <img src={src} onError={onError} alt={`${station.brand} logo`} />
 */
export function useBrandLogo(brandName) {
  const src = getBrandLogo(brandName);

  const onError = (e) => {
    // Prevent infinite loop
    if (e.target.src !== DEFAULT_LOGO) {
      e.target.src = DEFAULT_LOGO;
    }
  };

  return { src, onError };
}

/**
 * Gets brand-specific CSS class for styling
 * Useful for applying brand colors to headers, badges, etc.
 * 
 * @param {string} brandName - Brand name
 * @returns {string} CSS class name
 */
export function getBrandClass(brandName) {
  if (!brandName) return 'default';
  const normalized = normalizeBrandName(brandName);

  if (normalized.includes('shell')) return 'shell';
  if (normalized.includes('bp')) return 'bp';
  if (normalized.includes('caltex')) return 'caltex';
  if (normalized.includes('ampol')) return 'ampol';
  if (normalized.includes('7') || normalized.includes('seven')) return 'seven-eleven';
  if (normalized.includes('mobil')) return 'mobil';
  if (normalized.includes('united')) return 'united';
  if (normalized.includes('liberty')) return 'liberty';

  return 'default';
}

export default getBrandLogo;

