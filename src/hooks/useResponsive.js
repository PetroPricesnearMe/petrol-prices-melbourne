import { useState, useEffect, useCallback } from 'react';

/**
 * useResponsive Hook
 * Provides responsive breakpoint detection and utilities
 * Based on Tailwind CSS breakpoints
 * 
 * @returns {Object} Responsive state and utilities
 */

// Tailwind CSS default breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener with passive flag for better performance
    window.addEventListener('resize', handleResize, { passive: true });

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breakpoint checks
  const isMobile = windowSize.width < breakpoints.sm;
  const isTablet = windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.lg;
  const isDesktop = windowSize.width >= breakpoints.lg;
  const isLargeDesktop = windowSize.width >= breakpoints.xl;

  // Specific breakpoint checks
  const isSmAndUp = windowSize.width >= breakpoints.sm;
  const isMdAndUp = windowSize.width >= breakpoints.md;
  const isLgAndUp = windowSize.width >= breakpoints.lg;
  const isXlAndUp = windowSize.width >= breakpoints.xl;
  const is2XlAndUp = windowSize.width >= breakpoints['2xl'];

  // Device type detection
  const isTouchDevice = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }, []);

  // Orientation detection
  const isPortrait = windowSize.height > windowSize.width;
  const isLandscape = windowSize.width > windowSize.height;

  // Get current breakpoint name
  const getCurrentBreakpoint = useCallback(() => {
    const width = windowSize.width;
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  }, [windowSize.width]);

  return {
    // Window size
    windowSize,
    width: windowSize.width,
    height: windowSize.height,

    // Device type
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isTouchDevice: isTouchDevice(),

    // Breakpoint checks
    isSmAndUp,
    isMdAndUp,
    isLgAndUp,
    isXlAndUp,
    is2XlAndUp,

    // Orientation
    isPortrait,
    isLandscape,

    // Current breakpoint
    breakpoint: getCurrentBreakpoint(),

    // Breakpoints object
    breakpoints,
  };
};

/**
 * useMediaQuery Hook
 * Check if a media query matches
 * 
 * @param {string} query - Media query string
 * @returns {boolean} Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Define listener
    const listener = (e) => setMatches(e.matches);

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    // Legacy browsers
    else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);

  return matches;
};

/**
 * useViewportHeight Hook
 * Get accurate viewport height (accounts for mobile browsers)
 * 
 * @returns {number} Viewport height in pixels
 */
export const useViewportHeight = () => {
  const [height, setHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateHeight, { passive: true });
    window.addEventListener('orientationchange', updateHeight, { passive: true });

    // Set CSS custom property for use in CSS
    document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, [height]);

  return height;
};

/**
 * useTouchDevice Hook
 * Detect if the device supports touch
 * 
 * @returns {boolean} Whether the device supports touch
 */
export const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouch();
  }, []);

  return isTouch;
};

export default useResponsive;

