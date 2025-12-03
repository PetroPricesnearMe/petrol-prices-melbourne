/**
 * Image Optimization Utility
 *
 * Provides utilities for optimizing brand logos and images
 * with uniform dimensions, lazy loading, and WebP support
 *
 * @module utils/imageOptimization
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'svg';
  lazy?: boolean;
}

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  sizes?: string;
  srcSet?: string;
}

/**
 * Default optimization options for brand logos
 */
export const DEFAULT_LOGO_OPTIONS: ImageOptimizationOptions = {
  width: 300,
  height: 300,
  quality: 90,
  format: 'webp',
  lazy: true,
};

/**
 * Generate responsive image sizes for different breakpoints
 */
export function generateResponsiveSizes(): string {
  return '(max-width: 640px) 150px, (max-width: 768px) 200px, (max-width: 1024px) 250px, 300px';
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(basePath: string, sizes: number[] = [150, 200, 250, 300]): string {
  return sizes
    .map((size) => `${basePath}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Get optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  options: Partial<ImageOptimizationOptions> = {}
): OptimizedImageProps {
  const opts = { ...DEFAULT_LOGO_OPTIONS, ...options };

  return {
    src,
    alt,
    width: opts.width!,
    height: opts.height!,
    loading: opts.lazy ? 'lazy' : 'eager',
    decoding: 'async',
    sizes: generateResponsiveSizes(),
    className: 'brand-logo-optimized',
  };
}

/**
 * Generate blur placeholder for smooth loading
 */
export function generateBlurDataURL(color: string = '#f3f4f6'): string {
  // Create a simple SVG blur placeholder
  const svg = `
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="${color}"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Preload critical brand images
 */
export function preloadBrandImages(brands: string[]): void {
  if (typeof window === 'undefined') return;

  brands.forEach((brand) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = `/images/brands/${brand.toLowerCase()}.svg`;
    document.head.appendChild(link);
  });
}

/**
 * Calculate aspect ratio padding for responsive images
 */
export function getAspectRatioPadding(width: number, height: number): number {
  return (height / width) * 100;
}

/**
 * Image loading error handler
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackSrc: string = '/images/brands/default-logo.svg'
): void {
  const img = event.currentTarget;
  if (img.src !== fallbackSrc) {
    img.src = fallbackSrc;
  }
}

/**
 * Check if WebP is supported
 */
export function isWebPSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
}

/**
 * Get optimal image format based on browser support
 */
export async function getOptimalFormat(
  originalFormat: string = 'jpg'
): Promise<'webp' | 'jpg' | 'png' | 'svg'> {
  if (originalFormat === 'svg') return 'svg';

  const supportsWebP = await isWebPSupported();
  return supportsWebP ? 'webp' : (originalFormat as 'jpg' | 'png');
}

/**
 * Image optimization configuration for Next.js
 */
export const IMAGE_OPTIMIZATION_CONFIG = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};

/**
 * Performance metrics for image loading
 */
export interface ImageLoadMetrics {
  loadTime: number;
  size: number;
  format: string;
  cached: boolean;
}

/**
 * Track image loading performance
 */
export function trackImageLoad(
  src: string,
  onLoad?: (metrics: ImageLoadMetrics) => void
): void {
  if (typeof window === 'undefined' || !onLoad) return;

  const startTime = performance.now();

  fetch(src, { method: 'HEAD' })
    .then((response) => {
      const loadTime = performance.now() - startTime;
      const size = parseInt(response.headers.get('content-length') || '0', 10);
      const format = response.headers.get('content-type') || 'unknown';
      const cached = response.headers.get('x-cache') === 'HIT';

      onLoad({ loadTime, size, format, cached });
    })
    .catch(() => {
      // Silent fail
    });
}

