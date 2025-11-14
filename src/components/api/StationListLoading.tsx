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
              bg-white dark:bg-gray-800
              rounded-lg
              border border-gray-200 dark:border-gray-700
              overflow-hidden
              min-h-[200px]
              animate-pulse
            "
            aria-hidden="true"
          >
            {/* Header skeleton */}
            <div className="p-4 pb-3 space-y-3">
              {/* Brand badge skeleton */}
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />

              {/* Title skeleton */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>

              {/* Address skeleton */}
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

StationListLoading.displayName = 'StationListLoading';

