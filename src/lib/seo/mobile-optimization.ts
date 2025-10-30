/**
 * Mobile-First SEO Optimization
 *
 * Utilities for mobile-first indexing and mobile UX optimization
 * @module lib/seo/mobile-optimization
 */

// ============================================================================
// Mobile Viewport Configuration
// ============================================================================

/**
 * Optimal viewport configuration for mobile-first indexing
 */
export const MOBILE_VIEWPORT = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  minimumScale: 1,
  userScalable: true, // Never disable zoom
  viewportFit: 'cover', // For iPhone X+ notch
} as const;

/**
 * Generate viewport meta tag content
 */
export function getViewportContent(options?: Partial<typeof MOBILE_VIEWPORT>): string {
  const config = { ...MOBILE_VIEWPORT, ...options };

  const parts = [
    `width=${config.width}`,
    `initial-scale=${config.initialScale}`,
    `maximum-scale=${config.maximumScale}`,
    `minimum-scale=${config.minimumScale}`,
    `user-scalable=${config.userScalable ? 'yes' : 'no'}`,
    `viewport-fit=${config.viewportFit}`,
  ];

  return parts.join(', ');
}

// ============================================================================
// Touch Target Optimization
// ============================================================================

/**
 * Minimum touch target sizes for mobile (in pixels)
 * Based on WCAG 2.1 Level AAA and Google guidelines
 */
export const TOUCH_TARGET_SIZES = {
  minimum: 44, // Apple Human Interface Guidelines
  recommended: 48, // Material Design
  comfortable: 56, // Large touch targets
} as const;

/**
 * Check if element meets touch target size requirements
 */
export function validateTouchTarget(
  width: number,
  height: number,
  level: keyof typeof TOUCH_TARGET_SIZES = 'recommended'
): { isValid: boolean; message?: string } {
  const minSize = TOUCH_TARGET_SIZES[level];

  if (width < minSize || height < minSize) {
    return {
      isValid: false,
      message: `Touch target too small: ${width}×${height}px (minimum: ${minSize}×${minSize}px)`,
    };
  }

  return { isValid: true };
}

// ============================================================================
// Responsive Breakpoints
// ============================================================================

/**
 * Standard breakpoints for mobile-first design
 * Aligned with Tailwind CSS defaults
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Generate media query string
 */
export function getMediaQuery(breakpoint: keyof typeof BREAKPOINTS, type: 'min' | 'max' = 'min'): string {
  const size = BREAKPOINTS[breakpoint];
  return type === 'min'
    ? `(min-width: ${size}px)`
    : `(max-width: ${size - 1}px)`;
}

/**
 * Check if viewport is mobile
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
}

/**
 * Check if viewport is tablet
 */
export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
}

/**
 * Check if viewport is desktop
 */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.lg;
}

// ============================================================================
// Mobile Performance
// ============================================================================

/**
 * Performance budgets for mobile devices
 */
export const MOBILE_PERFORMANCE_BUDGETS = {
  // Page weight
  maxPageWeight: 1.5 * 1024 * 1024, // 1.5 MB
  maxJavaScript: 500 * 1024, // 500 KB
  maxCSS: 100 * 1024, // 100 KB
  maxImages: 800 * 1024, // 800 KB
  maxFonts: 100 * 1024, // 100 KB

  // Performance metrics
  maxFirstContentfulPaint: 1800, // 1.8s
  maxLargestContentfulPaint: 2500, // 2.5s
  maxTimeToInteractive: 3800, // 3.8s
  maxCumulativeLayoutShift: 0.1,
  maxFirstInputDelay: 100, // 100ms

  // Network
  maxRequests: 50,
  maxDomainLookups: 6,
} as const;

/**
 * Check if resource meets mobile performance budget
 */
export function checkPerformanceBudget(
  resourceSize: number,
  resourceType: keyof typeof MOBILE_PERFORMANCE_BUDGETS
): { withinBudget: boolean; percentage: number } {
  const budget = MOBILE_PERFORMANCE_BUDGETS[resourceType] as number;
  const percentage = (resourceSize / budget) * 100;

  return {
    withinBudget: resourceSize <= budget,
    percentage: Math.round(percentage),
  };
}

// ============================================================================
// Mobile-Specific Meta Tags
// ============================================================================

/**
 * Generate mobile-specific meta tags
 */
export function getMobileMeta() {
  return {
    // Apple-specific
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Petrol Prices',

    // Android-specific
    'mobile-web-app-capable': 'yes',
    'theme-color': '#2196F3',

    // Windows-specific
    'msapplication-TileColor': '#2196F3',
    'msapplication-config': '/browserconfig.xml',

    // Format detection
    'format-detection': 'telephone=yes, address=yes, email=no',
  };
}

// ============================================================================
// Touch Gesture Support
// ============================================================================

/**
 * Touch gesture event types
 */
export type TouchGesture = 'tap' | 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'pinch' | 'long-press';

/**
 * Touch gesture configuration
 */
export const TOUCH_GESTURES = {
  swipeThreshold: 50, // pixels
  longPressDelay: 500, // ms
  doubleTapDelay: 300, // ms
  pinchThreshold: 0.1, // scale difference
} as const;

// ============================================================================
// Mobile SEO Checklist
// ============================================================================

/**
 * Validate page for mobile-first indexing
 */
export function validateMobileSEO(page: {
  hasViewport: boolean;
  hasResponsiveImages: boolean;
  hasTouchTargets: boolean;
  hasReadableFont: boolean;
  hasNoFlash: boolean;
  hasNoPopups: boolean;
  loadTime: number;
}): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  if (!page.hasViewport) {
    issues.push('Missing viewport meta tag (critical)');
    score -= 20;
  }

  if (!page.hasResponsiveImages) {
    issues.push('Images not responsive');
    score -= 15;
  }

  if (!page.hasTouchTargets) {
    issues.push('Touch targets too small');
    score -= 15;
  }

  if (!page.hasReadableFont) {
    issues.push('Font size too small for mobile');
    score -= 10;
  }

  if (!page.hasNoFlash) {
    issues.push('Flash content detected (not supported on mobile)');
    score -= 15;
  }

  if (!page.hasNoPopups) {
    issues.push('Intrusive interstitials detected');
    score -= 10;
  }

  if (page.loadTime > 3000) {
    issues.push(`Slow load time: ${page.loadTime}ms (target: <3000ms)`);
    score -= 15;
  }

  return { score: Math.max(0, score), issues };
}

// ============================================================================
// Mobile Content Optimization
// ============================================================================

/**
 * Optimize text for mobile reading
 */
export function optimizeTextForMobile(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;

  // Break at sentence
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let result = '';

  for (const sentence of sentences) {
    if ((result + sentence).length > maxLength) {
      break;
    }
    result += sentence;
  }

  return result.trim() || text.substring(0, maxLength) + '...';
}

/**
 * Generate mobile-friendly table of contents
 */
export function generateMobileTOC(headings: Array<{ level: number; text: string; id: string }>) {
  return headings
    .filter(h => h.level <= 3) // Only show h1-h3 on mobile
    .map(h => ({
      ...h,
      indent: (h.level - 1) * 16, // 16px per level
    }));
}

// ============================================================================
// Export
// ============================================================================

export {
  MOBILE_VIEWPORT,
  BREAKPOINTS,
  TOUCH_TARGET_SIZES,
  TOUCH_GESTURES,
  MOBILE_PERFORMANCE_BUDGETS,
  getViewportContent,
  validateTouchTarget,
  getMediaQuery,
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
  getMobileMeta,
  validateMobileSEO,
  optimizeTextForMobile,
  generateMobileTOC,
  checkPerformanceBudget,
};
