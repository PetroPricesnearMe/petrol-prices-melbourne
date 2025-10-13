# Cursor Multi-Agent Setup Guide
## Melbourne Petrol Stations Project

### ✅ **Rule Files Created**

Your project now has the following agent rule files in `.cursor/rules/`:

```
.cursor/rules/
├── frontend.mdc    ✅ UI and frontend components
├── api.mdc         ✅ API routes and backend logic  
├── database.mdc    ✅ Database and configuration
└── testing.mdc     ✅ Tests and automation
```

---

## 🚀 **Step-by-Step Implementation**

### **Step 1: Create Git Branches for Each Agent**

```bash
# Create feature branches for parallel work
git checkout -b feat/frontend-agent
git checkout -b feat/api-agent  
git checkout -b feat/database-agent
git checkout -b feat/testing-agent

# Return to main branch
git checkout main
```

### **Step 2: Open 4 Cursor Sessions**

Open **4 separate Cursor windows/tabs**, each focused on a specific domain:

---

#### **🎨 Frontend Agent Session**

**Branch:** `feat/frontend-agent`

**Agent Prompt:**
```
You are the Frontend Agent. Only work on files specified in `.cursor/rules/frontend.mdc` (React components, pages, and styles). Do not touch API, backend, or database files.
```

**Allowed Files:**
- `src/components/**`
- `src/pages/**` 
- `src/styles/**`

**Responsibilities:**
- React component development
- UI fixes and layout improvements
- Style optimizations
- Frontend performance enhancements

---

#### **🔧 API/Backend Agent Session**

**Branch:** `feat/api-agent`

**Agent Prompt:**
```
You are the Backend Agent. Only work on files specified in `.cursor/rules/api.mdc` (API and backend functions). Avoid frontend and database code.
```

**Allowed Files:**
- `src/api/**`
- `server/**`

**Responsibilities:**
- API endpoint development
- Backend business logic
- Server-side optimizations
- External service integrations

---

#### **🗄️ Database/Config Agent Session**

**Branch:** `feat/database-agent`

**Agent Prompt:**
```
You are the Database Agent. Only edit database models, configs, or .env files specified in `.cursor/rules/database.mdc`.
```

**Allowed Files:**
- `config/**`
- `.env*`
- `src/db/**`

**Responsibilities:**
- Database schema management
- Configuration file updates
- Environment variable management
- Data model definitions

---

#### **🧪 Testing/CI Agent Session**

**Branch:** `feat/testing-agent`

**Agent Prompt:**
```
You are the Test/CI Agent. Focus solely on test files, automation, and workflows as per `.cursor/rules/testing.mdc`. Do not modify app code.
```

**Allowed Files:**
- `src/tests/**`
- `.github/workflows/**`
- `test-utils/**`

**Responsibilities:**
- Test creation and enhancement
- CI/CD pipeline management
- Deployment workflow automation
- Quality assurance processes

---

## 🔄 **Agent Collaboration Protocol**

### **Cross-Domain Communication**

When agents need to coordinate changes affecting multiple domains, use this approach:

**Collaboration Prompt:**
```
For any change that affects more than one domain (e.g., new database field needed by frontend), document your requirements and communicate by leaving TODOs or comments for the appropriate agent in the relevant file. Never make changes outside your assigned scope.
```

### **Example Collaboration Scenarios**

#### **Scenario 1: New API Endpoint Needed**
1. **Frontend Agent** adds TODO comment:
   ```javascript
   // TODO: API Agent - Need new endpoint GET /api/stations/:id/favorites
   // Required response format: { favorites: Station[] }
   ```

2. **API Agent** implements the endpoint and responds:
   ```javascript
   // COMPLETED: Added GET /api/stations/:id/favorites endpoint
   // Response format matches frontend requirements
   ```

#### **Scenario 2: Database Schema Change**
1. **Database Agent** documents change:
   ```sql
   -- TODO: API Agent - New 'favorites' table created
   -- Available fields: user_id, station_id, created_at
   -- Update API endpoints to use this table
   ```

2. **API Agent** updates backend logic accordingly

---

## 📋 **Quality Assurance Workflow**

### **Before Merging Any Branch:**

1. **✅ Local Testing**
   ```bash
   # Test your changes locally
   npm test
   npm run build
   npm start
   ```

2. **✅ Code Review**
   - Create pull request from feature branch
   - Request review from relevant domain experts
   - Ensure no files outside agent scope were modified

3. **✅ Integration Testing**
   ```bash
   # Test integration between domains
   npm run test:integration
   npm run test:e2e
   ```

4. **✅ Merge Order** (follow dependency chain)
   ```bash
   # 1. Database changes first (foundation)
   git merge feat/database-agent
   
   # 2. API changes (depends on database)
   git merge feat/api-agent
   
   # 3. Frontend changes (depends on API)
   git merge feat/frontend-agent
   
   # 4. Testing updates last (tests all changes)
   git merge feat/testing-agent
   ```

---

## 🛠️ **Helpful Commands**

### **Branch Management**
```bash
# Check current branch
git branch

# Switch between agent branches
git checkout feat/frontend-agent
git checkout feat/api-agent
git checkout feat/database-agent
git checkout feat/testing-agent

# See what each agent has been working on
git log --oneline -5 feat/frontend-agent
git log --oneline -5 feat/api-agent
git log --oneline -5 feat/database-agent
git log --oneline -5 feat/testing-agent
```

### **Agent Status Check**
```bash
# Check which files each agent has modified
git diff --name-only main feat/frontend-agent
git diff --name-only main feat/api-agent
git diff --name-only main feat/database-agent
git diff --name-only main feat/testing-agent
```

### **Integration Validation**
```bash
# Validate no scope violations
git diff --name-only feat/frontend-agent | grep -v "src/components\|src/pages\|src/styles"
git diff --name-only feat/api-agent | grep -v "src/api\|server"
git diff --name-only feat/database-agent | grep -v "config\|\.env\|src/db"
git diff --name-only feat/testing-agent | grep -v "src/tests\|\.github/workflows\|test-utils"
```

---

## 🎯 **Success Metrics**

### **Development Efficiency**
- **4x Parallel Development:** Each agent works simultaneously
- **Zero Merge Conflicts:** Proper scope separation prevents conflicts
- **Faster Code Reviews:** Domain experts review relevant code only
- **Reduced Context Switching:** Each agent focuses on their expertise

### **Code Quality**
- **Domain Expertise:** Each agent becomes specialist in their area
- **Consistent Patterns:** Domain-specific best practices maintained
- **Better Testing:** Dedicated testing agent ensures comprehensive coverage
- **Cleaner Architecture:** Clear separation of concerns

---

## 🚨 **Important Rules**

### **❌ NEVER DO:**
- Modify files outside your agent's glob patterns
- Make changes that affect other domains without documentation
- Merge branches without proper testing and review
- Skip the collaboration protocol for cross-domain changes

### **✅ ALWAYS DO:**
- Stay strictly within your defined file scope
- Document any requirements for other agents
- Test your changes thoroughly before committing
- Follow the proper merge order (database → API → frontend → testing)
- Use conventional commit messages with agent scope

---

## 🎉 **You're Ready to Start!**

### **Quick Start Checklist:**
- [ ] ✅ Rule files created in `.cursor/rules/`
- [ ] ✅ Git branches created for each agent
- [ ] ✅ 4 Cursor sessions opened with agent prompts
- [ ] ✅ Collaboration protocol understood
- [ ] ✅ Quality assurance workflow defined

### **Next Steps:**
1. **Create the 4 git branches** using the commands above
2. **Open 4 Cursor sessions** with the specified agent prompts
3. **Start parallel development** - each agent works independently
4. **Follow collaboration protocol** for cross-domain coordination
5. **Merge systematically** following the quality assurance workflow

**Happy coding with your specialized agent team! 🚀**

---

*This setup enables efficient parallel development while maintaining code quality and preventing conflicts through clear domain boundaries and structured collaboration.*
