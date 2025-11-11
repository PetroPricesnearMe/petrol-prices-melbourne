/**
 * Animation Tokens - Design System
 * 
 * Smooth, performant animations using GPU-accelerated properties.
 * Respects user's motion preferences (prefers-reduced-motion).
 * 
 * @module design-system/tokens/animations
 */

/**
 * Animation durations (in milliseconds)
 */
export const duration = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
  slowest: 1000,
} as const;

/**
 * Easing functions for natural motion
 */
export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
} as const;

/**
 * Animation presets for common use cases
 */
export const animations = {
  // Fade animations
  fadeIn: {
    animation: 'fadeIn',
    duration: duration.normal,
    easing: easing.easeIn,
  },
  fadeOut: {
    animation: 'fadeOut',
    duration: duration.normal,
    easing: easing.easeOut,
  },

  // Slide animations
  slideIn: {
    animation: 'slideIn',
    duration: duration.normal,
    easing: easing.easeOut,
  },
  slideOut: {
    animation: 'slideOut',
    duration: duration.normal,
    easing: easing.easeIn,
  },

  // Scale animations
  scaleIn: {
    animation: 'scaleIn',
    duration: duration.fast,
    easing: easing.easeOut,
  },
  scaleOut: {
    animation: 'scaleOut',
    duration: duration.fast,
    easing: easing.easeIn,
  },

  // Bounce animation
  bounceIn: {
    animation: 'bounceIn',
    duration: duration.slow,
    easing: easing.bounce,
  },

  // Shimmer/loading animation
  shimmer: {
    animation: 'shimmer',
    duration: 2000,
    easing: easing.linear,
    iterationCount: 'infinite',
  },

  // Pulse animation
  pulse: {
    animation: 'pulse',
    duration: 2000,
    easing: easing.easeInOut,
    iterationCount: 'infinite',
  },

  // Spin animation (for loaders)
  spin: {
    animation: 'spin',
    duration: 1000,
    easing: easing.linear,
    iterationCount: 'infinite',
  },
} as const;

/**
 * Keyframe definitions (CSS-in-JS)
 */
export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideIn: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideOut: {
    from: { transform: 'translateY(0)', opacity: 1 },
    to: { transform: 'translateY(-20px)', opacity: 0 },
  },
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.9)', opacity: 0 },
  },
  bounceIn: {
    '0%': { transform: 'scale(0.3)', opacity: 0 },
    '50%': { transform: 'scale(1.05)' },
    '70%': { transform: 'scale(0.9)' },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
  shimmer: {
    '0%': { backgroundPosition: '-1000px 0' },
    '100%': { backgroundPosition: '1000px 0' },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
} as const;

/**
 * Transition presets for common properties
 */
export const transitions = {
  all: `all ${duration.normal}ms ${easing.easeInOut}`,
  colors: `background-color ${duration.normal}ms ${easing.easeInOut}, color ${duration.normal}ms ${easing.easeInOut}, border-color ${duration.normal}ms ${easing.easeInOut}`,
  opacity: `opacity ${duration.normal}ms ${easing.easeInOut}`,
  transform: `transform ${duration.normal}ms ${easing.easeOut}`,
  shadow: `box-shadow ${duration.normal}ms ${easing.easeInOut}`,
} as const;

/**
 * Export all animation tokens
 */
export const animationTokens = {
  duration,
  easing,
  animations,
  keyframes,
  transitions,
} as const;

/**
 * Type helpers
 */
export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type Animation = keyof typeof animations;
