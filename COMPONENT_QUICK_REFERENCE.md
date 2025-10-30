# Component Architecture - Quick Reference

A quick reference guide for using the component library.

## Import Patterns

```tsx
// Import from specific layers
import { Button, Input, Text } from '@/components/atoms';
import { Card, SearchBar, Alert } from '@/components/molecules';
import { Header, Footer, StationCard } from '@/components/organisms';
import { MainLayout } from '@/components/templates';

// Import design tokens
import { colors, spacing, shadows } from '@/design-system/tokens';

// Import types
import type { PetrolStation, FuelPrice } from '@/types';
```

## Common Components Cheat Sheet

### Button
```tsx
<Button 
  variant="solid|outlined|ghost|link"
  color="primary|secondary|success|warning|error|info"
  size="xs|sm|md|lg|xl"
  disabled={false}
  loading={false}
  startIcon={<Icon />}
  endIcon={<Icon />}
  onClick={handler}
>
  Text
</Button>
```

### Input
```tsx
<Input
  label="Label"
  placeholder="Placeholder"
  type="text|email|password|number"
  size="sm|md|lg"
  error={false}
  errorMessage="Error text"
  helperText="Helper text"
  required
  disabled
  fullWidth
  startIcon={<Icon />}
  endIcon={<Icon />}
/>
```

### Text
```tsx
<Text 
  variant="h1|h2|h3|h4|h5|h6|body|bodySmall|label|caption"
  color="primary|secondary|disabled|inverse|success|warning|error"
  align="left|center|right|justify"
  weight="light|regular|medium|semibold|bold"
  truncate
  lineClamp={2}
  as="p|span|div|h1|h2|h3|h4|h5|h6"
>
  Content
</Text>

// Convenience components
<Heading1>Title</Heading1>
<BodyText>Paragraph</BodyText>
<Caption>Small text</Caption>
```

### Badge
```tsx
<Badge 
  variant="primary|secondary|success|warning|error|info|neutral"
  size="xs|sm|md|lg"
  appearance="solid|outlined|soft"
  dot
  icon={<Icon />}
  onRemove={handler}
>
  Label
</Badge>
```

### Spinner
```tsx
<Spinner 
  size="xs|sm|md|lg|xl"
  color="primary|secondary|success|warning|error|info|neutral"
  label="Loading..."
/>
```

### Card
```tsx
<Card 
  elevation="none|sm|md|lg"
  padding="none|sm|md|lg"
  bordered
  hoverable
  onClick={handler}
>
  <CardMedia src="/img.jpg" alt="Alt" aspectRatio="16/9" />
  <CardHeader>Header content</CardHeader>
  <CardBody>Main content</CardBody>
  <CardFooter>Footer content</CardFooter>
</Card>
```

### SearchBar
```tsx
<SearchBar
  value={query}
  onChange={setQuery}
  onSubmit={handleSearch}
  placeholder="Search..."
  loading={false}
  disabled={false}
  size="sm|md|lg"
  showButton={true}
/>
```

### Alert
```tsx
<Alert
  variant="success|warning|error|info"
  title="Alert Title"
  showIcon
  onClose={handler}
  action={{
    label: "Action",
    onClick: handler
  }}
>
  Alert message content
</Alert>
```

### Header
```tsx
<Header
  logo={<Logo />}
  logoText="Brand"
  navItems={[
    { label: 'Home', href: '/', active: true },
    { label: 'About', href: '/about' }
  ]}
  actions={<Button>Sign Up</Button>}
  sticky
  elevated
/>
```

### Footer
```tsx
<Footer
  sections={[
    {
      title: 'Section',
      links: [
        { label: 'Link', href: '/link', external: false }
      ]
    }
  ]}
  socialLinks={[
    { label: 'Twitter', href: 'https://twitter.com', icon: <Icon /> }
  ]}
  copyright="© {year} Company"
/>
```

### StationCard
```tsx
<StationCard
  station={stationData}
  onClick={handler}
  onViewDetails={handler}
  onGetDirections={handler}
  compact={false}
/>
```

### MainLayout
```tsx
<MainLayout
  header={{ logoText: 'App', navItems: [...] }}
  footer={{ sections: [...] }}
  maxWidth="sm|md|lg|xl|full"
  noPadding={false}
>
  {children}
</MainLayout>
```

## Design Tokens

### Colors
```tsx
colors.primary[500]
colors.secondary[500]
colors.success[500]
colors.warning[500]
colors.error[500]
colors.info[500]
colors.neutral[500]

colors.text.primary
colors.text.secondary
colors.background.default
colors.border.main
```

### Spacing
```tsx
spacing[0]   // 0
spacing[1]   // 0.25rem (4px)
spacing[2]   // 0.5rem (8px)
spacing[3]   // 0.75rem (12px)
spacing[4]   // 1rem (16px)
spacing[6]   // 1.5rem (24px)
spacing[8]   // 2rem (32px)
spacing[12]  // 3rem (48px)
spacing[16]  // 4rem (64px)
```

### Typography
```tsx
fontSize.xs   // 0.75rem
fontSize.sm   // 0.875rem
fontSize.base // 1rem
fontSize.lg   // 1.125rem
fontSize.xl   // 1.25rem

fontWeight.light     // 300
fontWeight.regular   // 400
fontWeight.medium    // 500
fontWeight.semibold  // 600
fontWeight.bold      // 700
```

### Shadows
```tsx
shadows.xs   // Subtle
shadows.sm   // Small
shadows.base // Base
shadows.md   // Medium
shadows.lg   // Large
shadows.xl   // Extra large

semanticShadows.card
semanticShadows.modal
semanticShadows.dropdown
```

### Border Radius
```tsx
borderRadius.none  // 0
borderRadius.sm    // 0.125rem
borderRadius.base  // 0.25rem
borderRadius.md    // 0.375rem
borderRadius.lg    // 0.5rem
borderRadius.xl    // 0.75rem
borderRadius.full  // 9999px
```

## Utility Functions

### Class Name Utility
```tsx
import { cn } from '@/design-system/utils/styled';

const className = cn(
  'base-class',
  isActive && 'active-class',
  isPrimary && 'primary-class',
  customClassName
);
```

### Color Utilities
```tsx
import { getVariantColor } from '@/design-system/utils/styled';

const color = getVariantColor('primary', 500);
```

### Style Utilities
```tsx
import { focusRing, disabledStyles, truncate, visuallyHidden } from '@/design-system/utils/styled';

<button style={focusRing(colors.primary[500])}>Button</button>
<div style={truncate}>Long text...</div>
<span style={visuallyHidden}>Screen reader only</span>
```

## Responsive Breakpoints

```tsx
breakpoints.xs   // 0px
breakpoints.sm   // 640px
breakpoints.md   // 768px
breakpoints.lg   // 1024px
breakpoints.xl   // 1280px
breakpoints['2xl'] // 1536px
```

## Accessibility Props

All components support:
```tsx
<Component
  ariaLabel="Descriptive label"
  ariaDescribedBy="description-id"
  testId="test-identifier"
/>
```

## Common Patterns

### Form with Validation
```tsx
<form onSubmit={handleSubmit}>
  <Input
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={!!errors.email}
    errorMessage={errors.email}
    required
  />
  <Button type="submit" loading={isSubmitting}>
    Submit
  </Button>
</form>
```

### Loading States
```tsx
{isLoading ? (
  <Spinner size="lg" />
) : (
  <Content />
)}

// Or
<Button loading={isLoading}>
  Save Changes
</Button>
```

### Conditional Rendering
```tsx
{showAlert && (
  <Alert variant="success" onClose={() => setShowAlert(false)}>
    Success message
  </Alert>
)}
```

### Grid Layout
```tsx
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: spacing[4]
}}>
  {items.map(item => (
    <Card key={item.id}>
      {/* Card content */}
    </Card>
  ))}
</div>
```

## TypeScript Tips

### Type Imports
```tsx
import type { ButtonProps } from '@/components/atoms';
import type { PetrolStation, FuelPrice } from '@/types';
```

### Component with Generic Types
```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <>{items.map(renderItem)}</>;
}
```

### Extending Component Props
```tsx
interface CustomButtonProps extends ButtonProps {
  customProp: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ customProp, ...buttonProps }) => {
  return <Button {...buttonProps}>{customProp}</Button>;
};
```

## Performance Tips

1. **Use React.memo for expensive components:**
```tsx
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});
```

2. **Lazy load heavy components:**
```tsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

3. **Use useCallback for handlers:**
```tsx
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

4. **Optimize re-renders:**
```tsx
const MemoizedChild = React.memo(Child);
```

## Common Issues & Solutions

### Issue: TypeScript errors with component props
**Solution:** Ensure you're importing types correctly:
```tsx
import type { ButtonProps } from '@/components/atoms';
```

### Issue: Styles not applying
**Solution:** Check CSS import order and specificity:
```tsx
import './Component.css';
```

### Issue: Design tokens not found
**Solution:** Verify tsconfig.json path aliases:
```json
{
  "paths": {
    "@/design-system/*": ["./src/design-system/*"]
  }
}
```

### Issue: Components not rendering
**Solution:** Check default exports vs named exports:
```tsx
// Named export
export { Button } from './Button';
import { Button } from './Button';

// Default export
export default Button;
import Button from './Button';
```

## Resources

- Full Documentation: `COMPONENT_ARCHITECTURE.md`
- Component Source: `src/components/`
- Design Tokens: `src/design-system/tokens/`
- TypeScript Types: `src/types/index.ts`

