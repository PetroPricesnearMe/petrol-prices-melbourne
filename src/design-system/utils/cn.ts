/**
 * ClassName Utility (cn)
 * 
 * Merges Tailwind CSS classes intelligently, handling conflicts.
 * Uses tailwind-merge for proper class precedence and clsx for conditional classes.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * cn('bg-red-500', 'text-white') // 'bg-red-500 text-white'
 * 
 * // Conflicting classes (last one wins)
 * cn('bg-red-500', 'bg-blue-500') // 'bg-blue-500'
 * 
 * // Conditional classes
 * cn('btn', isActive && 'btn-active') // 'btn btn-active' or 'btn'
 * 
 * // Array and object syntax
 * cn(['btn', 'btn-primary'], { 'btn-disabled': isDisabled })
 * ```
 * 
 * @module design-system/utils/cn
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names intelligently
 * 
 * @param inputs - Class names to merge (strings, arrays, objects, or falsy values)
 * @returns Merged class string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Type-safe variant creator for component variants
 * 
 * @example
 * ```tsx
 * const buttonVariants = cva('btn', {
 *   variants: {
 *     size: {
 *       sm: 'btn-sm',
 *       md: 'btn-md',
 *       lg: 'btn-lg',
 *     },
 *     variant: {
 *       primary: 'btn-primary',
 *       secondary: 'btn-secondary',
 *     },
 *   },
 *   defaultVariants: {
 *     size: 'md',
 *     variant: 'primary',
 *   },
 * });
 * ```
 */
export function cva<T extends Record<string, Record<string, string>>>(
  base: string,
  config: {
    variants?: T;
    defaultVariants?: Partial<{ [K in keyof T]: keyof T[K] }>;
  }
) {
  return (props?: Partial<{ [K in keyof T]: keyof T[K] }> & { className?: string }) => {
    const { className, ...variantProps } = props ?? {};
    const classes = [base];

    if (config.variants) {
      Object.keys(config.variants).forEach((variantKey) => {
        const variantValue =
          (variantProps as any)[variantKey] ??
          (config.defaultVariants as any)?.[variantKey];
        
        if (variantValue) {
          classes.push((config.variants as any)[variantKey][variantValue]);
        }
      });
    }

    return cn(...classes, className);
  };
}

/**
 * Export default
 */
export default cn;

