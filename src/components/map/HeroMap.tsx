/**
 * Hero Map Component
 * 
 * Optimized Leaflet map for landing page hero section
 * Features:
 * - Lazy loading for optimal performance
 * - SEO-friendly with proper loading states
 * - Mobile responsive
 * - Interactive markers with clustering
 * - Smooth animations
 * - Accessible keyboard navigation
 */

'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import type { Station } from '@/types';

// Lazy load the actual map component for better performance
const LazyMapComponent = dynamic(
  () => import('./HeroMapInner').then(mod => mod.HeroMapInner),
  {
    loading: () => <MapLoadingPlaceholder />,
    ssr: false, // Disable SSR for maps to avoid hydration issues
  }
);

interface HeroMapProps {
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
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
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
            className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-blue-600 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Loading Interactive Map...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Finding petrol stations near you
          </p>
        </div>
      </div>

      {/* Decorative map-like elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-4 h-4 bg-green-500 rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-32 left-40 w-4 h-4 bg-yellow-500 rounded-full animate-pulse delay-200" />
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-300" />
      </div>
    </div>
  );
}

/**
 * Error fallback component
 */
function MapError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Map Temporarily Unavailable
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We&apos;re having trouble loading the interactive map.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Main Hero Map Component
 */
export function HeroMap({ 
  stations = [], 
  className = '',
  height = '500px',
  onStationClick 
}: HeroMapProps) {
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before rendering the map
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter stations with valid coordinates
  const validStations = useMemo(() => {
    return stations.filter(
      station => 
        station.latitude != null && 
        station.longitude != null &&
        !isNaN(station.latitude) &&
        !isNaN(station.longitude)
    );
  }, [stations]);

  const handleRetry = () => {
    setHasError(false);
    setRetryKey(prev => prev + 1);
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
        <LazyMapComponent
          stations={validStations}
          onStationClick={onStationClick}
          onError={handleError}
        />
      )}
    </motion.div>
  );
}

export default HeroMap;

