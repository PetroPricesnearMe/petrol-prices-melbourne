/**
 * Design System - Spacing Tokens
 * 
 * Defines consistent spacing scale based on 4px base unit
 */

// ============================================================================
// Spacing Scale (in rem)
// ============================================================================

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
} as const;

// ============================================================================
// Semantic Spacing - Predefined spacing for common use cases
// ============================================================================

export const semanticSpacing = {
  // Component internal spacing
  component: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[3],
    lg: spacing[4],
    xl: spacing[6],
  },

  // Layout spacing
  layout: {
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
    lg: spacing[24],
    xl: spacing[32],
  },

  // Container padding
  container: {
    xs: spacing[4],
    sm: spacing[6],
    md: spacing[8],
    lg: spacing[12],
  },

  // Stack spacing (vertical spacing between elements)
  stack: {
    xs: spacing[2],
    sm: spacing[3],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },
} as const;

// ============================================================================
// Border Radius
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// Size Presets (for consistent component sizing)
// ============================================================================

export const size = {
  xs: {
    height: '1.5rem',   // 24px
    padding: `${spacing[1]} ${spacing[2]}`,
  },
  sm: {
    height: '2rem',     // 32px
    padding: `${spacing[2]} ${spacing[3]}`,
  },
  md: {
    height: '2.5rem',   // 40px
    padding: `${spacing[2]} ${spacing[4]}`,
  },
  lg: {
    height: '3rem',     // 48px
    padding: `${spacing[3]} ${spacing[5]}`,
  },
  xl: {
    height: '3.5rem',   // 56px
    padding: `${spacing[4]} ${spacing[6]}`,
  },
} as const;

// ============================================================================
// Icon Sizes
// ============================================================================

export const iconSize = {
  xs: '1rem',     // 16px
  sm: '1.25rem',  // 20px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '2.5rem',   // 40px
  '2xl': '3rem',  // 48px
} as const;

/**
 * Type exports
 */
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type Size = keyof typeof size;
export type IconSize = keyof typeof iconSize;

