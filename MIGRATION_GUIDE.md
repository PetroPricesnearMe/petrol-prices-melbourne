# Migration Guide: Pages Router → App Router

This guide helps you migrate from the old Pages Router structure to the new Next.js 15 App Router with TypeScript.

## 🔄 Overview

### What's Changing?
- **Pages Router** → **App Router**
- **JavaScript** → **TypeScript**
- **Mixed styling** → **Tailwind CSS**
- **Ad-hoc components** → **Atomic Design Pattern**
- **Props drilling** → **React Query + Context**
- **Implicit types** → **Strict TypeScript**

## 📋 Migration Checklist

- [ ] Install new dependencies
- [ ] Set up environment variables
- [ ] Migrate pages to App Router
- [ ] Convert components to TypeScript
- [ ] Implement atomic design structure
- [ ] Migrate API routes
- [ ] Update data fetching
- [ ] Test all functionality
- [ ] Update deployment config

## 🛠️ Step-by-Step Migration

### Step 1: Install Dependencies

```bash
# Remove old package-lock.json
rm package-lock.json

# Install new dependencies
npm install
```

### Step 2: Environment Variables

**Old (.env)**
```env
REACT_APP_API_URL=...
```

**New (.env)**
```env
NEXT_PUBLIC_API_URL=...
```

Action: Update all `REACT_APP_*` to `NEXT_PUBLIC_*`

### Step 3: Pages Migration

#### Old Structure (pages/)
```
pages/
├── index.js
├── about.js
├── directory.js
└── api/
    └── stations.js
```

#### New Structure (src/app/)
```
src/app/
├── page.tsx          # index.js → page.tsx
├── about/
│   └── page.tsx     # about.js → about/page.tsx
├── directory/
│   └── page.tsx     # directory.js → directory/page.tsx
└── api/
    └── stations/
        └── route.ts  # stations.js → stations/route.ts
```

#### Migration Example

**Old (pages/index.js)**
```javascript
import React from 'react';

export default function Home() {
  return <div>Home Page</div>;
}
```

**New (src/app/page.tsx)**
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

export default function HomePage() {
  return <div>Home Page</div>;
}
```

### Step 4: Component Migration

#### Old Component (src/components/StationCard.js)
```javascript
import React from 'react';
import './StationCard.css';

export default function StationCard({ station }) {
  return (
    <div className="station-card">
      <h3>{station.name}</h3>
      <p>{station.address}</p>
    </div>
  );
}
```

#### New Component (src/components/molecules/StationCard/StationCard.tsx)
```typescript
'use client';

import type { PetrolStation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';

export interface StationCardProps {
  station: PetrolStation;
  onClick?: () => void;
}

export function StationCard({ station, onClick }: StationCardProps) {
  return (
    <Card hover onClick={onClick}>
      <CardHeader>
        <CardTitle>{station.stationName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{station.address}</p>
      </CardContent>
    </Card>
  );
}
```

### Step 5: API Route Migration

#### Old (pages/api/stations.js)
```javascript
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ data: [] });
  }
}
```

#### New (src/app/api/stations/route.ts)
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: [] }, { status: 200 });
}
```

### Step 6: Data Fetching Migration

#### Old (Client-side with useEffect)
```javascript
import { useState, useEffect } from 'react';

function Stations() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch('/api/stations')
      .then(res => res.json())
      .then(data => setStations(data));
  }, []);

  return <div>{/* render stations */}</div>;
}
```

#### New (React Query)
```typescript
'use client';

import { useStations } from '@/hooks';

function Stations() {
  const { data: stations, isLoading, error } = useStations();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return <div>{/* render stations */}</div>;
}
```

### Step 7: Styling Migration

#### Old (CSS Modules)
```css
/* StationCard.module.css */
.card {
  padding: 1rem;
  border: 1px solid #ccc;
}
```

```javascript
import styles from './StationCard.module.css';

<div className={styles.card}>
```

#### New (Tailwind CSS)
```typescript
<div className="rounded-lg border border-gray-300 p-4">
```

### Step 8: Type Definitions

Create types for all your data structures:

```typescript
// src/types/index.ts
export interface PetrolStation {
  id: number;
  stationName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  fuelPrices?: FuelPrice[];
}

export interface FuelPrice {
  id: number;
  fuelType: FuelType;
  pricePerLiter: number;
  lastUpdated: string;
}
```

### Step 9: Configuration Updates

#### Update next.config.js → next.config.ts

**Old**
```javascript
module.exports = {
  reactStrictMode: true,
};
```

**New**
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ... additional config
};

export default nextConfig;
```

## 🔑 Key Changes

### 1. File Naming
| Old | New |
|-----|-----|
| `index.js` | `page.tsx` |
| `_app.js` | `layout.tsx` |
| `_document.js` | `layout.tsx` |
| `api/endpoint.js` | `api/endpoint/route.ts` |

### 2. Imports
| Old | New |
|-----|-----|
| `../components/Button` | `@/components/atoms/Button` |
| `../../utils/format` | `@/utils/formatters` |
| Relative paths | Absolute with @ alias |

### 3. Data Fetching
| Old | New |
|-----|-----|
| `useEffect + fetch` | React Query hooks |
| `getServerSideProps` | Server Components |
| `getStaticProps` | `generateStaticParams` |

### 4. Styling
| Old | New |
|-----|-----|
| CSS Modules | Tailwind CSS |
| `className={styles.x}` | `className="..."` |
| Inline styles | Utility classes |

## 🚨 Breaking Changes

### 1. 'use client' Directive
Components using hooks must have `'use client'` at the top:

```typescript
'use client';

import { useState } from 'react';

export function MyComponent() {
  const [state, setState] = useState();
  // ...
}
```

### 2. Image Component
```typescript
// Old
import Image from 'next/image';
<Image src="/logo.png" width={100} height={100} />

// New (same syntax but stricter types)
import Image from 'next/image';
<Image src="/logo.png" width={100} height={100} alt="Logo" />
```

### 3. Metadata
```typescript
// Old (pages/_app.js)
<Head>
  <title>My App</title>
</Head>

// New (app/layout.tsx)
export const metadata: Metadata = {
  title: 'My App',
};
```

### 4. Error Handling
```typescript
// Old
// Custom _error.js page

// New
// error.tsx in each route segment
'use client';

export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return <div>Error: {error.message}</div>;
}
```

## 🧪 Testing After Migration

### Checklist
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] API routes respond
- [ ] Data fetching works
- [ ] Styling looks correct
- [ ] Images display properly
- [ ] Forms submit correctly
- [ ] Authentication works
- [ ] Mobile responsive
- [ ] No console errors

### Testing Commands
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build

# Run tests
npm run test
```

## 🔧 Troubleshooting

### Issue: "Module not found"
**Solution**: Check import paths. Use `@/` prefix for absolute imports.

### Issue: "Component must be marked with 'use client'"
**Solution**: Add `'use client'` at the top of files using hooks.

### Issue: "Type error in component"
**Solution**: Add proper TypeScript types to props.

### Issue: "Hydration mismatch"
**Solution**: Ensure server and client render the same content initially.

### Issue: "Environment variable undefined"
**Solution**: Use `NEXT_PUBLIC_` prefix for client-side variables.

## 📚 Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

## 💡 Best Practices

1. **Migrate incrementally** - Don't try to migrate everything at once
2. **Test frequently** - Test after each major change
3. **Keep old code** - Use git branches or keep backup
4. **Update dependencies** - Make sure all packages are compatible
5. **Read the docs** - Consult official documentation when stuck

## 🎯 Next Steps

After migration:
1. Set up CI/CD pipeline
2. Configure monitoring and analytics
3. Optimize performance
4. Implement error tracking
5. Set up automated testing

---

Need help? Create an issue or reach out to the development team!
