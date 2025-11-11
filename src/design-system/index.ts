/**
 * Design System - Central Export
 * 
 * Complete design system with tokens and utilities.
 * Import from here for convenience.
 * 
 * @example
 * ```typescript
 * import { colors, spacing, cn } from '@/design-system';
 * ```
 * 
 * @module design-system
 */

// Export all tokens
export * from './tokens';

// Export all utilities
export * from './utils';

// Re-export for convenience
export { colors, typography, spacing, shadows, breakpoints, animations } from './tokens';
export { cn, cva, isBreakpoint, isMobile, isTablet, isDesktop } from './utils';

