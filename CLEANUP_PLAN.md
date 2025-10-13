# Project Cleanup Plan

## Issues Found

### 1. Backend Conflicts
- `backend/server.js` - Working JavaScript version (marked DEPRECATED but functional)
- `backend/src/server.ts` - TypeScript version with build errors (missing dependencies)
- `backend/dist/` - Incomplete compiled TypeScript

**Decision**: Remove TypeScript backend, keep working JS version

### 2. Root Directory Clutter (25+ documentation files)
**Move to docs/**:
- AGENT_COLLABORATION_GUIDE.md
- AUDIT_FIXES_COMPLETED.md
- BACKEND_QUICK_START.md
- BACKEND_STATUS_REPORT.md
- BASEROW_ENDPOINT_VERIFICATION.md
- BASEROW_INTEGRATION.md
- COMPREHENSIVE_DIAGNOSTIC_SUMMARY.md
- CURSOR_AGENT_SETUP_GUIDE.md
- CURSOR_PAGINATION_UPDATE.md
- DATA_SOURCE_INTEGRATION_GUIDE.md
- DEBUGGING_GUIDE.md
- DEPLOYMENT_ENV_VARS.md
- DIAGNOSTIC_ANALYSIS.md
- DIAGNOSTIC_INSTRUCTIONS.md
- FINAL_DEPLOYMENT_SUMMARY.md
- FIXES_SUMMARY.md
- GET_BASEROW_TOKEN_INSTRUCTIONS.md
- HOW_TO_RUN_AUDIT.md
- IMAGES_SETUP_INSTRUCTIONS.md
- IMPLEMENTATION_COMPLETE.md
- MAJOR_ARCHITECTURE_CHANGE.md
- MULTI_AGENT_QUICK_START.md
- NEW_FEATURE_SUMMARY.md
- PAGES_CREATED.md
- PREMIUM_DESIGN_COMPLETE.md
- PROJECT_DOMAIN_ORGANIZATION.md
- QUICK_DEBUG_REFERENCE.md
- QUICK_FIX_GUIDE.md
- SEO_ACCESSIBILITY_FIXES_SUMMARY.md
- SEO_OPTIMIZATION_CHECKLIST.md
- SEO_QUICK_REFERENCE.md
- SEPARATION_OF_CONCERNS_IMPLEMENTATION.md
- SETUP_GUIDE.md
- SETUP_INSTRUCTIONS.md
- TESTING_VERIFICATION_GUIDE.md
- TROUBLESHOOTING.md
- UNLOAD_WARNING_FIX.md

### 3. Test Files Scattered
**Move to tests/**:
- test-backend-health.js
- test-build.js
- test-frontend-health.js
- test-new-api.js
- test-script.ps1
- website-audit-script.js
- audit-template.csv
- package-audit.json
- manual-audit-checklist.md

### 4. Backend Test Files
**Move backend/test-*.js to backend/tests/**

### 5. Scripts
**Keep in scripts/** (already organized)

## Actions to Take

1. Delete broken TypeScript backend
2. Remove deprecation warning from working server.js
3. Move documentation files to docs/
4. Move test files to tests/
5. Clean up backend structure
6. Update package.json scripts
7. Create simple README at root pointing to docs/

## Final Structure
```
PPNM/
├── backend/
│   ├── server.js (working version)
│   ├── config.js
│   ├── baserowClient.js
│   ├── package.json
│   └── tests/
├── src/ (React frontend)
├── public/
├── build/
├── docs/
│   ├── setup/
│   ├── development/
│   ├── deployment/
│   ├── architecture/
│   └── legacy/
├── scripts/
├── tests/
├── package.json
└── README.md
```

