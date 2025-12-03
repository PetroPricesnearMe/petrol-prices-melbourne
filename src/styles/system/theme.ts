'use client';

/**
 * Theme System
 * Advanced theme switching with performance optimization
 */

import { useEffect, useState, useCallback, createElement } from 'react';
import type { ReactElement } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeConfig {
  storageKey?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  enableTransitions?: boolean;
}

const DEFAULT_CONFIG: Required<ThemeConfig> = {
  storageKey: 'ppnm-theme',
  defaultTheme: 'system',
  enableSystem: true,
  enableTransitions: true,
};

/**
 * Theme Manager Class
 * Handles theme switching, persistence, and system preference detection
 */
class ThemeManager {
  private config: Required<ThemeConfig>;
  private listeners: Set<(theme: ResolvedTheme) => void> = new Set();
  private mediaQuery: MediaQueryList | null = null;

  constructor(config: ThemeConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize(): void {
    // Set up system theme detection
    if (this.config.enableSystem) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
    }

    // Apply initial theme
    this.applyTheme(this.getTheme());
  }

  private handleSystemThemeChange = (): void => {
    const currentTheme = this.getStoredTheme();
    if (currentTheme === 'system') {
      this.applyTheme('system');
    }
  };

  /**
   * Get stored theme from localStorage
   */
  private getStoredTheme(): Theme {
    if (typeof window === 'undefined') return this.config.defaultTheme;

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as Theme;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }

    return this.config.defaultTheme;
  }

  /**
   * Get system theme preference
   */
  private getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Resolve theme to light or dark
   */
  private resolveTheme(theme: Theme): ResolvedTheme {
    return theme === 'system' ? this.getSystemTheme() : theme;
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;

    const resolvedTheme = this.resolveTheme(theme);
    const root = document.documentElement;

    // Disable transitions during theme change if configured
    if (this.config.enableTransitions) {
      const css = document.createElement('style');
      css.appendChild(
        document.createTextNode(
          `* {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            -ms-transition: none !important;
            transition: none !important;
          }`
        )
      );
      document.head.appendChild(css);

      // Force reflow
      (() => window.getComputedStyle(document.body))();

      // Remove after a frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.head.removeChild(css);
        });
      });
    }

    // Update classes
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);

    // Update data attributes for flexibility
    root.setAttribute('data-theme', resolvedTheme);
    root.style.colorScheme = resolvedTheme;

    // Update meta theme-color
    this.updateMetaThemeColor(resolvedTheme);

    // Notify listeners
    this.notifyListeners(resolvedTheme);
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  private updateMetaThemeColor(theme: ResolvedTheme): void {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const color = theme === 'dark' ? '#111827' : '#ffffff';
      meta.setAttribute('content', color);
    }
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyListeners(theme: ResolvedTheme): void {
    this.listeners.forEach((listener) => listener(theme));
  }

  /**
   * Get current theme
   */
  getTheme(): Theme {
    return this.getStoredTheme();
  }

  /**
   * Get resolved theme (light or dark)
   */
  getResolvedTheme(): ResolvedTheme {
    return this.resolveTheme(this.getTheme());
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.config.storageKey, theme);
      this.applyTheme(theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Toggle between light and dark
   */
  toggleTheme(): void {
    const current = this.getResolvedTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /**
   * Subscribe to theme changes
   */
  subscribe(listener: (theme: ResolvedTheme) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
    }
    this.listeners.clear();
  }
}

// Global theme manager instance
let themeManager: ThemeManager | null = null;

/**
 * Get or create theme manager instance
 */
export function getThemeManager(config?: ThemeConfig): ThemeManager {
  if (!themeManager) {
    themeManager = new ThemeManager(config);
  }
  return themeManager;
}

/**
 * React hook for theme management
 */
export function useTheme() {
  const manager = getThemeManager();
  const [theme, setTheme] = useState<Theme>(manager.getTheme());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
    manager.getResolvedTheme()
  );

  useEffect(() => {
    // Subscribe to theme changes
    const unsubscribe = manager.subscribe(setResolvedTheme);

    // Sync initial state
    setTheme(manager.getTheme());
    setResolvedTheme(manager.getResolvedTheme());

    return unsubscribe;
  }, [manager]);

  const updateTheme = useCallback(
    (newTheme: Theme) => {
      manager.setTheme(newTheme);
      setTheme(newTheme);
    },
    [manager]
  );

  const toggleTheme = useCallback(() => {
    manager.toggleTheme();
    setTheme(manager.getTheme());
  }, [manager]);

  return {
    theme,
    resolvedTheme,
    setTheme: updateTheme,
    toggleTheme,
  };
}

/**
 * Theme Provider Component Props
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
  config?: ThemeConfig;
}

/**
 * Initialize theme on the server (for SSR)
 */
export function getServerTheme(): string {
  // Return a script that will run before React hydration
  return `
    (function() {
      try {
        var storageKey = '${DEFAULT_CONFIG.storageKey}';
        var theme = localStorage.getItem(storageKey) || '${DEFAULT_CONFIG.defaultTheme}';

        if (theme === 'system') {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        document.documentElement.classList.add(theme);
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
      } catch (e) {
        console.error('Failed to initialize theme:', e);
      }
    })();
  `;
}

/**
 * Theme script component for Next.js _document.tsx
 * Usage: Add <ThemeScript /> to your _document.tsx or layout.tsx
 */
export function ThemeScript(): ReactElement {
   
  return createElement('script', {
    dangerouslySetInnerHTML: {
      __html: getServerTheme(),
    },
  });
}

export default ThemeManager;
