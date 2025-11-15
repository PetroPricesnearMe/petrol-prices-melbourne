/**
 * Advanced Caching Layer
 * In-memory cache with TTL and LRU eviction for API responses
 * Reduces database calls and improves response times
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Get cached data if still valid
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data as T;
  }

  /**
   * Set cache with TTL
   */
  set<T>(key: string, data: T, ttl: number = 60000): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Invalidate specific key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate keys matching pattern
   */
  invalidatePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // Would need to track hits/misses
    };
  }
}

// ============================================================================
// CACHE INSTANCES
// ============================================================================

/**
 * Stations cache - 1 hour TTL
 */
export const stationsCache = new MemoryCache(50);

/**
 * Fuel prices cache - 5 minutes TTL (prices change frequently)
 */
export const pricesCache = new MemoryCache(100);

/**
 * Search results cache - 15 minutes TTL
 */
export const searchCache = new MemoryCache(200);

// ============================================================================
// CACHE UTILITIES
// ============================================================================

/**
 * Generate cache key from parameters
 */
export function generateCacheKey(
  prefix: string,
  params: Record<string, any>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join('|');

  return `${prefix}:${sortedParams}`;
}

/**
 * Cached function wrapper
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyPrefix: string;
    ttl?: number;
    cache?: MemoryCache;
  }
): T {
  const { keyPrefix, ttl = 60000, cache = stationsCache } = options;

  return (async (...args: Parameters<T>) => {
    const cacheKey = generateCacheKey(keyPrefix, { args });

    // Try cache first
    const cached = cache.get<Awaited<ReturnType<T>>>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Execute function
    const result = await fn(...args);

    // Store in cache
    cache.set(cacheKey, result, ttl);

    return result;
  }) as T;
}

/**
 * Clear cache for specific resource
 */
export function clearCache(
  resource: 'stations' | 'prices' | 'search' | 'all'
): void {
  switch (resource) {
    case 'stations':
      stationsCache.clear();
      break;
    case 'prices':
      pricesCache.clear();
      break;
    case 'search':
      searchCache.clear();
      break;
    case 'all':
      stationsCache.clear();
      pricesCache.clear();
      searchCache.clear();
      break;
  }
}

/**
 * Get all cache stats
 */
export function getAllCacheStats() {
  return {
    stations: stationsCache.getStats(),
    prices: pricesCache.getStats(),
    search: searchCache.getStats(),
  };
}
