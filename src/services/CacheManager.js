/**
 * CacheManager - Client-Side Caching Layer
 * Redis-like caching functionality using IndexedDB for frequent queries
 * Implements stale-while-revalidate pattern for optimal performance
 */

class CacheManager {
  constructor() {
    this.dbName = 'ppnm-cache';
    this.dbVersion = 2;
    this.stores = {
      stations: 'stations-cache',
      prices: 'prices-cache',
      queries: 'queries-cache',
      metadata: 'metadata-cache'
    };
    this.db = null;
    this.memoryCache = new Map(); // In-memory cache for ultra-fast access
    this.init();
  }

  /**
   * Initialize IndexedDB
   */
  async init() {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported, using memory-only cache');
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores if they don't exist
        Object.values(this.stores).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'key' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('ttl', 'ttl', { unique: false });
          }
        });
      };
    });
  }

  /**
   * Set cache entry with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (default: 1 hour)
   * @param {string} store - Store name (default: queries)
   */
  async set(key, value, ttl = 3600, store = this.stores.queries) {
    const entry = {
      key,
      value,
      timestamp: Date.now(),
      ttl: ttl * 1000, // Convert to milliseconds
      expiresAt: Date.now() + (ttl * 1000)
    };

    // Store in memory cache
    this.memoryCache.set(key, entry);

    // Store in IndexedDB
    if (!this.db) await this.init();
    
    if (this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.put(entry);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    }
  }

  /**
   * Get cache entry
   * @param {string} key - Cache key
   * @param {string} store - Store name
   * @returns {Promise<any|null>} Cached value or null if expired/not found
   */
  async get(key, store = this.stores.queries) {
    // Check memory cache first (fastest)
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key);
      if (Date.now() < entry.expiresAt) {
        return entry.value;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Check IndexedDB
    if (!this.db) await this.init();
    
    if (this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([store], 'readonly');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.get(key);

        request.onsuccess = () => {
          const entry = request.result;
          
          if (!entry) {
            resolve(null);
            return;
          }

          // Check if expired
          if (Date.now() > entry.expiresAt) {
            this.delete(key, store); // Clean up expired entry
            resolve(null);
            return;
          }

          // Update memory cache
          this.memoryCache.set(key, entry);
          resolve(entry.value);
        };

        request.onerror = () => reject(request.error);
      });
    }

    return null;
  }

  /**
   * Delete cache entry
   */
  async delete(key, store = this.stores.queries) {
    this.memoryCache.delete(key);

    if (!this.db) await this.init();
    
    if (this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.delete(key);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    }
  }

  /**
   * Clear all caches
   */
  async clearAll() {
    this.memoryCache.clear();

    if (!this.db) await this.init();
    
    if (this.db) {
      const stores = Object.values(this.stores);
      
      return Promise.all(
        stores.map(store => {
          return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([store], 'readwrite');
            const objectStore = transaction.objectStore(store);
            const request = objectStore.clear();

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
          });
        })
      );
    }
  }

  /**
   * Get or set (fetch if not cached)
   * @param {string} key - Cache key
   * @param {Function} fetcher - Function to fetch data if not cached
   * @param {number} ttl - Time to live in seconds
   */
  async getOrSet(key, fetcher, ttl = 3600, store = this.stores.queries) {
    const cached = await this.get(key, store);
    
    if (cached !== null) {
      return cached;
    }

    // Not cached, fetch fresh data
    const freshData = await fetcher();
    await this.set(key, freshData, ttl, store);
    
    return freshData;
  }

  /**
   * Stale-while-revalidate pattern
   * Returns cached data immediately, then updates in background
   */
  async getStale(key, fetcher, ttl = 3600, store = this.stores.queries) {
    const cached = await this.get(key, store);
    
    if (cached !== null) {
      // Return stale data immediately
      // Revalidate in background
      this.revalidate(key, fetcher, ttl, store);
      return { data: cached, stale: true };
    }

    // No cache, fetch fresh
    const freshData = await fetcher();
    await this.set(key, freshData, ttl, store);
    
    return { data: freshData, stale: false };
  }

  /**
   * Background revalidation
   */
  async revalidate(key, fetcher, ttl, store) {
    try {
      const freshData = await fetcher();
      await this.set(key, freshData, ttl, store);
    } catch (error) {
      console.warn('[CacheManager] Revalidation failed:', error);
    }
  }

  /**
   * Cache stations data
   */
  async cacheStations(stations, ttl = 3600) {
    return this.set('all-stations', stations, ttl, this.stores.stations);
  }

  /**
   * Get cached stations
   */
  async getCachedStations() {
    return this.get('all-stations', this.stores.stations);
  }

  /**
   * Cache fuel prices
   */
  async cachePrices(stationId, prices, ttl = 900) {
    return this.set(`prices-${stationId}`, prices, ttl, this.stores.prices);
  }

  /**
   * Get cached prices
   */
  async getCachedPrices(stationId) {
    return this.get(`prices-${stationId}`, this.stores.prices);
  }

  /**
   * Clear expired entries (run periodically)
   */
  async clearExpired() {
    if (!this.db) await this.init();
    
    if (this.db) {
      const stores = Object.values(this.stores);
      const now = Date.now();

      return Promise.all(
        stores.map(storeName => {
          return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
            const index = objectStore.index('timestamp');
            const request = index.openCursor();

            request.onsuccess = (event) => {
              const cursor = event.target.result;
              
              if (cursor) {
                const entry = cursor.value;
                if (now > entry.expiresAt) {
                  objectStore.delete(entry.key);
                }
                cursor.continue();
              } else {
                resolve(true);
              }
            };

            request.onerror = () => reject(request.error);
          });
        })
      );
    }
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    const stats = {
      memoryEntries: this.memoryCache.size,
      indexedDBEntries: 0,
      totalSize: 0
    };

    if (!this.db) await this.init();
    
    if (this.db) {
      const stores = Object.values(this.stores);
      
      for (const storeName of stores) {
        const count = await new Promise((resolve) => {
          const transaction = this.db.transaction([storeName], 'readonly');
          const objectStore = transaction.objectStore(storeName);
          const request = objectStore.count();
          
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve(0);
        });
        
        stats.indexedDBEntries += count;
      }
    }

    return stats;
  }
}

// Export singleton instance
const cacheManager = new CacheManager();

// Clean up expired entries every 5 minutes
setInterval(() => {
  cacheManager.clearExpired();
}, 5 * 60 * 1000);

export default cacheManager;

