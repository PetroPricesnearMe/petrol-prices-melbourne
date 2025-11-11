/**
 * Typography Tokens - Design System
 * 
 * Responsive font sizes with proper line heights and letter spacing.
 * Follows a modular scale for visual hierarchy.
 * 
 * @module design-system/tokens/typography
 */

/**
 * Font families with fallbacks
 */
export const fontFamily = {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  mono: [
    'Fira Code',
    'Consolas',
    'Monaco',
    'Courier New',
    'monospace',
  ],
} as const;

/**
 * Font weights
 */
export const fontWeight = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

/**
 * Font sizes with line heights and letter spacing
 * Each size is optimized for readability and accessibility
 */
export const fontSize = {
  xs: {
    size: '0.75rem',      // 12px
    lineHeight: '1rem',   // 16px
    letterSpacing: '0.025em',
  },
  sm: {
    size: '0.875rem',     // 14px
    lineHeight: '1.25rem', // 20px
    letterSpacing: '0.016em',
  },
  base: {
    size: '1rem',         // 16px
    lineHeight: '1.5rem',  // 24px
    letterSpacing: '0',
  },
  lg: {
    size: '1.125rem',     // 18px
    lineHeight: '1.75rem', // 28px
    letterSpacing: '-0.011em',
  },
  xl: {
    size: '1.25rem',      // 20px
    lineHeight: '1.75rem', // 28px
    letterSpacing: '-0.014em',
  },
  '2xl': {
    size: '1.5rem',       // 24px
    lineHeight: '2rem',    // 32px
    letterSpacing: '-0.019em',
  },
  '3xl': {
    size: '1.875rem',     // 30px
    lineHeight: '2.25rem', // 36px
    letterSpacing: '-0.021em',
  },
  '4xl': {
    size: '2.25rem',      // 36px
    lineHeight: '2.5rem',  // 40px
    letterSpacing: '-0.022em',
  },
  '5xl': {
    size: '3rem',         // 48px
    lineHeight: '1',
    letterSpacing: '-0.024em',
  },
  '6xl': {
    size: '3.75rem',      // 60px
    lineHeight: '1',
    letterSpacing: '-0.025em',
  },
  '7xl': {
    size: '4.5rem',       // 72px
    lineHeight: '1',
    letterSpacing: '-0.026em',
  },
  '8xl': {
    size: '6rem',         // 96px
    lineHeight: '1',
    letterSpacing: '-0.027em',
  },
  '9xl': {
    size: '8rem',         // 128px
    lineHeight: '1',
    letterSpacing: '-0.028em',
  },
} as const;

/**
 * Line heights for custom usage
 */
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

/**
 * Letter spacing for custom usage
 */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

/**
 * Typography presets for common use cases
 */
export const textStyles = {
  // Headings
  h1: {
    ...fontSize['5xl'],
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.sans.join(', '),
  },
  h2: {
    ...fontSize['4xl'],
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.sans.join(', '),
  },
  h3: {
    ...fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.sans.join(', '),
  },
  h4: {
    ...fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.sans.join(', '),
  },
  h5: {
    ...fontSize.xl,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.sans.join(', '),
  },
  h6: {
    ...fontSize.lg,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.sans.join(', '),
  },

  // Body text
  bodyLarge: {
    ...fontSize.lg,
    fontWeight: fontWeight.normal,
  },
  body: {
    ...fontSize.base,
    fontWeight: fontWeight.normal,
  },
  bodySmall: {
    ...fontSize.sm,
    fontWeight: fontWeight.normal,
  },

  // UI text
  label: {
    ...fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  caption: {
    ...fontSize.xs,
    fontWeight: fontWeight.normal,
  },
  overline: {
    ...fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },

  // Code
  code: {
    ...fontSize.sm,
    fontWeight: fontWeight.normal,
    fontFamily: fontFamily.mono.join(', '),
  },
} as const;

/**
 * Export all typography tokens
 */
export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  textStyles,
} as const;

/**
 * Type helpers
 */
export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
export type TextStyle = keyof typeof textStyles;
