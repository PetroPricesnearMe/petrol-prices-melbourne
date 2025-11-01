/**
 * Dynamic Sitemap Generator
 *
 * Generates comprehensive sitemap including static and dynamic routes
 * Optimized for mobile-first indexing
 */

import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';

/**
 * Fetch dynamic station routes
 * In production, this should fetch from your database
 */
async function getStationUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    // TODO: Fetch actual stations from API
    // const stations = await fetch(`${baseUrl}/api/stations`).then(r => r.json());

    // For now, return empty array
    // Replace with actual station IDs when API is ready
    return [];

    // Example implementation:
    // return stations.map((station: any) => ({
    //   url: `${baseUrl}/stations/${station.id}`,
    //   lastModified: station.lastUpdated || new Date(),
    //   changeFrequency: 'daily' as const,
    //   priority: 0.7,
    // }));
  } catch (error) {
    console.error('Error fetching station URLs for sitemap:', error);
    return [];
  }
}

/**
 * Get blog post URLs
 */
async function getBlogUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    // TODO: Fetch actual blog posts when implemented
    return [];
  } catch (error) {
    console.error('Error fetching blog URLs for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fuel-price-trends`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/station-amenities`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/how-pricing-works`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Fetch dynamic routes
  const [stationUrls, blogUrls] = await Promise.all([
    getStationUrls(),
    getBlogUrls(),
  ]);

  // Combine all routes
  return [...staticRoutes, ...stationUrls, ...blogUrls];
}
