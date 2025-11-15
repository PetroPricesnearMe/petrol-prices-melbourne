/**
 * Spacing Tokens - Design System
 *
 * 8px grid system for consistent spacing and visual rhythm.
 * All spacing values are multiples of 0.25rem (4px).
 *
 * @module design-system/tokens/spacing
 */

/**
 * Core spacing scale (8px grid)
 *
 * @example
 * ```tsx
 * <div className="p-4"> // 16px padding
 * <div style={{ padding: spacing[4] }}> // 16px padding
 * ```
 */
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px (base unit)
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

/**
 * Component-specific spacing presets
 */
export const componentSpacing = {
  // Button padding
  button: {
    sm: { x: spacing[3], y: spacing[1.5] },
    md: { x: spacing[4], y: spacing[2] },
    lg: { x: spacing[6], y: spacing[3] },
    xl: { x: spacing[8], y: spacing[4] },
  },

  // Card padding
  card: {
    sm: spacing[3],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },

  // Container padding
  container: {
    xs: spacing[4],
    sm: spacing[6],
    md: spacing[8],
    lg: spacing[12],
    xl: spacing[16],
  },

  // Section spacing
  section: {
    xs: spacing[8],
    sm: spacing[12],
    md: spacing[16],
    lg: spacing[20],
    xl: spacing[24],
  },

  // Gap spacing for flex/grid
  gap: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },
} as const;

/**
 * Border radius tokens
 */
export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  DEFAULT: '0.375rem', // 6px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

/**
 * Border width tokens
 */
export const borderWidth = {
  0: '0',
  DEFAULT: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

/**
 * Export all spacing tokens
 */
export const spacingTokens = {
  spacing,
  componentSpacing,
  borderRadius,
  borderWidth,
} as const;

/**
 * Type helpers
 */
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
