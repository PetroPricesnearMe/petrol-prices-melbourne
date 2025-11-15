/**
 * Design System Tokens - Central Export
 *
 * All design tokens in one place for easy importing.
 *
 * @example
 * ```typescript
 * import { colors, spacing, typography } from '@/design-system/tokens';
 * ```
 *
 * @module design-system/tokens
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './breakpoints';
export * from './animations';

// Re-export for convenience
export { colors } from './colors';
export { typography } from './typography';
export { spacingTokens as spacing } from './spacing';
export { shadows } from './shadows';
export { breakpoints, mediaQueries } from './breakpoints';
export { animationTokens as animations } from './animations';
