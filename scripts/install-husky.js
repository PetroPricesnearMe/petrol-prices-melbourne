#!/usr/bin/env node
/**
 * Husky Install Script
 * Checks for git availability before running husky install
 */

const { execSync } = require('child_process');

try {
  // Check if git is available
  execSync('git --version', { stdio: 'ignore', windowsHide: true });
  
  // Git is available, run husky install
  console.log('Installing husky git hooks...');
  execSync('npx husky install', { stdio: 'inherit', windowsHide: true });
  console.log('✅ Husky installed successfully');
} catch (error) {
  // Git not available or husky install failed - this is okay
  // Husky hooks will still work if git is available when committing
  console.log('⚠️  Git not found or husky install skipped (this is okay)');
  process.exit(0); // Don't fail the install process
}

