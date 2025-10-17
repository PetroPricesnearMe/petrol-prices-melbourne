/**
 * Master Agent Report Endpoint
 * Receives backend monitoring reports from the monitoring agent
 * 
 * POST /api/master-agent-report
 */

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed: ['POST']
    });
  }

  try {
    const report = req.body;
    
    // Validate report structure
    if (!report || !report.timestamp || !report.agentType) {
      return res.status(400).json({ 
        error: 'Invalid report format',
        required: ['timestamp', 'agentType', 'status', 'summary']
      });
    }

    console.log('📥 [Master Agent] Received report from:', report.agentType);
    console.log('⏰ [Master Agent] Timestamp:', report.timestamp);
    console.log('📊 [Master Agent] Status:', report.status);
    console.log('📈 [Master Agent] Summary:', report.summary);

    // Save report
    const reportsDir = path.join(process.cwd(), 'logs', 'master-agent-reports');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date(report.timestamp).toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportsDir, `${report.agentType}-${timestamp}.json`);
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Save latest report
    const latestPath = path.join(reportsDir, `${report.agentType}-latest.json`);
    fs.writeFileSync(latestPath, JSON.stringify(report, null, 2));

    // Check for critical issues and take action
    if (report.summary && report.summary.criticalErrors > 0) {
      console.error('🚨 [Master Agent] CRITICAL ISSUES DETECTED!');
      console.error('❌ [Master Agent] Critical Errors:', report.summary.criticalErrors);
      
      // Here you could:
      // - Send email notification
      // - Trigger Slack/Discord webhook
      // - Create incident ticket
      // - Alert on-call engineer
      
      report.errors.filter(e => e.severity === 'CRITICAL').forEach(error => {
        console.error(`   🔴 ${error.category}: ${error.issue}`);
      });
    }

    // Check for high priority issues
    if (report.summary && report.summary.highErrors > 0) {
      console.warn('⚠️  [Master Agent] High priority issues detected');
      console.warn('🟠 [Master Agent] High Errors:', report.summary.highErrors);
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Report received and processed',
      reportId: report.scanNumber || Date.now(),
      timestamp: new Date().toISOString(),
      actions: {
        saved: true,
        notifications: report.summary?.criticalErrors > 0 ? 'triggered' : 'none',
        nextSteps: generateNextSteps(report)
      }
    });

  } catch (error) {
    console.error('❌ [Master Agent] Error processing report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process report',
      message: error.message
    });
  }
}

/**
 * Generate next steps based on report
 */
function generateNextSteps(report) {
  const steps = [];

  if (!report.summary) {
    return ['Review report format'];
  }

  if (report.summary.criticalErrors > 0) {
    steps.push('Immediate action required: Fix critical issues');
    steps.push('Check logs/master-agent-reports/ for details');
    steps.push('Escalate to engineering team');
  }

  if (report.summary.highErrors > 0) {
    steps.push('Schedule fix for high priority issues within 24 hours');
  }

  if (report.summary.mediumWarnings > 0) {
    steps.push('Review and address warnings in next sprint');
  }

  if (steps.length === 0) {
    steps.push('No action required - system is healthy');
  }

  return steps;
}

