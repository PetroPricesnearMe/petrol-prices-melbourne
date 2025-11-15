# Code Review Checklist

> Comprehensive code review guidelines for maintaining high code quality and team productivity

## Table of Contents

- [General Guidelines](#general-guidelines)
- [TypeScript & Code Quality](#typescript--code-quality)
- [React & Next.js Patterns](#react--nextjs-patterns)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Security](#security)
- [Testing](#testing)
- [Documentation](#documentation)

---

## General Guidelines

### Before Starting Review

- [ ] Pull request has a clear, descriptive title
- [ ] Description explains **what** and **why** (not just how)
- [ ] PR is reasonably sized (< 500 lines preferred)
- [ ] All CI/CD checks are passing
- [ ] No merge conflicts exist
- [ ] Self-review completed by author

### Code Style & Formatting

- [ ] Code follows project style guide
- [ ] Prettier formatting applied
- [ ] ESLint warnings resolved
- [ ] No commented-out code (use git history instead)
- [ ] Consistent naming conventions used
- [ ] No unnecessary console.log statements in production code

---

## TypeScript & Code Quality

### Type Safety

- [ ] **No `any` types** unless absolutely necessary and documented
- [ ] **Proper type inference** - avoid redundant type annotations
- [ ] **Interface over type** for object shapes (consistency)
- [ ] **Type guards** implemented for runtime type checking
- [ ] **Generic types** used appropriately for reusable code
- [ ] **Union types** preferred over enums when appropriate
- [ ] **Utility types** leverage TypeScript built-ins (Partial, Pick, Omit, etc.)

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User | null {
  // ...
}

// ❌ Bad
function getUser(id: any): any {
  // ...
}
```

### Code Organization

- [ ] **Single Responsibility Principle** - one function/component, one purpose
- [ ] **DRY (Don't Repeat Yourself)** - common logic extracted
- [ ] **Meaningful names** - clear, descriptive, self-documenting
- [ ] **Small functions** - ideally < 20 lines
- [ ] **Proper imports** - absolute paths using aliases (@/)
- [ ] **Barrel exports** - index.ts files for clean imports
- [ ] **File structure** - follows atomic design (atoms/molecules/organisms)

### Error Handling

- [ ] **Errors caught and handled** appropriately
- [ ] **Custom error types** for domain-specific errors
- [ ] **Error boundaries** wrap components that may fail
- [ ] **Loading and error states** handled in UI
- [ ] **User-friendly error messages** displayed
- [ ] **Errors logged** to monitoring service in production

---

## React & Next.js Patterns

### Component Design

- [ ] **Functional components** with hooks (no class components)
- [ ] **TypeScript props interface** defined and exported
- [ ] **PropTypes or defaults** specified when appropriate
- [ ] **Composition over inheritance**
- [ ] **Props destructured** in component signature
- [ ] **Unnecessary re-renders avoided** (React.memo, useMemo, useCallback)
- [ ] **Key prop** properly used in lists (stable, unique IDs)

```typescript
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = React.memo(
  ({ variant = 'primary', disabled = false, onClick, children }) => {
    // Implementation
  }
);

Button.displayName = 'Button';
```

### Hooks Usage

- [ ] **Hooks rules followed** - only at top level, not in conditions
- [ ] **useEffect dependencies** complete and correct
- [ ] **Cleanup functions** implemented for side effects
- [ ] **Custom hooks** for reusable stateful logic
- [ ] **useMemo/useCallback** only when needed (avoid premature optimization)

### Next.js Specific

- [ ] **App Router** used for new pages (not Pages Router)
- [ ] **Server Components** by default unless client interactivity needed
- [ ] **'use client'** directive only when necessary
- [ ] **Metadata API** used for SEO
- [ ] **Image component** used for all images
- [ ] **Link component** used for navigation
- [ ] **Dynamic imports** for code splitting
- [ ] **Loading/Error** boundaries defined
- [ ] **Route handlers** properly typed
- [ ] **Environment variables** prefixed correctly (NEXT*PUBLIC* for client)

---

## Accessibility

### WCAG 2.1 AA Compliance

- [ ] **Semantic HTML** used appropriately
- [ ] **ARIA labels** provided where needed
- [ ] **Keyboard navigation** fully functional (Tab, Enter, Escape)
- [ ] **Focus indicators** visible and clear
- [ ] **Color contrast** meets minimum ratios (4.5:1 for text)
- [ ] **Alt text** for all meaningful images
- [ ] **Form labels** associated with inputs
- [ ] **Error messages** announced to screen readers
- [ ] **Skip links** provided for main content
- [ ] **Tested with screen reader** (NVDA, JAWS, or VoiceOver)

```tsx
// ✅ Good
<button
  type="button"
  aria-label="Close modal"
  onClick={handleClose}
>
  <CloseIcon aria-hidden="true" />
</button>

// ❌ Bad
<div onClick={handleClose}>
  <CloseIcon />
</div>
```

### Interactive Elements

- [ ] **Clickable items** are buttons or links (not divs)
- [ ] **Disabled state** properly communicated (aria-disabled)
- [ ] **Loading state** announced to screen readers
- [ ] **Modal focus trap** implemented
- [ ] **Tooltips** accessible via keyboard

---

## Performance

### Optimization

- [ ] **Images optimized** - WebP format, proper sizing
- [ ] **Lazy loading** implemented for below-fold content
- [ ] **Code splitting** for large components
- [ ] **Bundle size** checked and minimized
- [ ] **No unnecessary dependencies** added
- [ ] **Tree shaking** possible for imported libraries
- [ ] **Memoization** applied to expensive computations
- [ ] **Virtual scrolling** for long lists
- [ ] **Debouncing/throttling** for frequent events

### Network Performance

- [ ] **API calls minimized** - batching, caching considered
- [ ] **Loading states** displayed during data fetching
- [ ] **Pagination** or infinite scroll for large datasets
- [ ] **Optimistic updates** for better perceived performance
- [ ] **Request deduplication** implemented
- [ ] **Stale-while-revalidate** strategy used appropriately

### Metrics

- [ ] **Lighthouse score** > 90 for performance
- [ ] **Largest Contentful Paint (LCP)** < 2.5s
- [ ] **First Input Delay (FID)** < 100ms
- [ ] **Cumulative Layout Shift (CLS)** < 0.1
- [ ] **Time to Interactive (TTI)** < 3.8s

---

## Security

### Input Validation

- [ ] **User input sanitized** before display or storage
- [ ] **XSS prevention** - no dangerouslySetInnerHTML without sanitization
- [ ] **SQL injection prevention** - parameterized queries
- [ ] **CSRF protection** implemented for forms
- [ ] **Input validation** on both client and server
- [ ] **File upload restrictions** (type, size) enforced

### Authentication & Authorization

- [ ] **Authentication** properly implemented
- [ ] **Authorization checks** on protected routes
- [ ] **Tokens** stored securely (httpOnly cookies, not localStorage)
- [ ] **Session management** secure
- [ ] **Password handling** follows best practices (hashing, salting)
- [ ] **Rate limiting** implemented for sensitive endpoints

### Data Protection

- [ ] **Sensitive data** not exposed in client code
- [ ] **API keys** not committed to repository
- [ ] **Environment variables** used for secrets
- [ ] **HTTPS** enforced in production
- [ ] **Content Security Policy** configured
- [ ] **Personal data** handled per privacy regulations (GDPR, etc.)

### Dependencies

- [ ] **No known vulnerabilities** in dependencies (npm audit clean)
- [ ] **Dependencies** up to date
- [ ] **Minimal dependencies** - only what's needed
- [ ] **License compliance** checked

---

## Testing

### Test Coverage

- [ ] **Unit tests** for business logic
- [ ] **Integration tests** for critical flows
- [ ] **Component tests** for UI components
- [ ] **E2E tests** for user journeys
- [ ] **Test coverage** > 80% for new code
- [ ] **Edge cases** tested
- [ ] **Error scenarios** tested

### Test Quality

- [ ] **Tests are readable** and well-organized
- [ ] **Tests are isolated** - no dependencies between tests
- [ ] **Mocks used appropriately** - not over-mocking
- [ ] **Assertions are meaningful** - test behavior, not implementation
- [ ] **Tests run fast** - no unnecessary async waits
- [ ] **Accessibility tests** included (jest-axe)

```typescript
// ✅ Good
describe('Button', () => {
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is accessible', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
```

---

## Documentation

### Code Documentation

- [ ] **Complex logic** has explanatory comments
- [ ] **JSDoc comments** for exported functions/components
- [ ] **Type definitions** documented
- [ ] **TODOs** tracked in issue tracker (not just comments)
- [ ] **README** updated if needed
- [ ] **CHANGELOG** updated for user-facing changes

### API Documentation

- [ ] **API endpoints** documented (parameters, responses, errors)
- [ ] **Request/response examples** provided
- [ ] **Error codes** documented
- [ ] **Authentication requirements** specified

---

## Review Process

### Reviewer Checklist

1. **Understand the context** - read the PR description and linked issues
2. **Test locally** - check out the branch and verify functionality
3. **Review incrementally** - focus on one aspect at a time
4. **Be constructive** - suggest improvements, don't just criticize
5. **Ask questions** - seek to understand author's reasoning
6. **Praise good work** - recognize excellent solutions
7. **Respond timely** - aim for < 24 hour review turnaround

### Author Checklist

1. **Self-review first** - review your own changes before requesting review
2. **Provide context** - explain complex decisions in PR description
3. **Keep PRs focused** - one feature/fix per PR
4. **Respond to feedback** - address all review comments
5. **Thank reviewers** - appreciate their time and input
6. **Update documentation** - keep docs in sync with code

---

## Red Flags 🚩

Watch out for these common issues:

- ❌ Large PRs (> 500 lines) without justification
- ❌ Mixing refactoring with new features
- ❌ Test coverage significantly decreased
- ❌ Performance regressions
- ❌ Accessibility violations
- ❌ Security vulnerabilities
- ❌ Breaking changes without migration guide
- ❌ Hardcoded secrets or API keys
- ❌ Disabled or skipped tests
- ❌ Ignoring TypeScript errors with @ts-ignore

---

## Quick Reference

### Must-Have Before Merge

✅ All tests passing
✅ No linting errors
✅ Type checking passes
✅ Accessibility audit clean
✅ Security scan passes
✅ Performance benchmarks met
✅ At least one approval
✅ Documentation updated

---

## Resources

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React Best Practices](https://react.dev/learn)
- [Next.js Documentation](https://nextjs.org/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Security](https://owasp.org/www-project-top-ten/)
- [Web.dev Performance](https://web.dev/performance/)

---

**Remember:** The goal of code review is to maintain quality, share knowledge, and improve as a team. Be respectful, constructive, and collaborative! 🤝
