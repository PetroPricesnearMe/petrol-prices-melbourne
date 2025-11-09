# ✅ Pre-Deployment Checklist

**Project:** petrol-prices-melbourne  
**Vercel Project ID:** prj_p1cxbUIZBrMYCIlJOXPAu5L0RhCM  
**Status:** ⚠️ **NOT READY** - 120 blocking issues

---

## 🔧 **Vercel Configuration Status**

### ✅ Configuration Files Updated:

| File | Status | Details |
|------|--------|---------|
| `vercel.json` | ✅ Updated | Project ID and name configured |
| `.vercelignore` | ✅ Created | Excludes test/docs from deployment |
| Build Settings | ✅ Verified | Matches Vercel dashboard |

### ✅ Vercel Project Settings (Confirmed):

```
Framework Preset: Next.js
Build Command:    npm run build
Install Command:  npm install  
Output Directory: .next
Node Version:     22.x (from package.json)
Region:           Sydney (syd1)
```

**Configuration Status:** ✅ **READY**

---

## 🚨 **CRITICAL: Code Issues MUST Be Fixed**

### ❌ Blocking Deployment:

Even though Vercel is configured, **your build WILL FAIL** due to:

1. **42 ESLint Errors** → Build stops during lint phase
2. **78 TypeScript Errors** → Type safety failures
3. **Missing Environment Variables** → App features broken

**See:** `PRE_COMMIT_QA_REPORT.md` for all fixes

---

## 🎯 **MANDATORY FIXES (Before Any Deployment)**

### ⚡ Quick Auto-Fixes (5 minutes):

```bash
# 1. Auto-fix ESLint import order issues (~20 fixes)
npm run lint:fix

# 2. Install missing type definitions
npm install --save-dev @types/jest-axe

# 3. Verify what's left
npm run lint
npm run type-check
```

### 🔨 Critical Manual Fixes (1-2 hours):

#### Fix #1: Update Station Type Definition
**File:** `src/types/station.ts`

```typescript
export interface Station {
  id: number;
  name: string;
  brand: string;
  address: string;
  suburb: string;          // ← ADD THIS LINE
  city: string;
  postcode: string;
  region: string;
  latitude: number | null; // ← ADD | null
  longitude: number | null; // ← ADD | null
  category: StationCategory;
  fuelPrices: FuelPrice[];
  amenities: StationAmenities;
  operatingHours?: OperatingHours;
  lastUpdated: string;
}
```

**Impact:** Fixes 10+ TypeScript errors

#### Fix #2: Remove Unused Imports
**Files to edit:**

`src/app/directory/StationDirectoryClient.tsx` (Line 10):
```typescript
// DELETE THIS LINE:
import Link from 'next/link';
```

`src/app/directory/StationDirectoryWithMap.tsx` (Lines 15-16):
```typescript
// DELETE THIS LINE:
import Link from 'next/link';

// CHANGE THIS:
import { useState, useEffect } from 'react';
// TO THIS:
import { useState } from 'react';
```

`src/app/map/page.tsx` (Line 15):
```typescript
// DELETE THIS LINE:
import LoadingCard from '@/components/ui/LoadingCard';
```

**Impact:** Fixes 9 unused variable errors

#### Fix #3: Fix Unused Function Parameters
**File:** `src/app/directory/StationDirectoryClient.tsx` (Lines 106-115)

```typescript
// CHANGE THIS:
const SearchBar = ({
  onSearch,
  searchKeys,
  placeholder = 'Search...',
  onCategoryChange,
  categories = [],
  selectedCategory = null,
  maxSuggestions = 5,
  debounceDelay = 300,
  enableRecentSearches = false,
  renderResult,
}) => {

// TO THIS (prefix unused with underscore):
const SearchBar = ({
  onSearch,
  _searchKeys,              // ← Add _
  placeholder = 'Search...',
  _onCategoryChange,        // ← Add _
  _categories = [],         // ← Add _
  _selectedCategory = null, // ← Add _
  _maxSuggestions = 5,      // ← Add _
  _debounceDelay = 300,     // ← Add _
  _enableRecentSearches = false, // ← Add _
  _renderResult,            // ← Add _
}) => {
```

**Impact:** Fixes 8 unused parameter errors

#### Fix #4: Fix Mock Data Types
**File:** `src/__tests__/mocks/mockData.ts`

```typescript
// Add import at top:
import { StationCategory } from '@/types/station';

// For each mock station, CHANGE:
category: 'petrol-station',
// TO:
category: StationCategory.PETROL_STATION,

// AND ADD:
suburb: 'Melbourne',
```

**Impact:** Fixes 9 type errors

#### Fix #5: Replace `any` with Proper Types

`components/seo/StructuredData.tsx` (Line 10):
```typescript
// BEFORE:
export function StructuredData({ data }: { data: any | any[] }) {

// AFTER:
export function StructuredData({ 
  data 
}: { 
  data: Record<string, unknown> | Array<Record<string, unknown>> 
}) {
```

`src/app/api/auth/[...nextauth]/route.ts` (Lines 55, 61-62):
```typescript
// BEFORE (Line 55):
token.role = (user as any).role;

// AFTER:
token.role = (user as { role?: string }).role;

// BEFORE (Lines 61-62):
(session.user as any).id = token.id as string;
(session.user as any).role = token.role as string;

// AFTER:
if (session.user) {
  session.user.id = token.id as string;
  (session.user as any).role = token.role as string; // Keep this one if User type doesn't have role
}
```

**Impact:** Fixes 10 `any` type errors

---

## 🔐 **Environment Variables Setup**

### Required for Vercel Dashboard:

Go to: **Settings → Environment Variables**

Add for **Production** environment:

```bash
# Authentication (CRITICAL)
NEXTAUTH_URL=https://petrol-prices-melbourne.vercel.app
NEXTAUTH_SECRET=<GENERATE_SECURE_SECRET>

# Google Maps (Required for maps to work)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=<YOUR_KEY>
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<YOUR_KEY>

# Baserow Database
BASEROW_API_URL=https://api.baserow.io
BASEROW_API_TOKEN=ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE
BASEROW_STATIONS_TABLE_ID=623329
BASEROW_PRICES_TABLE_ID=623330
BASEROW_CACHE_TIME=3600

# Application
NEXT_PUBLIC_APP_URL=https://petrol-prices-melbourne.vercel.app
NEXT_PUBLIC_ENV=production
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET:

**Option 1 - PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Option 2 - Online:**
Visit: https://generate-secret.vercel.app/32

---

## 📝 **Deployment Workflow**

### Step 1: Fix Code Issues ⚠️ REQUIRED
```bash
# Run auto-fixes
npm run lint:fix
npm install --save-dev @types/jest-axe

# Fix manual issues (see PRE_COMMIT_QA_REPORT.md)
# - Update Station interface
# - Remove unused imports
# - Fix mock data types
# - Replace any types

# Verify all fixed
npm run build  # Must succeed
```

### Step 2: Configure Environment Variables
```bash
# Add all required variables in Vercel dashboard
# Settings → Environment Variables → Add Variable
```

### Step 3: Deploy
```bash
# Commit your fixes
git add .
git commit -m "fix: resolve all QA issues for production"
git push origin main

# Vercel auto-deploys on push to main
# Monitor: https://vercel.com/al-s-projects-1f045bac/petrol-prices-melbourne/deployments
```

### Step 4: Verify Deployment
```bash
# Check deployment succeeded
vercel ls

# Test production URL
# Visit: https://petrol-prices-melbourne.vercel.app

# Check Vercel logs for errors
vercel logs
```

---

## 🚦 **Deployment Status**

| Requirement | Status | Action Needed |
|-------------|--------|---------------|
| Vercel Config | ✅ Ready | None |
| Build Settings | ✅ Configured | None |
| ESLint | ❌ 42 errors | **Fix before deploy** |
| TypeScript | ❌ 78 errors | **Fix before deploy** |
| Env Variables | ⚠️ Missing | **Add in dashboard** |
| Local Build | ❌ Fails | **Fix code issues first** |
| **Ready to Deploy** | ❌ **NO** | **Complete fixes above** |

---

## ⏱️ **Timeline to Deploy**

1. **Quick Fixes:** 5 minutes (auto-fix lint, install types)
2. **Manual Fixes:** 1-2 hours (TypeScript errors)
3. **Testing:** 30 minutes (verify build, test locally)
4. **Environment Setup:** 15 minutes (add vars to Vercel)
5. **Deployment:** 5 minutes (push to GitHub)

**Total Estimated Time:** 2-3 hours

---

## 🎯 **Immediate Next Steps**

### Option A: Let AI Fix Issues (Fastest)
I can automatically fix most of the 120 issues for you:
- Import ordering
- Unused imports
- Type definitions
- Mock data

**Time:** 15-20 minutes with my help

### Option B: Manual Fix (Learn as you go)
Follow the PRE_COMMIT_QA_REPORT.md step by step

**Time:** 2-3 hours

### Option C: Deploy with Errors (NOT RECOMMENDED)
Force deploy despite errors - **will likely fail or crash**

**Time:** 5 minutes, then hours debugging in production 💥

---

## 💡 **Recommendation**

**Choose Option A** - Let me fix the issues automatically, then you can:
1. Review the changes
2. Test locally
3. Deploy with confidence
4. Have a working production app

**Want me to start fixing the 120 issues now?** I can:
- Fix all import orders
- Remove unused variables
- Update type definitions
- Fix mock data
- Replace `any` types
- Update Station interface

Just say "yes" and I'll begin! 🚀

---

**Current Status:** Vercel ✅ configured, Code ❌ not ready  
**Next Action:** Fix code issues OR add environment variables  
**Deployment URL:** Will be available after successful build
