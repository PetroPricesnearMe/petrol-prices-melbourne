# Code Quality Tools Setup

This project uses ESLint, Prettier, and Husky to maintain code quality and consistency.

## Tools Overview

### 1. ESLint
**Purpose:** Static code analysis to identify problematic patterns in JavaScript/TypeScript code.

**Configuration:** `.eslintrc.json`
- Extends Next.js and TypeScript recommended rules
- Includes React and accessibility (jsx-a11y) plugins
- Enforces import ordering and type consistency
- Configured with Prettier integration

**Usage:**
```bash
npm run lint                # Check for linting errors
npm run lint:fix            # Auto-fix linting errors
```

### 2. Prettier
**Purpose:** Opinionated code formatter for consistent code style.

**Configuration:** `.prettierrc.json`
- Single quotes for JavaScript/TypeScript
- 2-space indentation
- 80 character line width
- Tailwind CSS plugin for class sorting
- LF line endings (cross-platform compatibility)

**Usage:**
```bash
npm run format              # Format all files
npm run format:check        # Check formatting without making changes
```

### 3. Husky
**Purpose:** Git hooks to run checks before commits and pushes.

**Configuration:** `.husky/` directory
- `pre-commit`: Runs lint-staged before each commit
- `commit-msg`: Validates commit messages using commitlint

**Installed Hooks:**

#### Pre-commit Hook (`.husky/pre-commit`)
Runs automatically before each commit:
1. ✅ Runs ESLint and Prettier on staged files
2. ✅ Type checking (if configured in lint-staged)
3. ✅ Runs tests on related files
4. ✅ Checks for console.log statements
5. ✅ Formats CSS and JSON files

#### Commit Message Hook (`.husky/commit-msg`)
Validates commit messages follow conventional commits format:
- Must have a type: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Must have a subject
- Max 100 characters for the header

**Valid commit message examples:**
```bash
feat: add user authentication
fix: resolve navigation bug on mobile
docs: update API documentation
refactor: simplify data fetching logic
```

### 4. lint-staged
**Purpose:** Run linters on staged git files only (faster than checking all files).

**Configuration:** `package.json` (lint-staged section)

For JavaScript/TypeScript files:
1. Run ESLint with auto-fix
2. Run Prettier to format
3. Run Jest tests on related files

For CSS/JSON/Markdown files:
- Run Prettier to format

## Installation

All tools are already installed. If setting up in a new environment:

```bash
# Install dependencies
npm install

# Initialize Husky (creates .husky directory)
npm run prepare
```

## Usage

### Manual Code Formatting

```bash
# Format all files
npm run format

# Check formatting without changes
npm run format:check

# Lint and fix
npm run lint:fix
```

### Git Workflow

The tools run automatically during git commits:

```bash
# Stage your changes
git add .

# Commit (pre-commit hook runs automatically)
git commit -m "feat: add new feature"

# If checks fail, fix the issues and try again
npm run lint:fix
git add .
git commit -m "feat: add new feature"
```

### Bypassing Hooks (Not Recommended)

In rare cases where you need to bypass hooks:

```bash
# Skip pre-commit hooks
git commit --no-verify -m "message"

# Note: This is NOT recommended in normal workflow
```

## Configuration Files

| File | Purpose |
|------|---------|
| `.eslintrc.json` | ESLint configuration |
| `.eslintignore` | Files/folders to exclude from linting |
| `.prettierrc.json` | Prettier formatting rules |
| `.prettierignore` | Files/folders to exclude from formatting |
| `commitlint.config.js` | Commit message validation rules |
| `.husky/pre-commit` | Pre-commit hook script |
| `.husky/commit-msg` | Commit message validation hook |

## Troubleshooting

### Hooks Not Running

```bash
# Reinitialize Husky
rm -rf .husky
npm run prepare
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### Formatting Conflicts

If ESLint and Prettier conflict:
- Prettier handles formatting (spacing, line breaks, etc.)
- ESLint handles code quality (unused variables, potential bugs, etc.)
- `eslint-config-prettier` is installed to disable conflicting ESLint rules

### Performance Issues

If lint-staged is slow:
- It only checks staged files, not the entire codebase
- Tests run only on related files using `--findRelatedTests`
- Consider disabling test running in lint-staged if too slow

### Windows-Specific Issues

On Windows, if you get line ending errors:
```bash
# Configure Git to handle line endings
git config --global core.autocrlf true
```

## Editor Integration

### VS Code

Install these extensions for the best experience:
- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)

Settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### WebStorm/IntelliJ IDEA

1. Enable ESLint: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable Prettier: Settings → Languages & Frameworks → JavaScript → Prettier
3. Enable format on save: Settings → Tools → Actions on Save

## Best Practices

1. **Commit Often:** Make small, focused commits with clear messages
2. **Fix Issues Immediately:** Don't skip hooks; fix linting errors right away
3. **Use Auto-Fix:** Run `npm run lint:fix` before committing
4. **Follow Commit Conventions:** Use conventional commit format
5. **Test Locally:** Run `npm run test` before pushing
6. **Keep Tools Updated:** Regularly update ESLint, Prettier, and related plugins

## CI/CD Integration

These tools also run in the CI/CD pipeline:
- Linting check on pull requests
- Formatting verification
- Type checking
- Test execution

See `.github/workflows/` for CI configuration.

## Additional Resources

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [lint-staged](https://github.com/okonet/lint-staged)
