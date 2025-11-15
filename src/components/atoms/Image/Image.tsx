/**
 * Optimized Image Component (Atom)
 * Next.js Image with automatic optimization and lazy loading
 * Prevents CLS and optimizes LCP
 */

'use client';

import type { ImageProps as NextImageProps } from 'next/image';
import NextImage from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

export interface OptimizedImageProps extends Omit<NextImageProps, 'onLoad'> {
  /**
   * Is this a hero/LCP image?
   * @default false
   */
  isHero?: boolean;

  /**
   * Show loading skeleton
   * @default true
   */
  showSkeleton?: boolean;

  /**
   * Custom skeleton className
   */
  skeletonClassName?: string;

  /**
   * Aspect ratio (e.g., '16/9', '4/3')
   */
  aspectRatio?: string;

  /**
   * Callback when image loads
   */
  onLoad?: () => void;
}

const DEFAULT_BLUR_DATA =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=';

/**
 * Optimized image component for Next.js
 * Automatically handles:
 * - Lazy loading (except hero images)
 * - WebP/AVIF conversion
 * - Responsive sizing
 * - Blur placeholders
 * - CLS prevention
 *
 * @example
 * <Image
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={630}
 *   isHero
 * />
 */
export function Image({
  isHero = false,
  showSkeleton = true,
  skeletonClassName,
  aspectRatio,
  onLoad,
  className,
  priority,
  quality,
  placeholder = 'blur',
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Auto-configure for hero images
  const isPriority = priority ?? isHero;
  const imageQuality = quality ?? (isHero ? 90 : 75);

  // Default responsive sizes
  const defaultSizes =
    props.sizes ||
    (props.fill
      ? '100vw'
      : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw');

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Loading skeleton */}
      {showSkeleton && !isLoaded && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700',
            skeletonClassName
          )}
          aria-hidden="true"
        />
      )}

      {/* Optimized Next.js Image */}
      <NextImage
        {...props}
        priority={isPriority}
        quality={imageQuality}
        sizes={defaultSizes}
        placeholder={placeholder}
        blurDataURL={
          blurDataURL ||
          (placeholder === 'blur' ? DEFAULT_BLUR_DATA : undefined)
        }
        onLoad={handleLoad}
        loading={isPriority ? undefined : 'lazy'}
        fetchPriority={isHero ? 'high' : 'auto'}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          props.className
        )}
      />
    </div>
  );
}

/**
 * Hero image variant
 * Automatically configured for LCP optimization
 */
export function HeroImage(props: Omit<OptimizedImageProps, 'isHero'>) {
  return <Image {...props} isHero priority />;
}

/**
 * Avatar image variant
 */
export function Avatar({
  size = 48,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & { size?: number }) {
  return (
    <Image
      {...props}
      width={size}
      height={size}
      className={cn('rounded-full', props.className)}
    />
  );
}
