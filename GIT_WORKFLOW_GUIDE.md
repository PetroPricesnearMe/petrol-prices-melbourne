# Git Workflow Guide

Complete guide for the Git workflow and development process.

## Table of Contents

1. [Branching Strategy](#branching-strategy)
2. [Commit Conventions](#commit-conventions)
3. [Pull Request Process](#pull-request-process)
4. [Code Review Guidelines](#code-review-guidelines)
5. [Release Process](#release-process)
6. [Git Hooks](#git-hooks)

---

## Branching Strategy

We follow **GitHub Flow** - a simplified branching model perfect for continuous deployment.

### Branch Types

#### Main Branches

- **`main`** - Production-ready code
  - Always deployable
  - Protected branch
  - Requires PR reviews
  - All tests must pass

- **`develop`** (optional) - Integration branch
  - Latest development changes
  - Staging environment
  - Feature branches merge here first

#### Supporting Branches

- **`feature/*`** - New features
  - Branch from: `develop` or `main`
  - Merge to: `develop` or `main`
  - Naming: `feature/user-authentication`, `feature/station-search`

- **`fix/*`** - Bug fixes
  - Branch from: `develop` or `main`
  - Merge to: `develop` or `main`
  - Naming: `fix/login-error`, `fix/map-rendering`

- **`hotfix/*`** - Critical production fixes
  - Branch from: `main`
  - Merge to: `main` and `develop`
  - Naming: `hotfix/security-patch`, `hotfix/crash-fix`

- **`release/*`** - Release preparation
  - Branch from: `develop`
  - Merge to: `main` and `develop`
  - Naming: `release/v1.2.0`

- **`refactor/*`** - Code refactoring
  - Branch from: `develop` or `main`
  - Merge to: `develop` or `main`
  - Naming: `refactor/api-client`, `refactor/component-structure`

- **`docs/*`** - Documentation updates
  - Branch from: `develop` or `main`
  - Merge to: `develop` or `main`
  - Naming: `docs/api-documentation`, `docs/readme-update`

### Workflow Steps

#### 1. Create a Branch

```bash
# Update your local repository
git checkout main
git pull origin main

# Create and switch to a new branch
git checkout -b feature/my-new-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

#### 2. Make Changes

```bash
# Make your changes
# Edit files...

# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add user authentication"
```

#### 3. Push to Remote

```bash
# Push your branch
git push origin feature/my-new-feature

# Set upstream for future pushes
git push -u origin feature/my-new-feature
```

#### 4. Create Pull Request

- Go to GitHub repository
- Click "Compare & pull request"
- Fill out the PR template
- Request reviews
- Wait for CI/CD checks

#### 5. Address Review Comments

```bash
# Make requested changes
# Edit files...

# Commit changes
git commit -m "fix: address review comments"

# Push updates
git push
```

#### 6. Merge

- Ensure all checks pass
- Get required approvals
- Squash and merge (recommended)
- Delete branch after merge

---

## Commit Conventions

We follow **Conventional Commits** specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code refactoring (neither fixes a bug nor adds a feature)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Build system changes (webpack, npm, etc.)
- **ci**: CI/CD changes (GitHub Actions, etc.)
- **chore**: Other changes (updating dependencies, etc.)
- **revert**: Reverting a previous commit

### Examples

```bash
# Feature
git commit -m "feat(auth): add user login functionality"

# Bug fix
git commit -m "fix(map): resolve marker clustering issue"

# Documentation
git commit -m "docs: update API documentation"

# Performance improvement
git commit -m "perf(list): implement virtual scrolling"

# Breaking change
git commit -m "feat(api): change endpoint structure

BREAKING CHANGE: API endpoints now use /v2/ prefix"
```

### Scope Examples

- `auth` - Authentication
- `api` - API related
- `ui` - UI components
- `map` - Map functionality
- `search` - Search features
- `perf` - Performance
- `a11y` - Accessibility
- `test` - Testing
- `deps` - Dependencies

### Rules

1. **Type is required**
2. **Subject line < 100 characters**
3. **Use imperative mood** ("add" not "added")
4. **No period at the end** of subject
5. **Blank line before body** (if present)
6. **Reference issues** in footer

---

## Pull Request Process

### Before Creating PR

- [ ] Code compiles without errors
- [ ] All tests pass locally
- [ ] Linting passes
- [ ] No console.logs or debugging code
- [ ] Documentation updated
- [ ] Self-review completed

### PR Title

Follow commit convention:

```
feat(search): add advanced filter options
fix(auth): resolve token expiration issue
docs: update contribution guidelines
```

### PR Description

Use the provided template. Include:

1. **Description** - What does this PR do?
2. **Type of Change** - Feature, fix, refactor, etc.
3. **Related Issues** - Link to issues
4. **Changes Made** - Bullet list of changes
5. **Screenshots** - If UI changes
6. **Testing** - How to test
7. **Checklist** - Complete the checklist

### PR Size Guidelines

- **Small**: <100 lines - Quick review
- **Medium**: 100-500 lines - Standard review
- **Large**: 500-1000 lines - Needs extra time
- **X-Large**: >1000 lines - Consider breaking up

**Target**: Keep PRs small and focused!

### Review Process

1. **Create PR** - With filled template
2. **CI Checks** - Wait for automated checks
3. **Request Reviews** - Assign reviewers
4. **Address Feedback** - Make changes
5. **Approval** - Get required approvals
6. **Merge** - Squash and merge

---

## Code Review Guidelines

### For Authors

#### Before Requesting Review

- Self-review your code
- Run all tests
- Check for typos and formatting
- Remove debugging code
- Update documentation

#### During Review

- Respond promptly to feedback
- Be open to suggestions
- Ask questions if unclear
- Make requested changes
- Thank reviewers

### For Reviewers

#### What to Review

1. **Functionality** - Does it work correctly?
2. **Tests** - Are there adequate tests?
3. **Code Quality** - Is it maintainable?
4. **Performance** - Any performance concerns?
5. **Security** - Any security issues?
6. **Accessibility** - Meets a11y standards?
7. **Documentation** - Is it documented?

#### Review Checklist

- [ ] Code is clear and readable
- [ ] No obvious bugs
- [ ] Tests cover main scenarios
- [ ] Error handling is proper
- [ ] Performance is acceptable
- [ ] Security best practices followed
- [ ] Accessibility requirements met
- [ ] Documentation is adequate
- [ ] No code smells

#### Providing Feedback

**Good Feedback:**

- Specific and actionable
- Explains the "why"
- Suggests alternatives
- Positive and constructive

**Examples:**

✅ Good:

```
Consider using `useMemo` here to prevent unnecessary recalculations.
This component re-renders frequently, so memoization would improve performance.
```

❌ Bad:

```
This is slow.
```

✅ Good:

```
Great use of TypeScript here! The type definitions make the API very clear.
```

#### Response Time

- **Small PRs**: Within 24 hours
- **Medium PRs**: Within 48 hours
- **Large PRs**: Within 72 hours
- **Urgent PRs**: Within 4 hours

---

## Release Process

### Semantic Versioning

We follow **SemVer** (Semantic Versioning):

```
MAJOR.MINOR.PATCH

Example: 1.2.3
```

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

#### 1. Create Release Branch

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
```

#### 2. Update Version

```bash
# Update version in package.json
npm version minor  # or major, patch

# Update CHANGELOG.md
# Add release notes
```

#### 3. Test Release

```bash
# Run full test suite
npm run test:all

# Build and test
npm run build
```

#### 4. Create PR

```bash
# Push release branch
git push origin release/v1.2.0

# Create PR to main
# Title: "Release v1.2.0"
```

#### 5. Tag and Deploy

```bash
# After PR is merged to main
git checkout main
git pull origin main

# Create tag
git tag -a v1.2.0 -m "Release v1.2.0"

# Push tag (triggers deployment)
git push origin v1.2.0
```

#### 6. Merge Back to Develop

```bash
# Merge main back to develop
git checkout develop
git merge main
git push origin develop
```

### Release Notes Template

```markdown
## [1.2.0] - 2025-01-15

### Added

- New station search with advanced filters
- User authentication system
- Favorite stations feature

### Changed

- Improved map performance
- Updated UI components
- Enhanced accessibility

### Fixed

- Fixed login redirect issue
- Resolved map marker clustering bug
- Fixed mobile menu display

### Security

- Updated dependencies with security patches
```

---

## Git Hooks

We use **Husky** and **lint-staged** for Git hooks.

### Pre-commit

Runs automatically before each commit:

```bash
# Runs automatically
git commit -m "feat: add feature"

# What it does:
# 1. Lints staged files
# 2. Runs Prettier
# 3. Runs tests for changed files
```

### Commit-msg

Validates commit message format:

```bash
# Valid - will succeed
git commit -m "feat: add new feature"

# Invalid - will fail
git commit -m "added new feature"
```

### Pre-push

Runs before pushing to remote:

```bash
# Runs automatically
git push

# What it does:
# 1. Runs full test suite
# 2. Ensures build succeeds
```

### Bypass Hooks (Use Sparingly!)

```bash
# Skip pre-commit hooks
git commit --no-verify -m "feat: emergency fix"

# Skip pre-push hooks
git push --no-verify
```

**⚠️ Only use `--no-verify` in emergencies!**

---

## Branch Protection Rules

### Main Branch

**Protected with:**

- Require pull request reviews (2 approvals)
- Require status checks to pass
- Require branches to be up to date
- Require linear history
- No force pushes
- No deletions

### Develop Branch

**Protected with:**

- Require pull request reviews (1 approval)
- Require status checks to pass
- No force pushes
- No deletions

---

## Best Practices

### Do's ✅

- Write clear commit messages
- Keep PRs small and focused
- Write tests for new code
- Update documentation
- Review your own code first
- Respond to reviews promptly
- Keep branches up to date
- Delete merged branches

### Don'ts ❌

- Don't commit directly to main
- Don't force push to shared branches
- Don't commit secrets or credentials
- Don't leave console.logs
- Don't skip tests
- Don't bypass hooks without reason
- Don't create huge PRs
- Don't merge without reviews

---

## Troubleshooting

### Common Issues

**1. Merge Conflicts**

```bash
# Update your branch with latest main
git checkout main
git pull origin main
git checkout your-branch
git merge main

# Resolve conflicts
# Edit conflicted files
git add .
git commit -m "fix: resolve merge conflicts"
```

**2. Forgot to Branch**

```bash
# Stash your changes
git stash

# Create proper branch
git checkout -b feature/my-feature

# Apply stashed changes
git stash pop
```

**3. Wrong Branch**

```bash
# Move commits to correct branch
git log  # Find commit hash
git checkout correct-branch
git cherry-pick <commit-hash>

# Remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

**4. Hook Errors**

```bash
# Reinstall hooks
npm run prepare

# Or manually
npx husky install
```

---

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)

---

**Questions?** Contact the team lead or open a discussion on GitHub.
