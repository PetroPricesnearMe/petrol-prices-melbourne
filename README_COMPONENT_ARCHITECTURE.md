# Component Architecture - README

A scalable, type-safe, and accessible component library built with Atomic Design methodology.

## 🎯 Overview

This component architecture provides:

- ✅ **Atomic Design** - Organized from atoms to templates
- ✅ **TypeScript** - Full type safety and IntelliSense
- ✅ **Design System** - Consistent tokens for colors, typography, spacing
- ✅ **Accessibility** - WCAG 2.1 AA compliant components
- ✅ **Performance** - Optimized rendering and bundle size
- ✅ **Compound Components** - Flexible composition patterns
- ✅ **Comprehensive Documentation** - Examples and guides

## 📚 Documentation

| Document                       | Description                         |
| ------------------------------ | ----------------------------------- |
| `COMPONENT_ARCHITECTURE.md`    | Complete architecture documentation |
| `COMPONENT_QUICK_REFERENCE.md` | Quick reference guide with examples |
| `COMPONENT_EXAMPLES.tsx`       | Practical usage examples            |
| `COMPONENT_SETUP_GUIDE.md`     | Setup and installation guide        |

## 🚀 Quick Start

### Installation

```bash
# TypeScript is already configured
# All components are ready to use
```

### Basic Usage

```tsx
import { Button, Text } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { MainLayout } from '@/components/templates';

function App() {
  return (
    <MainLayout>
      <Card>
        <Text variant="h1">Welcome</Text>
        <Button onClick={() => alert('Hello!')}>Click Me</Button>
      </Card>
    </MainLayout>
  );
}
```

## 🏗️ Architecture

### Component Hierarchy

```
Atoms (Basic elements)
  └── Molecules (Simple combinations)
      └── Organisms (Complex components)
          └── Templates (Page layouts)
              └── Pages (Final implementations)
```

### Available Components

#### Atoms

- `Button` - Versatile button with variants and states
- `Input` - Form input with validation
- `Text` - Typography component
- `Badge` - Status indicators
- `Spinner` - Loading indicators

#### Molecules

- `Card` - Content container with sections
- `SearchBar` - Search input with actions
- `Alert` - Feedback messages

#### Organisms

- `Header` - Application header with navigation
- `Footer` - Application footer
- `StationCard` - Domain-specific card component

#### Templates

- `MainLayout` - Standard page layout

## 🎨 Design System

### Colors

```tsx
import { colors } from '@/design-system/tokens';

colors.primary[500]; // Brand color
colors.success[500]; // Success state
colors.text.primary; // Text color
```

### Typography

```tsx
import { Text, Heading1 } from '@/components/atoms';

<Heading1>Title</Heading1>
<Text variant="body">Content</Text>
```

### Spacing

```tsx
import { spacing } from '@/design-system/tokens';

<div style={{ padding: spacing[4], margin: spacing[8] }} />;
```

## 💡 Examples

### Simple Card

```tsx
import { Card, CardBody } from '@/components/molecules';
import { Text, Button } from '@/components/atoms';

<Card elevation="md">
  <CardBody>
    <Text variant="h3">Card Title</Text>
    <Text>Card content goes here.</Text>
    <Button>Action</Button>
  </CardBody>
</Card>;
```

### Form with Validation

```tsx
import { Input, Button } from '@/components/atoms';

<form>
  <Input
    label="Email"
    type="email"
    error={!!errors.email}
    errorMessage={errors.email}
    required
  />
  <Button type="submit" loading={isSubmitting}>
    Submit
  </Button>
</form>;
```

### Complete Page

```tsx
import { MainLayout } from '@/components/templates';
import { Heading1 } from '@/components/atoms';
import { SearchBar } from '@/components/molecules';

export default function HomePage() {
  return (
    <MainLayout
      header={{
        logoText: 'My App',
        navItems: [
          /* ... */
        ],
      }}
      footer={{
        sections: [
          /* ... */
        ],
      }}
    >
      <Heading1>Welcome</Heading1>
      <SearchBar placeholder="Search..." />
    </MainLayout>
  );
}
```

## 🔧 Customization

### Customize Colors

Edit `src/design-system/tokens/colors.ts`:

```typescript
export const colors = {
  primary: {
    500: '#YOUR_COLOR',
    // ... other shades
  },
  // ... rest of palette
};
```

### Create Custom Component

```tsx
// src/components/atoms/MyComponent/MyComponent.tsx
import type { BaseProps } from '@/types';
import { cn } from '@/design-system/utils/styled';

export interface MyComponentProps extends BaseProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  className,
  ...props
}) => {
  return (
    <div className={cn('my-component', className)} {...props}>
      {title}
    </div>
  );
};
```

## ♿ Accessibility

All components follow WCAG 2.1 AA standards:

- ✅ Semantic HTML
- ✅ ARIA attributes
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ Color contrast compliance

## 🧪 Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/atoms';

test('renders button', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
```

## 📦 Project Structure

```
src/
├── types/                  # TypeScript types
├── design-system/          # Design tokens and utilities
│   ├── tokens/            # Color, typography, spacing, etc.
│   └── utils/             # Styling utilities
└── components/            # Component library
    ├── atoms/            # Basic components
    ├── molecules/        # Composite components
    ├── organisms/        # Complex components
    └── templates/        # Page layouts
```

## 🎯 Key Features

### Type Safety

Full TypeScript support with comprehensive type definitions:

```tsx
import type { ButtonProps, ColorVariant } from '@/components/atoms';
```

### Design Tokens

Consistent design system with tokens for:

- Colors (primary, secondary, semantic)
- Typography (sizes, weights, line heights)
- Spacing (4px base unit scale)
- Shadows (elevation system)
- Animations (timing, easing)

### Compound Components

Flexible composition for complex components:

```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Responsive Design

All components are responsive and mobile-friendly.

## 📖 Learn More

- **Architecture Guide**: `COMPONENT_ARCHITECTURE.md`
- **Quick Reference**: `COMPONENT_QUICK_REFERENCE.md`
- **Examples**: `COMPONENT_EXAMPLES.tsx`
- **Setup Guide**: `COMPONENT_SETUP_GUIDE.md`

## 🤝 Contributing

When adding components:

1. Follow Atomic Design principles
2. Use TypeScript with strict types
3. Apply design tokens consistently
4. Ensure accessibility
5. Write documentation
6. Add examples

## 📝 License

Part of the main application. See root LICENSE file.

---

**Built with ❤️ using Atomic Design, TypeScript, and React**
