/**
 * Mobile-First Optimization Utilities
 * 
 * Utilities for optimizing mobile experience:
 * - Mobile viewport configuration
 * - Touch optimization
 * - Mobile-specific performance
 * - Responsive breakpoints
 * - Mobile SEO
 * 
 * @module lib/seo/mobile-optimization
 */

import type { Viewport } from 'next';

// ============================================================================
// Mobile Viewport Configuration
// ============================================================================

/**
 * Optimal mobile viewport configuration
 */
export const mobileViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

// ============================================================================
// Responsive Breakpoints
// ============================================================================

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Generate responsive sizes string
 */
export function generateResponsiveSizes(config: {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  default: string;
}): string {
  const sizes: string[] = [];
  
  if (config.sm) {
    sizes.push(`(max-width: ${BREAKPOINTS.sm}px) ${config.sm}`);
  }
  if (config.md) {
    sizes.push(`(max-width: ${BREAKPOINTS.md}px) ${config.md}`);
  }
  if (config.lg) {
    sizes.push(`(max-width: ${BREAKPOINTS.lg}px) ${config.lg}`);
  }
  if (config.xl) {
    sizes.push(`(max-width: ${BREAKPOINTS.xl}px) ${config.xl}`);
  }
  sizes.push(config.default);
  
  return sizes.join(', ');
}

/**
 * Check if current viewport matches breakpoint
 */
export function matchesBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`).matches;
}

/**
 * Get current breakpoint
 */
export function getCurrentBreakpoint(): Breakpoint | null {
  if (typeof window === 'undefined') return null;
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

// ============================================================================
// Mobile Detection
// ============================================================================

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device is iOS
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * Check if device is Android
 */
export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android/i.test(navigator.userAgent);
}

/**
 * Check if device has touch capability
 */
export function hasTouchCapability(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

// ============================================================================
// Touch Optimization
// ============================================================================

/**
 * Minimum touch target size (44x44px per WCAG)
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Recommended touch target size (48x48px per Material Design)
 */
export const RECOMMENDED_TOUCH_TARGET_SIZE = 48;

/**
 * Check if element meets touch target size requirements
 */
export function meetsTouchTargetSize(
  width: number,
  height: number,
  strict = false
): boolean {
  const minSize = strict ? RECOMMENDED_TOUCH_TARGET_SIZE : MIN_TOUCH_TARGET_SIZE;
  return width >= minSize && height >= minSize;
}

/**
 * Prevent zoom on input focus (iOS)
 */
export function preventIOSZoomOnFocus() {
  if (!isIOSDevice()) return;
  
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    let content = viewport.getAttribute('content') || '';
    
    // Add maximum-scale=1 on input focus
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (!content.includes('maximum-scale')) {
          viewport.setAttribute('content', `${content}, maximum-scale=1`);
        }
      });
      
      input.addEventListener('blur', () => {
        viewport.setAttribute('content', content);
      });
    });
  }
}

/**
 * Optimize tap delay (remove 300ms delay)
 */
export function optimizeTapDelay() {
  if (typeof document === 'undefined') return;
  
  // Modern browsers remove this automatically, but add for legacy support
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
  
  // Add CSS to remove tap highlight
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
    }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// Mobile Performance
// ============================================================================

/**
 * Check if device has low memory
 */
export function hasLowMemory(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const memory = (navigator as any).deviceMemory;
  return memory !== undefined && memory < 4; // Less than 4GB
}

/**
 * Check if connection is slow
 */
export function hasSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const connection = (navigator as any).connection ||
                     (navigator as any).mozConnection ||
                     (navigator as any).webkitConnection;
  
  if (!connection) return false;
  
  // Check for slow connection types
  const slowTypes = ['slow-2g', '2g'];
  return slowTypes.includes(connection.effectiveType) ||
         connection.downlink < 1; // Less than 1 Mbps
}

/**
 * Check if device should use reduced data mode
 */
export function shouldUseReducedData(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const connection = (navigator as any).connection ||
                     (navigator as any).mozConnection ||
                     (navigator as any).webkitConnection;
  
  return connection?.saveData === true || hasSlowConnection();
}

/**
 * Get optimal image quality for mobile
 */
export function getMobileImageQuality(): number {
  if (hasSlowConnection() || shouldUseReducedData()) {
    return 65; // Lower quality for slow connections
  }
  
  if (hasLowMemory()) {
    return 75; // Medium quality for low memory
  }
  
  return 85; // Standard quality
}

// ============================================================================
// Mobile SEO
// ============================================================================

/**
 * Generate mobile-optimized meta tags
 */
export function getMobileMeta() {
  return [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'format-detection', content: 'date=no' },
    { name: 'format-detection', content: 'address=no' },
    { name: 'format-detection', content: 'email=no' },
  ];
}

/**
 * Generate AMP link (if applicable)
 */
export function getAMPLink(url: string): string {
  return `${url}/amp`;
}

/**
 * Check if page should have AMP version
 */
export function shouldHaveAMP(pathname: string): boolean {
  // AMP is useful for:
  // - Blog posts
  // - Article pages
  // - News pages
  const ampPatterns = ['/blog/', '/articles/', '/news/'];
  return ampPatterns.some(pattern => pathname.includes(pattern));
}

// ============================================================================
// Safe Area Insets (for notched devices)
// ============================================================================

/**
 * CSS for safe area insets
 */
export const SAFE_AREA_INSETS = {
  paddingTop: 'max(1rem, env(safe-area-inset-top))',
  paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
  paddingLeft: 'max(1rem, env(safe-area-inset-left))',
  paddingRight: 'max(1rem, env(safe-area-inset-right))',
} as const;

/**
 * Apply safe area insets
 */
export function applySafeAreaInsets(element: HTMLElement) {
  if (typeof window === 'undefined') return;
  
  Object.entries(SAFE_AREA_INSETS).forEach(([property, value]) => {
    element.style[property as any] = value;
  });
}

// ============================================================================
// Mobile Accessibility
// ============================================================================

/**
 * Font size ranges for mobile accessibility
 */
export const MOBILE_FONT_SIZES = {
  min: 16, // Minimum to prevent iOS zoom
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

/**
 * Get accessible font size for mobile
 */
export function getAccessibleFontSize(size: keyof typeof MOBILE_FONT_SIZES): number {
  return MOBILE_FONT_SIZES[size];
}

/**
 * Ensure input font size meets mobile requirements
 */
export function ensureInputFontSize() {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.innerHTML = `
    input, select, textarea {
      font-size: 16px !important; /* Prevent iOS zoom on focus */
    }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// Orientation Detection
// ============================================================================

export type Orientation = 'portrait' | 'landscape';

/**
 * Get current device orientation
 */
export function getOrientation(): Orientation {
  if (typeof window === 'undefined') return 'portrait';
  
  return window.matchMedia('(orientation: portrait)').matches 
    ? 'portrait' 
    : 'landscape';
}

/**
 * Listen for orientation changes
 */
export function onOrientationChange(callback: (orientation: Orientation) => void) {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(orientation: portrait)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'portrait' : 'landscape');
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  return () => mediaQuery.removeEventListener('change', handleChange);
}

// ============================================================================
// Mobile-First CSS Utilities
// ============================================================================

/**
 * Generate mobile-first media queries
 */
export function mobileFirst(breakpoint: Breakpoint): string {
  return `@media (min-width: ${BREAKPOINTS[breakpoint]}px)`;
}

/**
 * Generate desktop-first media queries
 */
export function desktopFirst(breakpoint: Breakpoint): string {
  return `@media (max-width: ${BREAKPOINTS[breakpoint] - 1}px)`;
}

/**
 * Generate between breakpoints media query
 */
export function between(min: Breakpoint, max: Breakpoint): string {
  return `@media (min-width: ${BREAKPOINTS[min]}px) and (max-width: ${BREAKPOINTS[max] - 1}px)`;
}
