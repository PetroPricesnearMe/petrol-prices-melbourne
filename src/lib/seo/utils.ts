/**
 * SEO Utility Functions
 *
 * Helper functions for SEO optimization
 * @module lib/seo/utils
 */

// ============================================================================
// Meta Tag Generators
// ============================================================================

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string, baseUrl?: string): string {
  const base =
    baseUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://petrolpricenearme.com.au';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Truncate text for meta description
 */
export function truncateDescription(
  text: string,
  maxLength: number = 160
): string {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`;
}

/**
 * Generate SEO-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, count: number = 10): string[] {
  // Remove common words
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'as',
    'is',
    'was',
    'are',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'should',
    'could',
    'may',
    'might',
    'can',
    'this',
    'that',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  // Count frequency
  const frequency = words.reduce(
    (acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Sort by frequency and return top N
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word);
}

// ============================================================================
// Social Media
// ============================================================================

/**
 * Generate social media share URLs
 */
export function getSocialShareUrls(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };
}

// ============================================================================
// Image Optimization
// ============================================================================

/**
 * Generate optimized image URL for social sharing
 */
export function getOptimizedImageUrl(
  imagePath: string,
  width: number = 1200,
  height: number = 630
): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';

  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If using Next.js Image optimization API
  return `${baseUrl}/_next/image?url=${encodeURIComponent(imagePath)}&w=${width}&h=${height}&q=75`;
}

// ============================================================================
// Robots Meta Tag
// ============================================================================

/**
 * Generate robots meta content
 */
export function getRobotsContent(options: {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
}): string {
  const {
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false,
    noimageindex = false,
    maxSnippet,
    maxImagePreview = 'large',
    maxVideoPreview,
  } = options;

  const parts: string[] = [];

  parts.push(index ? 'index' : 'noindex');
  parts.push(follow ? 'follow' : 'nofollow');

  if (noarchive) parts.push('noarchive');
  if (nosnippet) parts.push('nosnippet');
  if (noimageindex) parts.push('noimageindex');
  if (maxSnippet) parts.push(`max-snippet:${maxSnippet}`);
  if (maxImagePreview) parts.push(`max-image-preview:${maxImagePreview}`);
  if (maxVideoPreview) parts.push(`max-video-preview:${maxVideoPreview}`);

  return parts.join(', ');
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate metadata completeness
 */
export function validateMetadata(metadata: {
  title?: string;
  description?: string;
  keywords?: string[];
}): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check title
  if (!metadata.title) {
    warnings.push('Missing title');
  } else if (metadata.title.length < 30) {
    warnings.push('Title too short (< 30 chars)');
  } else if (metadata.title.length > 60) {
    warnings.push('Title too long (> 60 chars)');
  }

  // Check description
  if (!metadata.description) {
    warnings.push('Missing description');
  } else if (metadata.description.length < 120) {
    warnings.push('Description too short (< 120 chars)');
  } else if (metadata.description.length > 160) {
    warnings.push('Description too long (> 160 chars)');
  }

  // Check keywords
  if (!metadata.keywords || metadata.keywords.length === 0) {
    warnings.push('No keywords provided');
  } else if (metadata.keywords.length > 15) {
    warnings.push('Too many keywords (> 15)');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}

// ============================================================================
// Hreflang Helper
// ============================================================================

/**
 * Generate hreflang links for multi-language sites
 */
export function getHreflangLinks(
  currentPath: string,
  languages: Array<{ code: string; url: string }>
) {
  return languages.map((lang) => ({
    hrefLang: lang.code,
    href: `${lang.url}${currentPath}`,
  }));
}

// ============================================================================
// Sitemap Helpers
// ============================================================================

/**
 * Generate sitemap entry
 */
export function createSitemapEntry(
  url: string,
  options: {
    lastModified?: Date | string;
    changeFrequency?:
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never';
    priority?: number;
  } = {}
) {
  return {
    url,
    lastModified: options.lastModified || new Date(),
    changeFrequency: options.changeFrequency || 'weekly',
    priority: options.priority || 0.5,
  };
}

// ============================================================================
// Export All
// ============================================================================

export {
  getCanonicalUrl,
  truncateDescription,
  generateSlug,
  extractKeywords,
  getSocialShareUrls,
  getOptimizedImageUrl,
  getRobotsContent,
  validateMetadata,
  getHreflangLinks,
  createSitemapEntry,
};
