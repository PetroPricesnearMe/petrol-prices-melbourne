/**
 * Custom hooks for Landing Page
 * Reusable logic encapsulated in hooks
 */

import { useRef, useEffect, useMemo, useState } from 'react';
import { useInView } from 'framer-motion';
import type { WebVitalMetric, VitalType, AnimationConfig } from './types';
import { VIEWPORT_CONFIG, VIEWPORT_CONFIG_HERO } from './constants';

// ============================================================================
// Performance Monitoring Hook
// ============================================================================

/**
 * Hook to monitor Core Web Vitals
 * Tracks LCP, FID, CLS and logs them for analytics
 *
 * @param enabled - Whether to enable monitoring (default: production only)
 * @returns void
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   usePerformanceMonitoring();
 *   return <div>Content</div>;
 * }
 * ```
 */
export function usePerformanceMonitoring(enabled = process.env.NODE_ENV === 'production'): void {
  const startTimeRef = useRef<number>(Date.now());
  const observersRef = useRef<PerformanceObserver[]>([]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const handleMetric = (metric: WebVitalMetric, type: VitalType) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vital] ${type}:`, metric.value.toFixed(2), 'ms');
      }

      // Send to analytics in production
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', type, {
          value: Math.round(metric.value),
          event_label: metric.id,
          non_interaction: true,
        });
      }

      // Store in localStorage for debugging
      try {
        const metrics = JSON.parse(localStorage.getItem('web-vitals') || '{}');
        metrics[type] = {
          value: metric.value,
          timestamp: Date.now(),
        };
        localStorage.setItem('web-vitals', JSON.stringify(metrics));
      } catch (error) {
        // Ignore localStorage errors
      }
    };

    // LCP Observer (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          handleMetric(
            {
              name: 'LCP',
              value: lastEntry.startTime,
              id: `lcp-${Date.now()}`,
              startTime: lastEntry.startTime,
            },
            'LCP'
          );
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observersRef.current.push(lcpObserver);
    } catch (error) {
      console.warn('LCP observer not supported');
    }

    // FID Observer (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[];
        entries.forEach((entry) => {
          const delay = entry.processingStart - entry.startTime;
          handleMetric(
            {
              name: 'FID',
              value: delay,
              id: `fid-${Date.now()}`,
              startTime: entry.startTime,
            },
            'FID'
          );
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observersRef.current.push(fidObserver);
    } catch (error) {
      console.warn('FID observer not supported');
    }

    // CLS Observer (Cumulative Layout Shift)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[];
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            handleMetric(
              {
                name: 'CLS',
                value: entry.value,
                id: `cls-${Date.now()}`,
              },
              'CLS'
            );
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observersRef.current.push(clsObserver);
    } catch (error) {
      console.warn('CLS observer not supported');
    }

    // Cleanup function
    return () => {
      observersRef.current.forEach((observer) => {
        observer.disconnect();
      });
      observersRef.current = [];
    };
  }, [enabled]);
}

// ============================================================================
// Animated Section Hook
// ============================================================================

/**
 * Hook for section animations with intersection observer
 * Returns ref and isInView state for triggering animations
 *
 * @param options - Optional viewport configuration
 * @returns Object with ref and isInView boolean
 *
 * @example
 * ```tsx
 * function MySection() {
 *   const { ref, isInView } = useAnimatedSection();
 *   return (
 *     <section ref={ref}>
 *       {isInView && <AnimatedContent />}
 *     </section>
 *   );
 * }
 * ```
 */
export function useAnimatedSection(
  options: {
    once?: boolean;
    margin?: string;
    amount?: number;
  } = VIEWPORT_CONFIG
) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, options);

  return { ref, isInView };
}

// ============================================================================
// Stagger Animation Hook
// ============================================================================

/**
 * Hook to calculate staggered animation delays
 * Useful for animating lists of items with sequential delays
 *
 * @param itemCount - Number of items to animate
 * @param baseDelay - Base delay in seconds (default: 0.1)
 * @returns Array of animation configs with staggered delays
 *
 * @example
 * ```tsx
 * function FeatureList({ features }) {
 *   const animations = useStaggerAnimation(features.length);
 *   return features.map((feature, i) => (
 *     <motion.div key={i} {...animations[i]}>
 *       {feature.title}
 *     </motion.div>
 *   ));
 * }
 * ```
 */
export function useStaggerAnimation(
  itemCount: number,
  baseDelay = 0.1
): AnimationConfig[] {
  return useMemo(
    () =>
      Array.from({ length: itemCount }, (_, index) => ({
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.6,
          delay: index * baseDelay,
        },
      })),
    [itemCount, baseDelay]
  );
}

// ============================================================================
// Prefetch Hook
// ============================================================================

/**
 * Hook to prefetch links on hover for better perceived performance
 * Uses Next.js router prefetch functionality
 *
 * @param enabled - Whether to enable prefetching (default: true)
 * @returns prefetchLink function to call on hover
 *
 * @example
 * ```tsx
 * function NavLink({ href, children }) {
 *   const prefetch = usePrefetch();
 *   return (
 *     <a href={href} onMouseEnter={() => prefetch(href)}>
 *       {children}
 *     </a>
 *   );
 * }
 * ```
 */
export function usePrefetch(enabled = true) {
  const prefetchedLinks = useRef<Set<string>>(new Set());

  const prefetchLink = useMemo(
    () => (href: string) => {
      if (!enabled || prefetchedLinks.current.has(href)) {
        return;
      }

      prefetchedLinks.current.add(href);

      // Use native prefetch
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    },
    [enabled]
  );

  return prefetchLink;
}

// ============================================================================
// Media Query Hook
// ============================================================================

/**
 * Hook to detect media query matches
 * Useful for responsive behavior beyond CSS
 *
 * @param query - Media query string
 * @returns boolean indicating if query matches
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use addEventListener for modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

// ============================================================================
// Reduced Motion Hook
// ============================================================================

/**
 * Hook to detect if user prefers reduced motion
 * Respects accessibility preferences
 *
 * @returns boolean indicating if reduced motion is preferred
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = usePrefersReducedMotion();
 *   return (
 *     <motion.div animate={!prefersReducedMotion ? { scale: 1.1 } : {}}>
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

