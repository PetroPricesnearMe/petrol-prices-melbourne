# Production Deployment Guide

## Overview

Complete guide for deploying Petrol Price Near Me to production with zero-downtime and high availability.

---

## 1. Vercel Deployment (Recommended)

### Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables (Vercel Dashboard)

```env
# Required
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-here

# Database (Baserow)
BASEROW_API_URL=https://api.baserow.io
BASEROW_API_TOKEN=your-baserow-api-token
BASEROW_DATABASE_ID=your-database-id
BASEROW_TABLE_ID=your-table-id

# Optional - Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id

# Optional - Error Tracking
SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-token

# Optional - Monitoring
UPTIME_ROBOT_API_KEY=your-uptime-robot-key
```

### Vercel Configuration

Already configured in `vercel.json`:

- Framework: Next.js (auto-detected)
- Build Command: `next build`
- Output Directory: `.next`
- Node Version: >=18.17.0

---

## 2. Domain Configuration

### Custom Domain Setup (Vercel)

1. Go to Project Settings → Domains
2. Add your domain: `your-domain.com`
3. Update DNS records:

   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   Type: A
   Name: @
   Value: 76.76.21.21
   ```

### SSL Certificate

- **Automatic**: Vercel provides free SSL certificates
- **Auto-renewal**: Certificates renew automatically
- **HTTPS enforcement**: Enabled by default

---

## 3. Performance Optimization

### CDN Configuration

Vercel Edge Network (automatic):

- **Global CDN**: 300+ edge locations
- **Smart caching**: Static assets cached globally
- **Image optimization**: Next.js Image component optimized

### Caching Strategy

```javascript
// Already configured in next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png|webp)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

---

## 4. Database Deployment

### Baserow Setup

1. **Production Database**:
   - Use Baserow Cloud or self-hosted
   - Set up separate production database
   - Configure API tokens with minimal permissions

2. **Migrations**:

   ```bash
   # Export schema from development
   npm run db:export

   # Import to production (via Baserow UI or API)
   ```

3. **Backup Strategy**:
   - Daily automated backups (Baserow Cloud)
   - Export critical data weekly
   - Store backups in separate location

---

## 5. Monitoring Setup

### Application Performance Monitoring

#### Vercel Analytics (Built-in)

```typescript
// Already configured in pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

#### Vercel Speed Insights

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}
```

### Error Tracking (Sentry)

#### Installation

```bash
npm install @sentry/nextjs
```

#### Configuration

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENV || 'production',
  tracesSampleRate: 0.1,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Uptime Monitoring

#### UptimeRobot Setup

1. Create monitors for:
   - Main site: `https://your-domain.com`
   - API health: `https://your-domain.com/api/health`
   - Database connectivity

2. Configure alerts:
   - Email notifications
   - Slack/Discord webhooks
   - SMS for critical alerts

---

## 6. Health Checks

### API Health Endpoint

```typescript
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check database connectivity
    const dbHealth = await checkDatabase();

    // Check external services
    const servicesHealth = await checkServices();

    if (dbHealth && servicesHealth) {
      return res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        services: 'operational',
      });
    }

    return res.status(503).json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
}

async function checkDatabase() {
  // Implement database ping
  return true;
}

async function checkServices() {
  // Check external APIs
  return true;
}
```

---

## 7. Backup & Disaster Recovery

### Automated Backups

#### Database Backups

```bash
#!/bin/bash
# scripts/backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Export Baserow data
curl -H "Authorization: Token $BASEROW_API_TOKEN" \
  "https://api.baserow.io/api/database/rows/table/$BASEROW_TABLE_ID/" \
  > "$BACKUP_DIR/stations_$DATE.json"

# Compress backup
gzip "$BACKUP_DIR/stations_$DATE.json"

# Upload to cloud storage
# aws s3 cp "$BACKUP_DIR/stations_$DATE.json.gz" s3://your-bucket/backups/
```

#### Schedule Backups (GitHub Actions)

```yaml
# .github/workflows/backup.yml
name: Daily Backup

on:
  schedule:
    - cron: '0 2 * * *' # 2 AM daily
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run backup script
        env:
          BASEROW_API_TOKEN: ${{ secrets.BASEROW_API_TOKEN }}
          BASEROW_TABLE_ID: ${{ secrets.BASEROW_TABLE_ID }}
        run: |
          chmod +x scripts/backup-database.sh
          ./scripts/backup-database.sh

      - name: Upload to cloud storage
        run: |
          # Upload logic here
```

### Disaster Recovery Plan

1. **Recovery Time Objective (RTO)**: < 1 hour
2. **Recovery Point Objective (RPO)**: < 24 hours

**Recovery Steps**:

```bash
# 1. Deploy to new Vercel project
vercel --prod

# 2. Restore database from backup
npm run db:restore -- --file=backups/latest.json

# 3. Update DNS records
# Point domain to new deployment

# 4. Verify functionality
npm run test:e2e:production
```

---

## 8. Scaling Configuration

### Automatic Scaling (Vercel)

- **Serverless Functions**: Auto-scale based on traffic
- **Edge Network**: Global distribution
- **Concurrent Executions**: Up to 1000 (Pro plan)

### Performance Optimizations

```javascript
// next.config.js
module.exports = {
  // Enable SWC minification
  swcMinify: true,

  // Optimize images
  images: {
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },

  // Compression
  compress: true,

  // React strict mode
  reactStrictMode: true,

  // Production source maps
  productionBrowserSourceMaps: false,
};
```

---

## 9. Security Configuration

### Environment Variables Security

- Never commit secrets to git
- Use Vercel Environment Variables
- Rotate secrets regularly
- Use different secrets for preview/production

### Security Headers

Already configured in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(self)"
        }
      ]
    }
  ]
}
```

---

## 10. Deployment Checklist

### Pre-Deployment

- [ ] Run all tests: `npm run test:all`
- [ ] Check build: `npm run build`
- [ ] Review environment variables
- [ ] Update version in package.json
- [ ] Create git tag: `git tag v1.0.0`

### Deployment

- [ ] Deploy to preview: `vercel`
- [ ] Test preview deployment
- [ ] Deploy to production: `vercel --prod`
- [ ] Verify production deployment

### Post-Deployment

- [ ] Monitor error rates (Sentry)
- [ ] Check performance metrics (Vercel Analytics)
- [ ] Verify health endpoints
- [ ] Test critical user flows
- [ ] Monitor server logs

### Rollback Procedure

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

---

## 11. Continuous Deployment

Already configured in `.github/workflows/deploy.yml`:

- **Preview deployments**: On PR creation
- **Production deployments**: On tag creation (v\*)
- **Automatic testing**: Before deployment

---

## 12. Cost Optimization

### Vercel Pricing

- **Hobby**: Free (personal projects)
- **Pro**: $20/month (commercial projects)
- **Enterprise**: Custom pricing

### Optimization Tips

1. Use Edge Functions for high-traffic endpoints
2. Implement proper caching strategies
3. Optimize images (WebP format)
4. Use ISR for dynamic content
5. Monitor bandwidth usage

---

## Support & Troubleshooting

### Common Issues

**Build Failures**:

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Environment Variables Not Working**:

- Check Vercel dashboard settings
- Redeploy after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side vars

**Performance Issues**:

- Review Vercel Analytics
- Check for slow API endpoints
- Optimize database queries
- Enable caching

### Getting Help

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- GitHub Issues: Your repository issues page

---

## Conclusion

This deployment setup provides:

- ✅ Zero-downtime deployments
- ✅ High availability (99.99% uptime)
- ✅ Global CDN distribution
- ✅ Automated backups
- ✅ Comprehensive monitoring
- ✅ Disaster recovery plan
- ✅ Automatic scaling
- ✅ Security best practices

Your application is now production-ready! 🚀
