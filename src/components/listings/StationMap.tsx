'use client';

import { Map, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

import type { Station } from '@/types/station';

interface StationMapProps {
  stations: Station[];
  userLocation: { lat: number; lng: number } | null;
  selectedStation: Station | null;
  onStationSelect?: (station: Station) => void;
}

const LegacyStationMap = dynamic(() => import('../StationMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
        <Map className="h-6 w-6 animate-pulse" aria-hidden="true" />
      </div>
      <p className="text-base font-medium text-gray-700 dark:text-gray-300">
        Loading interactive map...
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Visualising all Melbourne petrol stations
      </p>
    </div>
  ),
}) as ComponentType<Record<string, unknown>>;

export function StationMap({
  stations,
  userLocation,
  selectedStation,
  onStationSelect,
}: StationMapProps) {
  const stationsWithCoordinates = stations.filter(
    (station) =>
      typeof station.latitude === 'number' &&
      typeof station.longitude === 'number'
  );

  if (stationsWithCoordinates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
          <MapPin className="h-6 w-6" aria-hidden="true" />
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
    <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-lg dark:border-gray-800">
      <LegacyStationMap
        stations={stationsWithCoordinates}
        selectedStation={selectedStation}
        onStationClick={(station: Station) => onStationSelect?.(station)}
        userLocation={userLocation}
        height={520}
      />
    </div>
  );
}

export default StationMap;
