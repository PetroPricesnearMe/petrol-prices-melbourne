#!/usr/bin/env node
/**
 * Husky Setup Script
 * Ensures Git is in PATH before running husky install.
 *
 * NOTE: This script is explicitly disabled in CI/Vercel environments
 * to avoid failing `npm install` during automated builds. Git hooks
 * are only needed for local development when a `.git` directory exists.
 */

// Hard guard for CI/Vercel so `npm install` never fails because of Husky.
// This includes multiple signals because different environments set different vars.
// We also treat NODE_ENV=production as CI-like for safety on hosts that don't set CI/VERCEL.
const ciLikeEnv =
  !!process.env.CI ||
  !!process.env.VERCEL ||
  !!process.env.VERCEL_ENV ||
  process.env.NODE_ENV === 'production' ||
  // Vercel's npm wrapper sets a user agent that includes "vercel"
  (process.env.NPM_CONFIG_USER_AGENT || '').toLowerCase().includes('vercel') ||
  process.env.HUSKY === '0';

if (ciLikeEnv) {
  console.log('⏭️  Skipping Husky setup in CI/Vercel (CI/VERCEL/HUSKY env detected)');
  process.exit(0);
}

// If Husky itself isn't installed (e.g. production/CI install with devDependencies omitted),
// exit gracefully so that `npm install` doesn't fail with MODULE_NOT_FOUND.
try {
  require.resolve('husky');
} catch {
  console.log('⏭️  Husky not installed (devDependencies omitted). Skipping Husky setup.');
  process.exit(0);
}

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

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
      if (fs.existsSync(gitPath)) {
        return `${gitPath}${path.delimiter}${currentPath}`;
      }
    } catch (error) {
      // Continue searching
    }
  }

  return currentPath;
}

function isCI() {
  // Check for common CI/CD environment variables
  return !!(
    process.env.CI || // Generic CI flag
    process.env.VERCEL || // Vercel
    process.env.VERCEL_ENV || // Vercel environment
    process.env.GITHUB_ACTIONS || // GitHub Actions
    process.env.GITLAB_CI || // GitLab CI
    process.env.CIRCLECI || // CircleCI
    process.env.TRAVIS || // Travis CI
    process.env.JENKINS_URL || // Jenkins
    process.env.BUILDKITE || // Buildkite
    process.env.CODEBUILD_BUILD_ID || // AWS CodeBuild
    process.env.HUSKY === '0' // Explicitly disabled
  );
}

function main() {
  // Skip Husky setup in CI/CD environments where Git hooks aren't needed
  if (isCI()) {
    console.log('⏭️  Skipping Husky setup in CI/CD environment');
    console.log('   Git hooks are not needed in CI/CD pipelines');
    return;
  }

  // Skip when this is not a Git checkout (e.g., some CI or tarball installs)
  const repoRoot = process.cwd();
  if (!fs.existsSync(path.join(repoRoot, '.git'))) {
    console.log('⏭️  Skipping Husky setup because `.git` directory was not found');
    return;
  }

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
      gitPaths.forEach((p) => console.warn(`   - ${p}`));
    }
  } else {
    console.log('✅ Git found in PATH');
  }

  // Verify Git is now accessible
  let gitAccessible = false;
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim();
    console.log(`✅ ${gitVersion}`);
    gitAccessible = true;
  } catch (error) {
    console.warn('⚠️  Git is not accessible. Skipping Husky installation.');
    console.warn('   This is normal in CI/CD environments or when Git is not installed.');
    console.warn('   Husky hooks will not be installed, but npm install will continue.');
    return; // Exit gracefully instead of failing
  }

  // Only run husky install if Git is accessible
  if (gitAccessible) {
    try {
      console.log('📦 Installing Husky hooks...');
      execSync('npx husky install', {
        stdio: 'inherit',
        env: { ...process.env, PATH: process.env.PATH },
      });
      console.log('✅ Husky setup complete!');
    } catch (error) {
      console.warn('⚠️  Failed to install Husky hooks:', error.message);
      console.warn('   This is non-fatal. npm install will continue.');
      // Don't exit with error code - allow npm install to continue
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { findGitInPath, addGitToPath, isCI };

