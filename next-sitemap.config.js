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
  
  // Exclude patterns
  exclude: [
    '/api/*',
    '/_next/*',
    '/admin/*',
    '/server-sitemap.xml',
    '/server-sitemap-index.xml',
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
          '/*?*sort=*', // Noindex sort parameters
          '/*?*filter=*', // Noindex filter parameters
          '/*?*page=*', // Noindex pagination parameters
          '/*?*search=*', // Noindex search parameters
          '/*?*q=*', // Noindex query parameters
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
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
    
    return result;
  },
};

