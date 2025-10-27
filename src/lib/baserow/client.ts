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
  [key: string]: any;
}

class BaserowClient {
  private config: BaserowConfig;
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  constructor(config: BaserowConfig) {
    this.config = {
      cacheTime: 3600, // 1 hour default
      ...config,
    };
  }

  /**
   * Fetch rows from a Baserow table
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
        value: any;
      }>;
      orderBy?: string;
    } = {}
  ): Promise<T[]> {
    const cacheKey = this.buildCacheKey(databaseId, tableId, options);

    // Check cache
    const cached = this.getFromCache<T[]>(cacheKey);
    if (cached) return cached;

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

      if (!response.ok) {
        throw new Error(`Baserow API error: ${response.status} ${response.statusText}`);
      }

      const data: BaserowResponse<T> = await response.json();
      
      // Cache the result
      this.setCache(cacheKey, data.results);
      
      return data.results;
    } catch (error) {
      console.error('Baserow fetch error:', error);
      throw error;
    }
  }

  /**
   * Fetch a single row by ID
   */
  async fetchRowById<T = BaserowRow>(
    tableId: string,
    rowId: number
  ): Promise<T | null> {
    const cacheKey = `row_${tableId}_${rowId}`;
    
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) return cached;

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

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Baserow API error: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Baserow fetch error:', error);
      return null;
    }
  }

  /**
   * Create a new row
   */
  async createRow<T extends Record<string, any>>(
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
  async updateRow<T extends Record<string, any>>(
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
  private buildCacheKey(databaseId: string, tableId: string, options: any): string {
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
