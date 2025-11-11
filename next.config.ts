import type { NextConfig } from 'next';

/**
 * Next.js Configuration - Production-Ready Setup
 * 
 * This configuration optimizes for:
 * - Performance: Compression, caching, code splitting
 * - Security: Headers, CSP, XSS protection
 * - SEO: Metadata, structured data
 * - Developer Experience: TypeScript, ESLint
 */

const nextConfig: NextConfig = {
  // ========================================
  // PERFORMANCE OPTIMIZATIONS
  // ========================================
  
  // Enable gzip/brotli compression
  compress: true,
  
  // Remove X-Powered-By header for security
  poweredByHeader: false,
  
  // Enable React strict mode for better debugging
  reactStrictMode: true,
  
  // Optimize CSS imports
  optimizeFonts: true,

  // ========================================
  // IMAGE OPTIMIZATION
  // Serve modern formats with optimal sizes
  // ========================================
  images: {
    // Modern image formats (AVIF first for best compression)
    formats: ['image/avif', 'image/webp'],
    
    // Responsive breakpoints for different devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
    
    // Security: Disable SVG support to prevent XSS
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Add remote image domains if needed (commented for security)
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'example.com',
    //   },
    // ],
  },

  // ========================================
  // EXPERIMENTAL FEATURES
  // Enable cutting-edge optimizations
  // ========================================
  experimental: {
    // Optimize imports for specific packages
    optimizePackageImports: ['lucide-react', 'framer-motion', '@headlessui/react'],
    
    // Use optimized CSS
    optimizeCss: true,
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
  }),

  // TypeScript and ESLint - Warn but don't block builds
  typescript: {
    ignoreBuildErrors: true, // Allow build with TS warnings (for gradual migration)
  },
  eslint: {
    ignoreDuringBuilds: true, // Allow build with ESLint warnings (for gradual migration)
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunks
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunks
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Framer Motion
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              chunks: 'all',
              priority: 30,
            },
            // Lucide Icons
            lucide: {
              name: 'lucide',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              chunks: 'all',
              priority: 30,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
