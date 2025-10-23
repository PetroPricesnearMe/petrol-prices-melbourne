#!/usr/bin/env node
/**
 * Lighthouse Performance Audit Script
 * Runs Lighthouse audit and checks for 95+ performance score
 *
 * Usage:
 *   node scripts/lighthouse-audit.js [url]
 *   npm run lighthouse
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuration
const TARGET_SCORES = {
  performance: 95,
  accessibility: 90,
  'best-practices': 90,
  seo: 90,
};

const url = process.argv[2] || 'http://localhost:3000';

// Lighthouse configuration
const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

/**
 * Launch Chrome and run Lighthouse
 */
async function runLighthouse() {
  console.log('\n🚀 Starting Lighthouse audit...\n');
  console.log(`📍 URL: ${url}\n`);

  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
    });

    const lighthouseFlags = {
      port: chrome.port,
      output: ['html', 'json'],
      logLevel: 'info',
    };

    const results = await lighthouse(url, lighthouseFlags, lighthouseConfig);

    // Save reports
    const reportDir = path.join(process.cwd(), 'lighthouse-reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const htmlPath = path.join(reportDir, `report-${timestamp}.html`);
    const jsonPath = path.join(reportDir, `report-${timestamp}.json`);

    fs.writeFileSync(htmlPath, results.report[0]);
    fs.writeFileSync(jsonPath, results.report[1]);

    console.log(`\n📊 Reports saved:`);
    console.log(`   HTML: ${htmlPath}`);
    console.log(`   JSON: ${jsonPath}\n`);

    // Display scores
    const categories = results.lhr.categories;
    console.log('📈 Lighthouse Scores:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let allPassed = true;
    const scores = {};

    for (const [key, category] of Object.entries(categories)) {
      const score = Math.round(category.score * 100);
      const target = TARGET_SCORES[key];
      const passed = score >= target;
      const emoji = passed ? '✅' : '❌';

      scores[key] = score;
      if (!passed) allPassed = false;

      console.log(
        `${emoji} ${category.title.padEnd(20)} ${score}/100 ${
          target ? `(target: ${target})` : ''
        }`
      );
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Core Web Vitals
    const audits = results.lhr.audits;
    console.log('⚡ Core Web Vitals:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const webVitals = {
      'First Contentful Paint': audits['first-contentful-paint']?.displayValue,
      'Largest Contentful Paint': audits['largest-contentful-paint']?.displayValue,
      'Total Blocking Time': audits['total-blocking-time']?.displayValue,
      'Cumulative Layout Shift': audits['cumulative-layout-shift']?.displayValue,
      'Speed Index': audits['speed-index']?.displayValue,
      'Time to Interactive': audits['interactive']?.displayValue,
    };

    for (const [metric, value] of Object.entries(webVitals)) {
      if (value) {
        console.log(`   ${metric.padEnd(30)} ${value}`);
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Performance opportunities
    if (scores.performance < 95) {
      console.log('💡 Performance Opportunities:\n');

      const opportunities = Object.values(audits)
        .filter(audit => audit.details?.type === 'opportunity' && audit.score < 1)
        .sort((a, b) => (b.details?.overallSavingsMs || 0) - (a.details?.overallSavingsMs || 0))
        .slice(0, 5);

      opportunities.forEach(audit => {
        const savings = audit.details?.overallSavingsMs;
        if (savings > 100) {
          console.log(`   ⚠️  ${audit.title}`);
          console.log(`       Potential savings: ${Math.round(savings)}ms\n`);
        }
      });
    }

    // Final result
    if (allPassed) {
      console.log('✅ All targets met! Great job! 🎉\n');
      process.exit(0);
    } else {
      console.log('❌ Some targets not met. Review the reports for details.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Lighthouse audit failed:', error.message);
    process.exit(1);
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

// Check if lighthouse is installed
try {
  require.resolve('lighthouse');
  require.resolve('chrome-launcher');
} catch (e) {
  console.error('\n❌ Lighthouse not installed!');
  console.error('\n📦 Install with: npm install --save-dev lighthouse chrome-launcher\n');
  process.exit(1);
}

// Run the audit
runLighthouse().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
