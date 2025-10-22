/**
 * NorthernTradieCard Styles
 * Tailwind CSS classes organized by variant, size, and state
 */

import type { CardStyleConfig } from './types';

/**
 * Card style configuration with Tailwind classes
 */
export const cardStyles: CardStyleConfig = {
  // Base styles applied to all cards
  base: `
    relative
    rounded-lg
    transition-all
    duration-300
    ease-in-out
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-blue-500
    focus-visible:ring-offset-2
  `,

  // Variant styles
  variants: {
    default: `
      bg-white
      border
      border-gray-200
    `,
    elevated: `
      bg-white
      shadow-md
      hover:shadow-lg
    `,
    outlined: `
      bg-transparent
      border-2
      border-gray-300
    `,
    filled: `
      bg-gray-50
      border
      border-gray-100
    `,
    interactive: `
      bg-white
      border
      border-gray-200
      cursor-pointer
      transform
      hover:scale-[1.02]
      active:scale-[0.98]
    `,
    featured: `
      bg-gradient-to-br
      from-blue-50
      to-purple-50
      border-2
      border-blue-200
      shadow-lg
    `,
  },

  // Size styles
  sizes: {
    xs: 'p-2 text-xs',
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
    xl: 'p-8 text-xl',
  },

  // State styles
  states: {
    idle: '',
    loading: 'opacity-70 pointer-events-none',
    error: 'border-red-300 bg-red-50',
    success: 'border-green-300 bg-green-50',
  },

  // Hover effect
  hover: `
    hover:shadow-md
    hover:border-gray-300
  `,

  // Focus effect
  focus: `
    focus:ring-2
    focus:ring-blue-500
    focus:ring-offset-2
  `,

  // Disabled state
  disabled: `
    opacity-50
    cursor-not-allowed
    pointer-events-none
  `,
};

/**
 * Shadow utility classes
 */
export const shadowClasses = {
  true: 'shadow-md',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  false: '',
};

/**
 * Header styles
 */
export const headerStyles = {
  base: `
    flex
    items-start
    justify-between
    gap-3
    pb-3
    border-b
    border-gray-200
  `,
  title: `
    font-semibold
    text-gray-900
    flex
    items-center
    gap-2
  `,
  subtitle: `
    text-sm
    text-gray-500
    mt-1
  `,
};

/**
 * Content styles
 */
export const contentStyles = {
  base: 'flex-1',
  padded: 'py-4',
};

/**
 * Footer styles
 */
export const footerStyles = {
  base: `
    pt-3
    border-t
    border-gray-200
    mt-auto
  `,
  align: {
    left: 'flex justify-start',
    center: 'flex justify-center',
    right: 'flex justify-end',
    between: 'flex justify-between',
  },
};

/**
 * Media styles
 */
export const mediaStyles = {
  base: 'overflow-hidden rounded-t-lg',
  aspectRatio: {
    '1/1': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '21/9': 'aspect-[21/9]',
  },
  objectFit: {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
  },
};

/**
 * Loading spinner styles
 */
export const loadingStyles = {
  container: `
    absolute
    inset-0
    flex
    items-center
    justify-center
    bg-white
    bg-opacity-90
    rounded-lg
    z-10
  `,
  spinner: `
    w-8
    h-8
    border-4
    border-blue-200
    border-t-blue-600
    rounded-full
    animate-spin
  `,
  message: `
    mt-2
    text-sm
    text-gray-600
  `,
};

/**
 * Error state styles
 */
export const errorStyles = {
  container: `
    p-4
    bg-red-50
    border
    border-red-200
    rounded-lg
    flex
    items-start
    gap-3
  `,
  icon: `
    flex-shrink-0
    w-5
    h-5
    text-red-600
  `,
  message: `
    text-sm
    text-red-800
  `,
};

