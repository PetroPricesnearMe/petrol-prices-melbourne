/**
 * Backend Monitoring Scheduler
 * Runs backend monitoring every 30 minutes and reports to master agent
 * 
 * Usage:
 *   node scripts/backend-monitor-scheduler.js
 * 
 * To run as a background service:
 *   npm install -g pm2
 *   pm2 start scripts/backend-monitor-scheduler.js --name "backend-monitor"
 */

const BackendMonitor = require('./backend-monitor');

// Configuration
const SCAN_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
const MASTER_AGENT_ENDPOINT = process.env.MASTER_AGENT_URL || null;

class MonitoringScheduler {
  constructor() {
    this.scanCount = 0;
    this.lastScanTime = null;
    this.isScanning = false;
  }

  /**
   * Start the monitoring scheduler
   */
  start() {
    console.log('🚀 Backend Monitoring Scheduler Started');
    console.log(`⏱️  Scan Interval: Every 30 minutes`);
    console.log(`📡 Master Agent: ${MASTER_AGENT_ENDPOINT || 'Local logging only'}`);
    console.log(`⏰ Current Time: ${new Date().toISOString()}\n`);
    console.log('Press Ctrl+C to stop\n');

    // Run initial scan immediately
    this.runScan();

    // Schedule recurring scans
    this.intervalId = setInterval(() => {
      this.runScan();
    }, SCAN_INTERVAL_MS);

    // Handle graceful shutdown
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
  }

  /**
   * Run a single scan
   */
  async runScan() {
    if (this.isScanning) {
      console.log('⏳ Previous scan still in progress, skipping...');
      return;
    }

    this.isScanning = true;
    this.scanCount++;
    this.lastScanTime = new Date();

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 SCAN #${this.scanCount} - ${this.lastScanTime.toISOString()}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
      const monitor = new BackendMonitor();
      const summary = await monitor.runFullScan();

      // Report to master agent
      await this.reportToMasterAgent(summary);

      // Display next scan time
      const nextScanTime = new Date(Date.now() + SCAN_INTERVAL_MS);
      console.log(`⏰ Next scan scheduled for: ${nextScanTime.toLocaleString()}\n`);

    } catch (error) {
      console.error('❌ Scan failed:', error);
    } finally {
      this.isScanning = false;
    }
  }

  /**
   * Report results to master agent
   */
  async reportToMasterAgent(summary) {
    console.log('📤 Reporting to Master Agent...');

    const report = {
      agentType: 'backend-monitor',
      scanNumber: this.scanCount,
      timestamp: summary.timestamp,
      status: summary.status,
      summary: {
        totalIssues: summary.totalIssues,
        criticalErrors: summary.errors.filter(e => e.severity === 'CRITICAL').length,
        highErrors: summary.errors.filter(e => e.severity === 'HIGH').length,
        mediumWarnings: summary.warnings.filter(w => w.severity === 'MEDIUM').length,
        lowWarnings: summary.warnings.filter(w => w.severity === 'LOW').length,
        infoCount: summary.info.length
      },
      errors: summary.errors,
      warnings: summary.warnings,
      recommendations: this.generateRecommendations(summary)
    };

    // If master agent endpoint is configured, send report via HTTP
    if (MASTER_AGENT_ENDPOINT) {
      try {
        const response = await fetch(MASTER_AGENT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Agent-Type': 'backend-monitor',
            'X-Scan-Number': this.scanCount.toString()
          },
          body: JSON.stringify(report)
        });

        if (response.ok) {
          console.log('✅ Report sent to Master Agent successfully');
        } else {
          console.error(`❌ Master Agent responded with status: ${response.status}`);
        }
      } catch (error) {
        console.error('❌ Failed to send report to Master Agent:', error.message);
      }
    } else {
      // Local logging
      console.log('📝 Master Agent Report (Local):');
      console.log(JSON.stringify(report, null, 2));
    }

    console.log('');
  }

  /**
   * Generate recommendations based on findings
   */
  generateRecommendations(summary) {
    const recommendations = [];

    // Check for critical issues
    const criticalErrors = summary.errors.filter(e => e.severity === 'CRITICAL');
    if (criticalErrors.length > 0) {
      recommendations.push({
        priority: 'URGENT',
        action: 'Address critical issues immediately',
        details: criticalErrors.map(e => `${e.category}: ${e.issue}`)
      });
    }

    // Check for high priority issues
    const highErrors = summary.errors.filter(e => e.severity === 'HIGH');
    if (highErrors.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Fix high priority issues soon',
        details: highErrors.map(e => `${e.category}: ${e.issue}`)
      });
    }

    // Check for medium warnings
    const mediumWarnings = summary.warnings.filter(w => w.severity === 'MEDIUM');
    if (mediumWarnings.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Review and address warnings when possible',
        details: mediumWarnings.map(w => `${w.category}: ${w.issue}`)
      });
    }

    // Check if everything is healthy
    if (summary.totalIssues === 0) {
      recommendations.push({
        priority: 'INFO',
        action: 'No action required',
        details: ['Backend is healthy and operating normally']
      });
    }

    return recommendations;
  }

  /**
   * Stop the scheduler
   */
  stop() {
    console.log('\n\n🛑 Stopping Backend Monitoring Scheduler...');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    console.log(`📊 Total Scans Performed: ${this.scanCount}`);
    console.log(`⏰ Last Scan: ${this.lastScanTime ? this.lastScanTime.toISOString() : 'N/A'}`);
    console.log('👋 Goodbye!\n');

    process.exit(0);
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      running: !!this.intervalId,
      scanCount: this.scanCount,
      lastScanTime: this.lastScanTime,
      isScanning: this.isScanning,
      nextScanTime: this.lastScanTime ? 
        new Date(this.lastScanTime.getTime() + SCAN_INTERVAL_MS) : 
        new Date()
    };
  }
}

// Start the scheduler
if (require.main === module) {
  const scheduler = new MonitoringScheduler();
  scheduler.start();
}

module.exports = MonitoringScheduler;

