# Dynamic Content & CMS Integration - Complete Implementation

## 🎉 Overview

A production-ready, full-stack CMS integration system for Next.js with support for multiple CMS providers (Baserow, Sanity, Airtable), advanced caching, error handling, and Incremental Static Regeneration (ISR).

## ✅ Features Implemented

### 1. Unified CMS Abstraction Layer

**Files:**

- `src/lib/cms/types.ts` - Type definitions
- `src/lib/cms/index.ts` - Main entry point and factory
- `src/lib/cms/config.ts` - Configuration and validation

**Capabilities:**

- ✅ Provider abstraction with unified interface
- ✅ Support for Baserow, Sanity, and Airtable
- ✅ Easy to extend for Contentful, Strapi, etc.
- ✅ Type-safe operations
- ✅ Environment-based configuration

### 2. Advanced Caching System

**File:** `src/lib/cms/cache.ts`

**Features:**

- ✅ In-memory LRU cache with TTL
- ✅ Stale-while-revalidate support
- ✅ Cache tags for grouped invalidation
- ✅ Cache statistics and monitoring
- ✅ Automatic cleanup of expired entries
- ✅ Configurable cache size limits

### 3. Comprehensive Error Handling

**File:** `src/lib/cms/error-handler.ts`

**Features:**

- ✅ Structured error types with context
- ✅ Retry logic with exponential backoff
- ✅ Circuit breaker pattern
- ✅ Fallback strategies
- ✅ Timeout handling
- ✅ Error classification (retryable vs non-retryable)

### 4. CMS Provider Implementations

**Files:**

- `src/lib/cms/providers/baserow.ts` - Baserow provider
- `src/lib/cms/providers/sanity.ts` - Sanity.io provider
- `src/lib/cms/providers/airtable.ts` - Airtable provider

**Each provider supports:**

- ✅ Fetch all items with pagination
- ✅ Fetch by ID
- ✅ Fetch by slug
- ✅ Create, update, delete operations
- ✅ Search functionality
- ✅ Filtering and sorting
- ✅ Cache integration
- ✅ Error handling

### 5. Production-Ready API Routes

**Files:**

- `src/app/api/cms/[collection]/route.ts` - List endpoint
- `src/app/api/cms/[collection]/[id]/route.ts` - Single item CRUD
- `src/app/api/cms/[collection]/slug/[slug]/route.ts` - Fetch by slug
- `src/app/api/revalidate/route.ts` - Cache revalidation

**Features:**

- ✅ Edge runtime support
- ✅ Proper caching headers (s-maxage, stale-while-revalidate)
- ✅ Error handling with fallbacks
- ✅ CORS support
- ✅ Query parameter parsing
- ✅ ISR configuration

### 6. Reusable React Components

**Files:**

- `src/components/cms/CMSErrorBoundary.tsx` - Error boundary
- `src/components/cms/CMSContent.tsx` - Content renderer
- `src/components/cms/CMSList.tsx` - Paginated list

**Features:**

- ✅ Loading states with skeletons
- ✅ Error states with retry
- ✅ Empty states
- ✅ Pagination support
- ✅ Search functionality
- ✅ Responsive design
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Keyboard navigation

### 7. Example Pages

**Files:**

- `src/app/cms-example/page.tsx` - Server-side with ISR
- `src/app/cms-example/[slug]/page.tsx` - Dynamic routes with ISR
- `src/app/cms-example/client/page.tsx` - Client-side fetching

**Demonstrates:**

- ✅ Server Component pattern
- ✅ ISR with revalidation
- ✅ Dynamic route generation
- ✅ SEO optimization
- ✅ Client-side fetching
- ✅ Error boundaries
- ✅ Loading states

## 🚀 Quick Start

### 1. Environment Setup

Create `.env.local` file:

```bash
# Basic Configuration
CMS_PROVIDER=baserow
CMS_API_URL=https://api.baserow.io
CMS_API_TOKEN=your_api_token
CMS_CACHE_TIME=3600

# Optional: Revalidation secret
REVALIDATION_SECRET=your_random_secret
```

### 2. Usage Examples

#### Server-Side Fetching (Recommended)

```typescript
// app/my-page/page.tsx
import { getCMS } from '@/lib/cms';

export const revalidate = 3600; // ISR - revalidate every hour

export default async function MyPage() {
  const cms = getCMS();
  const data = await cms.fetchAll('stations', { pageSize: 20 });

  return (
    <div>
      {data.data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

#### Client-Side Fetching

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function MyClientPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/cms/stations')
      .then(res => res.json())
      .then(result => setData(result.data));
  }, []);

  return <div>{/* render data */}</div>;
}
```

#### Using Reusable Components

```typescript
import { CMSList } from '@/components/cms/CMSList';

<CMSList
  initialData={data}
  fetchData={(page) => fetchFromAPI(page)}
  renderItem={(item) => <ItemCard item={item} />}
  showPagination
  showSearch
/>
```

## 📚 API Reference

### CMS Provider Methods

```typescript
interface ICMSProvider {
  // Fetch all items
  fetchAll<T>(
    collection: string,
    options?: CMSQueryOptions
  ): Promise<CMSPaginatedResponse<T>>;

  // Fetch single item by ID
  fetchById<T>(collection: string, id: string): Promise<T | null>;

  // Fetch by slug
  fetchBySlug<T>(collection: string, slug: string): Promise<T | null>;

  // Create item
  create<T>(collection: string, data: Partial<T>): Promise<T>;

  // Update item
  update<T>(collection: string, id: string, data: Partial<T>): Promise<T>;

  // Delete item
  delete(collection: string, id: string): Promise<void>;

  // Search
  search<T>(
    collection: string,
    query: string,
    options?: CMSQueryOptions
  ): Promise<CMSPaginatedResponse<T>>;

  // Revalidate cache
  revalidate(paths?: string[], tags?: string[]): Promise<void>;
}
```

### Query Options

```typescript
interface CMSQueryOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  search?: string;
  fields?: string[];
  tags?: string[];
}
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for complete configuration options.

**Essential:**

- `CMS_PROVIDER` - Provider type (baserow, sanity, airtable)
- `CMS_API_URL` - API endpoint
- `CMS_API_TOKEN` - Authentication token

**Cache:**

- `CMS_CACHE_ENABLED` - Enable/disable caching
- `CMS_CACHE_TIME` - Cache TTL in seconds
- `CMS_STALE_WHILE_REVALIDATE` - Stale period in seconds

**Retry:**

- `CMS_RETRY_ATTEMPTS` - Number of retries
- `CMS_RETRY_DELAY` - Initial delay in ms
- `CMS_RETRY_MAX_DELAY` - Maximum delay in ms

**Feature Flags:**

- `CMS_ENABLE_CIRCUIT_BREAKER` - Circuit breaker pattern
- `CMS_ENABLE_DEBUG_LOGGING` - Debug logs

### Provider-Specific Configuration

#### Baserow

```bash
CMS_PROVIDER=baserow
CMS_API_URL=https://api.baserow.io
CMS_API_TOKEN=your_token
```

#### Sanity

```bash
CMS_PROVIDER=sanity
CMS_API_URL=https://your-project.api.sanity.io
CMS_PROJECT_ID=your_project_id
CMS_DATASET=production
CMS_API_TOKEN=your_token
```

#### Airtable

```bash
CMS_PROVIDER=airtable
CMS_API_URL=https://api.airtable.com/v0
CMS_API_TOKEN=your_token
CMS_PROJECT_ID=your_base_id
```

## 🎯 Best Practices

### 1. Use Server Components for Initial Load

```typescript
// ✅ Good - Server Component with ISR
export const revalidate = 3600;

export default async function Page() {
  const data = await getCMS().fetchAll('items');
  return <div>{/* render */}</div>;
}

// ❌ Avoid - Client component for static content
'use client';
export default function Page() {
  const [data, setData] = useState([]);
  useEffect(() => { /* fetch */ }, []);
  // ...
}
```

### 2. Implement Error Boundaries

```typescript
import { CMSErrorBoundary } from '@/components/cms/CMSErrorBoundary';

<CMSErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</CMSErrorBoundary>
```

### 3. Use Cache Tags for Efficient Revalidation

```typescript
// Fetch with tags
const data = await cms.fetchAll('posts', {
  tags: ['posts', 'featured'],
});

// Revalidate by tag
await cms.revalidate(undefined, ['posts']);
```

### 4. Handle Loading and Error States

```typescript
<CMSContent
  data={data}
  isLoading={isLoading}
  error={error}
  loadingComponent={<CustomSkeleton />}
  errorComponent={<CustomError />}
  renderItem={(item) => <ItemCard item={item} />}
/>
```

## 🧪 Testing

### API Routes

```bash
# Fetch all stations
curl http://localhost:3000/api/cms/stations

# With pagination
curl http://localhost:3000/api/cms/stations?page=2&pageSize=10

# With search
curl http://localhost:3000/api/cms/stations?search=BP

# Fetch by ID
curl http://localhost:3000/api/cms/stations/123

# Fetch by slug
curl http://localhost:3000/api/cms/stations/slug/my-station

# Revalidate cache
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your_secret" \
  -H "Content-Type: application/json" \
  -d '{"tags": ["stations"]}'
```

## 📊 Performance Optimizations

### 1. Caching Strategy

- **In-memory cache**: Fast lookups, shared across requests
- **Stale-while-revalidate**: Serve stale content while fetching fresh data
- **Cache tags**: Invalidate related content efficiently
- **LRU eviction**: Automatic cleanup of old entries

### 2. ISR Configuration

```typescript
// Revalidate every hour
export const revalidate = 3600;

// Or on-demand via API
fetch('/api/revalidate', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer secret',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ tags: ['stations'] }),
});
```

### 3. Edge Runtime

```typescript
// Use edge runtime for faster response
export const runtime = 'edge';
export const revalidate = 3600;
```

## 🛡️ Error Handling

### Automatic Retry with Backoff

```typescript
// Automatically retries failed requests
const data = await cms.fetchAll('items');
// Retries 3 times with exponential backoff
```

### Fallback Strategies

```typescript
import { withFallback } from '@/lib/cms/error-handler';

const data = await withFallback(() => cms.fetchAll('items'), {
  getFallback: () => cachedData,
  onError: (error) => console.error(error),
});
```

### Circuit Breaker

```typescript
// Automatically enabled to prevent cascade failures
// Opens after 5 consecutive failures
// Resets after 30 seconds
```

## 🎨 Customization

### Adding a New Provider

1. Create provider file: `src/lib/cms/providers/my-provider.ts`
2. Implement `ICMSProvider` interface
3. Add to factory in `src/lib/cms/index.ts`

```typescript
import { MyProvider } from './providers/my-provider';

export function createCMSProvider(config: CMSConfig): ICMSProvider {
  switch (config.provider) {
    case 'my-provider':
      return new MyProvider(config);
    // ...
  }
}
```

### Custom Error Boundary

```typescript
<CMSErrorBoundary
  fallback={<MyCustomErrorUI />}
  onError={(error, errorInfo) => {
    // Custom error handling
    logToService(error, errorInfo);
  }}
  showDetails={isDevelopment}
>
  <YourComponent />
</CMSErrorBoundary>
```

## 📦 Dependencies

Required:

- Next.js 15+
- React 19+
- TypeScript 5+

No additional dependencies needed! The implementation uses only Next.js built-in features.

## 🚢 Deployment

### Vercel

1. Add environment variables in Vercel dashboard
2. Deploy normally: `vercel --prod`

### Environment Variables to Set:

```bash
CMS_PROVIDER=your_provider
CMS_API_URL=your_api_url
CMS_API_TOKEN=your_token
REVALIDATION_SECRET=random_secret
```

### Testing in Production

```bash
# Visit example pages
https://your-domain.com/cms-example
https://your-domain.com/cms-example/client
https://your-domain.com/cms-example/[slug]
```

## 📈 Monitoring

### Cache Statistics

```typescript
import { getCMSCache } from '@/lib/cms';

const cache = getCMSCache();
const stats = cache.getStats();

console.log({
  hits: stats.hits,
  misses: stats.misses,
  hitRate: stats.hits / (stats.hits + stats.misses),
  size: stats.size,
  evictions: stats.evictions,
});
```

### Configuration Validation

```typescript
import { verifyConfig, logConfig } from '@/lib/cms/config';

// Verify configuration is valid
if (!verifyConfig()) {
  console.error('Invalid CMS configuration');
}

// Log configuration (safe, without secrets)
logConfig();
```

## 🎓 Examples

Check out the example pages in `src/app/cms-example/`:

1. **Server-Side ISR** - `/cms-example`
2. **Dynamic Routes** - `/cms-example/[slug]`
3. **Client-Side** - `/cms-example/client`

Each demonstrates different patterns and best practices.

## 🤝 Contributing

To add new features:

1. Add types to `src/lib/cms/types.ts`
2. Implement in appropriate provider
3. Add tests
4. Update documentation

## 📝 License

MIT

---

**Last Updated**: 2025-11-11  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
