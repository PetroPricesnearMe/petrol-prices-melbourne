/**
 * Custom Hooks - Central Export
 * 
 * All custom hooks in one place for easy importing.
 * Organized by category for better maintainability.
 * 
 * @example
 * ```typescript
 * import { useStations, useGeolocation, useMounted } from '@/hooks';
 * ```
 * 
 * @module hooks
 */

// ========================================
// DATA FETCHING HOOKS
// ========================================

/**
 * Station-related hooks
 */
export { useStations } from './useStations';
export { useInfiniteStations } from './useInfiniteStations';

/**
 * CMS hooks
 */
export { useCMS } from './useCMS';

// ========================================
// UI STATE HOOKS
// ========================================

/**
 * Filter and search hooks
 */
export { useFilterState } from './useFilterState';

/**
 * Mobile menu hook
 */
export { useMobileMenu } from './useMobileMenu';

// ========================================
// GEOLOCATION HOOKS
// ========================================

/**
 * Location-based hooks
 */
export { useGeolocation } from './useGeolocation';

// ========================================
// PERFORMANCE HOOKS
// ========================================

/**
 * Performance monitoring hooks
 */
export { usePerformance } from './usePerformance';
export { usePerformanceMonitor } from './usePerformanceMonitor';
export { usePerformanceOptimization } from './usePerformanceOptimization';

/**
 * Virtualization hook
 */
export { useVirtualization } from './useVirtualization';

// ========================================
// UTILITY HOOKS
// ========================================

/**
 * Lifecycle hooks
 */
export { useMounted } from './useMounted';
export { useCancelOnUnmount } from './useCancelOnUnmount';

/**
 * Network status hook
 */
export { useNetworkStatus } from './useNetworkStatus';

/**
 * Extension message hook
 */
export { useExtensionMessage } from './useExtensionMessage';

/**
 * MCP updates hook
 */
export { useMCPUpdates } from './useMCPUpdates';

/**
 * Responsive hook
 */
export { useResponsive } from './useResponsive';

// ========================================
// ADDITIONAL CUSTOM HOOKS
// (These would be implemented as needed)
// ========================================

/**
 * TODO: Add more custom hooks as the application grows
 * 
 * Examples:
 * - useDebounce
 * - useThrottle
 * - useLocalStorage
 * - useSessionStorage
 * - useMediaQuery
 * - useIntersectionObserver
 * - useClickOutside
 * - useKeyPress
 * - useWindowSize
 * - usePrevious
 * - useToggle
 * - useForm
 * - useAsync
 */

