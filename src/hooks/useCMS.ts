/**
 * useCMS Hook
 *
 * Client-side hook for fetching CMS content
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { CMSPaginatedResponse, CMSQueryOptions } from '@/lib/cms/types';

interface UseCMSOptions extends CMSQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseCMSResult<T> {
  data: T[] | null;
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
}

/**
 * Hook for fetching CMS collection data
 */
export function useCMS<T>(
  collection: string,
  options: UseCMSOptions = {}
): UseCMSResult<T> {
  const {
    enabled = true,
    refetchInterval,
    onSuccess,
    onError,
    ...queryOptions
  } = options;

  const [data, setData] = useState<T[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(queryOptions.page || 1);
  const [pageSize, setPageSize] = useState(queryOptions.pageSize || 20);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (currentPage: number = page) => {
      if (!enabled) return;

      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          pageSize: String(pageSize),
        });

        if (queryOptions.search) {
          params.append('search', queryOptions.search);
        }

        if (queryOptions.sort) {
          params.append('sort', queryOptions.sort.field);
          params.append('order', queryOptions.sort.order);
        }

        if (queryOptions.filters) {
          params.append('filters', JSON.stringify(queryOptions.filters));
        }

        const response = await fetch(
          `/api/cms/${collection}?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: CMSPaginatedResponse<T> = await response.json();

        setData(result.data);
        setTotal(result.total);
        setPage(result.page);
        setPageSize(result.pageSize);
        setHasMore(result.hasMore);

        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err) {
        const errorObj =
          err instanceof Error ? err : new Error('Unknown error');
        setIsError(true);
        setError(errorObj);

        if (onError) {
          onError(errorObj);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [collection, enabled, page, pageSize, queryOptions, onSuccess, onError]
  );

  const refetch = useCallback(async () => {
    await fetchData(page);
  }, [fetchData, page]);

  const loadMore = useCallback(async () => {
    if (hasMore) {
      await fetchData(page + 1);
    }
  }, [fetchData, hasMore, page]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Polling
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, enabled, fetchData]);

  return {
    data,
    total,
    page,
    pageSize,
    hasMore,
    isLoading,
    isError,
    error,
    refetch,
    loadMore,
  };
}

/**
 * Hook for fetching a single CMS item by ID
 */
export function useCMSItem<T>(
  collection: string,
  id: string | null,
  options: Omit<UseCMSOptions, keyof CMSQueryOptions> = {}
): {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !id) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await fetch(`/api/cms/${collection}/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: T = await response.json();

      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      setIsError(true);
      setError(errorObj);

      if (onError) {
        onError(errorObj);
      }
    } finally {
      setIsLoading(false);
    }
  }, [collection, id, enabled, onSuccess, onError]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

/**
 * Hook for fetching a single CMS item by slug
 */
export function useCMSItemBySlug<T>(
  collection: string,
  slug: string | null,
  options: Omit<UseCMSOptions, keyof CMSQueryOptions> = {}
): {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !slug) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await fetch(`/api/cms/${collection}/slug/${slug}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: T = await response.json();

      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      setIsError(true);
      setError(errorObj);

      if (onError) {
        onError(errorObj);
      }
    } finally {
      setIsLoading(false);
    }
  }, [collection, slug, enabled, onSuccess, onError]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
