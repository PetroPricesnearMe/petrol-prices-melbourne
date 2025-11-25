'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import type { Coordinates } from '@/types/common';
import type { Station } from '@/types/station';

// MapLibre CSS - must be imported
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

// Lazy load MapLibre to avoid blocking initial render
const MapLibreMapCore = dynamic(() => import('./MapLibreMapCore'), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />,
});

interface MapLibreMapProps {
  stations: Station[];
  selectedStation?: Station | null;
  onStationSelect?: (station: Station) => void;
  userLocation?: Coordinates | null;
  className?: string;
  height?: string;
  defaultZoom?: number;
  defaultCenter?: Coordinates;
  enableClustering?: boolean;
  enableLazyLoad?: boolean;
}

/**
 * Loading skeleton for map
 */
function MapLoadingSkeleton() {
  return (
    <div className="flex h-[500px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
        <svg
          className="h-6 w-6 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      </div>
      <p className="text-base font-medium text-gray-700 dark:text-gray-300">
        Loading interactive map...
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Visualising all Melbourne petrol stations
      </p>
    </div>
  );
}

/**
 * High-performance MapLibre map component with Protomaps vector tiles
 * Features:
 * - Lightweight MapLibre GL JS
 * - Protomaps vector tiles (free, fast)
 * - Marker clustering for ~720 stations
 * - Custom marker icons with station logos
 * - Lazy loading with Intersection Observer
 * - Smooth zoom & pan
 * - Responsive Tailwind styling
 */
export function MapLibreMap({
  stations,
  selectedStation,
  onStationSelect,
  userLocation,
  className = '',
  height = '500px',
  defaultZoom = 10,
  defaultCenter = { latitude: -37.8136, longitude: 144.9631 }, // Melbourne
  enableClustering = true,
  enableLazyLoad = true,
}: MapLibreMapProps) {
  const [isVisible, setIsVisible] = useState(!enableLazyLoad);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter stations with valid coordinates
  const validStations = useMemo(
    () =>
      stations.filter(
        (station) =>
          typeof station.latitude === 'number' &&
          typeof station.longitude === 'number' &&
          !isNaN(station.latitude) &&
          !isNaN(station.longitude)
      ),
    [stations]
  );

  // Lazy load map when it becomes visible
  useEffect(() => {
    if (!enableLazyLoad || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before visible
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [enableLazyLoad, isVisible]);

  if (validStations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Map coming soon
        </h3>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
          Location data is being updated for these stations. Try the list view
          to explore available prices.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-3xl border border-gray-100 shadow-lg dark:border-gray-800 ${className}`}
      style={{ height }}
    >
      {isVisible ? (
        <MapLibreMapCore
          stations={validStations}
          selectedStation={selectedStation}
          onStationSelect={onStationSelect}
          userLocation={userLocation}
          defaultZoom={defaultZoom}
          defaultCenter={defaultCenter}
          enableClustering={enableClustering}
        />
      ) : (
        <MapLoadingSkeleton />
      )}
    </div>
  );
}

export default MapLibreMap;

