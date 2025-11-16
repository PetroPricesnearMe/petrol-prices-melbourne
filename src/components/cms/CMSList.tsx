/**
 * CMS List Component
 *
 * Reusable list component for CMS content with:
 * - Pagination
 * - Filtering
 * - Sorting
 * - Search
 * - Responsive layout
 */

'use client';

import React, { useState, useCallback } from 'react';

import type {
  CMSContent as CMSContentType,
  CMSPaginatedResponse,
} from '@/lib/cms/types';

import { CMSContent, CMSLoadingSkeleton } from './CMSContent';

interface CMSListProps<T extends CMSContentType> {
  initialData: CMSPaginatedResponse<T>;
  fetchData: (page: number, filters?: any) => Promise<CMSPaginatedResponse<T>>;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  showPagination?: boolean;
  showSearch?: boolean;
  className?: string;
  itemsPerRow?: 1 | 2 | 3 | 4;
}

export function CMSList<T extends CMSContentType>({
  initialData,
  fetchData,
  renderItem,
  emptyMessage = 'No items found',
  showPagination = true,
  showSearch = true,
  className = '',
  itemsPerRow = 3,
}: CMSListProps<T>) {
  const [data, setData] = useState<CMSPaginatedResponse<T>>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(initialData.page);

  const loadPage = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const newData = await fetchData(
          page,
          searchQuery ? { search: searchQuery } : undefined
        );
        setData(newData);
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    },
    [fetchData, searchQuery]
  );

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      await loadPage(1);
    },
    [loadPage]
  );

  const handlePageChange = useCallback(
    async (newPage: number) => {
      await loadPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [loadPage]
  );

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={className}>
      {/* Search */}
      {showSearch && (
        <div className="mb-6">
          <label htmlFor="cms-search" className="sr-only">
            Search content
          </label>
          <div className="relative">
            <input
              id="cms-search"
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="focus:border-blue-500 focus:ring-blue-500 w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:outline-none focus:ring-2"
              aria-label="Search content"
            />
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <CMSLoadingSkeleton
          count={data.pageSize}
          className={`grid gap-6 ${gridCols[itemsPerRow]}`}
        />
      ) : (
        <CMSContent
          data={data.data}
          isLoading={false}
          error={error}
          emptyMessage={emptyMessage}
          renderItem={renderItem}
          className={`grid gap-6 ${gridCols[itemsPerRow]}`}
        />
      )}

      {/* Pagination */}
      {showPagination && data.total > data.pageSize && (
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {(currentPage - 1) * data.pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * data.pageSize, data.total)}
            </span>{' '}
            of <span className="font-medium">{data.total}</span> results
          </div>

          <nav className="flex gap-2" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(data.total / data.pageSize) })
                .slice(Math.max(0, currentPage - 3), currentPage + 2)
                .map((_, i) => {
                  const pageNum = Math.max(0, currentPage - 3) + i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`rounded-md px-4 py-2 text-sm font-medium ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                      aria-label={`Page ${pageNum}`}
                      aria-current={
                        pageNum === currentPage ? 'page' : undefined
                      }
                    >
                      {pageNum}
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!data.hasMore || isLoading}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
