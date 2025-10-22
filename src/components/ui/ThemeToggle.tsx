/**
 * Theme Toggle Component
 * Advanced theme switcher with animations and accessibility
 */

'use client';

import { cn, animations, a11y } from '@/styles/system/css-in-js';
import { useTheme } from '@/styles/system/theme';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabel && (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Theme:
        </span>
      )}

      {/* Quick Toggle Button */}
      <button
        onClick={toggleTheme}
        className={cn(
          'btn btn-ghost btn-sm',
          animations.safe('transition-transform hover:scale-110'),
          a11y.focusRing('primary')
        )}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Current theme: ${resolvedTheme}`}
      >
        {resolvedTheme === 'dark' ? (
          <SunIcon className="w-5 h-5" />
        ) : (
          <MoonIcon className="w-5 h-5" />
        )}
      </button>

      {/* Optional Dropdown */}
      {showLabel && (
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          className="input input-sm"
          aria-label="Select theme"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      )}
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('transition-transform rotate-0', className)}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('transition-transform', className)}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  );
}

export default ThemeToggle;
