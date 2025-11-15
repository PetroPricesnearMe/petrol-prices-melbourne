# Git Workflow & Testing - Quick Start

🚀 Complete professional Git workflow and testing infrastructure.

## ⚡ Quick Commands

### Testing

```bash
npm test                # Run tests in watch mode
npm run test:ci         # Run tests in CI mode with coverage
npm run test:coverage   # Generate coverage report
npm run test:e2e        # Run E2E tests with Playwright
npm run test:a11y       # Run accessibility tests
npm run test:all        # Run all tests (lint, type-check, unit, e2e)
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make commits (automatically validated)
git commit -m "feat: add new feature"

# Push (runs tests automatically)
git push origin feature/my-feature
```

### Code Quality

```bash
npm run lint            # Check linting
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run type-check      # TypeScript type checking
```

## 📋 Commit Message Format

```
<type>(<scope>): <subject>

Examples:
feat(search): add advanced filter options
fix(map): resolve marker clustering issue
docs: update API documentation
perf(list): implement virtual scrolling
```

**Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

## 🔄 Development Workflow

### 1. Create Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature
```

### 2. Make Changes

- Write code
- Write tests (TDD preferred)
- Update documentation

### 3. Commit

```bash
git add .
git commit -m "feat: your feature"
```

✅ Pre-commit hooks run automatically:

- Linting
- Formatting
- Tests for changed files
- Commit message validation

### 4. Push

```bash
git push origin feature/your-feature
```

✅ Pre-push hooks run:

- Full test suite

### 5. Create PR

- Use PR template
- Request reviews
- Wait for CI checks
- Address feedback

### 6. Merge

- Get approvals (2 for main)
- Squash and merge
- Delete branch

## 🧪 Testing Strategy

### Test Distribution

- **70% Unit Tests** - Component logic, utilities
- **20% Integration Tests** - API calls, data flow
- **10% E2E Tests** - Critical user journeys

### Coverage Target

- **80%+ Overall**
- **90%+ Components**
- **100% Critical Paths**

### Writing Tests

**Unit Test Example:**

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
```

**E2E Test Example:**

```typescript
import { test, expect } from '@playwright/test';

test('user can search stations', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[type="search"]', 'Melbourne');
  await page.press('input[type="search"]', 'Enter');
  await expect(page.locator('[data-testid="station-card"]')).toBeVisible();
});
```

## 🔍 CI/CD Pipeline

### Automated Checks (on every push)

✅ Linting (ESLint + Prettier)
✅ Type checking (TypeScript)
✅ Unit tests with coverage
✅ Integration tests
✅ E2E tests (Playwright)
✅ Build verification
✅ Accessibility tests
✅ Performance tests
✅ Security audit

### Deployment

- **Preview**: Automatic on `main` branch
- **Production**: Triggered by version tags (`v1.2.3`)

## 📦 File Structure

```
.
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # CI pipeline
│   │   └── deploy.yml             # Deployment
│   ├── pull_request_template.md   # PR template
│   └── CODEOWNERS                 # Code owners
├── e2e/                           # E2E tests
│   └── example.spec.ts
├── src/
│   ├── components/
│   │   └── **/*.test.tsx          # Component tests
│   └── __tests__/
│       ├── utils/testUtils.tsx    # Test utilities
│       └── mocks/mockData.ts      # Mock data
├── jest.config.js                 # Jest configuration
├── jest.setup.js                  # Jest setup
├── playwright.config.ts           # Playwright config
├── .huskyrc.json                  # Git hooks
├── .commitlintrc.json             # Commit rules
└── .lintstagedrc.json             # Lint-staged
```

## 📚 Documentation

| Document                                | Description                         |
| --------------------------------------- | ----------------------------------- |
| `GIT_WORKFLOW_GUIDE.md`                 | Complete Git workflow guide         |
| `TESTING_STRATEGY.md`                   | Comprehensive testing documentation |
| `GIT_TESTING_IMPLEMENTATION_SUMMARY.md` | Implementation details              |
| `README_GIT_TESTING.md`                 | This quick start guide              |

## 🛠️ Setup

### Initial Setup

```bash
# Install dependencies
npm install

# Setup Git hooks
npm run prepare

# Run tests to verify setup
npm test
```

### First Time Contributors

1. Read `GIT_WORKFLOW_GUIDE.md`
2. Read `TESTING_STRATEGY.md`
3. Set up Git hooks: `npm run prepare`
4. Create your first branch
5. Make a small test commit

## ✅ Pre-Commit Checklist

Before committing:

- [ ] Code compiles without errors
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] No console.logs
- [ ] Documentation updated
- [ ] Self-review completed

## 🔒 Security

### ⚠️ NEVER Commit:

- API keys
- Passwords
- Access tokens (like the one you just shared!)
- Private keys
- Database credentials
- `.env` files

### ✅ DO Use:

- GitHub Secrets (for CI/CD)
- Environment variables
- `.env.local` (in `.gitignore`)

**If you accidentally commit secrets:**

1. Revoke the secret immediately
2. Generate new credentials
3. Use `git filter-branch` to remove from history
4. Force push (with caution)

## 🆘 Troubleshooting

### Hook Errors

```bash
# Reinstall hooks
npm run prepare
```

### Tests Failing

```bash
# Run tests in debug mode
npm run test:debug

# Check coverage
npm run test:coverage
```

### Merge Conflicts

```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
# Resolve conflicts, then:
git add .
git commit -m "fix: resolve merge conflicts"
```

### Commit Message Rejected

```bash
# Bad: "added new feature"
# Good: "feat: add new feature"

# See .commitlintrc.json for rules
```

## 📊 Project Status

### Test Coverage

Current: **Check with** `npm run test:coverage`
Target: **80%+**

### CI/CD Status

Check: GitHub Actions tab

### Code Quality

Run: `npm run lint && npm run type-check`

## 🎯 Goals

- ✅ 80%+ test coverage
- ✅ All CI checks passing
- ✅ No linting errors
- ✅ Type-safe codebase
- ✅ Accessible components (WCAG 2.1 AA)
- ✅ Performance optimized (LCP <2.5s)

## 📞 Support

### Having Issues?

1. **Check documentation** in this repo
2. **Run diagnostics**: `npm run test:all`
3. **Check CI logs** on GitHub
4. **Ask the team** in discussions

### Common Questions

**Q: Why are my commits being rejected?**
A: Check commit message format. Must follow conventional commits.

**Q: Why is pre-commit taking so long?**
A: It's running tests for changed files. This ensures quality.

**Q: Can I skip pre-commit hooks?**
A: Use `--no-verify` only in emergencies!

**Q: How do I update test snapshots?**
A: Run `npm test -- -u`

## 🎓 Learning Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

## 🎉 You're Ready!

Everything is set up. Start coding:

```bash
# 1. Create branch
git checkout -b feature/my-awesome-feature

# 2. Write code and tests
# ...

# 3. Commit with proper message
git commit -m "feat: add awesome feature"

# 4. Push and create PR
git push origin feature/my-awesome-feature
```

---

**Happy coding! 🚀**

_Questions? Check the full documentation or ask the team!_
