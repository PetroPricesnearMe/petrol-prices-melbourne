/**
 * SkeletonLoader Component
 * Sleek animated skeleton placeholders for directory listings while data is being fetched
 * Features:
 * - Tailwind shimmer effects
 * - Multiple skeleton variants
 * - Responsive design
 * - Accessibility features
 */

'use client';

import { cn } from '@/styles/system/css-in-js';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  const variantClasses = {
    text: 'h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
    rectangular:
      'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
    circular:
      'rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
    card: 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 && 'w-3/4', // Last line is shorter
              className
            )}
            style={index === lines - 1 ? { ...style, width: '75%' } : style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      aria-label="Loading content"
    />
  );
}

// Station Card Skeleton
export function StationCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Header with brand logo */}
      <div className="relative h-20 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton variant="circular" width={48} height={48} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Station name */}
        <Skeleton variant="text" width="80%" height={20} />

        {/* Brand badge */}
        <Skeleton
          variant="rectangular"
          width={60}
          height={24}
          className="rounded-full"
        />

        {/* Address */}
        <div className="space-y-2">
          <Skeleton variant="text" width="100%" height={14} />
          <Skeleton variant="text" width="70%" height={14} />
        </div>

        {/* Fuel prices */}
        <div className="space-y-2">
          <Skeleton variant="text" width="60%" height={16} />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={32}
              className="rounded"
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={32}
              className="rounded"
            />
          </div>
        </div>

        {/* Action button */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={36}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}

// Directory Grid Skeleton
export function DirectoryGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <StationCardSkeleton key={index} />
      ))}
    </div>
  );
}

// List View Skeleton
export function ListViewSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card p-4">
          <div className="flex items-center gap-4">
            {/* Station logo */}
            <Skeleton variant="circular" width={48} height={48} />

            {/* Station info */}
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" height={18} />
              <Skeleton variant="text" width="40%" height={14} />
              <Skeleton variant="text" width="80%" height={14} />
            </div>

            {/* Price info */}
            <div className="space-y-2 text-right">
              <Skeleton variant="text" width={60} height={16} />
              <Skeleton variant="text" width={80} height={14} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Search Results Skeleton
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search header */}
      <div className="space-y-3">
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={80}
            height={32}
            className="rounded-full"
          />
        ))}
      </div>

      {/* Results grid */}
      <DirectoryGridSkeleton count={8} />
    </div>
  );
}

// Map Loading Skeleton
export function MapSkeleton() {
  return (
    <div className="relative h-96 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
      {/* Map background */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />

      {/* Loading overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="border-blue-600 mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2" />
          <Skeleton variant="text" width={120} height={16} />
        </div>
      </div>

      {/* Mock markers */}
      <div className="absolute left-4 top-4">
        <Skeleton variant="circular" width={32} height={32} />
      </div>
      <div className="absolute right-8 top-20">
        <Skeleton variant="circular" width={32} height={32} />
      </div>
      <div className="absolute bottom-16 left-1/2">
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Table header */}
      <div className="bg-gray-50 p-4 dark:bg-gray-800">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} variant="text" width="80%" height={16} />
          ))}
        </div>
      </div>

      {/* Table body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  variant="text"
                  width="90%"
                  height={14}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
