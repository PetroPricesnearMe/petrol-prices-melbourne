/**
 * Dark Mode Utility
 *
 * Provides utilities for managing dark mode state
 * Supports:
 * - System preference detection
 * - Manual theme toggle
 * - localStorage persistence
 * - CSS class application
 *
 * @module darkMode
 */

const THEME_KEY = 'theme';
const DARK_CLASS = 'dark';
const LIGHT_CLASS = 'light';

/**
 * Gets the current theme from localStorage or system preference
 * @returns {'light' | 'dark' | 'system'} Current theme
 */
export function getTheme() {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;

  return 'system';
}

/**
 * Gets the system's preferred color scheme
 * @returns {'light' | 'dark'} System preference
 */
export function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Gets the active theme (resolves 'system' to actual theme)
 * @returns {'light' | 'dark'} Active theme
 */
export function getActiveTheme() {
  const theme = getTheme();
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Applies the theme to the document
 * @param {'light' | 'dark'} theme - Theme to apply
 */
export function applyTheme(theme) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // Remove both classes
  root.classList.remove(DARK_CLASS, LIGHT_CLASS);

  // Add the appropriate class
  if (theme === 'dark') {
    root.classList.add(DARK_CLASS);
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.add(LIGHT_CLASS);
    root.setAttribute('data-theme', 'light');
  }

  // Update meta theme-color for mobile browsers
  updateThemeColor(theme);
}

/**
 * Updates the theme-color meta tag
 * @param {'light' | 'dark'} theme - Current theme
 */
function updateThemeColor(theme) {
  if (typeof window === 'undefined') return;

  let metaThemeColor = document.querySelector('meta[name="theme-color"]');

  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    document.head.appendChild(metaThemeColor);
  }

  // Set theme color based on theme
  metaThemeColor.content = theme === 'dark' ? '#111827' : '#ffffff';
}

/**
 * Sets the theme and persists to localStorage
 * @param {'light' | 'dark' | 'system'} theme - Theme to set
 */
export function setTheme(theme) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(THEME_KEY, theme);

  // Apply the actual theme (resolve 'system' to light/dark)
  const activeTheme = theme === 'system' ? getSystemTheme() : theme;
  applyTheme(activeTheme);

  // Dispatch custom event for listeners
  window.dispatchEvent(
    new CustomEvent('themechange', {
      detail: { theme, activeTheme },
    })
  );
}

/**
 * Toggles between light and dark mode
 * @returns {'light' | 'dark'} New theme
 */
export function toggleTheme() {
  const currentTheme = getActiveTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

/**
 * Initializes the theme on page load
 * Should be called as early as possible to prevent flash
 */
export function initTheme() {
  if (typeof window === 'undefined') return;

  const theme = getTheme();
  const activeTheme = theme === 'system' ? getSystemTheme() : theme;
  applyTheme(activeTheme);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e) => {
    if (getTheme() === 'system') {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  }
  // Legacy browsers
  else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleChange);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.removeListener) {
      mediaQuery.removeListener(handleChange);
    }
  };
}

/**
 * React hook for using theme
 * @returns {Object} Theme state and controls
 */
export function useTheme() {
  const [theme, setThemeState] = React.useState(getTheme);
  const [activeTheme, setActiveTheme] = React.useState(getActiveTheme);

  React.useEffect(() => {
    // Initialize theme
    initTheme();

    // Listen for theme changes
    const handleThemeChange = (e) => {
      setThemeState(e.detail.theme);
      setActiveTheme(e.detail.activeTheme);
    };

    window.addEventListener('themechange', handleThemeChange);

    return () => {
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  return {
    theme,
    activeTheme,
    setTheme,
    toggleTheme,
    isDark: activeTheme === 'dark',
    isLight: activeTheme === 'light',
    isSystem: theme === 'system',
  };
}

// Inline script to prevent flash of wrong theme
// This should be added to the <head> of your HTML
export const THEME_INIT_SCRIPT = `
(function() {
  try {
    var theme = localStorage.getItem('theme') || 'system';
    var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
`;

export default {
  getTheme,
  getSystemTheme,
  getActiveTheme,
  setTheme,
  toggleTheme,
  initTheme,
  applyTheme,
  useTheme,
  THEME_INIT_SCRIPT,
};
