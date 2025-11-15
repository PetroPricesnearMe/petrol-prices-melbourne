# Quick Start - Architecture Guide

## 🚀 Instant Reference

### Import Patterns

```typescript
// ✅ Design System
import { colors, spacing, typography, cn } from '@/design-system';

// ✅ Components
import { Button, Card, CardHeader, CardTitle } from '@/components';

// ✅ Utilities
import { formatPrice, formatDistance, isValidEmail, debounce } from '@/lib';

// ✅ Hooks
import { useStations, useGeolocation, useMounted } from '@/hooks';

// ✅ Types
import type { Station, ApiResponse, QueryParams } from '@/types';

// ✅ Config
import { siteConfig, env, generateMetadata } from '@/config';
```

---

## 🎨 Design System Quick Use

### Colors

```typescript
// Use directly in Tailwind classes
<div className="bg-primary-600 text-white">

// Or import from tokens
import { colors } from '@/design-system';
const primary = colors.primary[600];
```

### Spacing

```typescript
// Tailwind classes
<div className="p-4 mt-8 gap-2">

// Or from tokens
import { spacing } from '@/design-system';
const padding = spacing[4]; // 16px
```

### Merge Classes

```typescript
import { cn } from '@/lib';

<div className={cn(
  'btn',
  isActive && 'btn-active',
  'hover:bg-blue-500'
)}>
```

---

## 🧱 Component Creation

### Step 1: Create Component File

```typescript
// src/components/atoms/MyButton/MyButton.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

const buttonVariants = cva('base-classes', {
  variants: {
    variant: { primary: 'primary-classes' },
    size: { md: 'md-classes' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

interface MyButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export const MyButton = React.forwardRef<HTMLButtonElement, MyButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MyButton.displayName = 'MyButton';
```

### Step 2: Create Index File

```typescript
// src/components/atoms/MyButton/index.ts
export { MyButton } from './MyButton';
export type { MyButtonProps } from './MyButton';
```

### Step 3: Export from Parent

```typescript
// src/components/atoms/index.ts
export * from './MyButton';
```

---

## 🔧 Utility Functions

### Formatters

```typescript
import {
  formatPrice, // formatPrice(1.85) → "$1.85"
  formatDistance, // formatDistance(1234) → "1.2 km"
  formatDate, // formatDate(new Date()) → "Nov 11, 2025"
  formatRelativeTime, // formatRelativeTime(date) → "2 hours ago"
} from '@/lib';
```

### Validators

```typescript
import {
  isValidEmail, // isValidEmail('test@example.com') → true
  isValidPhone, // isValidPhone('0412345678') → true
  isValidUrl, // isValidUrl('https://example.com') → true
  isEmpty, // isEmpty('  ') → true
} from '@/lib';
```

### Helpers

```typescript
import {
  debounce, // debounce(fn, 300)
  throttle, // throttle(fn, 100)
  deepClone, // deepClone(obj)
  groupBy, // groupBy(array, 'key')
  unique, // unique([1, 1, 2]) → [1, 2]
  chunk, // chunk([1,2,3,4], 2) → [[1,2], [3,4]]
} from '@/lib';
```

---

## 🪝 Custom Hooks

### Data Fetching

```typescript
import { useStations } from '@/hooks';

const { stations, isLoading, error } = useStations();
```

### Geolocation

```typescript
import { useGeolocation } from '@/hooks';

const { location, error } = useGeolocation();
```

### Performance

```typescript
import { usePerformance } from '@/hooks';

usePerformance('ComponentName');
```

### Mounted State

```typescript
import { useMounted } from '@/hooks';

const isMounted = useMounted();
```

---

## 📝 TypeScript Types

### Common Types

```typescript
import type {
  ID,
  UUID,
  Nullable,
  Optional,
  Maybe,
  AsyncState,
  LoadingState,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

const id: ID = '123';
const state: AsyncState<Station> = { data: null, error: null, loading: true };
```

### Component Props

```typescript
import type { ComponentBaseProps, ComponentWithChildren } from '@/types';

interface MyComponentProps extends ComponentBaseProps {
  title: string;
}
```

---

## 🎯 Page Metadata

### Basic Page

```typescript
import { generateMetadata } from '@/config';

export const metadata = generateMetadata(
  'Page Title',
  'Page description',
  '/page-path'
);
```

### Custom Metadata

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Title',
  description: 'Custom description',
  // ... more options
};
```

---

## 🎨 Styling Patterns

### Tailwind Classes

```typescript
// ✅ Good - Semantic classes
<Button className="bg-primary-600 hover:bg-primary-700">

// ✅ Better - Component variants
<Button variant="primary">

// ❌ Avoid - Hardcoded values
<Button style={{ backgroundColor: '#2563EB' }}>
```

### Responsive Design

```typescript
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  gap-4
">
```

### Dark Mode

```typescript
<div className="
  bg-white
  dark:bg-gray-900
  text-gray-900
  dark:text-white
">
```

---

## 📁 File Organization

```
src/
├── app/              # Pages (Next.js App Router)
├── components/       # UI Components (Atomic Design)
│   ├── atoms/       # Smallest components
│   ├── molecules/   # Combinations of atoms
│   ├── organisms/   # Complex components
│   └── templates/   # Page layouts
├── design-system/   # Design tokens & utilities
├── lib/             # Business logic & utilities
├── hooks/           # Custom React hooks
├── types/           # TypeScript types
├── config/          # Configuration files
└── styles/          # Global styles
```

---

## 🔄 Common Workflows

### Adding a New Page

1. Create `src/app/my-page/page.tsx`
2. Add metadata
3. Build UI with existing components
4. Export page component

### Adding a New Component

1. Choose category (atoms/molecules/organisms)
2. Create component file with types
3. Add index.ts barrel export
4. Export from category index
5. Document with JSDoc

### Adding a New Hook

1. Create `src/hooks/useMyHook.ts`
2. Implement hook logic
3. Export from `src/hooks/index.ts`
4. Add JSDoc documentation

### Adding a New Utility

1. Choose category (formatters/validators/helpers)
2. Create function in appropriate file
3. Export from `src/lib/utils/index.ts`
4. Add tests

---

## 🧪 Testing Quick Reference

### Component Test

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button', () => {
  render(<Button>Click</Button>);
  expect(screen.getByText('Click')).toBeInTheDocument();
});
```

### Utility Test

```typescript
import { formatPrice } from '@/lib';

test('formats price', () => {
  expect(formatPrice(1.85)).toBe('$1.85');
});
```

---

## 🎯 Best Practices Checklist

### Code Quality

- [ ] TypeScript types for all props
- [ ] JSDoc documentation
- [ ] Descriptive variable names
- [ ] No hardcoded values
- [ ] DRY principle followed

### Accessibility

- [ ] Semantic HTML
- [ ] ARIA attributes
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Color contrast (WCAG AA)

### Performance

- [ ] Lazy loading for heavy components
- [ ] Memoization where needed
- [ ] Optimized images
- [ ] Code splitting
- [ ] No unnecessary re-renders

### Testing

- [ ] Unit tests for utilities
- [ ] Component tests
- [ ] Integration tests
- [ ] Accessibility tests

---

## 🆘 Troubleshooting

### Import Errors

```typescript
// ❌ Don't do deep imports
import { Button } from '@/components/atoms/Button/Button';

// ✅ Use barrel exports
import { Button } from '@/components';
```

### Type Errors

```typescript
// ✅ Always import types separately
import type { Station } from '@/types';

// ✅ Use type predicates
if (isStation(data)) {
  // data is now typed as Station
}
```

### Styling Issues

```typescript
// ✅ Use cn() to merge classes
import { cn } from '@/lib';

className={cn('base-class', conditionalClass && 'active-class')}
```

---

## 📚 Key Files

- **Architecture**: `ARCHITECTURE_REFACTORED.md`
- **Summary**: `PROJECT_INITIALIZATION_SUMMARY.md`
- **Component Examples**: `src/components/__examples__/README.md`
- **Design Tokens**: `src/design-system/tokens/`
- **Utilities**: `src/lib/utils/`

---

## 💡 Pro Tips

1. **Use IntelliSense** - Let TypeScript guide you
2. **Follow conventions** - Consistent naming and structure
3. **Leverage design system** - Don't reinvent the wheel
4. **Test early** - Write tests alongside features
5. **Document** - Future you will thank you

---

**Happy coding! 🚀**
