/**
 * API Optimization Utilities
 * Response compression, batching, and DataLoader-like functionality
 */

import cacheManager from '../services/CacheManager';

/**
 * DataLoader implementation for batching and caching
 * Prevents N+1 query problems
 */
class DataLoader {
  constructor(batchLoadFn, options = {}) {
    this.batchLoadFn = batchLoadFn;
    this.cache = options.cache !== false;
    this.cacheMap = new Map();
    this.batch = [];
    this.batchScheduled = false;
    this.maxBatchSize = options.maxBatchSize || 50;
  }

  /**
   * Load single item (batches automatically)
   */
  load(key) {
    if (this.cache && this.cacheMap.has(key)) {
      return Promise.resolve(this.cacheMap.get(key));
    }

    return new Promise((resolve, reject) => {
      this.batch.push({ key, resolve, reject });

      if (!this.batchScheduled) {
        this.batchScheduled = true;

        // Use microtask queue for batching
        queueMicrotask(() => {
          this.dispatch();
        });
      }
    });
  }

  /**
   * Load multiple items
   */
  loadMany(keys) {
    return Promise.all(keys.map(key => this.load(key)));
  }

  /**
   * Dispatch batched requests
   */
  async dispatch() {
    const batch = this.batch;
    this.batch = [];
    this.batchScheduled = false;

    if (batch.length === 0) return;

    const keys = batch.map(item => item.key);

    try {
      const values = await this.batchLoadFn(keys);

      if (values.length !== keys.length) {
        throw new Error('DataLoader: batch function must return same number of results');
      }

      batch.forEach((item, index) => {
        const value = values[index];

        if (this.cache) {
          this.cacheMap.set(item.key, value);
        }

        item.resolve(value);
      });
    } catch (error) {
      batch.forEach(item => item.reject(error));
    }
  }

  /**
   * Clear cache
   */
  clear(key) {
    if (key) {
      this.cacheMap.delete(key);
    } else {
      this.cacheMap.clear();
    }
  }

  /**
   * Prime cache with value
   */
  prime(key, value) {
    this.cacheMap.set(key, value);
  }
}

/**
 * Create DataLoader for stations
 */
export const createStationsLoader = (fetchFunction) => {
  return new DataLoader(async (stationIds) => {
    const results = await fetchFunction(stationIds);
    return stationIds.map(id => results.find(r => r.id === id) || null);
  }, { cache: true, maxBatchSize: 100 });
};

/**
 * Request batching utility
 * Combines multiple requests into single batch
 */
class RequestBatcher {
  constructor(options = {}) {
    this.queue = [];
    this.batchDelay = options.batchDelay || 50; // ms
    this.maxBatchSize = options.maxBatchSize || 50;
    this.timer = null;
  }

  /**
   * Add request to batch
   */
  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });

      // Schedule batch if needed
      if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.batchDelay);
      }

      // Flush if batch is full
      if (this.queue.length >= this.maxBatchSize) {
        clearTimeout(this.timer);
        this.flush();
      }
    });
  }

  /**
   * Flush batch and execute
   */
  async flush() {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.maxBatchSize);
    this.timer = null;

    try {
      // Execute all requests in parallel
      const results = await Promise.all(
        batch.map(item => item.request())
      );

      // Resolve each promise
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      // Reject all promises
      batch.forEach(item => {
        item.reject(error);
      });
    }

    // Process remaining queue
    if (this.queue.length > 0) {
      this.timer = setTimeout(() => this.flush(), this.batchDelay);
    }
  }
}

/**
 * Compress API request/response using CompressionStream
 */
export const compressData = async (data, format = 'gzip') => {
  if (!('CompressionStream' in window)) {
    console.warn('CompressionStream not supported');
    return data;
  }

  try {
    const stream = new CompressionStream(format);
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const compressedStream = blob.stream().pipeThrough(stream);
    const compressedBlob = await new Response(compressedStream).blob();

    return compressedBlob;
  } catch (error) {
    console.warn('[API] Compression failed:', error);
    return data;
  }
};

/**
 * Decompress API response
 */
export const decompressData = async (compressedData, format = 'gzip') => {
  if (!('DecompressionStream' in window)) {
    console.warn('DecompressionStream not supported');
    return compressedData;
  }

  try {
    const stream = new DecompressionStream(format);
    const decompressedStream = compressedData.stream().pipeThrough(stream);
    const decompressed = await new Response(decompressedStream).text();

    return JSON.parse(decompressed);
  } catch (error) {
    console.warn('[API] Decompression failed:', error);
    return compressedData;
  }
};

/**
 * Fetch with automatic caching and compression
 */
export const fetchOptimized = async (url, options = {}) => {
  const cacheKey = `api:${url}`;
  const ttl = options.ttl || 3600; // 1 hour default

  // Try cache first (stale-while-revalidate)
  const cached = await cacheManager.get(cacheKey);

  if (cached) {
    // Return cached data and revalidate in background
    fetchAndCache(url, options, cacheKey, ttl);
    return cached;
  }

  // No cache, fetch fresh
  return fetchAndCache(url, options, cacheKey, ttl);
};

/**
 * Fetch and cache helper
 */
const fetchAndCache = async (url, options, cacheKey, ttl) => {
  try {
    const headers = {
      ...options.headers,
      'Accept-Encoding': 'br, gzip, deflate', // Request compression
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the result
    await cacheManager.set(cacheKey, data, ttl);

    return data;
  } catch (error) {
    console.error('[API] Fetch failed:', error);
    throw error;
  }
};

/**
 * Batch multiple API requests
 */
export const batchRequests = async (requests = []) => {
  const batcher = new RequestBatcher({ batchDelay: 50, maxBatchSize: 10 });

  return Promise.all(
    requests.map(request => batcher.add(request))
  );
};

/**
 * Prefetch API data
 */
export const prefetchData = (url, ttl = 3600) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      fetchOptimized(url, { ttl });
    });
  } else {
    setTimeout(() => {
      fetchOptimized(url, { ttl });
    }, 1000);
  }
};

/**
 * GraphQL-like query optimization
 * Only fetch requested fields to reduce payload
 */
export const selectFields = (data, fields = []) => {
  if (!fields.length) return data;

  if (Array.isArray(data)) {
    return data.map(item => selectFields(item, fields));
  }

  const selected = {};
  fields.forEach(field => {
    if (field in data) {
      selected[field] = data[field];
    }
  });

  return selected;
};

/**
 * Retry failed requests with exponential backoff
 */
export const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      // Don't retry 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Cancel pending requests
 */
export class AbortableRequest {
  constructor() {
    this.controller = new AbortController();
  }

  fetch(url, options = {}) {
    return fetch(url, {
      ...options,
      signal: this.controller.signal
    });
  }

  abort() {
    this.controller.abort();
  }
}

export default {
  DataLoader,
  createStationsLoader,
  RequestBatcher,
  compressData,
  decompressData,
  fetchOptimized,
  batchRequests,
  prefetchData,
  selectFields,
  fetchWithRetry,
  AbortableRequest
};

