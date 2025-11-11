/**
 * Dynamic CMS API Routes
 * 
 * GET /api/cms/[collection] - Fetch all items from a collection
 * 
 * Features:
 * - Automatic caching with ISR
 * - Error handling with fallbacks
 * - Pagination support
 * - Filtering and sorting
 * - CORS support
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCMS } from '@/lib/cms';
import { CMSQueryOptions } from '@/lib/cms/types';
import { withFallback } from '@/lib/cms/error-handler';

interface RouteContext {
  params: Promise<{ collection: string }>;
}

/**
 * GET /api/cms/[collection]
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 100)
 * - sort: Sort field (e.g., "name")
 * - order: Sort order ("asc" or "desc")
 * - search: Search query
 * - filters: JSON string of filters
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { collection } = await context.params;
    const searchParams = request.nextUrl.searchParams;

    // Build query options from search params
    const options: CMSQueryOptions = {
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '100'),
    };

    // Handle sorting
    const sortField = searchParams.get('sort');
    const sortOrder = searchParams.get('order') as 'asc' | 'desc' | undefined;
    if (sortField) {
      options.sort = {
        field: sortField,
        order: sortOrder || 'asc',
      };
    }

    // Handle search
    const search = searchParams.get('search');
    if (search) {
      options.search = search;
    }

    // Handle filters
    const filtersParam = searchParams.get('filters');
    if (filtersParam) {
      try {
        options.filters = JSON.parse(filtersParam);
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid filters format' },
          { status: 400 }
        );
      }
    }

    // Fetch from CMS with fallback
    const cms = getCMS();
    const result = await withFallback(
      () => cms.fetchAll(collection, options),
      {
        getFallback: () => ({
          data: [],
          total: 0,
          page: options.page || 1,
          pageSize: options.pageSize || 100,
          hasMore: false,
        }),
        onError: (error) => {
          console.error('CMS fetch error:', error);
        },
      }
    );

    // Return with caching headers
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=3600',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Enable CORS for API routes
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Configure route segment
export const runtime = 'edge'; // Use edge runtime for faster responses
export const revalidate = 3600; // Revalidate every hour

