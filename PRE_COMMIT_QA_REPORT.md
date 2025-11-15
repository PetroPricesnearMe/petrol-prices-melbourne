# 🔍 Pre-Commit QA Report

**Generated:** November 8, 2025  
**Project:** Petrol Price Near Me (PPNM)  
**Status:** ⚠️ **NOT PRODUCTION READY** - Issues Found

---

## 📊 Executive Summary

| Check                   | Status     | Critical Issues         | Warnings    |
| ----------------------- | ---------- | ----------------------- | ----------- |
| **1. Dependencies**     | ✅ PASS    | 0                       | 0           |
| **2. ESLint**           | ❌ FAIL    | 42 errors               | 35 warnings |
| **3. TypeScript**       | ❌ FAIL    | 78 errors               | 0           |
| **4. Build**            | ❌ FAIL    | Build blocked by lint   | -           |
| **5. Environment**      | ⚠️ WARNING | Missing Google API keys | 0           |
| **6. Dependencies**     | ⚠️ WARNING | 35 outdated packages    | -           |
| **7. Production Ready** | ❌ NO      | Multiple blockers       | -           |

---

## ✅ 1. DEPENDENCIES CHECK

**Status:** ✅ **PASS**

```
✅ npm install completed successfully
✅ All 1861 packages installed
✅ 0 vulnerabilities found
✅ Husky git hooks installed
```

**Action Required:** None

---

## ❌ 2. ESLINT ERRORS (42 Errors, 35 Warnings)

**Status:** ❌ **BLOCKING BUILD**

### Critical Errors by Category:

#### A. Import Order Issues (15 errors)

**Files Affected:**

- `components/features/RegionSelectorNext.js`
- `components/layout/BreadcrumbsNext.js`
- `components/layout/NavbarNext.js`
- `components/seo/GoogleAnalytics.tsx`
- `components/seo/StructuredData.tsx`
- `src/app/directory/page.tsx`
- `src/app/example-seo-page/page.tsx`

**Fix:**

```bash
npm run lint:fix
```

This will auto-fix import ordering issues.

#### B. TypeScript `any` Usage (10 errors)

**Files:**

- `components/seo/StructuredData.tsx` (Line 10)
- `lib/seo/analytics.ts` (Lines 8, 9)
- `src/app/api/auth/[...nextauth]/route.ts` (Lines 55, 61, 62)
- `src/app/directory/StationDirectoryWithMap.tsx` (Line 116)
- `src/app/map-demo/MapDemoClient.tsx` (Lines 65, 66)
- `src/app/search-test/SearchTestClient.tsx` (Lines 48, 49)

**Fix for `components/seo/StructuredData.tsx`:**

```typescript
// Line 10 - BEFORE:
export function StructuredData({ data }: { data: any | any[] }) {

// Line 10 - AFTER:
export function StructuredData({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
```

#### C. Unused Variables (17 errors)

**Files:**

- `src/app/directory/StationDirectoryClient.tsx` - 9 unused variables
- `src/app/directory/StationDirectoryWithMap.tsx` - 2 unused variables
- `src/app/map/page.tsx` - 1 unused variable
- `src/app/example-seo-page/page.tsx` - 1 unused variable
- `src/app/search-test/SearchTestClient.tsx` - 1 unused variable
- `src/app/stations/[id]/page.tsx` - 2 unused variables
- `components/accessibility/SkipToContent.tsx` - 1 unused variable

**Fix Example for `StationDirectoryClient.tsx`:**

```typescript
// Line 10 - Remove unused import:
- import Link from 'next/link';

// Lines 106-115 - Prefix unused params with underscore:
const SearchBar = ({
  onSearch,
  _searchKeys,        // Prefix with _
  placeholder = 'Search...',
  _onCategoryChange,  // Prefix with _
  _categories = [],   // Prefix with _
  // ... etc
}) => {
```

#### D. Console Statements (21 warnings)

**Files with console.log:**

- `components/features/RegionSelectorNext.js` (2)
- `lib/api/utils/logger.ts` (1)
- `lib/data/loadStations.js` (4)
- `lib/performance/webVitals.ts` (1)
- `lib/services/BaserowServerService.js` (10)
- Others (3)

**Fix:** Replace with proper logging or remove:

```javascript
// BEFORE:
console.log('Data:', data);

// AFTER (for development):
if (process.env.NODE_ENV === 'development') {
  console.log('Data:', data);
}

// OR use a logger:
import { logger } from '@/lib/api/utils/logger';
logger.debug('Data:', data);
```

#### E. Accessibility Issues (7 errors)

**Issues:**

- Form labels not associated with controls
- Click handlers without keyboard listeners
- Static elements with interactions

**Fix for `StationDirectoryClient.tsx` (Line 431):**

```tsx
// BEFORE:
<label className="flex items-center gap-2">
  <input type="checkbox" />
  Has Car Wash
</label>

// AFTER:
<label htmlFor="carWash" className="flex items-center gap-2">
  <input id="carWash" type="checkbox" />
  Has Car Wash
</label>
```

---

## ❌ 3. TYPESCRIPT ERRORS (78 Errors)

**Status:** ❌ **BLOCKING BUILD**

### Critical Type Errors:

#### A. Mock Data Type Mismatches (9 errors)

**File:** `src/__tests__/mocks/mockData.ts`

**Issues:**

- Line 48, 64, 79: `string[]` assigned to `string`
- Line 49, 65, 80: Wrong category enum value

**Fix:**

```typescript
// BEFORE:
category: 'petrol-station',
features: ['24/7', 'Car Wash'],

// AFTER:
category: StationCategory.PETROL_STATION,
features: '24/7, Car Wash',  // Or join the array
```

#### B. Station Type Issues (15 errors)

**Files:**

- `src/app/stations/[id]/page.tsx` - Missing `suburb` property (10 errors)
- `src/app/map/page.tsx` - `latitude: null` not assignable to `number`
- `src/app/directory/StationDirectoryWithMap.tsx` - FuelPrice type mismatch

**Fix for Station interface:**

```typescript
// Add to src/types/station.ts:
export interface Station {
  id: number;
  name: string;
  address: string;
  suburb: string; // ← ADD THIS
  city: string;
  latitude: number | null; // ← Allow null
  longitude: number | null; // ← Allow null
  // ... rest of properties
}
```

#### C. Missing Module Declaration (1 error)

**File:** `src/components/atoms/Button/Button.test.tsx`

**Issue:** `jest-axe` types not found

**Fix:**

```bash
npm install --save-dev @types/jest-axe
```

#### D. Possibly Null/Undefined Issues (11 errors)

**File:** `src/app/fuel-price-trends/FuelTrendsClient.tsx`

**Fix:**

```typescript
// BEFORE:
const average = trendData.reduce((sum, point) => sum + point.price, 0);

// AFTER:
const average = trendData?.reduce((sum, point) => sum + point.price, 0) ?? 0;
```

---

## ❌ 4. BUILD CHECK

**Status:** ❌ **FAILED**

```
✅ Compilation successful (9.2s)
❌ Linting failed - build blocked
❌ Type checking not completed due to lint errors
```

**Build cannot complete until ESLint errors are fixed.**

---

## ⚠️ 5. ENVIRONMENT VARIABLES

**Status:** ⚠️ **WARNING** - Missing Production Keys

### Comparison:

| Variable                            | .env.local   | .env.example | Status               |
| ----------------------------------- | ------------ | ------------ | -------------------- |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | ❌ Missing   | ✅ Template  | **Missing**          |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`   | ❌ Missing   | ✅ Template  | **Missing**          |
| `BASEROW_API_TOKEN`                 | ✅ Present   | ✅ Template  | ✅ OK                |
| `NEXTAUTH_SECRET`                   | ⚠️ Dev value | N/A          | **Needs prod value** |
| `NEXTAUTH_URL`                      | ✅ localhost | N/A          | **Update for prod**  |

### ⚠️ Security Issues:

1. **Baserow API token exposed in .env.local** - Should be in .env only
2. **NEXTAUTH_SECRET** uses development value
3. **Google API keys missing** - Map features won't work

### Action Required:

```bash
# 1. Add Google API keys (get from Google Cloud Console)
echo "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here" >> .env.local
echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here" >> .env.local

# 2. Generate secure NEXTAUTH_SECRET for production
openssl rand -base64 32
# Then update in .env.local
```

---

## ⚠️ 6. OUTDATED DEPENDENCIES (35 packages)

**Status:** ⚠️ **RECOMMENDED UPDATES**

### Major Version Updates Available:

| Package                  | Current | Latest       | Breaking?               |
| ------------------------ | ------- | ------------ | ----------------------- |
| `next`                   | 15.5.6  | **16.0.1**   | ⚠️ Yes - Test carefully |
| `tailwindcss`            | 3.4.18  | **4.1.17**   | ⚠️ Yes - Major rewrite  |
| `zod`                    | 3.25.76 | **4.1.12**   | ⚠️ Yes - API changes    |
| `@testing-library/react` | 14.3.1  | **16.3.0**   | ⚠️ Yes                  |
| `eslint`                 | 8.57.1  | **9.39.1**   | ⚠️ Yes - Config changes |
| `jest`                   | 29.7.0  | **30.2.0**   | ⚠️ Yes                  |
| `storybook`              | 9.1.16  | **10.0.6**   | ⚠️ Yes                  |
| `framer-motion`          | 11.18.2 | **12.23.24** | ⚠️ Yes                  |

### Minor/Patch Updates (Safe):

- `axios`: 1.13.1 → 1.13.2
- `@tanstack/react-query`: 5.90.6 → 5.90.7
- `cypress`: 15.5.0 → 15.6.0
- `lucide-react`: 0.546.0 → 0.553.0

### Recommendation:

```bash
# Update safe patches first:
npm update axios @tanstack/react-query cypress lucide-react

# DELAY major updates until after current issues are fixed
# Test major updates in a separate branch
```

---

## ⚠️ 7. PRODUCTION READINESS ASSESSMENT

**Overall Status:** ❌ **NOT PRODUCTION READY**

### Blocking Issues:

1. ❌ **42 ESLint errors** - Build fails
2. ❌ **78 TypeScript errors** - Type safety compromised
3. ⚠️ **Missing Google API keys** - Maps won't work
4. ⚠️ **Insecure NEXTAUTH_SECRET** - Security risk

### Risk Assessment:

- **High Risk:** Type errors could cause runtime failures
- **Medium Risk:** Missing API keys break features
- **Low Risk:** Console.log statements (minor performance)

---

## 🎯 ACTION PLAN TO 100% READY

### Phase 1: Critical Fixes (MUST DO BEFORE COMMIT)

#### Step 1: Auto-fix ESLint Issues

```bash
npm run lint:fix
```

**Expected:** Fixes ~20 import order issues automatically

#### Step 2: Fix Unused Variables

```bash
# Edit src/app/directory/StationDirectoryClient.tsx
# Prefix unused params with underscore or remove them
```

#### Step 3: Fix TypeScript Errors

**A. Install missing types:**

```bash
npm install --save-dev @types/jest-axe
```

**B. Update Station interface:**

```typescript
// src/types/station.ts
export interface Station {
  // ... existing fields
  suburb: string; // ADD THIS
  latitude: number | null; // CHANGE from number
  longitude: number | null; // CHANGE from number
}
```

**C. Fix mock data:**

```typescript
// src/__tests__/mocks/mockData.ts
import { StationCategory } from '@/types/station';

export const mockStations: Station[] = [
  {
    // ...
    category: StationCategory.PETROL_STATION, // Fix enum
    features: '24/7, Car Wash', // Fix type
  },
];
```

**D. Replace `any` types:**

```typescript
// components/seo/StructuredData.tsx
export function StructuredData({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  // ...
}
```

#### Step 4: Remove/Suppress Console Logs

```bash
# Quick fix: Add eslint disable for known safe console.logs
# OR remove them:
grep -r "console.log" components/ lib/ src/ --exclude-dir=node_modules
```

#### Step 5: Fix Accessibility Issues

```tsx
// Add htmlFor to all labels
// Add keyboard handlers to clickable divs
// Use semantic HTML (button instead of div for clicks)
```

### Phase 2: Environment Setup (BEFORE PRODUCTION)

#### Step 6: Secure Environment Variables

```bash
# 1. Get Google API keys
# Visit: https://console.cloud.google.com/apis/credentials

# 2. Generate secure secret
openssl rand -base64 32

# 3. Update .env.local:
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_actual_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_key
NEXTAUTH_SECRET=generated_secure_secret_here
```

#### Step 7: Update .env.example

```bash
# Remove actual secrets, keep only templates
```

### Phase 3: Verify Build (FINAL CHECK)

#### Step 8: Run Full Quality Check

```bash
npm run type-check   # Should pass with 0 errors
npm run lint         # Should pass with 0 errors
npm run build        # Should complete successfully
```

#### Step 9: Run Tests

```bash
npm run test:ci      # Run all tests
npm run test:e2e     # Run E2E tests
```

#### Step 10: Final Verification

```bash
# Check build output
npm run build

# Start production build locally
npm run start

# Visit http://localhost:3000 and test:
# ✓ Homepage loads
# ✓ Search works
# ✓ Maps display (if API keys configured)
# ✓ No console errors
```

---

## 📋 QUICK FIX SCRIPT

Save this as `fix-qa-issues.sh`:

```bash
#!/bin/bash
echo "🔧 Starting QA Fixes..."

# 1. Auto-fix lint
echo "1️⃣ Running ESLint auto-fix..."
npm run lint:fix

# 2. Install missing types
echo "2️⃣ Installing missing types..."
npm install --save-dev @types/jest-axe

# 3. Type check
echo "3️⃣ Running type check..."
npm run type-check

# 4. Build test
echo "4️⃣ Testing build..."
npm run build

echo "✅ Auto-fixes complete!"
echo "⚠️  Manual fixes still needed - see PRE_COMMIT_QA_REPORT.md"
```

Run with:

```bash
chmod +x fix-qa-issues.sh
./fix-qa-issues.sh
```

---

## 🚫 DO NOT COMMIT UNTIL:

- [ ] All ESLint errors fixed (0 errors)
- [ ] All TypeScript errors fixed (0 errors)
- [ ] Build completes successfully
- [ ] Google API keys configured (for production)
- [ ] NEXTAUTH_SECRET updated (for production)
- [ ] Tests passing
- [ ] No security warnings

---

## 📞 SUMMARY FOR USER

**Current State:** Your project is well-organized but has **120 code quality issues** that prevent production deployment.

**Good News:**
✅ Dependencies healthy (no vulnerabilities)
✅ Project structure excellent
✅ Most issues are auto-fixable

**Action Needed:**

1. Run `npm run lint:fix` (fixes ~20 issues)
2. Fix 78 TypeScript errors (mostly type definitions)
3. Add API keys for maps to work
4. Re-run build to verify

**Time Estimate:**

- Auto-fixes: 2 minutes
- Manual fixes: 1-2 hours
- Testing: 30 minutes

**After fixes, you'll be ready to commit and push! 🚀**

---

**Generated by:** AI QA Assistant  
**Next Review:** After implementing fixes above
