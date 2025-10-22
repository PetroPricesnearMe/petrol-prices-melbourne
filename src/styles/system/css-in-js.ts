/**
 * CSS-in-JS Hybrid System
 * Type-safe dynamic styling utilities that work seamlessly with Tailwind
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with proper precedence
 * Handles conflicts and ensures correct class order
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Style variant types for type-safe component styling
 */
export type StyleVariant = {
  base?: string;
  variants?: Record<string, Record<string, string>>;
  compoundVariants?: Array<{
    conditions: Record<string, string | boolean>;
    className: string;
  }>;
  defaultVariants?: Record<string, string>;
};

/**
 * Create a variant-aware styling function
 * Provides type-safe variants similar to CVA (Class Variance Authority)
 */
export function createVariants<T extends StyleVariant>(config: T) {
  return (props?: Record<string, string | boolean | undefined>) => {
    const classes: string[] = [];

    // Add base classes
    if (config.base) {
      classes.push(config.base);
    }

    // Add variant classes
    if (config.variants && props) {
      Object.entries(config.variants).forEach(([key, variants]) => {
        const value = props[key] ?? config.defaultVariants?.[key];
        if (value && typeof value === 'string' && variants[value]) {
          classes.push(variants[value]);
        }
      });
    }

    // Add compound variants
    if (config.compoundVariants && props) {
      config.compoundVariants.forEach((compound) => {
        const matches = Object.entries(compound.conditions).every(
          ([key, value]) => {
            const propValue = props[key];
            return propValue === value;
          }
        );
        if (matches) {
          classes.push(compound.className);
        }
      });
    }

    return cn(...classes);
  };
}

/**
 * Dynamic style utilities
 */
export const styleUtils = {
  /**
   * Generate responsive styles
   */
  responsive: (
    base: string,
    sm?: string,
    md?: string,
    lg?: string,
    xl?: string
  ): string => {
    const classes = [base];
    if (sm) classes.push(`sm:${sm}`);
    if (md) classes.push(`md:${md}`);
    if (lg) classes.push(`lg:${lg}`);
    if (xl) classes.push(`xl:${xl}`);
    return cn(...classes);
  },

  /**
   * Generate hover and focus states
   */
  interactive: (base: string, hover?: string, focus?: string): string => {
    const classes = [base];
    if (hover) classes.push(`hover:${hover}`);
    if (focus) classes.push(`focus:${focus}`);
    return cn(...classes);
  },

  /**
   * Generate dark mode styles
   */
  darkMode: (light: string, dark: string): string => {
    return cn(light, `dark:${dark}`);
  },

  /**
   * Conditional styles
   */
  conditional: (condition: boolean, trueClass: string, falseClass?: string): string => {
    return condition ? trueClass : falseClass || '';
  },

  /**
   * Generate animation with safe fallback for reduced motion
   */
  animation: (animationClass: string): string => {
    return cn(
      'motion-reduce:transition-none motion-reduce:animate-none',
      animationClass
    );
  },
};

/**
 * Style composition utilities
 */
export const compose = {
  /**
   * Compose multiple style functions
   */
  styles: (...fns: Array<() => string>) => {
    return () => cn(...fns.map((fn) => fn()));
  },

  /**
   * Merge style objects
   */
  merge: (...styles: Array<Record<string, string>>) => {
    return Object.assign({}, ...styles);
  },
};

/**
 * Common style patterns as reusable functions
 */
export const patterns = {
  /**
   * Card pattern
   */
  card: (variant: 'default' | 'hover' | 'elevated' | 'bordered' = 'default') => {
    const base = 'bg-white rounded-2xl overflow-hidden transition-all duration-300';
    const variants = {
      default: 'shadow-sm',
      hover: 'shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer',
      elevated: 'shadow-lg',
      bordered: 'border border-gray-200',
    };
    return cn(base, variants[variant]);
  },

  /**
   * Button pattern
   */
  button: (
    variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary',
    size: 'sm' | 'md' | 'lg' = 'md'
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    };

    const variants = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline-primary-500',
      secondary:
        'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:outline-secondary-500',
      outline:
        'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:outline-primary-500',
      ghost:
        'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-500',
    };

    return cn(base, sizes[size], variants[variant]);
  },

  /**
   * Input pattern
   */
  input: (error?: boolean, success?: boolean) => {
    const base =
      'w-full px-4 py-3 text-base text-gray-900 bg-white border-2 rounded-lg transition-all duration-200 focus:outline-none placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed';

    if (error) {
      return cn(
        base,
        'border-error-500 focus:border-error-600 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
      );
    }

    if (success) {
      return cn(
        base,
        'border-success-500 focus:border-success-600 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]'
      );
    }

    return cn(
      base,
      'border-gray-300 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
    );
  },

  /**
   * Badge pattern
   */
  badge: (variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'primary') => {
    const base =
      'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full';

    const variants = {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      error: 'bg-error-100 text-error-800',
    };

    return cn(base, variants[variant]);
  },

  /**
   * Container pattern
   */
  container: (fluid = false) => {
    const base = 'w-full mx-auto px-4 sm:px-6 lg:px-8';
    return fluid ? base : cn(base, 'max-w-7xl');
  },

  /**
   * Grid pattern
   */
  grid: (cols: 1 | 2 | 3 | 4 = 3, gap: 'sm' | 'md' | 'lg' = 'md') => {
    const gaps = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    };

    const columns = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };

    return cn('grid', columns[cols], gaps[gap]);
  },

  /**
   * Flex pattern
   */
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
  },

  /**
   * Text pattern
   */
  text: {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
    h3: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight',
    h4: 'text-xl md:text-2xl lg:text-3xl font-semibold',
    body: 'text-base md:text-lg text-gray-700',
    small: 'text-sm text-gray-600',
    muted: 'text-sm text-gray-500',
  },
};

/**
 * Accessibility helpers
 */
export const a11y = {
  /**
   * Screen reader only text
   */
  srOnly: 'sr-only',

  /**
   * Focus visible styles
   */
  focusRing: (color: 'primary' | 'secondary' = 'primary') => {
    const colors = {
      primary: 'focus-visible:outline-primary-500',
      secondary: 'focus-visible:outline-secondary-500',
    };
    return cn('focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2', colors[color]);
  },

  /**
   * Touch target sizing (WCAG compliant)
   */
  touchTarget: 'min-w-[44px] min-h-[44px]',

  /**
   * Skip link styles
   */
  skipLink:
    'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg',
};

/**
 * Animation helpers
 */
export const animations = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideIn: 'animate-slide-in',
  slideOut: 'animate-slide-out',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  bounceIn: 'animate-bounce-in',
  shimmer: 'animate-shimmer',
  pulseSlow: 'animate-pulse-slow',

  /**
   * Safe animation with reduced motion support
   */
  safe: (animation: string) => cn(
    animation,
    'motion-reduce:animate-none motion-reduce:transition-none'
  ),
};

const stylingSystem = {
  cn,
  createVariants,
  styleUtils,
  compose,
  patterns,
  a11y,
  animations,
};

export default stylingSystem;
