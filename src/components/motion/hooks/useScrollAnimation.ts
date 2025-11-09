/**
 * Modern Scroll Animation Hooks
 * Uses Intersection Observer for better performance than scroll listeners
 * Zero-dependency alternative to Framer Motion's useInView
 */

'use client';

import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  /**
   * Threshold (0-1) - What % of element must be visible
   */
  threshold?: number | number[];
  
  /**
   * Root margin - Trigger before element enters viewport
   * Example: '-50px' triggers 50px before element is visible
   */
  rootMargin?: string;
  
  /**
   * Only trigger once (better performance)
   */
  triggerOnce?: boolean;
  
  /**
   * Root element for intersection (default: viewport)
   */
  root?: Element | null;
  
  /**
   * Callback when element enters view
   */
  onEnter?: () => void;
  
  /**
   * Callback when element exits view
   */
  onExit?: () => void;
}

/**
 * Scroll animation hook using Intersection Observer
 * More performant than scroll event listeners
 * 
 * @example
 * const { ref, isInView } = useScrollAnimation({ triggerOnce: true });
 * 
 * return (
 *   <div ref={ref} className={isInView ? 'animate-fade-in' : 'opacity-0'}>
 *     Content
 *   </div>
 * );
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '-50px',
  triggerOnce = true,
  root = null,
  onEnter,
  onExit,
}: UseScrollAnimationOptions = {}) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        
        if (inView) {
          setIsInView(true);
          onEnter?.();
          
          // Disconnect if triggerOnce
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsInView(false);
          onExit?.();
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, root, onEnter, onExit]);

  return { ref, isInView };
}

/**
 * Hook for parallax scroll effects
 * 
 * @example
 * const { ref, progress } = useScrollProgress();
 * 
 * return (
 *   <div 
 *     ref={ref} 
 *     style={{ transform: `translateY(${progress * 100}px)` }}
 *   >
 *     Parallax content
 *   </div>
 * );
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress (0 to 1)
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const progress = Math.max(
        0,
        Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight))
      );
      
      setProgress(progress);
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
}

/**
 * Hook for staggered animations in lists
 * Automatically calculates delay based on index
 * 
 * @example
 * const items = ['item1', 'item2', 'item3'];
 * 
 * return items.map((item, index) => {
 *   const delay = useStaggerDelay(index, 0.1);
 *   return <div style={{ animationDelay: `${delay}s` }}>{item}</div>;
 * });
 */
export function useStaggerDelay(index: number, baseDelay: number = 0.1): number {
  return index * baseDelay;
}

/**
 * Hook for reduced motion preference
 * Respects user's accessibility settings
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * 
 * return (
 *   <motion.div
 *     animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
 *   >
 *     Content
 *   </motion.div>
 * );
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for measuring element dimensions
 * Useful for dynamic animations based on size
 */
export function useElementSize<T extends HTMLElement = HTMLDivElement>(): {
  ref: RefObject<T>;
  width: number;
  height: number;
} {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return { ref, ...dimensions };
}

