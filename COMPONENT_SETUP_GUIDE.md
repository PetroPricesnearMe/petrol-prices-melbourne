# Component Architecture Setup Guide

This guide will help you set up and start using the component architecture in your application.

## Prerequisites

- Node.js 16+ and npm/yarn
- React 18+
- Basic understanding of TypeScript
- Familiarity with React hooks

## Installation

### 1. Install TypeScript Dependencies

If you haven't already, install TypeScript and type definitions:

```bash
npm install --save-dev typescript @types/react @types/react-dom @types/node
```

### 2. Configure TypeScript

The `tsconfig.json` file is already set up in the root directory with:
- Strict type checking
- Path aliases for clean imports
- JSX support
- Incremental compilation

### 3. Verify Path Aliases

Ensure your build tool (Next.js, Webpack, Vite, etc.) is configured to recognize the path aliases:

```json
{
  "@/*": ["./*"],
  "@/components/*": ["./src/components/*"],
  "@/types/*": ["./src/types/*"],
  "@/design-system/*": ["./src/design-system/*"]
}
```

## File Structure Overview

After setup, your project structure should look like this:

```
src/
├── types/
│   └── index.ts                    # Global TypeScript types
├── design-system/
│   ├── tokens/
│   │   ├── colors.ts              # Color palette
│   │   ├── typography.ts          # Font system
│   │   ├── spacing.ts             # Spacing scale
│   │   ├── shadows.ts             # Shadow system
│   │   ├── animations.ts          # Animation tokens
│   │   └── index.ts              # Token exports
│   └── utils/
│       └── styled.ts              # Styling utilities
└── components/
    ├── atoms/                      # Basic components
    │   ├── Button/
    │   ├── Input/
    │   ├── Text/
    │   ├── Spinner/
    │   ├── Badge/
    │   └── index.ts
    ├── molecules/                  # Composite components
    │   ├── Card/
    │   ├── SearchBar/
    │   ├── Alert/
    │   └── index.ts
    ├── organisms/                  # Complex components
    │   ├── Header/
    │   ├── Footer/
    │   ├── StationCard/
    │   └── index.ts
    ├── templates/                  # Page layouts
    │   ├── MainLayout/
    │   └── index.ts
    └── index.ts                   # Main export
```

## Quick Start

### 1. Basic Component Usage

```tsx
import { Button, Text } from '@/components/atoms';

function MyComponent() {
  return (
    <div>
      <Text variant="h1">Hello World</Text>
      <Button onClick={() => console.log('Clicked!')}>
        Click Me
      </Button>
    </div>
  );
}
```

### 2. Using Design Tokens

```tsx
import { colors, spacing } from '@/design-system/tokens';

function MyStyledComponent() {
  return (
    <div style={{
      backgroundColor: colors.primary[500],
      padding: spacing[4],
      borderRadius: '0.5rem'
    }}>
      Styled content
    </div>
  );
}
```

### 3. Building a Page

```tsx
import { MainLayout } from '@/components/templates';
import { Card, SearchBar } from '@/components/molecules';
import { Heading1 } from '@/components/atoms';

export default function HomePage() {
  return (
    <MainLayout
      header={{
        logoText: 'My App',
        navItems: [
          { label: 'Home', href: '/', active: true },
          { label: 'About', href: '/about' }
        ]
      }}
    >
      <Heading1>Welcome</Heading1>
      <SearchBar placeholder="Search..." />
    </MainLayout>
  );
}
```

## Migration from Existing Components

If you have existing components, here's how to migrate:

### Step 1: Identify Component Level

Determine where your component fits:
- **Atom**: Single-purpose, no dependencies (e.g., Button, Input)
- **Molecule**: Combines atoms (e.g., SearchBar, Card)
- **Organism**: Complex, domain-specific (e.g., Navigation, ProductCard)
- **Template**: Page layout

### Step 2: Add TypeScript Types

```tsx
// Before (JavaScript)
export const MyComponent = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};

// After (TypeScript)
import type { BaseProps } from '@/types';

export interface MyComponentProps extends BaseProps {
  title: string;
  onClick: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onClick,
  className,
  ...props 
}) => {
  return (
    <button 
      onClick={onClick} 
      className={cn('my-component', className)}
      {...props}
    >
      {title}
    </button>
  );
};
```

### Step 3: Apply Design Tokens

Replace hardcoded values with design tokens:

```tsx
// Before
<div style={{ color: '#2196F3', padding: '16px' }}>

// After
import { colors, spacing } from '@/design-system/tokens';

<div style={{ color: colors.primary[500], padding: spacing[4] }}>
```

### Step 4: Add Accessibility

Ensure your components are accessible:

```tsx
<button
  onClick={onClick}
  aria-label="Close dialog"
  aria-describedby="dialog-description"
>
  Close
</button>
```

## Common Tasks

### Creating a New Atom

1. Create a new directory in `src/components/atoms/`:
   ```
   src/components/atoms/NewAtom/
   ├── NewAtom.tsx
   ├── NewAtom.css
   └── index.ts
   ```

2. Implement the component:
   ```tsx
   // NewAtom.tsx
   import React from 'react';
   import type { BaseProps } from '@/types';
   import { cn } from '@/design-system/utils/styled';
   import './NewAtom.css';

   export interface NewAtomProps extends BaseProps {
     // Your props
   }

   export const NewAtom: React.FC<NewAtomProps> = ({
     className,
     ...props
   }) => {
     return (
       <div className={cn('new-atom', className)} {...props}>
         {/* Implementation */}
       </div>
     );
   };
   ```

3. Export from index:
   ```tsx
   // index.ts
   export { NewAtom } from './NewAtom';
   export type { NewAtomProps } from './NewAtom';
   ```

4. Add to atoms index:
   ```tsx
   // src/components/atoms/index.ts
   export * from './NewAtom';
   ```

### Customizing Design Tokens

Edit the token files in `src/design-system/tokens/`:

```tsx
// colors.ts
export const colors = {
  primary: {
    500: '#YOUR_BRAND_COLOR',
    // ... other shades
  },
  // ... rest of colors
};
```

### Creating Custom Hooks

Create reusable hooks for common patterns:

```tsx
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## Testing

### Component Testing Example

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/atoms';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    await userEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

## Troubleshooting

### Issue: Module not found

**Problem:** Import errors like `Cannot find module '@/components'`

**Solution:** 
1. Check `tsconfig.json` has correct paths
2. Restart your IDE/dev server
3. Clear build cache: `rm -rf .next` or `rm -rf dist`

### Issue: TypeScript errors

**Problem:** Type errors in components

**Solution:**
1. Ensure all dependencies have type definitions
2. Check import paths are correct
3. Run `npm install` to ensure all packages are installed
4. Check `tsconfig.json` is properly configured

### Issue: Styles not applying

**Problem:** CSS classes not working

**Solution:**
1. Verify CSS files are imported in component files
2. Check class names match between CSS and TypeScript
3. Ensure build tool processes CSS files
4. Check for CSS specificity conflicts

### Issue: Design tokens not found

**Problem:** Import errors for design tokens

**Solution:**
1. Verify path aliases in tsconfig.json
2. Check token files exist in `src/design-system/tokens/`
3. Ensure tokens are exported from `index.ts`

## Best Practices

### 1. Component Organization
- Keep components focused and single-purpose
- Use composition over complex props
- Extract reusable logic into hooks

### 2. TypeScript Usage
- Always define prop types
- Use strict mode
- Avoid `any` type
- Leverage type inference

### 3. Styling
- Use design tokens consistently
- Keep CSS files small and focused
- Follow BEM-like naming for CSS classes
- Use semantic class names

### 4. Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

### 5. Performance
- Use React.memo for expensive components
- Lazy load heavy components
- Optimize images and assets
- Keep bundle size in check

## Next Steps

1. **Read the Documentation:**
   - `COMPONENT_ARCHITECTURE.md` - Comprehensive guide
   - `COMPONENT_QUICK_REFERENCE.md` - Quick reference
   - `COMPONENT_EXAMPLES.tsx` - Code examples

2. **Explore Components:**
   - Browse `src/components/` directory
   - Check individual component files
   - Review CSS styles

3. **Start Building:**
   - Create your first page with MainLayout
   - Use existing components
   - Create custom components as needed

4. **Customize:**
   - Adjust design tokens to match your brand
   - Add new components for your use cases
   - Extend existing components

## Resources

- [Atomic Design](https://atomicdesign.bradfrost.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Documentation](https://react.dev/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

If you encounter issues or have questions:
1. Check the documentation files
2. Review example code
3. Inspect component source code
4. Create an issue in the repository

---

**Happy coding!** 🚀

