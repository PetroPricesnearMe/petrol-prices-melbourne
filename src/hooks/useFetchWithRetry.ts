/**
 * useFetchWithRetry Hook
 * 
 * Provides retry logic, offline detection, and error handling for fetch requests
 * 
 * @module hooks/useFetchWithRetry
 */

'use client';

import { useCallback, useEffect, useState } from 'react';

export interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  retryOn?: number[]; // HTTP status codes to retry on
  timeout?: number;
}

export interface FetchState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isOffline: boolean;
  retryCount: number;
}

export interface UseFetchWithRetryReturn<T> extends FetchState<T> {
  retry: () => Promise<void>;
  reset: () => void;
}

const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRY_ON = [408, 429, 500, 502, 503, 504]; // Timeout, rate limit, server errors

/**
 * Check if browser is online
 */
function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

/**
 * Delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get friendly error message
 */
function getFriendlyErrorMessage(error: Error, isOffline: boolean): string {
  if (isOffline) {
    return 'You appear to be offline. Please check your internet connection and try again.';
  }

  if (error.message.includes('timeout')) {
    return 'The request took too long. Please check your connection and try again.';
  }

  if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  if (error.message.includes('404')) {
    return 'The requested resource was not found.';
  }

  if (error.message.includes('403')) {
    return 'You don\'t have permission to access this resource.';
  }

  if (error.message.includes('401')) {
    return 'Authentication required. Please refresh the page.';
  }

  return 'Something went wrong. Please try again.';
}

/**
 * Hook for fetch with retry logic and offline detection
 */
export function useFetchWithRetry<T = unknown>(
  url: string | null,
  options: FetchOptions = {}
): UseFetchWithRetryReturn<T> {
  const {
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    retryOn = DEFAULT_RETRY_ON,
    timeout = DEFAULT_TIMEOUT,
    ...fetchOptions
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isOffline: !isOnline(),
    retryCount: 0,
  });

  // Monitor online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOffline: true }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!url) return;

    // Check offline status
    if (!isOnline()) {
      setState((prev) => ({
        ...prev,
        error: new Error('Offline'),
        isLoading: false,
        isOffline: true,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null, isOffline: false }));

    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt <= retries) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Check if we should retry based on status code
        if (!response.ok && retryOn.includes(response.status) && attempt < retries) {
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          attempt++;
          setState((prev) => ({ ...prev, retryCount: attempt }));
          await delay(retryDelay * attempt); // Exponential backoff
          continue;
        }

        // If not ok and not retryable, throw error
        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          throw new Error(`HTTP ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
        }

        // Parse response
        const data = await response.json();

        setState({
          data: data as T,
          error: null,
          isLoading: false,
          isOffline: false,
          retryCount: attempt,
        });

        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on abort (timeout) or network errors if offline
        if (error instanceof Error && error.name === 'AbortError') {
          lastError = new Error('Request timeout');
        }

        // If this was the last attempt or error is not retryable, set error
        if (attempt >= retries || !isOnline()) {
          setState({
            data: null,
            error: lastError,
            isLoading: false,
            isOffline: !isOnline(),
            retryCount: attempt,
          });
          return;
        }

        // Retry with exponential backoff
        attempt++;
        setState((prev) => ({ ...prev, retryCount: attempt }));
        await delay(retryDelay * attempt);
      }
    }

    // If we get here, all retries failed
    setState({
      data: null,
      error: lastError || new Error('Unknown error'),
      isLoading: false,
      isOffline: !isOnline(),
      retryCount: attempt,
    });
  }, [url, retries, retryDelay, retryOn, timeout, fetchOptions]);

  // Auto-fetch when URL changes
  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  const retry = useCallback(async () => {
    setState((prev) => ({ ...prev, retryCount: 0 }));
    await fetchData();
  }, [fetchData]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isOffline: !isOnline(),
      retryCount: 0,
    });
  }, []);

  return {
    ...state,
    retry,
    reset,
  };
}

/**
 * Get friendly error message helper
 */
export function getFriendlyError(error: Error | null, isOffline: boolean): string {
  if (!error) return '';
  return getFriendlyErrorMessage(error, isOffline);
}

