# Styling Architecture Examples

Complete examples demonstrating the advanced styling system.

## Table of Contents

1. [Button Examples](#button-examples)
2. [Card Examples](#card-examples)
3. [Form Examples](#form-examples)
4. [Layout Examples](#layout-examples)
5. [Animation Examples](#animation-examples)
6. [Theme Integration](#theme-integration)
7. [Real Component Refactoring](#real-component-refactoring)

## Button Examples

### Basic Button Component

```tsx
// src/components/Button/Button.tsx
import { forwardRef } from 'react';
import { cn, patterns } from '@/styles/system/css-in-js';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'btn',
          `btn-${variant}`,
          `btn-${size}`,
          loading && 'opacity-75 cursor-wait',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {icon && <span>{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Usage
export function ButtonExamples() {
  return (
    <div className="space-y-4">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary" size="lg">Large Secondary</Button>
      <Button variant="outline" size="sm">Small Outline</Button>
      <Button variant="gradient" loading>Loading...</Button>
      <Button variant="ghost" disabled>Disabled</Button>
    </div>
  );
}
```

### Using Pattern Utilities

```tsx
import { patterns } from '@/styles/system/css-in-js';

export function DynamicButton({ variant, size, ...props }) {
  return (
    <button
      className={patterns.button(variant, size)}
      {...props}
    />
  );
}
```

## Card Examples

### Enhanced Card Component

```tsx
// src/components/Card/Card.tsx
import { forwardRef } from 'react';
import { cn } from '@/styles/system/css-in-js';
import { animations } from '@/styles/system/animations';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'elevated' | 'bordered' | 'glass';
  animate?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', animate = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variant === 'hover' ? 'card-hover' : `card-${variant}`,
          animate && animations.safe('animate-scale-in'),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 border-b border-gray-200 dark:border-gray-700', className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 border-t border-gray-200 dark:border-gray-700', className)} {...props} />
);

// Usage
export function CardExample() {
  return (
    <Card variant="hover" animate>
      <CardHeader>
        <h3 className={patterns.text.h3}>Card Title</h3>
      </CardHeader>
      <CardContent>
        <p className={patterns.text.body}>Card content goes here...</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Action</Button>
      </CardFooter>
    </Card>
  );
}
```

### Station Card with New System

```tsx
// src/components/StationCard/StationCard.tsx
import { cn, patterns } from '@/styles/system/css-in-js';
import { animations } from '@/styles/system/animations';

interface StationCardProps {
  station: {
    name: string;
    address: string;
    distance: number;
    prices: { type: string; price: number }[];
  };
}

export function StationCard({ station }: StationCardProps) {
  return (
    <div className={cn(
      'card-hover',
      animations.safe('animate-fade-in'),
      'print-avoid-break'
    )}>
      {/* Header */}
      <div className={patterns.flex.between + ' p-6 border-b border-gray-200 dark:border-gray-700'}>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {station.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {station.address}
          </p>
        </div>
        <span className="badge badge-primary">
          {station.distance.toFixed(1)} km
        </span>
      </div>

      {/* Prices */}
      <div className="p-6 space-y-3">
        {station.prices.map((price) => (
          <div key={price.type} className={patterns.flex.between}>
            <span className="text-gray-700 dark:text-gray-300">
              {price.type}
            </span>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ${price.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 print-hidden">
        <Button variant="primary" className="w-full">
          View Details
        </Button>
      </div>
    </div>
  );
}
```

## Form Examples

### Complete Form with Validation

```tsx
import { useState } from 'react';
import { cn } from '@/styles/system/css-in-js';

export function SearchForm() {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      setError('Location is required');
      return;
    }
    // Handle search
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Location
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setError('');
          }}
          className={cn(
            'input',
            error && 'input-error'
          )}
          placeholder="Enter your location"
          aria-invalid={!!error}
          aria-describedby={error ? 'location-error' : undefined}
        />
        {error && (
          <p id="location-error" className="mt-2 text-sm text-error-600 dark:text-error-400">
            {error}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Search Stations
      </Button>
    </form>
  );
}
```

## Layout Examples

### Responsive Grid Layout

```tsx
import { patterns } from '@/styles/system/css-in-js';

export function StationGrid({ stations }) {
  return (
    <div className={patterns.container()}>
      <h1 className={patterns.text.h1}>Nearby Stations</h1>

      <div className={patterns.grid(3, 'lg')}>
        {stations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
}

// Alternative with custom grid
export function CustomGrid({ items }) {
  return (
    <div className="grid-responsive-cards">
      {items.map((item) => (
        <div key={item.id}>{item.content}</div>
      ))}
    </div>
  );
}
```

### Flex Layout Patterns

```tsx
export function Header() {
  return (
    <header className="sticky top-0 z-sticky bg-white dark:bg-gray-900 shadow-sm print-hidden">
      <div className={patterns.container()}>
        <div className={patterns.flex.between + ' py-4'}>
          <Logo />
          <Navigation />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className={patterns.flex.colCenter + ' min-h-screen py-20'}>
      <h1 className={patterns.text.h1 + ' text-center text-balance'}>
        Find the Best Fuel Prices Near You
      </h1>
      <p className={patterns.text.body + ' text-center max-w-2xl mt-4'}>
        Compare prices from thousands of stations
      </p>
      <SearchForm />
    </section>
  );
}
```

## Animation Examples

### Scroll Animations

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { createIntersectionAnimation } from '@/styles/system/animations';

export function AnimatedSection({ children }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const cleanup = createIntersectionAnimation(
      ref.current,
      'animate-slide-in',
      { threshold: 0.2 }
    );

    return cleanup;
  }, []);

  return (
    <div ref={ref} className="opacity-0">
      {children}
    </div>
  );
}
```

### Staggered List

```tsx
import { createStagger } from '@/styles/system/animations';

export function AnimatedList({ items }) {
  const staggerClasses = createStagger(items.length, 100, 'animate-fade-in');

  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={item.id} className={staggerClasses[index]}>
          {item.content}
        </li>
      ))}
    </ul>
  );
}
```

### Loading States

```tsx
export function LoadingCard() {
  return (
    <div className="card">
      <div className="space-y-4 p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded shimmer" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 shimmer" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 shimmer" />
      </div>
    </div>
  );
}
```

## Theme Integration

### Theme Toggle Component

```tsx
'use client';

import { useTheme } from '@/styles/system/theme';
import { animations } from '@/styles/system/animations';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'btn btn-ghost',
        animations.safe('transition-transform hover:scale-110')
      )}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}
```

### Theme-aware Components

```tsx
export function ThemedCard({ children }) {
  return (
    <div className="
      card
      bg-white dark:bg-gray-800
      text-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
      {children}
    </div>
  );
}

export function ThemedButton() {
  return (
    <button className="
      btn
      bg-primary-600 dark:bg-primary-500
      hover:bg-primary-700 dark:hover:bg-primary-600
      text-white
    ">
      Themed Button
    </button>
  );
}
```

## Real Component Refactoring

### Before: Old Station Card

```tsx
// Old implementation
import './StationCard.css';

export function StationCard({ station }) {
  return (
    <div className="station-card">
      <div className="station-header">
        <h3 className="station-name">{station.name}</h3>
        <span className="station-distance">{station.distance} km</span>
      </div>
      <div className="station-prices">
        {station.prices.map((price) => (
          <div key={price.type} className="price-row">
            <span>{price.type}</span>
            <span className="price">${price.price}</span>
          </div>
        ))}
      </div>
      <button className="view-details-btn">View Details</button>
    </div>
  );
}

// StationCard.css (OLD)
.station-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s;
}

.station-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.station-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

/* ... more CSS */
```

### After: Refactored with New System

```tsx
// New implementation - NO CSS FILE NEEDED!
import { cn, patterns } from '@/styles/system/css-in-js';
import { animations } from '@/styles/system/animations';

export function StationCard({ station }) {
  return (
    <div className={cn(
      'card-hover',
      animations.safe('animate-fade-in'),
      'print-avoid-break'
    )}>
      <div className={patterns.flex.between + ' p-6 border-b border-gray-200 dark:border-gray-700'}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {station.name}
        </h3>
        <span className="badge badge-primary">
          {station.distance.toFixed(1)} km
        </span>
      </div>

      <div className="p-6 space-y-3">
        {station.prices.map((price) => (
          <div key={price.type} className={patterns.flex.between}>
            <span className="text-gray-700 dark:text-gray-300">
              {price.type}
            </span>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ${price.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-gray-700 print-hidden">
        <button className="btn btn-primary w-full">
          View Details
        </button>
      </div>
    </div>
  );
}
```

### Benefits of Refactoring

✅ **No separate CSS file needed**
✅ **Dark mode support automatically**
✅ **Print styles included**
✅ **Animations with reduced motion support**
✅ **Type-safe and auto-complete**
✅ **Consistent with design system**
✅ **Better performance (no CSS parsing)**
✅ **Smaller bundle size**

## Performance Optimization

### Lazy Loading with Animations

```tsx
import dynamic from 'next/dynamic';
import { animations } from '@/styles/system/animations';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton />,
});

export function OptimizedPage() {
  return (
    <div className={animations.safe('animate-fade-in')}>
      <HeavyComponent />
    </div>
  );
}
```

### Memoized Styles

```tsx
import { useMemo } from 'react';
import { patterns } from '@/styles/system/css-in-js';

export function MemoizedCard({ variant, children }) {
  const cardClass = useMemo(
    () => patterns.card(variant),
    [variant]
  );

  return <div className={cardClass}>{children}</div>;
}
```

---

For more information, see the [Styling Architecture Guide](./STYLING_ARCHITECTURE_GUIDE.md).
