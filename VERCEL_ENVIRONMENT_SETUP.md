# Vercel Environment Variables Setup - CRITICAL ⚠️

## 🚨 **Configuration Issue Detected**

Your Vercel environment variables use `VITE_` prefixes, but this is a **Create React App** project that requires `REACT_APP_` prefixes.

---

## ✅ **Correct Environment Variables for Vercel**

### **Update These in Vercel Dashboard:**

Go to: **Vercel Dashboard → Project Settings → Environment Variables**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `REACT_APP_BASEROW_TOKEN` | `WXGOdiCeNmvdj5NszzAdvIug3InwQQXP` | All Environments |
| `REACT_APP_BASEROW_API_URL` | `https://api.baserow.io/api` | All Environments |
| `REACT_APP_BASEROW_SSE_URL` | `https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse` | All Environments |
| `REACT_APP_MAPBOX_TOKEN` | *(your Mapbox token)* | All Environments |

### **Remove These (Wrong Prefix):**
- ❌ `VITE_BASEROW_API` 
- ❌ `VITE_BASEROW_SSE_URL`
- ❌ `VITE_BASEROW_API_TOKEN`
- ❌ `MAKESWIFT_API_ORIGIN` (not used in this project)

---

## 📝 **Why This Matters for SEO**

**Without correct environment variables:**
- ❌ No station data loads
- ❌ Empty directory pages (bad for SEO)
- ❌ No dynamic content (poor rankings)
- ❌ High bounce rate
- ❌ Poor user experience signals

**With correct environment variables:**
- ✅ 650+ stations indexed by Google
- ✅ Rich content on every page
- ✅ Low bounce rate
- ✅ High engagement signals
- ✅ Better search rankings

---

## 🔧 **Step-by-Step Fix**

### **1. Update Vercel Environment Variables**

```bash
# In Vercel Dashboard:

# DELETE these (wrong prefix):
VITE_BASEROW_API ❌
VITE_BASEROW_SSE_URL ❌
VITE_BASEROW_API_TOKEN ❌
MAKESWIFT_API_ORIGIN ❌

# ADD these (correct prefix):
REACT_APP_BASEROW_TOKEN = WXGOdiCeNmvdj5NszzAdvIug3InwQQXP ✅
REACT_APP_BASEROW_API_URL = https://api.baserow.io/api ✅
REACT_APP_BASEROW_SSE_URL = https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse ✅
```

### **2. Redeploy After Changing Variables**

```bash
# Option 1: Trigger from Git
git commit --allow-empty -m "Trigger redeploy for env vars"
git push

# Option 2: Manual redeploy
# Click "Redeploy" in Vercel dashboard
```

### **3. Verify Variables Are Loaded**

After deployment, check console in browser:
```javascript
// This should NOT be undefined:
console.log(process.env.REACT_APP_BASEROW_TOKEN);
```

---

## 🎯 **SEO Impact of Correct Configuration**

### **Before (Wrong Variables):**
```
Homepage: No station count (generic content)
Directory: No stations listed
Regional pages: Empty
Search engines: See thin/empty content
Ranking: Poor (no valuable content)
```

### **After (Correct Variables):**
```
Homepage: "250+ Petrol Stations" (actual data)
Directory: 650+ stations with prices
Regional pages: Specific station lists
Search engines: Rich, valuable content
Ranking: High (authoritative content)
```

---

## 📊 **Environment Variables Reference**

### **Required for Production:**

#### **1. Baserow API Token**
```
Variable: REACT_APP_BASEROW_TOKEN
Value: WXGOdiCeNmvdj5NszzAdvIug3InwQQXP
Purpose: Authenticate API requests to Baserow database
SEO Impact: HIGH - Required for all station data
```

#### **2. Baserow API URL**
```
Variable: REACT_APP_BASEROW_API_URL
Value: https://api.baserow.io/api
Purpose: Base URL for Baserow REST API
SEO Impact: HIGH - Required for data fetching
```

#### **3. Baserow SSE URL**
```
Variable: REACT_APP_BASEROW_SSE_URL
Value: https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse
Purpose: Real-time updates via Server-Sent Events
SEO Impact: MEDIUM - Improves user experience
```

#### **4. Mapbox Token** (Optional but recommended)
```
Variable: REACT_APP_MAPBOX_TOKEN
Value: pk.eyJ1IjoicGV0cm9scHJpY2VzIiwiYSI6ImNtZW82a2ZkbzEzZzEycHB4bnN2a3d6MWYifQ.hOEEwKVHFhA2_IAxvj59SA
Purpose: Interactive maps functionality
SEO Impact: MEDIUM - Enhanced user engagement
```

---

## 🏆 **SEO Checklist After Fixing Env Vars**

After updating environment variables and redeploying:

### **Immediate Checks:**
- [ ] Homepage shows actual station count (not "250+")
- [ ] Directory page loads all 650+ stations
- [ ] Regional pages show filtered stations
- [ ] Search functionality works
- [ ] Prices display correctly
- [ ] Map loads stations

### **SEO Validation:**
- [ ] Google Search Console: No indexing errors
- [ ] Rich Results Test: Structured data valid
- [ ] PageSpeed Insights: Good performance scores
- [ ] Mobile-Friendly Test: Passes
- [ ] Check sitemap.xml loads correctly

### **Content Quality:**
- [ ] Every page has unique, valuable content
- [ ] Station listings are complete
- [ ] No "No results" messages on main pages
- [ ] Internal links work properly
- [ ] Images load correctly

---

## 🔍 **Troubleshooting**

### **Problem: Data still not loading after changing env vars**

**Solution 1: Clear Build Cache**
```bash
# In Vercel Dashboard:
Settings → General → Clear Build Cache
Then redeploy
```

**Solution 2: Check Environment Scope**
- Ensure variables are set for "All Environments" or "Production"
- Not just "Development" or "Preview"

**Solution 3: Verify No Typos**
- Variable names are CASE SENSITIVE
- `REACT_APP_BASEROW_TOKEN` ≠ `REACT_APP_Baserow_Token`

### **Problem: Map not working**

```bash
# Add this variable:
REACT_APP_MAPBOX_TOKEN = pk.eyJ1IjoicGV0cm9scHJpY2VzIiwiYSI6ImNtZW82a2ZkbzEzZzEycHB4bnN2a3d6MWYifQ.hOEEwKVHFhA2_IAxvj59SA
```

---

## 📈 **Expected SEO Improvements**

### **With Correct Configuration:**

#### **Indexed Pages:**
- 1 Homepage
- 1 Main Directory
- 6 Regional Directory Pages
- 1 Blog Page
- 1 FAQ Page
- 3 Feature Pages
= **13 pages** with unique, valuable content

#### **Indexed Content:**
- 650+ unique station listings
- Each with name, address, prices
- Structured data for each station
- Geographic coverage (Melbourne-wide)

#### **SEO Signals:**
- **Content Quality:** HIGH (real data)
- **User Engagement:** HIGH (interactive features)
- **Page Authority:** HIGH (comprehensive info)
- **Local Relevance:** HIGH (Melbourne-specific)
- **Mobile Experience:** EXCELLENT
- **Page Speed:** FAST

---

## 🚀 **Quick Fix Command**

Copy this and run in Vercel Dashboard CLI:

```bash
# Delete old variables
vercel env rm VITE_BASEROW_API
vercel env rm VITE_BASEROW_SSE_URL
vercel env rm VITE_BASEROW_API_TOKEN
vercel env rm MAKESWIFT_API_ORIGIN

# Add correct variables
vercel env add REACT_APP_BASEROW_TOKEN
# Paste: WXGOdiCeNmvdj5NszzAdvIug3InwQQXP
# Environment: Production

vercel env add REACT_APP_BASEROW_API_URL
# Paste: https://api.baserow.io/api
# Environment: Production

vercel env add REACT_APP_BASEROW_SSE_URL
# Paste: https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse
# Environment: Production

# Redeploy
vercel --prod
```

---

## 📊 **Verification Checklist**

After deployment:

1. **Visit Homepage**
   - Should show actual station count from database
   - Features section should be complete

2. **Visit Directory**
   - Should load 650+ stations
   - Filtering should work
   - Each station should have data

3. **Visit Regional Pages**
   - `/directory?region=CBD` - Should show CBD stations
   - `/directory?region=NORTH` - Should show North stations
   - etc.

4. **Check Console (F12)**
   - Should see: "✅ Successfully loaded [X] stations from baserow"
   - Should NOT see: "undefined" for env variables

5. **Test SEO**
   - View Page Source → Check meta tags
   - Google Rich Results Test → Should pass
   - Schema Validator → Should be valid

---

## ⚡ **SEO Performance Impact**

| Metric | Wrong Env Vars | Correct Env Vars |
|--------|----------------|------------------|
| **Pages with Content** | 3 (static) | 13+ (dynamic) |
| **Indexable Stations** | 0 | 650+ |
| **Unique Content** | Low | High |
| **User Engagement** | Low (no data) | High (full data) |
| **Search Rankings** | Poor | Good→Excellent |
| **Organic Traffic** | Minimal | Significant |

---

## 🎯 **Action Required**

**Priority: URGENT** 🔥

Your current Vercel environment variables will prevent the site from loading station data, which **severely impacts SEO** by showing empty pages to Google.

**Fix this immediately by:**
1. Updating env vars in Vercel Dashboard
2. Redeploying the application
3. Verifying data loads correctly

---

**Last Updated:** October 13, 2025  
**Status:** ⚠️ CRITICAL - Environment Variables Need Updating  
**Impact:** HIGH - Affects all SEO efforts

