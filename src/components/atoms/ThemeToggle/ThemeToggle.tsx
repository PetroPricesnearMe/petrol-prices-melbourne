/**
 * ThemeToggle - Accessible Theme Switcher
 *
 * A fully accessible theme toggle component supporting:
 * - Light, dark, and system themes
 * - Button and dropdown variants
 * - Smooth animations
 * - Keyboard navigation
 * - Screen reader support
 *
 * @component
 * @example
 * ```tsx
 * <ThemeToggle variant="button" />
 * <ThemeToggle variant="dropdown" />
 * ```
 */

'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import React from 'react';

import { cn } from '@/design-system/utils';
import type { ComponentBaseProps } from '@/types';

/**
 * Theme type
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme toggle variants
 */
const toggleVariants = cva('', {
  variants: {
    variant: {
      button: '',
      dropdown: '',
    },
  },
  defaultVariants: {
    variant: 'button',
  },
});

/**
 * ThemeToggle Props
 */
export interface ThemeToggleProps
  extends ComponentBaseProps,
    VariantProps<typeof toggleVariants> {
  /**
   * Component variant
   * @default 'button'
   */
  variant?: 'button' | 'dropdown';

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Get theme from localStorage or system preference
 */
function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as Theme) || 'system';
}

/**
 * Get active theme (resolved from system if needed)
 */
function getActiveTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  const stored = getStoredTheme();
  if (stored !== 'system') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Set theme in localStorage and apply to document
 */
function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('theme', theme);

  const active = theme === 'system' ? getActiveTheme() : theme;
  document.documentElement.classList.toggle('dark', active === 'dark');

  // Dispatch custom event for other components
  window.dispatchEvent(
    new CustomEvent('themechange', {
      detail: { theme, activeTheme: active },
    })
  );
}

/**
 * ThemeToggle Component
 */
export const ThemeToggle = React.memo<ThemeToggleProps>(
  ({ variant = 'button', className, ...props }) => {
    const [mounted, setMounted] = React.useState(false);
    const [currentTheme, setCurrentTheme] = React.useState<Theme>('system');
    const [activeTheme, setActiveTheme] = React.useState<'light' | 'dark'>(
      'light'
    );

    // Initialize theme on mount
    React.useEffect(() => {
      setMounted(true);
      setCurrentTheme(getStoredTheme());
      setActiveTheme(getActiveTheme());

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = () => {
        if (currentTheme === 'system') {
          setActiveTheme(getActiveTheme());
        }
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);

      // Listen for custom theme change events
      const handleThemeChange = (e: Event) => {
        const customEvent = e as CustomEvent;
        setCurrentTheme(customEvent.detail.theme);
        setActiveTheme(customEvent.detail.activeTheme);
      };

      window.addEventListener('themechange', handleThemeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
        window.removeEventListener('themechange', handleThemeChange);
      };
    }, [currentTheme]);

    // Handle theme toggle (button variant)
    const handleToggle = React.useCallback(() => {
      const newTheme: Theme = activeTheme === 'dark' ? 'light' : 'dark';
      setStoredTheme(newTheme);
    }, [activeTheme]);

    // Handle theme selection (dropdown variant)
    const handleSelectChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTheme = e.target.value as Theme;
        setStoredTheme(newTheme);
      },
      []
    );

    // Prevent hydration mismatch
    if (!mounted) {
      return (
        <div
          className={cn('h-11 w-11', className)}
          aria-hidden="true"
          {...props}
        >
          <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
      );
    }

    // Dropdown variant
    if (variant === 'dropdown') {
      return (
        <div
          className={cn('relative', toggleVariants({ variant }), className)}
          {...props}
        >
          <label htmlFor="theme-select" className="sr-only">
            Choose theme
          </label>
          <select
            id="theme-select"
            value={currentTheme}
            onChange={handleSelectChange}
            className={cn(
              'appearance-none',
              'py-2 pl-10 pr-10',
              'bg-white dark:bg-gray-800',
              'border border-gray-300 dark:border-gray-700',
              'rounded-lg',
              'text-sm font-medium',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-gray-50 dark:hover:bg-gray-700',
              'focus:outline-none',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-500',
              'transition-colors',
              'cursor-pointer'
            )}
            aria-label="Theme selection"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>

          {/* Icon */}
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait" initial={false}>
              {activeTheme === 'dark' ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown arrow */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </div>
        </div>
      );
    }

    // Button variant (default)
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'relative',
          'inline-flex items-center justify-center',
          'h-11 w-11 p-2.5',
          'rounded-lg',
          'bg-gray-100 dark:bg-gray-800',
          'hover:bg-gray-200 dark:hover:bg-gray-700',
          'focus:outline-none',
          'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900',
          'transition-colors',
          toggleVariants({ variant }),
          className
        )}
        aria-label={`Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`}
        aria-pressed={activeTheme === 'dark' ? 'true' : 'false'}
        {...props}
      >
        <AnimatePresence mode="wait" initial={false}>
          {activeTheme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="text-blue-400 h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 90, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="text-amber-500 h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';
