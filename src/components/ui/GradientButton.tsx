/**
 * GradientButton Component
 * Gradient accent buttons with Tailwind's from/to color utilities and subtle hover/active states
 * Features:
 * - Multiple gradient variants
 * - Scale transforms on hover/active
 * - Accessibility features
 * - Responsive design
 * - Smooth transitions
 */

'use client';

import { forwardRef } from 'react';

import { cn } from '@/styles/system/css-in-js';

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const gradientVariants = {
  primary:
    'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
  secondary: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
  success:
    'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
  warning:
    'from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700',
  error: 'from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700',
  info: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
};

const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px]',
  md: 'px-4 py-2 text-base min-h-[40px]',
  lg: 'px-6 py-3 text-lg min-h-[48px]',
  xl: 'px-8 py-4 text-xl min-h-[56px]',
};

export const GradientButton = forwardRef<
  HTMLButtonElement,
  GradientButtonProps
>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-white',
          'ease-in-out transition-all duration-200',
          'focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',

          // Gradient background
          `bg-gradient-to-r ${gradientVariants[variant]}`,

          // Size variants
          sizeVariants[size],

          // Full width
          fullWidth && 'w-full',

          // Hover and active states with scale transforms
          'hover:scale-105 active:scale-95',
          'hover:shadow-blue-500/25 hover:shadow-lg',
          'active:shadow-md',

          // Loading state
          loading && 'cursor-wait',

          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}

        {/* Content */}
        <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </span>

        {/* Gradient overlay for extra depth */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity duration-200 hover:opacity-100" />
      </button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

// Specialized gradient button variants
export const PrimaryGradientButton = forwardRef<
  HTMLButtonElement,
  Omit<GradientButtonProps, 'variant'>
>((props, ref) => <GradientButton ref={ref} variant="primary" {...props} />);

export const SuccessGradientButton = forwardRef<
  HTMLButtonElement,
  Omit<GradientButtonProps, 'variant'>
>((props, ref) => <GradientButton ref={ref} variant="success" {...props} />);

export const WarningGradientButton = forwardRef<
  HTMLButtonElement,
  Omit<GradientButtonProps, 'variant'>
>((props, ref) => <GradientButton ref={ref} variant="warning" {...props} />);

export const ErrorGradientButton = forwardRef<
  HTMLButtonElement,
  Omit<GradientButtonProps, 'variant'>
>((props, ref) => <GradientButton ref={ref} variant="error" {...props} />);

// Icon button variant
export const GradientIconButton = forwardRef<
  HTMLButtonElement,
  Omit<GradientButtonProps, 'children'>
>(({ className, ...props }, ref) => (
  <GradientButton
    ref={ref}
    className={cn('min-h-auto aspect-square p-2', className)}
    {...props}
  />
));

// Button group component
interface GradientButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function GradientButtonGroup({
  children,
  className,
  orientation = 'horizontal',
}: GradientButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        orientation === 'horizontal'
          ? 'divide-x divide-white/20'
          : 'divide-y divide-white/20',
        'overflow-hidden rounded-lg shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

export default GradientButton;
