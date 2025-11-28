/**
 * View Mode State Persistence Hook
 * 
 * Persists view mode (list/grid/map) across navigation using localStorage
 * and optionally syncs with URL search params
 * 
 * @module hooks/useViewMode
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export type ViewMode = 'list' | 'grid' | 'map';

interface UseViewModeOptions {
  /**
   * Storage key for localStorage (default: 'viewMode')
   */
  storageKey?: string;
  
  /**
   * Default view mode if none is stored (default: 'grid')
   */
  defaultView?: ViewMode;
  
  /**
   * Whether to sync with URL search params (default: true)
   */
  syncWithUrl?: boolean;
  
  /**
   * URL param name for view mode (default: 'view')
   */
  urlParam?: string;
}

const STORAGE_KEY = 'viewMode';
const URL_PARAM = 'view';

/**
 * Hook for managing view mode with persistence
 */
export function useViewMode(options: UseViewModeOptions = {}) {
  const {
    storageKey = STORAGE_KEY,
    defaultView = 'grid',
    syncWithUrl = true,
    urlParam = URL_PARAM,
  } = options;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Initialize state from localStorage or URL
  const getInitialView = useCallback((): ViewMode => {
    // First, check URL params if sync is enabled
    if (syncWithUrl) {
      const urlView = searchParams.get(urlParam) as ViewMode | null;
      if (urlView && ['list', 'grid', 'map'].includes(urlView)) {
        // Save to localStorage for consistency
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, urlView);
        }
        return urlView;
      }
    }

    // Then check localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as ViewMode | null;
      if (stored && ['list', 'grid', 'map'].includes(stored)) {
        return stored;
      }
    }

    return defaultView;
  }, [storageKey, defaultView, syncWithUrl, searchParams, urlParam]);

  const [viewMode, setViewModeState] = useState<ViewMode>(getInitialView);

  // Update state when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    if (syncWithUrl) {
      const urlView = searchParams.get(urlParam) as ViewMode | null;
      if (urlView && ['list', 'grid', 'map'].includes(urlView) && urlView !== viewMode) {
        setViewModeState(urlView);
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, urlView);
        }
      }
    }
  }, [searchParams, urlParam, syncWithUrl, storageKey, viewMode]);

  // Set view mode with persistence
  const setViewMode = useCallback((newView: ViewMode) => {
    if (!['list', 'grid', 'map'].includes(newView)) {
      console.warn(`Invalid view mode: ${newView}. Must be 'list', 'grid', or 'map'.`);
      return;
    }

    setViewModeState(newView);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newView);
    }

    // Update URL if sync is enabled
    if (syncWithUrl) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(urlParam, newView);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [storageKey, syncWithUrl, urlParam, pathname, router, searchParams]);

  return [viewMode, setViewMode] as const;
}

