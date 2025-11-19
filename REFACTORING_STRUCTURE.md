# Project Refactoring - Clean Modular Structure

## Overview

This document outlines the clean, modular structure implemented for the PPNM project. The refactoring focuses on:

1. **Clean Directory Structure**: Organized into `app`, `components`, `data`, `hooks`, `lib`, and `styles`
2. **Reusable DirectoryLayout**: Single layout component for all listing and detail pages
3. **Dynamic Routes with ISR**: Optimized routes with Incremental Static Regeneration
4. **Canonical Metadata**: SEO-optimized metadata system

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── stations/
│   │   └── [id]/
│   │       └── page.tsx         # Station detail page (ID-based)
│   ├── listings/
│   │   └── [slug]/
│   │       └── page.tsx         # Listing detail page (slug-based)
│   ├── directory/
│   │   ├── page.tsx             # Main directory listing page
│   │   └── [suburb]/
│   │       └── page.tsx         # Suburb-specific directory
│   ├── regions/
│   │   └── [region]/
│   │       └── page.tsx         # Region-specific directory
│   └── layout.tsx               # Root layout
│
├── components/                   # React Components
│   ├── layouts/
│   │   ├── DirectoryLayout.tsx  # Main reusable layout
│   │   ├── DirectoryLayout.client.tsx
│   │   └── DirectoryLayout.server.tsx
│   ├── molecules/               # Reusable component molecules
│   ├── organisms/               # Complex components
│   └── ui/                      # Base UI components
│
├── data/                        # Data Access Layer
│   └── index.ts                 # Centralized data exports
│
├── hooks/                       # Custom React Hooks
│   └── index.ts                 # Hook exports
│
├── lib/                         # Core Libraries & Utilities
│   ├── data/                    # Data fetching functions
│   │   ├── stations.ts          # Station data access
│   │   └── stations-slugs.ts    # Slug utilities
│   ├── seo/                     # SEO utilities
│   │   ├── canonical.ts         # Canonical URL generation
│   │   └── metadata.ts          # Metadata generation
│   └── utils/                   # Shared utilities
│
└── styles/                      # Styling
    ├── globals.css
    └── system/                  # Design system
```

## Key Components

### 1. DirectoryLayout

A reusable layout component for all listing and detail pages.

**Location**: `src/components/layouts/DirectoryLayout.tsx`

**Features**:
- Server and client component support
- Automatic breadcrumb generation
- SEO-optimized with canonical URLs
- Responsive design with sidebar support
- Flexible container variants
- Header variants (default, minimal, hero)

**Usage**:
```tsx
import DirectoryLayout from '@/components/layouts/DirectoryLayout';

export default function MyPage() {
  return (
    <DirectoryLayout
      title="Page Title"
      description="Page description"
      canonicalUrl="/my-page"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'My Page', href: '/my-page' }
      ]}
    >
      {/* Page content */}
    </DirectoryLayout>
  );
}
```

### 2. Data Access Layer

Centralized data access through `src/data/index.ts`.

**Exports**:
- `getAllStations()` - Get all stations
- `getStationById(id)` - Get station by ID
- `getStationBySlug(slug)` - Get station by slug
- `getAllStationIds()` - Get all station IDs for ISR
- `getAllStationSlugs()` - Get all station slugs for ISR
- `getStationsBySuburb(suburb)` - Filter by suburb
- `getStationsByRegion(region)` - Filter by region
- `getNearbyStations(lat, lng, radius)` - Get nearby stations

**Usage**:
```tsx
import { getStationById, getAllStationIds } from '@/data';

// In page component
export async function generateStaticParams() {
  const ids = await getAllStationIds();
  return ids.map(id => ({ id: id.toString() }));
}

export default async function Page({ params }) {
  const station = await getStationById(params.id);
  // ...
}
```

### 3. SEO Metadata System

Comprehensive SEO utilities in `src/lib/seo/metadata.ts`.

**Functions**:
- `generateBaseMetadata()` - Base metadata generator
- `generateStationMetadata()` - Station detail page metadata
- `generateListingMetadata()` - Listing detail page metadata
- `generateDirectoryMetadata()` - Directory page metadata
- `generateRegionMetadata()` - Region page metadata
- `generateSuburbMetadata()` - Suburb page metadata

**Usage**:
```tsx
import { generateStationMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }) {
  const station = await getStationById(params.id);
  return generateStationMetadata(station, `stations/${params.id}`);
}
```

### 4. Canonical URL System

Canonical URL utilities in `src/lib/seo/canonical.ts`.

**Functions**:
- `generateCanonicalUrl(path)` - Generate canonical URL
- `generateStationCanonicalUrl(id)` - Station canonical URL
- `generateListingCanonicalUrl(slug)` - Listing canonical URL
- `generateDirectoryCanonicalUrl(suburb?)` - Directory canonical URL
- `generateRegionCanonicalUrl(region)` - Region canonical URL

## Dynamic Routes

### Station Detail Page (`/stations/[id]`)

**Location**: `src/app/stations/[id]/page.tsx`

**Features**:
- ISR with 1-hour revalidation
- SEO-optimized metadata
- Comprehensive station information
- Nearby stations recommendations

**ISR Configuration**:
```tsx
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const ids = await getAllStationIds();
  return ids.slice(0, 100).map(id => ({ id: id.toString() }));
}
```

### Listing Detail Page (`/listings/[slug]`)

**Location**: `src/app/listings/[slug]/page.tsx`

**Features**:
- Slug-based routing for better SEO
- ISR with 1-hour revalidation
- SEO-optimized metadata
- Supports both ID and slug lookups

**ISR Configuration**:
```tsx
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const slugs = await getAllStationSlugs();
  return slugs.slice(0, 200).map(slug => ({ slug }));
}
```

### Directory Page (`/directory`)

**Location**: `src/app/directory/page.tsx`

**Features**:
- ISR with 24-hour revalidation
- Infinite scroll directory
- Advanced filtering
- SEO-optimized metadata

**ISR Configuration**:
```tsx
export const revalidate = 86400; // 24 hours
```

## Best Practices

### 1. Always Use DirectoryLayout

All listing and detail pages should use `DirectoryLayout` for consistency:

```tsx
import DirectoryLayout from '@/components/layouts/DirectoryLayout';

export default function MyPage() {
  return (
    <DirectoryLayout
      title="Page Title"
      canonicalUrl="/my-page"
    >
      {/* Content */}
    </DirectoryLayout>
  );
}
```

### 2. Generate Metadata for SEO

Always generate metadata using the SEO utilities:

```tsx
import { generateStationMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }) {
  const station = await getStationById(params.id);
  return generateStationMetadata(station, `stations/${params.id}`);
}
```

### 3. Use ISR for Dynamic Routes

Always configure ISR for dynamic routes:

```tsx
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  // Pre-generate first N items at build time
  const items = await getAllItems();
  return items.slice(0, 100).map(item => ({ id: item.id }));
}
```

### 4. Use Data Access Layer

Always use the centralized data access layer:

```tsx
import { getStationById, getAllStationIds } from '@/data';
// NOT: import { getStationById } from '@/lib/data/stations';
```

### 5. Include Canonical URLs

Always include canonical URLs in metadata:

```tsx
import { generateStationCanonicalUrl } from '@/lib/seo/canonical';

<DirectoryLayout
  canonicalUrl={generateStationCanonicalUrl(id)}
>
```

## Migration Guide

### Migrating Existing Pages

1. **Replace layout imports**:
   ```tsx
   // Old
   import DirectoryLayout from '@/components/layouts/DirectoryLayout.server';
   
   // New
   import DirectoryLayout from '@/components/layouts/DirectoryLayout';
   ```

2. **Update data imports**:
   ```tsx
   // Old
   import { getStationById } from '@/lib/data/stations';
   
   // New
   import { getStationById } from '@/data';
   ```

3. **Update metadata generation**:
   ```tsx
   // Old
   export const metadata: Metadata = { /* ... */ };
   
   // New
   import { generateStationMetadata } from '@/lib/seo/metadata';
   export async function generateMetadata({ params }) {
     return generateStationMetadata(station, path);
   }
   ```

4. **Add ISR configuration**:
   ```tsx
   export const revalidate = 3600;
   export async function generateStaticParams() { /* ... */ }
   ```

## Performance Benefits

1. **ISR**: Pages are pre-generated at build time and revalidated on-demand
2. **Centralized Data Access**: Reduces code duplication and improves maintainability
3. **SEO Optimization**: Consistent metadata and canonical URLs across all pages
4. **Reusable Components**: DirectoryLayout reduces code duplication
5. **Type Safety**: TypeScript ensures type safety across the data layer

## Next Steps

1. ✅ Create DirectoryLayout component
2. ✅ Set up data access layer
3. ✅ Implement SEO metadata system
4. ✅ Configure ISR for dynamic routes
5. ✅ Update all pages to use new structure
6. ⏳ Migrate remaining pages
7. ⏳ Add comprehensive tests
8. ⏳ Update documentation

