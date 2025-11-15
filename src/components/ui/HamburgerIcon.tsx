/**
 * HamburgerIcon Component
 * Animated hamburger menu icon with smooth transitions
 * Features:
 * - Smooth rotation animations
 * - Customizable size and color
 * - Accessibility features
 * - Tailwind CSS styling
 */

'use client';

import { motion } from 'framer-motion';

import { cn } from '@/styles/system/css-in-js';

interface HamburgerIconProps {
  isOpen: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'gray' | 'black';
  className?: string;
  disabled?: boolean;
}

const sizeVariants = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const colorVariants = {
  white: 'text-white',
  gray: 'text-gray-600 dark:text-gray-400',
  black: 'text-black dark:text-white',
};

export function HamburgerIcon({
  isOpen,
  onClick,
  size = 'md',
  color = 'gray',
  className,
  disabled = false,
}: HamburgerIconProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'transition-all duration-200',
        'focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'rounded-lg p-1',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      {/* Top line */}
      <motion.span
        className={cn(
          'ease-in-out block h-0.5 bg-current transition-all duration-300',
          sizeVariants[size],
          colorVariants[color]
        )}
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 0 : -3,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />

      {/* Middle line */}
      <motion.span
        className={cn(
          'ease-in-out block h-0.5 bg-current transition-all duration-300',
          sizeVariants[size],
          colorVariants[color]
        )}
        animate={{
          opacity: isOpen ? 0 : 1,
          scale: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />

      {/* Bottom line */}
      <motion.span
        className={cn(
          'ease-in-out block h-0.5 bg-current transition-all duration-300',
          sizeVariants[size],
          colorVariants[color]
        )}
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? 0 : 3,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </button>
  );
}

export default HamburgerIcon;
