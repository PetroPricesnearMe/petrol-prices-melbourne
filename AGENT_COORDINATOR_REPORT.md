# Agent Coordinator Report
**Generated:** October 17, 2025  
**Project:** Melbourne Petrol Stations Directory (PPNM)  
**Status:** 🟡 Architecture Review & Integration Needed

---

## 📊 Executive Summary

The project is a Next.js-based petrol station directory for Melbourne with Baserow database integration. The application is currently using **mock data** instead of real-time Baserow data, has a **hybrid CRA/Next.js structure** that needs cleanup, and requires proper **MCP integration** for real-time updates.

### Critical Issues Identified:
1. ❌ **Mock Data Usage** - API returns generated prices instead of real Baserow data
2. ⚠️ **Hybrid Architecture** - Mix of CRA and Next.js components
3. ⚠️ **MCP Not Utilized** - Configured but not integrated for real-time updates
4. ❌ **No Testing Infrastructure** - Zero test coverage
5. ⚠️ **Dependency Conflicts** - Using `legacy-peer-deps=true`

---

## 🗂️ Current Architecture

### Technology Stack:
- **Frontend**: React 19.2.0 + Next.js 15.5.5
- **Database**: Baserow (Table IDs: 623329 Petrol Stations, 623330 Fuel Prices)
- **Deployment**: Vercel with ISR (Incremental Static Regeneration)
- **Data Source**: GeoJSON file with 622 stations (real station data, mock prices)
- **API**: Next.js API routes (`/pages/api/`)
- **MCP Server**: Configured but not integrated

### Data Flow:
```
GeoJSON File → loadStations.js → generateMockPrices() → API Routes → Frontend
                                    ↑ PROBLEM: Should use Baserow
```

### Should Be:
```
Baserow API → API Routes → Frontend
            ↓
MCP SSE → Real-time updates → Frontend
```

---

## 🎯 Agent-Specific Findings

### 🗄️ **DATABASE AGENT** Issues

#### Critical:
1. **Mock Price Generation**
   - Location: `lib/data/loadStations.js:80-102`
   - Issue: Generates random prices instead of fetching from Baserow
   - Impact: Users see fake data, no real-time updates

2. **Baserow Integration Not Active**
   - Config exists: `src/config.js` with API tokens
   - Tables configured: Petrol Stations (623329), Fuel Prices (623330)
   - Problem: Not being used for data fetching

3. **MCP Server Configuration**
   - File: `mcp.json`
   - SSE URL: `https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse`
   - Status: Configured but not consumed

#### Actions Required:
- [ ] Create Baserow service layer for fetching stations + prices
- [ ] Implement MCP SSE connection for real-time updates
- [ ] Update data models to match Baserow schema
- [ ] Add data caching strategy (Redis or Next.js cache)
- [ ] Implement error handling for API failures

---

### 🔌 **API AGENT** Issues

#### Critical:
1. **API Routes Using Mock Data**
   - File: `pages/api/stations.js`
   - Issue: Calls `loadStationsFromGeoJSON()` → mock prices
   - Should: Fetch from Baserow API with real prices

2. **Missing API Endpoints**
   - No `/api/fuel-prices` endpoint
   - No `/api/stations/[id]` individual station endpoint
   - No `/api/brands` endpoint for filtering
   - No WebSocket/SSE endpoint for real-time updates

3. **No Rate Limiting or Caching**
   - Direct API calls without throttling
   - Cache headers present but not optimized
   - No request validation

#### Actions Required:
- [ ] Refactor `/api/stations` to use Baserow
- [ ] Add `/api/fuel-prices` endpoint
- [ ] Add `/api/stations/[id]` endpoint
- [ ] Implement API middleware (rate limiting, caching, validation)
- [ ] Add SSE endpoint for real-time price updates
- [ ] Implement proper error responses (4xx/5xx)

---

### 🎨 **FRONTEND AGENT** Issues

#### Critical:
1. **Dual Component Structure**
   - `/src/components/` - CRA-style components (40 files)
   - `/components/` - Next.js components (3 files)
   - Issue: Confusion, duplication, maintenance nightmare

2. **Mixed Patterns**
   - Some components use Next.js patterns
   - Others use CRA patterns (e.g., `useHistory`, `<Link>` from react-router-dom)
   - Inconsistent data fetching (useEffect vs getStaticProps)

3. **Component Imports in `_app.js`**
   - File: `pages/_app.js:11-28`
   - Imports 18 CSS files globally
   - Should: Use CSS modules or styled-components

4. **Unused CRA Files**
   - `src/App.js` - Not used (Next.js uses `_app.js`)
   - `src/index.js` - Not used (Next.js has own entry)
   - Multiple duplicate components

#### Actions Required:
- [ ] Consolidate components to `/components` (Next.js structure)
- [ ] Remove unused CRA files (`src/App.js`, `src/index.js`)
- [ ] Convert all components to Next.js patterns
- [ ] Implement CSS modules instead of global imports
- [ ] Update all routing to use `next/link`
- [ ] Standardize data fetching patterns

---

### 🧪 **TESTING AGENT** Issues

#### Critical:
1. **Zero Test Coverage**
   - No test files found
   - Dependencies present: `@testing-library/react`, `@testing-library/jest-dom`
   - No test scripts beyond `react-scripts test`

2. **No Test Infrastructure**
   - No Jest configuration
   - No test utilities/mocks
   - No E2E tests (Playwright/Cypress)

#### Actions Required:
- [ ] Set up Jest + React Testing Library
- [ ] Add unit tests for critical components
- [ ] Add integration tests for API routes
- [ ] Add E2E tests for user journeys
- [ ] Set up CI/CD test pipeline
- [ ] Aim for 80% code coverage

---

## 📋 Implementation Priority

### 🔴 **PHASE 1: Critical Fixes (Week 1)**

#### Database Agent:
1. Create `src/services/BaserowService.js` for API integration
2. Implement station data fetching from Baserow Table 623329
3. Implement fuel price fetching from Baserow Table 623330
4. Add proper error handling and retry logic

#### API Agent:
1. Refactor `pages/api/stations.js` to use BaserowService
2. Create `pages/api/fuel-prices.js` for price updates
3. Add request validation and error handling
4. Implement caching strategy

#### Frontend Agent:
1. Update components to consume real Baserow data
2. Fix any breaking changes from API updates
3. Add loading states and error boundaries

---

### 🟡 **PHASE 2: Architecture Cleanup (Week 2)**

#### Frontend Agent:
1. Consolidate component structure (remove CRA duplicates)
2. Convert all components to Next.js patterns
3. Implement CSS modules
4. Remove unused dependencies (react-router-dom, etc.)

#### API Agent:
1. Add remaining API endpoints (`/api/stations/[id]`, `/api/brands`)
2. Implement API middleware
3. Add rate limiting

---

### 🟢 **PHASE 3: Advanced Features (Week 3-4)**

#### Database Agent:
1. Implement MCP SSE for real-time updates
2. Add WebSocket support
3. Implement data caching (Redis)
4. Add database monitoring

#### Testing Agent:
1. Set up testing infrastructure
2. Write unit tests for all components
3. Write integration tests for APIs
4. Add E2E tests
5. Set up CI/CD with test gates

#### Frontend Agent:
1. Add real-time price update UI
2. Implement progressive enhancement
3. Add offline support (Service Workers)
4. Performance optimizations

---

## 🔧 Technical Debt

### Dependency Issues:
- **`legacy-peer-deps=true`**: Required due to React 19 + older dependencies
- **React Router Dom**: Installed but not used (Next.js has routing)
- **Both Mapbox and Leaflet**: Only need one map library
- **Styled Components**: Installed but barely used

### Recommended Cleanups:
```bash
npm uninstall react-router-dom @types/leaflet
npm uninstall socket.io-client  # If not used for real-time yet
```

---

## 📈 Success Metrics

### Performance:
- [ ] API response time < 200ms (with cache)
- [ ] Real-time price updates < 2s latency
- [ ] 95+ Lighthouse score maintained

### Quality:
- [ ] 80%+ test coverage
- [ ] Zero linter errors
- [ ] TypeScript migration (future)

### User Experience:
- [ ] Real-time price updates working
- [ ] Fast page loads (ISR working)
- [ ] Offline support
- [ ] Mobile-optimized

---

## 🚀 Next Steps

### Immediate Actions (Today):
1. ✅ Create this coordinator report
2. 🔄 Implement BaserowService.js
3. 🔄 Refactor /api/stations to use real data
4. 🔄 Test data flow end-to-end

### This Week:
1. Complete Phase 1 (Critical Fixes)
2. Deploy to staging for testing
3. Monitor for errors
4. Get stakeholder approval

### Next Update: **30 minutes** ⏰
Will check for new agent scan results and update priorities accordingly.

---

## 📞 Contact Points

### Agent Responsibilities:
- **Database Agent**: Baserow integration, MCP, data models
- **API Agent**: API routes, endpoints, middleware
- **Frontend Agent**: Components, UI, UX, styling
- **Testing Agent**: Tests, CI/CD, quality assurance
- **Coordinator (Current)**: Orchestration, priorities, documentation

---

**Last Updated:** October 17, 2025  
**Next Review:** In 30 minutes (periodic agent scan)  
**Status:** Phase 1 Implementation Starting ⚡

