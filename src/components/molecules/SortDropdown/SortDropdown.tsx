/**
 * SortDropdown Component
 * Animated dropdown for sorting with URL query sync
 * Features:
 * - Framer Motion animations
 * - URL query parameter sync
 * - Accessible keyboard navigation
 * - Minimalistic Tailwind design
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

import { cn } from '@/utils/cn';

export type SortOption =
  | 'nearest'
  | 'price-low'
  | 'price-high'
  | 'top-rated'
  | 'name'
  | 'suburb';

interface SortItem {
  value: SortOption;
  label: string;
  icon: string;
  description?: string;
}

const sortOptions: SortItem[] = [
  {
    value: 'nearest',
    label: 'Nearest',
    icon: '📍',
    description: 'Closest to you',
  },
  {
    value: 'price-low',
    label: 'Lowest Price',
    icon: '💰',
    description: 'Cheapest first',
  },
  {
    value: 'price-high',
    label: 'Highest Price',
    icon: '💸',
    description: 'Most expensive first',
  },
  {
    value: 'top-rated',
    label: 'Top Rated',
    icon: '⭐',
    description: 'Best reviews',
  },
  {
    value: 'name',
    label: 'Name (A-Z)',
    icon: '🔤',
    description: 'Alphabetical',
  },
  {
    value: 'suburb',
    label: 'Suburb',
    icon: '🏘️',
    description: 'By location',
  },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  syncWithUrl?: boolean;
  className?: string;
  disabled?: boolean;
}

export function SortDropdown({
  value,
  onChange,
  syncWithUrl = true,
  className,
  disabled = false,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedOption =
    sortOptions.find((opt) => opt.value === value) || sortOptions[1];

  // Sync with URL on mount
  useEffect(() => {
    if (syncWithUrl) {
      const urlSort = searchParams.get('sort') as SortOption;
      if (urlSort && sortOptions.find((opt) => opt.value === urlSort)) {
        onChange(urlSort);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to sync initial URL state

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
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);

    // Sync with URL
    if (syncWithUrl) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', option);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
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
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={cn(
          'flex w-full items-center justify-between gap-3',
          'rounded-lg px-4 py-3 md:py-2.5',
          'min-h-[44px]',
          'bg-white dark:bg-gray-800',
          'border border-gray-300 dark:border-gray-600',
          'shadow-sm hover:shadow-md',
          'transition-all duration-200',
          'text-sm font-medium md:text-base',
          'text-gray-900 dark:text-white',
          'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500',
          'touch-manipulation active:scale-95',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && 'hover:border-primary-500 dark:hover:border-primary-400'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Sort options"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            {selectedOption.icon}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Sort by:
          </span>
          <span>{selectedOption.label}</span>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-5 w-5 text-gray-400"
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
              'bg-white dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'rounded-lg shadow-lg',
              'overflow-hidden'
            )}
            role="listbox"
            aria-label="Sort options list"
          >
            {sortOptions.map((option, index) => {
              const isSelected = option.value === value;

              return (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3.5 md:py-3',
                    'min-h-[44px]',
                    'text-left transition-colors duration-150',
                    'hover:bg-gray-50 dark:hover:bg-gray-700',
                    'focus:bg-gray-50 focus:outline-none dark:focus:bg-gray-700',
                    'active:scale-98 touch-manipulation',
                    isSelected && 'bg-primary-50 dark:bg-primary-900/20',
                    'border-b border-gray-100 last:border-b-0 dark:border-gray-700'
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="text-xl" aria-hidden="true">
                    {option.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-sm font-medium',
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
                          className="h-4 w-4 text-primary-600 dark:text-primary-400"
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

export default SortDropdown;
