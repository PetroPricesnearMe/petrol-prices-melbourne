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
 * Fetches actual stations from the data layer
 */
async function getStationUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getAllStations } = await import('@/lib/data/stations');
    const stations = await getAllStations();

    return stations
      .filter((station) => station.id) // Only include stations with IDs
      .map((station) => ({
        url: `${baseUrl}/stations/${station.id}`,
        lastModified: station.lastUpdated 
          ? new Date(station.lastUpdated) 
          : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8, // High priority for individual station pages
      }));
  } catch (error) {
    console.error('Error fetching station URLs for sitemap:', error);
    return [];
  }
}

/**
 * Get directory/suburb URLs
 */
async function getDirectoryUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getAllStations } = await import('@/lib/data/stations');
    const stations = await getAllStations();

    // Get unique suburbs
    const suburbs = new Set<string>();
    stations.forEach((station) => {
      if (station.suburb) {
        const suburbSlug = station.suburb.toLowerCase().replace(/\s+/g, '-');
        suburbs.add(suburbSlug);
      }
    });

    return Array.from(suburbs).map((suburb) => ({
      url: `${baseUrl}/directory/${suburb}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85, // High priority for directory pages
    }));
  } catch (error) {
    console.error('Error fetching directory URLs for sitemap:', error);
    return [];
  }
}

/**
 * Get region URLs
 */
async function getRegionUrls(): Promise<MetadataRoute.Sitemap> {
  const regions = [
    'north-melbourne',
    'south-melbourne',
    'east-melbourne',
    'west-melbourne',
    'cbd',
    'inner-east',
    'inner-west',
    'outer-east',
    'outer-west',
    'north-east',
    'south-east',
  ];

  return regions.map((region) => ({
    url: `${baseUrl}/regions/${region}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));
}

/**
 * Get fuel brand URLs
 */
async function getFuelBrandUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getAllStations } = await import('@/lib/data/stations');
    const stations = await getAllStations();

    // Get unique brands
    const brands = new Set<string>();
    stations.forEach((station) => {
      if (station.brand) {
        const brandSlug = station.brand.toLowerCase().replace(/\s+/g, '-');
        brands.add(brandSlug);
      }
    });

    return Array.from(brands).map((brand) => ({
      url: `${baseUrl}/fuel-brands/${brand}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));
  } catch (error) {
    console.error('Error fetching fuel brand URLs for sitemap:', error);
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
      url: `${baseUrl}/fuel-brands`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/fuel-types`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Fetch dynamic routes
  const [stationUrls, directoryUrls, regionUrls, brandUrls] = await Promise.all([
    getStationUrls(),
    getDirectoryUrls(),
    getRegionUrls(),
    getFuelBrandUrls(),
  ]);

  // Combine all routes
  return [
    ...staticRoutes,
    ...directoryUrls,
    ...regionUrls,
    ...brandUrls,
    ...stationUrls,
  ];
}
