/**
 * FilterDropdown Component
 * Reusable dropdown component for filter options
 * Features:
 * - Framer Motion animations
 * - Keyboard navigation
 * - Accessible ARIA attributes
 * - Click outside to close
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

import type { FilterDropdownOption } from './FilterSearchBar.types';

import { cn } from '@/utils/cn';

export interface FilterDropdownProps {
  /** Dropdown label */
  label: string;
  /** Selected value */
  value: string;
  /** Available options */
  options: FilterDropdownOption[];
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** Icon to display before label */
  icon?: string;
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  className,
  ariaLabel,
  icon,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const nextIndex =
            currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          onChange(options[nextIndex].value);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          onChange(options[prevIndex].value);
        }
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'flex w-full items-center justify-between gap-2',
          'rounded-lg px-3 py-2.5 md:px-4 md:py-3',
          'min-h-[44px]',
          'bg-white/90 backdrop-blur-md dark:bg-gray-800/90',
          'border border-white/20 dark:border-gray-600/50',
          'shadow-sm hover:shadow-md',
          'transition-all duration-200',
          'text-sm font-medium md:text-base',
          'text-gray-900 dark:text-white',
          'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'touch-manipulation active:scale-95',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled &&
            'hover:border-primary-500/50 dark:hover:border-primary-400/50'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-label={ariaLabel || `${label} dropdown`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {icon && (
            <span className="flex-shrink-0 text-lg" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="flex-shrink-0 text-xs text-gray-600 dark:text-gray-400 md:text-sm">
            {label}:
          </span>
          <span className="truncate">
            {selectedOption ? (
              <span className="flex items-center gap-1.5">
                {selectedOption.icon && (
                  <span className="text-base" aria-hidden="true">
                    {selectedOption.icon}
                  </span>
                )}
                <span>{selectedOption.label}</span>
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">
                {placeholder}
              </span>
            )}
          </span>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-4 w-4 flex-shrink-0 text-gray-400 md:h-5 md:w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'absolute left-0 right-0 top-full z-50 mt-2',
              'bg-white/95 backdrop-blur-md dark:bg-gray-800/95',
              'border border-white/30 dark:border-gray-700/50',
              'rounded-lg shadow-xl',
              'overflow-hidden',
              'max-h-[300px] overflow-y-auto'
            )}
            role="listbox"
            aria-label={`${label} options`}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;

              return (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 md:py-2.5',
                    'min-h-[44px]',
                    'text-left transition-colors duration-150',
                    'hover:bg-primary-50/50 dark:hover:bg-primary-900/20',
                    'focus:bg-primary-50/50 focus:outline-none dark:focus:bg-primary-900/20',
                    'active:scale-98 touch-manipulation',
                    isSelected && 'bg-primary-100/50 dark:bg-primary-900/30',
                    'border-b border-gray-100/50 last:border-b-0 dark:border-gray-700/50'
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  {option.icon && (
                    <span className="flex-shrink-0 text-lg" aria-hidden="true">
                      {option.icon}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-sm font-medium md:text-base',
                          isSelected
                            ? 'text-primary-700 dark:text-primary-400'
                            : 'text-gray-900 dark:text-white'
                        )}
                      >
                        {option.label}
                      </span>
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-4 w-4 flex-shrink-0 text-primary-600 dark:text-primary-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-label="Selected"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                      )}
                    </div>
                    {option.description && (
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
