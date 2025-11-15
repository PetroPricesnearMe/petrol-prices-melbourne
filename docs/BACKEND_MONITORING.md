# Backend Monitoring System

## Overview

Automated backend monitoring system that scans for issues and reports to a master agent every 30 minutes.

## Features

### Monitored Components

1. **API Endpoints** - Health and Stations APIs
2. **Data Files** - GeoJSON and CSV integrity
3. **Environment Variables** - Configuration validation
4. **Server Files** - Express and Next.js configuration
5. **Database** - Baserow MCP connectivity
6. **Assets** - Public files and resources
7. **Dependencies** - node_modules status

### Issue Severity Levels

- 🔴 **CRITICAL** - Service-breaking issues requiring immediate attention
- 🟠 **HIGH** - Major issues that should be fixed soon
- 🟡 **MEDIUM** - Warnings that should be reviewed
- 🟢 **LOW** - Minor issues or best practice suggestions

## Usage

### Option 1: Manual Single Scan

Run a one-time scan:

```bash
node scripts/backend-monitor-manual.js
```

### Option 2: Scheduled Monitoring (Every 30 Minutes)

Start continuous monitoring:

```bash
node scripts/backend-monitor-scheduler.js
```

Press `Ctrl+C` to stop.

### Option 3: Run as Background Service with PM2

Install PM2 globally:

```bash
npm install -g pm2
```

Start monitoring as a service:

```bash
pm2 start scripts/backend-monitor-scheduler.js --name "backend-monitor"
```

Useful PM2 commands:

```bash
# View logs
pm2 logs backend-monitor

# View status
pm2 status

# Stop monitoring
pm2 stop backend-monitor

# Restart monitoring
pm2 restart backend-monitor

# Remove from PM2
pm2 delete backend-monitor
```

### Option 4: Add to package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "monitor": "node scripts/backend-monitor-manual.js",
    "monitor:watch": "node scripts/backend-monitor-scheduler.js"
  }
}
```

Then run:

```bash
npm run monitor          # One-time scan
npm run monitor:watch    # Continuous monitoring
```

## Configuration

### Master Agent Endpoint

To send reports to a master agent API:

1. Set the environment variable:

```bash
export MASTER_AGENT_URL=https://your-master-agent.com/api/reports
```

Or add to `.env.local`:

```env
MASTER_AGENT_URL=https://your-master-agent.com/api/reports
```

2. The monitor will POST reports in this format:

```json
{
  "agentType": "backend-monitor",
  "scanNumber": 1,
  "timestamp": "2025-10-17T12:00:00.000Z",
  "status": "HEALTHY" | "ISSUES_FOUND",
  "summary": {
    "totalIssues": 0,
    "criticalErrors": 0,
    "highErrors": 0,
    "mediumWarnings": 0,
    "lowWarnings": 0,
    "infoCount": 15
  },
  "errors": [],
  "warnings": [],
  "recommendations": []
}
```

### Scan Interval

Default: 30 minutes (1800000 ms)

To change the interval, edit `scripts/backend-monitor-scheduler.js`:

```javascript
const SCAN_INTERVAL_MS = 30 * 60 * 1000; // Change this value
```

Examples:

- 5 minutes: `5 * 60 * 1000`
- 1 hour: `60 * 60 * 1000`
- 15 minutes: `15 * 60 * 1000`

## Reports

### Report Locations

All scan reports are saved to:

```
logs/backend-reports/
├── latest.json              # Most recent report
├── report-2025-10-17T12-00-00-000Z.json
├── report-2025-10-17T12-30-00-000Z.json
└── ...
```

### Report Structure

```json
{
  "timestamp": "2025-10-17T12:00:00.000Z",
  "summary": {
    "totalIssues": 2,
    "critical": 0,
    "high": 1,
    "medium": 1,
    "low": 0,
    "info": 15
  },
  "errors": [
    {
      "category": "API",
      "file": "pages/api/stations.js",
      "issue": "Description of issue",
      "severity": "HIGH"
    }
  ],
  "warnings": [
    {
      "category": "ENV",
      "file": ".env.local",
      "issue": "Description of warning",
      "severity": "MEDIUM"
    }
  ],
  "info": [
    {
      "category": "DATA",
      "file": "public/data/stations.geojson",
      "status": "OK",
      "message": "Valid GeoJSON with 150 features"
    }
  ]
}
```

## Issue Categories

| Category       | Description                        |
| -------------- | ---------------------------------- |
| `API`          | API endpoint issues                |
| `DATA`         | Data file integrity problems       |
| `ENV`          | Environment variable configuration |
| `SERVER`       | Server file issues                 |
| `DATABASE`     | Database connectivity              |
| `ASSETS`       | Public asset problems              |
| `DEPENDENCIES` | npm package issues                 |

## Common Issues & Solutions

### Critical Issues

#### node_modules not found

```bash
npm install
```

#### Required data file missing

```bash
# Ensure public/data/stations.geojson exists
# Check database import was successful
```

### High Issues

#### API endpoint missing export

```javascript
// Add default export
export default function handler(req, res) {
  // ...
}
```

#### Invalid GeoJSON structure

```javascript
// Ensure proper structure:
{
  "type": "FeatureCollection",
  "features": [...]
}
```

### Medium Warnings

#### Missing environment variables

```bash
# Copy example and configure
cp .env.example .env.local
# Edit .env.local with your values
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Backend Health Check

on:
  schedule:
    - cron: '*/30 * * * *' # Every 30 minutes
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run monitor
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: backend-report
          path: logs/backend-reports/latest.json
```

## Troubleshooting

### Monitor won't start

1. Check Node.js version (requires Node 14+):

   ```bash
   node --version
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Check for port conflicts if running server simultaneously

### Reports not being saved

1. Check write permissions:

   ```bash
   ls -la logs/
   ```

2. Create logs directory manually:
   ```bash
   mkdir -p logs/backend-reports
   ```

### Master Agent not receiving reports

1. Verify endpoint URL:

   ```bash
   echo $MASTER_AGENT_URL
   ```

2. Check network connectivity:

   ```bash
   curl -X POST $MASTER_AGENT_URL -H "Content-Type: application/json" -d '{"test": true}'
   ```

3. Review monitor logs for HTTP errors

## Best Practices

1. **Run in Production** - Keep monitoring running on production servers
2. **Review Reports Daily** - Check for recurring issues
3. **Set Up Alerts** - Configure master agent to alert on critical issues
4. **Archive Old Reports** - Clean up old report files periodically
5. **Update Checks** - Add new checks as your backend grows

## Future Enhancements

Planned features:

- [ ] Real-time API endpoint testing
- [ ] Performance metrics (response times)
- [ ] Memory and CPU usage monitoring
- [ ] Disk space checks
- [ ] Database query performance
- [ ] Email notifications
- [ ] Slack/Discord webhooks
- [ ] Grafana/Prometheus integration
- [ ] Custom check plugins

## Support

For issues or questions:

- Check the troubleshooting section
- Review report logs in `logs/backend-reports/`
- Contact the development team

## License

Same as main project.
