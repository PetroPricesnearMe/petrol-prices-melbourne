# Project Structure Guide

> **Version:** 2.0.0  
> **Last Updated:** 2025  
> **Purpose:** Complete reference for project organization and architecture

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Configuration Files](#configuration-files)
4. [Source Code Organization](#source-code-organization)
5. [Build Process](#build-process)
6. [Best Practices](#best-practices)

---

## Overview

This project follows a modern, scalable architecture optimized for:
- **Performance**: Sub-2s load times, code-splitting, lazy loading
- **Maintainability**: Clear separation of concerns, modular design
- **Scalability**: Easy to extend with new features and regions
- **SEO**: Comprehensive meta tags, schema markup, semantic HTML
- **Analytics**: Complete user tracking and performance monitoring

---

## Directory Structure

```
PPNM/
│
├── config/                      # Root-level configuration
│   ├── app.config.js           # Application settings
│   ├── theme.config.js         # Design system tokens
│   └── performance.config.js   # Performance budgets & optimization
│
├── docs/                        # Documentation
│   ├── architecture/           # System architecture docs
│   ├── development/            # Development guides
│   ├── deployment/             # Deployment instructions
│   ├── guides/                 # How-to guides
│   ├── maintenance/            # Maintenance workflows
│   └── project-history/        # Historical documentation
│
├── public/                      # Static assets (served as-is)
│   ├── data/                   # Static data files
│   │   ├── stations.csv
│   │   └── stations.geojson
│   ├── images/                 # Images and graphics
│   │   ├── brands/             # Brand logos (SVG)
│   │   └── stations/           # Station photos
│   ├── index.html              # HTML template
│   ├── manifest.json           # PWA manifest
│   ├── robots.txt              # SEO robots file
│   ├── sitemap.xml             # SEO sitemap
│   └── service-worker.js       # Service worker for caching
│
├── scripts/                     # Build and utility scripts
│   ├── optimize-images.js      # Image optimization script
│   ├── import-csv-to-baserow.js
│   └── test-baserow-import.js
│
├── src/                         # Source code
│   ├── components/             # React components
│   │   ├── HomePage.js         # Main landing page
│   │   ├── DirectoryPageNew.js # Station directory
│   │   ├── SEO.js              # Basic SEO component
│   │   ├── SEOEnhanced.js      # Advanced SEO component
│   │   ├── Navbar.js           # Navigation
│   │   ├── LoadingSpinner.js   # Loading states
│   │   ├── ErrorBoundary.js    # Error handling
│   │   └── [38 total files]
│   │
│   ├── config/                 # App-specific config
│   │   └── regions.js          # Regional settings
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useCancelOnUnmount.js
│   │   ├── useNetworkStatus.js
│   │   └── usePerformanceMonitor.js
│   │
│   ├── services/               # Business logic & API calls
│   │   ├── DataSourceManager.js
│   │   ├── FuelPriceService.js
│   │   └── LocalDataService.js
│   │
│   ├── styles/                 # Global styles
│   │   ├── design-system.css   # Design tokens & utilities
│   │   ├── normalize.css       # CSS reset
│   │   └── cross-browser-utils.css
│   │
│   ├── utils/                  # Utility functions
│   │   ├── analytics/          # Analytics utilities
│   │   │   ├── analyticsManager.js
│   │   │   └── performanceMonitoring.js
│   │   ├── brandLogo.js
│   │   ├── googleAnalytics.js
│   │   ├── imageOptimization.js
│   │   ├── securityUtils.js
│   │   └── validation.js
│   │
│   ├── App.js                  # Main app component
│   ├── index.js                # Entry point
│   ├── index.css               # Global styles
│   └── config.js               # Runtime configuration
│
├── database/                    # Database files and exports
│   └── [Baserow exports]
│
├── build/                       # Production build (generated)
│   └── [Build output]
│
├── node_modules/               # Dependencies (generated)
│
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies & scripts
├── package-lock.json           # Locked dependencies
├── vercel.json                 # Vercel deployment config
├── mcp.json                    # MCP configuration
└── README.md                   # Project overview
```

---

## Configuration Files

### Root Configuration (`/config`)

**Purpose:** Centralized configuration for scalability and maintainability

#### `app.config.js`
- Application metadata
- API endpoints
- Database configuration
- Feature flags
- Performance settings
- Regional settings

#### `theme.config.js`
- Color palette
- Typography scale
- Spacing system
- Component tokens
- Breakpoints
- Design tokens

#### `performance.config.js`
- Bundle size budgets
- Code-splitting strategy
- Image optimization rules
- Caching configuration
- Monitoring settings

### Runtime Configuration (`/src`)

#### `src/config.js`
- Runtime API configuration
- Baserow integration
- Dynamic settings
- Environment-specific config

#### `src/config/regions.js`
- Regional boundaries
- Melbourne suburbs
- Postal codes
- Geographic data

---

## Source Code Organization

### Components (`/src/components`)

**Naming Convention:** PascalCase, descriptive names

**Structure:**
```
ComponentName.js        # Component logic
ComponentName.css       # Component styles
```

**Categories:**
- **Pages:** Full-page components (HomePage, DirectoryPage, etc.)
- **Layout:** Navigation, footer, containers
- **Features:** Station cards, maps, filters
- **UI:** Buttons, modals, spinners
- **Utilities:** SEO, error boundaries, network status

### Services (`/src/services`)

**Purpose:** Business logic and external API communication

- `DataSourceManager.js`: Handles data fetching strategy
- `FuelPriceService.js`: Fuel price calculations
- `LocalDataService.js`: Local data operations

**Pattern:** Service objects with methods, no React dependencies

### Hooks (`/src/hooks`)

**Purpose:** Reusable stateful logic

**Naming:** `use[FeatureName]`

Examples:
- `useNetworkStatus`: Monitor online/offline state
- `usePerformanceMonitor`: Track component performance
- `useCancelOnUnmount`: Cleanup on unmount

### Utils (`/src/utils`)

**Purpose:** Pure functions, no side effects

**Organization:**
- `analytics/`: Analytics and tracking
- Individual utility files for specific features

**Examples:**
- `brandLogo.js`: Brand logo utilities
- `imageOptimization.js`: Image handling
- `validation.js`: Input validation
- `securityUtils.js`: Security helpers

### Styles (`/src/styles`)

**Global Styles Only**

- `design-system.css`: Design tokens and utilities
- `normalize.css`: Cross-browser reset
- `cross-browser-utils.css`: Browser compatibility

**Component Styles:** Co-located with components

---

## Build Process

### Development Build

```bash
npm start
```

**Process:**
1. Webpack Dev Server starts
2. Hot Module Replacement enabled
3. Source maps generated
4. Development optimizations
5. Runs on `http://localhost:3000`

### Production Build

```bash
npm run build
```

**Process:**
1. Code splitting applied
2. Minification (Terser)
3. CSS extraction and minification
4. Image optimization
5. Hash-based versioning
6. Service worker generation
7. Source maps (optional)

**Output:** `/build` directory

### Build Optimization

**Automatic:**
- Tree shaking (remove unused code)
- Code splitting (route-based)
- Lazy loading (React.lazy)
- Asset optimization
- Compression (gzip/brotli)

**Manual Optimization:**
```bash
# Analyze bundle
npm run build:analyze

# Optimize images
npm run optimize-images

# Run performance tests
npm run performance-test
```

---

## Best Practices

### File Organization

✅ **DO:**
- Keep related files together
- Use descriptive, clear names
- Follow consistent naming conventions
- Group by feature, not by type

❌ **DON'T:**
- Create deeply nested folders (max 3-4 levels)
- Mix configuration with source code
- Put all utilities in one file
- Use generic names (utils.js, helpers.js)

### Component Structure

✅ **DO:**
```javascript
// Component logic
import React from 'react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks at top
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {};
  
  // Render
  return <div>...</div>;
};

export default ComponentName;
```

❌ **DON'T:**
- Mix business logic in components
- Create components > 300 lines
- Use inline styles (except dynamic)
- Forget PropTypes/TypeScript types

### Import Organization

✅ **Recommended Order:**
```javascript
// 1. External dependencies
import React from 'react';
import { Link } from 'react-router-dom';

// 2. Internal utilities
import { formatPrice } from '../utils/formatting';

// 3. Components
import Button from './Button';

// 4. Styles
import './styles.css';
```

### Performance Best Practices

1. **Code Splitting**
   - Split by route
   - Lazy load heavy components
   - Use React.lazy() and Suspense

2. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Provide responsive images

3. **Caching**
   - Leverage service worker
   - Set appropriate cache headers
   - Use cache-busting for updates

4. **Bundle Size**
   - Monitor bundle size
   - Remove unused dependencies
   - Use tree-shaking

### SEO Best Practices

1. **Meta Tags**
   - Use SEOEnhanced component
   - Unique title per page
   - Descriptive meta descriptions

2. **Schema Markup**
   - Implement JSON-LD
   - Use appropriate schema types
   - Validate with Google tools

3. **Performance**
   - Optimize Core Web Vitals
   - Ensure mobile-friendliness
   - Fast page load times

### Security Best Practices

1. **Environment Variables**
   - Never commit secrets
   - Use `.env.local` for sensitive data
   - Validate all inputs

2. **Dependencies**
   - Regular security audits
   - Keep dependencies updated
   - Review CVE reports

---

## Scaling Considerations

### Adding New Features

1. Create feature branch
2. Add component in `/src/components`
3. Add service in `/src/services` if needed
4. Update routes in `App.js`
5. Add tests
6. Update documentation

### Adding New Regions

1. Update `config/app.config.js`
2. Add region data in `src/config/regions.js`
3. Update database with new stations
4. Add regional SEO content
5. Test thoroughly

### Performance Monitoring

- Use Performance API
- Monitor Core Web Vitals
- Track bundle size trends
- Review analytics regularly

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2025-01-14 | Complete restructuring and optimization |
| 1.0.0 | 2024-12-01 | Initial project structure |

---

**Maintained by:** Development Team  
**Last Review:** 2025-01-14  
**Next Review:** 2025-04-14

