# Multi-Agent Collaboration Guide
## Melbourne Petrol Stations Project

### 🎯 Overview

This guide explains how to spin up and manage multiple specialized Cursor agents working in parallel on different domains of the project, ensuring safe collaboration and preventing conflicts.

---

## 📁 Agent Rule Files Structure

Your project now has the following specialized agent rules:

```
.cursor/rules/
├── frontend.mdc          # UI/Frontend components agent
├── backend.mdc           # API/Backend services agent  
├── database-config.mdc   # Database & configuration agent
└── testing-cicd.mdc      # Testing & CI/CD agent
```

---

## 🚀 Setting Up Multiple Agent Sessions

### **Step 1: Create Git Branches for Each Domain**

```bash
# Create feature branches for parallel work
git checkout -b feature/frontend-improvements
git checkout -b feature/backend-optimization  
git checkout -b feature/database-migration
git checkout -b feature/testing-setup

# Or use git worktrees for completely separate working directories
git worktree add ../PPNM-frontend feature/frontend-improvements
git worktree add ../PPNM-backend feature/backend-optimization
git worktree add ../PPNM-database feature/database-migration
git worktree add ../PPNM-testing feature/testing-setup
```

### **Step 2: Open Multiple Cursor Windows/Sessions**

1. **Open 4 separate Cursor windows** (or tabs if your setup supports it)
2. **Load the project** in each window
3. **Assign specific session names** and **switch to appropriate branches**

---

## 🎨 **Frontend Agent Session**

### **Session Setup:**
- **Session Name:** "Frontend Agent Session"
- **Branch:** `feature/frontend-improvements`
- **Rule File:** `.cursor/rules/frontend.mdc`

### **Initial Prompt:**
```
You are the Frontend Agent for the Melbourne Petrol Stations project.

STRICT SCOPE LIMITATIONS:
- You are responsible ONLY for files in src/components/**, src/pages/**, src/styles/**, src/hooks/**, src/utils/**, public/**, and tests/unit/frontend/**
- NEVER alter code outside this domain
- DO NOT modify backend/**, config/**, .github/workflows/**, or deployment files

Your primary responsibilities:
1. React component development and optimization
2. UI/UX improvements and styling
3. Frontend performance optimization
4. Client-side testing (unit and E2E)
5. Accessibility and responsive design

Current priorities:
- Reorganize components by domain (common, pages, features)
- Implement proper error boundaries and loading states
- Optimize bundle size and performance
- Add comprehensive component tests

Before making any changes, confirm the file is within your allowed scope. If you need to coordinate with other agents, document the requirements but do not make changes outside your domain.
```

---

## 🔧 **Backend Agent Session**

### **Session Setup:**
- **Session Name:** "Backend Agent Session"  
- **Branch:** `feature/backend-optimization`
- **Rule File:** `.cursor/rules/backend.mdc`

### **Initial Prompt:**
```
You are the Backend Agent for the Melbourne Petrol Stations project.

STRICT SCOPE LIMITATIONS:
- You are responsible ONLY for files in backend/**, tests/unit/backend/**, tests/integration/**, and scripts/backend/**
- NEVER alter frontend components, UI styles, or client-side code
- DO NOT modify src/components/**, src/pages/**, public/**, or frontend configuration

Your primary responsibilities:
1. API endpoint development and optimization
2. Business logic implementation
3. External service integrations (Baserow, WebSocket)
4. Server-side performance and security
5. Backend testing (unit and integration)

Current priorities:
- Implement proper layered architecture (controllers → services → repositories)
- Add comprehensive error handling and logging
- Optimize API performance and caching
- Enhance security and input validation
- Add comprehensive API tests

Before making any changes, confirm the file is within your allowed scope. Coordinate API contract changes with the Frontend Agent through documentation.
```

---

## 🗄️ **Database/Config Agent Session**

### **Session Setup:**
- **Session Name:** "Database Config Agent Session"
- **Branch:** `feature/database-migration`  
- **Rule File:** `.cursor/rules/database-config.mdc`

### **Initial Prompt:**
```
You are the Database/Config Agent for the Melbourne Petrol Stations project.

STRICT SCOPE LIMITATIONS:
- You are responsible ONLY for files in config/**, data/**, env.example, .env.*, backend/src/config/**, backend/src/types/**, and scripts/database/**
- NEVER alter application logic, UI components, or CI/CD pipelines
- DO NOT modify src/components/**, backend/src/controllers/**, or .github/workflows/**

Your primary responsibilities:
1. Database schema design and migrations
2. Environment variable management
3. Configuration file management
4. Data model definitions and validation
5. Database performance optimization

Current priorities:
- Organize configuration files by environment
- Define comprehensive TypeScript interfaces for data models
- Create database migration scripts
- Implement proper environment validation
- Document configuration requirements

Before making any changes, confirm the file is within your allowed scope. Share data model changes with Backend and Frontend agents through TypeScript interfaces.
```

---

## 🧪 **Testing/CI-CD Agent Session**

### **Session Setup:**
- **Session Name:** "Testing DevOps Agent Session"
- **Branch:** `feature/testing-setup`
- **Rule File:** `.cursor/rules/testing-cicd.mdc`

### **Initial Prompt:**
```
You are the Testing & CI/CD Agent for the Melbourne Petrol Stations project.

STRICT SCOPE LIMITATIONS:
- You are responsible ONLY for files in tests/**, .github/workflows/**, scripts/test/**, scripts/deploy/**, cypress/**, jest.config.js, cypress.config.js, and package.json (scripts section only)
- NEVER alter application logic, UI components, or business code
- DO NOT modify src/components/**, backend/src/services/**, or configuration files

Your primary responsibilities:
1. Test infrastructure setup and maintenance
2. CI/CD pipeline development and optimization
3. Quality assurance automation
4. Deployment automation and monitoring
5. Performance and security testing

Current priorities:
- Set up comprehensive testing framework (Jest, Cypress, React Testing Library)
- Create GitHub Actions workflows for CI/CD
- Implement automated quality gates
- Set up deployment automation
- Create performance and accessibility testing

Before making any changes, confirm the file is within your allowed scope. Coordinate with other agents to understand testing requirements for their domains.
```

---

## 🔄 **Safe Collaboration Workflow**

### **Phase 1: Independent Development (Days 1-3)**
Each agent works independently on their branch:

```bash
# Frontend Agent
git checkout feature/frontend-improvements
# Work on components, styles, hooks

# Backend Agent  
git checkout feature/backend-optimization
# Work on APIs, services, business logic

# Database Agent
git checkout feature/database-migration
# Work on schemas, configs, migrations

# Testing Agent
git checkout feature/testing-setup
# Work on tests, CI/CD, deployment
```

### **Phase 2: Integration Planning (Day 4)**
Agents coordinate through documentation:

1. **API Contracts:** Backend Agent documents API changes
2. **Data Models:** Database Agent shares TypeScript interfaces
3. **Component Interfaces:** Frontend Agent documents component APIs
4. **Testing Requirements:** Testing Agent gathers requirements from all agents

### **Phase 3: Controlled Integration (Day 5)**
Merge branches in order of dependencies:

```bash
# 1. Database/Config changes first (foundation)
git checkout develop
git merge feature/database-migration

# 2. Backend changes (depends on config)
git merge feature/backend-optimization

# 3. Frontend changes (depends on backend APIs)
git merge feature/frontend-improvements

# 4. Testing setup last (tests all changes)
git merge feature/testing-setup
```

---

## 📋 **Collaboration Protocols**

### **API Contract Documentation**
When Backend Agent changes APIs, document in shared file:

```typescript
// api-contracts.md
## Station API Changes

### GET /api/stations
**Changes:** Added pagination parameters
**New Response Format:**
```json
{
  "success": true,
  "data": Station[],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number
  }
}
```

**Frontend Impact:** Update StationService.fetchStations()
**Testing Impact:** Update integration tests
```

### **Data Model Sharing**
Database Agent shares interfaces:

```typescript
// shared-types.ts
export interface Station {
  id: string;
  name: string;
  brand: string;
  address: string;
  latitude: number;
  longitude: number;
  // ... other fields
}
```

### **Component Interface Documentation**
Frontend Agent documents component changes:

```typescript
// component-interfaces.md
## StationCard Component Changes

**New Props:**
- `onFavorite?: (stationId: string) => void`
- `isFavorite?: boolean`

**Backend Impact:** Need favorite stations API
**Testing Impact:** Add favorite functionality tests
```

---

## 🚨 **Conflict Prevention Rules**

### **File Ownership Matrix**
| File/Directory | Frontend | Backend | Database | Testing |
|----------------|----------|---------|----------|---------|
| `src/components/**` | ✅ Owner | ❌ No | ❌ No | 📝 Tests Only |
| `backend/src/**` | ❌ No | ✅ Owner | 📝 Config Only | 📝 Tests Only |
| `config/**` | ❌ No | 📝 Read Only | ✅ Owner | 📝 Read Only |
| `tests/**` | 📝 Frontend Tests | 📝 Backend Tests | 📝 Config Tests | ✅ Owner |
| `package.json` | 📝 Dependencies | 📝 Dependencies | ❌ No | 📝 Scripts Only |

**Legend:**
- ✅ **Owner:** Full modification rights
- 📝 **Limited:** Specific sections only
- ❌ **No:** No modification rights

### **Communication Channels**
1. **Git Commit Messages:** Use conventional commits with scope
   ```
   feat(frontend): add station favorite functionality
   fix(backend): resolve API pagination issue
   config(database): update Baserow connection settings
   test(e2e): add station search journey tests
   ```

2. **Pull Request Templates:** Include impact assessment
   ```markdown
   ## Changes
   - Added station favorite functionality
   
   ## Impact on Other Domains
   - **Backend:** Requires new `/api/stations/:id/favorite` endpoint
   - **Database:** Needs user preferences table
   - **Testing:** Requires E2E tests for favorite flow
   
   ## Coordination Required
   - [ ] Backend Agent: Implement favorite API
   - [ ] Database Agent: Create user preferences schema
   - [ ] Testing Agent: Add favorite functionality tests
   ```

---

## 🔍 **Quality Assurance Process**

### **Daily Sync (5 minutes)**
Each agent reports:
1. **Completed:** What was finished
2. **In Progress:** Current work
3. **Blocked:** Dependencies on other agents
4. **Next:** Planned work for next session

### **Weekly Integration Review**
1. **Code Review:** Cross-agent code review
2. **Integration Testing:** Test agent interactions
3. **Performance Check:** Ensure no regressions
4. **Documentation Update:** Keep contracts current

### **Merge Checklist**
Before merging any branch:
- [ ] All tests pass in CI
- [ ] Code review completed by relevant agents
- [ ] Documentation updated
- [ ] No conflicts with other agent work
- [ ] Integration tests pass
- [ ] Performance benchmarks met

---

## 🎯 **Success Metrics**

### **Collaboration Effectiveness**
- **Merge Conflicts:** < 2 per week
- **Integration Issues:** < 1 per sprint
- **Cross-Agent Dependencies:** Resolved within 24 hours
- **Code Review Time:** < 2 hours average

### **Development Velocity**
- **Feature Completion:** Each agent completes 2-3 features per week
- **Bug Resolution:** < 24 hours for domain-specific issues
- **Testing Coverage:** Maintains >80% across all domains
- **Deployment Success:** >95% successful deployments

---

## 🛠️ **Tools & Scripts**

### **Agent Status Script**
```bash
#!/bin/bash
# scripts/agent-status.sh

echo "🎨 Frontend Agent Status:"
git log --oneline -5 feature/frontend-improvements

echo "🔧 Backend Agent Status:"  
git log --oneline -5 feature/backend-optimization

echo "🗄️ Database Agent Status:"
git log --oneline -5 feature/database-migration

echo "🧪 Testing Agent Status:"
git log --oneline -5 feature/testing-setup
```

### **Integration Check Script**
```bash
#!/bin/bash
# scripts/integration-check.sh

echo "Running integration checks..."

# Check for API contract compatibility
npm run test:integration

# Check for type compatibility
npm run type-check

# Check for build compatibility
npm run build

echo "✅ Integration check complete"
```

---

## 📚 **Best Practices Summary**

### **DO:**
- ✅ Stay within your defined file globs
- ✅ Document all cross-agent dependencies
- ✅ Use conventional commit messages with scope
- ✅ Run tests before committing
- ✅ Communicate changes that affect other agents
- ✅ Review code from other agents when requested

### **DON'T:**
- ❌ Modify files outside your domain
- ❌ Make breaking changes without coordination
- ❌ Commit directly to main/develop
- ❌ Skip testing your changes
- ❌ Ignore merge conflicts
- ❌ Work in isolation without communication

---

*This multi-agent approach allows for parallel development while maintaining code quality and preventing conflicts. Each agent becomes an expert in their domain while contributing to the overall project success.*
