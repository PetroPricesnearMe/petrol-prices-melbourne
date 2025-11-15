/**
 * BackToTop - Scroll to Top Button
 *
 * A floating button that appears when user scrolls down,
 * allowing quick navigation back to the top of the page.
 *
 * Features:
 * - Smooth scroll animation
 * - Appears after scrolling threshold
 * - Accessible with keyboard support
 * - Respects reduced motion preferences
 *
 * @component
 * @example
 * ```tsx
 * <BackToTop threshold={400} />
 * ```
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

import { cn } from '@/design-system/utils';
import type { ComponentBaseProps } from '@/types';

/**
 * BackToTop Props
 */
export interface BackToTopProps extends ComponentBaseProps {
  /**
   * Scroll threshold in pixels before button appears
   * @default 400
   */
  threshold?: number;

  /**
   * Custom scroll behavior
   * @default 'smooth'
   */
  behavior?: ScrollBehavior;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * BackToTop Component
 *
 * Displays a floating button that scrolls to top when clicked.
 * Only appears after scrolling past the threshold.
 */
export const BackToTop = React.memo<BackToTopProps>(
  ({ threshold = 400, behavior = 'smooth', className, ...props }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] =
      React.useState(false);

    // Check for reduced motion preference
    React.useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Handle scroll visibility
    React.useEffect(() => {
      const handleScroll = () => {
        setIsVisible(window.scrollY > threshold);
      };

      // Check initial state
      handleScroll();

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    // Handle scroll to top
    const handleClick = React.useCallback(() => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : behavior,
      });
    }, [behavior, prefersReducedMotion]);

    // Handle keyboard navigation
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: 'easeOut',
            }}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn(
              'fixed',
              'bottom-4 right-4',
              'z-50',
              'flex items-center justify-center',
              'h-12 w-12',
              'bg-primary-600 text-white',
              'rounded-full',
              'shadow-lg',
              'hover:bg-primary-700',
              'active:bg-primary-800',
              'active:scale-95',
              'focus:outline-none',
              'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'transition-colors',
              'group',
              className
            )}
            aria-label="Back to top"
            type="button"
            {...props}
          >
            <ArrowUp
              className="h-5 w-5 transition-transform group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>
    );
  }
);

BackToTop.displayName = 'BackToTop';
