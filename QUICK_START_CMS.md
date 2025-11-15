# CMS Integration - Quick Start

## 🚀 5-Minute Setup

### Step 1: Configure Environment (1 min)

Create `.env.local`:

```bash
CMS_PROVIDER=baserow
CMS_API_URL=https://api.baserow.io
CMS_API_TOKEN=your_api_token_here
```

### Step 2: Server-Side Usage (2 min)

```typescript
// app/my-page/page.tsx
import { getCMS } from '@/lib/cms';

export const revalidate = 3600; // ISR

export default async function Page() {
  const cms = getCMS();
  const { data } = await cms.fetchAll('stations');

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Step 3: Client-Side Usage (2 min)

```typescript
'use client';

import { useCMS } from '@/hooks/useCMS';

export default function Page() {
  const { data, isLoading } = useCMS('stations');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

**Done! 🎉**

---

## 📝 Common Patterns

### Fetch with Options

```typescript
const { data } = await cms.fetchAll('posts', {
  page: 1,
  pageSize: 20,
  sort: { field: 'name', order: 'asc' },
  filters: { category: 'tech' },
  search: 'nextjs',
});
```

### Fetch Single Item

```typescript
// By ID
const post = await cms.fetchById('posts', '123');

// By slug
const post = await cms.fetchBySlug('posts', 'my-post');
```

### With Error Handling

```typescript
import { withFallback } from '@/lib/cms/error-handler';

const data = await withFallback(() => cms.fetchAll('posts'), {
  getFallback: () => ({ data: [], total: 0 }),
});
```

### Dynamic Route

```typescript
// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const cms = getCMS();
  const { data } = await cms.fetchAll('posts');
  return data.map(post => ({ slug: post.slug }));
}

export default async function PostPage({ params }) {
  const cms = getCMS();
  const post = await cms.fetchBySlug('posts', params.slug);
  return <article>{post.title}</article>;
}
```

### Using Components

```typescript
import { CMSList } from '@/components/cms';

<CMSList
  initialData={data}
  fetchData={(page) => fetch(`/api/cms/posts?page=${page}`).then(r => r.json())}
  renderItem={(post) => <PostCard post={post} />}
  showPagination
  showSearch
/>
```

---

## 🔧 Configuration Options

### Essential

```bash
CMS_PROVIDER=baserow              # or sanity, airtable
CMS_API_URL=https://...           # Your CMS API
CMS_API_TOKEN=your_token          # Auth token
```

### Optional

```bash
CMS_CACHE_TIME=3600               # Cache for 1 hour
CMS_RETRY_ATTEMPTS=3              # Retry 3 times
CMS_TIMEOUT=15000                 # 15 second timeout
REVALIDATION_SECRET=secret        # For revalidation API
```

---

## 🎯 Provider Setup

### Baserow

```bash
CMS_PROVIDER=baserow
CMS_API_URL=https://api.baserow.io
CMS_API_TOKEN=your_baserow_token
```

### Sanity

```bash
CMS_PROVIDER=sanity
CMS_API_URL=https://your-project.api.sanity.io
CMS_PROJECT_ID=your_project_id
CMS_DATASET=production
CMS_API_TOKEN=your_sanity_token
```

### Airtable

```bash
CMS_PROVIDER=airtable
CMS_API_URL=https://api.airtable.com/v0
CMS_API_TOKEN=your_airtable_token
CMS_PROJECT_ID=your_base_id
```

---

## 📡 API Endpoints

### Available Routes

```
GET  /api/cms/[collection]              # List all
GET  /api/cms/[collection]?page=2       # Pagination
GET  /api/cms/[collection]?search=term  # Search
GET  /api/cms/[collection]/[id]         # Get by ID
GET  /api/cms/[collection]/slug/[slug]  # Get by slug
POST /api/revalidate                    # Revalidate cache
```

### Usage Examples

```bash
# Fetch all stations
curl http://localhost:3000/api/cms/stations

# With pagination
curl http://localhost:3000/api/cms/stations?page=2&pageSize=20

# With search
curl http://localhost:3000/api/cms/stations?search=BP

# Revalidate
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your_secret" \
  -H "Content-Type: application/json" \
  -d '{"tags": ["stations"]}'
```

---

## 🎨 React Hooks

### useCMS - Fetch Collection

```typescript
const {
  data, // Array of items
  total, // Total count
  page, // Current page
  hasMore, // Has more pages
  isLoading, // Loading state
  error, // Error object
  refetch, // Refetch function
  loadMore, // Load next page
} = useCMS('posts', {
  pageSize: 20,
  sort: { field: 'date', order: 'desc' },
  search: 'nextjs',
});
```

### useCMSItem - Fetch Single

```typescript
const { data, isLoading, error } = useCMSItem('posts', '123');
```

### useCMSItemBySlug - Fetch by Slug

```typescript
const { data, isLoading, error } = useCMSItemBySlug('posts', 'my-post');
```

---

## 🛡️ Error Handling

### Error Boundary

```typescript
import { CMSErrorBoundary } from '@/components/cms';

<CMSErrorBoundary>
  <YourComponent />
</CMSErrorBoundary>
```

### Try-Catch

```typescript
try {
  const data = await cms.fetchAll('posts');
} catch (error) {
  console.error('Failed to fetch:', error);
}
```

### Fallback

```typescript
import { withFallback } from '@/lib/cms/error-handler';

const data = await withFallback(() => cms.fetchAll('posts'), {
  getFallback: () => [],
  onError: (err) => console.error(err),
});
```

---

## 🚀 Deployment

### 1. Set Environment Variables

In your hosting platform (Vercel, etc.):

```
CMS_PROVIDER=baserow
CMS_API_URL=https://...
CMS_API_TOKEN=your_token
REVALIDATION_SECRET=random_secret
```

### 2. Deploy

```bash
npm run build
npm run start
# or
vercel --prod
```

### 3. Test

```bash
curl https://your-domain.com/api/cms/stations
```

---

## 📚 Documentation

- **Complete Guide**: [README_CMS_INTEGRATION.md](./README_CMS_INTEGRATION.md)
- **Usage Examples**: [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)
- **Configuration**: [ENV_CONFIGURATION.md](./ENV_CONFIGURATION.md)
- **Implementation**: [CMS_INTEGRATION_COMPLETE.md](./CMS_INTEGRATION_COMPLETE.md)

---

## 🎯 Example Pages

Visit these pages to see it in action:

- `/cms-example` - Server-side with ISR
- `/cms-example/client` - Client-side fetching
- `/cms-example/[slug]` - Dynamic routes

---

## 💡 Tips

### Performance

- Use server components for initial load (better SEO)
- Enable ISR with `export const revalidate = 3600`
- Use edge runtime with `export const runtime = 'edge'`

### Caching

- Default cache: 1 hour
- Adjust with `CMS_CACHE_TIME`
- Revalidate via `/api/revalidate`

### Error Handling

- Always wrap in ErrorBoundary
- Use fallback strategies
- Log errors for debugging

### TypeScript

```typescript
interface Post extends CMSContent {
  title: string;
  content: string;
}

const posts = await cms.fetchAll<Post>('posts');
// Now `posts` is fully typed!
```

---

## 🆘 Troubleshooting

### Cache not working?

```bash
# Check settings
CMS_CACHE_ENABLED=true
CMS_CACHE_TIME=3600
```

### Stale data?

```bash
# Force refresh
curl -X POST /api/revalidate \
  -H "Authorization: Bearer secret" \
  -d '{"tags": ["posts"]}'
```

### TypeScript errors?

```typescript
// Define your types
interface MyType extends CMSContent {
  // your fields
}

// Use with type parameter
const data = await cms.fetchAll<MyType>('collection');
```

---

## ✅ Checklist

Before going live:

- [ ] Environment variables set
- [ ] API credentials secured
- [ ] Cache settings configured
- [ ] Error logging enabled
- [ ] Test API endpoints
- [ ] Verify ISR working
- [ ] Check error handling
- [ ] Test revalidation

---

**Need Help?** Check the complete documentation in [README_CMS_INTEGRATION.md](./README_CMS_INTEGRATION.md)

**Version**: 1.0.0  
**Status**: ✅ Production Ready
