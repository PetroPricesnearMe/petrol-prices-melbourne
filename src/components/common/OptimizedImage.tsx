/**
 * Optimized Image Component
 *
 * Production-ready image component optimized for Core Web Vitals:
 * - LCP optimization (priority loading, preload)
 * - CLS prevention (aspect ratio, dimensions)
 * - Image format optimization (AVIF, WebP)
 * - Responsive image sizing
 * - Lazy loading strategies
 * - Blur placeholders
 * - Error handling
 *
 * Performance Features:
 * - Automatic format optimization (AVIF > WebP > JPG)
 * - Responsive image sizing
 * - Lazy loading for below-fold images
 * - Priority loading for hero/LCP images
 * - Blur placeholders for better perceived performance
 * - Aspect ratio preservation to prevent CLS
 *
 * @module components/common/OptimizedImage
 */

'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

import {
  generateBlurPlaceholder,
  getOptimalQuality,
  getOptimalSizes,
  getImageLoadingStrategy,
  preloadImage,
  isLikelyLCPElement,
} from '@/lib/performance/image-optimization';
import { cn } from '@/lib/utils';

/**
 * Optimized Image Props
 */
export interface OptimizedImageProps {
  /**
   * Image source URL
   */
  src: string;

  /**
   * Image alt text (required for accessibility)
   */
  alt: string;

  /**
   * Image width
   */
  width?: number;

  /**
   * Image height
   */
  height?: number;

  /**
   * Fill container (use with aspect ratio)
   */
  fill?: boolean;

  /**
   * Image quality (1-100, default: 85)
   */
  quality?: number;

  /**
   * Image priority (for LCP optimization)
   */
  priority?: boolean;

  /**
   * Loading strategy
   */
  loading?: 'lazy' | 'eager';

  /**
   * Fetch priority
   */
  fetchPriority?: 'high' | 'auto' | 'low';

  /**
   * Image usage type (affects quality and sizing)
   */
  usage?: 'hero' | 'thumbnail' | 'card' | 'icon' | 'background';

  /**
   * Responsive sizes string
   */
  sizes?: string;

  /**
   * Aspect ratio (e.g., "16/9")
   */
  aspectRatio?: string;

  /**
   * Object fit
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

  /**
   * Blur placeholder
   */
  blurDataURL?: string;

  /**
   * Show loading skeleton
   */
  showSkeleton?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom style
   */
  style?: React.CSSProperties;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Load handler
   */
  onLoad?: () => void;

  /**
   * Error handler
   */
  onError?: (error: Error) => void;
}

/**
 * Optimized Image Component
 *
 * Production-ready image component with Core Web Vitals optimization
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  quality,
  priority = false,
  loading,
  fetchPriority,
  usage = 'card',
  sizes,
  aspectRatio,
  objectFit = 'cover',
  blurDataURL,
  showSkeleton = true,
  className,
  style,
  onClick,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Determine optimal quality based on usage
  const optimalQuality = quality ?? getOptimalQuality(usage);

  // Determine optimal sizes based on usage
  const optimalSizes =
    sizes ?? getOptimalSizes(usage === 'background' ? 'hero' : usage);

  // Determine loading strategy
  const loadingStrategy = getImageLoadingStrategy(
    priority || usage === 'hero',
    !priority,
    priority
  );

  // Use provided loading strategy or determine automatically
  const finalLoading = loading ?? loadingStrategy.loading;
  const finalFetchPriority = fetchPriority ?? loadingStrategy.fetchPriority;

  // Generate blur placeholder
  const defaultBlurDataURL =
    blurDataURL ?? generateBlurPlaceholder(width || 10, height || 10);

  // Preload image if it's a priority/LCP image
  useEffect(() => {
    if (priority && src) {
      preloadImage(src);
    }
  }, [priority, src]);

  // Check if image is likely LCP element
  useEffect(() => {
    if (imageRef.current && !priority) {
      const isLCP = isLikelyLCPElement(imageRef.current);
      if (isLCP) {
        preloadImage(src);
      }
    }
  }, [src, priority]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  // Handle image error
  const handleError = (error: Error) => {
    setHasError(true);
    setIsLoaded(false);
    onError?.(error);

    if (process.env.NODE_ENV === 'development') {
      console.error('Image failed to load:', src, error);
    }
  };

  // Calculate aspect ratio style
  const aspectRatioStyle = aspectRatio ? { aspectRatio, ...style } : style;

  // Render error state
  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-200 dark:bg-gray-700',
          aspectRatio && `aspect-[${aspectRatio}]`,
          className
        )}
        style={aspectRatioStyle}
      >
        <div className="p-4 text-center">
          <svg
            className="mx-auto mb-2 h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Failed to load image
          </p>
        </div>
      </div>
    );
  }

  // Render image with Next.js Image component
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={aspectRatioStyle}
    >
      {/* Loading skeleton */}
      {showSkeleton && !isLoaded && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700',
            'flex items-center justify-center'
          )}
          aria-hidden="true"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 dark:border-gray-600" />
        </div>
      )}

      {/* Next.js Image component */}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        quality={optimalQuality}
        priority={priority || loadingStrategy.priority}
        loading={finalLoading}
        fetchPriority={finalFetchPriority}
        sizes={optimalSizes}
        placeholder="blur"
        blurDataURL={defaultBlurDataURL}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          onClick && 'cursor-pointer',
          `object-${objectFit}`
        )}
        style={{
          objectFit,
          ...style,
        }}
        onLoad={handleLoad}
        onError={() => handleError(new Error(`Failed to load image: ${src}`))}
        onClick={onClick}
        // Prevent layout shift
        unoptimized={false}
      />
    </div>
  );
}

/**
 * Hero Image Component (optimized for LCP)
 */
export function HeroImage(
  props: Omit<OptimizedImageProps, 'priority' | 'usage'>
) {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      usage="hero"
      loading="eager"
      fetchPriority="high"
    />
  );
}

/**
 * Card Image Component (optimized for cards)
 */
export function CardImage(props: Omit<OptimizedImageProps, 'usage'>) {
  return (
    <OptimizedImage
      {...props}
      usage="card"
      loading="lazy"
      fetchPriority="auto"
    />
  );
}

/**
 * Thumbnail Image Component (optimized for thumbnails)
 */
export function ThumbnailImage(props: Omit<OptimizedImageProps, 'usage'>) {
  return (
    <OptimizedImage
      {...props}
      usage="thumbnail"
      loading="lazy"
      fetchPriority="auto"
    />
  );
}
