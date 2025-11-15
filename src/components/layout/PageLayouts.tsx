/**
 * Pre-built Page Layout Templates
 * Ready-to-use responsive layouts for common page types
 */

import type { ReactNode } from 'react';
import React from 'react';

import {
  Container,
  Flex,
  ResponsiveGrid,
  GridItem,
  Section,
} from './ResponsiveGrid';

// ============================================================================
// DIRECTORY/LISTING PAGE LAYOUT
// ============================================================================

interface DirectoryLayoutProps {
  title: string;
  description?: string;
  stats?: Array<{ label: string; value: string | number }>;
  filters?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
}

/**
 * Directory Page Layout
 * Header + Filters Sidebar + Content Grid
 *
 * @example
 * ```tsx
 * <DirectoryLayout
 *   title="Petrol Stations"
 *   description="Find 250+ stations"
 *   stats={[{ label: 'Total', value: 250 }]}
 *   filters={<FilterPanel />}
 * >
 *   <StationGrid stations={stations} />
 * </DirectoryLayout>
 * ```
 */
export function DirectoryLayout({
  title,
  description,
  stats,
  filters,
  children,
  actions,
}: DirectoryLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <Section
        spacing="lg"
        background="white"
        className="border-b border-gray-200 dark:border-gray-700"
      >
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="mx-auto mb-6 max-w-3xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              {description}
            </p>
          )}

          {/* Stats Bar */}
          {stats && stats.length > 0 && (
            <Flex justify="center" gap="md" wrap className="mt-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="min-w-[120px] rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-800 sm:px-6"
                >
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </Flex>
          )}

          {/* Actions */}
          {actions && <div className="mt-6">{actions}</div>}
        </div>
      </Section>

      {/* Main Content */}
      <Section spacing="xl">
        <ResponsiveGrid
          cols={{
            default: 1,
            lg: 12,
          }}
          gap="xl"
        >
          {/* Filters Sidebar (if provided) */}
          {filters && (
            <GridItem colSpan={{ default: 1, lg: 3 }}>
              <div className="lg:sticky lg:top-4">{filters}</div>
            </GridItem>
          )}

          {/* Content Area */}
          <GridItem
            colSpan={{
              default: 1,
              lg: filters ? 9 : 12,
            }}
          >
            {children}
          </GridItem>
        </ResponsiveGrid>
      </Section>
    </div>
  );
}

// ============================================================================
// LANDING/HERO PAGE LAYOUT
// ============================================================================

interface LandingLayoutProps {
  hero: ReactNode;
  features?: ReactNode;
  cta?: ReactNode;
  testimonials?: ReactNode;
  children?: ReactNode;
}

/**
 * Landing Page Layout
 * Hero + Features + Content + CTA
 */
export function LandingLayout({
  hero,
  features,
  cta,
  testimonials,
  children,
}: LandingLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {hero}

      {/* Features Section */}
      {features && (
        <Section spacing="xl" background="white">
          {features}
        </Section>
      )}

      {/* Main Content */}
      {children && (
        <Section spacing="xl" background="gray">
          {children}
        </Section>
      )}

      {/* Testimonials */}
      {testimonials && (
        <Section spacing="xl" background="white">
          {testimonials}
        </Section>
      )}

      {/* CTA Section */}
      {cta && (
        <Section spacing="xl" background="primary">
          {cta}
        </Section>
      )}
    </div>
  );
}

// ============================================================================
// CONTENT PAGE LAYOUT (BLOG/ARTICLE)
// ============================================================================

interface ContentLayoutProps {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  content: ReactNode;
  sidebar?: ReactNode;
  related?: ReactNode;
}

/**
 * Content Page Layout
 * Article-style layout with optional sidebar
 */
export function ContentLayout({
  title,
  subtitle,
  meta,
  content,
  sidebar,
  related,
}: ContentLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Article Header */}
      <Section spacing="lg" background="gray">
        <Container size="md">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <header className="not-prose mb-8 text-center">
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                {title}
              </h1>

              {subtitle && (
                <p className="mb-6 text-xl text-gray-600 dark:text-gray-300">
                  {subtitle}
                </p>
              )}

              {meta && (
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {meta}
                </div>
              )}
            </header>
          </article>
        </Container>
      </Section>

      {/* Article Content */}
      <Section spacing="xl">
        <ResponsiveGrid
          cols={{
            default: 1,
            lg: 12,
          }}
          gap="xl"
        >
          {/* Main Content */}
          <GridItem
            colSpan={{
              default: 1,
              lg: sidebar ? 8 : 12,
            }}
          >
            <Container size={sidebar ? 'full' : 'md'}>
              <article className="prose prose-lg dark:prose-invert max-w-none">
                {content}
              </article>
            </Container>
          </GridItem>

          {/* Sidebar */}
          {sidebar && (
            <GridItem colSpan={{ default: 1, lg: 4 }}>
              <div className="space-y-6 lg:sticky lg:top-4">{sidebar}</div>
            </GridItem>
          )}
        </ResponsiveGrid>
      </Section>

      {/* Related Content */}
      {related && (
        <Section spacing="xl" background="gray">
          <Container size="xl">{related}</Container>
        </Section>
      )}
    </div>
  );
}

// ============================================================================
// DASHBOARD LAYOUT
// ============================================================================

interface DashboardLayoutProps {
  header: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
  quickActions?: ReactNode;
}

/**
 * Dashboard Layout
 * App-style layout with persistent sidebar
 */
export function DashboardLayout({
  header,
  sidebar,
  children,
  quickActions,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container size="full" padding={false}>
        <ResponsiveGrid
          cols={{
            default: 1,
            md: 12,
          }}
          gap="none"
          className="min-h-screen"
        >
          {/* Sidebar - Hidden on mobile */}
          {sidebar && (
            <GridItem
              colSpan={{
                default: 1,
                md: 3,
                lg: 2,
              }}
              className="hidden md:block"
            >
              <div className="sticky top-0 h-screen overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                {sidebar}
              </div>
            </GridItem>
          )}

          {/* Main Area */}
          <GridItem
            colSpan={{
              default: 1,
              md: sidebar ? 9 : 12,
              lg: sidebar ? 10 : 12,
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-800 sm:px-6 lg:px-8">
              {header}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              <ResponsiveGrid
                cols={{
                  default: 1,
                  xl: quickActions ? 12 : 1,
                }}
                gap="lg"
              >
                {/* Main Content */}
                <GridItem
                  colSpan={{
                    default: 1,
                    xl: quickActions ? 9 : 12,
                  }}
                >
                  {children}
                </GridItem>

                {/* Quick Actions Sidebar */}
                {quickActions && (
                  <GridItem
                    colSpan={{
                      default: 1,
                      xl: 3,
                    }}
                  >
                    <div className="space-y-6 xl:sticky xl:top-24">
                      {quickActions}
                    </div>
                  </GridItem>
                )}
              </ResponsiveGrid>
            </div>
          </GridItem>
        </ResponsiveGrid>
      </Container>
    </div>
  );
}

// ============================================================================
// SPLIT SCREEN LAYOUT
// ============================================================================

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
  leftBg?: string;
  rightBg?: string;
  ratio?: '1:1' | '1:2' | '2:1' | '2:3' | '3:2';
}

/**
 * Split Screen Layout
 * Perfect for auth pages, feature showcases
 */
export function SplitLayout({
  left,
  right,
  leftBg = 'bg-primary-600',
  rightBg = 'bg-white',
  ratio = '1:1',
}: SplitLayoutProps) {
  const ratios = {
    '1:1': { left: 6, right: 6 },
    '1:2': { left: 4, right: 8 },
    '2:1': { left: 8, right: 4 },
    '2:3': { left: 5, right: 7 },
    '3:2': { left: 7, right: 5 },
  };

  const { left: leftSpan, right: rightSpan } = ratios[ratio];

  return (
    <div className="min-h-screen">
      <ResponsiveGrid
        cols={{
          default: 1,
          lg: 12,
        }}
        gap="none"
        className="min-h-screen"
      >
        {/* Left Side */}
        <GridItem
          colSpan={{
            default: 1,
            lg: leftSpan,
          }}
          className={`${leftBg} flex items-center justify-center p-8 lg:p-12`}
        >
          {left}
        </GridItem>

        {/* Right Side */}
        <GridItem
          colSpan={{
            default: 1,
            lg: rightSpan,
          }}
          className={`${rightBg} flex items-center justify-center p-8 lg:p-12`}
        >
          {right}
        </GridItem>
      </ResponsiveGrid>
    </div>
  );
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  DirectoryLayout,
  LandingLayout,
  ContentLayout,
  DashboardLayout,
  SplitLayout,
};
