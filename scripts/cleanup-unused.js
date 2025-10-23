#!/usr/bin/env node
/**
 * Cleanup Script - Find Unused Code
 * 
 * Detects:
 * - Unused imports
 * - Unused CSS classes
 * - Unused components
 * - Duplicate code
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Configuration
const config = {
  srcDir: path.join(process.cwd(), 'src'),
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  cssExtensions: ['.css', '.scss'],
  excludeDirs: ['node_modules', '.next', 'build', 'dist'],
};

/**
 * Get all files recursively
 */
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!config.excludeDirs.includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Find unused exports
 */
function findUnusedExports() {
  log.title('🔍 Finding Unused Exports...');

  try {
    const result = execSync('npx ts-prune --error', {
      encoding: 'utf8',
      stdio: 'pipe',
    });

    const lines = result.split('\n').filter(Boolean);
    
    if (lines.length === 0) {
      log.success('No unused exports found!');
      return [];
    }

    log.warning(`Found ${lines.length} potentially unused exports:`);
    lines.forEach((line) => console.log(`  ${line}`));
    
    return lines;
  } catch (error) {
    if (error.stdout) {
      const lines = error.stdout.split('\n').filter(Boolean);
      log.warning(`Found ${lines.length} potentially unused exports`);
      return lines;
    }
    log.info('ts-prune not available, skipping unused export check');
    return [];
  }
}

/**
 * Find unused imports in a file
 */
function findUnusedImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const unusedImports = [];

  // Match import statements
  const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
  const matches = [...content.matchAll(importRegex)];

  matches.forEach((match) => {
    if (match[1]) {
      // Named imports
      const imports = match[1].split(',').map((i) => i.trim());
      imports.forEach((importName) => {
        const cleanName = importName.replace(/\s+as\s+\w+/, '').trim();
        // Check if import is used in the file
        const usageRegex = new RegExp(`\\b${cleanName}\\b`, 'g');
        const usages = (content.match(usageRegex) || []).length;
        
        // If only used once (in the import statement itself), it's unused
        if (usages <= 1) {
          unusedImports.push({
            type: 'named',
            name: cleanName,
            from: match[3],
            line: content.substring(0, match.index).split('\n').length,
          });
        }
      });
    } else if (match[2]) {
      // Default import
      const importName = match[2];
      const usageRegex = new RegExp(`\\b${importName}\\b`, 'g');
      const usages = (content.match(usageRegex) || []).length;
      
      if (usages <= 1) {
        unusedImports.push({
          type: 'default',
          name: importName,
          from: match[3],
          line: content.substring(0, match.index).split('\n').length,
        });
      }
    }
  });

  return unusedImports;
}

/**
 * Find all unused imports
 */
function findAllUnusedImports() {
  log.title('📦 Finding Unused Imports...');

  const allFiles = getAllFiles(config.srcDir);
  const codeFiles = allFiles.filter((file) =>
    config.fileExtensions.some((ext) => file.endsWith(ext))
  );

  const results = {};
  let totalUnused = 0;

  codeFiles.forEach((file) => {
    const unusedImports = findUnusedImportsInFile(file);
    if (unusedImports.length > 0) {
      results[file] = unusedImports;
      totalUnused += unusedImports.length;
    }
  });

  if (totalUnused === 0) {
    log.success('No unused imports found!');
  } else {
    log.warning(`Found ${totalUnused} unused imports in ${Object.keys(results).length} files:`);
    Object.entries(results).forEach(([file, imports]) => {
      console.log(`\n  ${path.relative(process.cwd(), file)}:`);
      imports.forEach((imp) => {
        console.log(`    Line ${imp.line}: ${imp.name} from "${imp.from}"`);
      });
    });
  }

  return results;
}

/**
 * Find unused CSS classes
 */
function findUnusedCSS() {
  log.title('🎨 Finding Unused CSS Classes...');

  const allFiles = getAllFiles(config.srcDir);
  const cssFiles = allFiles.filter((file) =>
    config.cssExtensions.some((ext) => file.endsWith(ext))
  );
  const codeFiles = allFiles.filter((file) =>
    config.fileExtensions.some((ext) => file.endsWith(ext))
  );

  const cssClasses = new Set();
  const usedClasses = new Set();

  // Extract all CSS classes
  cssFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const classMatches = content.matchAll(/\.([a-zA-Z0-9_-]+)/g);
    for (const match of classMatches) {
      cssClasses.add(match[1]);
    }
  });

  // Find used classes in code
  codeFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    cssClasses.forEach((className) => {
      if (content.includes(className)) {
        usedClasses.add(className);
      }
    });
  });

  const unusedClasses = [...cssClasses].filter((c) => !usedClasses.has(c));

  if (unusedClasses.length === 0) {
    log.success('No unused CSS classes found!');
  } else {
    log.warning(`Found ${unusedClasses.length} potentially unused CSS classes:`);
    unusedClasses.slice(0, 20).forEach((className) => {
      console.log(`  .${className}`);
    });
    if (unusedClasses.length > 20) {
      console.log(`  ... and ${unusedClasses.length - 20} more`);
    }
  }

  return unusedClasses;
}

/**
 * Find duplicate code
 */
function findDuplicates() {
  log.title('🔄 Finding Duplicate Code...');

  try {
    const result = execSync('npx jscpd src --min-lines 10 --min-tokens 50 --format "json"', {
      encoding: 'utf8',
      stdio: 'pipe',
    });

    const data = JSON.parse(result);
    const duplicates = data.duplicates || [];

    if (duplicates.length === 0) {
      log.success('No significant code duplication found!');
    } else {
      log.warning(`Found ${duplicates.length} duplicate code blocks`);
      duplicates.slice(0, 5).forEach((dup, i) => {
        console.log(`\n  Duplicate ${i + 1}:`);
        console.log(`    ${dup.firstFile?.name} (lines ${dup.firstFile?.start}-${dup.firstFile?.end})`);
        console.log(`    ${dup.secondFile?.name} (lines ${dup.secondFile?.start}-${dup.secondFile?.end})`);
      });
    }

    return duplicates;
  } catch (error) {
    log.info('jscpd not available, skipping duplicate detection');
    return [];
  }
}

/**
 * Generate report
 */
function generateReport(results) {
  log.title('📊 Cleanup Report');

  const report = {
    timestamp: new Date().toISOString(),
    unusedExports: results.unusedExports?.length || 0,
    unusedImports: Object.keys(results.unusedImports || {}).length,
    unusedCSS: results.unusedCSS?.length || 0,
    duplicates: results.duplicates?.length || 0,
  };

  console.log('Summary:');
  console.log(`  Unused Exports: ${report.unusedExports}`);
  console.log(`  Files with Unused Imports: ${report.unusedImports}`);
  console.log(`  Unused CSS Classes: ${report.unusedCSS}`);
  console.log(`  Duplicate Code Blocks: ${report.duplicates}`);

  // Save report
  const reportPath = path.join(process.cwd(), 'cleanup-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log.success(`Report saved to: cleanup-report.json`);

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔════════════════════════════════════╗');
  console.log('║   Code Cleanup & Analysis Tool    ║');
  console.log('╚════════════════════════════════════╝');
  console.log(colors.reset);

  const results = {
    unusedExports: findUnusedExports(),
    unusedImports: findAllUnusedImports(),
    unusedCSS: findUnusedCSS(),
    duplicates: findDuplicates(),
  };

  generateReport(results);

  const totalIssues =
    results.unusedExports.length +
    Object.keys(results.unusedImports).length +
    results.unusedCSS.length +
    results.duplicates.length;

  if (totalIssues === 0) {
    log.success('\n🎉 Codebase is clean! No issues found.');
  } else {
    log.warning(`\n⚠️  Found ${totalIssues} potential issues to review.`);
    console.log('\nRun these commands to fix automatically:');
    console.log('  npm run lint:fix          - Fix ESLint issues');
    console.log('  npm run format            - Format with Prettier');
    console.log('  npm run type-check        - Check TypeScript');
  }
}

main().catch((error) => {
  log.error(`Script failed: ${error.message}`);
  process.exit(1);
});

