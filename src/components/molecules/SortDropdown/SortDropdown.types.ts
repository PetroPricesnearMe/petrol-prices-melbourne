/**
 * Type definitions for SortDropdown component
 */

export type SortOption = 'nearest' | 'price-low' | 'price-high' | 'top-rated' | 'name' | 'suburb';

export interface SortItem {
  value: SortOption;
  label: string;
  icon: string;
  description?: string;
}

export interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  syncWithUrl?: boolean;
  className?: string;
  disabled?: boolean;
  options?: SortItem[];
  showDescription?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

