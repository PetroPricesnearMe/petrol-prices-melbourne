/**
 * LazyImage Component
 *
 * Intersection Observer-based lazy loading for images
 * Optimizes performance and reduces LCP (Largest Contentful Paint)
 *
 * Features:
 * - Intersection Observer API for efficient lazy loading
 * - Blur-up placeholder effect
 * - Error handling with fallback
 * - Progressive loading states
 * - Responsive image sizing
 * - Accessibility compliant
 */

import React, { useState, useEffect, useRef } from 'react';

import { cn } from '@/styles/system/css-in-js';
import './LazyImage.css';

export interface LazyImageProps {
  /** Image source URL */
  src: string;
  /** Alt text (required for accessibility) */
  alt: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** CSS class names */
  className?: string;
  /** Placeholder image or color */
  placeholder?: string;
  /** Object fit style */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /** Intersection observer root margin (affects when image loads) */
  rootMargin?: string;
  /** Loading threshold (0-1) */
  threshold?: number;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Priority loading (disables lazy loading) */
  priority?: boolean;
  /** Fallback image on error */
  fallbackSrc?: string;
  /** Aspect ratio (e.g., "16/9") */
  aspectRatio?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=',
  objectFit = 'cover',
  rootMargin = '50px',
  threshold = 0.01,
  onLoad,
  onError,
  priority = false,
  fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=',
  aspectRatio,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // If priority loading, skip intersection observer
    if (priority) {
      setIsInView(true);
      setCurrentSrc(src);
      return;
    }

    // Create intersection observer
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin,
      threshold,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(src);

          // Disconnect observer after image is in view
          if (observerRef.current && imgRef.current) {
            observerRef.current.unobserve(imgRef.current);
          }
        }
      });
    }, options);

    // Start observing
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, priority, rootMargin, threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setCurrentSrc(fallbackSrc);
    onError?.(new Error(`Failed to load image: ${src}`));
  };

  // Generate aspect ratio class
  const getAspectRatioClass = () => {
    if (aspectRatio) {
      const ratio = aspectRatio.replace('/', '-');
      return `lazy-image-container--${ratio}`;
    }
    if (width && height) {
      const ratio = `${width}-${height}`;
      return `lazy-image-container--${ratio}`;
    }
    return '';
  };

  return (
    <div
      className={cn('lazy-image-container', getAspectRatioClass(), className)}
      data-loaded={isLoaded}
      data-error={hasError}
    >
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          'lazy-image',
          isLoaded && 'lazy-image--loaded',
          hasError && 'lazy-image--error',
          `lazy-image--${objectFit}`
        )}
        onLoad={handleLoad}
        onError={handleError}
        aria-label={alt}
      />

      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="lazy-image-skeleton" aria-hidden="true">
          <div className="lazy-image-skeleton-shimmer" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="lazy-image-error" role="img" aria-label="Image failed to load">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="lazy-image-error-icon"
            aria-hidden="true"
          >
            <path
              d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
              fill="currentColor"
              opacity="0.3"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
