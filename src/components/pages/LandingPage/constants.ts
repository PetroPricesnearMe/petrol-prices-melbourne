/**
 * Constants and configuration for Landing Page
 * Centralized values for easy maintenance and consistency
 */

import type { AnimationConfig, StaggerAnimationConfig } from './types';

// ============================================================================
// Animation Configurations
// ============================================================================

export const ANIMATION_CONFIGS = {
  // Fade in from bottom
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  } as AnimationConfig,

  // Fade in from left
  fadeInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 },
  } as AnimationConfig,

  // Fade in from right
  fadeInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 },
  } as AnimationConfig,

  // Scale in
  scaleIn: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { duration: 0.5 },
  } as AnimationConfig,

  // Floating animation (vertical)
  floatVertical: {
    initial: { y: 0 },
    animate: { y: [-10, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  } as AnimationConfig,

  // Floating animation (horizontal)
  floatVerticalReverse: {
    initial: { y: 0 },
    animate: { y: [10, 0] },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  } as AnimationConfig,

  // Scroll indicator
  scrollBounce: {
    initial: { y: 0 },
    animate: { y: [0, 10, 0] },
    transition: { duration: 2, repeat: Infinity },
  } as AnimationConfig,

  // Hover scale
  hoverScale: {
    initial: { scale: 1 },
    animate: { scale: 1.02 },
    transition: { duration: 0.3 },
  } as AnimationConfig,

  // Hover lift
  hoverLift: {
    initial: { y: 0 },
    animate: { y: -5 },
    transition: { duration: 0.3 },
  } as AnimationConfig,
} as const;

// Stagger animation configuration
export const STAGGER_CONFIG: StaggerAnimationConfig = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  staggerDelay: 0.1,
};

// ============================================================================
// Intersection Observer Settings
// ============================================================================

export const VIEWPORT_CONFIG = {
  once: true,
  margin: '-50px',
  amount: 0.2,
} as const;

export const VIEWPORT_CONFIG_HERO = {
  once: true,
  margin: '-100px',
  amount: 0.1,
} as const;

// ============================================================================
// Styling Constants
// ============================================================================

export const CONTAINER_CLASSES = 'container mx-auto px-4' as const;

export const SECTION_PADDING = {
  none: '',
  sm: 'py-10',
  md: 'py-16',
  lg: 'py-20',
} as const;

export const SECTION_BACKGROUNDS = {
  white: 'bg-white dark:bg-gray-900',
  gray: 'bg-gray-50 dark:bg-gray-800',
  gradient: 'bg-gradient-to-r from-primary-600 to-secondary-600',
  dark: 'bg-gray-900',
} as const;

// ============================================================================
// Button Styles
// ============================================================================

export const BUTTON_BASE_CLASSES =
  'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4' as const;

export const BUTTON_VARIANTS = {
  primary:
    'bg-white text-primary-600 hover:bg-white/90 shadow-lg focus:ring-white/20',
  secondary:
    'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 focus:ring-white/20',
  outline:
    'bg-transparent border-2 border-current hover:bg-current hover:text-white',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
} as const;

export const BUTTON_SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-base',
} as const;

// ============================================================================
// Typography Scales
// ============================================================================

export const TYPOGRAPHY = {
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
  h3: 'text-2xl md:text-3xl font-bold',
  h4: 'text-xl md:text-2xl font-semibold',
  subtitle: 'text-xl md:text-2xl leading-relaxed',
  body: 'text-base md:text-lg leading-relaxed',
  small: 'text-sm',
} as const;

// ============================================================================
// SVG Icon Paths
// ============================================================================

export const ICON_PATHS = {
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  chart:
    'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  check:
    'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
  arrowDown: 'M19 14l-7 7m0 0l-7-7m7 7V3',
  twitter:
    'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
  facebook:
    'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
} as const;

// ============================================================================
// Color Constants
// ============================================================================

export const COLORS = {
  status: {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  },
  gradient: {
    primary: 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800',
    secondary: 'bg-gradient-to-r from-primary-600 to-secondary-600',
    accent: 'bg-gradient-to-r from-yellow-400 to-orange-500',
  },
} as const;

// ============================================================================
// Timing Constants
// ============================================================================

export const TIMING = {
  transitionDuration: 300,
  animationDelay: 100,
  floatDuration: 3000,
  pulseDuration: 2000,
} as const;

// ============================================================================
// Z-Index Scale
// ============================================================================

export const Z_INDEX = {
  background: 0,
  content: 10,
  overlay: 20,
  modal: 30,
  tooltip: 40,
} as const;

