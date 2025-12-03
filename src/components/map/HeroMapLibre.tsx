/**
 * Hero Map Component - MapLibre GL Edition
 *
 * Ultra-optimized vector map for maximum performance and SEO
 * Features:
 * - Vector tiles (70% smaller than raster)
 * - GPU-accelerated rendering (60fps smooth)
 * - WebGL-based for better performance
 * - Lazy loading for optimal SEO
 * - Mobile optimized
 * - No API key required
 */

'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Station } from '@/types';

// Lazy load the actual map component for better performance
const LazyMapLibreComponent = dynamic(
  () => import('./HeroMapLibreInner').then((mod) => mod.HeroMapLibreInner),
  {
    loading: () => <MapLoadingPlaceholder />,
    ssr: false, // Disable SSR for maps to avoid hydration issues
  }
);

interface HeroMapLibreProps {
  stations?: Station[];
  className?: string;
  height?: string;
  onStationClick?: (station: Station) => void;
}

/**
 * Loading placeholder with skeleton UI
 */
function MapLoadingPlaceholder() {
  return (
    <div className="from-blue-50 to-blue-100 relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br dark:from-gray-800 dark:to-gray-900">
      {/* Animated pulse effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Loading content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="border-blue-600 mx-auto mb-4 h-16 w-16 rounded-full border-4 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Loading Vector Map...
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            GPU-accelerated, ultra-fast
          </p>
        </div>
      </div>

      {/* Decorative map-like elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="bg-green-500 absolute left-20 top-20 h-4 w-4 animate-pulse rounded-full" />
        <div className="bg-yellow-500 absolute right-32 top-40 h-4 w-4 animate-pulse rounded-full delay-100" />
        <div className="bg-red-500 absolute bottom-32 left-40 h-4 w-4 animate-pulse rounded-full delay-200" />
        <div className="bg-blue-500 absolute bottom-20 right-20 h-4 w-4 animate-pulse rounded-full delay-300" />
      </div>
    </div>
  );
}

/**
 * Error fallback component
 */
function MapError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
      <div className="p-8 text-center">
        <div className="mb-4 text-6xl">🗺️</div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          Map Temporarily Unavailable
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          We&apos;re having trouble loading the vector map.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-3 text-white transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Main Hero Map Component (MapLibre GL)
 */
export function HeroMapLibre({
  stations = [],
  className = '',
  height = '500px',
  onStationClick,
}: HeroMapLibreProps) {
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before rendering the map
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setRetryKey((prev) => prev + 1);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Don't render anything on the server
  if (!isClient) {
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <MapLoadingPlaceholder />
      </div>
    );
  }

  return (
    <motion.div
      key={retryKey}
      className={`relative ${className}`}
      style={{ height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {hasError ? (
        <MapError onRetry={handleRetry} />
      ) : (
        <LazyMapLibreComponent
          stations={stations}
          onStationClick={onStationClick}
          onError={handleError}
        />
      )}
    </motion.div>
  );
}

export default HeroMapLibre;
