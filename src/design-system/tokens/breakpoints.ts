/**
 * Breakpoint Tokens - Design System
 *
 * Responsive breakpoints for mobile-first design.
 * Use these for consistent responsive behavior across the app.
 *
 * @module design-system/tokens/breakpoints
 */

/**
 * Breakpoint values (mobile-first)
 */
export const breakpoints = {
  xs: '475px', // Extra small devices
  sm: '640px', // Small tablets
  md: '768px', // Tablets
  lg: '1024px', // Laptops
  xl: '1280px', // Desktops
  '2xl': '1536px', // Large screens
} as const;

/**
 * Numeric breakpoint values (for JS usage)
 */
export const breakpointValues = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Media query helpers
 *
 * @example
 * ```tsx
 * const isMobile = window.matchMedia(mediaQueries.sm).matches;
 * ```
 */
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
} as const;

/**
 * Max-width media queries (for range targeting)
 */
export const maxMediaQueries = {
  xs: `(max-width: ${breakpointValues.xs - 1}px)`,
  sm: `(max-width: ${breakpointValues.sm - 1}px)`,
  md: `(max-width: ${breakpointValues.md - 1}px)`,
  lg: `(max-width: ${breakpointValues.lg - 1}px)`,
  xl: `(max-width: ${breakpointValues.xl - 1}px)`,
  '2xl': `(max-width: ${breakpointValues['2xl'] - 1}px)`,
} as const;

/**
 * Container max-widths for each breakpoint
 */
export const containerMaxWidth = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
} as const;

/**
 * Type helpers
 */
export type Breakpoint = keyof typeof breakpoints;
export type MediaQuery = keyof typeof mediaQueries;
