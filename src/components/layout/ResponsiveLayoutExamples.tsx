/**
 * Responsive Layout Examples
 * Real-world patterns for petrol station finder
 */

import React from 'react';

import {
  ResponsiveGrid,
  GridItem,
  Container,
  Flex,
  Section,
} from './ResponsiveGrid';

// ============================================================================
// EXAMPLE 1: STATION CARDS GRID
// ============================================================================

/**
 * Station Cards - Responsive Grid
 * Mobile: 1 column
 * Tablet: 2 columns
 * Desktop: 3 columns
 * Large: 4 columns
 */
export function StationCardsGrid({ stations }: { stations: any[] }) {
  return (
    <Section spacing="lg">
      <ResponsiveGrid
        cols={{
          default: 1, // Mobile: stacked
          sm: 2, // Tablet: 2 per row
          lg: 3, // Desktop: 3 per row
          xl: 4, // Large: 4 per row
        }}
        gap="lg"
      >
        {stations.map((station) => (
          <GridItem key={station.id}>
            <div className="card h-full">
              <div className="space-y-4 p-6">
                <h3 className="text-xl font-bold">{station.name}</h3>
                <p className="text-sm text-gray-600">{station.address}</p>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-2xl font-bold text-primary-600">
                    ${station.price}
                  </span>
                  <button className="btn-primary btn">View</button>
                </div>
              </div>
            </div>
          </GridItem>
        ))}
      </ResponsiveGrid>
    </Section>
  );
}

// ============================================================================
// EXAMPLE 2: HERO SECTION WITH SIDEBAR
// ============================================================================

/**
 * Hero with Search and Featured Content
 * Mobile: Stacked
 * Desktop: 2/3 main + 1/3 sidebar
 */
export function HeroWithSidebar() {
  return (
    <Section spacing="xl" background="gray">
      <ResponsiveGrid
        cols={{
          default: 1, // Mobile: stack
          lg: 12, // Desktop: 12-column grid
        }}
        gap="xl"
      >
        {/* Main Content - Takes 8 columns on large screens */}
        <GridItem
          colSpan={{
            default: 1,
            lg: 8,
          }}
        >
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Find the{' '}
                <span className="text-primary-600">Cheapest Petrol</span> Near
                You
              </h1>
              <p className="max-w-2xl text-xl text-gray-600">
                Compare real-time fuel prices from 250+ stations across
                Australia. Save money on every fill-up.
              </p>
            </div>

            {/* Search Bar */}
            <div className="rounded-2xl bg-white p-4 shadow-xl sm:p-6">
              <Flex
                responsive={{
                  direction: { default: 'col', sm: 'row' },
                }}
                gap="md"
                align="end"
              >
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter suburb or postcode"
                    className="input w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium">
                    Fuel Type
                  </label>
                  <select className="input w-full">
                    <option>Unleaded</option>
                    <option>Premium</option>
                    <option>Diesel</option>
                  </select>
                </div>
                <button className="btn-primary btn w-full whitespace-nowrap sm:w-auto">
                  Search Prices
                </button>
              </Flex>
            </div>
          </div>
        </GridItem>

        {/* Sidebar - Takes 4 columns on large screens */}
        <GridItem
          colSpan={{
            default: 1,
            lg: 4,
          }}
        >
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-bold">Today&apos;s Stats</h3>
              <div className="space-y-3">
                <StatItem label="Avg Price" value="$1.89" trend="down" />
                <StatItem label="Stations" value="250+" />
                <StatItem label="Updated" value="2 mins ago" />
              </div>
            </div>

            {/* Featured Promotion */}
            <div className="card bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white">
              <h3 className="mb-2 text-xl font-bold">Save More!</h3>
              <p className="mb-4 text-primary-100">
                Get price alerts for your favourite stations
              </p>
              <button className="btn w-full bg-white text-primary-600 hover:bg-gray-100">
                Enable Alerts
              </button>
            </div>
          </div>
        </GridItem>
      </ResponsiveGrid>
    </Section>
  );
}

// Helper component
function StatItem({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: 'up' | 'down';
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold">{value}</span>
        {trend && (
          <span
            className={cn(
              'text-xs',
              trend === 'down' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend === 'down' ? '↓' : '↑'}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: FEATURE GRID
// ============================================================================

/**
 * Features Section
 * Mobile: 1 column
 * Tablet: 2 columns
 * Desktop: 3 columns
 */
export function FeaturesGrid() {
  const features = [
    {
      icon: '🗺️',
      title: 'Interactive Map',
      description:
        'See all stations on an interactive map with real-time prices',
    },
    {
      icon: '💰',
      title: 'Price Comparison',
      description: 'Compare prices across multiple brands instantly',
    },
    {
      icon: '🔔',
      title: 'Price Alerts',
      description: 'Get notified when prices drop at your favorite stations',
    },
    {
      icon: '📊',
      title: 'Price Trends',
      description: 'View historical data and predict future price changes',
    },
    {
      icon: '⛽',
      title: 'Station Details',
      description: 'Check amenities, hours, and payment options',
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Access from anywhere on any device',
    },
  ];

  return (
    <Section spacing="xl" background="white">
      <div className="mb-12 text-center sm:mb-16">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
          Why Choose Us?
        </h2>
        <p className="mx-auto max-w-2xl text-xl text-gray-600">
          Everything you need to find the best fuel prices
        </p>
      </div>

      <ResponsiveGrid
        cols={{
          default: 1,
          sm: 2,
          lg: 3,
        }}
        gap="lg"
      >
        {features.map((feature, index) => (
          <GridItem key={index}>
            <div className="card h-full p-6 transition-shadow hover:shadow-xl sm:p-8">
              <div className="mb-4 text-5xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </GridItem>
        ))}
      </ResponsiveGrid>
    </Section>
  );
}

// ============================================================================
// EXAMPLE 4: DASHBOARD LAYOUT
// ============================================================================

/**
 * Dashboard with Complex Grid
 * Uses grid areas for optimal layout
 */
export function DashboardLayout() {
  return (
    <Container size="full" padding>
      <ResponsiveGrid
        cols={{
          default: 1,
          md: 12,
        }}
        gap="lg"
        className="min-h-screen"
      >
        {/* Header - Full width */}
        <GridItem colSpan={{ default: 1, md: 12 }}>
          <div className="card p-4 sm:p-6">
            <Flex justify="between" align="center" gap="md">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <button className="btn-primary btn">Add Station</button>
            </Flex>
          </div>
        </GridItem>

        {/* Main Content - 8 columns */}
        <GridItem
          colSpan={{
            default: 1,
            md: 8,
          }}
        >
          <div className="space-y-6">
            {/* Chart */}
            <div className="card p-6">
              <h2 className="mb-4 text-xl font-bold">Price Trends</h2>
              <div className="flex h-64 items-center justify-center rounded bg-gray-100">
                Chart Component
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h2 className="mb-4 text-xl font-bold">Recent Activity</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                      ⛽
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Price updated</p>
                      <p className="text-sm text-gray-500">Shell Carlton</p>
                    </div>
                    <span className="text-sm text-gray-400">2m ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GridItem>

        {/* Sidebar - 4 columns */}
        <GridItem
          colSpan={{
            default: 1,
            md: 4,
          }}
        >
          <div className="space-y-6 md:sticky md:top-4">
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
              <div className="space-y-2">
                <button className="btn-outlined btn w-full justify-start">
                  🔍 Search Stations
                </button>
                <button className="btn-outlined btn w-full justify-start">
                  📍 Near Me
                </button>
                <button className="btn-outlined btn w-full justify-start">
                  ⭐ Favorites
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4 text-center">
                <div className="text-3xl font-bold text-primary-600">15</div>
                <div className="mt-1 text-sm text-gray-600">Favorites</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-green-600 text-3xl font-bold">$45</div>
                <div className="mt-1 text-sm text-gray-600">Saved</div>
              </div>
            </div>

            {/* Alerts */}
            <div className="card bg-yellow-50 border-yellow-200 p-6">
              <h3 className="mb-2 text-lg font-bold">⚠️ Price Alert</h3>
              <p className="text-sm text-gray-700">
                Prices increased by 5¢ at 3 nearby stations
              </p>
            </div>
          </div>
        </GridItem>
      </ResponsiveGrid>
    </Container>
  );
}

// ============================================================================
// EXAMPLE 5: ASYMMETRIC GRID
// ============================================================================

/**
 * Asymmetric Layout for Visual Interest
 * Featured item spans more columns
 */
export function AsymmetricGrid({ items }: { items: any[] }) {
  return (
    <Section spacing="lg">
      <ResponsiveGrid
        cols={{
          default: 1,
          sm: 2,
          lg: 4,
        }}
        gap="lg"
      >
        {/* Featured item - spans 2 columns and 2 rows */}
        <GridItem
          colSpan={{
            default: 1,
            sm: 2,
            lg: 2,
          }}
          rowSpan={2}
        >
          <div className="card h-full bg-gradient-to-br from-primary-500 to-primary-600 p-8 text-white">
            <div className="mb-4 text-6xl">⛽</div>
            <h2 className="mb-4 text-3xl font-bold">Featured Station</h2>
            <p className="mb-6 text-primary-100">Lowest prices in your area</p>
            <button className="btn bg-white text-primary-600 hover:bg-gray-100">
              View Details
            </button>
          </div>
        </GridItem>

        {/* Regular items */}
        {items.slice(0, 6).map((item, index) => (
          <GridItem key={index}>
            <div className="card h-full p-6">
              <h3 className="mb-2 font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </GridItem>
        ))}
      </ResponsiveGrid>
    </Section>
  );
}

// ============================================================================
// EXAMPLE 6: RESPONSIVE NAVIGATION LAYOUT
// ============================================================================

/**
 * Responsive Navigation Bar
 * Mobile: Stacked with hamburger
 * Desktop: Horizontal with space-between
 */
export function ResponsiveNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <Container>
        <Flex
          responsive={{
            direction: { default: 'col', md: 'row' },
          }}
          justify="between"
          align="center"
          gap="md"
          className="py-4"
        >
          {/* Logo */}
          <div className="flex w-full items-center justify-between md:w-auto">
            <h1 className="text-2xl font-bold text-primary-600">⛽ PPNM</h1>
            {/* Mobile menu button */}
            <button className="btn-ghost btn md:hidden">☰</button>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden items-center gap-6 md:flex">
            <a href="#" className="nav-link">
              Home
            </a>
            <a href="#" className="nav-link">
              Directory
            </a>
            <a href="#" className="nav-link">
              Trends
            </a>
            <a href="#" className="nav-link">
              About
            </a>
          </div>

          {/* CTA */}
          <button className="btn-primary btn hidden md:block">
            Get Started
          </button>
        </Flex>
      </Container>
    </nav>
  );
}

// ============================================================================
// HELPER UTILITIES
// ============================================================================

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default {
  StationCardsGrid,
  HeroWithSidebar,
  FeaturesGrid,
  DashboardLayout,
  AsymmetricGrid,
  ResponsiveNavbar,
};
