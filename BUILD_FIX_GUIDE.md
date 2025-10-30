# Build Fix Guide - React Scripts Error Resolution

## ✅ Issue Fixed

**Problem:** The build was trying to use `react-scripts` (Create React App) instead of Next.js build commands.

**Solution:** Updated `vercel.json` to use the correct Next.js configuration.

---

## 🔧 What Was Changed

### vercel.json
```json
// ❌ OLD (Create React App)
{
  "buildCommand": "react-scripts build",
  "devCommand": "react-scripts start",
  "outputDirectory": "build",
  "framework": null
}

// ✅ NEW (Next.js)
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

---

## 🚀 Correct Build Commands

### Local Development
```bash
# Start development server
npm run dev

# Runs on: http://localhost:3000
```

### Production Build
```bash
# Clean install dependencies
npm ci

# Build for production
npm run build

# Start production server
npm start

# Runs on: http://localhost:3000
```

### Vercel Deployment
```bash
# Vercel will automatically detect Next.js and use:
# - Build Command: next build
# - Output Directory: .next
# - Install Command: npm install or yarn install
```

### Manual Deployment (Other Platforms)
```bash
# 1. Install dependencies
npm ci

# 2. Build the application
npm run build

# 3. Start the production server
npm start

# Or use environment variable for port
PORT=3000 npm start
```

---

## 📋 Deployment Checklist

### Before Deploying
- [x] ✅ Updated vercel.json with Next.js config
- [ ] Set environment variables (if any)
- [ ] Test build locally: `npm run build`
- [ ] Test production server: `npm start`
- [ ] Check all pages render correctly
- [ ] Verify images load properly

### Environment Variables Needed
Check your `.env.local` or deployment platform for these:
```bash
# API Keys (if applicable)
NEXT_PUBLIC_BASEROW_API_TOKEN=your_token_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secret_here

# Analytics (if configured)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🐛 Troubleshooting

### Error: "react-scripts: command not found"
✅ **FIXED** - This was caused by incorrect vercel.json configuration.

### If you still see this error:
1. Check if you're using the correct build command:
   ```bash
   npm run build  # Should run "next build"
   ```

2. Verify package.json scripts:
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start"
   }
   ```

3. Clear cache and rebuild:
   ```bash
   npm run clean
   npm ci
   npm run build
   ```

### Error: "Cannot find module 'next'"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Error: Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Build succeeds but pages don't load
1. Check that all imports are correct
2. Verify file paths are case-sensitive
3. Ensure all dependencies are installed
4. Check browser console for errors

---

## 📊 Vercel Deployment Settings

When deploying to Vercel, use these settings:

### Framework Preset
```
Framework: Next.js
```

### Build & Development Settings
```
Build Command: next build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
Development Command: next dev (auto-detected)
```

### Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:
- Production
- Preview
- Development

---

## 🔄 Migration from CRA to Next.js

If you're migrating from Create React App to Next.js, here's what changed:

### Build System
| Aspect | CRA | Next.js |
|--------|-----|---------|
| Build Command | `react-scripts build` | `next build` |
| Dev Command | `react-scripts start` | `next dev` |
| Output Dir | `build/` | `.next/` |
| Routing | React Router | File-based routing |
| Image Optimization | Manual | Built-in `next/image` |

### Key Differences
1. **Pages:** Components in `pages/` directory are routes
2. **API Routes:** Backend endpoints in `pages/api/`
3. **Image Optimization:** Use `next/image` component
4. **Head Tags:** Use `next/head` component
5. **Env Variables:** Prefix with `NEXT_PUBLIC_` for client-side

---

## 🧪 Testing Your Build

### Test Locally
```bash
# 1. Build
npm run build

# Expected output:
# ✓ Creating an optimized production build
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization

# 2. Start production server
npm start

# 3. Open browser
# Visit: http://localhost:3000
```

### Test on Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Or deploy to production
vercel --prod
```

---

## 📝 Common Next.js Build Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev -- -p 3001   # Custom port

# Production
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues

# Analysis
npm run analyze          # Analyze bundle size

# Cleaning
npm run clean            # Remove .next and node_modules
rm -rf .next             # Remove build cache only
```

---

## ✅ Verification Steps

After deploying, verify:

1. **Homepage loads** ✓
   - Visit: https://your-domain.com

2. **All routes work** ✓
   - /directory
   - /about
   - /blog
   - /faq

3. **Images load** ✓
   - Brand logos
   - Hero images
   - Station images

4. **API routes respond** ✓
   - /api/stations
   - /api/health

5. **Performance is good** ✓
   - Run Lighthouse audit
   - Check Core Web Vitals

---

## 🚨 Emergency Rollback

If deployment fails:

### Vercel
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

### Manual
```bash
# Revert git changes
git revert HEAD
git push

# Or reset to previous commit
git reset --hard [commit-hash]
git push --force
```

---

## 📞 Need Help?

### Logs to Check
1. **Vercel Build Logs** - In deployment details
2. **Browser Console** - For client-side errors
3. **Network Tab** - For API/resource loading issues

### Useful Commands
```bash
# Check Next.js version
npx next --version

# Check Node version
node --version

# Check npm version
npm --version

# Verify dependencies
npm ls next react react-dom
```

---

## 🎉 Success!

Your build configuration is now correct. The application will build using Next.js instead of Create React App.

**Next steps:**
1. Commit the vercel.json changes
2. Push to your repository
3. Vercel will automatically deploy with the correct settings
4. Monitor the deployment logs

---

**Last Updated:** October 2024
**Status:** ✅ Fixed
**Issue:** `react-scripts: command not found`
**Solution:** Updated vercel.json to use Next.js configuration
