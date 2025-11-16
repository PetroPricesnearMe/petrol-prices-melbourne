/**
 * Card Component - Example Implementation
 *
 * A flexible card component following atomic design principles.
 * This is a molecule component composed of multiple atoms.
 *
 * Features:
 * - Flexible composition (header, body, footer)
 * - Multiple visual variants
 * - Hover and interactive states
 * - Proper semantic HTML
 * - Accessible
 *
 * @component
 * @example
 * ```tsx
 * <Card variant="elevated" padding="md">
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Card content goes here
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/design-system/utils';
import type { ComponentBaseProps } from '@/types/index';
import type { ComponentWithChildren } from '@/types/index.enhanced';

/**
 * Card variants
 */
const cardVariants = cva(
  ['rounded-xl', 'border', 'transition-all', 'duration-200'],
  {
    variants: {
      variant: {
        default: ['bg-white', 'border-gray-200'],
        elevated: [
          'bg-white',
          'border-transparent',
          'shadow-md',
          'hover:shadow-lg',
        ],
        outlined: ['bg-transparent', 'border-gray-300'],
        ghost: ['bg-transparent', 'border-transparent'],
      },
      padding: {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      interactive: {
        true: [
          'cursor-pointer',
          'hover:border-primary-300',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-primary-500',
        ],
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
    },
  }
);

/**
 * Card Props
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ComponentBaseProps,
    VariantProps<typeof cardVariants> {
  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Make card clickable
   */
  onClick?: () => void;
}

/**
 * Main Card component
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant, padding, interactive, onClick, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant,
            padding,
            interactive: interactive || !!onClick,
          }),
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader Props
 */
export interface CardHeaderProps extends ComponentWithChildren {
  /**
   * Additional spacing
   */
  spacing?: 'sm' | 'md' | 'lg';
}

/**
 * CardHeader component
 */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, spacing = 'md', children, ...props }, ref) => {
    const spacingClasses = {
      sm: 'mb-2',
      md: 'mb-4',
      lg: 'mb-6',
    };

    return (
      <div
        ref={ref}
        className={cn(spacingClasses[spacing], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle Props
 */
export interface CardTitleProps extends ComponentWithChildren {
  /**
   * Heading level
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * CardTitle component
 */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('text-lg font-semibold text-gray-900', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component
 */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  ComponentWithChildren
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('mt-1 text-sm text-gray-600', className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

/**
 * CardContent component
 */
export const CardContent = React.forwardRef<
  HTMLDivElement,
  ComponentWithChildren
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('text-gray-700', className)} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

/**
 * CardFooter Props
 */
export interface CardFooterProps extends ComponentWithChildren {
  /**
   * Alignment
   */
  align?: 'left' | 'center' | 'right' | 'between';
}

/**
 * CardFooter component
 */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'right', children, ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mt-4 flex items-center gap-2',
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
