# Backend Monitoring Agent - Quick Setup Guide

## 🎯 Purpose

This backend monitoring agent automatically scans your project for backend issues every 30 minutes and reports results to a master agent.

## ✨ What It Monitors

- ✅ API endpoint health (health.js, stations.js)
- ✅ Data file integrity (GeoJSON, CSV)
- ✅ Environment variable configuration
- ✅ Server files (server.js, next.config.js)
- ✅ Database connectivity (Baserow MCP)
- ✅ Public assets and dependencies
- ✅ File system integrity

## 🚀 Quick Start

### 1. Run a Test Scan

First, verify the monitor works correctly:

```bash
npm run monitor
```

This will:
- Scan all backend components
- Display issues in the terminal
- Save a report to `logs/backend-reports/`

### 2. Start Continuous Monitoring

To monitor every 30 minutes:

```bash
npm run monitor:watch
```

Press `Ctrl+C` to stop.

### 3. Run as Background Service (Recommended for Production)

Install PM2:

```bash
npm install -g pm2
```

Start monitoring:

```bash
pm2 start scripts/backend-monitor-scheduler.js --name "backend-monitor"
pm2 save
pm2 startup
```

View logs:

```bash
pm2 logs backend-monitor
```

## 📊 Understanding Reports

### Severity Levels

- 🔴 **CRITICAL** - Service is broken, fix immediately
- 🟠 **HIGH** - Major issue, fix soon
- 🟡 **MEDIUM** - Warning, review when possible
- 🟢 **LOW** - Minor issue or suggestion

### Report Locations

- **Latest report**: `logs/backend-reports/latest.json`
- **All reports**: `logs/backend-reports/report-*.json`

### Sample Report Output

```
🔍 ===== BACKEND MONITORING SCAN STARTED =====
⏰ Timestamp: 2025-10-17T12:00:00.000Z

📡 Checking API endpoints...
📊 Checking data files...
🔐 Checking environment variables...
🖥️  Checking server files...
🗄️  Checking database configuration...
🖼️  Checking public assets...
📦 Checking node_modules...

📋 ===== BACKEND MONITORING REPORT =====

⏰ Scan Time: 2025-10-17T12:00:00.000Z
📊 Total Issues: 0
🔴 Critical: 0
🟠 High: 0
🟡 Medium: 0
🟢 Low: 0
✅ Info: 15

✅ No issues found! Backend is healthy.
```

## 🔧 Configuration

### Configure Master Agent Endpoint

To send reports to a master agent API, add to `.env.local`:

```env
MASTER_AGENT_URL=https://your-master-agent.com/api/reports
```

Without this, reports will be logged locally only.

### Change Scan Interval

Edit `scripts/backend-monitor-scheduler.js`:

```javascript
const SCAN_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
```

Common intervals:
- 15 minutes: `15 * 60 * 1000`
- 1 hour: `60 * 60 * 1000`
- 5 minutes: `5 * 60 * 1000`

## 📁 File Structure

```
scripts/
├── backend-monitor.js              # Core monitoring logic
├── backend-monitor-scheduler.js    # 30-minute scheduler
└── backend-monitor-manual.js       # One-time scan script

logs/
└── backend-reports/
    ├── latest.json                 # Most recent report
    └── report-*.json               # Timestamped reports

docs/
└── BACKEND_MONITORING.md           # Full documentation
```

## 🔍 Common Issues & Fixes

### Issue: "node_modules directory not found"

**Fix:**
```bash
npm install
```

### Issue: "Required data file not found"

**Fix:**
```bash
# Ensure data files exist
ls -la public/data/stations.geojson
```

### Issue: "Missing environment variables"

**Fix:**
```bash
# Create .env.local with required variables
cp .env.example .env.local
# Edit .env.local with your values
```

### Issue: "API endpoint file not found"

**Fix:**
```bash
# Verify API routes exist
ls -la pages/api/
```

## 📈 Integration with CI/CD

### GitHub Actions

Create `.github/workflows/backend-monitor.yml`:

```yaml
name: Backend Health Check

on:
  schedule:
    - cron: '*/30 * * * *'  # Every 30 minutes

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run monitor
```

### Pre-deployment Check

Add to your deployment pipeline:

```bash
# Fail deployment if critical issues found
npm run monitor || exit 1
```

## 🎯 Best Practices

1. **Production Monitoring**: Keep it running continuously on production servers
2. **Regular Reviews**: Check reports daily for recurring issues
3. **Set Up Alerts**: Configure master agent for critical issue notifications
4. **Archive Reports**: Clean old reports periodically (keep last 30 days)
5. **Custom Checks**: Add project-specific checks to `backend-monitor.js`

## 📚 Full Documentation

For detailed documentation, see: `docs/BACKEND_MONITORING.md`

## 🆘 Support

- Check `logs/backend-reports/latest.json` for recent scan results
- Review full logs with: `pm2 logs backend-monitor`
- See troubleshooting guide in `docs/BACKEND_MONITORING.md`

## 🎉 You're All Set!

The backend monitoring agent is now ready to scan your project every 30 minutes and report any issues to the master agent.

**Next Steps:**
1. Run a test scan: `npm run monitor`
2. Start continuous monitoring: `npm run monitor:watch`
3. Or run as background service: `pm2 start scripts/backend-monitor-scheduler.js --name backend-monitor`

Happy monitoring! 🚀

