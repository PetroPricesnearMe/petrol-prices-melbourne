#!/usr/bin/env node
/**
 * Husky Setup Script
 * Ensures Git is in PATH before running husky install
 * This fixes "git command not found" errors on Windows
 */

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

// Common Git installation paths
const gitPaths = [
  'C:\\Program Files\\Git\\cmd',
  'C:\\Program Files (x86)\\Git\\cmd',
  'C:\\Program Files\\Git\\bin',
  process.env.PROGRAMFILES ? `${process.env.PROGRAMFILES}\\Git\\cmd` : null,
  process.env['PROGRAMFILES(X86)'] ? `${process.env['PROGRAMFILES(X86)']}\\Git\\cmd` : null,
].filter(Boolean);

function findGitInPath() {
  try {
    // Try to find git in current PATH
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function addGitToPath() {
  if (os.platform() !== 'win32') {
    return process.env.PATH;
  }

  const currentPath = process.env.PATH || '';
  const pathParts = currentPath.split(path.delimiter);

  // Check if Git is already in PATH
  for (const gitPath of gitPaths) {
    if (pathParts.includes(gitPath)) {
      return currentPath;
    }
  }

  // Try to find Git
  for (const gitPath of gitPaths) {
    try {
      const fs = require('fs');
      if (fs.existsSync(gitPath)) {
        return `${gitPath}${path.delimiter}${currentPath}`;
      }
    } catch (error) {
      // Continue searching
    }
  }

  return currentPath;
}

function main() {
  console.log('🔧 Setting up Husky...');

  // Check if Git is available
  if (!findGitInPath()) {
    console.log('⚠️  Git not found in PATH, attempting to locate...');
    const newPath = addGitToPath();
    
    if (newPath !== process.env.PATH) {
      process.env.PATH = newPath;
      console.log('✅ Added Git to PATH');
    } else {
      console.warn('⚠️  Could not automatically find Git. Please ensure Git is installed and in your PATH.');
      console.warn('   Common locations:');
      gitPaths.forEach(p => console.warn(`   - ${p}`));
    }
  } else {
    console.log('✅ Git found in PATH');
  }

  // Verify Git is now accessible
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim();
    console.log(`✅ ${gitVersion}`);
  } catch (error) {
    console.error('❌ Git is still not accessible. Please install Git or add it to your PATH.');
    process.exit(1);
  }

  // Run husky install
  try {
    console.log('📦 Installing Husky hooks...');
    execSync('npx husky install', { 
      stdio: 'inherit',
      env: { ...process.env, PATH: process.env.PATH }
    });
    console.log('✅ Husky setup complete!');
  } catch (error) {
    console.error('❌ Failed to install Husky hooks:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { findGitInPath, addGitToPath };

