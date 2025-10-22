import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Core Configuration */
  reactStrictMode: true,
  poweredByHeader: false,
  
  /* TypeScript */
  typescript: {
    ignoreBuildErrors: false,
  },
  
  /* ESLint */
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
  
  /* Performance Optimizations */
  compress: true,
  swcMinify: true,
  
  /* Image Optimization */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.baserow.io',
      },
    ],
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
    optimizePackageImports: ['leaflet', 'react-leaflet'],
    webpackMemoryOptimizations: true,
  },
  
  /* Output Configuration */
  output: 'standalone',
  
  /* Environment Variables */
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '2.0.0',
  },
};

export default nextConfig;

