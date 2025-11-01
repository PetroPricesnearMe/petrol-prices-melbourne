/**
 * Design System - Token Exports
 * 
 * Central export for all design tokens
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './animations';

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Z-index scale for layering
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
} as const;

/**
 * Type exports
 */
export type Breakpoint = keyof typeof breakpoints;
export type ZIndex = keyof typeof zIndex;

