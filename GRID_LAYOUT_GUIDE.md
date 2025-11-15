# Responsive Grid Layout Guide

## 🎨 Visual Grid Structure

### Responsive Breakpoints

```
Mobile (< 640px)      Tablet (≥ 640px)      Desktop (≥ 1024px)     XL (≥ 1280px)
┌────────────────┐    ┌─────────┬─────────┐  ┌─────┬─────┬─────┐  ┌────┬────┬────┬────┐
│                │    │         │         │  │     │     │     │  │    │    │    │    │
│   1 Column     │    │    2    │ Columns │  │  3  │ Col │umns │  │ 4  │Col │umns│    │
│                │    │         │         │  │     │     │     │  │    │    │    │    │
└────────────────┘    └─────────┴─────────┘  └─────┴─────┴─────┘  └────┴────┴────┴────┘
```

## 📏 Tailwind Classes Used

### Grid Container

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
```

**Breakdown:**

- `grid` - Enables CSS Grid
- `grid-cols-1` - 1 column on mobile (< 640px)
- `sm:grid-cols-2` - 2 columns on small screens (≥ 640px)
- `lg:grid-cols-3` - 3 columns on large screens (≥ 1024px)
- `xl:grid-cols-4` - 4 columns on extra large (≥ 1280px)
- `gap-6` - 1.5rem (24px) gap between items
- `auto-rows-fr` - Equal height rows using fractional units

### Grid Items (Cards)

```jsx
<div className="h-full flex flex-col">
```

**Breakdown:**

- `h-full` - Fill the entire grid cell height
- `flex` - Enable flexbox
- `flex-col` - Stack content vertically

### Card Content Layout

```jsx
<div className="flex-1 flex flex-col justify-between">
```

**Breakdown:**

- `flex-1` - Grow to fill available space
- `flex flex-col` - Vertical flexbox layout
- `justify-between` - Space content evenly

## 🎯 Key Concepts

### 1. Uniform Heights

**Problem:** Cards with different content heights look uneven

**Solution:** Use `auto-rows-fr` + `h-full`

```jsx
// ❌ Wrong - Cards will have different heights
<div className="grid grid-cols-4 gap-6">
  <div className="card">Short content</div>
  <div className="card">Much longer content that takes up more space</div>
</div>

// ✅ Correct - All cards same height
<div className="grid grid-cols-4 gap-6 auto-rows-fr">
  <div className="card h-full">Short content</div>
  <div className="card h-full">Much longer content</div>
</div>
```

### 2. Consistent Gap Spacing

**Gap Size Reference:**

- `gap-2` = 0.5rem (8px) - Extra small
- `gap-4` = 1rem (16px) - Small
- `gap-6` = 1.5rem (24px) - **Recommended**
- `gap-8` = 2rem (32px) - Large
- `gap-10` = 2.5rem (40px) - Extra large

### 3. Vertical Rhythm

Maintain consistent spacing using Tailwind spacing utilities:

```jsx
<div className="space-y-4">
  {' '}
  {/* 1rem vertical spacing */}
  <div className="mb-2">...</div> {/* 0.5rem bottom margin */}
  <div className="mt-4">...</div> {/* 1rem top margin */}
</div>
```

## 📐 Complete Card Example

```jsx
<div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <div key={item.id} className="h-full">
      {/* Card with equal height */}
      <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md">
        {/* Fixed height image section */}
        <div className="h-48 bg-gray-200">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Flexible content section */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
          <p className="flex-1 text-gray-600">{item.description}</p>

          {/* Footer section */}
          <div className="mt-4 border-t pt-4">
            <button className="bg-blue-600 w-full rounded px-4 py-2 text-white">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

## 🎨 Visual Layout Breakdown

```
┌─────────────────────────────────────────┐
│ Grid Container (gap-6, auto-rows-fr)   │
│                                         │
│  ┌───────┐  ┌───────┐  ┌───────┐      │
│  │ Card  │  │ Card  │  │ Card  │      │
│  │ h-full│  │ h-full│  │ h-full│      │
│  │       │  │       │  │       │      │
│  │ ┌───┐ │  │ ┌───┐ │  │ ┌───┐ │      │
│  │ │Img│ │  │ │Img│ │  │ │Img│ │      │
│  │ └───┘ │  │ └───┘ │  │ └───┘ │      │
│  │       │  │       │  │       │      │
│  │ Title │  │ Title │  │ Title │      │
│  │       │  │       │  │       │      │
│  │ Text  │  │ Long  │  │ Short │      │
│  │ (f-1) │  │ Text  │  │ Text  │      │
│  │       │  │ Here  │  │ (f-1) │      │
│  │       │  │ (f-1) │  │       │      │
│  │ ───── │  │ ───── │  │ ───── │      │
│  │[Btn]  │  │[Btn]  │  │[Btn]  │      │
│  └───────┘  └───────┘  └───────┘      │
│     │          │          │            │
│     ↑          ↑          ↑            │
│  Same Height (auto-rows-fr)           │
└─────────────────────────────────────────┘
```

## 💡 Pro Tips

### 1. Use Flexbox Inside Grid Items

```jsx
<div className="flex h-full flex-col">
  <div>{/* Header */}</div>
  <div className="flex-1">{/* Flexible content */}</div>
  <div>{/* Footer */}</div>
</div>
```

### 2. Maintain Aspect Ratios for Images

```jsx
<div className="aspect-video bg-gray-200">
  <img src="..." className="h-full w-full object-cover" />
</div>
```

### 3. Use Space Utilities for Consistent Spacing

```jsx
<div className="space-y-4">
  {/* Children automatically get gap-4 between them */}
</div>
```

### 4. Responsive Gap Sizes

```jsx
<div className="gap-4 sm:gap-6 lg:gap-8">
  {/* Smaller gap on mobile, larger on desktop */}
</div>
```

## 🔧 Common Patterns

### Pattern 1: Image + Content + Actions

```jsx
<div className="flex h-full flex-col">
  <img src="..." className="h-48 object-cover" />
  <div className="flex-1 p-4">
    <h3>Title</h3>
    <p>Content</p>
  </div>
  <div className="border-t p-4">
    <button>Action</button>
  </div>
</div>
```

### Pattern 2: Equal Height Content Sections

```jsx
<div className="flex h-full flex-col justify-between p-4">
  <div>
    <h3>Title</h3>
    <p>Description</p>
  </div>
  <div>
    <button>Button</button>
  </div>
</div>
```

### Pattern 3: Grid with Different Column Counts

```jsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
  {/* Custom breakpoints for specific needs */}
</div>
```

## 📱 Responsive Behavior

### Mobile (< 640px)

```
┌──────────────┐
│   Card 1     │
├──────────────┤
│   Card 2     │
├──────────────┤
│   Card 3     │
└──────────────┘
1 column stack
```

### Tablet (640px - 1023px)

```
┌──────────┬──────────┐
│  Card 1  │  Card 2  │
├──────────┼──────────┤
│  Card 3  │  Card 4  │
└──────────┴──────────┘
2 columns side-by-side
```

### Desktop (1024px - 1279px)

```
┌──────┬──────┬──────┐
│ C1   │ C2   │ C3   │
├──────┼──────┼──────┤
│ C4   │ C5   │ C6   │
└──────┴──────┴──────┘
3 columns
```

### Large Desktop (≥ 1280px)

```
┌────┬────┬────┬────┐
│ C1 │ C2 │ C3 │ C4 │
├────┼────┼────┼────┤
│ C5 │ C6 │ C7 │ C8 │
└────┴────┴────┴────┘
4 columns
```

## ✅ Checklist for Grid Implementation

- [ ] Add `grid` class to container
- [ ] Add responsive column classes (`grid-cols-1 sm:grid-cols-2 ...`)
- [ ] Add `gap-6` for consistent spacing
- [ ] Add `auto-rows-fr` for equal heights
- [ ] Add `h-full` to each card wrapper
- [ ] Use `flex flex-col` inside cards
- [ ] Use `flex-1` for flexible content areas
- [ ] Test on all breakpoints
- [ ] Verify card heights are uniform
- [ ] Check gap spacing is consistent

## 🐛 Troubleshooting

### Cards have different heights

**Solution:** Add `auto-rows-fr` to grid and `h-full` to cards

### Content overflowing

**Solution:** Add `overflow-hidden` to card container

### Gaps look wrong

**Solution:** Use `gap-X` not `space-x-X` for grid

### Images distorted

**Solution:** Use `object-cover` on images

### Footer not at bottom

**Solution:** Use `flex flex-col` with `flex-1` on content

## 🎯 Summary

**Perfect Grid Formula:**

```jsx
<div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <div className="flex h-full flex-col">{/* Your card content */}</div>
</div>
```

This creates:
✅ Responsive layout
✅ Uniform heights
✅ Consistent spacing
✅ Perfect vertical rhythm

---

**Last Updated**: October 23, 2025
**Status**: Production Ready
