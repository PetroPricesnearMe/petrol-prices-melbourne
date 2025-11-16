/**
 * Reusable Section Component
 * Container for page sections with consistent styling
 */

import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import {
  CONTAINER_CLASSES,
  SECTION_PADDING,
  SECTION_BACKGROUNDS,
  TYPOGRAPHY,
} from '../constants';
import type { SectionProps, SectionHeaderProps } from '../types';

/**
 * Section Component
 * Semantic section wrapper with configurable styling
 *
 * @example
 * ```tsx
 * <Section background="gray" padding="lg">
 *   <SectionHeader title="Features" subtitle="Everything you need" />
 *   <div>Content</div>
 * </Section>
 * ```
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      id,
      fullWidth = false,
      background = 'white',
      padding = 'lg',
      className,
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          SECTION_PADDING[padding],
          SECTION_BACKGROUNDS[background],
          className
        )}
      >
        <div className={fullWidth ? '' : CONTAINER_CLASSES}>
          <div className={fullWidth ? '' : 'mx-auto max-w-6xl'}>{children}</div>
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';

/**
 * Section Header Component
 * Consistent heading structure for sections
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Our Features"
 *   subtitle="Everything You Need"
 *   description="Comprehensive tools for fuel savings"
 *   centered
 * />
 * ```
 */
export function SectionHeader({
  title,
  subtitle,
  description,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-16', centered && 'text-center')}>
      {subtitle && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
          {subtitle}
        </p>
      )}
      <h2 className={cn(TYPOGRAPHY.h2, 'mb-6 text-gray-900 dark:text-white')}>
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            TYPOGRAPHY.body,
            'text-gray-600 dark:text-gray-400',
            centered && 'mx-auto max-w-3xl'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Grid Container Component
 * Responsive grid layout for section content
 */
export function GridContainer({
  children,
  columns = 3,
  gap = 'md',
  className,
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-8',
    lg: 'gap-12',
  };

  const columnClasses = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
