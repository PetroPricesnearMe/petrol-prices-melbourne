# Dynamic Content & CMS Integration

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

---

## Overview

A production-ready, full-stack CMS integration system for Next.js 15+ with:

- **Multi-Provider Support**: Baserow, Sanity, Airtable (extensible)
- **Advanced Caching**: In-memory cache with stale-while-revalidate
- **ISR Support**: Incremental Static Regeneration with on-demand revalidation
- **Error Handling**: Comprehensive error boundaries and retry logic
- **Type Safety**: Full TypeScript support
- **Zero Dependencies**: Uses only Next.js built-in features

---

## Features

### ✅ Core Features

- [x] Unified CMS abstraction layer
- [x] Support for multiple CMS providers
- [x] Server-side and client-side data fetching
- [x] Automatic caching with TTL and tags
- [x] Stale-while-revalidate pattern
- [x] Exponential backoff retry logic
- [x] Circuit breaker for fault tolerance
- [x] Error boundaries with fallbacks
- [x] ISR with on-demand revalidation
- [x] Edge runtime support
- [x] Full TypeScript support
- [x] WCAG 2.1 AA accessibility

### 🚀 Performance Features

- [x] In-memory LRU cache
- [x] Request deduplication
- [x] Parallel data fetching
- [x] Lazy loading components
- [x] Optimistic updates
- [x] Cache invalidation by tags

---

## Quick Start

### 1. Install (No additional packages needed!)

This integration uses only Next.js built-in features.

### 2. Configure Environment

Create `.env.local`:

```bash
CMS_PROVIDER=baserow
CMS_API_URL=https://api.baserow.io
CMS_API_TOKEN=your_api_token
CMS_CACHE_TIME=3600
REVALIDATION_SECRET=your_secret
```

### 3. Use in Server Component

```typescript
import { getCMS } from '@/lib/cms';

export const revalidate = 3600; // ISR

export default async function Page() {
  const cms = getCMS();
  const data = await cms.fetchAll('posts', { pageSize: 20 });

  return (
    <div>
      {data.data.map(post => (
        <div key={post.id}>{post.name}</div>
      ))}
    </div>
  );
}
```

### 4. Or Use in Client Component

```typescript
'use client';

import { useCMS } from '@/hooks/useCMS';

export default function ClientPage() {
  const { data, isLoading } = useCMS('posts', { pageSize: 20 });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map(post => (
        <div key={post.id}>{post.name}</div>
      ))}
    </div>
  );
}
```

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js App                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────┐      ┌──────────────────┐     │
│  │ Server         │      │ Client           │     │
│  │ Components     │      │ Components       │     │
│  └───────┬────────┘      └────────┬─────────┘     │
│          │                         │                │
│          ├─────────┬───────────────┤                │
│          │         │               │                │
│  ┌───────▼─────┐   │       ┌───────▼────────┐     │
│  │ CMS Factory │   │       │ useCMS Hook    │     │
│  └───────┬─────┘   │       └───────┬────────┘     │
│          │         │               │                │
│  ┌───────▼─────────▼───────────────▼────────┐     │
│  │      CMS Provider Interface              │     │
│  │  (Baserow | Sanity | Airtable)          │     │
│  └───────────────────┬──────────────────────┘     │
│                      │                             │
│  ┌───────────────────▼──────────────────────┐     │
│  │         Cache Layer (In-Memory)          │     │
│  │  - TTL, Tags, Stale-While-Revalidate    │     │
│  └───────────────────┬──────────────────────┘     │
│                      │                             │
│  ┌───────────────────▼──────────────────────┐     │
│  │      Error Handler & Retry Logic         │     │
│  │  - Exponential Backoff, Circuit Breaker │     │
│  └───────────────────┬──────────────────────┘     │
│                      │                             │
│  ┌───────────────────▼──────────────────────┐     │
│  │         External CMS API                 │     │
│  │  (Baserow, Sanity, Airtable, etc.)      │     │
│  └──────────────────────────────────────────┘     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/
├── lib/
│   └── cms/
│       ├── index.ts              # Main entry point & factory
│       ├── types.ts              # Type definitions
│       ├── cache.ts              # Caching system
│       ├── config.ts             # Configuration & validation
│       ├── error-handler.ts      # Error handling utilities
│       └── providers/
│           ├── baserow.ts        # Baserow implementation
│           ├── sanity.ts         # Sanity implementation
│           └── airtable.ts       # Airtable implementation
│
├── components/
│   └── cms/
│       ├── index.ts              # Public exports
│       ├── CMSErrorBoundary.tsx  # Error boundary component
│       ├── CMSContent.tsx        # Content renderer
│       └── CMSList.tsx           # Paginated list component
│
├── hooks/
│   └── useCMS.ts                 # React hooks for client-side
│
└── app/
    ├── api/
    │   ├── cms/
    │   │   └── [collection]/
    │   │       ├── route.ts      # List endpoint
    │   │       ├── [id]/
    │   │       │   └── route.ts  # CRUD endpoint
    │   │       └── slug/[slug]/
    │   │           └── route.ts  # Fetch by slug
    │   └── revalidate/
    │       └── route.ts          # Revalidation endpoint
    │
    └── cms-example/
        ├── page.tsx              # Server-side example
        ├── [slug]/
        │   └── page.tsx          # Dynamic route example
        └── client/
            └── page.tsx          # Client-side example
```

---

## Configuration

### Environment Variables

See [ENV_CONFIGURATION.md](./ENV_CONFIGURATION.md) for complete reference.

**Essential:**

```bash
CMS_PROVIDER=baserow          # or sanity, airtable
CMS_API_URL=https://...       # Your CMS API endpoint
CMS_API_TOKEN=your_token      # Authentication token
```

**Optional:**

```bash
CMS_CACHE_TIME=3600           # Cache TTL in seconds
CMS_CACHE_ENABLED=true        # Enable/disable caching
CMS_RETRY_ATTEMPTS=3          # Number of retries
CMS_TIMEOUT=15000             # Request timeout (ms)
REVALIDATION_SECRET=secret    # For revalidation API
```

### Provider-Specific

**Baserow:**
```bash
CMS_PROVIDER=baserow
CMS_API_URL=https://api.baserow.io
CMS_API_TOKEN=your_token
```

**Sanity:**
```bash
CMS_PROVIDER=sanity
CMS_API_URL=https://project.api.sanity.io
CMS_PROJECT_ID=project_id
CMS_DATASET=production
```

**Airtable:**
```bash
CMS_PROVIDER=airtable
CMS_API_URL=https://api.airtable.com/v0
CMS_API_TOKEN=your_token
CMS_PROJECT_ID=base_id
```

---

## Usage

### Server Components (Recommended)

#### Basic Fetch

```typescript
import { getCMS } from '@/lib/cms';

export const revalidate = 3600;

export default async function Page() {
  const cms = getCMS();
  const data = await cms.fetchAll('stations');
  
  return <div>{/* render */}</div>;
}
```

#### With Options

```typescript
const data = await cms.fetchAll('stations', {
  page: 1,
  pageSize: 20,
  sort: { field: 'name', order: 'asc' },
  filters: { brand: 'BP' },
  search: 'melbourne',
});
```

#### With Error Handling

```typescript
import { withFallback } from '@/lib/cms/error-handler';

const data = await withFallback(
  () => cms.fetchAll('stations'),
  {
    getFallback: () => ({ data: [], total: 0 }),
    onError: (err) => console.error(err),
  }
);
```

### Client Components

#### Using Hooks

```typescript
'use client';

import { useCMS } from '@/hooks/useCMS';

export default function Page() {
  const { data, isLoading, error, refetch } = useCMS('stations', {
    pageSize: 20,
    sort: { field: 'name', order: 'asc' },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

#### Using API Routes

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/cms/stations?pageSize=20')
      .then(res => res.json())
      .then(result => setData(result.data));
  }, []);

  return <div>{/* render */}</div>;
}
```

### Using Components

```typescript
import { CMSList } from '@/components/cms';

<CMSList
  initialData={data}
  fetchData={(page) => fetchFromAPI(page)}
  renderItem={(item) => <ItemCard item={item} />}
  showPagination
  showSearch
  itemsPerRow={3}
/>
```

---

## API Reference

### CMS Provider Methods

```typescript
interface ICMSProvider {
  fetchAll<T>(collection: string, options?: CMSQueryOptions): Promise<CMSPaginatedResponse<T>>;
  fetchById<T>(collection: string, id: string): Promise<T | null>;
  fetchBySlug<T>(collection: string, slug: string): Promise<T | null>;
  create<T>(collection: string, data: Partial<T>): Promise<T>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<T>;
  delete(collection: string, id: string): Promise<void>;
  search<T>(collection: string, query: string, options?: CMSQueryOptions): Promise<CMSPaginatedResponse<T>>;
  revalidate(paths?: string[], tags?: string[]): Promise<void>;
}
```

### Query Options

```typescript
interface CMSQueryOptions {
  page?: number;              // Page number (default: 1)
  pageSize?: number;          // Items per page (default: 100)
  filters?: Record<string, unknown>;  // Key-value filters
  sort?: {
    field: string;            // Field to sort by
    order: 'asc' | 'desc';    // Sort direction
  };
  search?: string;            // Search query
  fields?: string[];          // Fields to return
  tags?: string[];            // Cache tags
}
```

### Hook API

```typescript
function useCMS<T>(
  collection: string,
  options?: UseCMSOptions
): {
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
```

---

## Examples

### Example Pages

Visit these example pages in your app:

1. **Server-Side ISR**: `/cms-example`
2. **Dynamic Routes**: `/cms-example/[slug]`
3. **Client-Side**: `/cms-example/client`

### API Endpoints

```bash
# Fetch all
GET /api/cms/stations

# With pagination
GET /api/cms/stations?page=2&pageSize=20

# With search
GET /api/cms/stations?search=BP

# With filters
GET /api/cms/stations?filters={"brand":"BP"}

# Fetch by ID
GET /api/cms/stations/123

# Fetch by slug
GET /api/cms/stations/slug/my-station

# Revalidate
POST /api/revalidate
Authorization: Bearer your_secret
Content-Type: application/json
{
  "tags": ["stations"],
  "paths": ["/stations"]
}
```

---

## Performance

### Caching Strategy

1. **In-Memory Cache**: Fast lookups, shared across requests
2. **Stale-While-Revalidate**: Serve stale content while revalidating
3. **Cache Tags**: Invalidate related content efficiently
4. **LRU Eviction**: Automatic cleanup

### ISR Configuration

```typescript
// Revalidate every hour
export const revalidate = 3600;

// Or use on-demand revalidation
await fetch('/api/revalidate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${secret}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ tags: ['stations'] }),
});
```

### Edge Runtime

```typescript
// Use edge runtime for faster responses
export const runtime = 'edge';
export const revalidate = 3600;
```

### Cache Statistics

```typescript
import { getCMSCache } from '@/lib/cms';

const stats = getCMSCache().getStats();
console.log({
  hits: stats.hits,
  misses: stats.misses,
  hitRate: stats.hits / (stats.hits + stats.misses),
  size: stats.size,
});
```

---

## Troubleshooting

### Issue: Cache not working

**Solution:**

```bash
# Check configuration
CMS_CACHE_ENABLED=true
CMS_CACHE_TIME=3600

# Check stats
import { getCMSCache } from '@/lib/cms';
console.log(getCMSCache().getStats());
```

### Issue: Stale data

**Solution:**

```bash
# Force revalidation
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your_secret" \
  -H "Content-Type: application/json" \
  -d '{"tags": ["stations"]}'
```

### Issue: TypeScript errors

**Solution:**

```typescript
// Define your content types
interface Station extends CMSContent {
  name: string;
  address: string;
}

// Use with type parameter
const stations = await cms.fetchAll<Station>('stations');
```

### Issue: Rate limiting

**Solution:**

```bash
# Increase cache time
CMS_CACHE_TIME=7200

# Increase retry delay
CMS_RETRY_DELAY=2000
CMS_RETRY_MAX_DELAY=20000
```

---

## Documentation

- [Complete Guide](./CMS_INTEGRATION_COMPLETE.md)
- [Usage Examples](./USAGE_EXAMPLES.md)
- [Environment Configuration](./ENV_CONFIGURATION.md)

---

## License

MIT

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-11  
**Status**: ✅ Production Ready

