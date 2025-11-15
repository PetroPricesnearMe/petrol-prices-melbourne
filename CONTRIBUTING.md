# Contributing to Petrol Price Near Me

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for everyone.

### Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**

- Harassment, trolling, or insulting comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or higher (see `package.json` engines)
- npm 10.0 or higher
- Git
- A code editor (VS Code recommended with TypeScript extension)

### Initial Setup

1. **Fork the repository**

   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/petrol-price-near-me.git
   cd petrol-price-near-me
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/petrol-price-near-me.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Creating a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:

- `feature/add-dark-mode`
- `fix/station-card-layout`
- `docs/update-readme`

### Making Changes

1. **Make your changes**
   - Follow the coding standards
   - Write clean, readable code
   - Add comments for complex logic

2. **Test your changes**

   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

3. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add dark mode toggle"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### TypeScript

- **Use strict types** - No `any` types (strict mode enabled)
- **Define interfaces** - For all props and data structures
- **Use type inference** - When types are obvious
- **Export types** - Make types reusable
- **Use utility types** - Leverage TypeScript utility types from `@/types`

```typescript
// ✅ Good - Strict typing with utility types
import type { ComponentBaseProps, Nullable, Optional } from '@/types';

interface ButtonProps extends ComponentBaseProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}

// ✅ Good - Using enhanced types
import type { ApiResponse, AsyncState, LoadingState } from '@/types';

const [state, setState] = React.useState<AsyncState<Station>>({
  data: null,
  error: null,
  loading: false,
});

// ❌ Bad - Using any, Function, loose types
interface ButtonProps {
  variant: any;
  onClick: Function;
  children: any;
  isLoading?: any;
}
```

### React Components

- **Functional components** - Use function components with hooks
- **Named exports** - For components (use `export const`)
- **Props interface** - Always define props with TypeScript
- **Default exports** - Only for Next.js pages (`app/` directory)
- **Forward refs** - Use `React.forwardRef` for DOM access
- **Display names** - Set `displayName` for better debugging

```typescript
// ✅ Good - Modern React with TypeScript
import React from 'react';
import type { ComponentBaseProps } from '@/types';

export interface ButtonProps extends ComponentBaseProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', onClick, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn('btn', `btn-${variant}`, className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ❌ Bad - Default export, no types, no ref forwarding
export default function Button(props) {
  return <button>{/* ... */}</button>;
}
```

### File Organization

Follow this structure for all component files:

````typescript
/**
 * ComponentName - Brief description
 *
 * Detailed description with usage examples.
 *
 * @component
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */

// 1. Imports (grouped and sorted by category)
// 1a. React/Next.js
import React from 'react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

// 1b. External libraries
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

// 1c. Internal modules (sorted by scope)
import { Button, Card } from '@/components';
import { useStations } from '@/hooks';
import { formatPrice, debounce } from '@/lib';
import { cn, colors, spacing } from '@/design-system';
import { siteConfig } from '@/config';

// 1d. Type imports
import type { Station, ApiResponse, ComponentBaseProps } from '@/types';

// 1e. Styles
import styles from './Component.module.css';

// 2. Variants (if using CVA)
const componentVariants = cva(/* ... */);

// 3. Types/Interfaces
export interface ComponentNameProps
  extends ComponentBaseProps,
    VariantProps<typeof componentVariants> {
  title: string;
  description?: string;
}

// 4. Component Implementation
export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ title, description, className, ...props }, ref) => {
    // 4a. Hooks
    const [state, setState] = React.useState();
    const { data } = useStations();

    // 4b. Derived values
    const computed = React.useMemo(() => {
      // Compute something
    }, []);

    // 4c. Event handlers
    const handleClick = React.useCallback(() => {
      // Handle event
    }, []);

    // 4d. Effects
    React.useEffect(() => {
      // Side effects
    }, []);

    // 4e. Early returns
    if (!data) return null;

    // 4f. Render
    return (
      <div ref={ref} className={cn(componentVariants(), className)} {...props}>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    );
  }
);

ComponentName.displayName = 'ComponentName';

// 5. Helper functions (if needed, outside component)
function helperFunction() {}
````

### Import Order

Follow this strict import order for consistency:

1. **React and Next.js** - Core framework imports
2. **External libraries** - Third-party packages
3. **Internal modules** (by scope, sorted alphabetically):
   - Components (`@/components`)
   - Hooks (`@/hooks`)
   - Utilities (`@/lib`)
   - Design system (`@/design-system`)
   - Config (`@/config`)
4. **Type imports** - TypeScript types
5. **Styles** - CSS modules or global styles

```typescript
// ✅ Good - Correct import order
// 1. React/Next.js
import React from 'react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

// 3. Internal modules (sorted by scope)
import { Button, Card } from '@/components';
import { useStations, useGeolocation } from '@/hooks';
import { formatPrice, debounce } from '@/lib';
import { cn, colors, spacing } from '@/design-system';
import { siteConfig } from '@/config';

// 4. Type imports
import type { Station, ApiResponse } from '@/types';

// 5. Styles
import styles from './Component.module.css';

// ❌ Bad - Wrong order, deep imports
import { Button } from '@/components/atoms/Button/Button';
import { useState } from 'react';
import type { Station } from '@/types';
import { formatPrice } from '@/lib/utils/formatters';
```

### Naming Conventions

- **Components**: PascalCase (`Button`, `StationCard`)
- **Files**: PascalCase for components, camelCase for utils (`Button.tsx`, `formatters.ts`)
- **Functions**: camelCase (`formatPrice`, `calculateDistance`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RESULTS`)
- **Types/Interfaces**: PascalCase (`ButtonProps`, `PetrolStation`)

## 🧩 Component Guidelines

### Atomic Design Structure

Place components in the correct folder following Atomic Design:

```
src/
├── components/
│   ├── atoms/          # Basic building blocks
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   └── index.ts    # Barrel export
│   │
│   ├── molecules/      # Simple combinations
│   │   ├── SearchBar/
│   │   ├── Card/
│   │   └── index.ts
│   │
│   ├── organisms/      # Complex components
│   │   ├── Header/
│   │   ├── StationCard/
│   │   └── index.ts
│   │
│   ├── templates/      # Page layouts
│   │   ├── MainLayout/
│   │   └── index.ts
│   │
│   ├── __examples__/   # Example implementations
│   │   ├── Button.example.tsx
│   │   └── README.md
│   │
│   └── index.ts        # Main barrel export
│
├── design-system/      # Design tokens & utilities
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   └── utils/
│       ├── cn.ts
│       └── index.ts
│
├── lib/                # Business logic & utilities
│   └── utils/
│       ├── formatters.ts
│       ├── validators.ts
│       └── index.ts
│
├── hooks/              # Custom React hooks
│   └── index.ts
│
├── types/              # TypeScript types
│   └── index.ts
│
└── config/             # Configuration
    └── index.ts
```

### Component Template

Use this production-ready template for all new components:

````typescript
/**
 * ComponentName - Brief description
 *
 * Detailed description of what the component does,
 * its features, and when to use it.
 *
 * @component
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Content
 * </ComponentName>
 * ```
 */

'use client'; // Only if using hooks/interactivity

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from '@/design-system/utils';
import type { ComponentBaseProps } from '@/types';

/**
 * Component variants using CVA
 */
const componentVariants = cva(
  // Base classes (always applied)
  [
    'base-classes',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-primary-600', 'text-white', 'hover:bg-primary-700'],
        secondary: ['bg-gray-100', 'text-gray-900', 'hover:bg-gray-200'],
      },
      size: {
        sm: ['text-sm', 'px-3', 'py-1.5'],
        md: ['text-base', 'px-4', 'py-2'],
        lg: ['text-lg', 'px-6', 'py-3'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * Component Props
 */
export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ComponentBaseProps,
    VariantProps<typeof componentVariants> {
  /**
   * Component title
   */
  title: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Children content
   */
  children?: React.ReactNode;

  /**
   * Enable animations
   */
  animated?: boolean;
}

/**
 * ComponentName Implementation
 */
export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  (
    {
      className,
      variant,
      size,
      title,
      description,
      children,
      animated = false,
      ...props
    },
    ref
  ) => {
    // Hooks
    const [state, setState] = React.useState();

    // Derived values
    const computed = React.useMemo(() => {
      // Compute something
    }, []);

    // Event handlers
    const handleClick = () => {
      // Handle event
    };

    // Effects
    React.useEffect(() => {
      // Side effects
    }, []);

    // Component content
    const content = (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-gray-600">{description}</p>}
        {children}
      </div>
    );

    // Return with or without animation
    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      );
    }

    return content;
  }
);

ComponentName.displayName = 'ComponentName';
````

### Component Index File (Barrel Export)

Always create an index file for clean imports:

```typescript
// components/atoms/Button/index.ts
export { Button, buttonVariants } from './Button';
export type { ButtonProps } from './Button';
```

Then export from parent index:

```typescript
// components/atoms/index.ts
export * from './Button';
export * from './Input';
// ... other atoms
```

This allows clean imports:

```typescript
// ✅ Good - Clean barrel import
import { Button, Input } from '@/components/atoms';

// ❌ Bad - Deep import
import { Button } from '@/components/atoms/Button/Button';
```

## 💬 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(search): add advanced search filters

- Add fuel type filter
- Add price range filter
- Add distance filter

Closes #123
```

```bash
fix(station-card): correct price display

The price was showing incorrect decimal places.
Now properly formatted to 2 decimal places.
```

```bash
docs(readme): update installation instructions

Added prerequisites section and updated commands.
```

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] No type errors (`npm run type-check`)
- [ ] Updated documentation if needed
- [ ] Added tests for new features

### PR Title Format

Use the same format as commit messages:

```
feat: add dark mode support
fix: resolve station card layout issue
docs: update API documentation
```

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How has this been tested?

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] My code follows the project style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] All tests pass
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be recognized!

## 🧪 Testing Guidelines

### Writing Tests

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-primary-600');
  });
});
```

### Test Coverage

Aim for:

- **70%+ overall coverage**
- **80%+ for utilities**
- **70%+ for components**

### Running Tests

```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 🎨 Style Guide

### Design System Usage

**Always use design system tokens** instead of hardcoded values:

```typescript
// ✅ Good - Using design system
import { colors, spacing, cn } from '@/design-system';

const primaryColor = colors.primary[600];
const padding = spacing[4]; // 16px

<div className={cn('base-classes', isActive && 'active-classes')}>

// ❌ Bad - Hardcoded values
<div style={{ color: '#2563EB', padding: '16px' }}>
<div className="base-classes active-classes"> // No cn() usage
```

### Tailwind CSS Best Practices

- **Use Tailwind utilities** - Prefer Tailwind classes over custom CSS
- **Mobile-first approach** - Start with mobile, then add responsive breakpoints
- **Use design tokens** - Reference spacing, colors from design system
- **Consistent spacing** - Use 8px grid system (spacing[1] = 4px, spacing[2] = 8px, etc.)

```typescript
// ✅ Good - Mobile-first, design tokens
<div className="
  flex flex-col gap-4 p-4
  md:flex-row md:gap-6 md:p-6
  lg:gap-8 lg:p-8
">

// ✅ Good - Using cn() for conditional classes
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isLoading && 'loading-classes'
)}>

// ❌ Bad - Inline styles, no responsive design
<div style={{ display: 'flex', padding: '24px' }}>
```

### Framer Motion Animations

Use Framer Motion for smooth, performant animations:

```typescript
import { motion } from 'framer-motion';

// ✅ Good - Smooth entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  Content
</motion.div>

// ✅ Good - Hover animations
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>

// ✅ Good - Respect reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1 }}
>
  Content
</motion.div>
```

### UI/UX Best Practices

#### Visual Hierarchy

- Use typography scale for clear hierarchy
- Apply appropriate spacing between elements
- Use color and contrast to guide attention

```typescript
// ✅ Good - Clear hierarchy
<h1 className="text-4xl font-bold text-gray-900 mb-4">Main Title</h1>
<h2 className="text-2xl font-semibold text-gray-800 mb-2">Section Title</h2>
<p className="text-base text-gray-600">Body text</p>
```

#### Whitespace Balance

- Use consistent spacing scale (8px grid)
- Group related elements with less spacing
- Separate sections with more spacing

```typescript
// ✅ Good - Balanced spacing
<div className="space-y-6"> {/* 24px between children */}
  <section className="p-6"> {/* 24px padding */}
    <h2 className="mb-4">Title</h2> {/* 16px margin */}
    <p className="mb-2">Text</p> {/* 8px margin */}
  </section>
</div>
```

#### Hover States & Micro-interactions

- Add subtle hover effects for interactive elements
- Use smooth transitions (200-300ms)
- Provide visual feedback on interaction

```typescript
// ✅ Good - Smooth hover states
<button className="
  bg-primary-600 text-white
  hover:bg-primary-700
  active:bg-primary-800
  transition-colors duration-200
  transform hover:scale-105
  active:scale-95
">
  Button
</button>
```

#### Dark Mode Support

- Always design with dark mode in mind
- Use semantic color tokens
- Test contrast in both modes

```typescript
// ✅ Good - Dark mode support
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  border-gray-200 dark:border-gray-700
">
  Content
</div>
```

### Accessibility (WCAG 2.1 AA)

- **Semantic HTML** - Use proper HTML elements
- **ARIA attributes** - Add when needed for screen readers
- **Keyboard navigation** - Ensure all interactive elements are keyboard accessible
- **Color contrast** - Maintain 4.5:1 ratio for text, 3:1 for UI components
- **Focus management** - Visible focus indicators
- **Screen reader support** - Descriptive labels and announcements

```typescript
// ✅ Good - Accessible component
<button
  type="button"
  aria-label="Close dialog"
  aria-pressed={isPressed}
  onClick={handleClose}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClose();
    }
  }}
  className="
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary-500
    focus-visible:ring-offset-2
  "
>
  <CloseIcon aria-hidden="true" />
  <span className="sr-only">Close</span>
</button>

// ❌ Bad - Not accessible
<div onClick={handleClose}>
  <CloseIcon />
</div>
```

### Responsive Design

Follow mobile-first approach with breakpoints:

```typescript
// ✅ Good - Mobile-first responsive
<div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  md:grid-cols-3 md:gap-8
  lg:grid-cols-4
  xl:grid-cols-5
">
  {items.map(item => <Item key={item.id} />)}
</div>
```

Breakpoints:

- `xs`: 475px (extra small)
- `sm`: 640px (small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large screens)

## 🎨 Design System Reference

### Using Design Tokens

```typescript
import { colors, spacing, typography, shadows } from '@/design-system';

// Colors
const primary = colors.primary[600];
const success = colors.semantic.success.DEFAULT;

// Spacing (8px grid)
const padding = spacing[4]; // 16px
const margin = spacing[8]; // 32px

// Typography
const headingStyle = typography.textStyles.h1;

// Shadows
const cardShadow = shadows.componentShadows.card.hover;
```

### Using Utilities

```typescript
import { cn, formatPrice, isValidEmail, debounce } from '@/lib';

// Merge classes
const classes = cn('base', isActive && 'active', className);

// Format data
const price = formatPrice(1.85); // "$1.85"

// Validate
if (isValidEmail(email)) {
  /* ... */
}

// Debounce
const debouncedSearch = debounce(handleSearch, 300);
```

### Component Variants (CVA)

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/design-system/utils';

const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white',
        secondary: 'bg-gray-100 text-gray-900',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export const Button = ({ variant, size, children, className }: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </button>
  );
};
```

## 📚 Additional Resources

### Architecture Documentation

- **`ARCHITECTURE_REFACTORED.md`** - Complete architecture guide
- **`PROJECT_INITIALIZATION_SUMMARY.md`** - Project setup summary
- **`QUICK_START_ARCHITECTURE.md`** - Quick reference guide
- **`src/components/__examples__/README.md`** - Component examples

### Design System

- **`src/design-system/tokens/`** - All design tokens
- **`tailwind.config.js`** - Tailwind configuration
- **`docs/DESIGN_SYSTEM.md`** - Design system documentation

### Code Examples

- **`src/components/__examples__/Button.example.tsx`** - Button component example
- **`src/components/__examples__/Card.example.tsx`** - Card component example

## 📞 Getting Help

- **Documentation**: Check existing docs first
  - Architecture: `ARCHITECTURE_REFACTORED.md`
  - Quick Start: `QUICK_START_ARCHITECTURE.md`
  - Component Examples: `src/components/__examples__/`
- **Issues**: Search existing issues on GitHub
- **Discussions**: Start a discussion for questions
- **Email**: contact@petrolpricenearme.com.au

## 🙏 Recognition

Contributors will be:

- Added to the contributors list
- Mentioned in release notes
- Credited in the README

Thank you for contributing! 🎉
