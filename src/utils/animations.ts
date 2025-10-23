/**
 * Animation Utilities - GPU-optimized scroll animations with Framer Motion
 *
 * This module provides utilities for creating smooth, performant scroll-triggered
 * animations that only play once and are optimized for 60fps
 *
 * @module utils/animations
 */

import { Variants, Transition } from 'framer-motion';

// ============================================================================
// Animation Configuration
// ============================================================================

/** Animation duration in seconds */
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
} as const;

/** Animation easing curves */
export const ANIMATION_EASING = {
  // Standard eases
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],

  // Custom eases
  smooth: [0.25, 0.1, 0.25, 1],
  snappy: [0.6, 0.01, 0.05, 0.95],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
} as const;

/** Default transition configuration */
export const DEFAULT_TRANSITION: Transition = {
  duration: ANIMATION_DURATION.normal,
  ease: ANIMATION_EASING.easeOut,
};

/** Spring animation configuration */
export const SPRING_CONFIG = {
  soft: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
  medium: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 20,
    mass: 1,
  },
  stiff: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
    mass: 1,
  },
} as const;

// ============================================================================
// Fade Animations
// ============================================================================

/** Fade in animation */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Fade in up animation */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Fade in down animation */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Fade in left animation */
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Fade in right animation */
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

// ============================================================================
// Slide Animations
// ============================================================================

/** Slide up animation */
export const slideUp: Variants = {
  hidden: {
    y: 60,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Slide down animation */
export const slideDown: Variants = {
  hidden: {
    y: -60,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Slide left animation */
export const slideLeft: Variants = {
  hidden: {
    x: 60,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Slide right animation */
export const slideRight: Variants = {
  hidden: {
    x: -60,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

// ============================================================================
// Scale Animations
// ============================================================================

/** Scale in animation */
export const scaleIn: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Scale in from center */
export const scaleInCenter: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Zoom in animation */
export const zoomIn: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.fast,
    },
  },
};

// ============================================================================
// Combined Animations
// ============================================================================

/** Fade and slide up (common card animation) */
export const fadeSlideUp: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Fade, slide, and scale */
export const fadeSlideScale: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.normal,
    },
  },
};

/** Blur fade in (for images/backgrounds) */
export const blurFadeIn: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: ANIMATION_EASING.smooth,
    },
  },
};

// ============================================================================
// Stagger Animations (for lists/grids)
// ============================================================================

/** Stagger container - wraps child elements */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/** Fast stagger container */
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

/** Slow stagger container */
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/** Stagger item - used within stagger containers */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...DEFAULT_TRANSITION,
      duration: ANIMATION_DURATION.fast,
    },
  },
};

// ============================================================================
// Viewport Options (for scroll triggering)
// ============================================================================

/** Default viewport options - trigger once when element enters */
export const DEFAULT_VIEWPORT = {
  once: true,  // Only animate once
  amount: 0.2, // Trigger when 20% of element is visible
  margin: '0px 0px -100px 0px', // Trigger slightly before element enters
};

/** Trigger immediately when any part is visible */
export const VIEWPORT_IMMEDIATE = {
  once: true,
  amount: 0,
  margin: '0px',
};

/** Trigger when element is 50% visible */
export const VIEWPORT_HALF = {
  once: true,
  amount: 0.5,
  margin: '0px',
};

/** Trigger when element is fully visible */
export const VIEWPORT_FULL = {
  once: true,
  amount: 0.9,
  margin: '0px',
};

// ============================================================================
// Animation Presets for Common Use Cases
// ============================================================================

export type AnimationPreset =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'zoomIn'
  | 'fadeSlideUp'
  | 'fadeSlideScale'
  | 'blurFadeIn';

/** Get animation variants by preset name */
export function getAnimationVariants(preset: AnimationPreset): Variants {
  const presets: Record<AnimationPreset, Variants> = {
    fadeIn,
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    scaleIn,
    zoomIn,
    fadeSlideUp,
    fadeSlideScale,
    blurFadeIn,
  };
  return presets[preset];
}

// ============================================================================
// Custom Animation Builders
// ============================================================================

/** Create custom fade animation with options */
export function createFadeAnimation(options: {
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
}): Variants {
  const { direction = 'none', distance = 40, duration = 0.5, delay = 0 } = options;

  const initialOffset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return {
    hidden: {
      opacity: 0,
      ...initialOffset[direction],
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: ANIMATION_EASING.easeOut,
      },
    },
  };
}

/** Create custom scale animation with options */
export function createScaleAnimation(options: {
  from?: number;
  duration?: number;
  delay?: number;
  spring?: boolean;
}): Variants {
  const { from = 0.8, duration = 0.5, delay = 0, spring = false } = options;

  return {
    hidden: {
      scale: from,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: spring
        ? { ...SPRING_CONFIG.medium, delay }
        : { duration, delay, ease: ANIMATION_EASING.easeOut },
    },
  };
}

/** Create stagger animation for card grids */
export function createStaggerAnimation(options: {
  staggerDelay?: number;
  itemDelay?: number;
  childAnimation?: Variants;
}): { container: Variants; item: Variants } {
  const { staggerDelay = 0.1, itemDelay = 0, childAnimation = staggerItem } = options;

  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: itemDelay,
        },
      },
    },
    item: childAnimation,
  };
}

// ============================================================================
// Performance Utilities
// ============================================================================

/**
 * GPU-optimized properties for animations
 * These properties can be animated without triggering layout/paint
 */
export const GPU_PROPERTIES = ['transform', 'opacity', 'filter'] as const;

/**
 * Check if property is GPU-accelerated
 */
export function isGPUProperty(property: string): boolean {
  return GPU_PROPERTIES.includes(property as any);
}

/**
 * Get will-change value for performance hint
 */
export function getWillChange(properties: string[]): string {
  return properties.filter(isGPUProperty).join(', ');
}

/**
 * Reduce motion check (respects user preferences)
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get reduced motion variants (instant transitions)
 */
export function getReducedMotionVariants(variants: Variants): Variants {
  const reduced: Variants = {};

  Object.keys(variants).forEach(key => {
    const variant = variants[key];
    if (typeof variant === 'object') {
      reduced[key] = {
        ...variant,
        transition: { duration: 0 },
      };
    }
  });

  return reduced;
}

// ============================================================================
// Export All Presets
// ============================================================================

export const ANIMATION_PRESETS = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleIn,
  scaleInCenter,
  zoomIn,
  fadeSlideUp,
  fadeSlideScale,
  blurFadeIn,
  staggerContainer,
  staggerContainerFast,
  staggerContainerSlow,
  staggerItem,
} as const;

export const VIEWPORT_PRESETS = {
  default: DEFAULT_VIEWPORT,
  immediate: VIEWPORT_IMMEDIATE,
  half: VIEWPORT_HALF,
  full: VIEWPORT_FULL,
} as const;
