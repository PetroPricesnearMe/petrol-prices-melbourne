/**
 * Enhanced API Fetcher
 * 
 * Provides:
 * - Debouncing queries
 * - Local caching with TTL
 * - Request deduplication
 * - Rate limit handling
 * - Loading state management
 * 
 * @module lib/api/enhanced-fetcher
 */

import { stationsCache, pricesCache, searchCache, generateCacheKey } from './cache';
import { RateLimitError } from './error-handler';

// ============================================================================
// TYPES
// ============================================================================

interface FetchOptions {
  debounceMs?: number;
  cacheKey?: string;
  cacheTtl?: number;
  cacheInstance?: typeof stationsCache;
  skipCache?: boolean;
  retryOnRateLimit?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
  abortController?: AbortController;
}

interface RateLimitInfo {
  allowed: boolean;
  resetTime: number;
  remaining: number;
}

// ============================================================================
// REQUEST DEDUPLICATION
// ============================================================================

/**
 * Map to track pending requests and prevent duplicates
 */
const pendingRequests = new Map<string, PendingRequest<unknown>>();

/**
 * Clean up stale pending requests (older than 30 seconds)
 */
function cleanupPendingRequests() {
  const now = Date.now();
  const staleThreshold = 30000; // 30 seconds

  for (const [key, request] of pendingRequests.entries()) {
    if (now - request.timestamp > staleThreshold) {
      request.abortController?.abort();
      pendingRequests.delete(key);
    }
  }
}

// Run cleanup every 10 seconds
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupPendingRequests, 10000);
}

// ============================================================================
// DEBOUNCING
// ============================================================================

/**
 * Map to track debounce timers
 */
const debounceTimers = new Map<string, NodeJS.Timeout>();

/**
 * Debounce a function call
 */
function debounce<T>(
  key: string,
  fn: () => Promise<T>,
  delay: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Clear existing timer
    const existingTimer = debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      debounceTimers.delete(key);
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay);

    debounceTimers.set(key, timer);
  });
}

// ============================================================================
// RATE LIMIT HANDLING
// ============================================================================

/**
 * Rate limit tracker per API endpoint
 */
const rateLimitTrackers = new Map<string, {
  count: number;
  resetTime: number;
  maxRequests: number;
  windowMs: number;
}>();

/**
 * Check rate limit for an endpoint
 */
function checkRateLimit(
  endpoint: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): RateLimitInfo {
  const now = Date.now();
  const tracker = rateLimitTrackers.get(endpoint);

  if (!tracker || now > tracker.resetTime) {
    // Reset or create tracker
    rateLimitTrackers.set(endpoint, {
      count: 1,
      resetTime: now + windowMs,
      maxRequests,
      windowMs,
    });
    return {
      allowed: true,
      resetTime: now + windowMs,
      remaining: maxRequests - 1,
    };
  }

  if (tracker.count >= maxRequests) {
    return {
      allowed: false,
      resetTime: tracker.resetTime,
      remaining: 0,
    };
  }

  tracker.count++;
  return {
    allowed: true,
    resetTime: tracker.resetTime,
    remaining: maxRequests - tracker.count,
  };
}

/**
 * Wait for rate limit to reset
 */
function waitForRateLimit(resetTime: number): Promise<void> {
  const waitTime = resetTime - Date.now();
  if (waitTime <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(resolve, waitTime);
  });
}

// ============================================================================
// ENHANCED FETCHER
// ============================================================================

/**
 * Enhanced fetch function with all optimizations
 */
export async function enhancedFetch<T>(
  fetchFn: () => Promise<T>,
  options: FetchOptions = {}
): Promise<T> {
  const {
    debounceMs = 0,
    cacheKey,
    cacheTtl = 300000, // 5 minutes default
    cacheInstance = stationsCache,
    skipCache = false,
    retryOnRateLimit = true,
    maxRetries = 3,
    retryDelay = 1000,
  } = options;

  // Generate cache key if not provided
  const finalCacheKey = cacheKey || generateCacheKey('fetch', { fn: fetchFn.toString() });

  // Check cache first (unless skipped)
  if (!skipCache && cacheKey) {
    const cached = cacheInstance.get<T>(finalCacheKey);
    if (cached !== null) {
      return cached;
    }
  }

  // Check for pending request (deduplication)
  const pending = pendingRequests.get(finalCacheKey);
  if (pending) {
    return pending.promise as Promise<T>;
  }

  // Create fetch function with rate limit handling
  const executeFetch = async (retryCount = 0): Promise<T> => {
    try {
      // Check rate limit
      const rateLimit = checkRateLimit(finalCacheKey);
      if (!rateLimit.allowed) {
        if (retryOnRateLimit && retryCount < maxRetries) {
          await waitForRateLimit(rateLimit.resetTime);
          return executeFetch(retryCount + 1);
        }
        throw new RateLimitError(
          `Rate limit exceeded. Please try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds.`,
          429
        );
      }

      // Execute fetch
      const result = await fetchFn();

      // Cache result
      if (!skipCache && cacheKey) {
        cacheInstance.set(finalCacheKey, result, cacheTtl);
      }

      // Remove from pending
      pendingRequests.delete(finalCacheKey);

      return result;
    } catch (error) {
      // Remove from pending on error
      pendingRequests.delete(finalCacheKey);

      // Handle rate limit errors with retry
      if (error instanceof RateLimitError && retryOnRateLimit && retryCount < maxRetries) {
        const waitTime = error.resetTime ? error.resetTime - Date.now() : retryDelay * (retryCount + 1);
        await new Promise((resolve) => setTimeout(resolve, Math.max(waitTime, retryDelay)));
        return executeFetch(retryCount + 1);
      }

      throw error;
    }
  };

  // Create abort controller for request cancellation
  const abortController = new AbortController();

  // Create promise
  const promise = debounceMs > 0
    ? debounce(finalCacheKey, executeFetch, debounceMs)
    : executeFetch();

  // Track pending request
  pendingRequests.set(finalCacheKey, {
    promise,
    timestamp: Date.now(),
    abortController,
  });

  return promise;
}

// ============================================================================
// SPECIALIZED FETCHERS
// ============================================================================

/**
 * Fetch with debouncing (for search/autocomplete)
 */
export async function debouncedFetch<T>(
  fetchFn: () => Promise<T>,
  debounceMs: number = 300,
  cacheKey?: string
): Promise<T> {
  return enhancedFetch(fetchFn, {
    debounceMs,
    cacheKey,
    cacheInstance: searchCache,
    cacheTtl: 900000, // 15 minutes for search
  });
}

/**
 * Fetch with aggressive caching (for static data)
 */
export async function cachedFetch<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  cacheTtl: number = 3600000 // 1 hour default
): Promise<T> {
  return enhancedFetch(fetchFn, {
    cacheKey,
    cacheTtl,
    cacheInstance: stationsCache,
  });
}

/**
 * Fetch with rate limit handling (for external APIs)
 */
export async function rateLimitedFetch<T>(
  fetchFn: () => Promise<T>,
  cacheKey?: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): Promise<T> {
  // Set custom rate limit for this endpoint
  if (cacheKey) {
    const tracker = rateLimitTrackers.get(cacheKey);
    if (!tracker) {
      rateLimitTrackers.set(cacheKey, {
        count: 0,
        resetTime: Date.now() + windowMs,
        maxRequests,
        windowMs,
      });
    }
  }

  return enhancedFetch(fetchFn, {
    cacheKey,
    retryOnRateLimit: true,
    maxRetries: 3,
  });
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Cancel pending request
 */
export function cancelRequest(cacheKey: string): void {
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    pending.abortController?.abort();
    pendingRequests.delete(cacheKey);
  }

  const timer = debounceTimers.get(cacheKey);
  if (timer) {
    clearTimeout(timer);
    debounceTimers.delete(cacheKey);
  }
}

/**
 * Clear all pending requests
 */
export function clearAllPendingRequests(): void {
  for (const [key, request] of pendingRequests.entries()) {
    request.abortController?.abort();
  }
  pendingRequests.clear();

  for (const timer of debounceTimers.values()) {
    clearTimeout(timer);
  }
  debounceTimers.clear();
}

/**
 * Get rate limit status for an endpoint
 */
export function getRateLimitStatus(endpoint: string): RateLimitInfo | null {
  const tracker = rateLimitTrackers.get(endpoint);
  if (!tracker) {
    return null;
  }

  const now = Date.now();
  if (now > tracker.resetTime) {
    return {
      allowed: true,
      resetTime: now + tracker.windowMs,
      remaining: tracker.maxRequests,
    };
  }

  return {
    allowed: tracker.count < tracker.maxRequests,
    resetTime: tracker.resetTime,
    remaining: Math.max(0, tracker.maxRequests - tracker.count),
  };
}

