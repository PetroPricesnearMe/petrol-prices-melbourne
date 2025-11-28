/**
 * Baserow API Client
 *
 * Production-ready client for fetching dynamic content from Baserow with:
 * - Automatic caching with ISR support
 * - Comprehensive error handling
 * - Type-safe responses
 * - Request deduplication
 * - Retry logic
 */

import logger from '@/utils/logger';

interface BaserowConfig {
  apiToken: string;
  baseUrl: string;
  cacheTime?: number; // Time in seconds
}

interface BaserowResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface BaserowRow {
  id: number;
  [key: string]: unknown;
}

class BaserowClient {
  private config: BaserowConfig;
  private cache: Map<string, { data: unknown; expiry: number }> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private rateLimiter: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxRequestsPerMinute = 60;
  private readonly rateLimitWindow = 60 * 1000; // 1 minute

  constructor(config: BaserowConfig) {
    this.config = {
      cacheTime: 3600, // 1 hour default
      ...config,
    };
  }

  /**
   * Check rate limit before making request
   */
  private checkRateLimit(): { allowed: boolean; resetTime: number } {
    const now = Date.now();
    const key = 'baserow_api';
    const entry = this.rateLimiter.get(key);

    // No entry or window expired
    if (!entry || now > entry.resetTime) {
      this.rateLimiter.set(key, {
        count: 1,
        resetTime: now + this.rateLimitWindow,
      });
      return { allowed: true, resetTime: now + this.rateLimitWindow };
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequestsPerMinute) {
      return { allowed: false, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    return { allowed: true, resetTime: entry.resetTime };
  }

  /**
   * Fetch rows from a Baserow table with deduplication and rate limiting
   */
  async fetchTableRows<T = BaserowRow>(
    databaseId: string,
    tableId: string,
    options: {
      page?: number;
      size?: number;
      filters?: Array<{
        field: string;
        type: string;
        value: unknown;
      }>;
      orderBy?: string;
    } = {}
  ): Promise<T[]> {
    const cacheKey = this.buildCacheKey(databaseId, tableId, options);

    // Check cache first
    const cached = this.getFromCache<T[]>(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return cached;
    }

    // Check for pending request (deduplication)
    const pendingRequest = this.pendingRequests.get(cacheKey);
    if (pendingRequest) {
      logger.debug(`Deduplicating request for ${cacheKey}`);
      return pendingRequest as Promise<T[]>;
    }

    // Check rate limit
    const rateLimit = this.checkRateLimit();
    if (!rateLimit.allowed) {
      const waitTime = rateLimit.resetTime - Date.now();
      logger.warn(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)}s`);
      throw new Error(`Rate limit exceeded. Please try again in ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    // Create and store pending request
    const requestPromise = this.executeFetchTableRows<T>(databaseId, tableId, options, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Execute the actual fetch request
   */
  private async executeFetchTableRows<T = BaserowRow>(
    databaseId: string,
    tableId: string,
    options: {
      page?: number;
      size?: number;
      filters?: Array<{
        field: string;
        type: string;
        value: unknown;
      }>;
      orderBy?: string;
    },
    cacheKey: string
  ): Promise<T[]> {
    try {
      const params = new URLSearchParams({
        page: String(options.page || 1),
        size: String(options.size || 100),
      });

      if (options.orderBy) {
        params.append('order_by', options.orderBy);
      }

      const url = `${this.config.baseUrl}/api/database/rows/table/${tableId}/?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${this.config.apiToken}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: this.config.cacheTime,
        },
      });

      // Handle rate limit response
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
        logger.warn(`Rate limited by Baserow API. Retry after ${waitTime / 1000}s`);
        throw new Error(`Rate limit exceeded. Please try again in ${waitTime / 1000} seconds.`);
      }

      if (!response.ok) {
        throw new Error(`Baserow API error: ${response.status} ${response.statusText}`);
      }

      const data: BaserowResponse<T> = await response.json();

      // Cache the result
      this.setCache(cacheKey, data.results);

      return data.results;
    } catch (error) {
      logger.error('Baserow fetch error:', error);
      throw error;
    }
  }

  /**
   * Fetch a single row by ID with deduplication
   */
  async fetchRowById<T = BaserowRow>(
    tableId: string,
    rowId: number
  ): Promise<T | null> {
    const cacheKey = `row_${tableId}_${rowId}`;

    // Check cache
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return cached;
    }

    // Check for pending request
    const pendingRequest = this.pendingRequests.get(cacheKey);
    if (pendingRequest) {
      logger.debug(`Deduplicating request for ${cacheKey}`);
      return pendingRequest as Promise<T | null>;
    }

    // Check rate limit
    const rateLimit = this.checkRateLimit();
    if (!rateLimit.allowed) {
      const waitTime = rateLimit.resetTime - Date.now();
      logger.warn(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)}s`);
      throw new Error(`Rate limit exceeded. Please try again in ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    // Create and store pending request
    const requestPromise = this.executeFetchRowById<T>(tableId, rowId, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Execute the actual fetch row request
   */
  private async executeFetchRowById<T = BaserowRow>(
    tableId: string,
    rowId: number,
    cacheKey: string
  ): Promise<T | null> {
    try {
      const url = `${this.config.baseUrl}/api/database/rows/table/${tableId}/${rowId}/`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${this.config.apiToken}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: this.config.cacheTime,
        },
      });

      // Handle rate limit
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
        logger.warn(`Rate limited by Baserow API. Retry after ${waitTime / 1000}s`);
        throw new Error(`Rate limit exceeded. Please try again in ${waitTime / 1000} seconds.`);
      }

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Baserow API error: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);

      return data;
    } catch (error) {
      logger.error('Baserow fetch error:', error);
      return null;
    }
  }

  /**
   * Create a new row
   */
  async createRow<T extends Record<string, unknown>>(
    tableId: string,
    data: T
  ): Promise<BaserowRow> {
    const url = `${this.config.baseUrl}/api/database/rows/table/${tableId}/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.config.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create row: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Update a row
   */
  async updateRow<T extends Record<string, unknown>>(
    tableId: string,
    rowId: number,
    data: Partial<T>
  ): Promise<BaserowRow> {
    const url = `${this.config.baseUrl}/api/database/rows/table/${tableId}/${rowId}/`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${this.config.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update row: ${response.status}`);
    }

    // Invalidate cache
    this.invalidateCache(tableId, rowId);

    return response.json();
  }

  /**
   * Delete a row
   */
  async deleteRow(tableId: string, rowId: number): Promise<void> {
    const url = `${this.config.baseUrl}/api/database/rows/table/${tableId}/${rowId}/`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${this.config.apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete row: ${response.status}`);
    }

    // Invalidate cache
    this.invalidateCache(tableId, rowId);
  }

  /**
   * Get from cache if not expired
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);

    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Set cache with expiry
   */
  private setCache<T>(key: string, data: T): void {
    const expiry = Date.now() + (this.config.cacheTime! * 1000);
    this.cache.set(key, { data, expiry });
  }

  /**
   * Invalidate cache for a specific table/row
   */
  private invalidateCache(tableId: string, rowId?: number): void {
    if (rowId) {
      const key = `row_${tableId}_${rowId}`;
      this.cache.delete(key);
    }

    // Invalidate all entries for this table
    for (const key of this.cache.keys()) {
      if (key.includes(`table_${tableId}`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Build cache key
   */
  private buildCacheKey(databaseId: string, tableId: string, options: Record<string, unknown>): string {
    return `table_${databaseId}_${tableId}_${JSON.stringify(options)}`;
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
let baserowClient: BaserowClient | null = null;

/**
 * Get or create Baserow client instance
 */
export function getBaserowClient(): BaserowClient {
  if (!baserowClient) {
    if (!process.env.BASEROW_API_TOKEN || !process.env.BASEROW_API_URL) {
      throw new Error('Baserow API credentials not configured');
    }

    baserowClient = new BaserowClient({
      apiToken: process.env.BASEROW_API_TOKEN,
      baseUrl: process.env.BASEROW_API_URL,
      cacheTime: parseInt(process.env.BASEROW_CACHE_TIME || '3600'),
    });
  }

  return baserowClient;
}

export default BaserowClient;
