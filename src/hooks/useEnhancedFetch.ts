/**
 * React Hook for Enhanced Fetching
 * 
 * Provides loading states, error handling, and integrates with enhanced-fetcher
 * 
 * @module hooks/useEnhancedFetch
 */

import { useState, useEffect, useCallback, useRef } from 'react';

import { enhancedFetch, debouncedFetch, cachedFetch, cancelRequest } from '@/lib/api/enhanced-fetcher';

import type { FetchOptions } from '@/lib/api/enhanced-fetcher';

// ============================================================================
// TYPES
// ============================================================================

interface UseEnhancedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  cancel: () => void;
}

interface UseEnhancedFetchOptions extends FetchOptions {
  enabled?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for enhanced fetching with loading states
 */
export function useEnhancedFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseEnhancedFetchOptions = {}
): UseEnhancedFetchResult<T> {
  const {
    enabled = true,
    onSuccess,
    onError,
    cacheKey,
    debounceMs,
    ...fetchOptions
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeFetch = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Execute fetch with appropriate method
      let result: T;
      if (debounceMs && debounceMs > 0) {
        result = await debouncedFetch(fetchFn, debounceMs, cacheKey);
      } else if (cacheKey) {
        result = await cachedFetch(fetchFn, cacheKey, fetchOptions.cacheTtl);
      } else {
        result = await enhancedFetch(fetchFn, fetchOptions);
      }

      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      // Don't set error if request was aborted
      if (error.name !== 'AbortError') {
        setError(error);
        onError?.(error);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled, fetchFn, cacheKey, debounceMs, fetchOptions, onSuccess, onError]);

  const cancel = useCallback(() => {
    if (cacheKey) {
      cancelRequest(cacheKey);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  }, [cacheKey]);

  useEffect(() => {
    if (enabled) {
      executeFetch();
    }

    return () => {
      cancel();
    };
  }, [enabled, executeFetch, cancel]);

  return {
    data,
    loading,
    error,
    refetch: executeFetch,
    cancel,
  };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook for debounced fetching (e.g., search/autocomplete)
 */
export function useDebouncedFetch<T>(
  fetchFn: () => Promise<T>,
  debounceMs: number = 300,
  options: Omit<UseEnhancedFetchOptions, 'debounceMs'> = {}
): UseEnhancedFetchResult<T> {
  return useEnhancedFetch(fetchFn, {
    ...options,
    debounceMs,
  });
}

/**
 * Hook for cached fetching (e.g., static data)
 */
export function useCachedFetch<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  cacheTtl?: number,
  options: Omit<UseEnhancedFetchOptions, 'cacheKey' | 'cacheTtl'> = {}
): UseEnhancedFetchResult<T> {
  return useEnhancedFetch(fetchFn, {
    ...options,
    cacheKey,
    cacheTtl,
  });
}

