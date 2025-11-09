# 🚀 Deployment Status & Configuration

**Project Name:** petrol-prices-melbourne  
**Project ID:** `prj_p1cxbUIZBrMYCIlJOXPAu5L0RhCM`  
**Vercel Dashboard:** https://vercel.com/al-s-projects-1f045bac/petrol-prices-melbourne  
**Production URL:** https://petrol-prices-melbourne-d614y6o41-al-s-projects-1f045bac.vercel.app

---

## ⚠️ **CRITICAL: DEPLOYMENT BLOCKED**

Your project **cannot be deployed** until these issues are fixed:

### Blocking Issues:
1. ❌ **42 ESLint errors** - Build will fail
2. ❌ **78 TypeScript errors** - Runtime failures likely
3. ⚠️ **Missing environment variables** - Features won't work

**See:** `PRE_COMMIT_QA_REPORT.md` for complete fixes

---

## 📋 **Current Configuration**

### Vercel Settings (vercel.json):
```json
{
  "name": "petrol-prices-melbourne",
  "projectId": "prj_p1cxbUIZBrMYCIlJOXPAu5L0RhCM",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["syd1"]
}
```

### Build Configuration:
- **Framework:** Next.js 15.5.6
- **Node Version:** 22.x
- **Package Manager:** npm
- **Region:** Sydney (syd1) - Optimal for Australian users

---

## 🔴 **MUST FIX BEFORE DEPLOYING**

### 1. Fix Build Errors (CRITICAL)

```bash
# Step 1: Auto-fix ESLint issues
npm run lint:fix

# Step 2: Install missing types
npm install --save-dev @types/jest-axe

# Step 3: Fix TypeScript errors manually
# See PRE_COMMIT_QA_REPORT.md Section 3

# Step 4: Verify build works
npm run build
```

**Estimated Time:** 2-3 hours of fixes

---

### 2. Configure Environment Variables (REQUIRED)

**Go to:** https://vercel.com/al-s-projects-1f045bac/petrol-prices-melbourne/settings/environment-variables

**Add these variables for Production:**

#### Critical (App Won't Work Without These):
```
NEXTAUTH_URL=https://petrol-prices-melbourne-d614y6o41-al-s-projects-1f045bac.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
```

#### Important (Features Will Break):
```
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_key
```

#### Baserow Integration:
```
BASEROW_API_URL=https://api.baserow.io
BASEROW_API_TOKEN=ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE
BASEROW_STATIONS_TABLE_ID=623329
BASEROW_PRICES_TABLE_ID=623330
BASEROW_CACHE_TIME=3600
```

#### Application Settings:
```
NEXT_PUBLIC_APP_URL=https://petrol-prices-melbourne-d614y6o41-al-s-projects-1f045bac.vercel.app
NEXT_PUBLIC_ENV=production
NODE_ENV=production
```

---

## ⏭️ **DEPLOYMENT WORKFLOW**

### Option A: Fix Issues First (RECOMMENDED)

```bash
# 1. Fix all code issues
npm run lint:fix
# ... manual TypeScript fixes

# 2. Verify locally
npm run build
npm start

# 3. Commit fixes
git add .
git commit -m "fix: resolve ESLint and TypeScript errors for production"
git push origin main

# 4. Vercel auto-deploys from main
# Monitor at: https://vercel.com/.../deployments
```

### Option B: Force Deploy Now (NOT RECOMMENDED)

```bash
# Temporarily disable strict checking in vercel.json
# This is NOT recommended - you'll have runtime errors

# Deploy anyway
vercel --prod

# Result: Build will likely fail, or app will crash
```

---

## 🎯 **STEP-BY-STEP FIX GUIDE**

### Priority 1: Make Build Pass (Required)

#### Fix 1: ESLint Auto-fixes
```bash
npm run lint:fix
```

**Result:** Fixes ~20 import order issues

#### Fix 2: Remove Unused Imports
Edit `src/app/directory/StationDirectoryClient.tsx`:
```typescript
// Line 10 - DELETE THIS:
import Link from 'next/link';
```

Edit `src/app/directory/StationDirectoryWithMap.tsx`:
```typescript
// Line 15 - DELETE THIS:
import Link from 'next/link';

// Line 16 - DELETE useEffect from import:
import { useState } from 'react';  // Remove useEffect
```

#### Fix 3: Prefix Unused Function Parameters
```typescript
// Anywhere you see unused parameter errors, prefix with _:
const SearchBar = ({
  onSearch,
  _searchKeys,          // ← Add underscore
  placeholder = 'Search...',
  _onCategoryChange,    // ← Add underscore
  // etc...
}) => {
```

#### Fix 4: Install Missing Types
```bash
npm install --save-dev @types/jest-axe
```

### Priority 2: Fix Type Errors (Required)

#### Fix 5: Update Station Interface
```typescript
// src/types/station.ts
export interface Station {
  id: number;
  name: string;
  brand: string;
  address: string;
  suburb: string;               // ← ADD THIS
  city: string;
  postcode: string;
  region: string;
  latitude: number | null;      // ← Change to allow null
  longitude: number | null;     // ← Change to allow null
  category: StationCategory;
  fuelPrices: FuelPrice[];
  amenities: StationAmenities;
  operatingHours?: OperatingHours;
  lastUpdated: string;
}
```

#### Fix 6: Fix Mock Data
```typescript
// src/__tests__/mocks/mockData.ts
import { StationCategory } from '@/types/station';

export const mockStations: Station[] = [
  {
    // ... other fields
    category: StationCategory.PETROL_STATION,  // ← Use enum
    suburb: 'Melbourne',                       // ← Add suburb
    latitude: -37.8136,                        // ← Not null
    longitude: 144.9631,                       // ← Not null
  }
];
```

#### Fix 7: Replace `any` Types
```typescript
// components/seo/StructuredData.tsx (Line 10)
export function StructuredData({ 
  data 
}: { 
  data: Record<string, unknown> | Array<Record<string, unknown>> 
}) {
  const jsonLd = Array.isArray(data) ? data : [data];
  // ...
}
```

### Priority 3: Environment Setup

#### Fix 8: Generate Secure NEXTAUTH_SECRET
```bash
# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use online generator:
# https://generate-secret.vercel.app/32
```

Copy the generated secret and add to Vercel environment variables.

#### Fix 9: Get Google API Keys
1. Go to: https://console.cloud.google.com/apis/credentials
2. Create API Key
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Add keys to Vercel environment variables

---

## ✅ **VERIFICATION CHECKLIST**

Before deploying, verify:

```bash
# 1. Lint passes
npm run lint
# Expected: 0 errors

# 2. Type check passes
npm run type-check
# Expected: 0 errors

# 3. Build succeeds
npm run build
# Expected: ✓ Compiled successfully

# 4. Local test
npm start
# Visit http://localhost:3000 - ensure it works

# 5. Environment variables set in Vercel dashboard
# Go to: Settings → Environment Variables
# Verify all required vars are present
```

---

## 🚀 **DEPLOY WHEN READY**

Once all checks pass:

```bash
# Commit your fixes
git add .
git commit -m "fix: resolve all QA issues for production deployment"
git push origin main

# Vercel will auto-deploy
# Monitor at: https://vercel.com/al-s-projects-1f045bac/petrol-prices-melbourne/deployments
```

---

## 📊 **CURRENT STATUS**

| Item | Status | Action |
|------|--------|--------|
| Vercel Config | ✅ Updated | None |
| Code Quality | ❌ 120 issues | Fix per QA report |
| Build | ❌ Failing | Fix ESLint/TS errors |
| Environment Vars | ⚠️ Partial | Add Google keys & secure secret |
| Ready to Deploy | ❌ NO | Complete fixes above |

---

## 💡 **QUICK WINS (Do These First)**

These will fix ~40% of issues in 5 minutes:

```bash
# 1. Auto-fix imports and formatting
npm run lint:fix

# 2. Install missing types
npm install --save-dev @types/jest-axe

# 3. Remove a few unused imports manually
# - StationDirectoryClient.tsx (Line 10)
# - StationDirectoryWithMap.tsx (Line 15, 16)
# - map/page.tsx (Line 15)

# 4. Run build to see remaining issues
npm run build
```

After these quick wins, you'll have ~70 issues left to fix manually.

---

**Ready to proceed with fixes? I can help you:**
1. **Auto-fix all fixable issues** (I can edit the files)
2. **Focus on TypeScript errors first** (biggest blocker)
3. **Guide you through each fix** step-by-step

Let me know how you'd like to proceed! 🚀
