#!/usr/bin/env node

/**
 * Testing Setup Script
 * Sets up comprehensive testing infrastructure for the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TestingSetup {
  constructor() {
    this.rootDir = process.cwd();
  }

  async setup() {
    console.log('🧪 Setting up testing infrastructure...');
    
    try {
      await this.installTestingDependencies();
      await this.createTestingStructure();
      await this.createTestingConfigs();
      await this.createSampleTests();
      await this.createTestingScripts();
      
      console.log('✅ Testing setup completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Run: npm test -- to run unit tests');
      console.log('2. Run: npm run test:integration -- to run integration tests');
      console.log('3. Run: npm run test:e2e -- to run end-to-end tests');
      console.log('4. Run: npm run test:coverage -- to generate coverage report');
      
    } catch (error) {
      console.error('❌ Testing setup failed:', error.message);
    }
  }

  async installTestingDependencies() {
    console.log('📦 Installing testing dependencies...');
    
    const devDependencies = [
      '@testing-library/jest-dom@^5.16.5',
      '@testing-library/react@^13.4.0',
      '@testing-library/user-event@^14.4.3',
      'jest-environment-jsdom@^29.3.1',
      'cypress@^12.3.0',
      'start-server-and-test@^1.15.2',
      'msw@^0.49.2',
      'supertest@^6.3.3',
      'jest-extended@^3.2.4'
    ];
    
    try {
      execSync(`npm install --save-dev ${devDependencies.join(' ')}`, { 
        stdio: 'inherit',
        cwd: this.rootDir 
      });
      console.log('✅ Dependencies installed');
    } catch (error) {
      throw new Error(`Failed to install dependencies: ${error.message}`);
    }
  }

  async createTestingStructure() {
    console.log('🏗️ Creating testing structure...');
    
    const testDirectories = [
      'tests/unit/frontend/components',
      'tests/unit/frontend/hooks',
      'tests/unit/frontend/services',
      'tests/unit/frontend/utils',
      'tests/unit/backend/controllers',
      'tests/unit/backend/services',
      'tests/unit/backend/middleware',
      'tests/integration/api',
      'tests/integration/database',
      'tests/integration/external-services',
      'tests/e2e/user-journeys',
      'tests/e2e/performance',
      'tests/e2e/accessibility',
      'tests/fixtures/mockData',
      'tests/fixtures/helpers',
      'tests/fixtures/snapshots',
      'cypress/e2e',
      'cypress/fixtures',
      'cypress/support'
    ];

    for (const dir of testDirectories) {
      const fullPath = path.join(this.rootDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
    
    console.log('✅ Testing structure created');
  }

  async createTestingConfigs() {
    console.log('⚙️ Creating testing configurations...');
    
    // Jest configuration
    const jestConfig = {
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/tests/fixtures/helpers/setupTests.js'],
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1'
      },
      collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        'backend/src/**/*.{js,ts}',
        '!src/index.js',
        '!src/reportWebVitals.js',
        '!**/*.d.ts'
      ],
      coverageThreshold: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      },
      testMatch: [
        '<rootDir>/tests/unit/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/tests/integration/**/*.test.{js,jsx,ts,tsx}'
      ],
      setupFiles: ['<rootDir>/tests/fixtures/helpers/setupEnv.js']
    };

    fs.writeFileSync(
      path.join(this.rootDir, 'jest.config.js'),
      `module.exports = ${JSON.stringify(jestConfig, null, 2)};`
    );

    // Cypress configuration
    const cypressConfig = {
      e2e: {
        baseUrl: 'http://localhost:3000',
        supportFile: 'cypress/support/e2e.js',
        specPattern: 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
        video: true,
        screenshotOnRunFailure: true,
        viewportWidth: 1280,
        viewportHeight: 720
      },
      component: {
        devServer: {
          framework: 'create-react-app',
          bundler: 'webpack'
        },
        specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
      }
    };

    fs.writeFileSync(
      path.join(this.rootDir, 'cypress.config.js'),
      `const { defineConfig } = require('cypress');

module.exports = defineConfig(${JSON.stringify(cypressConfig, null, 2)});`
    );

    console.log('✅ Testing configurations created');
  }

  async createSampleTests() {
    console.log('📝 Creating sample tests...');
    
    // Setup test file
    const setupTests = `import '@testing-library/jest-dom';
import 'jest-extended';

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
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});`;

    fs.writeFileSync(
      path.join(this.rootDir, 'tests/fixtures/helpers/setupTests.js'),
      setupTests
    );

    // Environment setup
    const setupEnv = `// Setup environment variables for testing
process.env.NODE_ENV = 'test';
process.env.REACT_APP_API_URL = 'http://localhost:3001';`;

    fs.writeFileSync(
      path.join(this.rootDir, 'tests/fixtures/helpers/setupEnv.js'),
      setupEnv
    );

    // Sample component test
    const sampleComponentTest = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../../src/components/HomePage';

// Mock the components that HomePage uses
jest.mock('../../../src/components/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Mock Navbar</nav>;
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage Component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('displays main heading', () => {
    renderWithRouter(<HomePage />);
    // Update this selector based on your actual HomePage structure
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  test('has navigation links', () => {
    renderWithRouter(<HomePage />);
    // Add tests for your specific navigation elements
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});`;

    fs.writeFileSync(
      path.join(this.rootDir, 'tests/unit/frontend/components/HomePage.test.js'),
      sampleComponentTest
    );

    // Sample API test
    const sampleApiTest = `import request from 'supertest';
import app from '../../../backend/src/server';

describe('API Endpoints', () => {
  describe('GET /api/stations', () => {
    test('should return list of stations', async () => {
      const response = await request(app)
        .get('/api/stations')
        .expect(200);

      expect(response.body).toBeArray();
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should return stations with required fields', async () => {
      const response = await request(app)
        .get('/api/stations')
        .expect(200);

      const station = response.body[0];
      expect(station).toHaveProperty('id');
      expect(station).toHaveProperty('name');
      expect(station).toHaveProperty('address');
    });
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});`;

    fs.writeFileSync(
      path.join(this.rootDir, 'tests/integration/api/stations.test.js'),
      sampleApiTest
    );

    // Sample E2E test
    const sampleE2eTest = `describe('Station Search Journey', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow users to search for petrol stations', () => {
    // Navigate to directory page
    cy.get('[data-testid="directory-link"]').click();
    
    // Search for a station
    cy.get('[data-testid="search-input"]').type('Shell');
    cy.get('[data-testid="search-button"]').click();
    
    // Verify results
    cy.get('[data-testid="station-card"]').should('be.visible');
    cy.get('[data-testid="station-card"]').should('contain', 'Shell');
  });

  it('should display station details when clicked', () => {
    cy.get('[data-testid="directory-link"]').click();
    cy.get('[data-testid="station-card"]').first().click();
    
    // Verify station details are displayed
    cy.get('[data-testid="station-details"]').should('be.visible');
    cy.get('[data-testid="station-name"]').should('not.be.empty');
    cy.get('[data-testid="station-address"]').should('not.be.empty');
  });
});`;

    fs.writeFileSync(
      path.join(this.rootDir, 'tests/e2e/user-journeys/station-search.cy.js'),
      sampleE2eTest
    );

    console.log('✅ Sample tests created');
  }

  async createTestingScripts() {
    console.log('📜 Creating testing scripts...');
    
    // Read current package.json
    const packageJsonPath = path.join(this.rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add testing scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'test:unit': 'jest --testPathPattern=tests/unit',
      'test:integration': 'jest --testPathPattern=tests/integration',
      'test:e2e': 'start-server-and-test start http://localhost:3000 "cypress run"',
      'test:e2e:open': 'start-server-and-test start http://localhost:3000 "cypress open"',
      'test:coverage': 'jest --coverage --testPathPattern=tests',
      'test:watch': 'jest --watch --testPathPattern=tests/unit',
      'test:all': 'npm run test:unit && npm run test:integration && npm run test:e2e'
    };
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    console.log('✅ Testing scripts added to package.json');
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new TestingSetup();
  setup.setup().catch(console.error);
}

module.exports = TestingSetup;
