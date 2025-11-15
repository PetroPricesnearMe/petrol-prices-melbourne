Search the codebase, especially ./src/lib/env.ts, for variables or functions that are declared but never used and which do not conform to the allowed unused variable naming regex /^_/u (for example, 'getEnv'). Remove these unused declarations or, if they should remain unused by design, rename them to start with an underscore (_) so they are permitted by the @typescript-eslint/no-unused-vars rule. Output a summary of all changes made and display the before/after for the main fix.
/**
 * Airtable CMS Provider
 *
 * Implementation of the CMS provider interface for Airtable
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

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

export class AirtableProvider implements ICMSProvider {
  private config: CMSConfig;
  private cache = getCMSCache();

  constructor(config: CMSConfig) {
    this.config = {
      cacheTime: 3600,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };

    // Airtable API URL
    if (!this.config.apiUrl.includes('api.airtable.com')) {
      this.config.apiUrl = 'https://api.airtable.com/v0';
    }
  }

  async fetchAll<T extends CMSContent>(
    collection: string,
    options: CMSQueryOptions = {}
  ): Promise<CMSPaginatedResponse<T>> {
    const cacheKey = generateCacheKey('airtable', collection, options);

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

      this.cache.set(cacheKey, result, this.config.cacheTime!, {
        tags: [collection, 'airtable'],
        staleWhileRevalidate: 3600,
      });

      return result;
    } catch (error) {
      throw parseCMSError(error, 'airtable');
    }
  }

  async fetchById<T extends CMSContent>(
    collection: string,
    id: string
  ): Promise<T | null> {
    const cacheKey = generateCacheKey('airtable', collection, { id });

    const cached = this.cache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = `${this.config.apiUrl}/${this.config.projectId}/${collection}/${id}`;

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

      const data: AirtableRecord = await response.json();
      const normalized = this.normalizeResponse<T>(data);

      this.cache.set(cacheKey, normalized, this.config.cacheTime!, {
        tags: [collection, `${collection}:${id}`, 'airtable'],
      });

      return normalized;
    } catch (error) {
      throw parseCMSError(error, 'airtable');
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
      throw parseCMSError(error, 'airtable');
    }
  }

  async create<T extends CMSContent>(
    collection: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const url = `${this.config.apiUrl}/${this.config.projectId}/${collection}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          fields: this.denormalizeData(data),
        }),
      });

      if (!response.ok) {
        throw response;
      }

      const result: AirtableRecord = await response.json();
      this.cache.invalidateByTags([collection]);

      return this.normalizeResponse<T>(result);
    } catch (error) {
      throw parseCMSError(error, 'airtable');
    }
  }

  async update<T extends CMSContent>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const url = `${this.config.apiUrl}/${this.config.projectId}/${collection}/${id}`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          fields: this.denormalizeData(data),
        }),
      });

      if (!response.ok) {
        throw response;
      }

      const result: AirtableRecord = await response.json();
      this.cache.invalidateByTags([collection, `${collection}:${id}`]);

      return this.normalizeResponse<T>(result);
    } catch (error) {
      throw parseCMSError(error, 'airtable');
    }
  }

  async delete(collection: string, id: string): Promise<void> {
    try {
      const url = `${this.config.apiUrl}/${this.config.projectId}/${collection}/${id}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw response;
      }

      this.cache.invalidateByTags([collection, `${collection}:${id}`]);
    } catch (error) {
      throw parseCMSError(error, 'airtable');
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
  }

  /**
   * Fetch from Airtable API
   */
  private async fetchFromAPI<T>(
    collection: string,
    options: CMSQueryOptions = {}
  ): Promise<CMSPaginatedResponse<T>> {
    const params = new URLSearchParams();

    if (options.pageSize) {
      params.append('maxRecords', String(options.pageSize));
    }

    // Handle sorting
    if (options.sort) {
      params.append('sort[0][field]', options.sort.field);
      params.append(
        'sort[0][direction]',
        options.sort.order === 'desc' ? 'desc' : 'asc'
      );
    }

    // Handle filters (Airtable formula)
    if (options.filters) {
      const formula = this.buildFilterFormula(options.filters);
      params.append('filterByFormula', formula);
    }

    // Handle search
    if (options.search) {
      params.append('filterByFormula', `SEARCH("${options.search}", {Name})`);
    }

    // Handle fields selection
    if (options.fields) {
      options.fields.forEach((field) => {
        params.append('fields[]', field);
      });
    }

    const url = `${this.config.apiUrl}/${this.config.projectId}/${collection}?${params.toString()}`;

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

    const data: AirtableResponse = await response.json();

    return {
      data: data.records.map((record) => this.normalizeResponse<T>(record)),
      total: data.records.length,
      page: options.page || 1,
      pageSize: data.records.length,
      hasMore: !!data.offset,
    };
  }

  /**
   * Build Airtable filter formula
   */
  private buildFilterFormula(filters: Record<string, any>): string {
    const conditions = Object.entries(filters).map(
      ([key, value]) => `{${key}}="${value}"`
    );

    if (conditions.length === 1) {
      return conditions[0];
    }

    return `AND(${conditions.join(',')})`;
  }

  /**
   * Normalize Airtable response to CMSContent format
   */
  private normalizeResponse<T extends CMSContent>(record: AirtableRecord): T {
    return {
      id: record.id,
      createdAt: new Date(record.createdTime),
      updatedAt: new Date(record.createdTime), // Airtable doesn't track update time by default
      ...record.fields,
    } as T;
  }

  /**
   * Convert normalized data back to Airtable fields format
   */
  private denormalizeData(data: Partial<CMSContent>): Record<string, any> {
    const { id, createdAt, updatedAt, ...fields } = data as any;
    return fields;
  }

  /**
   * Get request headers
   */
  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.config.apiToken}`,
      'Content-Type': 'application/json',
    };
  }
}
