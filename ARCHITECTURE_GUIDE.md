# 🏗️ Next.js Architecture Guide

## Overview

This project follows **architectural best practices** for a production-ready Next.js application using the App Router with React 19, TypeScript, and Tailwind CSS.

---

## 📁 Directory Structure

```
src/
├── app/                        # Next.js App Router (Pages & Routing)
│   ├── (routes)/              # Route groups for organization
│   ├── api/                   # API routes (server-only)
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx              # Homepage
│   ├── loading.tsx           # Loading UI
│   ├── error.tsx             # Error boundary
│   └── not-found.tsx         # 404 page
│
├── components/                 # React Components (Atomic Design)
│   ├── atoms/                 # Smallest components (Button, Input)
│   ├── molecules/             # Component groups (Form, Card)
│   ├── organisms/             # Complex components (Header, Footer)
│   ├── templates/              # Page layouts
│   ├── ui/                    # Reusable UI components
│   └── index.ts               # Public exports
│
├── lib/                       # Core libraries & utilities
│   ├── api/                   # API client configuration
│   ├── baserow/              # Baserow integration
│   ├── seo/                   # SEO utilities
│   └── utils.ts               # Shared utilities
│
├── hooks/                     # Custom React Hooks
│   ├── useResponsive.ts      # Responsive breakpoints
│   ├── useGeolocation.ts     # Location detection
│   └── index.ts              # Public exports
│
├── types/                     # TypeScript definitions
│   ├── station.ts            # Station data types
│   ├── api.ts                # API response types
│   ├── component.ts          # Component prop types
│   └── index.ts              # Re-exports
│
├── styles/                    # Global styles & design system
│   ├── globals.css            # Tailwind imports
│   ├── design-system.css      # Design tokens
│   ├── theme-vars.css        # CSS variables
│   └── plugins/               # Tailwind plugins
│
├── utils/                     # Utility functions
│   ├── responsive-grid.ts     # Grid utilities
│   ├── animations.ts          # Framer Motion configs
│   └── format.ts              # Formatting helpers
│
├── config/                    # Application configuration
│   ├── constants.ts          # App constants
│   └── environment.ts        # Env config
│
├── services/                  # External service integrations
│   ├── BaserowService.ts     # Database service
│   └── GooglePlacesService.ts # Places API
│
└── middleware.ts              # Next.js middleware
```

---

## 🎯 Architectural Principles

### 1. **Component Organization (Atomic Design)**

```typescript
// atoms/Button.tsx - Smallest, reusable components
export const Button = ({ variant, children }) => {
  return <button className={variants[variant]}>{children}</button>;
};

// molecules/Card.tsx - Group of atoms
export const Card = ({ title, content, actions }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{content}</p>
      {actions}
    </div>
  );
};

// organisms/StationCard.tsx - Complex, feature-specific
export const StationCard = ({ station }) => {
  return (
    <Card>
      <StationHeader station={station} />
      <StationBody station={station} />
      <StationActions station={station} />
    </Card>
  );
};
```

### 2. **Import Organization**

```typescript
// 1. External dependencies
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// 2. Internal components
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';

// 3. Utilities & hooks
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';

// 4. Types
import type { Station } from '@/types/station';

// 5. Constants
import { API_URL } from '@/config/constants';
```

### 3. **Type Safety**

```typescript
// types/station.ts
export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  prices: FuelPrices;
}

export interface FuelPrices {
  unleaded: number | null;
  premium: number | null;
  diesel: number | null;
}

// Usage with strict typing
export const StationCard = ({ station }: { station: Station }) => {
  // TypeScript ensures station is properly typed
};
```

### 4. **Responsive Design Strategy**

```typescript
// utils/responsive-grid.ts
export const buildGridClasses = ({ columns, gap, className }) => {
  return cn(
    'grid',
    buildGridColumnClasses(columns),  // Static Tailwind classes
    getGapClasses(gap),              // Responsive gaps
    className
  );
};

// Usage
<EnhancedCardGrid
  columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
  gap="md"
/>
```

---

## 🔧 Core Configuration

### next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // TypeScript & ESLint
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  // Performance
  compress: true,
  swcMinify: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },

  // Module optimization
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
};
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

---

## 🎨 Design System

### Design Tokens

```typescript
// styles/design-system.css
:root {
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Colors */
  --color-primary: #2563eb;
  --color-secondary: #8b5cf6;

  /* Typography */
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
      },
    },
  },
};
```

---

## 📝 Code Quality Standards

### 1. **Component Naming**

```typescript
// ✅ Good
export const StationCard = ({ station }: StationCardProps) => {};
export const NavigationBar = () => {};
export const PriceDisplay = ({ price }) => {};

// ❌ Bad
export const Card = ({ station }) => {}; // Too generic
export const nav = () => {}; // Not PascalCase
```

### 2. **File Naming**

```
✅ Good:
components/StationCard.tsx
hooks/useGeolocation.ts
utils/responsive-grid.ts

❌ Bad:
components/stationCard.tsx (not PascalCase)
hooks/getLocation.js (missing component prefix)
utils/responsive grid.ts (space not allowed)
```

### 3. **Type Definitions**

```typescript
// ✅ Good - Exported interfaces in types/
export interface StationCardProps {
  station: Station;
  variant?: 'compact' | 'detailed';
  onSelect?: (station: Station) => void;
}

// ❌ Bad - Inline types
export const StationCard = ({ station }: { station: any }) => {};
```

---

## 🚀 Best Practices

### 1. **Server Components First**

```typescript
// app/stations/[id]/page.tsx (Server Component)
export default async function StationPage({ params }) {
  // Fetch data on server
  const station = await getStation(params.id);

  return <StationDetails station={station} />;
}
```

### 2. **Client Components When Needed**

```typescript
// components/InteractiveStationCard.tsx (Client Component)
'use client';

import { useState } from 'react';

export const InteractiveStationCard = ({ station }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div onClick={() => setExpanded(!expanded)}>
      {/* Interactive content */}
    </div>
  );
};
```

### 3. **Error Boundaries**

```typescript
// app/error.tsx
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 4. **Loading States**

```typescript
// app/stations/[id]/loading.tsx
export default function Loading() {
  return <StationCardSkeleton />;
}
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Integration Tests

```typescript
// app/directory/page.test.tsx
import { render } from '@testing-library/react';
import { DirectoryPage } from './page';

test('displays station directory', async () => {
  const { findAllByTestId } = render(<DirectoryPage />);
  const stations = await findAllByTestId('station-card');
  expect(stations.length).toBeGreaterThan(0);
});
```

---

## 📊 Performance Optimization

### 1. **Code Splitting**

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

### 2. **Image Optimization**

```typescript
import Image from 'next/image';

<Image
  src="/station.jpg"
  alt="Station"
  width={400}
  height={300}
  priority  // Above-the-fold images
/>
```

### 3. **Bundle Analysis**

```bash
npm run analyze
```

---

## 🔐 Security

### 1. **Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_KEY=keep-this-secret
```

### 2. **Middleware**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Last Updated**: December 2024
**Maintained by**: Development Team
