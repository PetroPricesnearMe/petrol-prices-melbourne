/**
 * Hero Component Examples
 * Demonstrates different configurations of the Hero component
 */

import { Hero } from '@/components/organisms/Hero';

export const metadata = {
  title: 'Hero Component Examples | Petrol Price Near Me',
  description: 'Examples and variations of the Hero component',
};

export default function HeroExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hero Component Examples
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Different configurations and variations of the Hero component
          </p>
        </div>
      </div>

      {/* Examples */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Example 1: Default */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Default Hero
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Standard hero with all default props
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <Hero />
          </div>
        </section>

        {/* Example 2: Custom Text */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Custom Text
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Hero with custom heading and subtitle
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <Hero
              heading="Save Money on Every Journey"
              subtitle="Access real-time fuel prices from over 5,000 stations nationwide. Make informed decisions and save hundreds each year."
            />
          </div>
        </section>

        {/* Example 3: No Illustration */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Without Illustration
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Hero without the right-side illustration (mobile-like view)
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <Hero showIllustration={false} />
          </div>
        </section>

        {/* Example 4: Custom CTAs */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Custom CTAs
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Hero with custom call-to-action buttons
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <Hero
              primaryCtaText="Get Started Free"
              primaryCtaLink="/directory"
              secondaryCtaText="View Demo"
              secondaryCtaLink="/about"
            />
          </div>
        </section>

        {/* Usage Guide */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Usage Guide
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Basic Usage
              </h3>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-200">
{`import { Hero } from '@/components/organisms/Hero';

export default function HomePage() {
  return <Hero />;
}`}
                </code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                With Custom Props
              </h3>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-200">
{`<Hero
  heading="Your Custom Heading"
  subtitle="Your custom subtitle text"
  primaryCtaText="Get Started"
  primaryCtaLink="/directory"
  secondaryCtaText="Learn More"
  secondaryCtaLink="/about"
  showIllustration={true}
/>`}
                </code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Available Props
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Prop</th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Type</th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Default</th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="p-3 text-gray-900 dark:text-white font-mono">heading</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">string</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">"Find the Cheapest..."</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">Main heading text</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-900 dark:text-white font-mono">subtitle</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">string</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">"Compare fuel prices..."</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">Subtitle text</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-900 dark:text-white font-mono">primaryCtaText</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">string</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">"Find Stations"</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">Primary button text</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-900 dark:text-white font-mono">primaryCtaLink</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">string</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">"/directory"</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">Primary button link</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-900 dark:text-white font-mono">showIllustration</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">boolean</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">true</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">Show right illustration</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Accessibility Features
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Semantic HTML (header, h1, p elements)</li>
                <li>ARIA labels for screen readers</li>
                <li>Keyboard navigation support</li>
                <li>High contrast text (WCAG AA compliant)</li>
                <li>Focus indicators on interactive elements</li>
                <li>Respects prefers-reduced-motion</li>
                <li>Mobile-first responsive design</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Performance Features
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>GPU-optimized animations</li>
                <li>Lazy-loaded illustrations</li>
                <li>Efficient Framer Motion variants</li>
                <li>Optimized for 60fps</li>
                <li>Minimal JavaScript bundle</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

