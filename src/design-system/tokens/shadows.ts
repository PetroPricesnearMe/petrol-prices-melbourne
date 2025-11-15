/**
 * Shadow Tokens - Design System
 *
 * Elevation system using box shadows.
 * Creates depth and visual hierarchy.
 *
 * @module design-system/tokens/shadows
 */

/**
 * Box shadow scales for elevation
 * Higher numbers = more elevation
 */
export const boxShadow = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

/**
 * Glow effects for interactive elements
 */
export const glowShadow = {
  primary: '0 0 20px rgb(59 130 246 / 0.4)',
  secondary: '0 0 20px rgb(16 185 129 / 0.4)',
  accent: '0 0 20px rgb(249 115 22 / 0.4)',
  success: '0 0 20px rgb(16 185 129 / 0.4)',
  error: '0 0 20px rgb(239 68 68 / 0.4)',
  warning: '0 0 20px rgb(245 158 11 / 0.4)',
} as const;

/**
 * Component-specific shadow presets
 */
export const componentShadows = {
  card: {
    resting: boxShadow.sm,
    hover: boxShadow.md,
    active: boxShadow.xs,
  },
  button: {
    resting: boxShadow.xs,
    hover: boxShadow.sm,
    active: 'none',
  },
  modal: boxShadow['2xl'],
  dropdown: boxShadow.lg,
  tooltip: boxShadow.md,
  navbar: boxShadow.sm,
  footer: 'inset 0 1px 0 0 rgb(0 0 0 / 0.05)',
} as const;

/**
 * Text shadow for enhanced readability
 */
export const textShadow = {
  none: 'none',
  sm: '0 1px 2px rgb(0 0 0 / 0.5)',
  DEFAULT: '0 2px 4px rgb(0 0 0 / 0.5)',
  lg: '0 4px 8px rgb(0 0 0 / 0.5)',
} as const;

/**
 * Export all shadow tokens
 */
export const shadows = {
  boxShadow,
  glowShadow,
  componentShadows,
  textShadow,
} as const;

/**
 * Type helpers
 */
export type BoxShadow = keyof typeof boxShadow;
export type GlowShadow = keyof typeof glowShadow;
