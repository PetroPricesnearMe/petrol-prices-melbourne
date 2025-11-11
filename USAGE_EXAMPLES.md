# CMS Integration - Usage Examples

## Table of Contents

1. [Server-Side Fetching](#server-side-fetching)
2. [Client-Side Fetching](#client-side-fetching)
3. [Using Hooks](#using-hooks)
4. [Error Handling](#error-handling)
5. [Caching Strategies](#caching-strategies)
6. [Revalidation](#revalidation)
7. [Advanced Patterns](#advanced-patterns)

---

## Server-Side Fetching

### Basic Server Component with ISR

```typescript
// app/posts/page.tsx
import { getCMS } from '@/lib/cms';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

export default async function PostsPage() {
  const cms = getCMS();
  const posts = await cms.fetchAll('posts', { pageSize: 20 });

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.data.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Dynamic Route with generateStaticParams

```typescript
// app/posts/[slug]/page.tsx
import { getCMS } from '@/lib/cms';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
}

// Pre-render all post pages
export async function generateStaticParams() {
  const cms = getCMS();
  const posts = await cms.fetchAll<Post>('posts');
  
  return posts.data.map(post => ({
    slug: post.slug,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const cms = getCMS();
  const post = await cms.fetchBySlug<Post>('posts', params.slug);
  
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const cms = getCMS();
  const post = await cms.fetchBySlug<Post>('posts', params.slug);
  
  if (!post) notFound();
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### With Error Handling

```typescript
import { getCMS } from '@/lib/cms';
import { withFallback } from '@/lib/cms/error-handler';

export default async function PostsPage() {
  const cms = getCMS();
  
  const posts = await withFallback(
    () => cms.fetchAll('posts', { pageSize: 20 }),
    {
      getFallback: () => ({
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
        hasMore: false,
      }),
      onError: (error) => {
        console.error('Failed to fetch posts:', error);
      },
    }
  );

  if (posts.data.length === 0) {
    return <div>No posts available</div>;
  }

  return <div>{/* render posts */}</div>;
}
```

---

## Client-Side Fetching

### Using fetch API

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function PostsClient() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/cms/posts?pageSize=20');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setPosts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

---

## Using Hooks

### Basic Usage

```typescript
'use client';

import { useCMS } from '@/hooks/useCMS';

export default function PostsList() {
  const { data, isLoading, isError, error, refetch } = useCMS('posts', {
    pageSize: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {data?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### With Search and Filtering

```typescript
'use client';

import { useState } from 'react';
import { useCMS } from '@/hooks/useCMS';

export default function SearchablePosts() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useCMS('posts', {
    search,
    filters: category ? { category } : undefined,
    pageSize: 20,
  });

  return (
    <div>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search posts..."
      />
      
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="tech">Technology</option>
        <option value="design">Design</option>
      </select>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data?.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Fetch Single Item

```typescript
'use client';

import { useCMSItem } from '@/hooks/useCMS';

export default function PostDetail({ id }: { id: string }) {
  const { data: post, isLoading, error } = useCMSItem('posts', id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### With Polling

```typescript
'use client';

import { useCMS } from '@/hooks/useCMS';

export default function LivePosts() {
  const { data, isLoading } = useCMS('posts', {
    pageSize: 10,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return <div>{/* render posts */}</div>;
}
```

---

## Error Handling

### Using Error Boundary

```typescript
import { CMSErrorBoundary } from '@/components/cms';

export default function MyPage() {
  return (
    <CMSErrorBoundary
      fallback={<div>Something went wrong</div>}
      onError={(error) => console.error(error)}
    >
      <PostsList />
    </CMSErrorBoundary>
  );
}
```

### Custom Error UI

```typescript
<CMSErrorBoundary
  fallback={
    <div className="error-container">
      <h2>Oops! Something went wrong</h2>
      <p>We're working on fixing it.</p>
      <button onClick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  }
>
  <YourComponent />
</CMSErrorBoundary>
```

---

## Caching Strategies

### Server-Side Cache with ISR

```typescript
// Revalidate every hour
export const revalidate = 3600;

// Or on-demand revalidation
import { revalidatePath } from 'next/cache';
revalidatePath('/posts');
```

### Client-Side Cache with SWR-like behavior

```typescript
// The CMS cache automatically handles:
// - Memory caching
// - Stale-while-revalidate
// - Cache tags for invalidation

const cms = getCMS();
const posts = await cms.fetchAll('posts');
// Cached automatically for 1 hour (default)
```

### Cache Configuration

```bash
# .env.local
CMS_CACHE_TIME=3600  # 1 hour
CMS_STALE_WHILE_REVALIDATE=3600  # Serve stale for 1 hour while revalidating
```

---

## Revalidation

### On-Demand Revalidation

```typescript
// Trigger revalidation via API
await fetch('/api/revalidate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.REVALIDATION_SECRET}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    tags: ['posts'],
    paths: ['/posts', '/'],
  }),
});
```

### Webhook for CMS Updates

```typescript
// app/api/webhooks/cms/route.ts
import { revalidateTag } from 'next/cache';
import { getCMS } from '@/lib/cms';

export async function POST(request: Request) {
  const body = await request.json();
  
  // Verify webhook signature
  const signature = request.headers.get('x-webhook-signature');
  if (signature !== process.env.WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Revalidate based on webhook data
  const { collection, action } = body;
  
  revalidateTag(collection);
  
  // Also invalidate CMS cache
  const cms = getCMS();
  await cms.revalidate(undefined, [collection]);

  return Response.json({ revalidated: true });
}
```

---

## Advanced Patterns

### Infinite Scrolling

```typescript
'use client';

import { useState } from 'react';
import { useCMS } from '@/hooks/useCMS';

export default function InfinitePostsList() {
  const [page, setPage] = useState(1);
  const { data, hasMore, loadMore, isLoading } = useCMS('posts', {
    page,
    pageSize: 20,
  });

  return (
    <div>
      {data?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      {hasMore && (
        <button onClick={loadMore} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Optimistic Updates

```typescript
'use client';

import { useState } from 'react';

export default function CreatePost() {
  const [posts, setPosts] = useState([]);

  async function handleCreate(newPost) {
    // Optimistically add post
    setPosts([newPost, ...posts]);
    
    try {
      const response = await fetch('/api/cms/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
      });
      
      if (!response.ok) throw new Error('Failed');
      
      const created = await response.json();
      
      // Replace temp post with real one
      setPosts(posts => 
        posts.map(p => p.id === newPost.id ? created : p)
      );
    } catch (error) {
      // Rollback on error
      setPosts(posts => posts.filter(p => p.id !== newPost.id));
      alert('Failed to create post');
    }
  }

  return <div>{/* form and list */}</div>;
}
```

### Parallel Data Fetching

```typescript
export default async function Dashboard() {
  const cms = getCMS();

  // Fetch multiple collections in parallel
  const [posts, products, users] = await Promise.all([
    cms.fetchAll('posts', { pageSize: 10 }),
    cms.fetchAll('products', { pageSize: 10 }),
    cms.fetchAll('users', { pageSize: 10 }),
  ]);

  return (
    <div>
      <section>{/* render posts */}</section>
      <section>{/* render products */}</section>
      <section>{/* render users */}</section>
    </div>
  );
}
```

### With React Query (optional)

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

function fetchPosts() {
  return fetch('/api/cms/posts').then(res => res.json());
}

export default function PostsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 60000, // 1 minute
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return <div>{/* render */}</div>;
}
```

---

## Best Practices

1. **Use Server Components for initial load** - Better SEO and performance
2. **Enable ISR for static content** - Fast page loads with automatic updates
3. **Use client components for interactive features** - Search, filters, real-time updates
4. **Implement error boundaries** - Graceful error handling
5. **Configure caching appropriately** - Balance freshness with performance
6. **Use cache tags** - Efficient invalidation of related content
7. **Monitor cache statistics** - Optimize cache hit rates

---

## Troubleshooting

### Cache not working

```typescript
// Check cache is enabled
CMS_CACHE_ENABLED=true

// Verify cache time
CMS_CACHE_TIME=3600

// Check cache stats
import { getCMSCache } from '@/lib/cms';
console.log(getCMSCache().getStats());
```

### Stale data issues

```typescript
// Force revalidation
await fetch('/api/revalidate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${secret}` },
  body: JSON.stringify({ tags: ['posts'] }),
});
```

### TypeScript errors

```typescript
// Define your content types
interface Post extends CMSContent {
  title: string;
  content: string;
  slug: string;
}

// Use with type parameter
const posts = await cms.fetchAll<Post>('posts');
```

---

For more examples, check the `/cms-example` pages in the app directory.

