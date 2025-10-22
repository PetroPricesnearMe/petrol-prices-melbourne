/**
 * Design System - Styling Utilities
 *
 * Helper functions for applying design tokens
 */

import { colors, spacing, shadows, borderRadius } from '../tokens';
import type { ColorVariant, Size } from '@/types/index';

/**
 * Get color by variant
 */
export const getVariantColor = (variant: ColorVariant, shade: number = 500): string => {
  const colorMap: Record<ColorVariant, keyof typeof colors> = {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
    neutral: 'neutral',
  };

  const colorKey = colorMap[variant];
  const colorGroup = colors[colorKey];

  if (typeof colorGroup === 'object' && shade in colorGroup) {
    return colorGroup[shade as keyof typeof colorGroup] as string;
  }

  return colors.neutral[500];
};

/**
 * Convert size to spacing value
 */
export const getSizeSpacing = (size: Size): string => {
  const sizeMap: Record<Size, keyof typeof spacing> = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
  };

  return spacing[sizeMap[size]];
};

/**
 * Generate responsive class names
 */
export const responsive = (base: string, breakpoint?: string, value?: string): string => {
  if (!breakpoint || !value) return base;
  return `${breakpoint}:${base}-${value}`;
};

/**
 * Combine class names conditionally
 */
export const cn = (...classes: (string | boolean | undefined | null | number | bigint)[]): string => {
  return classes.filter((c) => typeof c === 'string' && c.length > 0).join(' ');
};

/**
 * Generate focus styles for accessibility
 */
export const focusRing = (color: string = colors.primary[500]): React.CSSProperties => ({
  outline: `2px solid ${color}`,
  outlineOffset: '2px',
});

/**
 * Generate disabled styles
 */
export const disabledStyles: React.CSSProperties = {
  opacity: 0.6,
  cursor: 'not-allowed',
  pointerEvents: 'none',
};

/**
 * Generate truncate text styles
 */
export const truncate: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/**
 * Generate line clamp styles
 */
export const lineClamp = (lines: number): React.CSSProperties => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

/**
 * Generate visually hidden styles (accessible to screen readers)
 */
export const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};
