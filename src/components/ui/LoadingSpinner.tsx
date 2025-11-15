/**
 * Loading Spinner Component
 * Accessible loading indicator with reduced motion support
 */

import { cn, animations, a11y } from '@/styles/system/css-in-js';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'current';
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'text-primary-600',
  secondary: 'text-secondary-600',
  white: 'text-white',
  current: 'text-current',
};

export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      role="status"
    >
      <svg
        className={cn(
          sizeClasses[size],
          colorClasses[variant],
          'animate-spin',
          'motion-reduce:animate-none'
        )}
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
      <span className={a11y.srOnly}>{label}</span>
    </div>
  );
}

export function LoadingSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'shimmer h-4 rounded bg-gray-200 dark:bg-gray-700',
            i === lines - 1 && 'w-3/4'
          )}
        />
      ))}
    </div>
  );
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn('card', className)}>
      <div className="space-y-4 p-6">
        <div className="flex-between">
          <div className="shimmer h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="shimmer h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <LoadingSkeleton lines={3} />
        <div className="shimmer h-10 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export default LoadingSpinner;
