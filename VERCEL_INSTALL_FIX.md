# Vercel Install Command Fix

## Problem
Vercel deployment fails with:
```
npm error Missing script: "install"
Error: Command "npm run install" exited with 1
```

**Root Cause:** Vercel project settings have a custom "Install Command" set to `npm run install`, but the script doesn't exist.

## Solution Applied ✅

### 1. Created Safe Install Script
- **File:** `scripts/install-dependencies.js`
- **Purpose:** Safely runs npm install without causing recursion
- **Features:**
  - Detects recursion attempts and exits early
  - Uses `npm_config_ignore_scripts` to prevent lifecycle hook recursion
  - Tries `npm ci` first (faster), falls back to `npm install`

### 2. Added Install Script to package.json
```json
"scripts": {
  "install": "node scripts/install-dependencies.js",
  ...
}
```

## How It Works

1. **Vercel calls:** `npm run install`
2. **Script detects:** Not in lifecycle hook, proceeds
3. **Script runs:** `npm ci` (or `npm install`) with `ignore_scripts=true`
4. **Prevents recursion:** By ignoring scripts, npm doesn't trigger the install lifecycle hook

## Recommended: Update Vercel Settings

**Better long-term solution:** Remove the custom install command from Vercel:

1. Go to: **Vercel Dashboard → Your Project → Settings**
2. Navigate to: **Build & Development Settings**
3. Find: **"Install Command"** field
4. **Action:**
   - **Clear/delete** the custom command (leave empty), OR
   - **Change** from `npm run install` to `npm install`
5. **Save** settings

After updating settings, you can remove the install script from package.json.

## Testing

The script should now work:
- ✅ Vercel can run `npm run install`
- ✅ No infinite recursion
- ✅ Dependencies install correctly

## Files Changed

- ✅ `scripts/install-dependencies.js` - New safe install script
- ✅ `package.json` - Added install script reference

---

**Status:** Fix applied - deployment should now work! 🚀

