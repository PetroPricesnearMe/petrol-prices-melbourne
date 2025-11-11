/**
 * Dynamic CMS API Routes - Single Item
 * 
 * GET /api/cms/[collection]/[id] - Fetch single item by ID
 * PATCH /api/cms/[collection]/[id] - Update item
 * DELETE /api/cms/[collection]/[id] - Delete item
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCMS } from '@/lib/cms';
import { withFallback } from '@/lib/cms/error-handler';
import { revalidateTag } from 'next/cache';

interface RouteContext {
  params: Promise<{ collection: string; id: string }>;
}

/**
 * GET /api/cms/[collection]/[id]
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { collection, id } = await context.params;
    const cms = getCMS();

    const item = await withFallback(
      () => cms.fetchById(collection, id),
      {
        getFallback: () => null,
        onError: (error) => {
          console.error('CMS fetch error:', error);
        },
      }
    );

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch item',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/[collection]/[id]
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { collection, id } = await context.params;
    const data = await request.json();

    const cms = getCMS();
    const updated = await cms.update(collection, id, data);

    // Revalidate cache
    revalidateTag(collection);
    revalidateTag(`${collection}:${id}`);

    return NextResponse.json(updated, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json(
      {
        error: 'Failed to update item',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/[collection]/[id]
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { collection, id } = await context.params;

    const cms = getCMS();
    await cms.delete(collection, id);

    // Revalidate cache
    revalidateTag(collection);
    revalidateTag(`${collection}:${id}`);

    return NextResponse.json(
      { success: true, message: 'Item deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json(
      {
        error: 'Failed to delete item',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Configure route segment
export const runtime = 'edge';
export const revalidate = 3600;

