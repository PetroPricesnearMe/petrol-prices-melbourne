/**
 * Dynamic CMS API Routes - Fetch by Slug
 *
 * GET /api/cms/[collection]/slug/[slug] - Fetch single item by slug
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getCMS } from '@/lib/cms';
import { withFallback } from '@/lib/cms/error-handler';

interface RouteContext {
  params: Promise<{ collection: string; slug: string }>;
}

/**
 * GET /api/cms/[collection]/slug/[slug]
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { collection, slug } = await context.params;
    const cms = getCMS();

    const item = await withFallback(() => cms.fetchBySlug(collection, slug), {
      getFallback: () => null,
      onError: (error) => {
        console.error('CMS fetch error:', error);
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
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

// Configure route segment
export const runtime = 'edge';
export const revalidate = 3600;
