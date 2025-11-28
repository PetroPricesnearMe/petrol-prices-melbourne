/**
 * Loading Skeleton Components
 * 
 * Reusable loading skeletons for API data fetching states
 * 
 * @module components/ui/LoadingSkeleton
 */

import { cn } from '@/lib/utils';

// ============================================================================
// BASE SKELETON
// ============================================================================

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'pulse' | 'wave';
}

export function Skeleton({ className, variant = 'pulse' }: SkeletonProps) {
  const variantClasses = {
    default: 'bg-gray-200 dark:bg-gray-700',
    pulse: 'bg-gray-200 dark:bg-gray-700 animate-pulse',
    wave: 'bg-gray-200 dark:bg-gray-700 animate-shimmer',
  };

  return (
    <div
      className={cn(
        'rounded',
        variantClasses[variant],
        className
      )}
      aria-label="Loading..."
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================================================
// STATION CARD SKELETON
// ============================================================================

export function StationCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Address */}
      <Skeleton className="h-4 w-48" />

      {/* Price Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>
    </div>
  );
}

// ============================================================================
// STATION LIST SKELETON
// ============================================================================

export function StationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <StationCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// TABLE SKELETON
// ============================================================================

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="grid border-b border-gray-200 dark:border-gray-700 p-4 gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-5" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// MAP SKELETON
// ============================================================================

export function MapSkeleton() {
  return (
    <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />

      {/* Map controls skeleton */}
      <div className="absolute top-4 right-4 space-y-2">
        <Skeleton className="w-11 h-11 rounded-lg" />
        <Skeleton className="w-11 h-11 rounded-lg" />
      </div>

      {/* Legend skeleton */}
      <div className="absolute bottom-4 left-4">
        <Skeleton className="w-48 h-32 rounded-lg" />
      </div>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
          </div>
          <Skeleton className="h-4 w-32 mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SEARCH SKELETON
// ============================================================================

export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* Results */}
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PRICE CARD SKELETON
// ============================================================================

export function PriceCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="space-y-4">
        {/* Header */}
        <Skeleton className="h-6 w-24" />

        {/* Price grid */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INLINE SKELETON
// ============================================================================

export function InlineSkeleton({ width = '100%', height = '1rem' }: { width?: string; height?: string }) {
  return <Skeleton className="inline-block" style={{ width, height }} />;
}

