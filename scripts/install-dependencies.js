#!/usr/bin/env node
/**
 * Safe dependency installation script for Vercel
 * 
 * This script is a workaround because Vercel project settings are configured
 * to run `npm run install` instead of the default `npm install`.
 * 
 * IMPORTANT: Update Vercel project settings:
 * - Go to: Settings → Build & Development Settings
 * - Remove/clear the "Install Command" field (or set to: npm install)
 * 
 * This will allow Vercel to use the default npm install behavior.
 */

const { execSync } = require('child_process');
const path = require('path');

// Check if we're in a lifecycle hook to prevent infinite recursion
const isLifecycleHook = process.env.npm_lifecycle_script && 
                        process.env.npm_lifecycle_script.includes('install');

if (isLifecycleHook) {
  console.log('⚠️  Skipping to prevent recursion (dependencies already installing)');
  process.exit(0);
}

console.log('📦 Installing dependencies...');

try {
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  
  // Try npm ci first (faster, stricter), fallback to npm install
  try {
    execSync(`${npmCmd} ci`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, npm_config_ignore_scripts: 'true' } // Skip scripts to prevent recursion
    });
  } catch {
    // Fallback to npm install if package-lock.json is missing or outdated
    execSync(`${npmCmd} install`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, npm_config_ignore_scripts: 'true' } // Skip scripts to prevent recursion
    });
  }
  
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

