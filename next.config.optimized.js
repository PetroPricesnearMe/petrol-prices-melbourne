/** @type {import('next').NextConfig} */

// Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Remove X-Powered-By header for security
  
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Optimize images
  images: {
    domains: ['api.baserow.io', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for better performance
  experimental: {
    // Optimize CSS
    optimizeCss: true,
    // Modern JavaScript output
    modern: true,
    // Optimize package imports
    optimizePackageImports: ['framer-motion', 'leaflet', 'react-leaflet'],
  },

  // SWC minification (faster than Terser)
  swcMinify: true,

  // Webpack optimizations
  webpack: (config, { dev, isServer, webpack }) => {
    // Path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
      '@/components': `${__dirname}/src/components`,
      '@/lib': `${__dirname}/lib`,
      '@/pages': `${__dirname}/pages`,
      '@/public': `${__dirname}/public`,
      '@/styles': `${__dirname}/src/styles`,
      '@/utils': `${__dirname}/src/utils`,
      '@/services': `${__dirname}/src/services`,
      '@/hooks': `${__dirname}/src/hooks`,
    };

    // Production optimizations
    if (!dev && !isServer) {
      // Tree shaking for framer-motion
      config.resolve.alias['framer-motion'] = 'framer-motion/dist/es/index.mjs';
      
      // Split chunks for better caching
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunk for node_modules
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            // React chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-is)[\\/]/,
              name: 'react',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Framer Motion chunk
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              priority: 15,
              reuseExistingChunk: true,
            },
            // Leaflet chunk (maps)
            maps: {
              test: /[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/,
              name: 'maps',
              priority: 15,
              reuseExistingChunk: true,
            },
            // Common chunk for shared code
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // Exclude heavy libraries from server bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'framer-motion': 'framer-motion',
        'leaflet': 'leaflet',
      });
    }

    // Performance plugin
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
      })
    );

    return config;
  },

  // Compression
  compress: true,

  // Trailing slash
  trailingSlash: false,

  // Production source maps (disable for smaller bundle)
  productionBrowserSourceMaps: false,

  // Custom headers for performance and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache data files with shorter TTL
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Add any necessary redirects here
    ];
  },

  // Rewrites
  async rewrites() {
    return [];
  },
};

module.exports = withBundleAnalyzer(nextConfig);

