# Component Architecture Documentation

## Overview

This application follows the **Atomic Design** methodology, creating a scalable and maintainable component architecture with TypeScript support. The design system ensures consistency, accessibility, and performance across the application.

## Table of Contents

1. [Architecture Principles](#architecture-principles)
2. [Folder Structure](#folder-structure)
3. [Design System](#design-system)
4. [Component Layers](#component-layers)
5. [TypeScript Patterns](#typescript-patterns)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)
8. [Accessibility](#accessibility)

---

## Architecture Principles

### 1. Atomic Design Methodology

Components are organized into five distinct layers:

- **Atoms**: Basic building blocks (Button, Input, Text, Badge, Spinner)
- **Molecules**: Simple combinations of atoms (Card, SearchBar, Alert)
- **Organisms**: Complex components (Header, Footer, StationCard)
- **Templates**: Page-level layouts (MainLayout)
- **Pages**: Specific instances with real content

### 2. Compound Components

Complex components use the compound component pattern for flexibility:

```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

### 3. TypeScript-First

- Strict type safety
- Comprehensive interfaces
- Generic components where appropriate
- Proper prop type inference

### 4. Accessibility-First

- WCAG 2.1 AA compliant
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support

### 5. Performance-Optimized

- CSS-based animations
- Lazy loading support
- Minimal re-renders
- Optimized bundle size

---

## Folder Structure

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
    ├── atoms/
    │   ├── Button/
    │   │   ├── Button.tsx
    │   │   ├── Button.css
    │   │   └── index.ts
    │   ├── Input/
    │   ├── Text/
    │   ├── Spinner/
    │   ├── Badge/
    │   └── index.ts
    ├── molecules/
    │   ├── Card/
    │   ├── SearchBar/
    │   ├── Alert/
    │   └── index.ts
    ├── organisms/
    │   ├── Header/
    │   ├── Footer/
    │   ├── StationCard/
    │   └── index.ts
    ├── templates/
    │   ├── MainLayout/
    │   └── index.ts
    └── index.ts
```

---

## Design System

### Color System

The design system uses a comprehensive color palette with semantic naming:

```typescript
import { colors } from '@/design-system/tokens';

// Primary colors (50-900 scale)
colors.primary[500]; // Main brand color
colors.secondary[500];

// Semantic colors
colors.success[500];
colors.warning[500];
colors.error[500];
colors.info[500];

// Functional colors
colors.text.primary;
colors.background.default;
colors.border.main;
```

### Typography Scale

Predefined text styles ensure consistency:

```typescript
import { textStyles, fontSize, fontWeight } from '@/design-system/tokens';

// Heading styles
textStyles.h1, textStyles.h2, textStyles.h3...

// Body text
textStyles.body, textStyles.bodyLarge, textStyles.bodySmall

// UI text
textStyles.label, textStyles.caption, textStyles.button
```

### Spacing System

Based on a 4px base unit (0.25rem):

```typescript
import { spacing } from '@/design-system/tokens';

spacing[1]; // 0.25rem (4px)
spacing[2]; // 0.5rem (8px)
spacing[4]; // 1rem (16px)
spacing[8]; // 2rem (32px)
```

### Shadow System

Elevation-based shadow system:

```typescript
import { shadows, semanticShadows } from '@/design-system/tokens';

shadows.sm; // Subtle elevation
shadows.md; // Medium elevation
shadows.lg; // High elevation

// Semantic shadows
semanticShadows.card;
semanticShadows.modal;
semanticShadows.dropdown;
```

---

## Component Layers

### Atoms

Basic, reusable UI elements that cannot be broken down further.

**Button Component:**

```tsx
import { Button } from '@/components/atoms';

<Button
  variant="solid" // solid | outlined | ghost | link
  color="primary" // primary | secondary | success | warning | error | info
  size="md" // xs | sm | md | lg | xl
  startIcon={<Icon />}
  endIcon={<Icon />}
  loading={false}
  disabled={false}
  onClick={handleClick}
>
  Click Me
</Button>;
```

**Input Component:**

```tsx
import { Input } from '@/components/atoms';

<Input
  label="Email"
  placeholder="Enter your email"
  type="email"
  size="md"
  error={false}
  errorMessage="Invalid email"
  helperText="We'll never share your email"
  required
  startIcon={<MailIcon />}
  fullWidth
/>;
```

**Text Component:**

```tsx
import { Text, Heading1, BodyText } from '@/components/atoms';

<Heading1>Main Title</Heading1>

<Text
  variant="body"
  color="secondary"
  align="center"
  weight="medium"
  truncate
>
  Content
</Text>
```

**Badge Component:**

```tsx
import { Badge } from '@/components/atoms';

<Badge
  variant="success"
  size="sm"
  appearance="soft"
  dot
  onRemove={handleRemove}
>
  New
</Badge>;
```

**Spinner Component:**

```tsx
import { Spinner } from '@/components/atoms';

<Spinner size="md" color="primary" label="Loading content..." />;
```

### Molecules

Combinations of atoms that form functional UI components.

**Card Component:**

```tsx
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardMedia,
} from '@/components/molecules';

<Card elevation="md" hoverable>
  <CardMedia src="/image.jpg" alt="Description" aspectRatio="16/9" />
  <CardHeader>
    <Heading3>Card Title</Heading3>
  </CardHeader>
  <CardBody>
    <Text>Card content goes here</Text>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

**SearchBar Component:**

```tsx
import { SearchBar } from '@/components/molecules';

<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  onSubmit={handleSearch}
  placeholder="Search stations..."
  loading={isSearching}
  size="md"
  showButton
/>;
```

**Alert Component:**

```tsx
import { Alert } from '@/components/molecules';

<Alert
  variant="success"
  title="Success!"
  showIcon
  onClose={handleClose}
  action={{
    label: 'View Details',
    onClick: handleAction,
  }}
>
  Your action was completed successfully.
</Alert>;
```

### Organisms

Complex components combining multiple molecules and atoms.

**Header Component:**

```tsx
import { Header } from '@/components/organisms';
import { Button } from '@/components/atoms';

<Header
  logoText="MyApp"
  logo={<Logo />}
  navItems={[
    { label: 'Home', href: '/', active: true },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]}
  actions={
    <>
      <Button variant="ghost">Sign In</Button>
      <Button>Sign Up</Button>
    </>
  }
  sticky
  elevated
/>;
```

**Footer Component:**

```tsx
import { Footer } from '@/components/organisms';

<Footer
  sections={[
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
      ],
    },
  ]}
  socialLinks={[
    { label: 'Twitter', href: 'https://twitter.com', icon: <TwitterIcon /> },
    { label: 'GitHub', href: 'https://github.com', icon: <GitHubIcon /> },
  ]}
  copyright="© {year} MyApp. All rights reserved."
/>;
```

**StationCard Component:**

```tsx
import { StationCard } from '@/components/organisms';

<StationCard
  station={stationData}
  onClick={handleCardClick}
  onViewDetails={handleViewDetails}
  onGetDirections={handleDirections}
  compact={false}
/>;
```

### Templates

Page-level layouts that combine organisms.

**MainLayout Template:**

```tsx
import { MainLayout } from '@/components/templates';

<MainLayout
  header={{
    logoText: 'MyApp',
    navItems: [...],
    sticky: true
  }}
  footer={{
    sections: [...],
    copyright: '© 2025 MyApp'
  }}
  maxWidth="xl"
>
  {/* Page content */}
</MainLayout>
```

---

## TypeScript Patterns

### Base Props Interface

All components extend from base props:

```typescript
interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

### Polymorphic Components

Components that can render as different HTML elements:

```typescript
<Text as="h1">Heading</Text>
<Text as="p">Paragraph</Text>
<Text as="span">Inline text</Text>
```

### Type-Safe Props

```typescript
// Size type
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Color variant
type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

// Component variant
type Variant = 'solid' | 'outlined' | 'ghost' | 'link';
```

### Domain Types

Application-specific types:

```typescript
interface PetrolStation {
  id: string | number;
  name: string;
  brand?: string;
  address: Address;
  coordinates: Coordinates;
  fuelPrices: FuelPrice[];
  amenities?: StationAmenities;
  rating?: number;
}
```

---

## Usage Examples

### Example 1: Building a Search Page

```tsx
import { MainLayout } from '@/components/templates';
import { SearchBar } from '@/components/molecules';
import { StationCard } from '@/components/organisms';
import { Heading1, Text } from '@/components/atoms';

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [stations, setStations] = useState<PetrolStation[]>([]);

  return (
    <MainLayout
      header={{ logoText: 'Petrol Finder', navItems: [...] }}
      footer={{ sections: [...] }}
    >
      <Heading1>Find Petrol Stations</Heading1>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={handleSearch}
        placeholder="Search by location..."
      />

      <div className="results-grid">
        {stations.map(station => (
          <StationCard
            key={station.id}
            station={station}
            onViewDetails={() => viewStation(station.id)}
          />
        ))}
      </div>
    </MainLayout>
  );
};
```

### Example 2: Custom Form

```tsx
import { Input, Button, Text } from '@/components/atoms';
import { Card, CardBody, Alert } from '@/components/molecules';

export const ContactForm = () => {
  return (
    <Card elevation="md">
      <CardBody>
        <Heading3>Contact Us</Heading3>

        <Input label="Name" placeholder="Your name" required fullWidth />

        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          required
          fullWidth
        />

        <Button type="submit" fullWidth>
          Submit
        </Button>

        <Alert variant="info">We'll respond within 24 hours</Alert>
      </CardBody>
    </Card>
  );
};
```

---

## Best Practices

### 1. Component Composition

✅ **Good:**

```tsx
<Card>
  <CardHeader>
    <Heading3>Title</Heading3>
  </CardHeader>
  <CardBody>
    <Text>Content</Text>
  </CardBody>
</Card>
```

❌ **Avoid:**

```tsx
<Card title="Title" content="Content" />
```

### 2. Prop Naming

- Use semantic names: `variant`, `size`, `color`
- Boolean props: `disabled`, `loading`, `fullWidth`
- Handlers: `onClick`, `onChange`, `onSubmit`
- Content props: `children`, `startIcon`, `endIcon`

### 3. Default Props

Always provide sensible defaults:

```tsx
const Button = ({
  variant = 'solid',
  size = 'md',
  color = 'primary',
  ...props
}) => { ... }
```

### 4. Conditional Styling

Use the `cn()` utility for conditional classes:

```tsx
const classNames = cn(
  'button',
  `button--${variant}`,
  `button--${size}`,
  disabled && 'button--disabled',
  className
);
```

### 5. TypeScript Imports

Use type imports where appropriate:

```tsx
import { Button } from '@/components/atoms';
import type { ButtonProps } from '@/components/atoms';
```

---

## Accessibility

### Keyboard Navigation

All interactive components support:

- Tab navigation
- Enter/Space activation
- Escape to close
- Arrow keys for lists

### Screen Readers

- Semantic HTML elements
- ARIA labels and descriptions
- Role attributes
- Live regions for dynamic content

### Focus Management

```tsx
<Button onClick={handleClick}>
  {/* Automatic focus ring on focus-visible */}
  Click Me
</Button>
```

### Color Contrast

All colors meet WCAG 2.1 AA standards:

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Example: Accessible Form

```tsx
<Input
  id="email"
  label="Email Address"
  type="email"
  required
  error={!!errors.email}
  errorMessage={errors.email}
  aria-describedby="email-helper"
  helperText="We'll never share your email"
/>
```

---

## Performance Considerations

### 1. CSS-in-CSS

Components use separate CSS files for better caching and performance:

```tsx
import './Button.css';
```

### 2. Minimal Re-renders

Components are optimized to prevent unnecessary re-renders:

```tsx
const Button = React.memo(({ children, ...props }) => {
  // Component logic
});
```

### 3. Tree Shaking

Named exports enable tree shaking:

```tsx
import { Button, Input } from '@/components/atoms';
// Only Button and Input code is included in bundle
```

### 4. Code Splitting

Use lazy loading for heavy components:

```tsx
const StationMap = React.lazy(() => import('./StationMap'));
```

---

## Migration Guide

### From Existing Components

1. **Identify the component level** (atom, molecule, organism)
2. **Extract reusable logic** into hooks
3. **Apply design tokens** for styling
4. **Add TypeScript types**
5. **Implement accessibility features**
6. **Write tests**

### Example Migration

**Before:**

```jsx
<button className="custom-button primary large">Click Me</button>
```

**After:**

```tsx
import { Button } from '@/components/atoms';

<Button variant="solid" color="primary" size="lg">
  Click Me
</Button>;
```

---

## Contributing

When adding new components:

1. Choose the appropriate level (atom/molecule/organism)
2. Follow the existing file structure
3. Use TypeScript with proper types
4. Include accessibility features
5. Apply design tokens
6. Write CSS in separate files
7. Export through index.ts
8. Update documentation

---

## Resources

- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Best Practices](https://react.dev/learn)

---

## Support

For questions or issues:

- Check the component source code
- Review usage examples
- Consult this documentation
- Create an issue in the repository
