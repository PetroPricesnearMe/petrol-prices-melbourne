/**
 * Lazy Loaded Map Component
 * Dynamically imports Leaflet/React-Leaflet only when needed
 * Reduces initial bundle size significantly
 */

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load the map component with no SSR
const DynamicMap = dynamic(
  () => import('./Map').then(mod => mod.Map).catch(() => {
    console.warn('Map component failed to load');
    return { default: () => <div>Map unavailable</div> };
  }),
  {
    loading: () => (
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center animate-pulse">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Loading map...</div>
        </div>
      </div>
    ),
    ssr: false, // Maps should never render on server
  }
);

interface LazyMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string | number;
    position: [number, number];
    popup?: string;
  }>;
  className?: string;
}

/**
 * Lazy Map Component
 * Only loads map libraries when component is mounted
 */
export function LazyMap(props: LazyMapProps) {
  return (
    <Suspense fallback={
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Initializing map...</div>
        </div>
      </div>
    }>
      <DynamicMap {...props} />
    </Suspense>
  );
}

export default LazyMap;

