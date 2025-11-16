/**
 * Dynamic Sitemap Generator
 *
 * Generates comprehensive sitemap including static and dynamic routes
 * Optimized for mobile-first indexing
 */

import type { MetadataRoute } from 'next';

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';

/**
 * Fetch dynamic station routes
 * Fetches all stations from the API or data source
 */
async function getStationUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    // Try to fetch from API first
    try {
      const response = await fetch(`${baseUrl}/api/stations`, {
        next: { revalidate: 3600 }, // Revalidate every hour
      });
      
      if (response.ok) {
        const stations = await response.json();
        if (Array.isArray(stations) && stations.length > 0) {
          return stations.map((station: any) => ({
            url: `${baseUrl}/stations/${station.id}`,
            lastModified: station.lastUpdated 
              ? new Date(station.lastUpdated) 
              : new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
          }));
        }
      }
    } catch (apiError) {
      console.warn('API fetch failed, trying local data:', apiError);
    }

    // Fallback to local data if API fails
    try {
      const stationsData = await import('@/data/stations.json');
      const stations = stationsData.default || stationsData;
      
      if (Array.isArray(stations) && stations.length > 0) {
        return stations.slice(0, 1000).map((station: any) => ({
          url: `${baseUrl}/stations/${station.id || station.name?.toLowerCase().replace(/\s+/g, '-')}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        }));
      }
    } catch (localError) {
      console.warn('Local data fetch failed:', localError);
    }

    return [];
  } catch (error) {
    console.error('Error fetching station URLs for sitemap:', error);
    return [];
  }
}

/**
 * Get suburb directory URLs
 */
async function getSuburbUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    // Try to fetch metadata
    try {
      const metadata = await import('@/data/stations-metadata.json');
      const metadataData = metadata.default || metadata;

      if (metadataData?.stats?.bySuburb) {
        const bySuburb = metadataData.stats.bySuburb as Record<string, number>;

        const suburbs = Object.keys(bySuburb)
          .sort((a, b) => (bySuburb[b] || 0) - (bySuburb[a] || 0))
          .slice(0, 200); // Top 200 suburbs

        return suburbs.map((suburb) => ({
          url: `${baseUrl}/directory/${suburb.toLowerCase().replace(/\s+/g, '-')}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }));
      }
    } catch (error) {
      console.warn('Could not fetch suburb metadata:', error);
    }

    return [];
  } catch (error) {
    console.error('Error fetching suburb URLs for sitemap:', error);
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
      url: `${baseUrl}/map`,
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
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Fetch dynamic routes
  const [stationUrls, suburbUrls, blogUrls] = await Promise.all([
    getStationUrls(),
    getSuburbUrls(),
    getBlogUrls(),
  ]);

  // Combine all routes
  return [...staticRoutes, ...suburbUrls, ...stationUrls, ...blogUrls];
}
