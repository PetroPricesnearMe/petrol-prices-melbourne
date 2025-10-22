#!/usr/bin/env node

/**
 * Unused Code Detector
 * Finds unused exports, variables, and dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Detecting Unused Code...\n');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 1. Check for unused exports
function checkUnusedExports() {
  log('\n📦 Checking for unused exports...', 'blue');
  
  try {
    execSync('npx ts-unused-exports tsconfig.json --ignoreFiles=".*\\.test\\.tsx?$"', {
      stdio: 'inherit',
      encoding: 'utf8',
    });
  } catch (error) {
    log('⚠️  ts-unused-exports not available. Install with: npm install -g ts-unused-exports', 'yellow');
  }
}

// 2. Check for unused dependencies
function checkUnusedDependencies() {
  log('\n📚 Checking for unused dependencies...', 'blue');
  
  try {
    const output = execSync('npx depcheck --json', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    
    const result = JSON.parse(output);
    
    if (result.dependencies?.length > 0) {
      log(`\n❌ Unused dependencies found (${result.dependencies.length}):`, 'red');
      result.dependencies.forEach(dep => {
        log(`   - ${dep}`, 'red');
      });
      log('\nRemove with: npm uninstall ' + result.dependencies.join(' '), 'yellow');
    } else {
      log('✓ No unused dependencies', 'green');
    }
    
    if (result.devDependencies?.length > 0) {
      log(`\n⚠️  Unused devDependencies found (${result.devDependencies.length}):`, 'yellow');
      result.devDependencies.forEach(dep => {
        log(`   - ${dep}`, 'yellow');
      });
    }
    
    if (result.missing && Object.keys(result.missing).length > 0) {
      log('\n❌ Missing dependencies:', 'red');
      Object.keys(result.missing).forEach(dep => {
        log(`   - ${dep} (used in ${result.missing[dep].length} file(s))`, 'red');
      });
      log('\nInstall with: npm install ' + Object.keys(result.missing).join(' '), 'yellow');
    }
  } catch (error) {
    log('Error running depcheck. Make sure it\'s installed: npm install -g depcheck', 'red');
  }
}

// 3. Find large files that might need splitting
function findLargeFiles() {
  log('\n📏 Finding large files (>500 lines)...', 'blue');
  
  const dirs = ['src', 'pages', 'components', 'lib'];
  const largeFiles = [];
  
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(filePath);
      } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(file)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        
        if (lines > 500) {
          largeFiles.push({ path: filePath, lines });
        }
      }
    });
  }
  
  dirs.forEach(dir => scanDirectory(dir));
  
  if (largeFiles.length > 0) {
    log(`\n⚠️  Found ${largeFiles.length} large file(s):`, 'yellow');
    largeFiles
      .sort((a, b) => b.lines - a.lines)
      .forEach(file => {
        log(`   - ${file.path}: ${file.lines} lines`, 'yellow');
      });
    log('\n   Consider splitting these files into smaller modules', 'yellow');
  } else {
    log('✓ No excessively large files', 'green');
  }
}

// 4. Find commented code
function findCommentedCode() {
  log('\n💬 Checking for commented-out code...', 'blue');
  
  try {
    // This is a simple check - can be enhanced
    const result = execSync(
      'grep -r "^[[:space:]]*//" src/ pages/ | wc -l',
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim();
    
    const commentedLines = parseInt(result, 10);
    
    if (commentedLines > 100) {
      log(`⚠️  Found ${commentedLines} commented lines`, 'yellow');
      log('   Review and remove unnecessary commented code', 'yellow');
    } else {
      log('✓ Commented code is within acceptable limits', 'green');
    }
  } catch (error) {
    // Silently fail on Windows or if grep not available
  }
}

// 5. Check for TODO comments
function checkTodoComments() {
  log('\n📝 Checking for TODO comments...', 'blue');
  
  try {
    const result = execSync(
      'grep -r "TODO\\|FIXME\\|HACK" src/ pages/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" || echo "0"',
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    );
    
    const todos = result.split('\n').filter(line => line.trim());
    
    if (todos.length > 0 && todos[0] !== '0') {
      log(`\n⚠️  Found ${todos.length} TODO/FIXME/HACK comment(s)`, 'yellow');
      
      if (todos.length <= 10) {
        todos.forEach(todo => {
          const cleaned = todo.substring(0, 100);
          log(`   ${cleaned}`, 'yellow');
        });
      } else {
        log(`   First 10:`, 'yellow');
        todos.slice(0, 10).forEach(todo => {
          const cleaned = todo.substring(0, 100);
          log(`   ${cleaned}`, 'yellow');
        });
        log(`   ... and ${todos.length - 10} more`, 'yellow');
      }
    } else {
      log('✓ No TODO comments found', 'green');
    }
  } catch (error) {
    // Silently fail
  }
}

// Run all checks
async function main() {
  try {
    checkUnusedExports();
    checkUnusedDependencies();
    findLargeFiles();
    findCommentedCode();
    checkTodoComments();
    
    log('\n✨ Unused code analysis complete!', 'green');
    log('\nFor more detailed analysis, consider installing:', 'blue');
    log('  • ts-unused-exports: npm install -g ts-unused-exports', 'reset');
    log('  • depcheck: npm install -g depcheck', 'reset');
    log('  • jscpd: npm install -g jscpd', 'reset');
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();

