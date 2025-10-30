/**
 * next-sitemap Configuration
 * Automatically generates sitemap.xml and robots.txt
 *
 * @see https://github.com/iamvishnusankar/next-sitemap
 */

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  outDir: './public',

  // Exclude patterns - admin, API, and dynamic filter/search pages
  exclude: [
    '/api/*',
    '/_next/*',
    '/admin/*',
    '/server-sitemap.xml',
    '/server-sitemap-index.xml',
    '/hero-example',
    '/map-demo',
    '/*?*', // Exclude all URLs with query parameters
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
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au'}/server-sitemap.xml`,
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

    // Region pages - high priority
    else if (path.startsWith('/regions/')) {
      priority = 0.85;
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

  // Additional paths to include
  additionalPaths: async (config) => {
    const result = [];

    // Add region paths
    const regions = [
      'north-melbourne',
      'south-melbourne',
      'east-melbourne',
      'west-melbourne',
      'cbd',
    ];

    for (const region of regions) {
      result.push(
        await config.transform(config, `/regions/${region}`)
      );
    }

    // Add popular suburb paths (top suburbs for SEO)
    const popularSuburbs = [
      'melbourne',
      'brunswick',
      'preston',
      'coburg',
      'richmond',
      'fitzroy',
      'broadmeadows',
      'werribee',
      'dandenong',
      'frankston',
      'box-hill',
      'ringwood',
      'sunbury',
      'craigieburn',
      'pakenham',
    ];

    for (const suburb of popularSuburbs) {
      result.push(
        await config.transform(config, `/directory/${suburb}`)
      );
    }

    return result.filter(Boolean); // Filter out null values
  },
};
