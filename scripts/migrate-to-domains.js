#!/usr/bin/env node

/**
 * Domain Migration Script
 * Helps migrate the current project structure to the new domain-based organization
 */

const fs = require('fs');
const path = require('path');

class DomainMigrator {
  constructor() {
    this.rootDir = process.cwd();
    this.srcDir = path.join(this.rootDir, 'src');
    this.backupDir = path.join(this.rootDir, 'backup-' + Date.now());
  }

  async migrate() {
    console.log('🚀 Starting domain migration...');
    
    try {
      // Step 1: Create backup
      await this.createBackup();
      
      // Step 2: Create new folder structure
      await this.createNewStructure();
      
      // Step 3: Move frontend components
      await this.migrateFrontendComponents();
      
      // Step 4: Update import paths
      await this.updateImportPaths();
      
      // Step 5: Create configuration files
      await this.createConfigFiles();
      
      console.log('✅ Migration completed successfully!');
      console.log(`📁 Backup created at: ${this.backupDir}`);
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      console.log('🔄 Restoring from backup...');
      await this.restoreBackup();
    }
  }

  async createBackup() {
    console.log('📦 Creating backup...');
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir);
    }
    
    // Copy src directory to backup
    await this.copyDirectory(this.srcDir, path.join(this.backupDir, 'src'));
    console.log('✅ Backup created');
  }

  async createNewStructure() {
    console.log('🏗️ Creating new folder structure...');
    
    const newStructure = [
      'src/app',
      'src/components/common',
      'src/components/pages',
      'src/components/features/stations',
      'src/components/features/map',
      'src/components/features/fuel-prices',
      'src/components/ui',
      'src/services/api',
      'src/services/data',
      'src/services/external',
      'src/styles/globals',
      'src/styles/components',
      'src/styles/pages',
      'src/styles/themes',
      'src/types',
      'src/config',
      'tests/unit/frontend/components',
      'tests/unit/frontend/hooks',
      'tests/unit/frontend/services',
      'tests/unit/backend/controllers',
      'tests/unit/backend/services',
      'tests/integration/api',
      'tests/e2e/user-journeys',
      'config/environments',
      'config/database',
      'config/security',
      'scripts/build',
      'scripts/deploy',
      'scripts/test'
    ];

    for (const dir of newStructure) {
      const fullPath = path.join(this.rootDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
    
    console.log('✅ New structure created');
  }

  async migrateFrontendComponents() {
    console.log('📱 Migrating frontend components...');
    
    const componentMappings = {
      // Common components
      'BackToTop.js': 'components/common/BackToTop',
      'ErrorBoundary.js': 'components/common/ErrorBoundary',
      'ErrorBoundary.css': 'components/common/ErrorBoundary',
      'EnhancedErrorBoundary.js': 'components/common/ErrorBoundary',
      'LoadingSpinner.js': 'components/common/LoadingSpinner',
      'LoadingSpinner.css': 'components/common/LoadingSpinner',
      'Navbar.js': 'components/common/Navbar',
      'Navbar.css': 'components/common/Navbar',
      'NetworkStatus.js': 'components/common/NetworkStatus',
      'NetworkStatus.css': 'components/common/NetworkStatus',
      
      // Page components
      'HomePage.js': 'components/pages/HomePage',
      'HomePage.css': 'components/pages/HomePage',
      'MapPage.js': 'components/pages/MapPage',
      'MapPage.css': 'components/pages/MapPage',
      'DirectoryPage.js': 'components/pages/DirectoryPage',
      'DirectoryPage.css': 'components/pages/DirectoryPage',
      'AboutPage.js': 'components/pages/AboutPage',
      'FAQPage.js': 'components/pages/FAQPage',
      'FAQPage.css': 'components/pages/FAQPage',
      
      // Feature components - Stations
      'BaserowStations.js': 'components/features/stations',
      'ServiceStationsPage.js': 'components/features/stations',
      'StationAmenitiesPage.js': 'components/features/stations',
      'StationAmenitiesPage.css': 'components/features/stations',
      'StationBrandsPage.js': 'components/features/stations',
      
      // Feature components - Map
      'MapboxMap.js': 'components/features/map',
      'MapFallback.js': 'components/features/map',
      'MapFallback.css': 'components/features/map',
      
      // Feature components - Fuel Prices
      'FuelPriceTrendsPage.js': 'components/features/fuel-prices',
      'FuelPriceTrendsPage.css': 'components/features/fuel-prices',
      'HowPricingWorksPage.js': 'components/features/fuel-prices',
      'HowPricingWorksPage.css': 'components/features/fuel-prices'
    };

    const componentsDir = path.join(this.srcDir, 'components');
    
    if (fs.existsSync(componentsDir)) {
      const files = fs.readdirSync(componentsDir);
      
      for (const file of files) {
        if (componentMappings[file]) {
          const sourcePath = path.join(componentsDir, file);
          const targetDir = path.join(this.srcDir, componentMappings[file]);
          const targetPath = path.join(targetDir, file);
          
          // Create target directory if it doesn't exist
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          
          // Move file
          fs.renameSync(sourcePath, targetPath);
          console.log(`📁 Moved ${file} to ${componentMappings[file]}`);
        }
      }
    }
    
    console.log('✅ Components migrated');
  }

  async updateImportPaths() {
    console.log('🔗 Updating import paths...');
    
    // This is a simplified version - in practice, you'd want to use a more sophisticated
    // AST parser like babel or typescript compiler API
    const updateImportsInFile = (filePath) => {
      if (!fs.existsSync(filePath) || !filePath.endsWith('.js')) return;
      
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Update common import patterns
      content = content.replace(
        /from ['"]\.\.\/components\/([^'"]+)['"]/g,
        (match, componentPath) => {
          // Map old paths to new paths
          const pathMappings = {
            'HomePage': '../components/pages/HomePage/HomePage',
            'MapPage': '../components/pages/MapPage/MapPage',
            'DirectoryPage': '../components/pages/DirectoryPage/DirectoryPage',
            'Navbar': '../components/common/Navbar/Navbar',
            'ErrorBoundary': '../components/common/ErrorBoundary/ErrorBoundary'
          };
          
          return pathMappings[componentPath] 
            ? `from '${pathMappings[componentPath]}'`
            : match;
        }
      );
      
      fs.writeFileSync(filePath, content);
    };
    
    // Update imports in key files
    const filesToUpdate = [
      path.join(this.srcDir, 'App.js'),
      path.join(this.srcDir, 'index.js')
    ];
    
    filesToUpdate.forEach(updateImportsInFile);
    
    console.log('✅ Import paths updated');
  }

  async createConfigFiles() {
    console.log('⚙️ Creating configuration files...');
    
    // Create jest.config.js for testing
    const jestConfig = `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/fixtures/helpers/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};`;

    fs.writeFileSync(path.join(this.rootDir, 'jest.config.js'), jestConfig);
    
    // Create basic test setup file
    const setupTests = `import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};`;

    const setupTestsPath = path.join(this.rootDir, 'tests/fixtures/helpers/setupTests.js');
    fs.mkdirSync(path.dirname(setupTestsPath), { recursive: true });
    fs.writeFileSync(setupTestsPath, setupTests);
    
    console.log('✅ Configuration files created');
  }

  async copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  async restoreBackup() {
    if (fs.existsSync(this.backupDir)) {
      // Remove current src directory
      if (fs.existsSync(this.srcDir)) {
        fs.rmSync(this.srcDir, { recursive: true });
      }
      
      // Restore from backup
      await this.copyDirectory(path.join(this.backupDir, 'src'), this.srcDir);
      console.log('✅ Backup restored');
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migrator = new DomainMigrator();
  migrator.migrate().catch(console.error);
}

module.exports = DomainMigrator;
