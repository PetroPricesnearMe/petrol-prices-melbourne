/**
 * next-sitemap Configuration
 * Automatically generates sitemap.xml and robots.txt
 *
 * @see https://github.com/iamvishnusankar/next-sitemap
 */

/** @type {import('next-sitemap').IConfig} */
// Always use production URL - never localhost
const getSiteUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  // Reject localhost URLs
  if (envUrl && envUrl.includes('localhost')) {
    console.warn('Warning: NEXT_PUBLIC_APP_URL contains localhost, using production URL instead');
    return 'https://petrolpricesnearme.com.au';
  }
  
  // Use environment variable if set and valid, otherwise use production URL
  return envUrl && !envUrl.includes('localhost') 
    ? envUrl 
    : 'https://petrolpricesnearme.com.au';
};

module.exports = {
  siteUrl: getSiteUrl(),
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  outDir: './public',

  // Exclude patterns - admin, API, static assets, and non-indexable pages
  exclude: [
    '/api/*',           // API routes
    '/_next/*',         // Next.js internal files
    '/admin/*',         // Admin pages
    '/auth/*',          // Authentication pages
    '/private/*',       // Private pages
    '/server-sitemap.xml',
    '/server-sitemap-index.xml',
    '/hero-example',    // Demo pages
    '/map-demo',        // Demo pages
    '/test/*',          // Test pages
    '/debug/*',         // Debug pages
    '/*.json',          // JSON files
    '/*.xml',           // XML files (except sitemap)
    '/favicon.ico',     // Favicon
    '/robots.txt',      // Robots.txt (handled separately)
    '/*?*',             // Exclude all URLs with query parameters (filters, search, pagination)
    '/404',             // Error pages
    '/500',
    '/_error',
  ],

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/auth/',
          '/private/',
          '/hero-example',
          '/map-demo',
          '/*?sort=*', // Noindex sort parameters
          '/*?filter=*', // Noindex filter parameters
          '/*?filters=*', // Noindex filters parameters
          '/*?page=*', // Noindex pagination parameters (except page 1)
          '/*?search=*', // Noindex search parameters
          '/*?q=*', // Noindex query parameters
          '/*?s=*', // Noindex search variant
          '/*?category=*', // Noindex category filters
          '/*?brand=*', // Noindex brand filters
          '/*?fuel=*', // Noindex fuel type filters
          '/*?amenity=*', // Noindex amenity filters
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/hero-example', '/map-demo'],
        crawlDelay: 0.5,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/hero-example', '/map-demo'],
        crawlDelay: 1,
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'], // Block AI scrapers if desired
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'], // Block Common Crawl
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricesnearme.com.au'}/server-sitemap.xml`,
    ],
  },

  // Transform function to customize each URL entry
  transform: async (config, path) => {
    // Default values
    let priority = config.priority;
    let changefreq = config.changefreq;

    // Homepage - highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }

    // Directory pages - high priority (station listings)
    else if (path === '/directory' || path.startsWith('/directory/')) {
      priority = 0.9;
      changefreq = 'hourly';
    }

    // Map page - high priority
    else if (path === '/map') {
      priority = 0.85;
      changefreq = 'hourly';
    }

    // Fuel type pages - high priority
    else if (path === '/fuel-types' || path.startsWith('/fuel-types/')) {
      priority = path === '/fuel-types' ? 0.7 : 0.75;
      changefreq = 'daily';
    }

    // Fuel brand pages - high priority
    else if (path === '/fuel-brands' || path.startsWith('/fuel-brands/')) {
      priority = path === '/fuel-brands' ? 0.7 : 0.75;
      changefreq = 'weekly';
    }

    // Region pages - high priority
    else if (path.startsWith('/regions/')) {
      priority = 0.85;
      changefreq = 'daily';
    }

    // Station detail pages - high priority
    else if (path.startsWith('/stations/')) {
      priority = 0.8;
      changefreq = 'daily';
    }

    // Fuel trends - high priority
    else if (path === '/fuel-price-trends') {
      priority = 0.8;
      changefreq = 'daily';
    }

    // Station amenities
    else if (path === '/station-amenities') {
      priority = 0.7;
      changefreq = 'weekly';
    }

    // FAQ and How it works
    else if (path === '/faq' || path === '/how-pricing-works') {
      priority = 0.6;
      changefreq = 'monthly';
    }

    // About and Blog
    else if (path === '/about' || path === '/blog') {
      priority = 0.5;
      changefreq = 'monthly';
    }

    // Exclude URLs with query parameters (filters, search, pagination)
    if (path.includes('?')) {
      return null; // Don't include in sitemap
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  // Additional paths to include (static region paths and fuel type pages)
  // Note: Dynamic station/suburb/brand pages are handled by src/app/sitemap.ts
  additionalPaths: async (config) => {
    const result = [];

    // Add region paths (static known regions)
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

    for (const region of regions) {
      const transformed = await config.transform(config, `/regions/${region}`);
      if (transformed) {
        result.push(transformed);
      }
    }

    // Add fuel type pages
    const fuelTypes = [
      'unleaded',
      'premium',
      'diesel',
      'e10',
      'e85',
      'lpg',
      'premium-diesel',
    ];

    for (const fuelType of fuelTypes) {
      const transformed = await config.transform(config, `/fuel-types/${fuelType}`);
      if (transformed) {
        result.push(transformed);
      }
    }

    // Add map page
    const mapTransformed = await config.transform(config, '/map');
    if (mapTransformed) {
      result.push(mapTransformed);
    }

    return result.filter(Boolean); // Filter out null values
  },
};
