/**
 * Test Utilities
 *
 * Reusable test helpers and utilities
 */

import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

/**
 * Custom render function with providers
 */
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </HelmetProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

/**
 * Wait for async operations
 */
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Create mock intersection observer
 */
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver as any;
};

/**
 * Create mock resize observer
 */
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver as any;
};

/**
 * Mock window.matchMedia
 */
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

/**
 * Create mock for fetch
 */
export const mockFetch = (response: unknown) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    } as Response)
  );
};

/**
 * Create test station data
 */
export const createMockStation = (override: Record<string, unknown> = {}) => ({
  id: 1,
  stationName: 'Test Station',
  address: '123 Test St',
  city: 'Melbourne',
  region: 'VIC',
  postalCode: '3000',
  country: 'Australia',
  latitude: -37.8136,
  longitude: 144.9631,
  brand: ['Shell'],
  fuelPrices: [
    {
      id: 1,
      fuelType: 'unleaded',
      pricePerLiter: 1.89,
      lastUpdated: '2025-01-01T00:00:00Z',
    },
  ],
  distance: 1.5,
  ...override,
});

/**
 * Create multiple mock stations
 */
export const createMockStations = (count: number) => {
  return Array.from({ length: count }, (_, i) =>
    createMockStation({
      id: i + 1,
      stationName: `Test Station ${i + 1}`,
    })
  );
};

/**
 * Simulate user delay
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get accessibility tree
 */
export const getAccessibilityTree = (container: HTMLElement) => {
  const tree: string[] = [];
  const walk = (element: Element, indent: number = 0) => {
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    const text = element.textContent?.trim().slice(0, 50);

    if (role || ariaLabel) {
      tree.push(
        `${'  '.repeat(indent)}${role || 'element'}${ariaLabel ? ` "${ariaLabel}"` : ''}${text ? `: "${text}"` : ''}`
      );
    }

    Array.from(element.children).forEach((child) => walk(child, indent + 1));
  };

  walk(container);
  return tree.join('\n');
};
