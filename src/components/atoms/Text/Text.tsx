/**
 * Text Component (Atom)
 *
 * Typography component with semantic HTML elements and consistent styling
 */

import React from 'react';

import type { TextStyle } from '@/design-system/tokens/typography';
import { cn } from '@/design-system/utils/styled';
import type { BaseProps, PolymorphicProps } from '@/types/index';
import './Text.css';

type TextElement =
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

export interface TextBaseProps extends BaseProps {
  /** Typography variant */
  variant?: TextStyle;
  /** Text color */
  color?:
    | 'primary'
    | 'secondary'
    | 'disabled'
    | 'inverse'
    | 'success'
    | 'warning'
    | 'error';
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Font weight */
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  /** Text decoration */
  decoration?: 'none' | 'underline' | 'line-through';
  /** Truncate text with ellipsis */
  truncate?: boolean;
  /** Line clamp (multi-line truncation) */
  lineClamp?: number;
  /** HTML element to render as */
  as?: TextElement;
  /** Accessible label forwarded to aria-label */
  ariaLabel?: string;
  /** Accessible description ids forwarded to aria-describedby */
  ariaDescribedBy?: string;
  /** Children */
  children: React.ReactNode;
}

export type TextProps<E extends TextElement = 'p'> = PolymorphicProps<E> &
  TextBaseProps;

export function Text<E extends TextElement = 'p'>({
  variant = 'body',
  color = 'primary',
  align = 'left',
  weight,
  decoration,
  truncate = false,
  lineClamp,
  as,
  className,
  style,
  testId,
  ariaLabel,
  ariaDescribedBy,
  children,
  ...restProps
}: TextProps<E>) {
  const Component: React.ElementType = as || 'p';

  const classNames = cn(
    'text',
    `text--${variant}`,
    `text--color-${color}`,
    `text--align-${align}`,
    weight && `text--weight-${weight}`,
    decoration && `text--decoration-${decoration}`,
    truncate && 'text--truncate',
    lineClamp && `text--line-clamp-${lineClamp}`,
    className
  );

  const lineClampStyle = lineClamp
    ? {
        display: '-webkit-box',
        WebkitLineClamp: lineClamp,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
      }
    : {};

  return (
    <Component
      className={classNames}
      style={{ ...lineClampStyle, ...style }}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...(restProps as any)}
    >
      {children}
    </Component>
  );
}

// Convenience components for common use cases
export const Heading1 = (props: Omit<TextProps<'h1'>, 'as' | 'variant'>) => (
  <Text as="h1" variant="h1" {...props} />
);

export const Heading2 = (props: Omit<TextProps<'h2'>, 'as' | 'variant'>) => (
  <Text as="h2" variant="h2" {...props} />
);

export const Heading3 = (props: Omit<TextProps<'h3'>, 'as' | 'variant'>) => (
  <Text as="h3" variant="h3" {...props} />
);

export const Heading4 = (props: Omit<TextProps<'h4'>, 'as' | 'variant'>) => (
  <Text as="h4" variant="h4" {...props} />
);

export const Heading5 = (props: Omit<TextProps<'h5'>, 'as' | 'variant'>) => (
  <Text as="h5" variant="h5" {...props} />
);

export const Heading6 = (props: Omit<TextProps<'h6'>, 'as' | 'variant'>) => (
  <Text as="h6" variant="h6" {...props} />
);

export const BodyText = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="body" {...props} />
);

export const Label = (props: Omit<TextProps<'label'>, 'as' | 'variant'>) => (
  <Text as="label" variant="label" {...props} />
);

export const Caption = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="caption" {...props} />
);
