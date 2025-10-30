/**
 * Utility functions for the application
 * Includes common helpers like class name merging
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with proper precedence
 * Handles conflicts and ensures correct class order
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
