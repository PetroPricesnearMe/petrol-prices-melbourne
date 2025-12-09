import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';

  // Reject localhost URLs
  const finalBaseUrl = baseUrl.includes('localhost')
    ? 'https://petrolpricesnearme.com.au'
    : baseUrl;

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/directory',
          '/directory/*',
          '/stations/*',
          '/fuel-types',
          '/fuel-types/*',
          '/fuel-brands',
          '/fuel-brands/*',
          '/regions/*',
          '/map',
          '/fuel-price-trends',
          '/about',
          '/faq',
          '/how-pricing-works',
          '/blog',
          '/blog/*',
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/auth/',
          '/private/',
          '/sign-in',
          '/hero-example',
          '/map-demo',
          '/test/',
          '/debug/',
          '/*?sort=*',
          '/*?filter=*',
          '/*?filters=*',
          '/*?page=*',
          '/*?search=*',
          '/*?q=*',
          '/*?s=*',
          '/*?category=*',
          '/*?brand=*',
          '/*?fuel=*',
          '/*?amenity=*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/directory',
          '/directory/*',
          '/stations/*',
          '/fuel-types',
          '/fuel-types/*',
          '/fuel-brands',
          '/fuel-brands/*',
          '/regions/*',
          '/map',
          '/fuel-price-trends',
          '/station-amenities',
          '/how-pricing-works',
        ],
        disallow: ['/api/', '/_next/', '/admin/', '/hero-example', '/map-demo'],
        crawlDelay: 0.5,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/directory',
          '/directory/*',
          '/stations/*',
          '/fuel-types',
          '/fuel-types/*',
          '/fuel-brands',
          '/fuel-brands/*',
          '/regions/*',
          '/map',
          '/fuel-price-trends',
          '/station-amenities',
          '/how-pricing-works',
        ],
        disallow: ['/api/', '/_next/', '/admin/', '/hero-example', '/map-demo'],
        crawlDelay: 1,
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
    ],
    sitemap: [
      `${finalBaseUrl}/sitemap.xml`,
      `${finalBaseUrl}/server-sitemap.xml`,
    ],
    host: finalBaseUrl,
  };
}
