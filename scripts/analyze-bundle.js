#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes bundle size and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting Bundle Analysis...\n');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// 1. Analyze .next directory
function analyzeNextBuild() {
  log('\n📦 Analyzing Build Output...', 'bright');
  
  const buildDir = path.join(process.cwd(), '.next');
  
  if (!fs.existsSync(buildDir)) {
    log('❌ No build found. Run "npm run build" first.', 'red');
    return null;
  }

  // Read build manifest
  const manifestPath = path.join(buildDir, 'build-manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    log('\n📄 Pages and their chunks:', 'blue');
    Object.entries(manifest.pages).forEach(([page, files]) => {
      log(`  ${page}:`, 'yellow');
      files.forEach(file => log(`    - ${file}`, 'reset'));
    });
  }

  // Analyze static chunks
  const staticDir = path.join(buildDir, 'static', 'chunks');
  if (fs.existsSync(staticDir)) {
    const chunks = fs.readdirSync(staticDir)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(staticDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          path: filePath,
        };
      })
      .sort((a, b) => b.size - a.size);

    log('\n📊 Largest Chunks:', 'bright');
    chunks.slice(0, 10).forEach((chunk, i) => {
      const color = chunk.size > 250000 ? 'red' : chunk.size > 100000 ? 'yellow' : 'green';
      log(`  ${i + 1}. ${chunk.name}: ${formatBytes(chunk.size)}`, color);
    });

    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    log(`\n  Total JS size: ${formatBytes(totalSize)}`, 'bright');

    return { chunks, totalSize };
  }

  return null;
}

// 2. Analyze package.json dependencies
function analyzeDependencies() {
  log('\n📚 Analyzing Dependencies...', 'bright');
  
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );

  const heavyDeps = [
    { name: 'framer-motion', recommend: 'Use dynamic imports' },
    { name: 'leaflet', recommend: 'Load only on map pages' },
    { name: 'react-leaflet', recommend: 'Load only on map pages' },
    { name: '@tanstack/react-query', recommend: 'Consider lighter alternative' },
    { name: 'axios', recommend: 'Use native fetch API' },
  ];

  log('\n⚠️  Heavy Dependencies Found:', 'yellow');
  heavyDeps.forEach(dep => {
    if (packageJson.dependencies[dep.name]) {
      log(`  • ${dep.name}`, 'red');
      log(`    → ${dep.recommend}`, 'blue');
    }
  });
}

// 3. Check for duplicate dependencies
function checkDuplicates() {
  log('\n🔎 Checking for Duplicate Dependencies...', 'bright');
  
  try {
    const output = execSync('npm ls --depth=0 --json', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const deps = JSON.parse(output);
    
    // This is a simplified check - in reality, you'd need to analyze the full tree
    log('  ✓ Basic dependency check complete', 'green');
  } catch (error) {
    log('  ⚠️  Some dependency issues found', 'yellow');
  }
}

// 4. Optimization recommendations
function provideRecommendations(analysis) {
  log('\n💡 Optimization Recommendations:', 'bright');
  
  const recommendations = [
    {
      priority: 'HIGH',
      title: 'Implement Dynamic Imports',
      details: 'Use next/dynamic for heavy components (maps, charts, modals)',
      savings: '30-50% reduction in initial bundle',
    },
    {
      priority: 'HIGH',
      title: 'Tree Shaking',
      details: 'Import only needed functions from libraries',
      savings: '10-20% reduction',
    },
    {
      priority: 'MEDIUM',
      title: 'Replace Heavy Dependencies',
      details: 'Consider: axios → fetch, moment → date-fns',
      savings: '50-200KB per replacement',
    },
    {
      priority: 'MEDIUM',
      title: 'Code Splitting',
      details: 'Split vendor chunks and implement proper caching',
      savings: 'Better caching = faster loads',
    },
    {
      priority: 'LOW',
      title: 'CSS Optimization',
      details: 'Remove unused CSS with PurgeCSS/Tailwind JIT',
      savings: '20-40KB',
    },
  ];

  recommendations.forEach(rec => {
    const priorityColor = rec.priority === 'HIGH' ? 'red' : rec.priority === 'MEDIUM' ? 'yellow' : 'green';
    log(`\n  [${rec.priority}] ${rec.title}`, priorityColor);
    log(`  Details: ${rec.details}`, 'reset');
    log(`  Expected savings: ${rec.savings}`, 'blue');
  });
}

// 5. Generate report
function generateReport(analysis) {
  log('\n📝 Generating Report...', 'bright');
  
  const report = {
    timestamp: new Date().toISOString(),
    analysis,
    recommendations: [],
  };

  const reportPath = path.join(process.cwd(), 'bundle-analysis-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`  ✓ Report saved to: ${reportPath}`, 'green');
}

// Main execution
async function main() {
  try {
    const analysis = analyzeNextBuild();
    analyzeDependencies();
    checkDuplicates();
    provideRecommendations(analysis);
    
    if (analysis) {
      generateReport(analysis);
    }

    log('\n✨ Analysis Complete!', 'bright');
    log('\nNext steps:', 'yellow');
    log('  1. Review the recommendations above', 'reset');
    log('  2. Run "npm run analyze" to see visual bundle analysis', 'reset');
    log('  3. Implement optimizations starting with HIGH priority items', 'reset');
  } catch (error) {
    log(`\n❌ Error during analysis: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();

