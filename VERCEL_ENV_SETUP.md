# 🔐 Vercel Environment Variables Setup

**Project:** petrol-prices-melbourne  
**Project ID:** prj_p1cxbUIZBrMYCIlJOXPAu5L0RhCM  
**Dashboard:** https://vercel.com/al-s-projects-1f045bac/petrol-prices-melbourne/settings/environment-variables

---

## 🚀 REQUIRED ENVIRONMENT VARIABLES

### Add These in Vercel Dashboard:

Go to: **Settings → Environment Variables**

---

### 1. Baserow API Configuration (CRITICAL)

```env
BASEROW_API_URL=https://api.baserow.io
BASEROW_API_TOKEN=uUqdwRkL9KJXdnM3KoVz8hZR
BASEROW_DATABASE_ID=
BASEROW_STATIONS_TABLE_ID=623329
BASEROW_PRICES_TABLE_ID=623330
BASEROW_CACHE_TIME=3600
```

**⚠️ Important:** Add to **Production**, **Preview**, and **Development** environments

---

### 2. NextAuth Configuration (REQUIRED)

```env
NEXTAUTH_URL=https://petrol-prices-melbourne.vercel.app
NEXTAUTH_SECRET=<GENERATE_SECURE_SECRET>
```

**Generate secret:**

```bash
# PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use:
openssl rand -base64 32

# Or online:
https://generate-secret.vercel.app/32
```

---

### 3. Google Maps API (For Map Features)

```env
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_key_here
```

**Get keys from:** https://console.cloud.google.com/apis/credentials

**Enable these APIs:**

- Maps JavaScript API
- Places API
- Geocoding API

---

### 4. Application Settings

```env
NEXT_PUBLIC_APP_URL=https://petrol-prices-melbourne.vercel.app
NEXT_PUBLIC_ENV=production
NODE_ENV=production
```

---

## 📋 Step-by-Step Instructions

### Step 1: Navigate to Environment Variables

1. Go to: https://vercel.com/al-s-projects-1f045bac/petrol-prices-melbourne
2. Click **Settings** (top navigation)
3. Click **Environment Variables** (left sidebar)

### Step 2: Add Each Variable

For each variable above:

1. Click **"Add New"** button
2. Enter **Key** (e.g., `BASEROW_API_TOKEN`)
3. Enter **Value** (e.g., `uUqdwRkL9KJXdnM3KoVz8hZR`)
4. Select environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (optional)
5. Click **Save**

### Step 3: Verify

After adding all variables:

1. Check that all 11 variables are listed
2. Verify each has correct environments selected
3. Click **"Redeploy"** to apply changes to existing deployment

---

## 🔒 Security Best Practices

### ✅ DO:

- Use strong, unique secrets for each environment
- Rotate API tokens regularly
- Use different tokens for production vs preview
- Keep tokens in Vercel dashboard only (never commit to git)

### ❌ DON'T:

- Commit `.env.local` to git (already in .gitignore ✅)
- Share API tokens publicly
- Use development tokens in production
- Store secrets in code comments

---

## 🧪 Testing Environment Variables

### Test Locally:

```bash
# Verify .env.local has correct token
cat .env.local | grep BASEROW_API_TOKEN

# Expected: BASEROW_API_TOKEN=uUqdwRkL9KJXdnM3KoVz8hZR
```

### Test in Vercel:

After deployment, check logs:

```bash
# Via CLI
vercel logs --follow

# Look for:
# ✅ "Connected to Baserow successfully"
# ❌ "Baserow authentication failed" (if token wrong)
```

---

## 🔧 Troubleshooting

### Issue: "Baserow authentication failed"

**Solution:**

1. Verify token is exactly: `uUqdwRkL9KJXdnM3KoVz8hZR`
2. No extra spaces or quotes
3. Check it's set for Production environment
4. Redeploy after adding

### Issue: "Environment variable not found"

**Solution:**

1. Ensure variable name matches exactly (case-sensitive)
2. Check it's assigned to correct environment
3. Redeploy to apply changes

### Issue: "Map not loading"

**Solution:**

1. Add Google API keys
2. Enable required APIs in Google Cloud Console
3. Check browser console for specific errors

---

## 📊 Current Configuration Status

| Variable               | Local (.env.local) | Vercel Dashboard | Status                  |
| ---------------------- | ------------------ | ---------------- | ----------------------- |
| `BASEROW_API_TOKEN`    | ✅ Updated         | ⚠️ Need to add   | **Action Required**     |
| `NEXTAUTH_SECRET`      | ⚠️ Dev value       | ⚠️ Need to add   | **Action Required**     |
| `NEXTAUTH_URL`         | ✅ Set             | ⚠️ Need to add   | **Action Required**     |
| `NEXT_PUBLIC_GOOGLE_*` | ❌ Missing         | ❌ Missing       | **Optional (for maps)** |

---

## ✅ Checklist

Before deploying, ensure:

- [ ] All Baserow variables added to Vercel
  - [ ] `BASEROW_API_URL`
  - [ ] `BASEROW_API_TOKEN` = `uUqdwRkL9KJXdnM3KoVz8hZR`
  - [ ] `BASEROW_STATIONS_TABLE_ID` = `623329`
  - [ ] `BASEROW_PRICES_TABLE_ID` = `623330`
  - [ ] `BASEROW_CACHE_TIME` = `3600`

- [ ] NextAuth variables added to Vercel
  - [ ] `NEXTAUTH_URL` (use your Vercel domain)
  - [ ] `NEXTAUTH_SECRET` (generate secure one)

- [ ] Application variables added
  - [ ] `NEXT_PUBLIC_APP_URL`
  - [ ] `NEXT_PUBLIC_ENV` = `production`
  - [ ] `NODE_ENV` = `production`

- [ ] Optional: Google Maps (if using map features)
  - [ ] `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
  - [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## 🚀 Quick Deploy After Setup

```bash
# After adding all environment variables:

# 1. Commit your changes (token already in .env.local)
git add .env.local
git commit -m "chore: update Baserow API token"

# 2. Push to trigger deployment
git push origin main

# 3. Monitor deployment
# https://vercel.com/al-s-projects-1f045bac/petrol-prices-melbourne/deployments

# 4. Check logs for successful Baserow connection
vercel logs --follow
```

---

## 💡 Summary

**Token Updated:**

- ✅ Added to `.env.local`: `uUqdwRkL9KJXdnM3KoVz8hZR`
- ⚠️ **Action needed:** Add to Vercel dashboard manually

**Next Steps:**

1. Go to Vercel environment variables page
2. Add `BASEROW_API_TOKEN` = `uUqdwRkL9KJXdnM3KoVz8hZR`
3. Add other required variables
4. Redeploy

**Your Baserow integration will work after adding this to Vercel!** ✅

---

**Created:** `VERCEL_ENV_SETUP.md` - Complete setup guide
