import type { Metadata } from 'next';
import Link from 'next/link';

import { cn, patterns, animations } from '@/styles/system/css-in-js';

export const metadata: Metadata = {
  title: 'Find Cheapest Petrol Prices Near You | Melbourne Fuel Price Comparison',
  description:
    'Find the cheapest petrol stations near you in Melbourne. Compare fuel prices from 250+ stations with real-time updates. Save money on every fill-up with live unleaded, diesel, and premium prices.',
  keywords: [
    'petrol prices near me',
    'cheap fuel melbourne',
    'petrol station finder',
    'fuel price comparison',
    'live petrol prices',
    'melbourne fuel prices',
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white min-h-[90vh] flex items-center">
        <div className={patterns.container() + ' py-20'}>
          <div className={cn(patterns.flex.colCenter, 'text-center')}>
            <div className={cn('mb-8', animations.safe('animate-fade-in'))}>
              <h1 className={cn(patterns.text.h1, 'text-white mb-6 text-balance')}>
                Find the Cheapest Petrol Prices Near You
              </h1>
              <p className={cn(patterns.text.body, 'text-white/90 text-lg max-w-2xl mb-12')}>
                Compare real-time fuel prices from 250+ petrol stations across Melbourne.
                Save money on every fill-up.
              </p>

              {/* CTA Buttons */}
              <div className={cn('flex gap-4 justify-center flex-wrap', animations.safe('animate-slide-up [animation-delay:200ms]'))}>
                <Link href="/directory" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg">
                  📋 Browse All Stations
                </Link>
                <Link href="/fuel-price-trends" className="btn bg-white/10 text-white hover:bg-white/20 btn-lg border-2 border-white/30">
                  📈 View Price Trends
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-8 mt-16', animations.safe('animate-fade-in [animation-delay:400ms]'))}>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">250+</div>
                <div className="text-white/80">Petrol Stations</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">24/7</div>
                <div className="text-white/80">Real-Time Updates</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">20¢</div>
                <div className="text-white/80">Average Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className={patterns.container()}>
          <div className="text-center mb-12">
            <h2 className={patterns.text.h2 + ' mb-4'}>Browse by Region</h2>
            <p className={patterns.text.body}>
              Select your region to find the nearest petrol stations
            </p>
          </div>

          <div className={patterns.grid(3, 'lg')}>
            {[
              { slug: 'north-melbourne', name: 'North Melbourne', icon: '🧭', color: 'bg-blue-500', stations: '50+' },
              { slug: 'south-melbourne', name: 'South Melbourne', icon: '🏙️', color: 'bg-green-500', stations: '45+' },
              { slug: 'east-melbourne', name: 'East Melbourne', icon: '🌅', color: 'bg-orange-500', stations: '60+' },
              { slug: 'west-melbourne', name: 'West Melbourne', icon: '🌆', color: 'bg-red-500', stations: '55+' },
              { slug: 'cbd', name: 'Melbourne CBD', icon: '🏢', color: 'bg-purple-500', stations: '30+' },
              { slug: 'directory', name: 'All Regions', icon: '🗺️', color: 'bg-gray-700', stations: '250+' },
            ].map((region, index) => (
              <Link
                key={region.slug}
                href={region.slug === 'directory' ? '/directory' : `/regions/${region.slug}`}
                className={cn(
                  'card-hover group text-center p-8',
                  animations.safe('animate-scale-in')
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  region.color,
                  'w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform'
                )}>
                  {region.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {region.name}
                </h3>
                <span className="badge badge-primary">{region.stations} Stations</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className={patterns.container()}>
          <div className="text-center mb-12">
            <h2 className={patterns.text.h2 + ' mb-4'}>Why Choose Us?</h2>
            <p className={patterns.text.body}>
              The most comprehensive petrol price comparison service in Melbourne
            </p>
          </div>

          <div className={patterns.grid(3, 'lg')}>
            {[
              {
                icon: '⚡',
                title: 'Real-Time Prices',
                desc: 'Live fuel price updates from 250+ stations across Melbourne',
              },
              {
                icon: '🗺️',
                title: 'Interactive Map',
                desc: 'Find stations on an easy-to-use map with detailed information',
              },
              {
                icon: '💰',
                title: 'Save Money',
                desc: 'Compare prices and save an average of 20¢ per litre',
              },
              {
                icon: '📱',
                title: 'Mobile Friendly',
                desc: 'Works perfectly on all devices - desktop, tablet, and mobile',
              },
              {
                icon: '🔍',
                title: 'Advanced Search',
                desc: 'Filter by fuel type, brand, location, and amenities',
              },
              {
                icon: '📈',
                title: 'Price Trends',
                desc: 'Track price history and predict the best time to fill up',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={cn(
                  'card p-8 text-center',
                  animations.safe('animate-slide-in')
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Suburbs */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className={patterns.container()}>
          <div className="text-center mb-12">
            <h2 className={patterns.text.h2 + ' mb-4'}>
              Find Petrol Stations by Suburb
            </h2>
            <p className={patterns.text.body + ' max-w-2xl mx-auto'}>
              Explore fuel prices in popular Melbourne suburbs
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {[
              'Melbourne', 'Brunswick', 'Preston', 'Coburg', 'Richmond', 'Fitzroy',
              'Broadmeadows', 'Werribee', 'Dandenong', 'Frankston', 'Box Hill', 'Ringwood',
              'Sunbury', 'Craigieburn', 'Pakenham', 'Geelong', 'Bendigo', 'Ballarat'
            ].map((suburb) => (
              <Link
                key={suburb}
                href={`/directory/${suburb.toLowerCase().replace(/\s+/g, '-')}`}
                className="btn btn-outline btn-sm text-center hover:btn-primary transition-all"
              >
                {suburb}
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/directory" className="btn btn-primary">
              View All Suburbs →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter + ' text-center'}>
            <h2 className="text-4xl font-bold mb-6">Ready to Save on Fuel?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Start comparing prices now and never overpay for petrol again
            </p>
            <Link href="/directory" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-xl">
              Get Started →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
