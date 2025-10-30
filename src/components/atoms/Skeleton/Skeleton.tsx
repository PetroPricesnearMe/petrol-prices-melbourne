/**
 * Skeleton Loading Component
 *
 * Animated skeleton placeholders for loading states
 * Uses Tailwind shimmer effects
 */

'use client';

import { cn } from '@/styles/system/css-in-js';
import './Skeleton.css';

interface SkeletonProps {
  /** Variant type */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Additional className */
  className?: string;
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'wave',
}: SkeletonProps) {
  const baseClass = 'skeleton';
  const variantClass = `skeleton--${variant}`;
  const animationClass = animation !== 'none' ? `skeleton--${animation}` : '';

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn(baseClass, variantClass, animationClass, className)}
      style={style}
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading..."
    />
  );
}

export default Skeleton;
