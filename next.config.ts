import type { NextConfig } from 'next';

/**
 * Next.js Configuration - Production-Ready Setup for Next.js 15
 * 
 * This configuration optimizes for:
 * - Performance: Compression, caching, code splitting
 * - Security: Headers, CSP, XSS protection
 * - SEO: Metadata, structured data
 * - Developer Experience: TypeScript, ESLint
 * 
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */

const nextConfig: NextConfig = {
  // ========================================
  // CORE CONFIGURATION
  // ========================================

  // Enable React strict mode for better debugging and error detection
  reactStrictMode: true,

  // Remove X-Powered-By header for security (prevents server fingerprinting)
  poweredByHeader: false,

  // Enable gzip/brotli compression for responses
  compress: true,

  // ========================================
  // IMAGE OPTIMIZATION
  // Optimized for Core Web Vitals (LCP, CLS)
  // ========================================
  images: {
    // Modern image formats (AVIF first for best compression, then WebP)
    formats: ['image/avif', 'image/webp'],

    // Responsive breakpoints for different devices
    // Optimized for common screen sizes to reduce image payload
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 1 year (long-term caching)
    minimumCacheTTL: 31536000,

    // Security: Disable SVG support to prevent XSS attacks
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // Image optimization is enabled by default
    // Add remote image domains if needed (for external images)
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'example.com',
    //     pathname: '/images/**',
    //   },
    // ],
  },

  // ========================================
  // SERVER CONFIGURATION
  // ========================================

  // External packages that should be treated as external in server components
  // Note: In Next.js 15, this is a top-level option (not in experimental)
  // Only add if you're using packages like 'sharp', 'onnxruntime-node', etc.
  // serverExternalPackages: ['sharp', 'onnxruntime-node'],

  // ========================================
  // EXPERIMENTAL FEATURES
  // Enable cutting-edge optimizations (Next.js 15)
  // ========================================
  experimental: {
    // Optimize imports for specific packages (tree-shaking)
    // Automatically optimizes imports to reduce bundle size
    // Supported in Next.js 14+
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@headlessui/react',
      '@heroicons/react',
      'date-fns',
      'lodash-es',
    ],
  },

  // ========================================
  // SECURITY HEADERS
  // Configure HTTP headers for security and performance
  // ========================================
  async headers() {
    return [
      {
        // Static assets (images, fonts, etc.) - Long-term caching
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Next.js static files - Long-term caching
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Font files - Long-term caching
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // All routes - Security headers
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

  // ========================================
  // BUILD CONFIGURATION
  // ========================================

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Disable source maps in production for better performance
    productionBrowserSourceMaps: false,
  }),

  // TypeScript configuration
  // Set to true only during migration to allow builds with TypeScript errors
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  // Set to true only during migration to allow builds with ESLint warnings
  eslint: {
    ignoreDuringBuilds: false,
  },

  // ========================================
  // WEBPACK OPTIMIZATION
  // Customize Webpack configuration for bundle optimization
  // ========================================
  webpack: (config, { isServer, dev }) => {
    // Client-side optimizations only
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        // Enable tree shaking
        usedExports: true,
        sideEffects: false,

        // Code splitting strategy
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,

            // Framework chunks (React, Next.js) - Highest priority
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              chunks: 'all',
              priority: 40,
              enforce: true,
            },

            // Vendor chunks (third-party libraries)
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              minChunks: 1,
            },

            // Common chunks (shared code)
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },

            // Framer Motion (large animation library) - Load on demand
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              chunks: 'async',
              priority: 30,
            },

            // Lucide Icons (icon library) - Load on demand
            lucide: {
              name: 'lucide',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              chunks: 'async',
              priority: 30,
            },

            // Map libraries (heavy, load on demand)
            maps: {
              name: 'maps',
              test: /[\\/]node_modules[\\/](leaflet|mapbox-gl|react-leaflet)[\\/]/,
              chunks: 'async',
              priority: 25,
            },

            // UI libraries (load on demand)
            ui: {
              name: 'ui',
              test: /[\\/]node_modules[\\/](@headlessui|@heroicons)[\\/]/,
              chunks: 'async',
              priority: 25,
            },
          },
        },
      };

      // Optimize module resolution
      // Note: In Framer Motion 11+, top-level imports are already optimized
      // No need for custom alias - Next.js handles ESM/CJS automatically
      // Removed deprecated 'framer-motion/dist/es' alias
    }

    // Production-only optimizations
    if (!dev && !isServer) {
      // Minification is enabled by default in production
      config.optimization.minimize = true;
    }

    return config;
  },
};

export default nextConfig;
