/**
 * Sitemap Generation Utilities
 * Dynamic sitemap generation for better SEO
 */

import type { MetadataRoute } from 'next';

import { BASE_URL } from './metadata';

export interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate sitemap for static pages
 */
export function generateStaticSitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    {
      url: '',
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: '/directory',
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: '/about',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: '/blog',
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: '/faq',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: '/contact',
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  return staticPages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

/**
 * Generate sitemap for dynamic pages (regions)
 */
export function generateRegionSitemap(regions: string[]): MetadataRoute.Sitemap {
  return regions.map((region) => ({
    url: `${BASE_URL}/directory?region=${region.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
}

/**
 * Generate sitemap for blog posts
 */
export function generateBlogSitemap(
  posts: Array<{
    slug: string;
    updatedAt?: string;
  }>
): MetadataRoute.Sitemap {
  return posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
}

/**
 * Generate complete sitemap
 */
export async function generateCompleteSitemap(): Promise<MetadataRoute.Sitemap> {
  const staticSitemap = generateStaticSitemap();

  // Add regions
  const regions = [
    'CBD',
    'North',
    'South',
    'East',
    'West',
    'South-East',
    'North-East',
    'North-West',
    'South-West',
  ];
  const regionSitemap = generateRegionSitemap(regions);

  // Combine all sitemaps
  return [...staticSitemap, ...regionSitemap];
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `# Robots.txt for ${BASE_URL}

# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-0.xml

# Crawl delay for respectful crawling
Crawl-delay: 1

# Specific bot rules
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Googlebot-Image
Allow: /images/

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2
`;
}

/**
 * Generate XML sitemap string
 */
export function generateXMLSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    ${entry.lastModified ? `<lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>` : ''}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

export default {
  generateStaticSitemap,
  generateRegionSitemap,
  generateBlogSitemap,
  generateCompleteSitemap,
  generateRobotsTxt,
  generateXMLSitemap,
};
