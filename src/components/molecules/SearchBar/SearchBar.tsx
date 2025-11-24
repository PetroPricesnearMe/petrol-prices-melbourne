/**
 * SearchBar Component (Molecule)
 *
 * Search input with integrated clear button and loading state
 */

import React, { useState, useCallback } from 'react';

import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';

import { cn } from '@/design-system/utils/styled';
import type { BaseProps } from '@/types/index';

import './SearchBar.css';

export interface SearchBarProps extends BaseProps {
  /** Search value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** onChange handler */
  onChange?: (value: string) => void;
  /** onSubmit handler */
  onSubmit?: (value: string) => void;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show search button */
  showButton?: boolean;
  /** Clear button label */
  clearLabel?: string;
  /** Search button label */
  searchLabel?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value: controlledValue,
  placeholder = 'Search...',
  onChange,
  onSubmit,
  loading = false,
  disabled = false,
  size = 'md',
  showButton = true,
  clearLabel = 'Clear search',
  searchLabel = 'Search',
  className,
  style,
  testId,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  const handleClear = useCallback(() => {
    const newValue = '';
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [isControlled, onChange]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(value);
    },
    [onSubmit, value]
  );

  const searchIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const clearIcon = (
    <button
      type="button"
      className="search-bar__clear"
      onClick={handleClear}
      aria-label={clearLabel}
      disabled={disabled || !value}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M12 4L4 12M4 4L12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );

  return (
    <form
      className={cn('search-bar', `search-bar--${size}`, className)}
      style={style}
      onSubmit={handleSubmit}
      role="search"
      data-testid={testId}
    >
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        startIcon={searchIcon}
        endIcon={value && !loading ? clearIcon : null}
        fullWidth
        ariaLabel="Search"
      />

      {showButton && (
        <Button
          type="submit"
          size={size}
          disabled={disabled || loading || !value}
          loading={loading}
        >
          {searchLabel}
        </Button>
      )}
    </form>
  );
};
