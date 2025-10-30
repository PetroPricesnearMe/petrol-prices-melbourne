/**
 * Styling System - Main Export
 * Central export point for all styling utilities
 */

// CSS-in-JS Utilities
export {
  cn,
  createVariants,
  styleUtils,
  compose,
  patterns,
  a11y,
  animations as animationClasses,
  type StyleVariant,
} from './system/css-in-js';

// Theme System
export {
  useTheme,
  getThemeManager,
  getServerTheme,
  ThemeScript,
  type Theme,
  type ResolvedTheme,
  type ThemeProviderProps,
} from './system/theme';

// Animation System
export {
  animations,
  animationStyles,
  easings,
  durations,
  transitions,
  keyframes,
  prefersReducedMotion,
  createAnimation,
  createStagger,
  useAnimation,
  performantAnimations,
  createIntersectionAnimation,
  type AnimationConfig,
} from './system/animations';

// Re-export from plugins (if needed)
export { customUtilitiesPlugin } from './plugins/custom-utilities.plugin';
export { componentVariantsPlugin } from './plugins/component-variants.plugin';
export { responsiveVariantsPlugin } from './plugins/responsive-variants.plugin';

/**
 * Quick access to commonly used utilities
 */
export const styling = {
  cn,
  patterns,
  styleUtils,
  animations: animationClasses,
  a11y,
};

export default styling;
