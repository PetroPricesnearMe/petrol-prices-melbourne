/**
 * Optimized Next.js Image Component
 * Provides consistent image optimization across the app
 * Automatically handles priority for hero images
 */

'use client';

import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  /**
   * Mark as hero/above-fold image for priority loading
   * Only use for images visible without scrolling
   */
  isHero?: boolean;
  /**
   * Show loading skeleton
   */
  showSkeleton?: boolean;
  /**
   * Custom skeleton className
   */
  skeletonClassName?: string;
}

/**
 * Optimized Image Component with automatic lazy loading
 * and priority handling for hero images
 */
export function OptimizedImage({
  isHero = false,
  showSkeleton = true,
  skeletonClassName,
  className,
  alt,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {showSkeleton && !isLoaded && (
        <div
          className={
            skeletonClassName ||
            'absolute inset-0 animate-pulse rounded bg-gray-200 dark:bg-gray-700'
          }
        />
      )}
      <Image
        {...props}
        alt={alt}
        className={className}
        priority={isHero}
        loading={isHero ? undefined : 'lazy'}
        quality={isHero ? 90 : 75}
        onLoad={() => setIsLoaded(true)}
        placeholder={props.placeholder || 'blur'}
        blurDataURL={
          props.blurDataURL ||
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2UwZTBlMCIvPjwvc3ZnPg=='
        }
      />
    </div>
  );
}

/**
 * Logo image with specific optimizations
 */
export function OptimizedLogo(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      quality={100}
      priority={props.priority || props.isHero}
    />
  );
}

/**
 * Background image with specific optimizations
 */
export function OptimizedBackground(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      fill
      style={{ objectFit: 'cover', ...props.style }}
      sizes={props.sizes || '100vw'}
    />
  );
}
