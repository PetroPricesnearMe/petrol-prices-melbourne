/**
 * NorthernTradieCard Component Types
 * Comprehensive TypeScript interfaces and types
 */

import type { ReactNode, HTMLAttributes } from 'react';

/**
 * Card variant types
 */
export type CardVariant =
  | 'default'
  | 'elevated'
  | 'outlined'
  | 'filled'
  | 'interactive'
  | 'featured';

/**
 * Card size options
 */
export type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Card state types
 */
export type CardState = 'idle' | 'loading' | 'error' | 'success';

/**
 * Card header props
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title?: ReactNode;
  /** Header subtitle */
  subtitle?: ReactNode;
  /** Icon element */
  icon?: ReactNode;
  /** Action buttons or elements */
  action?: ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * Card content props
 */
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Content children */
  children: ReactNode;
  /** Custom className */
  className?: string;
  /** Enable padding */
  padded?: boolean;
}

/**
 * Card footer props
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Footer children */
  children: ReactNode;
  /** Custom className */
  className?: string;
  /** Alignment */
  align?: 'left' | 'center' | 'right' | 'between';
}

/**
 * Card media props
 */
export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  /** Image source */
  src?: string;
  /** Image alt text */
  alt?: string;
  /** Aspect ratio */
  aspectRatio?: '1/1' | '4/3' | '16/9' | '21/9';
  /** Custom content instead of image */
  children?: ReactNode;
  /** Custom className */
  className?: string;
  /** Object fit style */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
}

/**
 * Main card component props
 */
export interface NorthernTradieCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Card variant */
  variant?: CardVariant;
  /** Card size */
  size?: CardSize;
  /** Current state */
  state?: CardState;
  /** Error message (shown when state is 'error') */
  errorMessage?: string;
  /** Loading message */
  loadingMessage?: string;
  /** Children elements */
  children?: ReactNode;
  /** Custom className */
  className?: string;
  /** Enable hover effect */
  hoverable?: boolean;
  /** Enable click interaction */
  clickable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Disable card */
  disabled?: boolean;
  /** Enable animation on mount */
  animated?: boolean;
  /** Animation delay in ms */
  animationDelay?: number;
  /** Test ID for testing */
  testId?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** ARIA role */
  role?: string;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Keyboard handler */
  onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  /** Focus handler */
  onFocus?: () => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Enable border */
  bordered?: boolean;
  /** Enable shadow */
  shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  /** Background color override */
  bgColor?: string;
}

/**
 * Style configuration type
 */
export interface CardStyleConfig {
  base: string;
  variants: Record<CardVariant, string>;
  sizes: Record<CardSize, string>;
  states: Record<CardState, string>;
  hover: string;
  focus: string;
  disabled: string;
}
