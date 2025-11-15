/**
 * Sanity CMS Provider
 *
 * Implementation of the CMS provider interface for Sanity.io
 */

import { getCMSCache, generateCacheKey } from '../cache';
import { parseCMSError, retryWithBackoff, withTimeout } from '../error-handler';
import type {
  CMSConfig,
  CMSContent,
  CMSPaginatedResponse,
  CMSQueryOptions,
  ICMSProvider,
} from '../types';

export class SanityProvider implements ICMSProvider {
  private config: CMSConfig;
  private cache = getCMSCache();
  private apiVersion = '2023-05-03';

  constructor(config: CMSConfig) {
    this.config = {
      cacheTime: 3600,
      retryAttempts: 3,
      retryDelay: 1000,
      dataset: 'production',
      ...config,
    };
  }

  async fetchAll<T extends CMSContent>(
    collection: string,
    options: CMSQueryOptions = {}
  ): Promise<CMSPaginatedResponse<T>> {
    const cacheKey = generateCacheKey('sanity', collection, options as Record<string, unknown>);

    const cached = this.cache.get<CMSPaginatedResponse<T>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const result = await retryWithBackoff(
        () => this.queryFromAPI<T>(collection, options),
        {
          maxAttempts: this.config.retryAttempts,
          initialDelay: this.config.retryDelay,
        }
      );

      this.cache.set(cacheKey, result, this.config.cacheTime!, {
        tags: [collection, 'sanity'],
        staleWhileRevalidate: 3600,
      });

      return result;
    } catch (error) {
      throw parseCMSError(error, 'sanity');
    }
  }

  async fetchById<T extends CMSContent>(
    collection: string,
    id: string
  ): Promise<T | null> {
    const cacheKey = generateCacheKey('sanity', collection, { id });

    const cached = this.cache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const query = `*[_type == "${collection}" && _id == "${id}"][0]`;
      const url = this.buildQueryUrl(query);

      const response = await withTimeout(
        fetch(url, {
          headers: this.getHeaders(),
          next: { revalidate: this.config.cacheTime },
        }),
        10000
      );

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      const result = data.result;

      if (!result) return null;

      const normalized = this.normalizeResponse<T>(result);

      this.cache.set(cacheKey, normalized, this.config.cacheTime!, {
        tags: [collection, `${collection}:${id}`, 'sanity'],
      });

      return normalized;
    } catch (error) {
      throw parseCMSError(error, 'sanity');
    }
  }

  async fetchBySlug<T extends CMSContent>(
    collection: string,
    slug: string
  ): Promise<T | null> {
    const cacheKey = generateCacheKey('sanity', collection, { slug });

    const cached = this.cache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const query = `*[_type == "${collection}" && slug.current == "${slug}"][0]`;
      const url = this.buildQueryUrl(query);

      const response = await withTimeout(
        fetch(url, {
          headers: this.getHeaders(),
          next: { revalidate: this.config.cacheTime },
        }),
        10000
      );

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      const result = data.result;

      if (!result) return null;

      const normalized = this.normalizeResponse<T>(result);

      this.cache.set(cacheKey, normalized, this.config.cacheTime!, {
        tags: [collection, `${collection}:${slug}`, 'sanity'],
      });

      return normalized;
    } catch (error) {
      throw parseCMSError(error, 'sanity');
    }
  }

  async create<T extends CMSContent>(
    collection: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const url = `${this.config.apiUrl}/v${this.apiVersion}/data/mutate/${this.config.dataset}`;

      const mutations = [
        {
          create: {
            _type: collection,
            ...data,
          },
        },
      ];

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ mutations }),
      });

      if (!response.ok) {
        throw response;
      }

      const result = await response.json();
      this.cache.invalidateByTags([collection]);

      return this.normalizeResponse<T>(result.results[0].document);
    } catch (error) {
      throw parseCMSError(error, 'sanity');
    }
  }

  async update<T extends CMSContent>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const url = `${this.config.apiUrl}/v${this.apiVersion}/data/mutate/${this.config.dataset}`;

      const mutations = [
        {
          patch: {
            id,
            set: data,
          },
        },
      ];

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ mutations }),
      });

      if (!response.ok) {
        throw response;
      }

      const result = await response.json();
      this.cache.invalidateByTags([collection, `${collection}:${id}`]);

      return this.normalizeResponse<T>(result.results[0].document);
    } catch (error) {
      throw parseCMSError(error, 'sanity');
    }
  }

  async delete(collection: string, id: string): Promise<void> {
    try {
      const url = `${this.config.apiUrl}/v${this.apiVersion}/data/mutate/${this.config.dataset}`;

      const mutations = [
        {
          delete: { id },
        },
      ];

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ mutations }),
      });

      if (!response.ok) {
        throw response;
      }

      this.cache.invalidateByTags([collection, `${collection}:${id}`]);
    } catch (error) {
      throw parseCMSError(error, 'sanity');
    }
  }

  async search<T extends CMSContent>(
    collection: string,
    query: string,
    _options: CMSQueryOptions = {}
  ): Promise<CMSPaginatedResponse<T>> {
    try {
      // Sanity search using GROQ
      const groqQuery = `*[_type == "${collection}" && [title, description] match "${query}*"]`;
      const url = this.buildQueryUrl(groqQuery);

      const response = await withTimeout(
        fetch(url, {
          headers: this.getHeaders(),
          next: { revalidate: this.config.cacheTime },
        }),
        10000
      );

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      const results = data.result || [];

      const normalizedData: T[] = results.map((item: Record<string, unknown>) => this.normalizeResponse<T>(item));
      return {
        data: normalizedData,
        total: results.length,
        page: 1,
        pageSize: results.length,
        hasMore: false,
      };
    } catch (error) {
      throw parseCMSError(error, 'sanity');
    }
  }

  async revalidate(_paths?: string[], tags?: string[]): Promise<void> {
    if (tags) {
      this.cache.invalidateByTags(tags);
    }
  }

  /**
   * Query from Sanity API using GROQ
   */
  private async queryFromAPI<T>(
    collection: string,
    options: CMSQueryOptions = {}
  ): Promise<CMSPaginatedResponse<T>> {
    // Build GROQ query
    let query = `*[_type == "${collection}"]`;

    // Add filters
    if (options.filters) {
      const filterConditions = Object.entries(options.filters)
        .map(([key, value]) => `${key} == "${value}"`)
        .join(' && ');
      query = `*[_type == "${collection}" && ${filterConditions}]`;
    }

    // Add sorting
    if (options.sort) {
      const order = options.sort.order === 'desc' ? 'desc' : 'asc';
      query += ` | order(${options.sort.field} ${order})`;
    }

    // Add pagination
    const page = options.page || 1;
    const pageSize = options.pageSize || 100;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    query += `[${start}...${end}]`;

    const url = this.buildQueryUrl(query);

    const response = await withTimeout(
      fetch(url, {
        headers: this.getHeaders(),
        next: { revalidate: this.config.cacheTime },
      }),
      15000
    );

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    const results = data.result || [];

    // @ts-expect-error - TypeScript incorrectly checks constraint here, but T extends CMSContent is guaranteed by method signature
    const normalizedData: T[] = results.map((item: Record<string, unknown>) => this.normalizeResponse<T>(item));
    return {
      data: normalizedData,
      total: results.length,
      page,
      pageSize,
      hasMore: results.length === pageSize,
    };
  }

  /**
   * Build Sanity query URL
   */
  private buildQueryUrl(query: string): string {
    const encodedQuery = encodeURIComponent(query);
    return `${this.config.apiUrl}/v${this.apiVersion}/data/query/${this.config.dataset}?query=${encodedQuery}`;
  }

  /**
   * Normalize Sanity response to CMSContent format
   */
  private normalizeResponse<T extends CMSContent>(data: Record<string, unknown>): T {
    const id = typeof data._id === 'string' ? data._id : '';
    const createdAt = data._createdAt && (typeof data._createdAt === 'string' || data._createdAt instanceof Date)
      ? new Date(data._createdAt)
      : new Date();
    const updatedAt = data._updatedAt && (typeof data._updatedAt === 'string' || data._updatedAt instanceof Date)
      ? new Date(data._updatedAt)
      : new Date();
    const slug = data.slug && typeof data.slug === 'object' && 'current' in data.slug && typeof data.slug.current === 'string'
      ? data.slug.current
      : undefined;
    
    return {
      id,
      createdAt,
      updatedAt,
      slug,
      ...data,
    } as T;
  }

  /**
   * Get request headers
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiToken) {
      headers.Authorization = `Bearer ${this.config.apiToken}`;
    }

    return headers;
  }
}
