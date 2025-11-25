# Sitemap Configuration Guide

## Overview

This project uses a dual sitemap approach:
1. **Next.js Built-in Sitemap** (`src/app/sitemap.ts`) - Automatically generated at build time
2. **next-sitemap Plugin** (`next-sitemap.config.js`) - Generates additional sitemaps with more control

## Automatic Regeneration

The sitemap is automatically regenerated:
- **On every build**: The `postbuild` script runs `next-sitemap` after `next build`
- **On deployment**: Both sitemaps are generated during the build process
- **Dynamic updates**: Station pages are automatically included based on actual data

## What's Included

### Static Pages (High Priority)
- Homepage (`/`) - Priority: 1.0, Change Frequency: daily
- Directory (`/directory`) - Priority: 0.9, Change Frequency: hourly
- Fuel Price Trends (`/fuel-price-trends`) - Priority: 0.8, Change Frequency: daily
- Station Amenities (`/station-amenities`) - Priority: 0.7, Change Frequency: weekly
- FAQ, About, Blog pages - Priority: 0.5-0.6, Change Frequency: monthly

### Dynamic Pages

#### Station Detail Pages
- **URL Pattern**: `/stations/[id]`
- **Priority**: 0.8
- **Change Frequency**: daily
- **Last Modified**: Uses `station.lastUpdated` if available
- **Included**: All stations with valid IDs

#### Directory/Suburb Pages
- **URL Pattern**: `/directory/[suburb-slug]`
- **Priority**: 0.85
- **Change Frequency**: daily
- **Generated from**: Unique suburbs in station data

#### Region Pages
- **URL Pattern**: `/regions/[region-slug]`
- **Priority**: 0.85
- **Change Frequency**: daily
- **Regions**: north-melbourne, south-melbourne, east-melbourne, west-melbourne, cbd, etc.

#### Fuel Brand Pages
- **URL Pattern**: `/fuel-brands/[brand-slug]`
- **Priority**: 0.75
- **Change Frequency**: weekly
- **Generated from**: Unique brands in station data

## What's Excluded

The sitemap automatically excludes:
- `/api/*` - API routes
- `/_next/*` - Next.js internal files
- `/admin/*` - Admin pages
- `/auth/*` - Authentication pages
- `/private/*` - Private pages
- `/test/*`, `/debug/*` - Test and debug pages
- `/*.json`, `/*.xml` - Static files
- `/favicon.ico`, `/robots.txt` - Special files
- `/*?*` - URLs with query parameters (filters, search, pagination)
- `/404`, `/500`, `/_error` - Error pages

## Metadata

Each URL includes:
- **loc**: Full URL
- **lastmod**: Last modification date (ISO format)
- **changefreq**: How often the page changes (always, hourly, daily, weekly, monthly, yearly, never)
- **priority**: Relative importance (0.0 to 1.0)

## Priority Guidelines

- **1.0**: Homepage only
- **0.9**: Main directory/listing pages
- **0.85**: Region and suburb directory pages
- **0.8**: Individual station pages, fuel trends
- **0.75**: Brand pages, amenities
- **0.7**: Category pages
- **0.6**: Blog posts, informational pages
- **0.5**: About, FAQ, contact pages
- **0.4**: Less important pages

## Change Frequency Guidelines

- **hourly**: Directory pages (prices change frequently)
- **daily**: Homepage, station pages, region pages
- **weekly**: Brand pages, amenities, blog
- **monthly**: Static content (about, FAQ)
- **yearly**: Rarely updated content

## Manual Regeneration

To manually regenerate the sitemap:

```bash
# Generate using next-sitemap
npm run postbuild

# Or use the custom script
npm run sitemap:generate
```

## Verification

After generation, check:
1. `/sitemap.xml` - Main sitemap
2. `/sitemap-0.xml`, `/sitemap-1.xml`, etc. - Split sitemaps (if > 50,000 URLs)
3. `/sitemap-index.xml` - Sitemap index (if using multiple sitemaps)
4. `/robots.txt` - Should reference sitemap location

## Search Engine Submission

Submit your sitemap to:
- **Google Search Console**: `https://petrolpricenearme.com.au/sitemap.xml`
- **Bing Webmaster Tools**: Same URL
- **robots.txt**: Automatically includes sitemap reference

## Troubleshooting

### Sitemap not updating
- Check that `postbuild` script runs after build
- Verify station data is accessible
- Check console for errors during generation

### Missing pages
- Ensure pages have valid routes
- Check exclude patterns in config
- Verify data fetching functions work

### Too many URLs
- Sitemaps are automatically split at 50,000 URLs
- Use sitemap index for multiple files
- Consider excluding low-priority pages

## Best Practices

1. ✅ Include all important pages
2. ✅ Use accurate lastmod dates
3. ✅ Set appropriate priorities
4. ✅ Exclude non-indexable content
5. ✅ Update sitemap after major changes
6. ✅ Monitor in Search Console
7. ✅ Keep URLs clean (no query params)
8. ✅ Use HTTPS URLs
9. ✅ Include canonical URLs

## Performance

- Sitemap generation happens at build time (not runtime)
- Large sitemaps are automatically split
- Only includes pages that exist in data
- Efficient data fetching with caching

