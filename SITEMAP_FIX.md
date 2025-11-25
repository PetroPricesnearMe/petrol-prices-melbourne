# Sitemap Error Fix Guide

## Issues Found

1. **Domain Mismatch**: 
   - Submitted: `https://petrolpricesnearme.com.au` (with 's')
   - Configured: `https://petrolpricenearme.com.au` (without 's')
   - **Fixed**: Updated all configurations to use `petrolpricesnearme.com.au`

2. **1,066 Errors**: 
   - Likely caused by including URLs for pages that don't exist
   - Directory pages for suburbs with no stations
   - Brand pages for brands with no stations
   - Invalid station IDs
   - **Fixed**: Added validation to only include pages with actual data

## Changes Made

### 1. Domain Correction
- Updated `next-sitemap.config.js` to use correct domain
- Updated `src/app/sitemap.ts` to use correct domain
- All sitemap URLs now use `petrolpricesnearme.com.au`

### 2. Validation Added
- **Station URLs**: Only includes stations with valid IDs and names
- **Directory URLs**: Only includes suburbs that have at least one station
- **Brand URLs**: Only includes brands that have at least one station
- **Region URLs**: Only includes predefined valid regions

### 3. Error Prevention
- Filters out empty/null values
- Validates station data before including
- Ensures all URLs point to existing pages

## Next Steps

1. **Regenerate Sitemap**:
   ```bash
   npm run build
   ```
   This will regenerate the sitemap with the correct domain and validated URLs.

2. **Verify Sitemap**:
   - Check `public/sitemap.xml` after build
   - Verify all URLs use `petrolpricesnearme.com.au`
   - Ensure no invalid URLs are included

3. **Resubmit to Google Search Console**:
   - Remove the old sitemap submission
   - Submit: `https://petrolpricesnearme.com.au/sitemap.xml`
   - Also submit: `https://petrolpricesnearme.com.au/server-sitemap.xml`

4. **Monitor Errors**:
   - Check Google Search Console after 24-48 hours
   - Errors should be significantly reduced or eliminated
   - All URLs should return 200 status codes

## Expected Results

- ✅ Correct domain in all sitemap URLs
- ✅ Only valid, existing pages included
- ✅ No 404 errors for sitemap URLs
- ✅ Reduced error count from 1,066 to near zero
- ✅ Successful sitemap submission

## Troubleshooting

If errors persist:

1. **Check URL Accessibility**:
   - Manually verify a few URLs from the sitemap
   - Ensure they return 200 status codes
   - Check for redirects or canonical URLs

2. **Validate Station Data**:
   - Ensure all stations have valid IDs
   - Check for duplicate or invalid entries
   - Verify station data structure

3. **Check Route Configuration**:
   - Verify `/stations/[id]` routes exist
   - Verify `/directory/[suburb]` routes exist
   - Verify `/fuel-brands/[brand]` routes exist

4. **Review Exclusions**:
   - Check `next-sitemap.config.js` exclude patterns
   - Ensure demo/test pages are excluded
   - Verify API routes are excluded

