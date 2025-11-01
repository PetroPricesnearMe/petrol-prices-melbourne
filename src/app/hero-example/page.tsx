/**
 * Hero Example Page - Demonstrates the Hero component
 *
 * This page showcases different configurations of the Hero component
 * for testing and demonstration purposes.
 */

import type { Metadata } from 'next';

import { Hero } from '@/components/organisms/Hero';

export const metadata: Metadata = {
  title: 'Hero Component Example | Petrol Price Near Me',
  description: 'Example page showcasing the Hero component with different configurations',
};

export default function HeroExamplePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Default Hero */}
      <Hero />

      {/* Content Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="space-y-12">
          {/* Overview */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Hero Component Examples
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              The Hero component is a fully responsive, animated section designed for
              introducing the directory. It includes accessibility features, dark mode
              support, and GPU-optimized animations.
            </p>
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Features
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>Framer Motion animations with reduced motion support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>Mobile-first responsive design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>WCAG 2.1 AA compliant with ARIA labels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>Perfect color contrast (4.5:1 minimum)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>Keyboard navigation and focus indicators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>GPU-optimized animations (60fps)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>Dark mode support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>Modern gradient background with illustration</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Customization Options
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Custom heading and subtitle text</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Configurable CTA buttons and links</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Toggle illustration visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Custom CSS classes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Usage Example */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Usage Example
            </h3>
            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{`import { Hero } from '@/components/organisms/Hero';

export default function Page() {
  return (
    <Hero
      heading="Find the Cheapest Petrol Near You"
      subtitle="Compare fuel prices from thousands of stations"
      primaryCtaText="Find Stations"
      primaryCtaLink="/directory"
      secondaryCtaText="How It Works"
      secondaryCtaLink="/how-pricing-works"
      showIllustration={true}
    />
  );
}`}</code>
            </pre>
          </div>

          {/* Accessibility */}
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Accessibility
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              This component is optimized for Lighthouse 100 accessibility score with
              semantic HTML elements (<code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">header</code>,{' '}
              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">h1</code>,{' '}
              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">p</code>),
              proper ARIA labels, keyboard navigation support, and respects user's
              motion preferences.
            </p>
          </div>

          {/* Performance */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Performance
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              All animations use GPU-accelerated properties (transform, opacity) for
              smooth 60fps performance. The component automatically respects the user's
              <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded mx-1">
                prefers-reduced-motion
              </code>
              setting.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
                <span className="font-semibold">LCP:</span> &lt;2.5s
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
                <span className="font-semibold">CLS:</span> 0
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
                <span className="font-semibold">FID:</span> &lt;100ms
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Hero Examples */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Custom Variations
          </h2>

          {/* Without Illustration */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Without Illustration
            </h3>
            <Hero showIllustration={false} />
          </div>

          {/* Custom Text */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Custom Text & CTAs
            </h3>
            <Hero
              heading="Save Money on Every Fill-Up"
              subtitle="Join thousands of Australians who use our platform to find the best fuel prices in their area."
              primaryCtaText="Get Started"
              secondaryCtaText="View Demo"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
