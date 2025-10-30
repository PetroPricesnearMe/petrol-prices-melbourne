/**
 * How Pricing Works Page
 * Explain fuel pricing mechanisms and cycles
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { cn, patterns } from '@/styles/system/css-in-js';

export const metadata: Metadata = {
  title: 'How Fuel Pricing Works | Understanding Petrol Prices',
  description:
    'Learn how petrol pricing works in Melbourne. Understand price cycles, factors affecting fuel costs, and strategies to save money on fuel.',
  keywords: [
    'fuel pricing explained',
    'petrol price cycle',
    'how petrol prices work',
    'fuel cost factors',
    'melbourne fuel market',
  ],
};

export default function HowPricingWorksPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-primary text-white py-20">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <h1 className={cn(patterns.text.h1, 'text-white mb-4 text-center')}>
              How Fuel Pricing Works
            </h1>
            <p className={cn(patterns.text.body, 'text-white/90 text-center max-w-2xl')}>
              Understanding the factors that affect petrol prices in Melbourne
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className={patterns.container() + ' py-16'}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Price Cycle Overview</h2>
            <p className={patterns.text.body + ' mb-4'}>
              Melbourne, like many Australian cities, experiences a weekly fuel price cycle. Prices
              typically start low early in the week and gradually increase, peaking on weekends
              before dropping again.
            </p>
            <p className={patterns.text.body}>
              Understanding this cycle can help you save significantly on fuel costs over time.
            </p>
          </section>

          {/* Factors */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-6'}>Factors Affecting Fuel Prices</h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Global Oil Prices',
                  icon: '🌍',
                  impact: 'High',
                  desc: 'International crude oil prices are the primary driver of fuel costs',
                },
                {
                  title: 'Australian Dollar Exchange Rate',
                  icon: '💱',
                  impact: 'High',
                  desc: 'Oil is traded in USD, so exchange rates directly affect local prices',
                },
                {
                  title: 'Taxes and Levies',
                  icon: '💰',
                  impact: 'Medium',
                  desc: 'Excise tax, GST, and state levies make up about 40% of the pump price',
                },
                {
                  title: 'Operating Costs',
                  icon: '🏪',
                  impact: 'Medium',
                  desc: 'Rent, staff, and maintenance costs vary by location',
                },
                {
                  title: 'Competition',
                  icon: '⚔️',
                  impact: 'Medium',
                  desc: 'Areas with more stations tend to have more competitive pricing',
                },
              ].map((factor, i) => (
                <div key={i} className="border-l-4 border-primary-500 pl-6 py-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{factor.icon}</span>
                    <h3 className="text-lg font-semibold">{factor.title}</h3>
                    <span className={cn(
                      'badge',
                      factor.impact === 'High' ? 'badge-error' : 'badge-warning'
                    )}>
                      {factor.impact} Impact
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{factor.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Saving Tips */}
          <section className="card p-8 bg-success-50 dark:bg-gray-800">
            <h2 className={patterns.text.h2 + ' mb-6'}>Money-Saving Strategies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: '📅', title: 'Time Your Fill-ups', tip: 'Fill up early in the week when prices are lowest' },
                { icon: '🗺️', title: 'Use Our Tools', tip: 'Compare prices before heading out' },
                { icon: '🚗', title: 'Maintain Your Vehicle', tip: 'Proper maintenance improves fuel efficiency' },
                { icon: '🛣️', title: 'Plan Your Route', tip: 'Avoid unnecessary trips and combine errands' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <Link href="/directory" className="btn btn-primary btn-lg">
              Find Cheap Fuel Now →
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
