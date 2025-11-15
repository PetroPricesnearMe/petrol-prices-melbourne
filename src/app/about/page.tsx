/**
 * About Page
 * Information about the Petrol Price Near Me service
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { cn, patterns } from '@/styles/system/css-in-js';

export const metadata: Metadata = {
  title: 'About Us | Petrol Price Near Me',
  description:
    "Learn about Petrol Price Near Me, Australia's leading petrol price monitoring service. We help Melbourne drivers find the cheapest fuel prices from 250+ stations with real-time updates.",
  openGraph: {
    title: 'About Petrol Price Near Me',
    description:
      'Helping Melbourne drivers find the cheapest fuel prices since 2024.',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <header className="bg-gradient-primary py-20 text-white">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <h1 className={cn(patterns.text.h1, 'mb-4 text-center text-white')}>
              About Petrol Price Near Me
            </h1>
            <p
              className={cn(
                patterns.text.body,
                'max-w-2xl text-center text-white/90'
              )}
            >
              Helping Melbourne drivers find the cheapest fuel, fast.
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className={patterns.container() + ' py-16'}>
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Mission */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Our Mission</h2>
            <p className={patterns.text.body}>
              We want to make fuel pricing transparent and accessible. Compare
              live prices, explore suburb directories, and use our map to plan
              cheaper fill-ups. Our goal is to help every Melbourne driver save
              money on every tank of fuel.
            </p>
          </section>

          {/* Melbourne First */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Melbourne First</h2>
            <p className={patterns.text.body}>
              The experience is tuned for Melbourne drivers: suburb suggestions,
              autocomplete, and suburb-centric navigation. We understand the
              local market and provide insights specific to Melbourne&apos;s
              fuel price cycles.
            </p>
          </section>

          {/* Stats */}
          <section className="card bg-gradient-primary p-8 text-white">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
              <div>
                <h3 className="mb-2 text-5xl font-bold">250+</h3>
                <p className="text-white/90">Petrol Stations</p>
              </div>
              <div>
                <h3 className="mb-2 text-5xl font-bold">24/7</h3>
                <p className="text-white/90">Real-Time Updates</p>
              </div>
              <div>
                <h3 className="mb-2 text-5xl font-bold">20¢</h3>
                <p className="text-white/90">Average Savings</p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-6'}>Our Story</h2>
            <div className="space-y-4">
              <p className={patterns.text.body}>
                Founded in Melbourne, Petrol Prices Near Me was created to
                address the frustration of inconsistent fuel pricing across the
                city. We saw how much money drivers were wasting simply because
                they didn&apos;t know where to find the cheapest fuel prices.
              </p>
              <p className={patterns.text.body}>
                Today, we monitor over 250 petrol stations across Melbourne,
                providing real-time price updates that help thousands of drivers
                save money every day. Our platform combines cutting-edge
                technology with user-friendly design to make finding cheap fuel
                as easy as possible.
              </p>
              <p className={patterns.text.body}>
                We&apos;re committed to transparency, accuracy, and helping
                Melbourne drivers make informed decisions about where to fill
                up. Whether you&apos;re commuting to work or planning a road
                trip, we&apos;re here to help you save.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-6'}>Get In Touch</h2>
            <div className="space-y-4">
              <p className={patterns.text.body}>
                Have questions or feedback? We&apos;d love to hear from you!
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Contact Name
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Al T</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Mobile
                    </p>
                    <a
                      href="tel:0423530204"
                      className="text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400"
                    >
                      0423 *** 204
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800 md:col-span-2">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Email
                    </p>
                    <a
                      href="mailto:petrolpricesnearme@gmail.com"
                      className="break-all text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400"
                      aria-label="Send email to petrolpricesnearme@gmail.com"
                    >
                      petrolpricesnearme@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800 md:col-span-2">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ABN
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      22 177 321 155
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <Link href="/directory" className="btn-primary btn-lg btn">
              Browse All Stations →
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
