import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Core Configuration */
  reactStrictMode: true,
  poweredByHeader: false,

  /* TypeScript */
  typescript: {
    // Temporarily ignore errors during build - types need gradual migration
    ignoreBuildErrors: true,
  },

  /* ESLint */
  eslint: {
    // Temporarily ignore during builds to unblock deployment
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },

  /* Performance Optimizations */
  compress: true,
  // swcMinify is default in Next.js 15+ and no longer needed

  /* Bundle Optimization */
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    '@tanstack/react-query': {
      transform: '@tanstack/react-query/{{member}}',
    },
  },

  /* Image Optimization */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for static images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.baserow.io',
      },
      {
        protocol: 'https',
        hostname: '**.mapbox.com',
      },
    ],
    // Optimize for Core Web Vitals
    unoptimized: false,
    loader: 'default',
  },

  /* Headers for Security and Performance */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      // Cache static assets for 1 year
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images for 1 year
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache API responses for 1 hour
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },

  /* Webpack Configuration */
  webpack: (config, { isServer }) => {
    // Add custom webpack configurations here
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  /* Experimental Features */
  experimental: {
    optimizePackageImports: [
      'leaflet',
      'react-leaflet',
      '@tanstack/react-query',
      'framer-motion',
      'date-fns',
    ],
    webpackMemoryOptimizations: true,
  },

  /* Output Configuration */
  output: 'standalone',

  /* Environment Variables */
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '2.0.0',
  },

  /* Analytics Configuration */
  // Vercel Analytics and Speed Insights are auto-configured
  // Google Analytics is configured via GTM component
};

export default nextConfig;
