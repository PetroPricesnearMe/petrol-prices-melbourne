/**
 * Component TypeScript Types
 *
 * Reusable component prop types following modern React patterns
 * @module types/component
 */

import type React from 'react';
import { type ReactNode, type CSSProperties, type AriaAttributes } from 'react';

import type { BaseProps } from './common';

// ============================================================================
// Variant Types
// ============================================================================

/** Common component sizes */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Common component variants */
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost' | 'outline';

/** Color schemes */
export type ColorScheme = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray' | 'pink' | 'indigo';

/** Component alignment */
export type Alignment = 'left' | 'center' | 'right' | 'justify';

/** Component position */
export type Position = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// ============================================================================
// Accessibility Props
// ============================================================================

/** ARIA accessibility props */
export interface AccessibilityProps extends AriaAttributes {
  /** Accessible label */
  'aria-label'?: string;
  /** ID of element that labels this component */
  'aria-labelledby'?: string;
  /** Additional description */
  'aria-describedby'?: string;
  /** Required field */
  'aria-required'?: boolean;
  /** Invalid state */
  'aria-invalid'?: boolean;
  /** Hidden from screen readers */
  'aria-hidden'?: boolean;
  /** Live region */
  'aria-live'?: 'off' | 'polite' | 'assertive';
  /** Role */
  role?: string;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
}

// ============================================================================
// Interactive Component Props
// ============================================================================

/** Button-like component props */
export interface ButtonProps extends BaseProps, AccessibilityProps {
  /** Button variant */
  variant?: Variant;
  /** Button size */
  size?: Size;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Icon before text */
  leftIcon?: ReactNode;
  /** Icon after text */
  rightIcon?: ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
}

/** Link component props */
export interface LinkProps extends BaseProps, AccessibilityProps {
  /** Link URL */
  href: string;
  /** Target */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** Rel attribute for security */
  rel?: string;
  /** External link */
  external?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Variant */
  variant?: 'default' | 'underline' | 'button';
}

// ============================================================================
// Form Component Props
// ============================================================================

/** Input component props */
export interface InputProps extends BaseProps, AccessibilityProps {
  /** Input name */
  name?: string;
  /** Input value */
  value?: string | number;
  /** Placeholder text */
  placeholder?: string;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time';
  /** Disabled state */
  disabled?: boolean;
  /** Readonly state */
  readOnly?: boolean;
  /** Required field */
  required?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Helper text */
  helperText?: string;
  /** Input size */
  size?: Size;
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Max length */
  maxLength?: number;
  /** Min length */
  minLength?: number;
  /** Pattern */
  pattern?: string;
  /** Autocomplete */
  autoComplete?: string;
}

/** Select component props */
export interface SelectProps extends BaseProps, AccessibilityProps {
  /** Select name */
  name?: string;
  /** Selected value */
  value?: string | number;
  /** Options */
  options: SelectOption[];
  /** Placeholder */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Required field */
  required?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Size */
  size?: Size;
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

/** Select option */
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

/** Textarea component props */
export interface TextareaProps extends BaseProps, AccessibilityProps {
  /** Textarea name */
  name?: string;
  /** Textarea value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Rows */
  rows?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Readonly state */
  readOnly?: boolean;
  /** Required field */
  required?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Resize behavior */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Max length */
  maxLength?: number;
}

/** Checkbox component props */
export interface CheckboxProps extends BaseProps, AccessibilityProps {
  /** Checkbox name */
  name?: string;
  /** Checked state */
  checked?: boolean;
  /** Label */
  label?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Required field */
  required?: boolean;
  /** Indeterminate state */
  indeterminate?: boolean;
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// ============================================================================
// Display Component Props
// ============================================================================

/** Card component props */
export interface CardProps extends BaseProps {
  /** Card variant */
  variant?: 'default' | 'outlined' | 'elevated';
  /** Padding */
  padding?: Size;
  /** Hoverable */
  hoverable?: boolean;
  /** Click handler */
  onClick?: () => void;
}

/** Badge component props */
export interface BadgeProps extends BaseProps {
  /** Badge variant */
  variant?: Variant;
  /** Badge size */
  size?: Size;
  /** Color scheme */
  colorScheme?: ColorScheme;
  /** Dot indicator */
  dot?: boolean;
}

/** Modal component props */
export interface ModalProps extends BaseProps, AccessibilityProps {
  /** Modal open state */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: ReactNode;
  /** Modal size */
  size?: Size;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape */
  closeOnEscape?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Footer content */
  footer?: ReactNode;
}

/** Tooltip component props */
export interface TooltipProps extends BaseProps {
  /** Tooltip content */
  content: ReactNode;
  /** Tooltip position */
  position?: Position;
  /** Delay before showing (ms) */
  delay?: number;
  /** Always show */
  isOpen?: boolean;
}

/** Alert component props */
export interface AlertProps extends BaseProps {
  /** Alert variant */
  variant?: 'success' | 'warning' | 'error' | 'info';
  /** Alert title */
  title?: string;
  /** Dismissible */
  dismissible?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Icon */
  icon?: ReactNode;
}

// ============================================================================
// Layout Component Props
// ============================================================================

/** Container component props */
export interface ContainerProps extends BaseProps {
  /** Max width */
  maxWidth?: Size | 'full';
  /** Centered */
  centered?: boolean;
  /** Padding */
  padding?: Size;
}

/** Stack component props */
export interface StackProps extends BaseProps {
  /** Direction */
  direction?: 'horizontal' | 'vertical';
  /** Spacing between items */
  spacing?: Size | number;
  /** Alignment */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Wrap items */
  wrap?: boolean;
}

/** Grid component props */
export interface GridProps extends BaseProps {
  /** Number of columns */
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Gap between items */
  gap?: Size | number;
  /** Row gap */
  rowGap?: Size | number;
  /** Column gap */
  columnGap?: Size | number;
}

// ============================================================================
// Data Display Component Props
// ============================================================================

/** Table component props */
export interface TableProps extends BaseProps {
  /** Table data */
  data: unknown[];
  /** Table columns */
  columns: TableColumn[];
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Sortable */
  sortable?: boolean;
  /** Current sort */
  sortBy?: string;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Sort handler */
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  /** Row click handler */
  onRowClick?: (row: Record<string, unknown>) => void;
  /** Striped rows */
  striped?: boolean;
  /** Hoverable rows */
  hoverable?: boolean;
}

/** Table column definition */
export interface TableColumn {
  /** Column key */
  key: string;
  /** Column header */
  header: ReactNode;
  /** Cell renderer */
  cell?: (row: Record<string, unknown>) => ReactNode;
  /** Sortable */
  sortable?: boolean;
  /** Width */
  width?: string | number;
  /** Alignment */
  align?: Alignment;
}

/** List component props */
export interface ListProps extends BaseProps {
  /** List items */
  items: unknown[];
  /** Item renderer */
  renderItem: (item: unknown, index: number) => ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state */
  emptyMessage?: string;
  /** Item key extractor */
  keyExtractor?: (item: unknown, index: number) => string | number;
  /** Divider */
  divider?: boolean;
}

// ============================================================================
// Feedback Component Props
// ============================================================================

/** Spinner component props */
export interface SpinnerProps extends BaseProps {
  /** Spinner size */
  size?: Size;
  /** Color */
  color?: string;
  /** Label */
  label?: string;
  /** Thickness */
  thickness?: number;
}

/** Progress component props */
export interface ProgressProps extends BaseProps {
  /** Progress value (0-100) */
  value: number;
  /** Max value */
  max?: number;
  /** Show label */
  showLabel?: boolean;
  /** Label */
  label?: string;
  /** Size */
  size?: Size;
  /** Color scheme */
  colorScheme?: ColorScheme;
  /** Striped */
  striped?: boolean;
  /** Animated */
  animated?: boolean;
}

/** Skeleton component props */
export interface SkeletonProps extends BaseProps {
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Circle shape */
  circle?: boolean;
  /** Number of lines */
  lines?: number;
}

// ============================================================================
// Navigation Component Props
// ============================================================================

/** Tabs component props */
export interface TabsProps extends BaseProps {
  /** Active tab */
  activeTab: string | number;
  /** Tab change handler */
  onChange: (tab: string | number) => void;
  /** Tab items */
  items: TabItem[];
  /** Variant */
  variant?: 'line' | 'enclosed' | 'pills';
  /** Size */
  size?: Size;
}

/** Tab item */
export interface TabItem {
  /** Tab key */
  key: string | number;
  /** Tab label */
  label: ReactNode;
  /** Tab content */
  content: ReactNode;
  /** Disabled */
  disabled?: boolean;
  /** Icon */
  icon?: ReactNode;
}

/** Breadcrumb component props */
export interface BreadcrumbProps extends BaseProps {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Separator */
  separator?: ReactNode;
}

/** Breadcrumb item */
export interface BreadcrumbItem {
  /** Item label */
  label: ReactNode;
  /** Item href */
  href?: string;
  /** Current page */
  isCurrent?: boolean;
}

// ============================================================================
// Utility Props
// ============================================================================

/** Props with style */
export interface WithStyle {
  style?: CSSProperties;
}

/** Props with ref */
export interface WithRef<T = HTMLElement> {
  ref?: React.Ref<T>;
}

/** Props with data attributes */
export interface WithDataAttributes {
  [key: `data-${string}`]: string | number | boolean | undefined;
}

// ============================================================================
// Type Helpers
// ============================================================================

/** Polymorphic component props */
export type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as'>;

/** Extract component props */
export type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : never;

/** Component with children */
export type WithChildren<P = Record<string, never>> = P & { children?: ReactNode };

/** Component ref type */
export type ComponentRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];
