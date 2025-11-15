/**
 * Card Skeleton Component
 * Loading state for cards with shimmer animation
 */

'use client';

import { motion } from 'framer-motion';
import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface CardSkeletonProps {
  /** Show image skeleton */
  showImage?: boolean;
  /** Show footer skeleton */
  showFooter?: boolean;
  /** Number of description lines */
  lines?: number;
  /** Custom className */
  className?: string;
}

/**
 * Card skeleton loading state
 */
export function CardSkeleton({
  showImage = true,
  showFooter = true,
  lines = 3,
  className,
}: CardSkeletonProps) {
  return (
    <Card variant="default" className={cn('overflow-hidden', className)}>
      {/* Image Skeleton */}
      {showImage && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      )}

      {/* Content Skeleton */}
      <div className="space-y-4 p-6">
        {/* Title */}
        <div className="relative h-6 w-3/4 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.2,
            }}
          />
        </div>

        {/* Description Lines */}
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'relative h-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-700',
              i === lines - 1 && 'w-5/6'
            )}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.3 + i * 0.1,
              }}
            />
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      {showFooter && (
        <div className="px-6 pb-6">
          <div className="relative h-10 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.5,
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

export default CardSkeleton;
