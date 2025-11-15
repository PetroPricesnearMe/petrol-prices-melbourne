/**
 * ThemeToggle Component
 *
 * Accessible theme switcher component
 * Supports light, dark, and system themes
 *
 * @component
 */

import React, { useState, useEffect } from 'react';

import { getTheme, setTheme, getActiveTheme } from '../utils/darkMode';

const ThemeToggle = ({ variant = 'button', className = '' }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [activeTheme, setActiveThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(getTheme());
    setActiveThemeState(getActiveTheme());

    const handleThemeChange = (e) => {
      setCurrentTheme(e.detail.theme);
      setActiveThemeState(e.detail.activeTheme);
    };

    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const handleToggle = () => {
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const handleSelectChange = (e) => {
    setTheme(e.target.value);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`h-11 w-11 ${className}`} aria-hidden="true">
        <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <label htmlFor="theme-select" className="sr-only">
          Choose theme
        </label>
        <select
          id="theme-select"
          value={currentTheme}
          onChange={handleSelectChange}
          className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Theme selection"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>

        {/* Icon */}
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {activeTheme === 'dark' ? (
            <MoonIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          ) : (
            <SunIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          )}
        </div>

        {/* Dropdown arrow */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className="h-4 w-4 text-gray-700 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Button variant (default)
  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 p-2.5 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900 ${className}`}
      aria-label={`Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={activeTheme === 'dark'}
      type="button"
    >
      {/* Sun icon (light mode) */}
      <SunIcon
        className={`text-amber-500 absolute h-6 w-6 transition-all duration-300 ${
          activeTheme === 'dark'
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }`}
      />

      {/* Moon icon (dark mode) */}
      <MoonIcon
        className={`text-blue-400 absolute h-6 w-6 transition-all duration-300 ${
          activeTheme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
    </button>
  );
};

// Sun Icon Component
const SunIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

// Moon Icon Component
const MoonIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

export default ThemeToggle;
