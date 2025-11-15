# Testing Strategy

Comprehensive testing strategy achieving 80%+ code coverage with meaningful tests.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Pyramid](#testing-pyramid)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Accessibility Testing](#accessibility-testing)
7. [Performance Testing](#performance-testing)
8. [Visual Regression Testing](#visual-regression-testing)
9. [Test Coverage](#test-coverage)
10. [CI/CD Integration](#cicd-integration)

---

## Testing Philosophy

### Principles

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal implementation details
   - Tests should survive refactoring

2. **Write Tests First (TDD)**
   - Write failing test
   - Write minimal code to pass
   - Refactor

3. **Maintain High Coverage**
   - Target: 80%+ code coverage
   - 100% coverage for critical paths
   - Quality over quantity

4. **Fast and Reliable**
   - Tests should run quickly
   - No flaky tests
   - Deterministic results

5. **Easy to Understand**
   - Clear test names
   - Well-organized
   - Good documentation

---

## Testing Pyramid

```
       /\
      /  \  E2E Tests (10%)
     /----\
    / Integration \ (20%)
   /--------------\
  /   Unit Tests   \ (70%)
 /------------------\
```

### Distribution

- **70% Unit Tests**: Fast, isolated, component logic
- **20% Integration Tests**: API calls, data flow, component integration
- **10% E2E Tests**: Critical user journeys, full application flow

---

## Unit Testing

### Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing
- **jest-axe**: Accessibility testing

### What to Test

✅ **Do Test:**

- Component rendering
- User interactions
- State changes
- Props validation
- Edge cases
- Error handling
- Accessibility

❌ **Don't Test:**

- Implementation details
- Third-party libraries
- CSS styles (use visual regression instead)
- Constants and configs

### Component Testing Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  // Rendering
  describe('Rendering', () => {
    it('renders with text', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });
  });

  // Interactions
  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // States
  describe('States', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // Accessibility
  describe('Accessibility', () => {
    it('has no violations', async () => {
      const { container } = render(<Button>Accessible</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

### Hook Testing Pattern

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 300 });
    expect(result.current).toBe('initial'); // Still initial

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 400 }
    );
  });
});
```

### Utility Function Testing

```typescript
import { formatCurrency, calculateDistance } from './utils';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('formats number as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles negative numbers', () => {
      expect(formatCurrency(-100)).toBe('-$100.00');
    });
  });
});
```

---

## Integration Testing

### What to Test

- API endpoint integration
- Data flow between components
- State management
- Context providers
- Route navigation
- Form submissions

### API Integration Tests

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import { StationList } from './StationList';

const server = setupServer(
  rest.get('/api/stations', (req, res, ctx) => {
    return res(ctx.json({ data: mockStations }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('StationList Integration', () => {
  it('fetches and displays stations', async () => {
    render(<StationList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Station')).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    server.use(
      rest.get('/api/stations', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<StationList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Context Integration Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { StationProvider, useStations } from './StationContext';

const TestComponent = () => {
  const { stations, addStation } = useStations();

  return (
    <div>
      <div>{stations.length} stations</div>
      <button onClick={() => addStation(mockStation)}>Add</button>
    </div>
  );
};

describe('Station Context Integration', () => {
  it('provides station data to consumers', () => {
    render(
      <StationProvider>
        <TestComponent />
      </StationProvider>
    );

    expect(screen.getByText('0 stations')).toBeInTheDocument();
  });

  it('updates stations across consumers', async () => {
    render(
      <StationProvider>
        <TestComponent />
      </StationProvider>
    );

    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('1 stations')).toBeInTheDocument();
  });
});
```

---

## End-to-End Testing

### Tools

- **Playwright**: Primary E2E framework
- **Cypress**: Alternative E2E framework

### What to Test

Critical user journeys:

- User registration/login
- Station search and filtering
- Viewing station details
- Navigation flows
- Payment processing (if applicable)
- Error recovery

### Playwright Test Example

```typescript
import { test, expect } from '@playwright/test';

test.describe('Station Search Journey', () => {
  test('user can search for stations', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Enter search query
    await page.fill('input[type="search"]', 'Melbourne');
    await page.press('input[type="search"]', 'Enter');

    // Wait for results
    await page.waitForSelector('[data-testid="station-card"]');

    // Verify results
    const cards = page.locator('[data-testid="station-card"]');
    await expect(cards).toHaveCount(expect.any(Number));

    // Click first result
    await cards.first().click();

    // Verify details page
    await expect(page).toHaveURL(/\/stations\/\d+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('user can filter search results', async ({ page }) => {
    await page.goto('/stations');

    // Open filters
    await page.click('button:has-text("Filters")');

    // Select fuel type
    await page.check('input[value="unleaded"]');

    // Apply filters
    await page.click('button:has-text("Apply")');

    // Verify filtered results
    await page.waitForTimeout(1000);
    const results = page.locator('[data-testid="station-card"]');
    expect(await results.count()).toBeGreaterThan(0);
  });
});
```

### Page Object Pattern

```typescript
// pages/SearchPage.ts
export class SearchPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/');
  }

  async search(query: string) {
    await this.page.fill('input[type="search"]', query);
    await this.page.press('input[type="search"]', 'Enter');
  }

  async waitForResults() {
    await this.page.waitForSelector('[data-testid="station-card"]');
  }

  getResults() {
    return this.page.locator('[data-testid="station-card"]');
  }
}

// test file
test('search flow', async ({ page }) => {
  const searchPage = new SearchPage(page);

  await searchPage.navigate();
  await searchPage.search('Melbourne');
  await searchPage.waitForResults();

  const results = await searchPage.getResults();
  await expect(results).toHaveCount(expect.any(Number));
});
```

---

## Accessibility Testing

### Tools

- **jest-axe**: Automated a11y testing
- **@axe-core/playwright**: E2E a11y testing
- **Manual testing**: Screen readers, keyboard

### Automated Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('has no violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Keyboard Navigation Tests

```typescript
test('supports keyboard navigation', async () => {
  render(<NavigationMenu />);

  // Tab to first item
  await userEvent.tab();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();

  // Tab to next item
  await userEvent.tab();
  expect(screen.getByRole('link', { name: 'About' })).toHaveFocus();

  // Enter activates link
  await userEvent.keyboard('{Enter}');
});
```

### ARIA Tests

```typescript
test('has correct ARIA attributes', () => {
  render(<Modal open>Content</Modal>);

  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(dialog).toHaveAttribute('aria-labelledby');
});
```

---

## Performance Testing

### Metrics to Track

- **LCP**: Largest Contentful Paint (<2.5s)
- **FID**: First Input Delay (<100ms)
- **CLS**: Cumulative Layout Shift (<0.1)
- **TTI**: Time to Interactive (<3.8s)
- **Bundle Size**: < 200KB (gzipped)

### Performance Tests

```typescript
import { measurePerformance } from '@/utils/performance';

describe('Performance', () => {
  it('renders large list efficiently', async () => {
    const startTime = performance.now();

    render(<VirtualList items={generateItems(10000)} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(100); // Under 100ms
  });

  it('has acceptable bundle size', () => {
    const bundleSize = getBundleSize();
    expect(bundleSize).toBeLessThan(200 * 1024); // 200KB
  });
});
```

### Lighthouse CI

```yaml
# .lighthouserc.json
{
  'ci':
    {
      'collect': { 'url': ['http://localhost:3000'], 'numberOfRuns': 3 },
      'assert':
        {
          'assertions':
            {
              'categories:performance': ['error', { 'minScore': 0.9 }],
              'categories:accessibility': ['error', { 'minScore': 0.9 }],
              'categories:best-practices': ['error', { 'minScore': 0.9 }],
              'categories:seo': ['error', { 'minScore': 0.9 }],
            },
        },
    },
}
```

---

## Visual Regression Testing

### Tools

- **Playwright Screenshots**: Built-in visual comparison
- **Percy**: Cloud-based visual testing
- **Chromatic**: Storybook visual testing

### Screenshot Tests

```typescript
test('matches visual snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});

test('button hover state', async ({ page }) => {
  await page.goto('/');
  await page.hover('button');
  await expect(page.locator('button')).toHaveScreenshot('button-hover.png');
});
```

---

## Test Coverage

### Coverage Thresholds

```javascript
// jest.config.js
coverageThresholds: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  './src/components/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90,
  },
}
```

### Running Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

### What to Prioritize

**High Priority (100% coverage):**

- Authentication logic
- Payment processing
- Data validation
- Security features
- Critical user flows

**Medium Priority (90% coverage):**

- UI components
- Forms
- API clients
- Utility functions

**Lower Priority (70% coverage):**

- Presentational components
- Styling components
- Config files

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v3
```

### Test Scripts

```json
{
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:unit": "jest --testPathPattern=src/",
    "test:integration": "jest --testPathPattern=integration/",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "jest --testPathPattern=a11y",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

---

## Best Practices

### Do's ✅

- Write tests before code (TDD)
- Test user behavior, not implementation
- Use data-testid for stable selectors
- Mock external dependencies
- Keep tests simple and focused
- Use descriptive test names
- Group related tests with `describe`
- Clean up after tests

### Don'ts ❌

- Don't test implementation details
- Don't create brittle tests
- Don't test third-party code
- Don't skip cleanup
- Don't use sleep/wait arbitrarily
- Don't ignore flaky tests
- Don't copy-paste tests
- Don't test everything (prioritize)

---

## Testing Checklist

Before merging:

- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] Coverage maintained or improved
- [ ] No skipped or disabled tests
- [ ] No console errors in tests
- [ ] Accessibility tests pass
- [ ] E2E tests for critical flows
- [ ] Performance tests pass

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Questions?** Refer to test examples in the codebase or ask the team!
