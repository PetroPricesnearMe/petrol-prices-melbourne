/**
 * Dynamic Import Utilities
 * Optimized component loading with proper loading states
 */

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Loading component for lazy-loaded components
 */
export const ComponentLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  </div>
);

/**
 * Minimal loading component
 */
export const MinimalLoader = () => (
  <div className="animate-pulse bg-gray-200 rounded h-8 w-full" />
);

/**
 * Dynamic import with SSR disabled and loading state
 */
export function dynamicNoSSR<P = {}>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  loadingComponent: ComponentType = ComponentLoader
) {
  return dynamic(loader, {
    ssr: false,
    loading: loadingComponent,
  });
}

/**
 * Dynamic import with SSR enabled and loading state
 */
export function dynamicWithSSR<P = {}>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  loadingComponent: ComponentType = ComponentLoader
) {
  return dynamic(loader, {
    ssr: true,
    loading: loadingComponent,
  });
}

/**
 * Dynamic import for heavy components (maps, charts, etc.)
 */
export function dynamicHeavy<P = {}>(
  loader: () => Promise<{ default: ComponentType<P> }>
) {
  return dynamic(loader, {
    ssr: false,
    loading: ComponentLoader,
  });
}

/**
 * Preload a dynamic component
 */
export async function preloadComponent<P = {}>(
  dynamicComponent: ComponentType<P> & { preload?: () => Promise<any> }
) {
  if (dynamicComponent.preload) {
    await dynamicComponent.preload();
  }
}

/**
 * Lazy load on interaction (click, hover, etc.)
 */
export function lazyLoadOnInteraction<P = {}>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  trigger: 'click' | 'hover' | 'focus' = 'hover'
) {
  let Component: ComponentType<P> | null = null;
  let loadPromise: Promise<void> | null = null;

  const load = () => {
    if (!loadPromise) {
      loadPromise = loader().then((mod) => {
        Component = mod.default;
      });
    }
    return loadPromise;
  };

  return {
    Component: dynamic(() => loader(), {
      ssr: false,
      loading: ComponentLoader,
    }),
    preload: load,
    trigger,
  };
}

/**
 * Lazy load on viewport intersection
 */
export function lazyLoadOnVisible<P = {}>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  options: IntersectionObserverInit = {}
) {
  return dynamic(loader, {
    ssr: false,
    loading: ComponentLoader,
  });
}

// Pre-configured dynamic imports for common heavy components
export const DynamicMap = dynamicNoSSR(
  () => import('@/components/StationMap'),
  ComponentLoader
);

export const DynamicStationCards = dynamicNoSSR(
  () => import('@/components/StationCards'),
  ComponentLoader
);

export const DynamicChart = dynamicNoSSR(
  () => import('@/components/FuelPriceTrendsPage'),
  ComponentLoader
);

export const DynamicAIChat = dynamicNoSSR(
  () => import('@/components/AIChat'),
  MinimalLoader
);

// Export types
export type DynamicImportOptions = {
  ssr?: boolean;
  loading?: ComponentType;
  suspense?: boolean;
};

