/**
 * Reusable Badge Component
 * Small label/pill component with variants
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { BadgeProps } from '../types';

/**
 * Badge Component
 * Displays small label with optional icon and pulse animation
 *
 * @example
 * ```tsx
 * <Badge text="Live" variant="success" pulse />
 * <Badge text="New Feature" icon={<Star />} />
 * ```
 */
export function Badge({
  text,
  icon,
  variant = 'default',
  pulse = false,
  className,
  children,
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-white/10 text-white',
    success: 'bg-green-500/10 text-green-400',
    warning: 'bg-yellow-500/10 text-yellow-400',
    info: 'bg-blue-500/10 text-blue-400',
  };

  return (
    <motion.div
      className={cn(
        'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm',
        variantClasses[variant],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {icon && (
        <span className={cn('mr-2', pulse && 'animate-pulse')}>{icon}</span>
      )}
      {text || children}
    </motion.div>
  );
}

/**
 * Status Badge Component
 * Badge with predefined status indicator dot
 */
export function StatusBadge({
  text,
  status = 'success',
  className,
}: {
  text: string;
  status?: 'success' | 'warning' | 'error';
  className?: string;
}) {
  const statusColors = {
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-400',
  };

  return (
    <Badge
      text={text}
      icon={
        <span
          className={cn(
            'h-2 w-2 animate-pulse rounded-full',
            statusColors[status]
          )}
        />
      }
      className={className}
    />
  );
}
