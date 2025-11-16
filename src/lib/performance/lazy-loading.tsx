/**
 * Lazy Loading Utilities
 *
 * Utilities for implementing lazy loading strategies:
 * - Component lazy loading
 * - Image lazy loading
 * - Route-based code splitting
 * - Dynamic imports with loading states
 *
 * @module lib/performance/lazy-loading
 */

import React, { lazy, Suspense } from 'react';

/**
 * Dynamic import with loading state
 */
export function createLazyComponent(
  importFn: () => Promise<{ default: React.ComponentType<any> }>
): React.LazyExoticComponent<React.ComponentType<any>> {
  return lazy(importFn);
}

/**
 * Lazy load component with Suspense boundary
 */
export function LazyComponent(
  props: {
    importFn: () => Promise<{ default: React.ComponentType<any> }>;
    fallback?: React.ReactNode;
  } & Record<string, unknown>
): React.ReactElement {
  const { importFn, fallback, ...rest } = props;
  const LazyComp = lazy(importFn);

  return (
    <Suspense fallback={fallback || <div>Loading...</div>}>
      <LazyComp {...(rest as any)} />
    </Suspense>
  );
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Lazy load images with Intersection Observer
 */
export function useLazyImage(
  src: string,
  placeholder?: string
): {
  src: string | undefined;
  isLoaded: boolean;
  error: Error | null;
} {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const isIntersecting = useIntersectionObserver(imgRef as React.RefObject<Element>, {
    rootMargin: '50px',
  });

  React.useEffect(() => {
    if (isIntersecting && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, shouldLoad]);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !shouldLoad || !src) {
      return;
    }

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoaded(true);
      setError(null);
    };

    img.onerror = () => {
      setError(new Error(`Failed to load image: ${src}`));
      setIsLoaded(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [shouldLoad, src]);

  return {
    src: shouldLoad ? src : placeholder,
    isLoaded,
    error,
  };
}

/**
 * Preload route for faster navigation
 */
export function preloadRoute(route: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Prefetch the route
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  link.as = 'document';
  document.head.appendChild(link);
}

/**
 * Preload component for faster rendering
 */
export async function preloadComponent<T>(
  importFn: () => Promise<{ default: T }>
): Promise<void> {
  try {
    await importFn();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to preload component:', error);
    }
  }
}

/**
 * Lazy load route with prefetching
 */
export function useRoutePrefetching(routes: string[]): void {
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Prefetch routes when user hovers over links
    const handleMouseEnter = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        try {
          const url = new URL(link.href);
          if (routes.includes(url.pathname)) {
            preloadRoute(url.pathname);
          }
        } catch (error) {
          // Invalid URL, ignore
        }
      }
    };

    // Add event listeners to all links
    const links = document.querySelectorAll('a[href]');
    links.forEach((link) => {
      link.addEventListener('mouseenter', handleMouseEnter);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener('mouseenter', handleMouseEnter);
      });
    };
  }, [routes]);
}


