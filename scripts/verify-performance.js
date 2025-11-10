#!/usr/bin/env node

/**
 * Performance Verification Script
 * 
 * Automated checks for:
 * - Font preload configuration
 * - Hero image priority
 * - Build output analysis
 * - Bundle size tracking
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${COLORS.cyan}ℹ${COLORS.reset} ${msg}`),
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  warning: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  section: (msg) => console.log(`\n${COLORS.bright}${msg}${COLORS.reset}\n`),
};

let passedChecks = 0;
let totalChecks = 0;

function check(condition, successMsg, errorMsg) {
  totalChecks++;
  if (condition) {
    log.success(successMsg);
    passedChecks++;
    return true;
  } else {
    log.error(errorMsg);
    return false;
  }
}

// Check 1: Verify layout.tsx has font preload
function checkFontPreload() {
  log.section('📝 Checking Font Preload Configuration');
  
  const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
  
  if (!fs.existsSync(layoutPath)) {
    log.error('layout.tsx not found at src/app/layout.tsx');
    return false;
  }
  
  const content = fs.readFileSync(layoutPath, 'utf-8');
  
  check(
    content.includes('preload: true'),
    'Font preload is enabled in layout.tsx',
    'Font preload is NOT enabled - add "preload: true" to your font configuration'
  );
  
  check(
    content.includes("display: 'swap'"),
    'Font display swap is enabled',
    'Font display swap is NOT enabled - add "display: \'swap\'" to prevent FOIT'
  );
  
  check(
    content.includes('rel="preconnect"') && content.includes('fonts.googleapis.com'),
    'Preconnect to Google Fonts is configured',
    'Missing preconnect to Google Fonts - add <link rel="preconnect" href="https://fonts.googleapis.com" />'
  );
  
  check(
    content.includes('rel="dns-prefetch"'),
    'DNS prefetch is configured',
    'DNS prefetch is missing - consider adding for performance'
  );
}

// Check 2: Verify hero image exists and check for priority usage
function checkHeroImage() {
  log.section('🖼️  Checking Hero Image');
  
  const heroImagePath = path.join(process.cwd(), 'public', 'images', 'hero-petrol-station.jpg');
  
  check(
    fs.existsSync(heroImagePath),
    'Hero image found at /images/hero-petrol-station.jpg',
    'Hero image NOT found at /images/hero-petrol-station.jpg'
  );
  
  // Check if hero image is used with priority in any component
  const srcDir = path.join(process.cwd(), 'src');
  let foundPriorityUsage = false;
  
  function searchForPriority(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.includes('node_modules')) {
        searchForPriority(filePath);
      } else if (file.match(/\.(tsx|jsx)$/)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('hero-petrol-station') && content.includes('priority')) {
          foundPriorityUsage = true;
        }
      }
    }
  }
  
  searchForPriority(srcDir);
  
  check(
    foundPriorityUsage,
    'Hero image is using priority loading',
    'Hero image may not be using priority - ensure <Image priority={true} /> for LCP optimization'
  );
}

// Check 3: Verify next.config.ts optimizations
function checkNextConfig() {
  log.section('⚙️  Checking Next.js Configuration');
  
  const configPath = path.join(process.cwd(), 'next.config.ts');
  
  if (!fs.existsSync(configPath)) {
    log.warning('next.config.ts not found');
    return;
  }
  
  const content = fs.readFileSync(configPath, 'utf-8');
  
  check(
    content.includes('compress: true'),
    'Compression is enabled',
    'Compression is disabled - enable with "compress: true"'
  );
  
  check(
    content.includes("formats: ['image/avif', 'image/webp']"),
    'Modern image formats (AVIF, WebP) are configured',
    'Modern image formats not configured - add formats: [\'image/avif\', \'image/webp\']'
  );
  
  check(
    content.includes('optimizePackageImports'),
    'Package import optimization is enabled',
    'Package optimization missing - consider adding experimental.optimizePackageImports'
  );
}

// Check 4: Verify build output exists and analyze
function checkBuildOutput() {
  log.section('📦 Checking Build Output');
  
  const nextDir = path.join(process.cwd(), '.next');
  
  if (!fs.existsSync(nextDir)) {
    log.warning('No build found. Run "npm run build" first.');
    log.info('Skipping build analysis...');
    return;
  }
  
  log.success('.next directory exists (build completed)');
  
  // Check for build manifest
  const buildManifest = path.join(nextDir, 'build-manifest.json');
  if (fs.existsSync(buildManifest)) {
    const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf-8'));
    const pages = Object.keys(manifest.pages || {}).length;
    log.info(`Found ${pages} pages in build manifest`);
  }
  
  // Check static files
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    const chunks = fs.readdirSync(path.join(staticDir, 'chunks')).filter(f => f.endsWith('.js'));
    log.info(`Found ${chunks.length} JavaScript chunks`);
  }
}

// Check 5: Look for potential performance issues in code
function checkCommonIssues() {
  log.section('🔍 Scanning for Common Issues');
  
  const srcDir = path.join(process.cwd(), 'src');
  const issues = [];
  
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.includes('node_modules')) {
        scanDirectory(filePath);
      } else if (file.match(/\.(tsx|jsx)$/)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Check for images without next/image
        if (content.includes('<img ') && !content.includes('next/image')) {
          issues.push({
            file: filePath.replace(process.cwd(), ''),
            issue: 'Using <img> tag instead of next/image',
            severity: 'warning'
          });
        }
        
        // Check for missing image dimensions
        if (content.includes('<Image') && !content.includes('width=') && !content.includes('fill')) {
          issues.push({
            file: filePath.replace(process.cwd(), ''),
            issue: 'Image component may be missing width/height props',
            severity: 'info'
          });
        }
        
        // Check for console.log in production code
        if (content.includes('console.log') && !filePath.includes('scripts')) {
          issues.push({
            file: filePath.replace(process.cwd(), ''),
            issue: 'Contains console.log statements',
            severity: 'info'
          });
        }
      }
    }
  }
  
  scanDirectory(srcDir);
  
  if (issues.length === 0) {
    log.success('No common issues found');
  } else {
    issues.forEach(issue => {
      const logFn = issue.severity === 'warning' ? log.warning : log.info;
      logFn(`${issue.file}: ${issue.issue}`);
    });
  }
}

// Check 6: Verify package.json has required dependencies
function checkDependencies() {
  log.section('📚 Checking Dependencies');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    log.error('package.json not found');
    return;
  }
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  check(
    deps['next'] && deps['next'].includes('15'),
    `Next.js 15 installed (${deps['next'] || 'not found'})`,
    'Next.js 15 not found - ensure you\'re using the latest version'
  );
  
  check(
    deps['web-vitals'],
    'web-vitals package is installed',
    'web-vitals package missing - install with: npm install web-vitals'
  );
  
  const hasImagePackage = deps['sharp'] || deps['@next/image'];
  check(
    hasImagePackage,
    'Image optimization dependencies installed',
    'Consider installing sharp for better image optimization: npm install sharp'
  );
}

// Main execution
async function main() {
  console.log('\n' + COLORS.bright + '🚀 Performance Verification Tool' + COLORS.reset);
  console.log('Checking Next.js 15 performance optimizations...\n');
  
  checkFontPreload();
  checkHeroImage();
  checkNextConfig();
  checkBuildOutput();
  checkDependencies();
  checkCommonIssues();
  
  // Summary
  log.section('📊 Summary');
  
  const percentage = Math.round((passedChecks / totalChecks) * 100);
  const color = percentage >= 90 ? COLORS.green : percentage >= 70 ? COLORS.yellow : COLORS.red;
  
  console.log(`${color}${passedChecks}/${totalChecks} checks passed (${percentage}%)${COLORS.reset}\n`);
  
  if (percentage >= 90) {
    log.success('Excellent! Your performance optimizations look good.');
  } else if (percentage >= 70) {
    log.warning('Good progress, but some improvements are needed.');
  } else {
    log.error('Several issues need attention for optimal performance.');
  }
  
  console.log('\n' + COLORS.cyan + '📖 Next Steps:' + COLORS.reset);
  console.log('1. Fix any failed checks above');
  console.log('2. Run: npm run build');
  console.log('3. Run: npm start');
  console.log('4. Test with Lighthouse: lighthouse http://localhost:3000 --view');
  console.log('5. Check the browser console for warnings\n');
  
  process.exit(percentage >= 70 ? 0 : 1);
}

main().catch(console.error);

