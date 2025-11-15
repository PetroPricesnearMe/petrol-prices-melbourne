/**
 * Lazy Loading Utilities
 * Intersection Observer based lazy loading helpers
 */

/**
 * Options for lazy loading
 */
export interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook-like function to create an Intersection Observer for lazy loading
 */
export function createLazyObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: LazyLoadOptions = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    {
      threshold,
      rootMargin,
    }
  );
}

/**
 * Lazy load images using Intersection Observer
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  options?: LazyLoadOptions
): void {
  const dataSrc = img.dataset.src;
  const dataSrcset = img.dataset.srcset;

  if (!dataSrc && !dataSrcset) return;

  const observer = createLazyObserver((entry) => {
    const target = entry.target as HTMLImageElement;

    if (dataSrc) {
      target.src = dataSrc;
      target.removeAttribute('data-src');
    }

    if (dataSrcset) {
      target.srcset = dataSrcset;
      target.removeAttribute('data-srcset');
    }

    target.classList.remove('lazy');
    target.classList.add('lazy-loaded');
  }, options);

  if (observer) {
    observer.observe(img);
  } else {
    // Fallback for browsers without Intersection Observer
    if (dataSrc) img.src = dataSrc;
    if (dataSrcset) img.srcset = dataSrcset;
  }
}

/**
 * Batch lazy load multiple images
 */
export function lazyLoadImages(
  selector: string = 'img[data-src], img[data-srcset]',
  options?: LazyLoadOptions
): void {
  if (typeof document === 'undefined') return;

  const images = document.querySelectorAll<HTMLImageElement>(selector);
  images.forEach((img) => lazyLoadImage(img, options));
}

/**
 * Lazy load component when it enters viewport
 */
export function lazyLoadComponent(
  element: HTMLElement,
  loadFn: () => void | Promise<void>,
  options?: LazyLoadOptions
): () => void {
  const observer = createLazyObserver(async () => {
    await loadFn();
  }, options);

  if (observer) {
    observer.observe(element);
    return () => observer.unobserve(element);
  } else {
    // Immediate load if no IntersectionObserver
    loadFn();
    return () => {};
  }
}

/**
 * Preload images that will be shown soon
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        })
    )
  );
}
