'use client';

import { motion } from 'framer-motion';
import { Fuel, MapPin, Navigation, Star } from 'lucide-react';
import type { Station } from '@/types/station';
import { cn } from '@/lib/utils';

interface StationListProps {
  stations: Station[];
  userLocation: { lat: number; lng: number } | null;
  onStationClick?: (station: Station) => void;
  selectedStation?: Station | null;
}

const fuelOrder: Array<{ key: keyof Station['fuelPrices']; label: string }> = [
  { key: 'unleaded', label: 'Unleaded' },
  { key: 'premium95', label: 'Premium 95' },
  { key: 'premium98', label: 'Premium 98' },
  { key: 'diesel', label: 'Diesel' },
  { key: 'lpg', label: 'LPG' },
];

function formatPrice(value?: number | null): string {
  if (typeof value !== 'number') {
    return '—';
  }
  return `${value.toFixed(1)}¢/L`;
}

function formatDistance(distance?: number): string | null {
  if (typeof distance !== 'number') return null;
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

export function StationList({
  stations,
  userLocation,
  onStationClick,
  selectedStation,
}: StationListProps) {
  if (!stations || stations.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/40 px-6 py-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
          <Fuel className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          No stations match your filters
        </h3>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
          Try adjusting your search, brand, or fuel type filters to discover more stations in Melbourne.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="list" aria-label="Melbourne petrol stations">
      {stations.map((station, index) => {
        const distanceLabel = formatDistance(station.distance);
        const bestPrice = Object.values(station.fuelPrices || {}).reduce<number | null>(
          (best, value) => {
            if (typeof value !== 'number') return best;
            if (best === null || value < best) return value;
            return best;
          },
          null
        );

        return (
          <motion.article
            key={station.id ?? `${station.name}-${index}`}
            id={station.id ? `station-${station.id}` : undefined}
            role="listitem"
            layout
            initial={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className={cn(
              'relative overflow-hidden rounded-3xl border border-gray-100 bg-white/90 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/80 dark:bg-gray-900/80',
              selectedStation?.id === station.id &&
                'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900'
            )}
          >
            <button
              type="button"
              className="flex w-full flex-col gap-6 p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              onClick={() => onStationClick?.(station)}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-widest text-primary-500">
                    {station.brand || 'Independent'}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {station.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {station.address}, {station.suburb}
                    </span>
                    {distanceLabel && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
                        <span className="inline-flex items-center gap-1.5">
                          <Navigation className="h-4 w-4" aria-hidden="true" />
                          {distanceLabel} away
                        </span>
                      </>
                    )}
                    {typeof station.rating === 'number' && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
                        <span className="inline-flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-amber-400" aria-hidden="true" />
                          {station.rating.toFixed(1)} ({station.reviewCount ?? 0} reviews)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 rounded-2xl bg-success-50 px-4 py-2 text-success-700 dark:bg-success-900/20 dark:text-success-300">
                  <Fuel className="h-5 w-5" aria-hidden="true" />
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-success-500 dark:text-success-400">
                      From
                    </p>
                    <p className="text-2xl font-bold">
                      {bestPrice !== null ? formatPrice(bestPrice) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl bg-gray-50/80 p-4 text-sm text-gray-700 dark:bg-gray-800/40 dark:text-gray-300 sm:grid-cols-2 lg:grid-cols-5">
                {fuelOrder.map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      {label}
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatPrice(station.fuelPrices?.[key])}
                    </span>
                  </div>
                ))}
              </div>
            </button>
          </motion.article>
        );
      })}
    </div>
  );
}

export default StationList;

