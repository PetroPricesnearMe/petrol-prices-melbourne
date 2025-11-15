/**
 * Responsive Grid System
 * 12-column fluid layout with Tailwind utilities
 * Supports all breakpoints: sm, md, lg, xl, 2xl
 */

import type { ReactNode } from 'react';
import React from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface ResponsiveGridProps {
  children: ReactNode;
  /** Number of columns at each breakpoint */
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  /** Gap between grid items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Container padding */
  padding?: boolean;
  /** Custom className */
  className?: string;
  /** Vertical alignment */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  /** Horizontal alignment */
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  /** Auto-fit columns (responsive without breakpoints) */
  autoFit?: {
    min: string; // e.g., '250px'
    max?: string; // e.g., '1fr'
  };
}

interface GridItemProps {
  children: ReactNode;
  /** Column span at each breakpoint */
  colSpan?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  /** Row span */
  rowSpan?: number;
  /** Custom className */
  className?: string;
  /** Order */
  order?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

interface ContainerProps {
  children: ReactNode;
  /** Container size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Padding */
  padding?: boolean;
  /** Custom className */
  className?: string;
  /** Center content */
  center?: boolean;
}

// ============================================================================
// GAP UTILITIES
// ============================================================================

const gapClasses = {
  none: 'gap-0',
  xs: 'gap-2 sm:gap-3',
  sm: 'gap-3 sm:gap-4',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
  xl: 'gap-8 sm:gap-10',
  '2xl': 'gap-10 sm:gap-12 lg:gap-16',
};

const alignItemsClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyItemsClasses = {
  start: 'justify-items-start',
  center: 'justify-items-center',
  end: 'justify-items-end',
  stretch: 'justify-items-stretch',
};

// ============================================================================
// RESPONSIVE GRID COMPONENT
// ============================================================================

/**
 * Responsive Grid Container
 *
 * @example
 * ```tsx
 * <ResponsiveGrid
 *   cols={{ default: 1, sm: 2, lg: 3, xl: 4 }}
 *   gap="lg"
 * >
 *   <GridItem>Content 1</GridItem>
 *   <GridItem>Content 2</GridItem>
 * </ResponsiveGrid>
 * ```
 */
export function ResponsiveGrid({
  children,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 'md',
  padding = false,
  className,
  alignItems = 'stretch',
  justifyItems = 'stretch',
  autoFit,
}: ResponsiveGridProps) {
  // Build responsive column classes
  const colClasses = cn(
    'grid',
    // Default columns
    cols.default && `grid-cols-${cols.default}`,
    // Responsive columns
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`,
    // Auto-fit (CSS Grid auto-fit)
    autoFit && 'grid-cols-[repeat(auto-fit,minmax(var(--grid-min),1fr))]',
    // Gap
    gapClasses[gap],
    // Alignment
    alignItemsClasses[alignItems],
    justifyItemsClasses[justifyItems],
    // Padding
    padding && 'p-4 sm:p-6 lg:p-8',
    className
  );

  const style = autoFit
    ? ({ '--grid-min': autoFit.min } as React.CSSProperties)
    : undefined;

  return (
    <div className={colClasses} style={style}>
      {children}
    </div>
  );
}

// ============================================================================
// GRID ITEM COMPONENT
// ============================================================================

/**
 * Grid Item with responsive column spans
 *
 * @example
 * ```tsx
 * <GridItem colSpan={{ default: 1, lg: 2 }}>
 *   Featured content
 * </GridItem>
 * ```
 */
export function GridItem({
  children,
  colSpan = { default: 1 },
  rowSpan,
  className,
  order,
}: GridItemProps) {
  const itemClasses = cn(
    // Column span
    colSpan.default && `col-span-${colSpan.default}`,
    colSpan.sm && `sm:col-span-${colSpan.sm}`,
    colSpan.md && `md:col-span-${colSpan.md}`,
    colSpan.lg && `lg:col-span-${colSpan.lg}`,
    colSpan.xl && `xl:col-span-${colSpan.xl}`,
    colSpan['2xl'] && `2xl:col-span-${colSpan['2xl']}`,
    // Row span
    rowSpan && `row-span-${rowSpan}`,
    // Order
    order?.default !== undefined && `order-${order.default}`,
    order?.sm !== undefined && `sm:order-${order.sm}`,
    order?.md !== undefined && `md:order-${order.md}`,
    order?.lg !== undefined && `lg:order-${order.lg}`,
    className
  );

  return <div className={itemClasses}>{children}</div>;
}

// ============================================================================
// CONTAINER COMPONENT
// ============================================================================

const containerSizes = {
  sm: 'max-w-2xl', // 672px
  md: 'max-w-4xl', // 896px
  lg: 'max-w-6xl', // 1152px
  xl: 'max-w-7xl', // 1280px
  full: 'max-w-full',
};

/**
 * Responsive Container with max-width
 *
 * @example
 * ```tsx
 * <Container size="lg" padding center>
 *   <h1>Content</h1>
 * </Container>
 * ```
 */
export function Container({
  children,
  size = 'xl',
  padding = true,
  center = true,
  className,
}: ContainerProps) {
  const containerClasses = cn(
    'w-full',
    containerSizes[size],
    center && 'mx-auto',
    padding && 'px-4 sm:px-6 lg:px-8',
    className
  );

  return <div className={containerClasses}>{children}</div>;
}

// ============================================================================
// FLEX UTILITIES
// ============================================================================

interface FlexProps {
  children: ReactNode;
  direction?: 'row' | 'col';
  responsive?: {
    direction?: {
      default?: 'row' | 'col';
      sm?: 'row' | 'col';
      md?: 'row' | 'col';
      lg?: 'row' | 'col';
    };
  };
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  wrap?: boolean;
  className?: string;
}

const flexAlignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const flexJustifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

/**
 * Responsive Flex Container
 *
 * @example
 * ```tsx
 * <Flex
 *   responsive={{ direction: { default: 'col', lg: 'row' } }}
 *   justify="between"
 *   align="center"
 *   gap="lg"
 * >
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 * ```
 */
export function Flex({
  children,
  direction = 'row',
  responsive,
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className,
}: FlexProps) {
  const flexClasses = cn(
    'flex',
    // Direction
    !responsive && (direction === 'col' ? 'flex-col' : 'flex-row'),
    // Responsive direction
    responsive?.direction?.default === 'col' && 'flex-col',
    responsive?.direction?.default === 'row' && 'flex-row',
    responsive?.direction?.sm === 'col' && 'sm:flex-col',
    responsive?.direction?.sm === 'row' && 'sm:flex-row',
    responsive?.direction?.md === 'col' && 'md:flex-col',
    responsive?.direction?.md === 'row' && 'md:flex-row',
    responsive?.direction?.lg === 'col' && 'lg:flex-col',
    responsive?.direction?.lg === 'row' && 'lg:flex-row',
    // Alignment
    flexAlignClasses[align],
    flexJustifyClasses[justify],
    // Gap
    gapClasses[gap],
    // Wrap
    wrap && 'flex-wrap',
    className
  );

  return <div className={flexClasses}>{children}</div>;
}

// ============================================================================
// SECTION COMPONENT
// ============================================================================

interface SectionProps {
  children: ReactNode;
  /** Section padding */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Background color */
  background?: 'white' | 'gray' | 'primary' | 'transparent';
  /** Container size */
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Custom className */
  className?: string;
}

const sectionSpacing = {
  none: '',
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16 lg:py-20',
  lg: 'py-16 sm:py-20 lg:py-24',
  xl: 'py-20 sm:py-24 lg:py-32',
};

const sectionBackgrounds = {
  white: 'bg-white dark:bg-gray-900',
  gray: 'bg-gray-50 dark:bg-gray-800',
  primary: 'bg-primary-50 dark:bg-primary-900/10',
  transparent: 'bg-transparent',
};

/**
 * Section wrapper with consistent spacing
 *
 * @example
 * ```tsx
 * <Section spacing="lg" background="gray">
 *   <Container>
 *     <h2>Section Title</h2>
 *   </Container>
 * </Section>
 * ```
 */
export function Section({
  children,
  spacing = 'md',
  background = 'transparent',
  containerSize = 'xl',
  className,
}: SectionProps) {
  const sectionClasses = cn(
    sectionSpacing[spacing],
    sectionBackgrounds[background],
    className
  );

  return (
    <section className={sectionClasses}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

// ============================================================================
// EXPORT
// ============================================================================

export default ResponsiveGrid;
