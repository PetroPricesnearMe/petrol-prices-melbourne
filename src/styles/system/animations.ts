/**
 * Animation System
 * Performance-optimized animations with accessibility support
 */

/**
 * Animation configuration types
 */
export type AnimationConfig = {
  duration?: number;
  delay?: number;
  easing?: string;
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
};

/**
 * Predefined easing functions
 */
export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const;

/**
 * Animation durations (in ms)
 */
export const durations = {
  instant: 0,
  fastest: 100,
  faster: 150,
  fast: 200,
  normal: 300,
  slow: 400,
  slower: 500,
  slowest: 700,
} as const;

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Create animation style string
 */
export function createAnimation(
  config: AnimationConfig & { name: string }
): string {
  const {
    name,
    duration = durations.normal,
    delay = 0,
    easing = easings.easeInOut,
    iterations = 1,
    direction = 'normal',
    fillMode = 'both',
  } = config;

  return `${name} ${duration}ms ${easing} ${delay}ms ${iterations} ${direction} ${fillMode}`;
}

/**
 * Animation utilities for inline styles
 */
export const animationStyles = {
  /**
   * Fade in animation
   */
  fadeIn: (duration = durations.normal, delay = 0): React.CSSProperties => ({
    animation: prefersReducedMotion()
      ? 'none'
      : `fadeIn ${duration}ms ${easings.easeOut} ${delay}ms both`,
  }),

  /**
   * Fade out animation
   */
  fadeOut: (duration = durations.normal, delay = 0): React.CSSProperties => ({
    animation: prefersReducedMotion()
      ? 'none'
      : `fadeOut ${duration}ms ${easings.easeIn} ${delay}ms both`,
  }),

  /**
   * Slide in from bottom
   */
  slideInUp: (duration = durations.normal, delay = 0): React.CSSProperties => ({
    animation: prefersReducedMotion()
      ? 'none'
      : `slideIn ${duration}ms ${easings.easeOut} ${delay}ms both`,
  }),

  /**
   * Slide out to top
   */
  slideOutUp: (
    duration = durations.normal,
    delay = 0
  ): React.CSSProperties => ({
    animation: prefersReducedMotion()
      ? 'none'
      : `slideOut ${duration}ms ${easings.easeIn} ${delay}ms both`,
  }),

  /**
   * Scale in animation
   */
  scaleIn: (duration = durations.fast, delay = 0): React.CSSProperties => ({
    animation: prefersReducedMotion()
      ? 'none'
      : `scaleIn ${duration}ms ${easings.easeOut} ${delay}ms both`,
  }),

  /**
   * Scale out animation
   */
  scaleOut: (duration = durations.fast, delay = 0): React.CSSProperties => ({
    animation: prefersReducedMotion()
      ? 'none'
      : `scaleOut ${duration}ms ${easings.easeIn} ${delay}ms both`,
  }),

  /**
   * Bounce in animation
   */
  bounceIn: (duration = durations.slower, delay = 0): React.CSSProperties => ({
    animation: prefersReducedMotion()
      ? 'none'
      : `bounceIn ${duration}ms ${easings.bounce} ${delay}ms both`,
  }),

  /**
   * Shimmer effect
   */
  shimmer: (): React.CSSProperties => ({
    animation: prefersReducedMotion()
      ? 'none'
      : `shimmer 2s ${easings.linear} infinite`,
  }),

  /**
   * Pulse animation
   */
  pulse: (duration = 2000): React.CSSProperties => ({
    animation: prefersReducedMotion()
      ? 'none'
      : `pulse ${duration}ms ${easings.easeInOut} infinite`,
  }),
};

/**
 * Transition utilities
 */
export const transitions = {
  /**
   * Create a transition string
   */
  create: (
    properties: string | string[],
    duration = durations.normal,
    easing = easings.easeInOut,
    delay = 0
  ): string => {
    const props = Array.isArray(properties) ? properties : [properties];
    return props
      .map((prop) => `${prop} ${duration}ms ${easing} ${delay}ms`)
      .join(', ');
  },

  /**
   * Common transition presets
   */
  presets: {
    fast: `all ${durations.fast}ms ${easings.easeInOut}`,
    normal: `all ${durations.normal}ms ${easings.easeInOut}`,
    slow: `all ${durations.slow}ms ${easings.easeInOut}`,
    colors: `background-color ${durations.normal}ms ${easings.easeInOut}, color ${durations.normal}ms ${easings.easeInOut}, border-color ${durations.normal}ms ${easings.easeInOut}`,
    transform: `transform ${durations.normal}ms ${easings.easeOut}`,
    opacity: `opacity ${durations.normal}ms ${easings.easeInOut}`,
  },
};

/**
 * Stagger animation utility
 */
export function createStagger(
  items: number,
  baseDelay = 50,
  animationClass = 'animate-fade-in'
): string[] {
  return Array.from({ length: items }, (_, i) => {
    const delay = i * baseDelay;
    return `${animationClass} [animation-delay:${delay}ms]`;
  });
}

/**
 * Custom keyframe animations
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
  bounce: {
    '0%, 100%': {
      transform: 'translateY(-25%)',
      animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
    },
    '50%': {
      transform: 'translateY(0)',
      animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },
};

/**
 * Animation hook utility
 */
export function useAnimation(
  animationName: string,
  config: AnimationConfig = {}
): string {
  const shouldAnimate = !prefersReducedMotion();

  if (!shouldAnimate) {
    return '';
  }

  return createAnimation({ name: animationName, ...config });
}

/**
 * Performance-optimized animation classes
 * These use GPU acceleration for smooth 60fps animations
 */
export const performantAnimations = {
  // Transform-based animations (GPU accelerated)
  translateX: 'will-change-transform transition-transform',
  translateY: 'will-change-transform transition-transform',
  scale: 'will-change-transform transition-transform',
  rotate: 'will-change-transform transition-transform',

  // Opacity animations (GPU accelerated)
  opacity: 'will-change-opacity transition-opacity',

  // Combined animations
  fadeSlide: 'will-change-[transform,opacity] transition-[transform,opacity]',

  // Disable animations for reduced motion
  safe: (animation: string) =>
    `${animation} motion-reduce:transition-none motion-reduce:animate-none`,
};

/**
 * Intersection Observer animation trigger
 */
export function createIntersectionAnimation(
  element: HTMLElement,
  animationClass: string,
  options: IntersectionObserverInit = {}
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      ...options,
    }
  );

  observer.observe(element);

  return () => observer.disconnect();
}

const animationSystem = {
  easings,
  durations,
  prefersReducedMotion,
  createAnimation,
  animationStyles,
  transitions,
  createStagger,
  keyframes,
  useAnimation,
  performantAnimations,
  createIntersectionAnimation,
};

export default animationSystem;
