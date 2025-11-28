/**
 * Dynamic Map Component
 * Dynamically imports Leaflet components to avoid SSR issues
 * Uses ssr: false to prevent server-side rendering of map components
 */

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import with ssr: false to prevent server-side rendering issues
const InteractiveStationMap = dynamic(
  () => import('@/components/InteractiveStationMap'),
  {
    ssr: false,
    loading: () => <MapLoadingFallback />,
  }
);

interface DynamicMapProps {
  stations: Array<Record<string, unknown>>;
  center?: [number, number];
  zoom?: number;
  className?: string;
  showUserLocation?: boolean;
  onStationClick?: (station: Record<string, unknown>) => void;
}

export function DynamicMap(props: DynamicMapProps) {
  return (
    <Suspense fallback={<MapLoadingFallback />}>
      <InteractiveStationMap {...props} />
    </Suspense>
  );
}

// Enhanced loading skeleton component
function MapLoadingFallback() {
  return (
    <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
      
      {/* Map skeleton elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 dark:border-gray-600 border-t-primary-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-2">Loading map...</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Preparing station locations</p>
        </div>
      </div>

      {/* Skeleton controls */}
      <div className="absolute top-4 right-4">
        <div className="w-11 h-11 bg-white dark:bg-gray-700 rounded-lg shadow-md animate-pulse" />
      </div>
      <div className="absolute top-4 left-4">
        <div className="w-24 h-8 bg-white dark:bg-gray-700 rounded-full shadow-md animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-48 h-32 bg-white dark:bg-gray-700 rounded-lg shadow-md animate-pulse" />
      </div>
    </div>
  );
}

export default DynamicMap;
