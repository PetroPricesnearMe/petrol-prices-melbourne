/**
 * Advanced Caching System for CMS
 *
 * Provides multi-layer caching with:
 * - In-memory cache for fastest access
 * - Stale-while-revalidate support
 * - Cache tags for grouped invalidation
 * - TTL management
 * - LRU eviction (optional)
 */

interface CacheEntry<T = unknown> {
  data: T;
  expiry: number;
  staleExpiry?: number;
  tags: string[];
  timestamp: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  evictions: number;
}

export class CMSCache {
  private cache: Map<string, CacheEntry>;
  private tagIndex: Map<string, Set<string>>; // tag -> Set of cache keys
  private stats: CacheStats;
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.tagIndex = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      evictions: 0,
    };
    this.maxSize = maxSize;
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();

    // Check if completely expired (including stale period)
    if (entry.staleExpiry && now > entry.staleExpiry) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // Check if fresh
    if (now <= entry.expiry) {
      this.stats.hits++;
      return entry.data as T;
    }

    // Check if stale but still usable
    if (entry.staleExpiry && now <= entry.staleExpiry) {
      this.stats.hits++;
      return entry.data as T; // Return stale data, caller should revalidate
    }

    this.delete(key);
    this.stats.misses++;
    return null;
  }

  /**
   * Set item in cache with TTL and optional tags
   */
  set<T>(
    key: string,
    data: T,
    ttl: number, // seconds
    options: {
      staleWhileRevalidate?: number; // seconds
      tags?: string[];
    } = {}
  ): void {
    // Evict if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }

    const now = Date.now();
    const expiry = now + ttl * 1000;
    const staleExpiry = options.staleWhileRevalidate
      ? expiry + options.staleWhileRevalidate * 1000
      : undefined;

    const entry: CacheEntry<T> = {
      data,
      expiry,
      staleExpiry,
      tags: options.tags || [],
      timestamp: now,
    };

    this.cache.set(key, entry);

    // Update tag index
    if (options.tags) {
      for (const tag of options.tags) {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag)!.add(key);
      }
    }

    this.stats.size = this.cache.size;
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Remove from tag index
    for (const tag of entry.tags) {
      const keys = this.tagIndex.get(tag);
      if (keys) {
        keys.delete(key);
        if (keys.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    }

    const deleted = this.cache.delete(key);
    this.stats.size = this.cache.size;

    return deleted;
  }

  /**
   * Invalidate all entries with specific tags
   */
  invalidateByTags(tags: string[]): number {
    let invalidated = 0;

    for (const tag of tags) {
      const keys = this.tagIndex.get(tag);
      if (keys) {
        for (const key of keys) {
          if (this.delete(key)) {
            invalidated++;
          }
        }
      }
    }

    return invalidated;
  }

  /**
   * Invalidate entries matching a pattern
   */
  invalidateByPattern(pattern: RegExp): number {
    let invalidated = 0;

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        if (this.delete(key)) {
          invalidated++;
        }
      }
    }

    return invalidated;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.tagIndex.clear();
    this.stats.size = 0;
  }

  /**
   * Check if data is stale (but still cached)
   */
  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    return (
      now > entry.expiry && (!entry.staleExpiry || now <= entry.staleExpiry)
    );
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Evict oldest entry (LRU)
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    let cleaned = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.staleExpiry && now > entry.staleExpiry) {
        this.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Singleton instance
let cacheInstance: CMSCache | null = null;

/**
 * Get or create cache instance
 */
export function getCMSCache(): CMSCache {
  if (!cacheInstance) {
    cacheInstance = new CMSCache(
      parseInt(process.env.CMS_CACHE_MAX_SIZE || '1000')
    );
  }

  return cacheInstance;
}

/**
 * Generate cache key from parameters
 */
export function generateCacheKey(
  provider: string,
  collection: string,
  params?: Record<string, unknown>
): string {
  const paramsStr = params ? JSON.stringify(params) : '';
  return `cms:${provider}:${collection}:${paramsStr}`;
}
