/**
 * Performance Optimization Hooks
 *
 * Custom hooks for performance monitoring and optimization
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Hook to measure component render time
 */
export function useRenderTime(
  componentName: string,
  enabled = process.env.NODE_ENV === 'development'
) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (renderTime > 16) {
      // More than one frame (60fps)
      console.warn(
        `[Performance] ${componentName} render #${renderCount.current} took ${renderTime.toFixed(2)}ms`
      );
    }

    startTime.current = performance.now();
  });
}

/**
 * Hook to detect expensive renders
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: unknown; to: unknown }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log('[WhyDidYouUpdate]', name, changedProps);
      }
    }

    previousProps.current = props;
  });
}

/**
 * Debounced callback hook
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttled callback hook
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        }
      },
      limit - (Date.now() - lastRan.current)
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [node, setNode] = React.useState<Element | null>(null);

  const observer = useMemo(
    () =>
      typeof window !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
          }, options)
        : null,
    [options.threshold, options.root, options.rootMargin]
  );

  useEffect(() => {
    if (!observer || !node) return;

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [observer, node]);

  const ref = useCallback((node: Element | null) => {
    setNode(node);
  }, []);

  return [ref, isIntersecting];
}

/**
 * Previous value hook
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * RAF (RequestAnimationFrame) hook for smooth animations
 */
export function useAnimationFrame(
  callback: (deltaTime: number) => void,
  deps: React.DependencyList = []
) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, deps);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
}

/**
 * Hook to detect if component is mounted
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}

// Re-export React for convenience
import React from 'react';
