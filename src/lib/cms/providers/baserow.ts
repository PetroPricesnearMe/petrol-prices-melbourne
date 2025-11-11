/**
 * Baserow CMS Provider
 * 
 * Implementation of the CMS provider interface for Baserow
 */

import {
  CMSConfig,
  CMSContent,
  CMSPaginatedResponse,
  CMSQueryOptions,
  ICMSProvider,
} from '../types';
import { getCMSCache, generateCacheKey } from '../cache';
import { parseCMSError, retryWithBackoff, withTimeout } from '../error-handler';

interface BaserowResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export class BaserowProvider implements ICMSProvider {
  private config: CMSConfig;
  private cache = getCMSCache();

  constructor(config: CMSConfig) {
    this.config = {
      cacheTime: 3600,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  async fetchAll<T extends CMSContent>(
    collection: string,
    options: CMSQueryOptions = {}
  ): Promise<CMSPaginatedResponse<T>> {
    const cacheKey = generateCacheKey('baserow', collection, options);

    // Check cache first
    const cached = this.cache.get<CMSPaginatedResponse<T>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const result = await retryWithBackoff(
        () => this.fetchFromAPI<T>(collection, options),
        {
          maxAttempts: this.config.retryAttempts,
          initialDelay: this.config.retryDelay,
        }
      );

      // Cache the result
      this.cache.set(cacheKey, result, this.config.cacheTime!, {
        tags: [collection, 'baserow'],
        staleWhileRevalidate: 3600, // 1 hour stale
      });

      return result;
    } catch (error) {
      throw parseCMSError(error, 'baserow');
    }
  }

  async fetchById<T extends CMSContent>(
    collection: string,
    id: string
  ): Promise<T | null> {
    const cacheKey = generateCacheKey('baserow', collection, { id });

    const cached = this.cache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = `${this.config.apiUrl}/api/database/rows/table/${collection}/${id}/`;

      const response = await withTimeout(
        fetch(url, {
          headers: this.getHeaders(),
          next: { revalidate: this.config.cacheTime },
        }),
        10000
      );

      if (!response.ok) {
        if (response.status === 404) return null;
        throw response;
      }

      const data = await response.json();
      const normalized = this.normalizeResponse<T>(data);

      this.cache.set(cacheKey, normalized, this.config.cacheTime!, {
        tags: [collection, `${collection}:${id}`, 'baserow'],
      });

      return normalized;
    } catch (error) {
      throw parseCMSError(error, 'baserow');
    }
  }

  async fetchBySlug<T extends CMSContent>(
    collection: string,
    slug: string
  ): Promise<T | null> {
    try {
      const result = await this.fetchAll<T>(collection, {
        filters: { slug },
        pageSize: 1,
      });

      return result.data[0] || null;
    } catch (error) {
      throw parseCMSError(error, 'baserow');
    }
  }

  async create<T extends CMSContent>(
    collection: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const url = `${this.config.apiUrl}/api/database/rows/table/${collection}/`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw response;
      }

      const result = await response.json();

      // Invalidate cache
      this.cache.invalidateByTags([collection]);

      return this.normalizeResponse<T>(result);
    } catch (error) {
      throw parseCMSError(error, 'baserow');
    }
  }

  async update<T extends CMSContent>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const url = `${this.config.apiUrl}/api/database/rows/table/${collection}/${id}/`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw response;
      }

      const result = await response.json();

      // Invalidate cache
      this.cache.invalidateByTags([collection, `${collection}:${id}`]);

      return this.normalizeResponse<T>(result);
    } catch (error) {
      throw parseCMSError(error, 'baserow');
    }
  }

  async delete(collection: string, id: string): Promise<void> {
    try {
      const url = `${this.config.apiUrl}/api/database/rows/table/${collection}/${id}/`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw response;
      }

      // Invalidate cache
      this.cache.invalidateByTags([collection, `${collection}:${id}`]);
    } catch (error) {
      throw parseCMSError(error, 'baserow');
    }
  }

  async search<T extends CMSContent>(
    collection: string,
    query: string,
    options: CMSQueryOptions = {}
  ): Promise<CMSPaginatedResponse<T>> {
    return this.fetchAll<T>(collection, {
      ...options,
      search: query,
    });
  }

  async revalidate(paths?: string[], tags?: string[]): Promise<void> {
    if (tags) {
      this.cache.invalidateByTags(tags);
    }
    // Path-based revalidation handled by Next.js revalidatePath/revalidateTag
  }

  /**
   * Fetch from Baserow API
   */
  private async fetchFromAPI<T>(
    collection: string,
    options: CMSQueryOptions = {}
  ): Promise<CMSPaginatedResponse<T>> {
    const params = new URLSearchParams();

    if (options.page) params.append('page', String(options.page));
    if (options.pageSize) params.append('size', String(options.pageSize || 100));
    if (options.search) params.append('search', options.search);

    // Handle sorting
    if (options.sort) {
      const order = options.sort.order === 'desc' ? '-' : '';
      params.append('order_by', `${order}${options.sort.field}`);
    }

    // Handle filters (Baserow specific)
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params.append(`filter__${key}__equal`, String(value));
      });
    }

    const url = `${this.config.apiUrl}/api/database/rows/table/${collection}/?${params.toString()}`;

    const response = await withTimeout(
      fetch(url, {
        headers: this.getHeaders(),
        next: { revalidate: this.config.cacheTime },
      }),
      15000 // 15 second timeout
    );

    if (!response.ok) {
      throw response;
    }

    const data: BaserowResponse<any> = await response.json();

    return {
      data: data.results.map((item) => this.normalizeResponse<T>(item)),
      total: data.count,
      page: options.page || 1,
      pageSize: options.pageSize || 100,
      hasMore: data.next !== null,
    };
  }

  /**
   * Normalize Baserow response to CMSContent format
   */
  private normalizeResponse<T extends CMSContent>(data: any): T {
    return {
      id: String(data.id),
      createdAt: data.created_on ? new Date(data.created_on) : new Date(),
      updatedAt: data.updated_on ? new Date(data.updated_on) : new Date(),
      ...data,
    } as T;
  }

  /**
   * Get request headers
   */
  private getHeaders(): HeadersInit {
    return {
      Authorization: `Token ${this.config.apiToken}`,
      'Content-Type': 'application/json',
    };
  }
}

