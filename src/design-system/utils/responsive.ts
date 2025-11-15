/**
 * Responsive Utilities - Design System
 *
 * Helper functions for responsive design and breakpoint detection.
 *
 * @module design-system/utils/responsive
 */

import { breakpointValues, type Breakpoint } from '../tokens/breakpoints';

/**
 * Check if viewport matches a breakpoint
 *
 * @param breakpoint - Breakpoint to check
 * @returns True if viewport is at or above the breakpoint
 *
 * @example
 * ```tsx
 * if (isBreakpoint('md')) {
 *   // Desktop view
 * }
 * ```
 */
export function isBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpointValues[breakpoint];
}

/**
 * Get current breakpoint
 *
 * @returns Current breakpoint name
 *
 * @example
 * ```tsx
 * const breakpoint = getCurrentBreakpoint(); // 'md'
 * ```
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'sm';

  const width = window.innerWidth;

  if (width >= breakpointValues['2xl']) return '2xl';
  if (width >= breakpointValues.xl) return 'xl';
  if (width >= breakpointValues.lg) return 'lg';
  if (width >= breakpointValues.md) return 'md';
  if (width >= breakpointValues.sm) return 'sm';
  return 'xs';
}

/**
 * Check if device is mobile (below md breakpoint)
 *
 * @returns True if mobile device
 */
export function isMobile(): boolean {
  return !isBreakpoint('md');
}

/**
 * Check if device is tablet (md to lg)
 *
 * @returns True if tablet device
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= breakpointValues.md && width < breakpointValues.lg;
}

/**
 * Check if device is desktop (lg and above)
 *
 * @returns True if desktop device
 */
export function isDesktop(): boolean {
  return isBreakpoint('lg');
}

/**
 * Hook into window resize for responsive behavior
 *
 * @param callback - Function to call on resize
 * @param debounceMs - Debounce delay in milliseconds
 *
 * @example
 * ```tsx
 * onResize(() => {
 *   console.log('Window resized');
 * }, 300);
 * ```
 */
export function onResize(
  callback: () => void,
  debounceMs: number = 150
): () => void {
  if (typeof window === 'undefined') return () => {};

  let timeoutId: NodeJS.Timeout;

  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, debounceMs);
  };

  window.addEventListener('resize', handleResize);

  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('resize', handleResize);
  };
}

/**
 * Get responsive value based on current breakpoint
 *
 * @param values - Object with breakpoint keys and corresponding values
 * @returns Value for current breakpoint
 *
 * @example
 * ```tsx
 * const columns = getResponsiveValue({
 *   xs: 1,
 *   sm: 2,
 *   md: 3,
 *   lg: 4,
 * }); // Returns appropriate column count
 * ```
 */
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>
): T | undefined {
  const currentBp = getCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

  const currentIndex = breakpointOrder.indexOf(currentBp);

  // Look for value at current breakpoint or closest smaller one
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
}

/**
 * Check if user prefers reduced motion
 *
 * @returns True if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark mode
 *
 * @returns True if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Check if device supports touch
 *
 * @returns True if touch is supported
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
