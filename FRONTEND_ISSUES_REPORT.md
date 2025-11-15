# Frontend Issues Report

**Generated:** October 17, 2025  
**Project:** Melbourne Petrol Stations (PPNM)  
**Scan Type:** Comprehensive Frontend Architecture & Code Quality Audit

---

## 🚨 CRITICAL ISSUES (HIGH PRIORITY)

### 1. **Dual Architecture Conflict** ⚠️ SEVERE

**Status:** BLOCKING - This is causing the project to be non-functional

**Problem:**
The project has **TWO competing frontend architectures** running simultaneously:

- **Create React App (CRA)** structure in `src/` directory
- **Next.js** structure in `pages/` directory

**Evidence:**

- `src/App.js` - CRA entry point with React Router
- `src/index.js` - CRA bootstrap file
- `pages/_app.js` - Next.js app wrapper
- `pages/index.js` - Next.js homepage
- `pages/directory.js` - Next.js directory page
- `public/index.html` - CRA HTML template (Next.js doesn't use this)

**Impact:**

- **Cannot deploy both architectures simultaneously**
- Confusing which files are actually being used
- Duplicate components (HomePage, DirectoryPage, Navbar)
- Build conflicts and routing errors
- Developer confusion about which system is active
- Wasted code maintenance on unused files

**Files Affected:**

```
Duplicate Implementations:
- src/App.js vs pages/_app.js
- src/components/HomePage.js vs pages/index.js
- src/components/DirectoryPageNew.js vs pages/directory.js
- src/components/Navbar.js vs components/layout/NavbarNext.js
- src/components/Breadcrumbs.js vs components/layout/BreadcrumbsNext.js
- src/components/RegionSelector.js vs components/features/RegionSelectorNext.js
```

**Recommendation:**

- **DECISION REQUIRED:** Choose ONE architecture (recommend Next.js for SEO benefits)
- Remove all unused files from the rejected architecture
- Update all import statements
- Clean up package.json scripts

---

### 2. **Conflicting Router Systems** ⚠️ SEVERE

**Status:** BLOCKING

**Problem:**
Project uses **BOTH** routing systems simultaneously:

- `react-router-dom` (v6.8.0) for CRA
- Next.js file-based routing

**Evidence:**

```javascript
// src/App.js - React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// src/components/Navbar.js
import { Link, useLocation } from 'react-router-dom';

// components/layout/NavbarNext.js
import Link from 'next/link';
import { usePathname } from 'next/navigation';
```

**Impact:**

- Navigation breaks when wrong Link component is used
- `useLocation()` fails in Next.js pages
- `usePathname()` fails in CRA components
- Inconsistent URL handling
- Browser history issues

**Recommendation:**

- Remove react-router-dom if using Next.js
- OR remove Next.js pages if using CRA
- Standardize all navigation components
- Update all Link imports

---

### 3. **Unused HTML Template** ⚠️ MEDIUM

**Status:** Code cleanup needed

**Problem:**
`public/index.html` exists with extensive critical CSS and meta tags, but **Next.js doesn't use this file**. Next.js uses `pages/_document.js` instead.

**Evidence:**

- 734 lines of HTML in `public/index.html`
- Contains critical CSS, meta tags, structured data
- Completely ignored when running Next.js
- `pages/_document.js` has minimal meta tags by comparison

**Impact:**

- SEO optimizations in `public/index.html` are not applied
- Performance optimizations (critical CSS, preconnects) are lost
- Confusion about which meta tags are actually used
- Maintenance burden on unused code

**Recommendation:**

- **If using Next.js:** Move critical optimizations to `pages/_document.js`
- Delete `public/index.html` or clearly mark as unused
- Consolidate SEO and performance optimizations

---

### 4. **Missing Pages Implementation** ⚠️ HIGH

**Status:** Incomplete migration

**Problem:**
Next.js pages exist but lack proper content - they're just shells:

```javascript
// pages/about.js - Only 26 lines, mostly empty
export default function AboutPage() {
  return (
    <>
      <Head>...</Head>
      <div className="about-page">
        <BreadcrumbsNext />
        <h1>About Melbourne Fuel</h1>
        {/* Rest of about content */} ← NOT IMPLEMENTED
      </div>
    </>
  );
}
```

**Affected Pages:**

- `pages/about.js` - No content, just comment
- `pages/blog.js` - No content, just comment
- `pages/faq.js` - Likely similar issue

Meanwhile, full implementations exist in:

- `src/components/AboutPage.js`
- `src/components/BlogPage.js`
- `src/components/FAQPage.js`

**Recommendation:**

- Complete migration of content to Next.js pages
- OR delete incomplete Next.js pages if keeping CRA

---

## ⚠️ HIGH PRIORITY ISSUES

### 5. **React 19 Compatibility Concerns**

**Status:** Potential runtime errors

**Problem:**
Project uses React 19.2.0 (latest) with older dependencies:

```json
"react": "^19.2.0",
"react-dom": "^19.2.0",
"react-router-dom": "^6.8.0",  // From Feb 2023
"react-scripts": "5.0.1",       // CRA v5
"styled-components": "^5.3.9",  // May not support React 19
"framer-motion": "^11.15.0",    // Check compatibility
```

**Concerns:**

- `react-router-dom@6.8.0` is from Feb 2023, may not fully support React 19
- `styled-components@5.3.9` may have issues with React 19
- `react-scripts@5.0.1` (CRA) is not designed for React 19
- Potential PropTypes warnings or errors

**Recommendation:**

- Update `react-router-dom` to latest (v7.x)
- Consider upgrading `styled-components` to v6
- Test thoroughly for React 19 compatibility
- Add `.npmrc` with `legacy-peer-deps=true` (already present)

---

### 6. **Unused Dependencies**

**Status:** Bundle bloat

**Problem:**
Several dependencies appear unused or redundant:

```json
"styled-components": "^5.3.9"  // Only used in 1 file (securityUtils.js)
"socket.io-client": "^4.6.1"   // WebSocket - no evidence of usage
"express": "^5.1.0"            // Backend server in frontend project
"cors": "^2.8.5"               // Backend middleware
```

**Impact:**

- Larger bundle size
- Slower installs
- Security vulnerabilities in unused packages
- Confusion about project architecture

**Recommendation:**

- Audit and remove unused dependencies
- Separate backend (Express) from frontend if needed
- Use tree-shaking and proper imports

---

### 7. **Component Duplication**

**Status:** Maintenance burden

**Problem:**
Many components exist in duplicate:

| Component      | CRA Version                          | Next.js Version                             |
| -------------- | ------------------------------------ | ------------------------------------------- |
| Homepage       | `src/components/HomePage.js`         | `pages/index.js`                            |
| Directory      | `src/components/DirectoryPageNew.js` | `pages/directory.js`                        |
| Navbar         | `src/components/Navbar.js`           | `components/layout/NavbarNext.js`           |
| Breadcrumbs    | `src/components/Breadcrumbs.js`      | `components/layout/BreadcrumbsNext.js`      |
| RegionSelector | `src/components/RegionSelector.js`   | `components/features/RegionSelectorNext.js` |

**Impact:**

- Bug fixes must be applied twice
- Features may diverge between versions
- Confusion about which component is active
- Wasted development time

**Recommendation:**

- Delete unused version after architecture decision
- Consolidate shared logic into reusable components

---

## 📊 MEDIUM PRIORITY ISSUES

### 8. **Build Confusion**

**Status:** Developer experience issue

**Problem:**
`package.json` has conflicting scripts:

```json
"scripts": {
  "dev": "next dev",           // Next.js dev server
  "build": "next build",       // Next.js build
  "start": "next start",       // Next.js production
  "cra-start": "react-scripts start",  // CRA dev server
  "cra-build": "react-scripts build",  // CRA build
  "test": "react-scripts test"         // Uses CRA testing
}
```

**Impact:**

- Developers may run wrong command
- CI/CD may build wrong version
- `npm run dev` runs Next.js but tests run CRA

**Recommendation:**

- Remove scripts for unused architecture
- Add clear comments in package.json
- Update CI/CD to use correct commands

---

### 9. **CSS Import Strategy Issues**

**Status:** Performance concern

**Problem:**
`pages/_app.js` imports ALL component CSS globally:

```javascript
import '../src/components/Navbar.css';
import '../src/components/HomePage.css';
import '../src/components/DirectoryPageNew.css';
import '../src/components/RegionSelector.css';
// ... 20+ CSS imports
```

**Impact:**

- Every page loads CSS for all components
- No code splitting for CSS
- Larger initial bundle size
- Slower First Contentful Paint (FCP)

**Recommendation:**

- Use CSS Modules or CSS-in-JS for component-scoped styles
- Implement dynamic imports for route-specific CSS
- Consider Tailwind CSS or styled-components for better scoping

---

### 10. **Mixed Link Components**

**Status:** Runtime errors likely

**Problem:**
Components mix `<Link>` from react-router-dom and next/link:

```javascript
// src/components/HomePage.js
import { Link } from 'react-router-dom';
<Link to="/directory">Directory</Link>;

// pages/index.js
import Link from 'next/link';
<Link href="/directory">Directory</Link>;
```

**Impact:**

- `<Link to="...">` doesn't work in Next.js
- `<Link href="...">` doesn't work in CRA
- Navigation may break completely
- Hard-to-debug routing issues

---

### 11. **Inconsistent Data Fetching**

**Status:** Architecture concern

**Problem:**
Data fetching approaches are mixed:

```javascript
// Next.js pages use getStaticProps (SSG)
export async function getStaticProps() {
  const stations = await loadStationsFromGeoJSON();
  // ...
}

// CRA components use useEffect + DataSourceManager
useEffect(() => {
  const loadStations = async () => {
    const data = await dataSourceManager.fetchStations();
    // ...
  };
}, []);
```

**Impact:**

- Duplicate data loading logic
- Different user experiences (SSG vs CSR)
- Potential hydration mismatches
- SEO differences between versions

---

### 12. **Server-Side Code in Frontend**

**Status:** Architecture smell

**Problem:**
`server.js` exists in root directory with Express server code, but project is frontend-only per deployment config.

**Files:**

- `server.js` - Express server
- Dependencies: `express`, `cors`, `dotenv`
- But `vercel.json` and package.json are configured for Next.js

**Recommendation:**

- Clarify if backend is needed
- If yes, separate into `/api` or separate project
- If no, remove server files and dependencies

---

## 🔍 LOW PRIORITY / CODE QUALITY ISSUES

### 13. **`public/` vs `build/` Redundancy**

**Status:** File organization

**Problem:**

- `public/` directory exists (Next.js static files)
- `build/` directory exists (CRA output)
- Both contain duplicate assets (images, data files)

**Recommendation:**

- Remove `build/` if using Next.js
- Consolidate static assets in `public/`

---

### 14. **Inconsistent Motion Component Usage**

**Status:** Minor concern

**Problem:**
`src/components/MotionComponents.js` provides wrappers for framer-motion, but usage is inconsistent:

```javascript
// Some files use wrappers
import { MotionDiv, MotionH1 } from './MotionComponents';

// Others use framer-motion directly
import { motion } from 'framer-motion';
```

**Recommendation:**

- Standardize on one approach
- Either use wrappers everywhere or remove them

---

### 15. **Legacy Build Directory**

**Status:** Cleanup needed

**Problem:**
`build/` directory is committed to repository with compiled code:

- `build/static/js/` - 2,000+ lines of minified code
- `build/static/css/` - Compiled CSS
- Should be in `.gitignore`

**Recommendation:**

- Add `build/` to `.gitignore`
- Remove from repository
- Let CI/CD build fresh deployments

---

### 16. **'use client' Directive in Wrong Context**

**Status:** Next.js 13+ App Router confusion

**Problem:**

```javascript
// components/layout/NavbarNext.js
'use client';
```

This directive is for Next.js 13+ App Router, but project uses Pages Router (pages/ directory).

**Impact:**

- Directive is ignored in Pages Router
- May cause confusion for developers
- Not harmful but unnecessary

**Recommendation:**

- Remove 'use client' directives if using Pages Router
- OR migrate to App Router (major refactor)

---

## 📋 RECOMMENDATIONS SUMMARY

### Immediate Actions (Critical):

1. **🎯 DECISION: Choose CRA OR Next.js** - Cannot have both
   - If Next.js: Delete `src/App.js`, `src/index.js`, CRA components
   - If CRA: Delete `pages/` directory, remove Next.js
2. **Remove conflicting router** - Keep only one routing system
3. **Complete page implementations** - Finish Next.js page content or remove pages
4. **Update dependencies** - Ensure React 19 compatibility

### High Priority Actions:

5. **Consolidate components** - Remove duplicates
6. **Clean up unused dependencies** - Remove express, socket.io, styled-components if unused
7. **Fix CSS import strategy** - Implement proper code splitting
8. **Update build scripts** - Remove conflicting package.json scripts

### Medium Priority:

9. **Separate backend from frontend** - If server.js is needed
10. **Standardize data fetching** - Choose SSG, SSR, or CSR consistently
11. **Update documentation** - Clarify architecture choice
12. **Add `.gitignore` entries** - Exclude build artifacts

### Low Priority:

13. **Remove build/ from git** - Build artifacts shouldn't be committed
14. **Standardize motion components** - Consistent framer-motion usage
15. **Clean up 'use client'** - Remove if not using App Router

---

## 🎨 ARCHITECTURE DECISION REQUIRED

The team must decide on ONE architecture:

### Option A: Next.js (RECOMMENDED)

**Pros:**

- Better SEO (SSG/SSR capabilities)
- Built-in routing and code splitting
- Optimized images and fonts
- API routes included
- Modern React patterns
- Already partially implemented

**Cons:**

- More complex than CRA
- Steeper learning curve
- Requires migration work

**Migration Effort:**

- Delete: `src/App.js`, `src/index.js`, `public/index.html`
- Move logic from `src/components/` pages to `pages/`
- Update all imports and routing
- Estimated: 2-3 days

### Option B: Create React App

**Pros:**

- Simpler architecture
- Familiar to most React developers
- Most components already built
- Less configuration

**Cons:**

- Worse SEO (pure CSR)
- Manual code splitting
- No SSG/SSR capabilities
- CRA is in maintenance mode (no longer actively developed)

**Migration Effort:**

- Delete: `pages/`, `components/layout/`, `components/features/`
- Remove Next.js dependencies
- Update package.json scripts
- Estimated: 1 day

---

## 📈 IMPACT ANALYSIS

### Current State:

- ❌ Project cannot be properly deployed in current state
- ❌ Navigation is broken due to router conflicts
- ❌ Developers are confused about which files are active
- ❌ Bundle size is bloated with duplicate code
- ❌ SEO optimizations are inconsistent

### After Fixes:

- ✅ Single, clear architecture
- ✅ Working navigation
- ✅ Smaller bundle size
- ✅ Consistent developer experience
- ✅ Properly optimized for production

---

## 🚀 NEXT STEPS FOR OTHER AGENTS

### For API Agent:

- Review API routes in `pages/api/` (Next.js)
- Clarify if `server.js` is needed
- Ensure API endpoints match frontend expectations

### For Database Agent:

- Review `dataSourceManager` and data fetching
- Confirm data structure matches component expectations
- Check if SSG data fetching is properly configured

### For Testing Agent:

- Current tests use `react-scripts test` (CRA)
- Will need to update test setup after architecture decision
- Add integration tests for routing

### For Deployment Agent:

- `vercel.json` is configured for Next.js
- If keeping Next.js, ensure all pages are complete
- If switching to CRA, update deployment config

---

## 📝 CONCLUSION

This project has **significant architectural conflicts** that must be resolved before it can function properly. The dual CRA/Next.js setup is **blocking deployment and causing runtime errors**.

**Primary Recommendation:**
Commit to **Next.js architecture**, complete the migration, and delete all CRA-specific code. This provides the best long-term value with better SEO, performance, and modern React patterns.

**Estimated Effort:** 2-3 days of focused work to complete migration and cleanup.

---

**Report Generated By:** Frontend Scanning Agent  
**For Questions:** Share this report with team lead or architecture team
