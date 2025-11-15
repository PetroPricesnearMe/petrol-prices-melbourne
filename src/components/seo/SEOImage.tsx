/**
 * SEO-Optimized Image Component
 *
 * Enhanced Next.js Image component with:
 * - Automatic lazy loading
 * - Priority loading for LCP images
 * - Responsive sizing
 * - Blur placeholders
 * - Core Web Vitals optimization
 * - Proper alt text handling
 * - Schema.org ImageObject support
 *
 * @module components/seo/SEOImage
 */

'use client';

import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import {
  calculateAspectRatio,
  generateBlurPlaceholder,
} from '@/lib/performance/image-optimization';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface SEOImageProps extends Omit<ImageProps, 'alt'> {
  /**
   * Alt text for accessibility and SEO (REQUIRED)
   */
  alt: string;

  /**
   * Is this a hero/LCP image?
   * Enables priority loading and eager fetching
   */
  isHero?: boolean;

  /**
   * Is this above the fold?
   * Enables priority loading
   */
  isAboveFold?: boolean;

  /**
   * Show loading skeleton
   */
  showSkeleton?: boolean;

  /**
   * Skeleton class name
   */
  skeletonClassName?: string;

  /**
   * Caption for the image (for SEO)
   */
  caption?: string;

  /**
   * Credit/attribution for the image
   */
  credit?: string;

  /**
   * Generate ImageObject schema
   */
  generateSchema?: boolean;

  /**
   * Image dimensions for CLS prevention
   */
  aspectRatio?: string;

  /**
   * Quality (1-100)
   * Default: 85 for regular images, 90 for hero images
   */
  quality?: number;

  /**
   * Responsive sizes
   */
  sizes?: string;

  /**
   * Object fit
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

  /**
   * Container class name
   */
  containerClassName?: string;

  /**
   * Loading error callback
   */
  onError?: () => void;

  /**
   * Loading complete callback
   */
  onLoad?: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * SEO-Optimized Image Component
 *
 * Usage:
 * ```tsx
 * // Hero image (LCP)
 * <SEOImage
 *   src="/hero.jpg"
 *   alt="Hero banner showing..."
 *   width={1920}
 *   height={1080}
 *   isHero
 *   priority
 * />
 *
 * // Regular image (lazy loaded)
 * <SEOImage
 *   src="/image.jpg"
 *   alt="Description of image"
 *   width={800}
 *   height={600}
 *   sizes="(max-width: 768px) 100vw, 50vw"
 * />
 *
 * // With caption
 * <SEOImage
 *   src="/photo.jpg"
 *   alt="Photo description"
 *   width={600}
 *   height={400}
 *   caption="Photo taken at..."
 *   credit="Photo by John Doe"
 * />
 * ```
 */
export function SEOImage({
  alt,
  isHero = false,
  isAboveFold = false,
  showSkeleton = true,
  skeletonClassName,
  caption,
  credit,
  generateSchema = false,
  aspectRatio,
  quality,
  sizes,
  objectFit = 'cover',
  containerClassName,
  onError: onErrorCallback,
  onLoad: onLoadCallback,
  className,
  priority,
  loading,
  placeholder,
  blurDataURL,
  width,
  height,
  fill,
  ...props
}: SEOImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Determine priority loading
  const shouldPriority = priority ?? (isHero || isAboveFold);

  // Determine quality
  const imageQuality = quality ?? (isHero ? 90 : 85);

  // Determine sizes
  const imageSizes =
    sizes ??
    (isHero
      ? '100vw'
      : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw');

  // Calculate aspect ratio for CLS prevention
  const calculatedAspectRatio =
    aspectRatio ||
    (width && height && !fill
      ? calculateAspectRatio(Number(width), Number(height))
      : undefined);

  // Generate blur placeholder
  const generatedBlurDataURL =
    blurDataURL ||
    (width && height && !fill
      ? generateBlurPlaceholder(Number(width), Number(height))
      : undefined);

  // Handle load event
  const handleLoad = () => {
    setIsLoaded(true);
    onLoadCallback?.();
  };

  // Handle error event
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    onErrorCallback?.();
  };

  // Preload hero images
  useEffect(() => {
    if (isHero && typeof props.src === 'string') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = props.src;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [isHero, props.src]);

  return (
    <figure
      className={cn('relative', containerClassName)}
      style={
        calculatedAspectRatio
          ? { aspectRatio: calculatedAspectRatio }
          : undefined
      }
    >
      {/* Loading skeleton */}
      {showSkeleton && !isLoaded && !hasError && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
            skeletonClassName
          )}
          aria-hidden="true"
        />
      )}

      {/* Image */}
      {!hasError && (
        <Image
          {...props}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          quality={imageQuality}
          sizes={imageSizes}
          priority={shouldPriority}
          loading={shouldPriority ? 'eager' : loading || 'lazy'}
          placeholder={placeholder || (generatedBlurDataURL ? 'blur' : 'empty')}
          blurDataURL={generatedBlurDataURL}
          fetchPriority={shouldPriority ? 'high' : 'auto'}
          decoding="async"
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            objectFit && `object-${objectFit}`,
            className
          )}
          style={{
            ...props.style,
            aspectRatio: calculatedAspectRatio,
          }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <div className="p-4 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Failed to load image
            </p>
          </div>
        </div>
      )}

      {/* Caption */}
      {(caption || credit) && (
        <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {caption && <span className="block">{caption}</span>}
          {credit && (
            <span className="mt-1 block text-xs italic">{credit}</span>
          )}
        </figcaption>
      )}

      {/* Schema.org ImageObject */}
      {generateSchema && isLoaded && !hasError && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ImageObject',
              contentUrl: typeof props.src === 'string' ? props.src : undefined,
              description: alt,
              width: width?.toString(),
              height: height?.toString(),
              caption: caption,
              creditText: credit,
            }),
          }}
        />
      )}
    </figure>
  );
}

// ============================================================================
// Specialized Image Components
// ============================================================================

/**
 * Hero Image Component
 * Optimized for LCP (Largest Contentful Paint)
 */
export function HeroImage(props: Omit<SEOImageProps, 'isHero'>) {
  return <SEOImage {...props} isHero priority />;
}

/**
 * Logo Image Component
 * Optimized for branding and accessibility
 */
export function LogoImage({
  alt,
  ...props
}: Omit<SEOImageProps, 'loading' | 'priority'>) {
  return (
    <SEOImage
      {...props}
      alt={alt || 'Company logo'}
      priority
      showSkeleton={false}
      objectFit="contain"
    />
  );
}

/**
 * Avatar Image Component
 * Optimized for user avatars
 */
export function AvatarImage({
  alt,
  ...props
}: Omit<SEOImageProps, 'loading' | 'objectFit'>) {
  return (
    <SEOImage
      {...props}
      alt={alt || 'User avatar'}
      objectFit="cover"
      className={cn('rounded-full', props.className)}
    />
  );
}

/**
 * Thumbnail Image Component
 * Optimized for small preview images
 */
export function ThumbnailImage(props: Omit<SEOImageProps, 'quality'>) {
  return <SEOImage {...props} quality={75} objectFit="cover" />;
}

/**
 * Gallery Image Component
 * Optimized for image galleries with lazy loading
 */
export function GalleryImage({
  index,
  ...props
}: SEOImageProps & { index?: number }) {
  // First few images get higher priority
  const isEarlyImage = index !== undefined && index < 4;

  return (
    <SEOImage
      {...props}
      isAboveFold={isEarlyImage}
      quality={isEarlyImage ? 85 : 75}
    />
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate responsive image sizes string
 */
export function generateResponsiveSizes(breakpoints: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  default: string;
}): string {
  const sizes: string[] = [];

  if (breakpoints.mobile) {
    sizes.push(`(max-width: 640px) ${breakpoints.mobile}`);
  }
  if (breakpoints.tablet) {
    sizes.push(`(max-width: 1024px) ${breakpoints.tablet}`);
  }
  if (breakpoints.desktop) {
    sizes.push(`(max-width: 1536px) ${breakpoints.desktop}`);
  }
  sizes.push(breakpoints.default);

  return sizes.join(', ');
}

/**
 * Get optimized image quality based on size
 */
export function getOptimizedQuality(width: number): number {
  if (width < 400) return 75;
  if (width < 800) return 80;
  if (width < 1200) return 85;
  return 90;
}
