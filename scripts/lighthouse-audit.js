#!/usr/bin/env node

/**
 * Lighthouse Performance Audit Script
 * Runs Lighthouse audits and generates performance reports
 * Targets 95+ scores for all metrics
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuration for Lighthouse audit
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'cumulative-layout-shift',
      'total-blocking-time',
      'interactive',
      'max-potential-fid',
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'efficient-animated-content',
      'preload-lcp-image',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-text-compression',
      'uses-responsive-images',
      'modern-image-formats',
      'offscreen-images',
      'unminified-css',
      'unminified-javascript',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'uses-rel-preconnect',
      'uses-rel-preload',
      'critical-request-chains',
      'user-timings',
      'bootup-time',
      'mainthread-work-breakdown',
      'font-display',
    ],
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    emulatedFormFactor: 'mobile',
    locale: 'en-US',
    blockedUrlPatterns: null,
    additionalTraceCategories: null,
    extraHeaders: null,
    precomputedLanternData: null,
    skipAudits: [],
    onlyCategories: ['performance'],
  },
};

// Performance thresholds
const thresholds = {
  performance: 95,
  'first-contentful-paint': 1000,
  'largest-contentful-paint': 1200,
  'first-meaningful-paint': 1000,
  'speed-index': 1500,
  'cumulative-layout-shift': 0.1,
  'total-blocking-time': 200,
  interactive: 2000,
  'max-potential-fid': 100,
};

async function runLighthouseAudit(url) {
  console.log(`🚀 Starting Lighthouse audit for ${url}...`);

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(url, options, config);

    // Extract performance metrics
    const lhr = runnerResult.lhr;
    const audits = lhr.audits;
    const categories = lhr.categories;

    console.log('\n📊 Performance Audit Results:');
    console.log('================================');

    // Overall performance score
    const performanceScore = Math.round(categories.performance.score * 100);
    console.log(`Overall Performance Score: ${performanceScore}/100`);

    if (performanceScore >= thresholds.performance) {
      console.log('✅ Performance score meets target (95+)');
    } else {
      console.log('❌ Performance score below target (95+)');
    }

    console.log('\n🎯 Core Web Vitals:');
    console.log('-------------------');

    // Check each Core Web Vital
    const coreWebVitals = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'cumulative-layout-shift',
      'total-blocking-time',
      'interactive',
    ];

    let allVitalsPass = true;

    coreWebVitals.forEach((vital) => {
      const audit = audits[vital];
      if (audit) {
        const value = audit.numericValue;
        const threshold = thresholds[vital];
        const status = value <= threshold ? '✅' : '❌';
        const unit = vital === 'cumulative-layout-shift' ? '' : 'ms';

        console.log(
          `${status} ${audit.title}: ${Math.round(value)}${unit} (target: ≤${threshold}${unit})`
        );

        if (value > threshold) {
          allVitalsPass = false;
        }
      }
    });

    console.log('\n🔍 Detailed Metrics:');
    console.log('-------------------');

    // Additional important metrics
    const additionalMetrics = [
      'first-meaningful-paint',
      'speed-index',
      'max-potential-fid',
    ];

    additionalMetrics.forEach((metric) => {
      const audit = audits[metric];
      if (audit) {
        const value = audit.numericValue;
        const threshold = thresholds[metric];
        const status = value <= threshold ? '✅' : '⚠️';
        const unit = 'ms';

        console.log(
          `${status} ${audit.title}: ${Math.round(value)}${unit} (target: ≤${threshold}${unit})`
        );
      }
    });

    console.log('\n💡 Optimization Opportunities:');
    console.log('------------------------------');

    // Check for optimization opportunities
    const optimizationAudits = [
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'efficient-animated-content',
      'preload-lcp-image',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-text-compression',
      'uses-responsive-images',
      'modern-image-formats',
      'offscreen-images',
      'unminified-css',
      'unminified-javascript',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'uses-rel-preconnect',
      'uses-rel-preload',
    ];

    optimizationAudits.forEach((auditName) => {
      const audit = audits[auditName];
      if (audit && audit.score < 0.9) {
        const score = Math.round(audit.score * 100);
        console.log(`⚠️  ${audit.title}: ${score}/100`);
        if (audit.details && audit.details.overallSavingsMs) {
          console.log(
            `   Potential savings: ${Math.round(audit.details.overallSavingsMs)}ms`
          );
        }
      }
    });

    // Generate report
    const reportData = {
      url,
      timestamp: new Date().toISOString(),
      performance: {
        score: performanceScore,
        meetsTarget: performanceScore >= thresholds.performance,
      },
      coreWebVitals: coreWebVitals.reduce((acc, vital) => {
        const audit = audits[vital];
        if (audit) {
          acc[vital] = {
            value: audit.numericValue,
            threshold: thresholds[vital],
            passes: audit.numericValue <= thresholds[vital],
            title: audit.title,
          };
        }
        return acc;
      }, {}),
      allVitalsPass,
      recommendations: optimizationAudits
        .filter(
          (auditName) => audits[auditName] && audits[auditName].score < 0.9
        )
        .map((auditName) => ({
          name: auditName,
          title: audits[auditName].title,
          score: Math.round(audits[auditName].score * 100),
          savings: audits[auditName].details?.overallSavingsMs || 0,
        })),
    };

    // Save report
    const reportPath = path.join(process.cwd(), 'lighthouse-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);

    // Final summary
    console.log('\n🎯 Summary:');
    console.log('===========');
    console.log(
      `Performance Score: ${performanceScore}/100 ${performanceScore >= 95 ? '✅' : '❌'}`
    );
    console.log(
      `Core Web Vitals: ${allVitalsPass ? '✅ All pass' : '❌ Some fail'}`
    );
    console.log(
      `Optimization Opportunities: ${reportData.recommendations.length}`
    );

    if (performanceScore >= 95 && allVitalsPass) {
      console.log('\n🎉 Excellent! All performance targets met!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Performance improvements needed.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error);
    process.exit(1);
  } finally {
    await chrome.kill();
  }
}

// Main execution
const url = process.argv[2] || 'http://localhost:3000';
runLighthouseAudit(url);
