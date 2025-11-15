/**
 * Station Card Skeleton
 *
 * Loading placeholder for station cards
 */

'use client';

import { Skeleton } from '@/components/atoms/Skeleton/Skeleton';
import { cn } from '@/styles/system/css-in-js';

interface StationCardSkeletonProps {
  className?: string;
  variant?: 'modern' | 'classic';
}

export function StationCardSkeleton({
  className = '',
  variant = 'modern',
}: StationCardSkeletonProps) {
  if (variant === 'modern') {
    return (
      <div className={cn('card overflow-hidden', className)}>
        {/* Header Image Skeleton */}
        <Skeleton variant="rectangular" height={96} animation="wave" />

        {/* Content Skeleton */}
        <div className="space-y-4 p-6">
          {/* Title */}
          <div className="space-y-2">
            <Skeleton variant="text" width="80%" height={24} animation="wave" />
            <Skeleton
              variant="rounded"
              width={80}
              height={24}
              animation="wave"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="60%" animation="wave" />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-2">
            <Skeleton variant="rounded" height={40} animation="wave" />
            <Skeleton variant="rounded" height={40} animation="wave" />
            <Skeleton variant="rounded" height={40} animation="wave" />
            <Skeleton variant="rounded" height={40} animation="wave" />
          </div>

          {/* Footer */}
          <Skeleton variant="text" width="50%" animation="wave" />
        </div>

        {/* Button */}
        <div className="border-t border-gray-200 p-6 dark:border-gray-700">
          <Skeleton variant="rounded" height={40} animation="wave" />
        </div>
      </div>
    );
  }

  // Classic variant
  return (
    <div className={cn('card', className)}>
      <div className="space-y-4 p-6">
        <Skeleton variant="text" width="70%" height={24} animation="wave" />
        <Skeleton variant="text" width="100%" animation="wave" />
        <Skeleton variant="text" width="90%" animation="wave" />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Skeleton variant="rounded" height={32} animation="wave" />
          <Skeleton variant="rounded" height={32} animation="wave" />
        </div>
      </div>
    </div>
  );
}

export default StationCardSkeleton;
