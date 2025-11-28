# Vercel Build Fix - Install Command Error

## Problem
Vercel deployment was failing with:
```
npm error Missing script: "install"
npm error Running "install" command: `npm run install`...
```

## Root Cause
Vercel is trying to run `npm run install` instead of the default `npm install`. This is typically caused by a custom "Install Command" setting in your Vercel project settings.

## Solution Applied ✅

### 1. Added Install Script (Workaround)
Added an `install` script to `package.json` that simply runs `npm install`:

```json
"scripts": {
  "install": "npm install",
  ...
}
```

This allows `npm run install` to work as expected.

### 2. Recommended: Fix Vercel Project Settings

**Better long-term solution:** Remove the custom install command from Vercel project settings:

1. Go to Vercel Dashboard → Your Project → Settings
2. Navigate to **Build & Development Settings**
3. Find **Install Command**
4. **Delete/clear the custom command** (leave it empty to use default)
   - OR set it to: `npm install` (not `npm run install`)
5. Save settings

The default behavior for Next.js projects is to run `npm install` automatically - you don't need a custom install command.

## Why This Happened

Vercel project settings might have been configured with:
- Install Command: `npm run install` ❌

But it should be either:
- Empty (uses default) ✅
- OR: `npm install` ✅

## Verification

After deploying, check the build logs should show:
```
Running "install" command: `npm install`...
```

Instead of:
```
Running "install" command: `npm run install`...
```

## Next Steps

1. ✅ **Immediate fix:** The install script has been added - deployment should work now
2. **Recommended:** Update Vercel project settings to use default install command
3. **Optional:** Remove the install script from package.json after fixing project settings

---

**Note:** The install script is a harmless workaround - it just calls `npm install` which is what Vercel would do by default anyway.

