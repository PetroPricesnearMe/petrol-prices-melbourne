#!/usr/bin/env node

/**
 * Verify TypeScript and @typescript-eslint compatibility
 * Ensures we're using supported versions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying TypeScript and ESLint compatibility...\n');

// Read package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
);

// Extract versions
const tsVersion = packageJson.devDependencies.typescript;
const eslintPluginVersion = packageJson.devDependencies['@typescript-eslint/eslint-plugin'];
const eslintParserVersion = packageJson.devDependencies['@typescript-eslint/parser'];

console.log('📦 Current versions:');
console.log(`   TypeScript: ${tsVersion}`);
console.log(`   @typescript-eslint/eslint-plugin: ${eslintPluginVersion}`);
console.log(`   @typescript-eslint/parser: ${eslintParserVersion}\n`);

// Compatibility check
const tsNumeric = tsVersion.replace(/[\^~]/, '');
const [major, minor] = tsNumeric.split('.').map(Number);

console.log('✅ Compatibility Check:');

// Check TypeScript version (should be 5.3.x)
if (major === 5 && minor === 3) {
  console.log('   ✓ TypeScript 5.3.3 - Fully supported by @typescript-eslint v6.x');
} else if (major === 5 && minor < 4) {
  console.log(`   ⚠️  TypeScript ${major}.${minor}.x - Compatible but not optimal`);
} else if (major === 5 && minor >= 4) {
  console.log(`   ❌ TypeScript ${major}.${minor}.x - NOT supported by @typescript-eslint v6.x`);
  console.log('      Please downgrade to TypeScript 5.3.3');
  process.exit(1);
} else {
  console.log(`   ⚠️  TypeScript ${major}.${minor}.x - May have compatibility issues`);
}

// Check @typescript-eslint versions match
if (eslintPluginVersion === eslintParserVersion) {
  console.log('   ✓ @typescript-eslint plugin and parser versions match');
} else {
  console.log('   ⚠️  @typescript-eslint versions mismatch - should be identical');
}

// Extract numeric version for @typescript-eslint
const eslintNumeric = eslintPluginVersion.replace(/[\^~]/, '');
const [eslintMajor] = eslintNumeric.split('.').map(Number);

if (eslintMajor === 6) {
  console.log('   ✓ @typescript-eslint v6.x - Supports TypeScript 4.3.5 - 5.3.x');
} else if (eslintMajor === 7) {
  console.log('   ⚠️  @typescript-eslint v7.x - Requires TypeScript 4.7.4 - 5.4.x');
  console.log('      Consider downgrading to v6.21.0 for TypeScript 5.3.3');
} else if (eslintMajor < 6) {
  console.log('   ⚠️  @typescript-eslint v' + eslintMajor + '.x - Outdated, please upgrade');
}

console.log('\n🔧 Running verification tests...\n');

try {
  // Test TypeScript compilation
  console.log('1. Testing TypeScript compilation...');
  execSync('npm run type-check', { stdio: 'pipe' });
  console.log('   ✓ TypeScript compilation successful\n');
} catch (error) {
  console.log('   ❌ TypeScript compilation failed');
  console.log('   Run: npm run type-check\n');
}

try {
  // Test ESLint
  console.log('2. Testing ESLint...');
  execSync('npm run lint', { stdio: 'pipe' });
  console.log('   ✓ ESLint check successful\n');
} catch (error) {
  console.log('   ⚠️  ESLint found issues (this is normal)');
  console.log('   Run: npm run lint:fix\n');
}

// Check for TypeScript 5.4+ features
console.log('3. Checking for TypeScript 5.4+ features...');
const unsupportedFeatures = [
  { pattern: /\bNoInfer\b/g, name: 'NoInfer<T>' },
  { pattern: /groupBy\(/g, name: 'Object.groupBy()' },
  { pattern: /\{[^}]*\.\.\.\s*,/g, name: 'Trailing comma after rest element' }
];

let foundUnsupported = false;

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    unsupportedFeatures.forEach(({ pattern, name }) => {
      if (pattern.test(content)) {
        console.log(`   ⚠️  Found ${name} in ${filePath}`);
        foundUnsupported = true;
      }
    });
  } catch (err) {
    // Skip files that can't be read
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', 'dist', 'build'].includes(file)) {
        walkDir(filePath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      checkFile(filePath);
    }
  });
}

try {
  walkDir(path.join(process.cwd(), 'src'));
  if (!foundUnsupported) {
    console.log('   ✓ No TypeScript 5.4+ features detected\n');
  } else {
    console.log('   ⚠️  Found TypeScript 5.4+ features - may need refactoring\n');
  }
} catch (err) {
  console.log('   ⚠️  Could not scan for unsupported features\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('✅ Verification complete!\n');
console.log('📝 Recommended next steps:');
console.log('   1. Run: npm install');
console.log('   2. Run: npm run type-check');
console.log('   3. Run: npm run lint');
console.log('   4. Run: npm run build');
console.log('\n💡 If you see warnings about unsupported TypeScript version:');
console.log('   - Delete node_modules and package-lock.json');
console.log('   - Run: npm install');
console.log('   - Restart your editor/IDE\n');

