/**
 * CMS Client-Side Example
 *
 * Demonstrates:
 * - Client-side data fetching
 * - Real-time updates
 * - Interactive filtering and pagination
 * - Optimistic updates
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

import { CMSErrorBoundary } from '@/components/cms/CMSErrorBoundary';
import { CMSList } from '@/components/cms/CMSList';
import type { CMSPaginatedResponse } from '@/lib/cms/types';

interface Station {
  id: string;
  name: string;
  address: string;
  price?: number;
  brand?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CMSClientExamplePage() {
  const [initialData, setInitialData] =
    useState<CMSPaginatedResponse<Station> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await fetch('/api/cms/stations?pageSize=12');
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        setInitialData(data);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        // Set empty data as fallback
        setInitialData({
          data: [],
          total: 0,
          page: 1,
          pageSize: 12,
          hasMore: false,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Fetch function for pagination/filtering
  const fetchData = useCallback(
    async (
      page: number,
      filters?: any
    ): Promise<CMSPaginatedResponse<Station>> => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '12',
      });

      if (filters?.search) {
        params.append('search', filters.search);
      }

      const response = await fetch(`/api/cms/stations?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');

      return response.json();
    },
    []
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="border-t-blue-600 mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300" />
              <p className="mt-4 text-sm text-gray-600">Loading stations...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!initialData) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-red-200 bg-red-50 rounded-lg border p-6">
            <p className="text-red-800">
              Failed to load data. Please try again later.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Client-Side CMS Content
          </h1>
          <p className="mt-2 text-gray-600">
            This page demonstrates client-side data fetching with real-time
            updates
          </p>
          <div className="bg-yellow-50 mt-4 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="text-yellow-600 h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-yellow-700 text-sm">
                <strong>Client-Side:</strong> Data is fetched on the client and
                updates dynamically. Use for interactive features that require
                real-time updates.
              </div>
            </div>
          </div>
        </div>

        {/* Content with Error Boundary */}
        <CMSErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
          <CMSList
            initialData={initialData}
            fetchData={fetchData}
            renderItem={(station) => <StationCard station={station} />}
            emptyMessage="No stations found"
            showPagination
            showSearch
            itemsPerRow={3}
          />
        </CMSErrorBoundary>
      </div>
    </main>
  );
}

/**
 * Station Card Component
 */
function StationCard({ station }: { station: Station }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-900">{station.name}</h2>

      {station.brand && (
        <div className="mt-2">
          <span className="bg-blue-100 text-blue-800 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
            {station.brand}
          </span>
        </div>
      )}

      <p className="mt-3 text-sm text-gray-600">{station.address}</p>

      {station.price && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500">Current Price:</span>
          <span className="text-green-600 text-xl font-bold">
            ${station.price.toFixed(2)}/L
          </span>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400">
        Updated: {new Date(station.updatedAt).toLocaleDateString()}
      </div>
    </article>
  );
}
