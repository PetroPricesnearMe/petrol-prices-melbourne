/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['api.baserow.io'],
    formats: ['image/avif', 'image/webp'],
  },

  // Allow CSS imports from any component (needed for CRA migration)
  experimental: {
    esmExternals: 'loose',
  },

  // Path aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
      '@/components': `${__dirname}/components`,
      '@/lib': `${__dirname}/lib`,
      '@/pages': `${__dirname}/pages`,
      '@/public': `${__dirname}/public`,
      '@/styles': `${__dirname}/styles`,
    };
    return config;
  },

  // Trailing slash for better compatibility
  trailingSlash: false,

  // Custom headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ];
  },

  // Rewrites for SPA-like behavior
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;

