# Contributing to Petrol Price Near Me

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for everyone.

### Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or insulting comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm 9.0 or higher
- Git
- A code editor (VS Code recommended)

### Initial Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/petrol-price-near-me.git
   cd petrol-price-near-me
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/petrol-price-near-me.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Creating a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:
- `feature/add-dark-mode`
- `fix/station-card-layout`
- `docs/update-readme`

### Making Changes

1. **Make your changes**
   - Follow the coding standards
   - Write clean, readable code
   - Add comments for complex logic

2. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add dark mode toggle"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### TypeScript

- **Use strict types** - No `any` types
- **Define interfaces** - For all props and data structures
- **Use type inference** - When types are obvious
- **Export types** - Make types reusable

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

// ❌ Bad
interface ButtonProps {
  variant: any;
  onClick: Function;
  children: any;
}
```

### React Components

- **Functional components** - Use function components
- **Named exports** - For components
- **Props interface** - Always define props
- **Default exports** - Only for pages

```typescript
// ✅ Good
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary' }: ButtonProps) {
  return <button>{/* ... */}</button>;
}

// ❌ Bad
export default function Button(props) {
  return <button>{/* ... */}</button>;
}
```

### File Organization

```typescript
// 1. Imports (grouped and sorted)
import { useState } from 'react';
import type { FC } from 'react';

import { Button } from '@/components/atoms/Button';
import { formatPrice } from '@/utils/formatters';

// 2. Types/Interfaces
export interface MyComponentProps {
  title: string;
}

// 3. Component
export function MyComponent({ title }: MyComponentProps) {
  // 3a. Hooks
  const [state, setState] = useState();
  
  // 3b. Handlers
  const handleClick = () => {};
  
  // 3c. Effects
  useEffect(() => {}, []);
  
  // 3d. Render
  return <div>{/* ... */}</div>;
}

// 4. Helper functions (if needed)
function helperFunction() {}
```

### Import Order

1. React imports
2. External library imports
3. Internal imports (components, hooks, utils)
4. Type imports
5. Styles

```typescript
// ✅ Good
import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/atoms/Button';
import { useGeolocation } from '@/hooks';
import { formatPrice } from '@/utils/formatters';

import type { PetrolStation } from '@/types';

// ❌ Bad
import { Button } from '@/components/atoms/Button';
import { useState } from 'react';
import type { PetrolStation } from '@/types';
import { formatPrice } from '@/utils/formatters';
```

### Naming Conventions

- **Components**: PascalCase (`Button`, `StationCard`)
- **Files**: PascalCase for components, camelCase for utils (`Button.tsx`, `formatters.ts`)
- **Functions**: camelCase (`formatPrice`, `calculateDistance`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RESULTS`)
- **Types/Interfaces**: PascalCase (`ButtonProps`, `PetrolStation`)

## 🧩 Component Guidelines

### Atomic Design Structure

Place components in the correct folder:

```
components/
├── atoms/       # Basic building blocks (Button, Input, Badge)
├── molecules/   # Simple combinations (SearchBar, StationCard)
└── organisms/   # Complex components (Header, StationList)
```

### Component Template

```typescript
'use client'; // Only if using hooks/interactivity

import type { FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface MyComponentProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * MyComponent description
 * @param props - Component props
 */
export function MyComponent({
  title,
  description,
  children,
  className,
}: MyComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
```

### Component Index File

```typescript
// components/atoms/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

## 💬 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(search): add advanced search filters

- Add fuel type filter
- Add price range filter
- Add distance filter

Closes #123
```

```bash
fix(station-card): correct price display

The price was showing incorrect decimal places.
Now properly formatted to 2 decimal places.
```

```bash
docs(readme): update installation instructions

Added prerequisites section and updated commands.
```

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] No type errors (`npm run type-check`)
- [ ] Updated documentation if needed
- [ ] Added tests for new features

### PR Title Format

Use the same format as commit messages:

```
feat: add dark mode support
fix: resolve station card layout issue
docs: update API documentation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the project style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] All tests pass
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be recognized!

## 🧪 Testing Guidelines

### Writing Tests

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-primary-600');
  });
});
```

### Test Coverage

Aim for:
- **70%+ overall coverage**
- **80%+ for utilities**
- **70%+ for components**

### Running Tests

```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 🎨 Style Guide

### Tailwind CSS

- Use Tailwind utilities when possible
- Keep custom CSS minimal
- Use consistent spacing scale
- Follow mobile-first approach

```typescript
// ✅ Good
<div className="flex flex-col gap-4 p-6 md:flex-row md:gap-6">

// ❌ Bad
<div style={{ display: 'flex', padding: '24px' }}>
```

### Accessibility

- Use semantic HTML
- Add ARIA labels when needed
- Ensure keyboard navigation works
- Maintain color contrast ratios

```typescript
// ✅ Good
<button
  aria-label="Close dialog"
  onClick={handleClose}
>
  <CloseIcon />
</button>

// ❌ Bad
<div onClick={handleClose}>
  <CloseIcon />
</div>
```

## 📞 Getting Help

- **Documentation**: Check existing docs first
- **Issues**: Search existing issues
- **Discussions**: Start a discussion for questions
- **Email**: contact@petrolpricenearme.com.au

## 🙏 Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Credited in the README

Thank you for contributing! 🎉

