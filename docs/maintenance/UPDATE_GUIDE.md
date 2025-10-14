# Update and Deployment Guide

## Quick Start

### Development Updates

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

### Production Deployment

```bash
# 1. Create production build
npm run build

# 2. Test build locally
npm run analyze

# 3. Deploy to Vercel
git push origin main
# Vercel auto-deploys from main branch
```

---

## Update Strategies

### Continuous Updates (Recommended)

**Frequency:** Weekly
**Risk Level:** Low
**Downtime:** None

```bash
# Update minor and patch versions
npm update

# Test
npm test && npm run build

# Deploy
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push
```

### Scheduled Maintenance Updates

**Frequency:** Monthly
**Risk Level:** Medium
**Downtime:** Minimal (< 5 minutes)

1. Schedule maintenance window
2. Notify users if necessary
3. Perform updates
4. Run full test suite
5. Deploy during low-traffic period

---

## Rollback Procedure

If deployment fails:

```bash
# 1. Revert to previous commit
git revert HEAD

# 2. Force push (only if necessary)
git push origin main --force

# 3. Or use Vercel rollback feature
vercel rollback
```

---

## Performance Optimization Workflow

### Monthly Performance Audit

```bash
# 1. Build and analyze
npm run build:analyze

# 2. Check bundle sizes
npm run size

# 3. Run Lighthouse
npm run lighthouse

# 4. Review Core Web Vitals
# Check Google Search Console

# 5. Optimize images
npm run optimize-images
```

### Actions Based on Results

- **Bundle > 250KB**: Implement code splitting
- **LCP > 2.5s**: Optimize images, lazy load content
- **CLS > 0.1**: Add dimensions to images, reserve space for dynamic content
- **FID > 100ms**: Reduce JavaScript execution time

---

## Data Update Procedures

### Fuel Price Updates

**Manual Update:**
1. Export latest data from source
2. Format as CSV
3. Import to Baserow
4. Verify data integrity
5. Clear cache if necessary

**Automated Update:**
- Configure Baserow API webhook
- Set up automated import scripts
- Monitor import logs

### Station Information Updates

1. Update Baserow database
2. Verify coordinates accuracy
3. Update brand logos if needed
4. Test on staging environment
5. Deploy to production

---

## Emergency Procedures

### Site Down

1. Check hosting status (Vercel)
2. Review recent deployments
3. Check API endpoints
4. Rollback if necessary
5. Investigate root cause

### Data Loss

1. Stop all write operations
2. Restore from latest backup
3. Verify data integrity
4. Resume normal operations
5. Document incident

### Security Breach

1. Take site offline immediately
2. Assess breach extent
3. Patch vulnerability
4. Rotate all credentials
5. Notify affected users
6. Document and report

---

## Monitoring Setup

### Google Analytics

- Measurement ID in `.env`
- Custom events configured
- Goals and conversions set
- Real-time monitoring enabled

### Performance Monitoring

- Lighthouse CI configured
- Core Web Vitals tracking
- Error tracking enabled
- Custom performance marks

### Uptime Monitoring

Recommended tools:
- UptimeRobot
- Pingdom
- StatusCake

---

## Documentation Updates

After each major update:

1. Update version number
2. Update CHANGELOG.md
3. Update relevant docs in `/docs`
4. Update README.md if needed
5. Document breaking changes

---

## Best Practices

### Before Any Update

- [ ] Create backup
- [ ] Test in development
- [ ] Review changelog
- [ ] Check for breaking changes
- [ ] Update documentation

### After Deployment

- [ ] Verify site functionality
- [ ] Check analytics
- [ ] Monitor error rates
- [ ] Review performance metrics
- [ ] Document any issues

### Version Control

- Use semantic versioning
- Tag releases
- Write meaningful commit messages
- Keep main branch stable
- Use feature branches

---

## Automated Workflows

### GitHub Actions (if configured)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run build
```

### Pre-commit Hooks

```bash
# Install husky
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test"
```

---

## Performance Budget

Enforce performance budgets in CI/CD:

```json
{
  "budgets": {
    "initialJS": "250KB",
    "totalJS": "500KB",
    "css": "50KB",
    "images": "200KB per image"
  }
}
```

Fail build if budgets exceeded.

