/**
 * Dynamic Sitemap Generator
 *
 * Generates comprehensive sitemap including static and dynamic routes
 * Optimized for mobile-first indexing
 */

import type { MetadataRoute } from 'next';

// Always use production URL - never localhost
const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  // Reject localhost URLs in production
  if (envUrl && envUrl.includes('localhost')) {
    console.warn('Warning: NEXT_PUBLIC_APP_URL contains localhost, using production URL instead');
    return 'https://petrolpricesnearme.com.au';
  }
  
  // Use environment variable if set and valid, otherwise use production URL
  return envUrl && !envUrl.includes('localhost') 
    ? envUrl 
    : 'https://petrolpricesnearme.com.au';
};

const baseUrl = getBaseUrl();

/**
 * Fetch dynamic station routes
 * Fetches actual stations from the data layer
 * Only includes stations with valid IDs and required data
 */
async function getStationUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getAllStations } = await import('@/lib/data/stations');
    const stations = await getAllStations();

    return stations
      .filter((station) => {
        // Only include stations with valid IDs and names
        return station.id && station.name && station.name.trim() !== '';
      })
      .map((station) => {
        const url = `${baseUrl}/stations/${station.id}`;
        // Validate URL doesn't contain localhost
        if (url.includes('localhost')) {
          console.warn(`Warning: Skipping station ${station.id} - URL contains localhost`);
          return null;
        }
        return {
          url,
          lastModified: station.lastUpdated 
            ? new Date(station.lastUpdated) 
            : new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8, // High priority for individual station pages
        };
      })
      .filter((entry): entry is MetadataRoute.Sitemap[0] => entry !== null);
  } catch (error) {
    console.error('Error fetching station URLs for sitemap:', error);
    return [];
  }
}

/**
 * Get directory/suburb URLs
 * Only include suburbs that have at least one station
 */
async function getDirectoryUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getAllStations } = await import('@/lib/data/stations');
    const stations = await getAllStations();

    // Get unique suburbs with station count
    const suburbMap = new Map<string, number>();
    stations.forEach((station) => {
      if (station.suburb) {
        const suburbSlug = station.suburb.toLowerCase().replace(/\s+/g, '-');
        const count = suburbMap.get(suburbSlug) || 0;
        suburbMap.set(suburbSlug, count + 1);
      }
    });

    // Only include suburbs that have stations
    return Array.from(suburbMap.entries())
      .filter(([_, count]) => count > 0) // Only suburbs with stations
      .map(([suburb]) => {
        const url = `${baseUrl}/directory/${suburb}`;
        // Validate URL doesn't contain localhost
        if (url.includes('localhost')) {
          console.warn(`Warning: Skipping suburb ${suburb} - URL contains localhost`);
          return null;
        }
        return {
          url,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.85, // High priority for directory pages
        };
      })
      .filter((entry): entry is MetadataRoute.Sitemap[0] => entry !== null);
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

  return regions
    .map((region) => {
      const url = `${baseUrl}/regions/${region}`;
      // Validate URL doesn't contain localhost
      if (url.includes('localhost')) {
        console.warn(`Warning: Skipping region ${region} - URL contains localhost`);
        return null;
      }
      return {
        url,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.85,
      };
    })
    .filter((entry): entry is MetadataRoute.Sitemap[0] => entry !== null);
}

/**
 * Get fuel brand URLs
 * Only include brands that have at least one station
 */
async function getFuelBrandUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getAllStations } = await import('@/lib/data/stations');
    const stations = await getAllStations();

    // Get unique brands with station count
    const brandMap = new Map<string, number>();
    stations.forEach((station) => {
      if (station.brand) {
        const brandSlug = station.brand.toLowerCase().replace(/\s+/g, '-');
        const count = brandMap.get(brandSlug) || 0;
        brandMap.set(brandSlug, count + 1);
      }
    });

    // Only include brands that have stations
    return Array.from(brandMap.entries())
      .filter(([_, count]) => count > 0) // Only brands with stations
      .map(([brand]) => {
        const url = `${baseUrl}/fuel-brands/${brand}`;
        // Validate URL doesn't contain localhost
        if (url.includes('localhost')) {
          console.warn(`Warning: Skipping brand ${brand} - URL contains localhost`);
          return null;
        }
        return {
          url,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        };
      })
      .filter((entry): entry is MetadataRoute.Sitemap[0] => entry !== null);
  } catch (error) {
    console.error('Error fetching fuel brand URLs for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Validate baseUrl is not localhost
  if (baseUrl.includes('localhost')) {
    console.error('Error: baseUrl contains localhost. Sitemap generation aborted.');
    return [];
  }

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
  ].filter((route) => {
    // Filter out any routes with localhost
    if (route.url.includes('localhost')) {
      console.warn(`Warning: Excluding route ${route.url} - contains localhost`);
      return false;
    }
    return true;
  });

  // Fetch dynamic routes
  const [stationUrls, directoryUrls, regionUrls, brandUrls] = await Promise.all([
    getStationUrls(),
    getDirectoryUrls(),
    getRegionUrls(),
    getFuelBrandUrls(),
  ]);

  // Combine all routes and filter out any localhost URLs
  const allRoutes = [
    ...staticRoutes,
    ...directoryUrls,
    ...regionUrls,
    ...brandUrls,
    ...stationUrls,
  ];

  // Final validation - remove any localhost URLs that might have slipped through
  return allRoutes.filter((route) => {
    if (route.url.includes('localhost')) {
      console.warn(`Warning: Final filter removing route ${route.url} - contains localhost`);
      return false;
    }
    return true;
  });
}
