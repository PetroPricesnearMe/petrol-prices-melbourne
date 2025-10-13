# Project Domain Organization Plan
## Melbourne Petrol Stations Directory

### 🎯 Overview
This document outlines the logical domain organization for the Melbourne Petrol Stations project, dividing the codebase into clear, maintainable sections based on functionality and responsibility.

---

## 🏗️ Current State Analysis

### Existing Structure Strengths:
- ✅ Clear separation between frontend (`src/`) and backend (`backend/`)
- ✅ Component-based architecture in React
- ✅ TypeScript implementation in backend
- ✅ Comprehensive documentation structure
- ✅ Service layer abstraction
- ✅ Configuration management

### Areas for Improvement:
- 🔄 Component organization could be more domain-driven
- 🔄 Testing structure needs enhancement
- 🔄 CI/CD pipeline implementation
- 🔄 Database/data layer organization
- 🔄 Environment and deployment configuration

---

## 📋 Domain Organization Plan

### 1. 🎨 Frontend/UI Domain
**Location:** `/src/`

#### Current Structure:
```
src/
├── components/          # All React components (40+ files)
├── hooks/              # Custom React hooks
├── services/           # Frontend services
├── styles/             # Global styles
├── utils/              # Utility functions
├── config.js           # Frontend configuration
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

#### **Recommended Reorganization:**

```
src/
├── 📱 app/                     # App-level configuration
│   ├── App.js
│   ├── index.js
│   └── router.js
│
├── 🎨 components/              # Organized by domain
│   ├── common/                 # Shared/reusable components
│   │   ├── BackToTop/
│   │   ├── ErrorBoundary/
│   │   ├── LoadingSpinner/
│   │   ├── Navbar/
│   │   └── NetworkStatus/
│   │
│   ├── pages/                  # Page-level components
│   │   ├── HomePage/
│   │   ├── MapPage/
│   │   ├── DirectoryPage/
│   │   ├── AboutPage/
│   │   └── [other-pages]/
│   │
│   ├── features/               # Feature-specific components
│   │   ├── stations/           # Station-related components
│   │   │   ├── StationCard/
│   │   │   ├── StationList/
│   │   │   └── StationSearch/
│   │   │
│   │   ├── map/                # Map-related components
│   │   │   ├── MapboxMap/
│   │   │   ├── MapFallback/
│   │   │   └── MapControls/
│   │   │
│   │   └── fuel-prices/        # Fuel price components
│   │       ├── PriceTrends/
│   │       ├── PriceComparison/
│   │       └── PriceAlerts/
│   │
│   └── ui/                     # Pure UI components
│       ├── Button/
│       ├── Modal/
│       ├── Form/
│       └── Layout/
│
├── 🔧 hooks/                   # Custom React hooks
│   ├── useNetworkStatus.js
│   ├── usePerformanceMonitor.js
│   ├── useCancelOnUnmount.js
│   ├── useStations.js          # New: Station data hook
│   ├── useFuelPrices.js        # New: Fuel price hook
│   └── useMap.js               # New: Map functionality hook
│
├── 🌐 services/                # Frontend services
│   ├── api/                    # API communication
│   │   ├── stationsApi.js
│   │   ├── pricesApi.js
│   │   └── baseApi.js
│   │
│   ├── data/                   # Data management
│   │   ├── DataSourceManager.js
│   │   └── SpatialDataService.js
│   │
│   └── external/               # External service integrations
│       ├── mapboxService.js
│       └── socketService.js
│
├── 🎯 utils/                   # Utility functions
│   ├── validation.js
│   ├── securityUtils.js
│   ├── formatters.js           # New: Data formatting utilities
│   ├── constants.js            # New: App constants
│   └── helpers.js              # New: General helper functions
│
├── 🎨 styles/                  # Styling organization
│   ├── globals/                # Global styles
│   │   ├── normalize.css
│   │   ├── cross-browser-utils.css
│   │   └── variables.css       # New: CSS custom properties
│   │
│   ├── components/             # Component-specific styles
│   ├── pages/                  # Page-specific styles
│   └── themes/                 # New: Theme configurations
│       ├── default.css
│       └── dark.css            # Future: Dark mode support
│
├── 📋 types/                   # New: TypeScript type definitions
│   ├── station.types.js
│   ├── price.types.js
│   └── common.types.js
│
└── 🔧 config/                  # Configuration files
    ├── environment.js
    ├── api.config.js
    └── app.config.js
```

#### **Key Improvements:**
- **Domain-driven organization** instead of file-type organization
- **Feature-based component grouping** for better maintainability
- **Separation of concerns** between UI, business logic, and data
- **Scalable structure** that grows with the application

---

### 2. 🚀 API/Backend Domain
**Location:** `/backend/`

#### Current Structure:
```
backend/
├── src/                # TypeScript source
├── dist/               # Compiled JavaScript
├── server.js           # Legacy JavaScript server
├── config.js           # Configuration
├── baserowClient.js    # Baserow integration
└── test-*.js           # Test files
```

#### **Recommended Organization:**

```
backend/
├── 🏗️ src/                     # TypeScript source code
│   ├── 🎯 api/                 # API layer
│   │   ├── routes/             # Route definitions
│   │   │   ├── stations.routes.ts
│   │   │   ├── prices.routes.ts
│   │   │   ├── health.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── controllers/        # Request handlers
│   │   │   ├── StationsController.ts
│   │   │   ├── PricesController.ts
│   │   │   └── HealthController.ts
│   │   │
│   │   └── validators/         # Request validation
│   │       ├── stationValidators.ts
│   │       └── priceValidators.ts
│   │
│   ├── 🏪 services/            # Business logic layer
│   │   ├── StationService.ts
│   │   ├── PriceService.ts
│   │   ├── BaserowClient.ts
│   │   ├── CacheService.ts
│   │   └── NotificationService.ts
│   │
│   ├── 🗄️ data/               # Data access layer
│   │   ├── repositories/       # Data repositories
│   │   │   ├── StationRepository.ts
│   │   │   └── PriceRepository.ts
│   │   │
│   │   ├── models/             # Data models
│   │   │   ├── Station.model.ts
│   │   │   └── Price.model.ts
│   │   │
│   │   └── adapters/           # External data adapters
│   │       ├── BaserowAdapter.ts
│   │       └── CacheAdapter.ts
│   │
│   ├── 🔧 middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── cache.middleware.ts
│   │   ├── cors.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── 🌐 websocket/           # WebSocket handling
│   │   ├── socketHandlers.ts
│   │   ├── socketMiddleware.ts
│   │   └── socketEvents.ts
│   │
│   ├── 🛠️ utils/              # Utility functions
│   │   ├── logger.ts
│   │   ├── encryption.ts
│   │   ├── dateHelpers.ts
│   │   └── validators.ts
│   │
│   ├── 📋 types/               # TypeScript definitions
│   │   ├── api.types.ts
│   │   ├── database.types.ts
│   │   └── common.types.ts
│   │
│   ├── 🔧 config/              # Configuration management
│   │   ├── database.config.ts
│   │   ├── server.config.ts
│   │   ├── cache.config.ts
│   │   └── index.ts
│   │
│   └── 🚀 server.ts            # Application entry point
│
├── 📊 dist/                    # Compiled JavaScript output
├── 🧪 tests/                   # Test files (see Testing section)
├── 📋 scripts/                 # Utility scripts
│   ├── build.js
│   ├── migrate.js
│   └── seed.js
│
├── 📄 docs/                    # API documentation
│   ├── api.md
│   └── deployment.md
│
└── 🔧 config files             # Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── nodemon.json
```

#### **Key Improvements:**
- **Layered architecture** (API → Services → Data)
- **Clear separation of concerns**
- **Scalable routing structure**
- **Comprehensive middleware organization**
- **Type-safe development with TypeScript**

---

### 3. 🗄️ Database/Config Domain
**Location:** `/config/` and `/data/`

#### **Recommended Structure:**

```
📁 config/                      # Configuration management
├── 🌍 environments/            # Environment-specific configs
│   ├── development.json
│   ├── staging.json
│   ├── production.json
│   └── test.json
│
├── 🗄️ database/               # Database configurations
│   ├── baserow.config.js
│   ├── cache.config.js        # Redis/memory cache config
│   └── migrations/            # Future: Database migrations
│       └── README.md
│
├── 🔐 security/               # Security configurations
│   ├── cors.config.js
│   ├── rate-limiting.config.js
│   └── encryption.config.js
│
├── 🌐 services/               # External service configs
│   ├── mapbox.config.js
│   ├── websocket.config.js
│   └── monitoring.config.js
│
└── 📋 schemas/                # Data validation schemas
    ├── station.schema.json
    ├── price.schema.json
    └── api.schema.json

📁 data/                        # Data management
├── 🗂️ fixtures/               # Test/seed data
│   ├── stations.json
│   ├── prices.json
│   └── suburbs.json
│
├── 📊 migrations/              # Data migrations
│   ├── 001_initial_setup.js
│   └── README.md
│
├── 🔄 seeds/                   # Database seeding
│   ├── stationSeeder.js
│   └── priceSeeder.js
│
└── 📋 schemas/                 # Database schemas
    ├── station.schema.sql
    └── price.schema.sql
```

#### **Environment Variables Organization:**

```
📁 env/                         # Environment management
├── .env.example               # Template for all environments
├── .env.development           # Development settings
├── .env.staging               # Staging settings
├── .env.production            # Production settings (not in repo)
├── .env.test                  # Testing settings
└── env-validator.js           # Environment validation script
```

---

### 4. 🧪 Testing & CI/CD Domain
**Location:** `/tests/`, `/.github/`, `/scripts/`

#### **Recommended Structure:**

```
📁 tests/                       # Comprehensive testing suite
├── 🎯 unit/                    # Unit tests
│   ├── frontend/
│   │   ├── components/
│   │   │   ├── HomePage.test.js
│   │   │   ├── MapPage.test.js
│   │   │   └── DirectoryPage.test.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useNetworkStatus.test.js
│   │   │   └── usePerformanceMonitor.test.js
│   │   │
│   │   ├── services/
│   │   │   └── DataSourceManager.test.js
│   │   │
│   │   └── utils/
│   │       ├── validation.test.js
│   │       └── securityUtils.test.js
│   │
│   └── backend/
│       ├── controllers/
│       │   ├── StationsController.test.ts
│       │   └── PricesController.test.ts
│       │
│       ├── services/
│       │   ├── StationService.test.ts
│       │   └── BaserowClient.test.ts
│       │
│       ├── middleware/
│       │   ├── errorHandler.test.ts
│       │   └── rateLimiter.test.ts
│       │
│       └── utils/
│           └── validators.test.ts
│
├── 🔗 integration/             # Integration tests
│   ├── api/
│   │   ├── stations.integration.test.js
│   │   ├── prices.integration.test.js
│   │   └── websocket.integration.test.js
│   │
│   ├── database/
│   │   ├── baserow.integration.test.js
│   │   └── cache.integration.test.js
│   │
│   └── external-services/
│       ├── mapbox.integration.test.js
│       └── socket-io.integration.test.js
│
├── 🌐 e2e/                     # End-to-end tests
│   ├── user-journeys/
│   │   ├── search-stations.e2e.test.js
│   │   ├── view-map.e2e.test.js
│   │   └── compare-prices.e2e.test.js
│   │
│   ├── performance/
│   │   ├── page-load.perf.test.js
│   │   └── api-response.perf.test.js
│   │
│   └── accessibility/
│       ├── keyboard-navigation.a11y.test.js
│       └── screen-reader.a11y.test.js
│
├── 🎭 fixtures/                # Test data and mocks
│   ├── mockData/
│   │   ├── stations.mock.json
│   │   ├── prices.mock.json
│   │   └── responses.mock.json
│   │
│   ├── helpers/
│   │   ├── testUtils.js
│   │   ├── mockHelpers.js
│   │   └── setupTests.js
│   │
│   └── snapshots/              # Jest snapshots
│       └── components/
│
└── 📊 coverage/                # Test coverage reports
    ├── lcov-report/
    └── coverage-summary.json

📁 .github/                     # GitHub Actions CI/CD
├── workflows/
│   ├── ci.yml                  # Continuous Integration
│   ├── cd-staging.yml          # Staging Deployment
│   ├── cd-production.yml       # Production Deployment
│   ├── security-scan.yml       # Security scanning
│   ├── performance-test.yml    # Performance testing
│   └── dependency-update.yml   # Automated dependency updates
│
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── performance_issue.md
│
└── PULL_REQUEST_TEMPLATE.md

📁 scripts/                     # Automation scripts
├── 🏗️ build/                  # Build scripts
│   ├── build-frontend.js
│   ├── build-backend.js
│   └── build-all.js
│
├── 🚀 deploy/                  # Deployment scripts
│   ├── deploy-staging.js
│   ├── deploy-production.js
│   └── rollback.js
│
├── 🧪 test/                    # Test automation
│   ├── run-all-tests.js
│   ├── generate-coverage.js
│   └── test-performance.js
│
├── 🔧 maintenance/             # Maintenance scripts
│   ├── cleanup-logs.js
│   ├── backup-data.js
│   └── health-check.js
│
└── 📊 monitoring/              # Monitoring scripts
    ├── check-uptime.js
    ├── performance-metrics.js
    └── error-reporting.js
```

#### **CI/CD Pipeline Configuration:**

```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install backend dependencies
        run: cd backend && npm ci
      
      - name: Run TypeScript compilation
        run: cd backend && npm run build
      
      - name: Run backend tests
        run: cd backend && npm run test
      
      - name: Run API integration tests
        run: cd backend && npm run test:integration

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run security audit
        run: npm audit --audit-level=moderate
      
      - name: Run dependency check
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## 🚀 Implementation Strategy

### Phase 1: Foundation (Week 1-2)
1. **Create new folder structure** without moving files
2. **Set up testing framework** (Jest, React Testing Library, Cypress)
3. **Implement basic CI/CD pipeline**
4. **Create configuration management system**

### Phase 2: Frontend Reorganization (Week 3-4)
1. **Reorganize components** by domain
2. **Implement feature-based structure**
3. **Create reusable UI components**
4. **Add comprehensive testing**

### Phase 3: Backend Enhancement (Week 5-6)
1. **Implement layered architecture**
2. **Add comprehensive error handling**
3. **Enhance API documentation**
4. **Implement monitoring and logging**

### Phase 4: Testing & Quality (Week 7-8)
1. **Complete test coverage**
2. **Performance optimization**
3. **Security hardening**
4. **Documentation completion**

---

## 📊 Benefits of This Organization

### 🎯 **Developer Experience**
- **Faster navigation** - Find files quickly by domain
- **Reduced cognitive load** - Clear separation of concerns
- **Better collaboration** - Team members can work on specific domains
- **Easier onboarding** - New developers understand structure quickly

### 🔧 **Maintainability**
- **Modular architecture** - Changes isolated to specific domains
- **Scalable structure** - Easy to add new features
- **Clear dependencies** - Understand component relationships
- **Consistent patterns** - Standardized approaches across domains

### 🚀 **Quality & Reliability**
- **Comprehensive testing** - All layers covered
- **Automated quality checks** - CI/CD pipeline ensures standards
- **Performance monitoring** - Proactive issue detection
- **Security best practices** - Built-in security measures

### 📈 **Business Value**
- **Faster feature delivery** - Organized structure speeds development
- **Reduced bugs** - Better testing and organization
- **Lower maintenance costs** - Easier to understand and modify
- **Better scalability** - Structure supports growth

---

## 🔄 Migration Checklist

### ✅ **Preparation**
- [ ] Create backup of current codebase
- [ ] Document current dependencies and integrations
- [ ] Set up new folder structure
- [ ] Create migration scripts

### ✅ **Frontend Migration**
- [ ] Move components to domain-based folders
- [ ] Update import paths
- [ ] Reorganize styles by component/page
- [ ] Update build configuration

### ✅ **Backend Migration**
- [ ] Implement layered architecture
- [ ] Move routes to controllers
- [ ] Extract business logic to services
- [ ] Update TypeScript configurations

### ✅ **Testing Implementation**
- [ ] Set up testing frameworks
- [ ] Create test utilities and helpers
- [ ] Write unit tests for critical components
- [ ] Implement integration tests

### ✅ **CI/CD Setup**
- [ ] Create GitHub Actions workflows
- [ ] Set up automated testing
- [ ] Configure deployment pipelines
- [ ] Implement monitoring and alerts

### ✅ **Documentation**
- [ ] Update README files
- [ ] Create API documentation
- [ ] Document deployment processes
- [ ] Create developer guides

---

## 📚 Additional Resources

### **Recommended Tools**
- **Testing:** Jest, React Testing Library, Cypress, Playwright
- **CI/CD:** GitHub Actions, Vercel, Railway
- **Monitoring:** Sentry, LogRocket, New Relic
- **Documentation:** Storybook, JSDoc, OpenAPI/Swagger

### **Best Practices**
- Follow consistent naming conventions
- Implement proper error boundaries
- Use TypeScript for type safety
- Maintain comprehensive documentation
- Regular security audits and updates

---

*This organization plan provides a solid foundation for scaling your Melbourne Petrol Stations project while maintaining code quality and developer productivity.*
