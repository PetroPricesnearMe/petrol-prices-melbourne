/**
 * Design System - Animation Tokens
 * 
 * Defines consistent timing, easing, and animation presets
 */

// ============================================================================
// Timing/Duration
// ============================================================================

export const duration = {
  instant: '0ms',
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
} as const;

// ============================================================================
// Easing Functions
// ============================================================================

export const easing = {
  // Standard easings
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Custom easings for specific use cases
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================================================
// Transition Presets
// ============================================================================

export const transition = {
  // Common transitions
  all: `all ${duration.normal} ${easing.easeInOut}`,
  colors: `color ${duration.fast} ${easing.easeInOut}, background-color ${duration.fast} ${easing.easeInOut}, border-color ${duration.fast} ${easing.easeInOut}`,
  opacity: `opacity ${duration.fast} ${easing.easeInOut}`,
  shadow: `box-shadow ${duration.normal} ${easing.easeInOut}`,
  transform: `transform ${duration.normal} ${easing.easeInOut}`,
  
  // Specific use cases
  button: `all ${duration.fast} ${easing.easeOut}`,
  modal: `opacity ${duration.normal} ${easing.easeInOut}, transform ${duration.normal} ${easing.spring}`,
  dropdown: `opacity ${duration.fast} ${easing.easeOut}, transform ${duration.fast} ${easing.easeOut}`,
  tooltip: `opacity ${duration.fast} ${easing.easeIn}`,
} as const;

// ============================================================================
// Keyframe Animations
// ============================================================================

export const keyframes = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  
  // Slide animations
  slideInUp: {
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInDown: {
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  slideInRight: {
    from: { transform: 'translateX(100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  
  // Scale animations
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.95)', opacity: 0 },
  },
  
  // Rotation
  rotate: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  
  // Pulse
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  
  // Bounce
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-25%)' },
  },
  
  // Shimmer (for skeleton loading)
  shimmer: {
    from: { backgroundPosition: '-200% 0' },
    to: { backgroundPosition: '200% 0' },
  },
  
  // Shake (for error states)
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
  },
} as const;

// ============================================================================
// Animation Presets - Complete animation configurations
// ============================================================================

export const animations = {
  fadeIn: {
    keyframe: keyframes.fadeIn,
    duration: duration.normal,
    easing: easing.easeOut,
    fillMode: 'forwards' as const,
  },
  fadeOut: {
    keyframe: keyframes.fadeOut,
    duration: duration.normal,
    easing: easing.easeIn,
    fillMode: 'forwards' as const,
  },
  slideUp: {
    keyframe: keyframes.slideInUp,
    duration: duration.normal,
    easing: easing.spring,
    fillMode: 'forwards' as const,
  },
  scaleIn: {
    keyframe: keyframes.scaleIn,
    duration: duration.fast,
    easing: easing.easeOut,
    fillMode: 'forwards' as const,
  },
  spin: {
    keyframe: keyframes.rotate,
    duration: duration.slower,
    easing: easing.linear,
    iterationCount: 'infinite' as const,
  },
  pulse: {
    keyframe: keyframes.pulse,
    duration: duration.slower,
    easing: easing.easeInOut,
    iterationCount: 'infinite' as const,
  },
  shimmer: {
    keyframe: keyframes.shimmer,
    duration: '1.5s',
    easing: easing.linear,
    iterationCount: 'infinite' as const,
  },
  shake: {
    keyframe: keyframes.shake,
    duration: duration.slow,
    easing: easing.easeInOut,
    fillMode: 'forwards' as const,
  },
} as const;

/**
 * Type exports
 */
export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type Transition = keyof typeof transition;
export type Keyframe = keyof typeof keyframes;
export type Animation = keyof typeof animations;

