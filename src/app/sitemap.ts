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
  const isProduction = process.env.NODE_ENV === 'production';

  // Reject localhost URLs in production
  if (envUrl && envUrl.includes('localhost')) {
    // Only warn in production - localhost is expected in development
    if (isProduction) {
      console.warn(
        'Warning: NEXT_PUBLIC_APP_URL contains localhost, using production URL instead'
      );
    }
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
          console.warn(
            `Warning: Skipping station ${station.id} - URL contains localhost`
          );
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
          console.warn(
            `Warning: Skipping suburb ${suburb} - URL contains localhost`
          );
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
 * Get location/suburb URLs for SEO pages
 * Includes all SEO suburbs from comprehensive list
 */
async function getLocationUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getAllSuburbSlugs } = await import('@/data/melbourne-suburbs');
    const suburbSlugs = getAllSuburbSlugs();

    return suburbSlugs
      .map((suburb) => {
        const url = `${baseUrl}/locations/${suburb}`;
        // Validate URL doesn't contain localhost
        if (url.includes('localhost')) {
          console.warn(
            `Warning: Skipping location ${suburb} - URL contains localhost`
          );
          return null;
        }
        return {
          url,
          lastModified: new Date(),
          changeFrequency: 'hourly' as const,
          priority: 0.9, // Very high priority for SEO location pages
        };
      })
      .filter((entry): entry is MetadataRoute.Sitemap[0] => entry !== null);
  } catch (error) {
    console.error('Error fetching location URLs for sitemap:', error);
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
        console.warn(
          `Warning: Skipping region ${region} - URL contains localhost`
        );
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
          console.warn(
            `Warning: Skipping brand ${brand} - URL contains localhost`
          );
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

/**
 * Get fuel type URLs
 * Includes individual fuel type pages (unleaded, diesel, premium, e10, etc.)
 */
async function getFuelTypeUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    // Standard fuel types available in Melbourne
    const fuelTypes = [
      { slug: 'unleaded', name: 'Unleaded 91', priority: 0.8 },
      { slug: 'premium', name: 'Premium 95/98', priority: 0.75 },
      { slug: 'diesel', name: 'Diesel', priority: 0.8 },
      { slug: 'e10', name: 'E10 Ethanol', priority: 0.7 },
      { slug: 'e85', name: 'E85 Flex Fuel', priority: 0.65 },
      { slug: 'lpg', name: 'LPG', priority: 0.7 },
      { slug: 'premium-diesel', name: 'Premium Diesel', priority: 0.7 },
    ];

    return fuelTypes
      .map((fuelType) => {
        const url = `${baseUrl}/fuel-types/${fuelType.slug}`;
        // Validate URL doesn't contain localhost
        if (url.includes('localhost')) {
          console.warn(
            `Warning: Skipping fuel type ${fuelType.slug} - URL contains localhost`
          );
          return null;
        }
        return {
          url,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: fuelType.priority,
        };
      })
      .filter((entry): entry is MetadataRoute.Sitemap[0] => entry !== null);
  } catch (error) {
    console.error('Error generating fuel type URLs for sitemap:', error);
    return [];
  }
}

/**
 * Get suburb + fuel type URLs
 * Generates URLs like /melbourne/coburg/unleaded, /melbourne/epping/diesel
 */
async function getSuburbFuelTypeUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getAllStations } = await import('@/lib/data/stations');
    const stations = await getAllStations();

    const FUEL_TYPES = ['unleaded', 'diesel', 'premium', 'e10'];
    const suburbMap = new Map<string, number>();

    // Get unique suburbs
    stations.forEach((station) => {
      if (station.suburb) {
        const suburbSlug = station.suburb.toLowerCase().replace(/\s+/g, '-');
        suburbMap.set(suburbSlug, (suburbMap.get(suburbSlug) || 0) + 1);
      }
    });

    const urls: MetadataRoute.Sitemap = [];

    // Generate suburb x fuel type combinations (limit to top 50 suburbs)
    const topSuburbs = Array.from(suburbMap.keys()).slice(0, 50);
    for (const suburb of topSuburbs) {
      for (const fuelType of FUEL_TYPES) {
        const url = `${baseUrl}/melbourne/${suburb}/${fuelType}`;
        if (!url.includes('localhost')) {
          urls.push({
            url,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.85,
          });
        }
      }
    }

    return urls;
  } catch (error) {
    console.error('Error fetching suburb fuel type URLs for sitemap:', error);
    return [];
  }
}

/**
 * Get brand + suburb URLs
 * Generates URLs like /servo/caltex-coburg, /servo/bp-epping
 */
async function getBrandSuburbUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getAllStations } = await import('@/lib/data/stations');
    const stations = await getAllStations();

    const combinations = new Set<string>();

    stations.forEach((station) => {
      if (station.brand && station.suburb) {
        const brandSlug = station.brand.toLowerCase().replace(/\s+/g, '-');
        const suburbSlug = station.suburb.toLowerCase().replace(/\s+/g, '-');
        combinations.add(`${brandSlug}-${suburbSlug}`);
      }
    });

    // Limit to top 100 brand-suburb combinations
    return Array.from(combinations)
      .slice(0, 100)
      .map((slug) => {
        const url = `${baseUrl}/servo/${slug}`;
        return {
          url,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        };
      })
      .filter((entry) => !entry.url.includes('localhost'));
  } catch (error) {
    console.error('Error fetching brand suburb URLs for sitemap:', error);
    return [];
  }
}

/**
 * Get "today's prices" suburb URLs
 * Generates URLs like /suburb/fuel-prices-coburg-today
 */
async function getSuburbTodayUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getAllStations } = await import('@/lib/data/stations');
    const stations = await getAllStations();

    const suburbMap = new Map<string, number>();

    stations.forEach((station) => {
      if (station.suburb) {
        const suburbSlug = station.suburb.toLowerCase().replace(/\s+/g, '-');
        suburbMap.set(suburbSlug, (suburbMap.get(suburbSlug) || 0) + 1);
      }
    });

    // Limit to top 75 suburbs for "today" pages
    return Array.from(suburbMap.keys())
      .slice(0, 75)
      .map((suburb) => {
        const url = `${baseUrl}/suburb/fuel-prices-${suburb}-today`;
        return {
          url,
          lastModified: new Date(),
          changeFrequency: 'hourly' as const,
          priority: 0.9,
        };
      })
      .filter((entry) => !entry.url.includes('localhost'));
  } catch (error) {
    console.error('Error fetching suburb today URLs for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Validate baseUrl is not localhost
  if (baseUrl.includes('localhost')) {
    console.error(
      'Error: baseUrl contains localhost. Sitemap generation aborted.'
    );
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
      url: `${baseUrl}/map`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
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
  ].filter((route) => {
    // Filter out any routes with localhost
    if (route.url.includes('localhost')) {
      console.warn(
        `Warning: Excluding route ${route.url} - contains localhost`
      );
      return false;
    }
    return true;
  });

  // Fetch dynamic routes
  const [
    stationUrls,
    directoryUrls,
    locationUrls,
    regionUrls,
    brandUrls,
    fuelTypeUrls,
    suburbFuelTypeUrls,
    brandSuburbUrls,
    suburbTodayUrls,
  ] = await Promise.all([
    getStationUrls(),
    getDirectoryUrls(),
    getLocationUrls(),
    getRegionUrls(),
    getFuelBrandUrls(),
    getFuelTypeUrls(),
    getSuburbFuelTypeUrls(),
    getBrandSuburbUrls(),
    getSuburbTodayUrls(),
  ]);

  // Combine all routes and filter out any localhost URLs
  const allRoutes = [
    ...staticRoutes,
    ...locationUrls, // SEO location pages (high priority)
    ...directoryUrls,
    ...regionUrls,
    ...brandUrls,
    ...fuelTypeUrls,
    ...suburbFuelTypeUrls,
    ...brandSuburbUrls,
    ...suburbTodayUrls,
    ...stationUrls,
  ];

  // Final validation - remove any localhost URLs that might have slipped through
  return allRoutes.filter((route) => {
    if (route.url.includes('localhost')) {
      console.warn(
        `Warning: Final filter removing route ${route.url} - contains localhost`
      );
      return false;
    }
    return true;
  });
}
