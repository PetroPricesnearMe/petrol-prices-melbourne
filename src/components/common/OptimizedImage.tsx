'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

/**
 * Optimized Image Component with Error Handling
 * 
 * Features:
 * - Automatic fallback to placeholder or default image
 * - Better error handling for missing images
 * - Graceful degradation in development
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
  quality = 85,
  sizes,
  fallbackSrc = '/images/fuel-nozzles.jpg',
  onError,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    if (!hasError && imgSrc !== fallbackSrc) {
      console.warn(`Image failed to load: ${imgSrc}, using fallback`);
      setImgSrc(fallbackSrc);
      setHasError(true);
      setIsLoading(false);
      onError?.();
    } else if (hasError) {
      // Even fallback failed, hide image completely
      setIsLoading(false);
    }
  }, [imgSrc, fallbackSrc, hasError, onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // If we're in development and on a network IP, use Next.js Image with unoptimized flag
  // This avoids 400 errors from the image optimization API on network IPs
  const isNetworkIP = process.env.NODE_ENV === 'development' && 
    typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1';

  // Use Next.js Image component (unoptimized on network IP to avoid API errors)
  if (fill) {
    return (
      <div className={`relative ${className || ''}`} style={{ width: '100%', height: '100%' }}>
        {!hasError && (
          <Image
            src={imgSrc}
            alt={alt}
            fill
            className={className}
            priority={priority}
            quality={quality}
            sizes={sizes}
            unoptimized={isNetworkIP}
            onError={handleError}
            onLoad={handleLoad}
            style={{ objectFit: 'cover' }}
            {...props}
          />
        )}
        {hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 flex items-center justify-center">
            <span className="text-white/50 text-sm">Image unavailable</span>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      {!hasError && (
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          quality={quality}
          sizes={sizes}
          unoptimized={isNetworkIP}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
      )}
      {hasError && (
        <div 
          className={`bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center ${className || ''}`}
          style={{ width, height }}
        >
          <span className="text-white/50 text-sm">Image unavailable</span>
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
