'use client';

import { Star } from 'lucide-react';
import type { Station } from '@/types/station';

interface StationReviewsProps {
  stations?: Station[];
}

export function StationReviews({ stations = [] }: StationReviewsProps) {
  const stationsWithRatings = stations.filter((station) => typeof station.rating === 'number');

  if (stationsWithRatings.length === 0) {
    return null;
  }

  const averageRating =
    stationsWithRatings.reduce((sum, station) => sum + (station.rating ?? 0), 0) / stationsWithRatings.length;

  const totalReviews = stationsWithRatings.reduce((sum, station) => sum + (station.reviewCount ?? 0), 0);

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary-500">Community scores</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            Average rating {averageRating.toFixed(1)} / 5
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Based on {totalReviews.toLocaleString()} verified petrol station reviews across Melbourne.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          <Star className="h-5 w-5 fill-current" aria-hidden="true" />
          <span className="text-lg font-semibold">{averageRating.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
}

export default StationReviews;

