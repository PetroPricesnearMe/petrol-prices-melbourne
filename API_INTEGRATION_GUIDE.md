# API Integration Guide

Complete guide to dynamic content and API integration in this Next.js project.

## 📋 Overview

This project includes a comprehensive API integration system supporting multiple data providers with ISR (Incremental Static Regeneration), automatic fallbacks, and production-ready error handling.

## 🚀 Features

✅ **Multiple Data Providers**

- Baserow (default)
- Airtable
- Supabase
- REST API

✅ **Next.js 15 Server Components**

- ISR support with configurable revalidation
- Automatic request deduplication
- Type-safe data fetching

✅ **Comprehensive State Management**

- Loading states with skeletons
- Error states with retry functionality
- Empty states with helpful messaging

✅ **Accessibility (WCAG 2.1 AA)**

- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels and roles

## 📁 File Structure

```
src/
├── lib/
│   └── api/
│       └── data-providers.ts        # Multi-provider data fetching
├── components/
│   └── api/
│       ├── StationList.tsx          # Main list component
│       ├── StationCard.tsx          # Individual station card
│       ├── StationListLoading.tsx   # Loading skeleton
│       ├── StationListError.tsx     # Error state
│       ├── StationListEmpty.tsx     # Empty state
│       └── index.ts                 # Barrel exports
└── app/
    └── api-example/
        ├── page.tsx                 # Example Server Component
        ├── loading.tsx              # Loading UI
        └── error.tsx                # Error boundary
```

## 🔧 Setup

### Environment Variables

Add to your `.env.local`:

```bash
# Baserow (default)
BASEROW_API_TOKEN=your_token
BASEROW_API_URL=https://api.baserow.io
BASEROW_STATIONS_TABLE_ID=123456
BASEROW_CACHE_TIME=3600

# Airtable (optional)
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_STATIONS_TABLE=Stations

# Supabase (optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_STATIONS_TABLE=stations

# REST API (optional)
API_URL=https://api.example.com
# or
NEXT_PUBLIC_API_URL=https://api.example.com

# Provider Selection (optional)
DATA_PROVIDER=baserow  # Options: baserow, airtable, supabase, rest
```

### Provider Priority

Providers are initialized in this order:

1. Baserow (if `BASEROW_API_TOKEN` is set)
2. Airtable (if `AIRTABLE_API_KEY` is set)
3. Supabase (if `SUPABASE_URL` is set)
4. REST API (if `API_URL` or `NEXT_PUBLIC_API_URL` is set)

The first available provider becomes the default, or you can set `DATA_PROVIDER` to explicitly choose.

## 💻 Usage

### Server Component with ISR

```typescript
// app/stations/page.tsx
import { getStations } from '@/lib/api/data-providers';
import { StationList } from '@/components/api';

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function StationsPage() {
  // Fetch data on server with ISR caching
  const stations = await getStations({
    revalidate: 3600,
    tags: ['stations'],
    fallback: true, // Enable automatic fallback
  });

  return (
    <div>
      <h1>Stations ({stations.length})</h1>
      <StationList
        stations={stations}
        onStationClick={(station) => {
          console.log('Clicked:', station);
        }}
      />
    </div>
  );
}
```

### Client Component with States

```typescript
'use client';

import { useState, useEffect } from 'react';
import { StationList } from '@/components/api';

export function ClientStationsList() {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStations() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/stations');
        const data = await response.json();
        setStations(data.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchStations();
  }, []);

  return (
    <StationList
      stations={stations}
      isLoading={isLoading}
      error={error}
      onRetry={() => {
        // Retry logic
        window.location.reload();
      }}
    />
  );
}
```

### API Route with Caching

```typescript
// app/api/stations/route.ts
import { NextResponse } from 'next/server';
import { getStations } from '@/lib/api/data-providers';

export const revalidate = 3600; // ISR

export async function GET() {
  try {
    const stations = await getStations({
      revalidate: 3600,
      tags: ['stations'],
    });

    return NextResponse.json(
      {
        success: true,
        data: stations,
        count: stations.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

## 🎨 Components

### StationList

Main component for displaying stations with automatic state handling.

**Props:**

- `stations: Station[]` - Array of station data
- `isLoading?: boolean` - Loading state
- `error?: Error | string | null` - Error state
- `emptyMessage?: string` - Custom empty message
- `onStationClick?: (station: Station) => void` - Click handler
- `columns?: { mobile?: 1|2, tablet?: 2|3, desktop?: 3|4|5 }` - Grid columns

**Example:**

```typescript
<StationList
  stations={stations}
  isLoading={false}
  error={null}
  columns={{
    mobile: 1,
    tablet: 2,
    desktop: 3,
  }}
  onStationClick={(station) => {
    router.push(`/stations/${station.id}`);
  }}
/>
```

### StationCard

Individual station card with accessibility features.

**Props:**

- `station: Station` - Station data
- `onClick?: () => void` - Click handler
- `asLink?: boolean` - Render as Link (default: true)
- `href?: string` - Custom link href

### State Components

- **StationListLoading** - Loading skeleton with configurable count
- **StationListError** - Error display with retry button
- **StationListEmpty** - Empty state with helpful suggestions

## 🔄 ISR Configuration

### Page-Level ISR

```typescript
// app/stations/page.tsx
export const revalidate = 3600; // Revalidate every hour
```

### Function-Level ISR

```typescript
const stations = await getStations({
  revalidate: 3600, // Cache for 1 hour
  tags: ['stations'], // Cache tags for targeted revalidation
  fallback: true, // Enable fallback
});
```

### Cache Headers

```typescript
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
  },
});
```

### Manual Revalidation

```typescript
import { revalidateTag } from 'next/cache';

// Revalidate specific tag
revalidateTag('stations');

// Revalidate path
revalidatePath('/stations');
```

## 🛡️ Error Handling

### Automatic Fallback

The system automatically falls back to the next available provider if one fails:

```typescript
// Try Baserow first, then Airtable, then Supabase, then REST
const stations = await getStations({ fallback: true });
```

### Custom Error Handling

```typescript
try {
  const stations = await getStations({ fallback: false });
} catch (error) {
  // Handle error from primary provider only
  console.error('Failed to fetch stations:', error);
  // Show error state to user
}
```

## ♿ Accessibility

All components are WCAG 2.1 AA compliant:

- ✅ Keyboard navigation (Tab, Enter, Space, Arrow keys)
- ✅ Screen reader announcements (`aria-live`, `aria-label`)
- ✅ Focus indicators (visible outlines)
- ✅ Semantic HTML (`<nav>`, `<main>`, `<article>`)
- ✅ Touch targets (minimum 44x44px)
- ✅ Color contrast (4.5:1 for text)

## 📊 Performance

### Caching Strategy

1. **React Cache** - Request-level deduplication
2. **Next.js Cache** - ISR with configurable revalidation
3. **HTTP Cache** - Browser/CDN caching with cache headers

### Optimization Tips

1. Use ISR for semi-static data (revalidate every hour/day)
2. Use Server Components for initial data fetching
3. Use Client Components only for interactivity
4. Implement loading states to prevent layout shifts
5. Use Suspense boundaries for streaming

## 🧪 Testing

### Example Page

Visit `/api-example` to see a complete example with:

- Server Component data fetching
- Loading, error, and empty states
- Multiple provider support
- ISR configuration

### Test Different Providers

1. Set environment variables for each provider
2. Set `DATA_PROVIDER` to switch providers
3. Test fallback by disabling the primary provider

## 🔍 Debugging

### Check Active Provider

```typescript
import { getActiveProviderName } from '@/lib/api/data-providers';

console.log('Active provider:', getActiveProviderName());
```

### Enable Debug Logs

The system logs provider failures and fallbacks to the console in development mode.

## 📚 Additional Resources

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Baserow API Docs](https://baserow.io/docs/apis/rest-api)
- [Airtable API Docs](https://airtable.com/developers/web/api/introduction)
- [Supabase API Docs](https://supabase.com/docs/reference/javascript/introduction)

## 🤝 Contributing

When adding new data providers:

1. Create a class implementing `DataProvider` interface
2. Add initialization logic to `ProviderManager`
3. Update environment variable documentation
4. Add tests for the new provider
5. Update this guide

---

**Status:** ✅ Production Ready
**Last Updated:** 2025
**Maintainer:** Development Team
