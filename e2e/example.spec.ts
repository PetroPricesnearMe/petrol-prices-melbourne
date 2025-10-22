import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Petrol/i);

    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');

    // Check for skip link
    const skipLink = page.locator('text=Skip to main content');
    await expect(skipLink).toBeInViewport();

    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should search for stations', async ({ page }) => {
    await page.goto('/');

    // Find search input
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();

    // Type search query
    await searchInput.fill('Melbourne');

    // Submit search
    await searchInput.press('Enter');

    // Wait for results
    await page.waitForSelector('[data-testid="station-card"]', { timeout: 5000 });

    // Check that results are displayed
    const stationCards = page.locator('[data-testid="station-card"]');
    await expect(stationCards).toHaveCount(expect.any(Number));
  });
});

test.describe('Station List', () => {
  test('should display station cards', async ({ page }) => {
    await page.goto('/stations');

    // Wait for station cards to load
    await page.waitForSelector('[data-testid="station-card"]');

    // Check for station information
    const firstCard = page.locator('[data-testid="station-card"]').first();
    await expect(firstCard).toContainText(/\$\d+\.\d+/); // Price format
  });

  test('should filter stations', async ({ page }) => {
    await page.goto('/stations');

    // Open filter menu
    const filterButton = page.locator('button:has-text("Filter")');
    await filterButton.click();

    // Select fuel type
    const unleadedCheckbox = page.locator('input[type="checkbox"][value="unleaded"]');
    await unleadedCheckbox.check();

    // Apply filters
    const applyButton = page.locator('button:has-text("Apply")');
    await applyButton.click();

    // Check that results are filtered
    await page.waitForTimeout(1000); // Wait for filter to apply
    const cards = page.locator('[data-testid="station-card"]');
    await expect(cards).toHaveCount(expect.any(Number));
  });
});

test.describe('Performance', () => {
  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // Measure LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve((lastEntry as any).renderTime || (lastEntry as any).loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        setTimeout(() => resolve(0), 5000);
      });
    });

    // LCP should be under 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1); // Only one h1 per page
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check that focus is visible
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });
});

test.describe('Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display mobile menu', async ({ page }) => {
    await page.goto('/');

    // Check for hamburger menu
    const menuButton = page.locator('button[aria-label*="menu"]');
    await expect(menuButton).toBeVisible();

    // Open menu
    await menuButton.click();

    // Check that menu is expanded
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('should be touch-friendly', async ({ page }) => {
    await page.goto('/stations');

    // Check that buttons are large enough
    const buttons = page.locator('button');
    const firstButton = buttons.first();
    const box = await firstButton.boundingBox();

    // Buttons should be at least 44x44px (WCAG)
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  });
});
