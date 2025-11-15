/**
 * StationListLoading Component
 *
 * Loading skeleton for station list
 * Accessible and provides visual feedback
 *
 * @component
 */

import React from 'react';

export interface StationListLoadingProps {
  /** Number of skeleton cards to show */
  count?: number;
  /** Grid columns configuration */
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3;
    desktop?: 3 | 4 | 5;
  };
  /** Custom className */
  className?: string;
}

/**
 * StationListLoading - Loading skeleton
 *
 * Features:
 * - Accessible loading state
 * - Responsive grid
 * - Smooth animations
 */
export function StationListLoading({
  count = 6,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  className = '',
}: StationListLoadingProps) {
  const gridCols = {
    mobile: `grid-cols-${columns.mobile || 1}`,
    tablet: `sm:grid-cols-${columns.tablet || 2}`,
    desktop: `lg:grid-cols-${columns.desktop || 3}`,
  };

  return (
    <div
      className={`station-list-loading ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading stations"
    >
      {/* Screen reader announcement */}
      <div className="sr-only">Loading stations, please wait...</div>

      {/* Loading grid */}
      <div
        className={`
          grid gap-6
          ${gridCols.mobile}
          ${gridCols.tablet}
          ${gridCols.desktop}
        `}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="
              min-h-[200px] animate-pulse
              overflow-hidden
              rounded-lg border border-gray-200
              bg-white
              dark:border-gray-700
              dark:bg-gray-800
            "
            aria-hidden="true"
          >
            {/* Header skeleton */}
            <div className="space-y-3 p-4 pb-3">
              {/* Brand badge skeleton */}
              <div className="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />

              {/* Title skeleton */}
              <div className="space-y-2">
                <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Address skeleton */}
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

StationListLoading.displayName = 'StationListLoading';
