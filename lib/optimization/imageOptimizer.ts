/**
 * Image Optimization Utilities
 * Advanced image loading and optimization strategies
 */

/**
 * Generate optimized image URLs
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}
): string {
  const { width, height, quality = 75, format = 'webp' } = options;

  // If using Next.js Image optimization
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  if (format) params.append('fm', format);

  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(
  src: string,
  sizes: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return sizes
    .map((size) => {
      const url = getOptimizedImageUrl(src, { width: size });
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * Lazy load images with Intersection Observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options: IntersectionObserverInit = {}) {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer?.unobserve(img);
            this.images.delete(img);
          }
        });
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01,
        ...options,
      }
    );
  }

  observe(img: HTMLImageElement) {
    if (!this.observer) {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
      return;
    }

    this.images.add(img);
    this.observer.observe(img);
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }

    if (srcset) {
      img.srcset = srcset;
      img.removeAttribute('data-srcset');
    }

    img.classList.add('loaded');
  }

  disconnect() {
    this.observer?.disconnect();
    this.images.clear();
  }
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low') {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  if (priority === 'high') {
    link.setAttribute('fetchpriority', 'high');
  }
  document.head.appendChild(link);
}

/**
 * Progressive image loading with blur-up effect
 */
export class ProgressiveImageLoader {
  load(
    container: HTMLElement,
    placeholder: string,
    fullSize: string,
    onLoad?: () => void
  ) {
    // Load placeholder immediately
    const placeholderImg = new Image();
    placeholderImg.src = placeholder;
    placeholderImg.className = 'placeholder';
    placeholderImg.style.filter = 'blur(10px)';
    container.appendChild(placeholderImg);

    // Load full-size image
    const fullImg = new Image();
    fullImg.src = fullSize;
    fullImg.className = 'full-image';
    fullImg.style.opacity = '0';
    fullImg.style.transition = 'opacity 0.3s ease-in-out';

    fullImg.onload = () => {
      container.appendChild(fullImg);
      setTimeout(() => {
        fullImg.style.opacity = '1';
        setTimeout(() => {
          container.removeChild(placeholderImg);
        }, 300);
      }, 0);
      onLoad?.();
    };
  }
}

/**
 * Convert images to WebP/AVIF on the fly
 */
export function supportsFormat(format: 'webp' | 'avif'): boolean {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  const mimeType = format === 'webp' ? 'image/webp' : 'image/avif';
  return canvas.toDataURL(mimeType).indexOf(`data:${mimeType}`) === 0;
}

/**
 * Get image format based on browser support
 */
export function getBestImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (supportsFormat('avif')) return 'avif';
  if (supportsFormat('webp')) return 'webp';
  return 'jpeg';
}

/**
 * Responsive image component helper
 */
export function getResponsiveImageProps(
  src: string,
  alt: string,
  sizes: string = '100vw'
) {
  const format = getBestImageFormat();
  const srcSet = generateSrcSet(src);

  return {
    src: getOptimizedImageUrl(src, { quality: 75, format }),
    srcSet,
    sizes,
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
}

/**
 * Image sprite optimization
 */
export class SpriteManager {
  private sprites: Map<string, HTMLImageElement> = new Map();

  async loadSprite(name: string, src: string): Promise<HTMLImageElement> {
    if (this.sprites.has(name)) {
      return this.sprites.get(name)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.sprites.set(name, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  getSprite(name: string): HTMLImageElement | undefined {
    return this.sprites.get(name);
  }
}

/**
 * Calculate image dimensions to maintain aspect ratio
 */
export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalWidth / originalHeight;

  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  }

  if (targetHeight && !targetWidth) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }

  return {
    width: targetWidth!,
    height: targetHeight!,
  };
}

// Export singleton instance for lazy loading
export const lazyImageLoader = new LazyImageLoader();

// Export default
export default {
  getOptimizedImageUrl,
  generateSrcSet,
  LazyImageLoader,
  preloadImage,
  ProgressiveImageLoader,
  supportsFormat,
  getBestImageFormat,
  getResponsiveImageProps,
  SpriteManager,
  calculateDimensions,
  lazyImageLoader,
};
