# Production-Ready Next.js Architecture Guide

## 📁 Folder Structure Philosophy

This project follows a **feature-first, scalable architecture** optimized for Next.js 15 App Router with TypeScript excellence.

```
PPNM/
├── src/
│   ├── app/                      # Next.js App Router (Pages & Layouts)
│   │   ├── (marketing)/         # Route groups for layout sharing
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   └── layout.tsx       # Marketing layout wrapper
│   │   ├── (dashboard)/         # Protected/authenticated routes
│   │   ├── api/                 # API routes
│   │   │   ├── stations/
│   │   │   └── [...]/
│   │   ├── layout.tsx           # Root layout (metadata, providers)
│   │   ├── page.tsx             # Home page
│   │   ├── error.tsx            # Error boundary
│   │   ├── loading.tsx          # Loading UI
│   │   ├── not-found.tsx        # 404 page
│   │   └── template.tsx         # Re-render on route change
│   │
│   ├── components/              # Reusable UI Components
│   │   ├── atoms/              # Smallest building blocks
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── index.ts    # Barrel export
│   │   │   ├── Input/
│   │   │   └── index.ts        # Barrel export for all atoms
│   │   │
│   │   ├── molecules/          # Combinations of atoms
│   │   │   ├── SearchBar/
│   │   │   ├── Card/
│   │   │   └── index.ts
│   │   │
│   │   ├── organisms/          # Complex UI sections
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── StationCard/
│   │   │   └── index.ts
│   │   │
│   │   ├── templates/          # Page-level layouts
│   │   │   ├── MainLayout/
│   │   │   └── index.ts
│   │   │
│   │   ├── features/           # Feature-specific components
│   │   │   ├── stations/
│   │   │   │   ├── StationList/
│   │   │   │   ├── StationDetail/
│   │   │   │   └── index.ts
│   │   │   └── map/
│   │   │
│   │   └── index.ts            # Central barrel export
│   │
│   ├── lib/                     # Business Logic & External Services
│   │   ├── api/                # API client functions
│   │   │   ├── stations.ts
│   │   │   ├── client.ts       # Axios/fetch wrapper
│   │   │   └── index.ts
│   │   │
│   │   ├── services/           # Business logic services
│   │   │   ├── StationService.ts
│   │   │   ├── GeolocationService.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── repositories/       # Data access layer
│   │   │   ├── StationRepository.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/              # Pure utility functions
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── helpers.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useStations.ts
│   │   ├── useGeolocation.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── index.ts            # Barrel export
│   │
│   ├── types/                   # TypeScript Type Definitions
│   │   ├── models/             # Domain models
│   │   │   ├── Station.ts
│   │   │   ├── User.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── api/                # API response types
│   │   │   ├── responses.ts
│   │   │   ├── requests.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── common.ts           # Shared types
│   │   └── index.ts            # Barrel export
│   │
│   ├── styles/                  # Global Styles & Design Tokens
│   │   ├── globals.css         # Global CSS imports
│   │   ├── design-tokens.css   # CSS variables
│   │   ├── tailwind-base.css   # Tailwind customizations
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   │
│   ├── config/                  # Configuration Files
│   │   ├── constants.ts        # App constants
│   │   ├── environment.ts      # Environment variables
│   │   ├── routes.ts           # Route definitions
│   │   └── index.ts
│   │
│   ├── context/                 # React Context Providers
│   │   ├── ThemeContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── index.ts
│   │
│   ├── middleware.ts            # Next.js middleware
│   │
│   └── design-system/           # Design System Tokens
│       ├── tokens/
│       │   ├── colors.ts
│       │   ├── typography.ts
│       │   ├── spacing.ts
│       │   └── index.ts
│       └── utils/
│           └── cn.ts           # className utilities
│
├── public/                      # Static Assets
│   ├── images/
│   ├── fonts/
│   ├── icons/
│   └── manifest.json
│
├── tests/                       # Test Files (mirrors src structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                        # Documentation
│   ├── architecture/
│   ├── components/
│   └── api/
│
├── scripts/                     # Build & Utility Scripts
│   ├── generate-sitemap.js
│   └── cleanup.js
│
├── .cursor/                     # Cursor AI rules
├── .github/                     # GitHub Actions & templates
├── .husky/                      # Git hooks
│
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── README.md                   # Project documentation
```

---

## 🎯 Key Architectural Principles

### 1. **Separation of Concerns**

- **Components**: Pure UI, minimal logic
- **Hooks**: Reusable stateful logic
- **Lib**: Business logic, API calls, utilities
- **Types**: Centralized type definitions

### 2. **Atomic Design Pattern**

```
Atoms → Molecules → Organisms → Templates → Pages
```

- **Atoms**: Button, Input, Label
- **Molecules**: SearchBar, Card
- **Organisms**: Header, Footer, StationList
- **Templates**: MainLayout, DashboardLayout
- **Pages**: In `src/app/`

### 3. **Import Organization**

```typescript
// ✅ GOOD: Consistent import order
// 1. External dependencies
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Internal modules (sorted by scope)
import { Button } from '@/components/atoms';
import { StationCard } from '@/components/organisms';
import { useStations } from '@/hooks';
import { formatDistance } from '@/lib/utils';
import type { Station } from '@/types';

// 3. Styles
import styles from './MyComponent.module.css';

// 4. Types (if not using type imports above)
import type { ComponentProps } from './types';
```

### 4. **File Naming Conventions**

- **Components**: PascalCase → `StationCard.tsx`
- **Utilities**: camelCase → `formatDistance.ts`
- **Types**: PascalCase → `Station.ts`
- **Hooks**: camelCase with 'use' prefix → `useStations.ts`
- **Constants**: UPPER_SNAKE_CASE → `API_ENDPOINTS.ts`

### 5. **Component Structure Template**

````typescript
/**
 * ComponentName - Brief description
 *
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */

// 1. Imports
import React from 'react';
import type { ComponentNameProps } from './types';

// 2. Type definitions (if small, otherwise in separate file)
export interface ComponentNameProps {
  /** Prop description */
  prop: string;
}

// 3. Component implementation
export function ComponentName({ prop }: ComponentNameProps) {
  // 3.1. Hooks
  const [state, setState] = React.useState();

  // 3.2. Derived values
  const computed = React.useMemo(() => {}, []);

  // 3.3. Event handlers
  const handleClick = () => {};

  // 3.4. Effects
  React.useEffect(() => {}, []);

  // 3.5. Early returns
  if (!prop) return null;

  // 3.6. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}

// 4. Default export (if needed)
export default ComponentName;
````

---

## 🎨 Design System Integration

### Color Tokens

```typescript
// src/design-system/tokens/colors.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... full scale
    900: '#1e3a8a',
  },
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
};
```

### Typography Tokens

```typescript
// src/design-system/tokens/typography.ts
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    // ... full scale
  },
};
```

---

## 🔧 Configuration Best Practices

### Environment Variables

```typescript
// src/config/environment.ts
/**
 * Centralized environment variable access with validation
 */
export const env = {
  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000',

  // Feature Flags
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',

  // Secrets (server-side only)
  databaseUrl: process.env.DATABASE_URL,
} as const;

// Validate required variables
function validateEnv() {
  const required = ['NEXT_PUBLIC_API_BASE_URL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}
```

### Route Configuration

```typescript
// src/config/routes.ts
/**
 * Centralized route definitions for type-safe navigation
 */
export const routes = {
  home: '/',
  about: '/about',
  stations: {
    list: '/stations',
    detail: (id: string) => `/stations/${id}`,
  },
  api: {
    stations: '/api/stations',
    health: '/api/health',
  },
} as const;
```

---

## 🚀 Performance Optimizations

### 1. **Code Splitting**

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/organisms/MapView'), {
  loading: () => <MapSkeleton />,
  ssr: false, // Disable SSR for client-only components
});
```

### 2. **Image Optimization**

```typescript
import Image from 'next/image';

<Image
  src="/images/station.jpg"
  alt="Station"
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

### 3. **Font Optimization**

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
```

---

## 📦 Barrel Exports Pattern

### Component Barrel

```typescript
// src/components/atoms/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Label } from './Label';
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';
```

### Usage

```typescript
// ✅ GOOD: Clean imports
import { Button, Input, Label } from '@/components/atoms';

// ❌ BAD: Deep imports
import { Button } from '@/components/atoms/Button/Button';
```

---

## 🧪 Testing Strategy

### Component Tests

```typescript
// src/components/atoms/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## 📚 Documentation Standards

### Component Documentation

````typescript
/**
 * StationCard displays information about a petrol station
 *
 * @component
 * @example
 * ```tsx
 * <StationCard
 *   station={stationData}
 *   onSelect={handleSelect}
 * />
 * ```
 */
````

### Function Documentation

````typescript
/**
 * Formats distance in meters to human-readable string
 *
 * @param meters - Distance in meters
 * @returns Formatted distance string (e.g., "1.2 km", "500 m")
 *
 * @example
 * ```typescript
 * formatDistance(1234); // "1.2 km"
 * formatDistance(500);  // "500 m"
 * ```
 */
export function formatDistance(meters: number): string {
  // Implementation
}
````

---

## 🎭 Common Patterns

### Custom Hook Pattern

```typescript
// src/hooks/useStations.ts
import { useQuery } from '@tanstack/react-query';
import { stationsApi } from '@/lib/api';
import type { Station } from '@/types';

export function useStations() {
  const query = useQuery({
    queryKey: ['stations'],
    queryFn: stationsApi.getAll,
  });

  return {
    stations: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

### Context Provider Pattern

```typescript
// src/context/ThemeContext.tsx
import { createContext, useContext, useState } from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---

## 🔒 Type Safety

### Strict TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Type Guards

```typescript
// src/lib/utils/typeGuards.ts
export function isStation(value: unknown): value is Station {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}
```

---

## 🎯 Quick Start Checklist

- [ ] Review folder structure
- [ ] Understand atomic design pattern
- [ ] Check import organization rules
- [ ] Review component template
- [ ] Understand barrel exports
- [ ] Check TypeScript configurations
- [ ] Review performance patterns
- [ ] Understand testing strategy

---

## 📖 Additional Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [TypeScript Best Practices](https://typescript-eslint.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query)

---

**Last Updated**: November 2025  
**Architecture Version**: 2.0  
**Maintainer**: Development Team
