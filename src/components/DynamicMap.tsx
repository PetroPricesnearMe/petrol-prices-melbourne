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

// Loading fallback component
function MapLoadingFallback() {
  return (
    <div className="flex h-96 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  );
}

export default DynamicMap;
