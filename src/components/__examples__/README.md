# Component Examples

This directory contains example implementations of production-ready components following best practices.

## Component Architecture

Our components follow the **Atomic Design** methodology:

### Atoms

Small, indivisible UI elements like buttons, inputs, and labels.

**Example: Button**

```tsx
<Button variant="primary" size="md">
  Click me
</Button>
```

### Molecules

Combinations of atoms that form simple UI elements.

**Example: Card**

```tsx
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Organisms

Complex components made of molecules and atoms.

**Example: StationCard**

```tsx
<StationCard station={stationData} onSelect={handleSelect} />
```

## Best Practices Demonstrated

### 1. **TypeScript Excellence**

- Proper typing with interfaces
- Generic types where appropriate
- Type-safe props with `VariantProps`
- Export types for consumers

### 2. **Accessibility (A11Y)**

- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support

### 3. **Styling**

- Tailwind CSS with design tokens
- Class variance authority (CVA) for variants
- `cn()` utility for class merging
- Responsive design
- Theme support

### 4. **Component Composition**

- Flexible and composable
- Compound components pattern
- Controlled/uncontrolled modes
- Forward refs for DOM access

### 5. **Performance**

- `React.forwardRef` for ref forwarding
- Memoization where needed
- Lazy loading for heavy components
- Code splitting

### 6. **Developer Experience**

- JSDoc documentation
- Usage examples
- Clear prop descriptions
- TypeScript autocomplete

## Component Template

Use this template for new components:

````tsx
/**
 * ComponentName - Brief description
 *
 * Detailed description of what the component does,
 * its features, and when to use it.
 *
 * @component
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/design-system/utils';
import type { ComponentBaseProps } from '@/types';

/**
 * Component variants
 */
const componentVariants = cva(
  // Base classes
  ['base', 'classes'],
  {
    variants: {
      variant: {
        default: ['default', 'classes'],
        custom: ['custom', 'classes'],
      },
      size: {
        sm: ['small', 'classes'],
        md: ['medium', 'classes'],
      },
    },
    defaultVariants: {
      variant: 'default',
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
   * Children content
   */
  children: React.ReactNode;

  /**
   * Custom prop with description
   */
  customProp?: string;
}

/**
 * ComponentName Implementation
 */
export const ComponentName = React.forwardRef<
  HTMLDivElement,
  ComponentNameProps
>(({ className, variant, size, children, customProp, ...props }, ref) => {
  // Hooks
  const [state, setState] = React.useState();

  // Derived values
  const computed = React.useMemo(() => {
    // Compute something
  }, []);

  // Event handlers
  const handleEvent = () => {
    // Handle event
  };

  // Effects
  React.useEffect(() => {
    // Side effects
  }, []);

  // Render
  return (
    <div
      ref={ref}
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  );
});

ComponentName.displayName = 'ComponentName';
````

## Testing Components

All components should have:

1. **Unit tests** - Test component logic
2. **Integration tests** - Test component interactions
3. **Accessibility tests** - Test A11Y compliance
4. **Visual tests** - Storybook stories

Example test:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

## Storybook Stories

Document component variants in Storybook:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    leftIcon: <Icon />,
    children: 'Button with Icon',
  },
};
```

## Checklist for New Components

- [ ] TypeScript with proper typing
- [ ] Accessibility (ARIA, keyboard, semantic HTML)
- [ ] Responsive design
- [ ] Theme support
- [ ] JSDoc documentation
- [ ] Usage examples
- [ ] Unit tests
- [ ] Storybook story
- [ ] Export from index.ts
- [ ] README update (if needed)

## Resources

- [Atomic Design](https://atomicdesign.bradfrost.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [CVA Documentation](https://cva.style/docs)
- [A11Y Checklist](https://www.a11yproject.com/checklist/)
