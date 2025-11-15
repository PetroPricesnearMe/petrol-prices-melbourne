# Petrol Prices Near Me - Design System Guide

## Overview

This document outlines the comprehensive design system for petrolpricesnearme.com.au, a modern, accessible, and performant web application for finding petrol prices in Melbourne.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Accessibility](#accessibility)
7. [Performance Optimization](#performance-optimization)
8. [Responsive Design](#responsive-design)
9. [Code Organization](#code-organization)

---

## Design Philosophy

### Core Principles

1. **User-Centric**: Designed for Melbourne motorists seeking quick, accurate fuel price information
2. **Data-Focused**: Optimized for displaying numerical data, maps, and listings
3. **Performance-First**: Sub-2-second load times on all major pages
4. **Mobile-First**: Fully responsive with touch-optimized interfaces
5. **Accessible**: WCAG AA compliant with semantic HTML and ARIA labels

---

## Color System

### Primary Colors

- **Primary Blue** (`--primary-500: #3B82F6`): Trust, reliability, main brand color
- **Secondary Green** (`--secondary-500: #10B981`): Success, eco-friendly, savings
- **Accent Orange** (`--accent-500: #F97316`): Call-to-action, urgency, highlights

### Neutral Grays

- `--gray-50` to `--gray-900`: Professional grayscale for text and backgrounds
- All colors are WCAG AA compliant for accessibility

### Fuel Brand Colors

```css
--brand-shell: #fbce07;
--brand-bp: #00853e;
--brand-caltex: #e31937;
--brand-seven-eleven: #f47920;
--brand-mobil: #e01f27;
--brand-united: #004c97;
```

### Usage

```css
/* Primary actions */
.btn-primary {
  background: var(--gradient-primary);
}

/* Text */
.text-primary {
  color: var(--text-primary); /* #111827 */
}
```

---

## Typography

### Font Stack

```css
--font-sans:
  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', Arial,
  sans-serif;
```

### Type Scale

- `--text-xs`: 0.75rem (12px)
- `--text-sm`: 0.875rem (14px)
- `--text-base`: 1rem (16px)
- `--text-lg`: 1.125rem (18px)
- `--text-xl`: 1.25rem (20px)
- `--text-2xl`: 1.5rem (24px)
- `--text-3xl`: 1.875rem (30px)
- `--text-4xl`: 2.25rem (36px)
- `--text-5xl`: 3rem (48px)
- `--text-6xl`: 3.75rem (60px)
- `--text-7xl`: 4.5rem (72px)

### Font Weights

- `--font-light`: 300
- `--font-normal`: 400
- `--font-medium`: 500
- `--font-semibold`: 600
- `--font-bold`: 700
- `--font-extrabold`: 800
- `--font-black`: 900

### Usage

```css
h1 {
  font-size: var(--text-5xl);
  font-weight: var(--font-extrabold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}
```

---

## Spacing & Layout

### Spacing Scale (based on 4px grid)

- `--space-1`: 0.25rem (4px)
- `--space-2`: 0.5rem (8px)
- `--space-3`: 0.75rem (12px)
- `--space-4`: 1rem (16px)
- `--space-6`: 1.5rem (24px)
- `--space-8`: 2rem (32px)
- `--space-12`: 3rem (48px)
- `--space-16`: 4rem (64px)
- `--space-20`: 5rem (80px)
- `--space-24`: 6rem (96px)

### Container Widths

- `--container-max`: 1400px (main content)

### Border Radius

- `--radius-sm`: 0.25rem (4px)
- `--radius-md`: 0.375rem (6px)
- `--radius-lg`: 0.5rem (8px)
- `--radius-xl`: 0.75rem (12px)
- `--radius-2xl`: 1rem (16px)
- `--radius-3xl`: 1.5rem (24px)
- `--radius-full`: 9999px (circular)

---

## Components

### Buttons

```jsx
// Primary Button
<button className="btn btn-primary">Find Stations</button>

// Secondary Button
<button className="btn btn-secondary">Learn More</button>

// Accent Button
<button className="btn btn-accent">Get Directions</button>

// Sizes
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary btn-lg">Large</button>
```

### Cards

```jsx
<div className="card">
  <div className="card-body">Content here</div>
</div>
```

### Advanced Filters Component

The `AdvancedFilters` component provides comprehensive search and filtering:

```jsx
<AdvancedFilters
  onFilterChange={handleFilterChange}
  stations={stations}
  activeFilters={activeFilters}
/>
```

**Features:**

- Text search across station name, address, suburb
- Fuel type filtering
- Brand filtering
- Region filtering
- Price range filtering
- Sort options (name, price, distance, updated)
- Active filter tags with removal
- Responsive collapse/expand interface

### Station Map Component

The `StationMap` component provides interactive mapping:

```jsx
<StationMap
  stations={filteredStations}
  onStationClick={handleStationClick}
  selectedStation={selectedStation}
  height={600}
/>
```

**Features:**

- Geolocation support
- Color-coded price markers
- Interactive station selection
- Map controls (zoom, geolocate)
- Responsive design

### Breadcrumbs Component

```jsx
<Breadcrumbs
  customCrumbs={[
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Directory', path: '/directory' },
    {
      label: 'North Melbourne',
      path: '/directory?region=north',
      isActive: true,
    },
  ]}
/>
```

### SEO Component

```jsx
<SEO
  title="Page Title"
  description="Page description"
  keywords="keywords, here"
  canonical="/page-url"
  structuredData={jsonLdData}
/>
```

---

## Accessibility

### WCAG AA Compliance

1. **Color Contrast**: All text meets 4.5:1 contrast ratio minimum
2. **Focus Indicators**: Visible focus states on all interactive elements
3. **ARIA Labels**: Proper labeling for screen readers
4. **Semantic HTML**: Proper use of headings, landmarks, and roles
5. **Keyboard Navigation**: Full keyboard accessibility

### Implementation

```jsx
// Example: Accessible Button
<button
  className="btn btn-primary"
  aria-label="Search for petrol stations"
  onClick={handleSearch}
>
  Search
</button>

// Example: Accessible Form
<input
  type="search"
  id="station-search"
  aria-label="Search stations"
  aria-describedby="search-help"
/>
<span id="search-help">Search by name, suburb, or address</span>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Optimization

### Code Splitting

All non-critical pages are lazy-loaded:

```javascript
const DirectoryPage = React.lazy(() => import('./components/DirectoryPageNew'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
```

### Image Optimization

- Lazy loading with `loading="lazy"`
- Proper `alt` text for accessibility
- WebP format where supported
- Responsive images with appropriate sizes

### Analytics Tracking

```javascript
import {
  trackPageView,
  trackSearch,
  trackStationInteraction,
} from '../utils/analytics';

// Track page views
useEffect(() => {
  trackPageView('Home');
}, []);

// Track search
trackSearch(searchQuery, resultsCount);

// Track station interactions
trackStationInteraction(stationId, 'directions', { name: stationName });
```

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.0s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

---

## Responsive Design

### Breakpoints

```css
--breakpoint-sm: 640px; /* Mobile landscape */
--breakpoint-md: 768px; /* Tablet */
--breakpoint-lg: 1024px; /* Desktop */
--breakpoint-xl: 1280px; /* Large desktop */
```

### Mobile-First Approach

```css
/* Mobile default */
.stations-grid {
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
  .stations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .stations-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Touch Optimization

- Minimum touch target size: 44x44px
- Proper spacing between interactive elements
- Swipe gestures for mobile navigation

---

## Code Organization

### File Structure

```
src/
├── components/          # React components
│   ├── AdvancedFilters.js
│   ├── AdvancedFilters.css
│   ├── Breadcrumbs.js
│   ├── Breadcrumbs.css
│   ├── SEO.js
│   ├── StationMap.js
│   ├── StationMap.css
│   ├── DirectoryPageNew.js
│   ├── DirectoryPageNew.css
│   ├── HomePage.js
│   ├── HomePage.css
│   └── ...
├── services/            # API and data services
│   └── DataSourceManager.js
├── utils/              # Utility functions
│   ├── analytics.js    # Analytics tracking
│   ├── validation.js   # Form validation
│   └── securityUtils.js
├── config/             # Configuration files
│   └── regions.js      # Melbourne regions config
├── styles/             # Global styles
│   ├── design-system.css    # Design system variables
│   ├── normalize.css        # CSS reset
│   └── cross-browser-utils.css
└── index.css           # Main stylesheet
```

### Component Structure

```jsx
/**
 * Component Name
 * Brief description of component purpose
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.propName - Prop description
 * @returns {JSX.Element} Component description
 */
const ComponentName = ({ propName }) => {
  // Component logic

  return (
    // JSX
  );
};

export default ComponentName;
```

### CSS Organization

1. **Component-specific styles**: Co-located with components
2. **Global styles**: In `src/styles/`
3. **Design system**: In `src/styles/design-system.css`
4. **Import order**:

   ```css
   /* 1. Normalize/Reset */
   @import './styles/normalize.css';

   /* 2. Design System */
   @import './styles/design-system.css';

   /* 3. Component styles */
   @import './components/ComponentName.css';
   ```

---

## Best Practices

### CSS

1. Use CSS variables from design system
2. Follow BEM naming convention where appropriate
3. Mobile-first responsive design
4. Minimize specificity
5. Use modern CSS (Grid, Flexbox)

### JavaScript

1. Use functional components with hooks
2. Implement error boundaries
3. Lazy load non-critical components
4. Optimize re-renders with `useCallback` and `useMemo`
5. Track analytics for user interactions

### Accessibility

1. Use semantic HTML
2. Provide ARIA labels for interactive elements
3. Ensure keyboard navigation
4. Test with screen readers
5. Maintain proper heading hierarchy

### Performance

1. Code split routes
2. Lazy load images
3. Minimize bundle size
4. Cache API responses
5. Use service workers for offline support

---

## Environment Variables

```env
# Mapbox for maps
REACT_APP_MAPBOX_TOKEN=your_mapbox_token

# Analytics endpoint (optional)
REACT_APP_ANALYTICS_ENDPOINT=https://analytics.example.com/track

# Google Analytics (optional)
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

---

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Android (last 2 versions)

---

## Resources

- [Design System Variables](/src/styles/design-system.css)
- [Component Examples](/src/components/)
- [Analytics Documentation](/src/utils/analytics.js)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Support

For questions or contributions, please contact the development team.

**Last Updated**: October 2025
**Version**: 2.0.0
