/**
 * Reusable Animation Variants
 * Consistent, performant animations across the app
 * Following modern Framer Motion best practices
 */

import type { Variants, Transition } from 'framer-motion';

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -8,
  },
};

export const pageTransition: Transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

/**
 * Fade in from bottom (most common)
 */
export const fadeInUp: Variants = {
  offscreen: {
    opacity: 0,
    y: 40,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.2,
      duration: 0.6,
    },
  },
};

/**
 * Scale and fade in
 */
export const scaleIn: Variants = {
  offscreen: {
    opacity: 0,
    scale: 0.9,
  },
  onscreen: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 0.5,
    },
  },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  offscreen: {
    opacity: 0,
    x: -50,
  },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  offscreen: {
    opacity: 0,
    x: 50,
  },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// ============================================================================
// STAGGER ANIMATIONS (Lists/Grids)
// ============================================================================

export const staggerContainer: Variants = {
  offscreen: {},
  onscreen: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  offscreen: {
    opacity: 0,
    y: 20,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

/**
 * Fast stagger for large lists
 */
export const fastStagger: Variants = {
  offscreen: {},
  onscreen: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

// ============================================================================
// HOVER ANIMATIONS (Micro-interactions)
// ============================================================================

/**
 * Subtle scale on hover
 */
export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.98 },
};

/**
 * Lift effect on hover (cards)
 */
export const hoverLift: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },
  hover: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * Glow effect on hover
 */
export const hoverGlow: Variants = {
  rest: {
    boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
  },
  hover: {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
    transition: {
      duration: 0.3,
    },
  },
};

// ============================================================================
// MODAL/DRAWER ANIMATIONS
// ============================================================================

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

export const drawerVariants: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
  exit: {
    x: '-100%',
    transition: {
      duration: 0.3,
    },
  },
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

export const cardEnter: Variants = {
  initial: {
    opacity: 0,
    rotateX: -15,
    transformPerspective: 1000,
  },
  animate: {
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
  },
};

// ============================================================================
// SPECIAL EFFECTS
// ============================================================================

/**
 * Shimmer loading effect
 */
export const shimmerVariants: Variants = {
  initial: {
    backgroundPosition: '-1000px 0',
  },
  animate: {
    backgroundPosition: '1000px 0',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Pulse animation
 */
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Floating animation (hero elements)
 */
export const floatVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// VIEWPORT SETTINGS
// ============================================================================

/**
 * Optimized viewport settings for scroll animations
 * Triggers animation when element is partially visible
 */
export const defaultViewport = {
  once: true, // Only animate once (better performance)
  margin: '-50px', // Trigger 50px before element enters viewport
  amount: 0.2, // Trigger when 20% of element is visible
};

/**
 * Viewport for hero sections
 */
export const heroViewport = {
  once: false, // Can re-animate
  margin: '0px',
  amount: 0.5,
};

// ============================================================================
// TRANSITION PRESETS
// ============================================================================

export const transitions = {
  // Fast and snappy
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
  
  // Smooth and elegant
  smooth: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
  },
  
  // Bouncy and playful
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 10,
    bounce: 0.4,
  },
  
  // Simple tween
  tween: {
    type: 'tween' as const,
    duration: 0.3,
    ease: 'easeOut',
  },
};

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
  anticipate: [0.22, 1, 0.36, 1],
};

