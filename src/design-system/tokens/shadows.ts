/**
 * Design System - Shadow Tokens
 * 
 * Defines elevation system with consistent shadow styles
 */

// ============================================================================
// Box Shadows - Elevation System
// ============================================================================

export const shadows = {
  none: 'none',
  
  // Subtle shadows
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  
  // Regular shadows
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  
  // Strong shadows
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
  
  // Inner shadow
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const;

// ============================================================================
// Semantic Shadows - Named by use case
// ============================================================================

export const semanticShadows = {
  card: shadows.sm,
  cardHover: shadows.md,
  cardActive: shadows.base,
  
  button: shadows.xs,
  buttonHover: shadows.sm,
  buttonActive: 'none',
  
  dropdown: shadows.lg,
  modal: shadows.xl,
  drawer: shadows['2xl'],
  
  tooltip: shadows.sm,
  popover: shadows.md,
  
  floatingAction: shadows.lg,
  floatingActionHover: shadows.xl,
} as const;

// ============================================================================
// Focus Shadows - For accessibility
// ============================================================================

export const focusShadows = {
  default: '0 0 0 3px rgba(33, 150, 243, 0.3)',
  error: '0 0 0 3px rgba(244, 67, 54, 0.3)',
  success: '0 0 0 3px rgba(76, 175, 80, 0.3)',
  warning: '0 0 0 3px rgba(255, 152, 0, 0.3)',
} as const;

/**
 * Type exports
 */
export type Shadow = keyof typeof shadows;
export type SemanticShadow = keyof typeof semanticShadows;
export type FocusShadow = keyof typeof focusShadows;

