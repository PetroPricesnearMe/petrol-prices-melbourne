/**
 * Unified CMS Types
 *
 * Type definitions for the unified CMS abstraction layer
 * Supports multiple CMS providers (Baserow, Sanity, Airtable, etc.)
 */

export type CMSProvider =
  | 'baserow'
  | 'sanity'
  | 'airtable'
  | 'contentful'
  | 'strapi';

/**
 * Base CMS configuration
 */
export interface CMSConfig {
  provider: CMSProvider;
  apiUrl: string;
  apiToken?: string;
  projectId?: string;
  dataset?: string;
  cacheTime?: number; // seconds
  retryAttempts?: number;
  retryDelay?: number; // milliseconds
}

/**
 * Query options for fetching content
 */
export interface CMSQueryOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  search?: string;
  fields?: string[];
  tags?: string[];
}

/**
 * Paginated response wrapper
 */
export interface CMSPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * CMS error with context
 */
export interface CMSError {
  code: string;
  message: string;
  statusCode?: number;
  provider: CMSProvider;
  timestamp: Date;
  retryable: boolean;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // seconds
  staleWhileRevalidate?: number; // seconds
  tags?: string[];
}

/**
 * Generic CMS content item
 */
export interface CMSContent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  slug?: string;
  status?: 'draft' | 'published' | 'archived';
  [key: string]: unknown;
}

/**
 * CMS provider interface that all providers must implement
 */
export interface ICMSProvider {
  /**
   * Fetch all items from a collection/table
   */
  fetchAll<T extends CMSContent>(
    collection: string,
    options?: CMSQueryOptions
  ): Promise<CMSPaginatedResponse<T>>;

  /**
   * Fetch a single item by ID
   */
  fetchById<T extends CMSContent>(
    collection: string,
    id: string
  ): Promise<T | null>;

  /**
   * Fetch a single item by slug
   */
  fetchBySlug<T extends CMSContent>(
    collection: string,
    slug: string
  ): Promise<T | null>;

  /**
   * Create a new item
   */
  create<T extends CMSContent>(
    collection: string,
    data: Partial<T>
  ): Promise<T>;

  /**
   * Update an existing item
   */
  update<T extends CMSContent>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<T>;

  /**
   * Delete an item
   */
  delete(collection: string, id: string): Promise<void>;

  /**
   * Search content
   */
  search<T extends CMSContent>(
    collection: string,
    query: string,
    options?: CMSQueryOptions
  ): Promise<CMSPaginatedResponse<T>>;

  /**
   * Revalidate cache for specific paths/tags
   */
  revalidate(paths?: string[], tags?: string[]): Promise<void>;
}

/**
 * Response transformer for normalizing provider-specific responses
 */
export interface ResponseTransformer<TSource, TTarget> {
  transform(source: TSource): TTarget;
  transformMany(sources: TSource[]): TTarget[];
}
