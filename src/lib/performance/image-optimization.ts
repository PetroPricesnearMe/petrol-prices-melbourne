/**
 * Image Optimization Utilities
 * 
 * Utilities for optimizing images for Core Web Vitals:
 * - LCP optimization (priority loading, preload)
 * - CLS prevention (aspect ratio, dimensions)
 * - Image format optimization (AVIF, WebP)
 * - Responsive image sizing
 * - Lazy loading strategies
 * 
 * @module lib/performance/image-optimization
 */

/**
 * Generate optimized image src with query parameters
 */
export function generateOptimizedImageSrc(
  src: string,
  width?: number,
  quality: number = 85,
  format?: 'avif' | 'webp' | 'jpg' | 'png'
): string {
  if (!src) {
    return '';
  }

  // If it's an external URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // If it's a data URL, return as-is
  if (src.startsWith('data:')) {
    return src;
  }

  // For Next.js Image Optimization API
  const params = new URLSearchParams();
  
  if (width) {
    params.set('w', width.toString());
  }
  
  params.set('q', quality.toString());
  
  if (format) {
    params.set('f', format);
  }

  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

/**
 * Generate responsive image sizes for srcset
 */
export function generateResponsiveSizes(
  baseSrc: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920],
  quality: number = 85
): string {
  return widths
    .map((width) => {
      const optimizedSrc = generateOptimizedImageSrc(baseSrc, width, quality);
      return `${optimizedSrc} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurPlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = '#e5e7eb'
): string {
  // Generate a tiny SVG placeholder
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/></svg>`;

  // Convert to base64
  let base64: string;
  if (typeof window !== 'undefined') {
    base64 = btoa(svg);
  } else {
    // Node.js environment
    base64 = Buffer.from(svg).toString('base64');
  }

  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get optimal image quality based on usage
 */
export function getOptimalQuality(
  usage: 'hero' | 'thumbnail' | 'card' | 'icon' | 'background' = 'card'
): number {
  const qualityMap: Record<string, number> = {
    hero: 90,
    card: 85,
    thumbnail: 80,
    icon: 75,
    background: 70,
  };

  return qualityMap[usage] || 85;
}

/**
 * Get optimal image sizes based on usage
 */
export function getOptimalSizes(usage: 'hero' | 'thumbnail' | 'card' | 'icon' = 'card'): string {
  const sizesMap: Record<string, string> = {
    hero: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    thumbnail: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
    icon: '64px',
  };

  return sizesMap[usage] || sizesMap.card;
}

/**
 * Calculate aspect ratio from width and height
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(width, height);
  const ratioWidth = width / divisor;
  const ratioHeight = height / divisor;

  return `${ratioWidth}/${ratioHeight}`;
}

/**
 * Preload critical image for LCP optimization
 */
export function preloadImage(href: string, as: 'image' = 'image'): void {
  if (typeof document === 'undefined') {
    return;
  }

  // Check if link already exists
  const existingLink = document.querySelector(`link[rel="preload"][href="${href}"]`);
  if (existingLink) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  link.crossOrigin = 'anonymous';
  
  // Add fetchpriority for LCP images
  if (as === 'image') {
    link.setAttribute('fetchpriority', 'high');
  }

  document.head.appendChild(link);
}

/**
 * Check if image is likely to be LCP element
 */
export function isLikelyLCPElement(element: HTMLImageElement): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // LCP elements are usually:
  // - Large (at least 25% of viewport)
  // - Visible in the viewport
  // - Above the fold
  const isLarge = rect.width * rect.height > viewportWidth * viewportHeight * 0.25;
  const isVisible = rect.top >= 0 && rect.top < viewportHeight;
  const isAboveFold = rect.top < viewportHeight * 0.5;

  return isLarge && isVisible && isAboveFold;
}

/**
 * Optimize image loading strategy
 */
export function getImageLoadingStrategy(
  isHero: boolean = false,
  isAboveFold: boolean = true,
  isLCPCandidate: boolean = false
): {
  priority: boolean;
  loading: 'lazy' | 'eager';
  fetchPriority: 'high' | 'auto' | 'low';
} {
  // Hero images and LCP candidates should load with priority
  if (isHero || isLCPCandidate) {
    return {
      priority: true,
      loading: 'eager',
      fetchPriority: 'high',
    };
  }

  // Above-fold images should load normally
  if (isAboveFold) {
    return {
      priority: false,
      loading: 'eager',
      fetchPriority: 'auto',
    };
  }

  // Below-fold images should lazy load
  return {
    priority: false,
    loading: 'lazy',
    fetchPriority: 'auto',
  };
}

