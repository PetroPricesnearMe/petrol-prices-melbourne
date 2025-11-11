/**
 * Button Component (Atom)
 * Fully typed, accessible button with multiple variants
 * Follows WAI-ARIA best practices
 */

'use client';

import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef, memo } from 'react';

import { cn } from '@/lib/utils';

type BaseProps = {
  /**
   * Button visual variant
   * @default 'solid'
   */
  variant?: 'solid' | 'outlined' | 'ghost';
  
  /**
   * Button color
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  
  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Icon before text
   */
  startIcon?: ReactNode;
  
  /**
   * Icon after text
   */
  endIcon?: ReactNode;

  /**
   * Custom aria-label
   */
  ariaLabel?: string;

  /**
   * Custom aria-describedby
   */
  ariaDescribedBy?: string;

  /**
   * Custom test id
   */
  testId?: string;

  /**
   * Children content
   */
  children?: ReactNode;

  /**
   * Custom class name
   */
  className?: string;
};

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never;
  };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Modern, accessible button component
 * 
 * @example
 * <Button variant="solid" color="primary" size="lg" startIcon={<Icon />}>
 *   Click me
 * </Button>
 */
export const Button = memo(
  forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    (
      {
        variant = 'solid',
        color = 'primary',
        size = 'md',
        fullWidth = false,
        loading = false,
        startIcon,
        endIcon,
        children,
        className,
        disabled,
        ariaLabel,
        ariaDescribedBy,
        testId,
        ...rest
      },
      ref
    ) => {
      const baseClasses = 'button inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

      const variantClasses = {
        solid: {
          primary: 'button--solid button--primary bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500/20 active:bg-primary-800',
          secondary: 'button--solid button--secondary bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500/20 active:bg-secondary-800',
          success: 'button--solid button--success bg-green-600 text-white hover:bg-green-700 focus:ring-green-500/20 active:bg-green-800',
          danger: 'button--solid button--danger bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/20 active:bg-red-800',
          warning: 'button--solid button--warning bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500/20 active:bg-yellow-800',
          info: 'button--solid button--info bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/20 active:bg-blue-800',
        },
        outlined: {
          primary: 'button--outlined button--primary bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 focus:ring-primary-500/20',
          secondary: 'button--outlined button--secondary bg-transparent border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-950 focus:ring-secondary-500/20',
          success: 'button--outlined button--success bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 focus:ring-green-500/20',
          danger: 'button--outlined button--danger bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 focus:ring-red-500/20',
          warning: 'button--outlined button--warning bg-transparent border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950 focus:ring-yellow-500/20',
          info: 'button--outlined button--info bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 focus:ring-blue-500/20',
        },
        ghost: {
          primary: 'button--ghost button--primary bg-transparent text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 focus:ring-primary-500/20',
          secondary: 'button--ghost button--secondary bg-transparent text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 focus:ring-secondary-500/20',
          success: 'button--ghost button--success bg-transparent text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800 focus:ring-green-500/20',
          danger: 'button--ghost button--danger bg-transparent text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 focus:ring-red-500/20',
          warning: 'button--ghost button--warning bg-transparent text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800 focus:ring-yellow-500/20',
          info: 'button--ghost button--info bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500/20',
        },
      };

      const sizeClasses = {
        sm: 'button--sm px-3 py-1.5 text-sm min-h-[36px]',
        md: 'button--md px-4 py-2 text-base min-h-[44px]',
        lg: 'button--lg px-6 py-3 text-lg min-h-[52px]',
        xl: 'button--xl px-8 py-4 text-xl min-h-[60px]',
      };

      const classes = cn(
        baseClasses,
        variantClasses[variant][color],
        sizeClasses[size],
        fullWidth && 'button--full-width w-full',
        disabled && 'button--disabled',
        loading && 'button--loading',
        className
      );

      const isDisabled = disabled || loading;

      const commonProps = {
        className: classes,
        style: 'style' in rest ? rest.style : undefined,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        'aria-busy': loading ? ('true' as const) : undefined,
        'data-testid': testId,
      };

      const spinner = (
        <svg
          className="button__spinner animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );

      const content = loading ? (
        <>
          {spinner}
          <span>Loading...</span>
        </>
      ) : (
        <>
          {startIcon && !loading && startIcon}
          {children}
          {endIcon && !loading && endIcon}
        </>
      );

      // Extract href and link props
      const href = 'href' in rest ? rest.href : undefined;
      const target = 'target' in rest ? rest.target : undefined;
      const rel = 'rel' in rest ? rest.rel : undefined;
      const onClick = 'onClick' in rest ? rest.onClick : undefined;
      const buttonType = 'type' in rest ? rest.type as 'button' | 'submit' | 'reset' | undefined : undefined;
      
      // Extract common HTML attributes
      const htmlAttributes: Record<string, unknown> = {};
      const allowedAttributes = ['style', 'id', 'title', 'tabIndex', 'role', 'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur'];
      allowedAttributes.forEach(attr => {
        if (attr in rest) {
          htmlAttributes[attr] = (rest as Record<string, unknown>)[attr];
        }
      });

      // Handle Enter key for keyboard navigation
      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && onClick && !isDisabled) {
          e.preventDefault();
          (onClick as React.MouseEventHandler<HTMLButtonElement>)(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }
      };

      // Render as link if href is provided and not disabled
      if (href && !isDisabled) {
        const isExternal = href.startsWith('http');
        const linkRel = target === '_blank' ? 'noopener noreferrer' : rel;

        if (isExternal) {
          return (
            <a
              ref={ref as React.Ref<HTMLAnchorElement>}
              href={href}
              target={target}
              rel={linkRel}
              {...commonProps}
              {...htmlAttributes}
            >
              {content}
            </a>
          );
        }

        return (
          <Link
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target={target}
            rel={linkRel}
            {...commonProps}
            {...htmlAttributes}
          >
            {content}
          </Link>
        );
      }

      // Render as button (default or when disabled)
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={buttonType || 'button'}
          disabled={isDisabled}
          onClick={!isDisabled ? onClick as React.MouseEventHandler<HTMLButtonElement> | undefined : undefined}
          onKeyDown={handleKeyDown}
          {...commonProps}
          {...htmlAttributes}
        >
          {content}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';
