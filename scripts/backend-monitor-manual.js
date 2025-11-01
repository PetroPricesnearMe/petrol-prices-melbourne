/**
 * Manual Backend Monitor Runner
 * Run a one-time backend scan without scheduling
 * 
 * Usage:
 *   node scripts/backend-monitor-manual.js
 */

const BackendMonitor = require('./backend-monitor');

console.log('🔍 Running Manual Backend Scan...\n');

const monitor = new BackendMonitor();
monitor.runFullScan()
  .then((summary) => {
    console.log('\n✅ Manual scan completed successfully');
    console.log(`Status: ${summary.status}`);
    console.log(`Total Issues: ${summary.totalIssues}`);
    
    // Exit with error code if issues found
    process.exit(summary.errors.length > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('\n❌ Manual scan failed:', error);
    process.exit(1);
  });

