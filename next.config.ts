import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization with enhanced compression
  images: {
    // Prefer AVIF (best compression), fallback to WebP
    formats: ['image/avif', 'image/webp'],
    // Optimized device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Optimized image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Handle missing images gracefully
    unoptimized: false,
    remotePatterns: [],
    // Image quality levels - required for Next.js 16+
    // These are the allowed quality values that can be used in Image components
    qualities: [75, 80, 85, 90, 95, 100],
    // Note: Image quality is set per-image using the quality prop on Image component
    // Default is 75, can be overridden per image: <Image quality={85} ... />
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@heroicons/react',
      '@headlessui/react',
      'date-fns',
      'axios',
      'fuse.js',
      'zod',
    ],
    // Note: SWC minification is now default in Next.js 13+, no need to specify
  },

  // SWC compiler options for better optimization
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Headers for caching and performance
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/css/:path*.css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
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
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    productionBrowserSourceMaps: false,
    // Note: outputFileTracing is now default in Next.js 13+, no need to specify
    // Exclude unnecessary files from output to reduce bundle size
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
        'node_modules/webpack',
        'node_modules/.cache',
        'node_modules/.bin',
      ],
    },
  }),

  // TypeScript and ESLint - Warn but don't block builds
  typescript: {
    ignoreBuildErrors: true, // Allow build with TS warnings (for gradual migration)
  },
  eslint: {
    ignoreDuringBuilds: true, // Allow build with ESLint warnings (for gradual migration)
  },

  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    // Optimize bundle size for client-side
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        // Tree-shaking is handled automatically by Next.js/SWC
        // Removed usedExports as it conflicts with Next.js cache settings
        sideEffects: false,
        // Improved code splitting strategy
        splitChunks: {
          chunks: 'all',
          minSize: 20000, // Minimum chunk size (20KB)
          maxSize: 244000, // Maximum chunk size (244KB) - helps with HTTP/2
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunks (React, Next.js)
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Map libraries (large, separate chunk)
            maps: {
              name: 'maps',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](mapbox-gl|maplibre-gl|leaflet|react-leaflet|react-map-gl|pmtiles)[\\/]/,
              priority: 35,
              enforce: true,
            },
            // UI libraries
            ui: {
              name: 'ui',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@headlessui|@heroicons|lucide-react)[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // Animation libraries
            animation: {
              name: 'animation',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // Data fetching libraries
            data: {
              name: 'data',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@tanstack|swr|axios|node-fetch)[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            // Utility libraries
            utils: {
              name: 'utils',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](date-fns|fuse\.js|clsx|tailwind-merge|zod)[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Vendor chunks (everything else from node_modules)
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
            // Common chunks (shared code)
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
        // Enable module concatenation for better tree-shaking
        concatenateModules: !dev,
        // Minimize bundle size
        minimize: !dev,
      };

      // Resolve configuration for better tree-shaking
      config.resolve = {
        ...config.resolve,
        // Prefer ES modules for better tree-shaking
        mainFields: ['module', 'main'],
      };
    }

    // Server-side optimizations
    if (isServer) {
      // Exclude large client-only libraries from server bundle
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          'mapbox-gl': 'commonjs mapbox-gl',
          'maplibre-gl': 'commonjs maplibre-gl',
          'leaflet': 'commonjs leaflet',
        });
      }
    }

    return config;
  },
};

export default nextConfig;
