# NorthernTradieCard Quick Start Guide

Get up and running with NorthernTradieCard in 5 minutes.

## Installation

The component is already part of your project. Install peer dependencies if needed:

```bash
npm install framer-motion clsx tailwind-merge
```

## Basic Usage

### 1. Simple Card

```tsx
import { NorthernTradieCard } from '@/components/NorthernTradieCard';

function MyComponent() {
  return (
    <NorthernTradieCard>
      <NorthernTradieCard.Content>Hello World!</NorthernTradieCard.Content>
    </NorthernTradieCard>
  );
}
```

### 2. Card with Header and Footer

```tsx
<NorthernTradieCard>
  <NorthernTradieCard.Header title="My Card" subtitle="Subtitle text" />
  <NorthernTradieCard.Content>
    Card content goes here
  </NorthernTradieCard.Content>
  <NorthernTradieCard.Footer>
    <button>Action</button>
  </NorthernTradieCard.Footer>
</NorthernTradieCard>
```

### 3. Card with Image

```tsx
<NorthernTradieCard variant="elevated">
  <NorthernTradieCard.Media src="/path/to/image.jpg" alt="Description" />
  <NorthernTradieCard.Header title="Card with Image" />
  <NorthernTradieCard.Content>
    Content below the image
  </NorthernTradieCard.Content>
</NorthernTradieCard>
```

### 4. Interactive Card

```tsx
<NorthernTradieCard clickable hoverable onClick={() => alert('Clicked!')}>
  <NorthernTradieCard.Content>Click me!</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### 5. Loading State

```tsx
const [loading, setLoading] = useState(true);

<NorthernTradieCard
  state={loading ? 'loading' : 'idle'}
  loadingMessage="Loading..."
>
  <NorthernTradieCard.Content>{data}</NorthernTradieCard.Content>
</NorthernTradieCard>;
```

## Common Patterns

### Product Card

```tsx
<NorthernTradieCard variant="elevated" hoverable>
  <NorthernTradieCard.Media src={product.image} alt={product.name} />
  <NorthernTradieCard.Header title={product.name} subtitle={product.category} />
  <NorthernTradieCard.Content>
    <p>{product.description}</p>
    <div className="text-2xl font-bold">${product.price}</div>
  </NorthernTradieCard.Content>
  <NorthernTradieCard.Footer>
    <button>Add to Cart</button>
  </NorthernTradieCard.Footer>
</NorthernTradieCard>
```

### Dashboard Stats

```tsx
<NorthernTradieCard variant="filled">
  <NorthernTradieCard.Header title="Total Users" icon={<UserIcon />} />
  <NorthernTradieCard.Content>
    <div className="text-3xl font-bold">1,234</div>
    <div className="text-green-600">↑ 12% from last month</div>
  </NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Error Handling

```tsx
const [error, setError] = useState(null);

<NorthernTradieCard
  state={error ? 'error' : 'idle'}
  errorMessage={error?.message}
>
  <NorthernTradieCard.Content>{content}</NorthernTradieCard.Content>
</NorthernTradieCard>;
```

## Tips

1. **Variants**: Use `elevated` for cards that need to stand out
2. **Sizes**: Stick with `md` for most use cases
3. **Animations**: Enable with `animated` prop for better UX
4. **Accessibility**: Always provide `ariaLabel` for clickable cards
5. **Performance**: The component is already optimized with `React.memo`

## Next Steps

- Check out [README.md](./README.md) for complete API documentation
- Browse [EXAMPLES.md](./EXAMPLES.md) for real-world use cases
- Run Storybook: `npm run storybook`
- Run tests: `npm test`

## Need Help?

- See full documentation in README.md
- Check examples in EXAMPLES.md
- View interactive demos in Storybook
- Review the TypeScript types in types.ts
