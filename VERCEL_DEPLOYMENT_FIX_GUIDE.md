# Vercel Deployment Fix Guide

> Complete guide to fixing deployment issues and ensuring successful builds on Vercel

## ✅ Issues Fixed

### 1. **node_modules in Repository**
- **Problem**: `node_modules` directory was committed to git, causing conflicts
- **Fix**: Updated `.gitignore` to exclude `node_modules`
- **Action Required**: Run the following commands:

```bash
# Remove node_modules from git tracking
git rm -r --cached node_modules

# Remove build artifacts
git rm -r --cached build
git rm -r --cached .next

# Commit the changes
git add .gitignore
git commit -m "chore: remove node_modules and build artifacts from repo"
```

### 2. **Duplicate Next.js Config Files**
- **Problem**: Multiple config files (`next.config.js`, `next.config.ts`, `next.config.optimized.js`)
- **Fix**: Removed duplicates, keeping only `next.config.ts`
- **Status**: ✅ Completed

### 3. **Duplicate App Directories**
- **Problem**: Both `app/` and `src/app/` directories existed
- **Fix**: Moved `robots.ts` and `sitemap.ts` to `src/app/`, removed empty `app/` directory
- **Status**: ✅ Completed

### 4. **TypeScript Import Issues**
- **Problem**: Missing React imports in TypeScript files
- **Fix**: Added proper React imports to all type files
- **Status**: ✅ Completed

### 5. **Updated .gitignore**
- Added missing entries:
  - `/package-lock.json` (optional, but prevents lock file conflicts)
  - `/.jest-cache/`
  - Better organization of ignore rules

---

## 📋 Pre-Deployment Checklist

### Build Configuration
- [x] `package.json` has `"build": "next build"` script
- [x] Next.js 15 installed in dependencies
- [x] TypeScript 5.3+ configured
- [x] Single `next.config.ts` file
- [x] `src/app/` directory structure (App Router)

### Environment Variables
- [ ] Create `.env.production` with required variables:
  ```env
  NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
  BASEROW_API_TOKEN=your_token_here
  BASEROW_PETROL_STATIONS_TABLE_ID=623329
  BASEROW_FUEL_PRICES_TABLE_ID=623330
  NEXTAUTH_SECRET=your_secret_here
  NEXTAUTH_URL=https://your-domain.vercel.app
  ```

### Vercel Configuration
- [x] `vercel.json` exists with proper settings
- [x] Framework detected as Next.js
- [x] Build command: `next build`
- [x] Output directory: `.next`

---

## 🚀 Deployment Steps

### Step 1: Clean Local Environment

```bash
# Clean all build artifacts
npm run clean

# Reinstall dependencies
npm ci

# Run type check
npm run type-check

# Run linting
npm run lint

# Build locally to verify
npm run build
```

### Step 2: Verify Build Success

```bash
# Start production server locally
npm run start

# Test at http://localhost:3000
```

### Step 3: Commit and Push

```bash
# Stage all changes
git add .

# Commit
git commit -m "fix: resolve deployment issues for Vercel"

# Push to main branch
git push origin main
```

### Step 4: Deploy to Vercel

#### Option A: Automatic Deployment
- Vercel will automatically deploy when you push to `main` branch
- Monitor deployment at https://vercel.com/dashboard

#### Option B: Manual Deployment via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## ⚙️ Vercel Dashboard Configuration

### Environment Variables (Required)

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production, Preview |
| `BASEROW_API_TOKEN` | Your Baserow API token | Production, Preview |
| `BASEROW_PETROL_STATIONS_TABLE_ID` | `623329` | Production, Preview |
| `BASEROW_FUEL_PRICES_TABLE_ID` | `623330` | Production, Preview |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | Production |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Production |
| `NODE_ENV` | `production` | Production |

### Build & Development Settings

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm ci",
  "outputDirectory": ".next"
}
```

### Node.js Version
- Set to: `20.x` (matches your `package.json` engines)

---

## 🔧 Troubleshooting

### Build Fails with TypeScript Errors

```bash
# Run type check locally
npm run type-check

# Fix any errors before deploying
```

### Build Fails with Missing Dependencies

```bash
# Ensure package-lock.json is up to date
npm install

# Commit updated package-lock.json
git add package-lock.json
git commit -m "chore: update package-lock.json"
git push
```

### Build Succeeds but Runtime Errors

Check Vercel logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click on the deployment
4. View "Function Logs" and "Build Logs"

### Environment Variables Not Working

- Ensure variables prefixed with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing environment variables
- Check variable names are exactly correct (case-sensitive)

### Module Not Found Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 📊 Performance Optimization

### Enable Analytics
```bash
npm install @vercel/analytics @vercel/speed-insights
```

Already installed ✅

### Image Optimization
- Uses Next.js Image component
- AVIF and WebP formats enabled
- Configured in `next.config.ts`

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze
```

---

## 🔒 Security Checklist

- [x] Security headers configured in `next.config.ts`
- [x] Environment variables not exposed in client code
- [x] API routes protected with authentication
- [x] Content Security Policy headers set
- [x] HTTPS enforced (automatic on Vercel)
- [x] `poweredByHeader` disabled

---

## 📈 Post-Deployment Verification

### 1. Functionality Check
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Search functionality operational
- [ ] Map displays correctly
- [ ] API routes responding

### 2. Performance Check
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Images loading optimized
- [ ] No console errors

### 3. SEO Check
- [ ] Meta tags present
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Open Graph tags working
- [ ] Structured data present

### 4. Accessibility Check
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation working
- [ ] Screen reader accessible
- [ ] Color contrast passing

---

## 🆘 Quick Commands Reference

```bash
# Local development
npm run dev

# Type check
npm run type-check

# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format

# Run tests
npm run test
npm run test:coverage

# Build for production
npm run build

# Start production server
npm run start

# Clean and rebuild
npm run clean && npm install && npm run build

# Deploy to Vercel
vercel --prod
```

---

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Project Issues**: Check GitHub Issues

---

## ✨ Success Criteria

Your deployment is successful when:

1. ✅ Build completes without errors
2. ✅ All pages load correctly
3. ✅ API routes function properly
4. ✅ Environment variables work
5. ✅ No console errors in browser
6. ✅ Lighthouse score > 90
7. ✅ Core Web Vitals passing
8. ✅ Mobile responsive
9. ✅ SEO optimized
10. ✅ Accessible (WCAG AA)

---

**Last Updated**: October 22, 2025
**Next.js Version**: 15.0.0
**Node.js Version**: 20.x
**Deployment Platform**: Vercel

---

## 🎉 You're Ready to Deploy!

Follow the steps above and your application will deploy successfully to Vercel.

For any issues, check the troubleshooting section or create an issue in the project repository.

**Happy Deploying! 🚀**
