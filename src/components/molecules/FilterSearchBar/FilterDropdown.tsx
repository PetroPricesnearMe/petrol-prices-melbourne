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

import { cn } from '@/utils/cn';

import type { FilterDropdownOption } from './FilterSearchBar.types';

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
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
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          onChange(options[nextIndex].value);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
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
          'w-full flex items-center justify-between gap-2',
          'px-3 py-2.5 md:px-4 md:py-3 rounded-lg',
          'min-h-[44px]',
          'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md',
          'border border-white/20 dark:border-gray-600/50',
          'shadow-sm hover:shadow-md',
          'transition-all duration-200',
          'text-sm md:text-base font-medium',
          'text-gray-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-transparent',
          'touch-manipulation active:scale-95',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'hover:border-primary-500/50 dark:hover:border-primary-400/50'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-label={ariaLabel || `${label} dropdown`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon && <span className="text-lg flex-shrink-0" aria-hidden="true">{icon}</span>}
          <span className="text-gray-600 dark:text-gray-400 text-xs md:text-sm flex-shrink-0">
            {label}:
          </span>
          <span className="truncate">
            {selectedOption ? (
              <span className="flex items-center gap-1.5">
                {selectedOption.icon && (
                  <span className="text-base" aria-hidden="true">{selectedOption.icon}</span>
                )}
                <span>{selectedOption.label}</span>
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
            )}
          </span>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
              'absolute top-full left-0 right-0 mt-2 z-50',
              'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md',
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
                    'w-full flex items-center gap-3 px-4 py-3 md:py-2.5',
                    'min-h-[44px]',
                    'text-left transition-colors duration-150',
                    'hover:bg-primary-50/50 dark:hover:bg-primary-900/20',
                    'focus:outline-none focus:bg-primary-50/50 dark:focus:bg-primary-900/20',
                    'touch-manipulation active:scale-98',
                    isSelected && 'bg-primary-100/50 dark:bg-primary-900/30',
                    'border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0'
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  {option.icon && (
                    <span className="text-lg flex-shrink-0" aria-hidden="true">
                      {option.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'font-medium text-sm md:text-base',
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
                          className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0"
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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

