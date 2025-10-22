/**
 * Optimized Image Component
 *
 * SEO and performance-optimized image component with Next.js Image
 * Includes lazy loading, responsive sizing, and proper alt text
 *
 * @module components/common/OptimizedImage
 */

import Image from 'next/image';
import type { ImageProps } from 'next/image';
import React from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  alt: string; // Make alt required for SEO
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  quality?: number;
}

/**
 * OptimizedImage Component
 *
 * Wraps Next.js Image with SEO best practices:
 * - Required alt text
 * - Lazy loading by default
 * - Responsive sizing
 * - Quality optimization
 * - Mobile-first approach
 *
 * @example
 * <OptimizedImage
 *   src="/images/station.jpg"
 *   alt="Shell Petrol Station on Main Street"
 *   width={800}
 *   height={600}
 *   priority={false}
 * />
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  loading = 'lazy',
  sizes,
  quality = 85,
  className,
  ...props
}) => {
  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || `
    (max-width: 640px) 100vw,
    (max-width: 768px) 90vw,
    (max-width: 1024px) 80vw,
    (max-width: 1280px) 70vw,
    60vw
  `.trim().replace(/\s+/g, ' ');

  // Validate alt text (SEO requirement)
  if (!alt || alt.trim().length === 0) {
    console.warn('OptimizedImage: Missing or empty alt text. This is required for SEO and accessibility.');
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={loading}
      sizes={responsiveSizes}
      quality={quality}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4="
      {...props}
    />
  );
};

/**
 * Hero Image Component
 *
 * Optimized for above-the-fold hero images
 * Uses eager loading and high priority
 */
export const HeroImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    priority={true}
    loading="eager"
    quality={90}
    sizes="100vw"
  />
);

/**
 * Thumbnail Image Component
 *
 * Optimized for small thumbnail images
 * Lower quality for faster loading
 */
export const ThumbnailImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    priority={false}
    loading="lazy"
    quality={75}
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  />
);

/**
 * Generate image alt text from filename
 * Fallback when alt text is not provided
 */
export function generateAltFromFilename(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace hyphens/underscores with spaces
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize words
}

/**
 * Validate image for SEO
 */
export function validateImageSEO(image: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check alt text
  if (!image.alt || image.alt.trim().length === 0) {
    warnings.push('Missing alt text (critical for SEO and accessibility)');
  } else if (image.alt.length < 5) {
    warnings.push('Alt text too short (< 5 characters)');
  } else if (image.alt.length > 125) {
    warnings.push('Alt text too long (> 125 characters)');
  }

  // Check dimensions
  if (!image.width || !image.height) {
    warnings.push('Missing width/height (causes layout shift, affects SEO)');
  }

  // Check file format
  if (image.src.match(/\.(jpg|jpeg|png)$/i)) {
    warnings.push('Consider using WebP or AVIF format for better performance');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}

export default OptimizedImage;
