/**
 * Revalidation API Route
 *
 * POST /api/revalidate - Revalidate specific paths or tags
 *
 * Body:
 * {
 *   "paths": ["/page1", "/page2"],
 *   "tags": ["collection1", "collection2"]
 * }
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getCMS } from '@/lib/cms';

/**
 * POST /api/revalidate
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization (use secret token)
    const authHeader = request.headers.get('authorization');
    const secret = process.env.REVALIDATION_SECRET;

    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: unknown = await request.json();
    const { paths, tags } = body as { paths?: string[]; tags?: string[] };

    // Revalidate paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
      }
    }

    // Revalidate tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag);
      }

      // Also revalidate in CMS cache
      const cms = getCMS();
      await cms.revalidate(paths, tags);
    }

    return NextResponse.json({
      success: true,
      revalidated: {
        paths: paths || [],
        tags: tags || [],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {

    return NextResponse.json(
      {
        error: 'Failed to revalidate',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Only allow POST
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
