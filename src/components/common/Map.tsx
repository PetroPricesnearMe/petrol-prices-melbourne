/**
 * Map Component
 * Placeholder for actual map implementation
 * This file should be implemented when Leaflet is needed
 */

'use client';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string | number;
    position: [number, number];
    popup?: string;
  }>;
  className?: string;
}

export function Map({ center, zoom, markers, className }: MapProps) {
  return (
    <div
      className={`flex h-96 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 ${className || ''}`}
    >
      <div className="text-center">
        <div className="mb-2 text-4xl">🗺️</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Map implementation coming soon
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Center: {center?.[0]}, {center?.[1]} | Zoom: {zoom} | Markers:{' '}
          {markers?.length || 0}
        </div>
      </div>
    </div>
  );
}
