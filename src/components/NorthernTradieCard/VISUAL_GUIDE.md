# NorthernTradieCard Visual Guide

Quick visual reference for all component features.

## Component Structure

```
┌─────────────────────────────────────────┐
│  NorthernTradieCard                     │  ← Root Container
│ ┌─────────────────────────────────────┐ │
│ │  CardMedia (Optional)               │ │  ← Images/Media
│ │  - Images                           │ │
│ │  - Custom content                   │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │  CardHeader (Optional)              │ │  ← Title Area
│ │  [Icon] Title           [Action]    │ │
│ │         Subtitle                    │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │  CardContent                        │ │  ← Main Content
│ │  Main content goes here             │ │
│ │  - Text                             │ │
│ │  - Forms                            │ │
│ │  - Any React component              │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │  CardFooter (Optional)              │ │  ← Action Area
│ │  [Button]              [Button]     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Variants Visual Comparison

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  DEFAULT    │  │  ELEVATED   │  │  OUTLINED   │
│             │  │             │  │             │
│  White BG   │  │  Shadow     │  │  Border     │
│  Border     │  │  White BG   │  │  Trans BG   │
└─────────────┘  └─────────────┘  └─────────────┘
      ▲                ▲                ▲
   Standard        Depth Effect    Minimal Style

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  FILLED     │  │ INTERACTIVE │  │  FEATURED   │
│             │  │             │  │             │
│  Gray BG    │  │  Hover FX   │  │  Gradient   │
│  Subtle     │  │  Clickable  │  │  Premium    │
└─────────────┘  └─────────────┘  └─────────────┘
      ▲                ▲                ▲
   Soft Style      User Action      Highlighted
```

## Sizes Visual Comparison

```
┌──┐      XS (Extra Small)
│  │      Padding: 0.5rem
└──┘      Text: xs

┌────┐    SM (Small)
│    │    Padding: 0.75rem
└────┘    Text: sm

┌──────┐  MD (Medium) - Default
│      │  Padding: 1rem
└──────┘  Text: base

┌──────────┐  LG (Large)
│          │  Padding: 1.5rem
└──────────┘  Text: lg

┌──────────────┐  XL (Extra Large)
│              │  Padding: 2rem
└──────────────┘  Text: xl
```

## States Visual Guide

### Idle State (Default)
```
┌─────────────────────────┐
│  Card Title             │
│  Normal content display │
│  [Action Button]        │
└─────────────────────────┘
```

### Loading State
```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │   ⟳  Loading...   │  │ ← Overlay
│  └───────────────────┘  │
│  (content dimmed)       │
└─────────────────────────┘
```

### Error State
```
┌─────────────────────────┐
│  ⚠ Error Message        │ ← Alert Banner
│  Card content           │
│  [Retry Button]         │
└─────────────────────────┘
```

### Success State
```
┌─────────────────────────┐
│  ✓ Success!             │ ← Success Styling
│  Operation completed    │
│  [Continue Button]      │
└─────────────────────────┘
```

## Animation Timeline

```
Component Mount:
─────────────────────────────────────────→ Time
0ms          100ms         200ms      400ms

opacity: 0 ──────────────────────────→ 1
y: 20px ──────────────────────────────→ 0
scale: 0.95 ──────────────────────────→ 1
                                      ▲
                                   Complete
```

### Hover Animation
```
Normal State    Hover State
    │              │
    │   150ms      │
    ├─────────────→│
    │              │
   y: 0          y: -4px
```

### Click Animation
```
Normal    Press     Release
  │         │         │
  │  100ms  │  100ms  │
  ├────────→├────────→│
  │         │         │
scale: 1  0.98      1
```

## Accessibility Features

```
┌─────────────────────────────────────┐
│  [Tab] ← Focus Navigation          │
│  ┌───────────────────────────────┐ │
│  │ [Icon] Card Title    [Action] │ │
│  │        Subtitle                │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Main Content                  │ │
│  │ - Screen reader friendly      │ │
│  │ - ARIA labels                 │ │
│  └───────────────────────────────┘ │
│  [Enter/Space] ← Keyboard Actions  │
└─────────────────────────────────────┘
      ↑
  role="button" or "article"
  aria-label="..."
  tabIndex={0}
```

## Interactive Card Flow

```
User Action Flow:
─────────────────────────────────────────→

1. Visual Focus        2. Keyboard Input    3. Action
   ┌──────────┐          ┌──────────┐         ┌──────────┐
   │ [FOCUS]  │   Tab    │ [ACTIVE] │  Enter  │ onClick  │
   │  Ring    │─────────→│  Ready   │────────→│ Triggered│
   └──────────┘          └──────────┘         └──────────┘
       ↑                                           │
       └───────────────────────────────────────────┘
                     Loop Back
```

## Responsive Behavior

```
Mobile (< 768px)
┌─────────────┐
│   Card 1    │  ← Stack vertically
├─────────────┤
│   Card 2    │
├─────────────┤
│   Card 3    │
└─────────────┘

Tablet (768px - 1024px)
┌───────────┬───────────┐
│  Card 1   │  Card 2   │  ← 2 columns
├───────────┼───────────┤
│  Card 3   │  Card 4   │
└───────────┴───────────┘

Desktop (> 1024px)
┌─────────┬─────────┬─────────┐
│ Card 1  │ Card 2  │ Card 3  │  ← 3 columns
└─────────┴─────────┴─────────┘
```

## Compound Component Usage

```tsx
// Basic Structure
<NorthernTradieCard>
  <NorthernTradieCard.Media />      // Optional
  <NorthernTradieCard.Header />     // Optional
  <NorthernTradieCard.Content />    // Required
  <NorthernTradieCard.Footer />     // Optional
</NorthernTradieCard>

// Minimal Usage
<NorthernTradieCard>
  <NorthernTradieCard.Content>
    Content only
  </NorthernTradieCard.Content>
</NorthernTradieCard>

// Full Usage
<NorthernTradieCard 
  variant="elevated"
  size="lg"
  clickable
  animated
>
  <NorthernTradieCard.Media src="..." />
  <NorthernTradieCard.Header 
    title="..." 
    subtitle="..."
    icon={<Icon />}
    action={<Button />}
  />
  <NorthernTradieCard.Content>
    Rich content here
  </NorthernTradieCard.Content>
  <NorthernTradieCard.Footer align="between">
    <Button />
    <Button />
  </NorthernTradieCard.Footer>
</NorthernTradieCard>
```

## Common Patterns

### Product Card
```
┌─────────────────┐
│    [IMAGE]      │  ← Media
├─────────────────┤
│ Product Name    │  ← Header
│ Category        │
├─────────────────┤
│ Description     │  ← Content
│ $99.99          │
├─────────────────┤
│ [Add to Cart]   │  ← Footer
└─────────────────┘
```

### Stats Card
```
┌─────────────────┐
│ [📊] Metric     │  ← Header with icon
├─────────────────┤
│    1,234        │  ← Content (large number)
│    ↑ 12%       │  ← Change indicator
└─────────────────┘
```

### Action Card
```
┌─────────────────┐
│ Title           │  ← Header
│ [×]             │  ← Close action
├─────────────────┤
│ Message text    │  ← Content
├─────────────────┤
│    [Action]     │  ← Footer
└─────────────────┘
```

## Color Scheme

```
DEFAULT:
- Background: white
- Border: gray-200
- Text: gray-900

ELEVATED:
- Background: white
- Shadow: md → lg (hover)
- Border: none

OUTLINED:
- Background: transparent
- Border: gray-300 (2px)
- Text: gray-900

FILLED:
- Background: gray-50
- Border: gray-100
- Text: gray-900

INTERACTIVE:
- Background: white
- Border: gray-200
- Hover: scale(1.02)
- Active: scale(0.98)

FEATURED:
- Background: gradient (blue-50 → purple-50)
- Border: blue-200 (2px)
- Shadow: lg
```

## Performance Optimization

```
Component Tree:
                 NorthernTradieCard
                 (React.memo)
                        │
        ┌───────┬───────┼───────┬───────┐
        │       │       │       │       │
      Media  Header Content Footer  State
     (memo)  (memo)  (memo)  (memo)
        │       │       │       │
     useMemo useMemo useMemo useCallback
        │       │       │       │
    Prevents re-renders unless props change
```

## Quick Reference

| Feature | Prop | Values |
|---------|------|--------|
| **Variant** | `variant` | default, elevated, outlined, filled, interactive, featured |
| **Size** | `size` | xs, sm, md, lg, xl |
| **State** | `state` | idle, loading, error, success |
| **Interactive** | `clickable` | true/false |
| **Animation** | `animated` | true/false |
| **Accessibility** | `ariaLabel` | string |
| **Styling** | `className` | string |
| **Shadow** | `shadow` | false, true, sm, md, lg, xl |

## File Locations

```
src/components/NorthernTradieCard/
│
├── 📄 index.ts                    Main export
├── 📄 NorthernTradieCard.tsx     Main component
├── 📄 types.ts                   TypeScript types
├── 📄 styles.ts                  Styling config
├── 📄 utils.ts                   Helper functions
│
├── 📄 CardHeader.tsx             Sub-component
├── 📄 CardContent.tsx            Sub-component
├── 📄 CardFooter.tsx             Sub-component
├── 📄 CardMedia.tsx              Sub-component
│
├── 📄 README.md                  Full docs
├── 📄 EXAMPLES.md                Real examples
├── 📄 QUICKSTART.md              Quick guide
├── 📄 VISUAL_GUIDE.md            This file
│
├── 📄 NorthernTradieCard.stories.tsx  Storybook
│
└── 📁 __tests__/
    ├── 📄 NorthernTradieCard.test.tsx
    └── 📄 utils.test.ts
```

---

**Quick Commands:**

```bash
# View in Storybook
npm run storybook

# Run tests
npm test

# Try demo page
npm run dev  # → /northern-tradie-card-demo

# Type check
npm run type-check
```

