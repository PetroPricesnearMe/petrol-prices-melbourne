/**
 * NorthernTradieCard Utilities
 * Helper functions for the card component
 */

import { cardStyles, shadowClasses } from './styles';
import type { CardVariant, CardSize, CardState } from './types';

/**
 * Combines class names, filtering out falsy values
 */
export const cn = (
  ...classes: (string | boolean | undefined | null)[]
): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Gets the complete class names for the card based on props
 */
export const getCardClasses = ({
  variant = 'default',
  size = 'md',
  state = 'idle',
  hoverable = false,
  clickable = false,
  disabled = false,
  bordered = true,
  shadow,
  className = '',
}: {
  variant?: CardVariant;
  size?: CardSize;
  state?: CardState;
  hoverable?: boolean;
  clickable?: boolean;
  disabled?: boolean;
  bordered?: boolean;
  shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}): string => {
  return cn(
    cardStyles.base,
    cardStyles.variants[variant],
    cardStyles.sizes[size],
    cardStyles.states[state],
    hoverable && !disabled && cardStyles.hover,
    clickable && !disabled && 'cursor-pointer',
    disabled && cardStyles.disabled,
    !bordered && 'border-0',
    shadow !== undefined &&
      shadowClasses[
        shadow === true ? 'true' : shadow === false ? 'false' : shadow
      ],
    className
  );
};

/**
 * Generates accessible keyboard handlers
 */
export const handleKeyboardInteraction = (
  event: React.KeyboardEvent<HTMLDivElement>,
  onClick?: () => void,
  onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void
): void => {
  // Execute custom handler if provided
  if (onKeyPress) {
    onKeyPress(event);
  }

  // Handle Enter and Space for clickable cards
  if ((event.key === 'Enter' || event.key === ' ') && onClick) {
    event.preventDefault();
    onClick();
  }
};

/**
 * Generates animation variants for framer-motion
 */
export const getAnimationVariants = (delay: number = 0) => ({
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
});

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Generates unique IDs for accessibility
 */
let idCounter = 0;
export const generateId = (prefix: string = 'card'): string => {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Date.now()}`;
};

/**
 * Validates card props
 */
export const validateProps = (props: Record<string, unknown>): string[] => {
  const errors: string[] = [];

  if (
    props.variant &&
    ![
      'default',
      'elevated',
      'outlined',
      'filled',
      'interactive',
      'featured',
    ].includes(props.variant)
  ) {
    errors.push(`Invalid variant: ${props.variant}`);
  }

  if (props.size && !['xs', 'sm', 'md', 'lg', 'xl'].includes(props.size)) {
    errors.push(`Invalid size: ${props.size}`);
  }

  if (
    props.state &&
    !['idle', 'loading', 'error', 'success'].includes(props.state)
  ) {
    errors.push(`Invalid state: ${props.state}`);
  }

  if (
    props.animationDelay &&
    (typeof props.animationDelay !== 'number' || props.animationDelay < 0)
  ) {
    errors.push('animationDelay must be a positive number');
  }

  return errors;
};
