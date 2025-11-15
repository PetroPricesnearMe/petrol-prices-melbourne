import Image from 'next/image';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { trackPageView } from '../utils/analytics';

import {
  MotionDiv,
  MotionH1,
  MotionP,
  MotionSection,
  containerVariants,
  itemVariants,
} from './MotionComponents';
import RegionSelector from './RegionSelector';
import SEO from './SEO';

/**
 * HomePage Component - Fully Responsive with Tailwind CSS
 * Fluid typography, mobile-first design, and optimized images
 *
 * @component
 */

// Structured data for homepage
const homepageStructuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Petrol Prices Near Me',
    url: 'https://www.petrolpricesnearme.com.au',
    description:
      'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Find the cheapest unleaded, diesel & premium near you today!',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://www.petrolpricesnearme.com.au/directory?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Petrol Prices Near Me',
    description: "Melbourne's premier fuel price comparison service",
    areaServed: {
      '@type': 'City',
      name: 'Melbourne',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'VIC',
        addressCountry: 'AU',
      },
    },
    priceRange: '$$',
  },
];

// Override stagger timing for homepage
const heroContainerVariants = {
  ...containerVariants,
  visible: {
    ...containerVariants.visible,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const HomePage = () => {
  // Track page view on mount
  useEffect(() => {
    trackPageView('Home');
  }, []);

  return (
    <>
      <SEO
        title="Compare Live Petrol Prices from 250+ Stations in Melbourne | Save up to 20c/L"
        description="Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Find the cheapest unleaded, diesel & premium near you today!"
        keywords="petrol prices melbourne, fuel prices melbourne, cheapest petrol, petrol stations near me, live fuel prices, melbourne petrol, fuel comparison, unleaded prices, diesel prices, premium fuel"
        canonical="/"
        structuredData={homepageStructuredData}
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section - Fully Responsive with Mobile-First Vertical Compression */}
        <MotionDiv
          className="relative flex min-h-[70vh] items-center overflow-hidden md:min-h-[85vh] lg:min-h-screen"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          role="banner"
          aria-label="Hero section"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Hero Content - Mobile-First */}
              <header className="order-2 space-y-6 text-center sm:space-y-8 lg:order-1 lg:text-left">
                {/* Badge */}
                <MotionDiv
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md"
                  variants={itemVariants}
                >
                  <span className="bg-green-400 flex h-2 w-2 animate-pulse rounded-full" />
                  <span>Live Fuel Prices</span>
                </MotionDiv>

                {/* Title - Fluid Typography */}
                <MotionH1
                  className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                  variants={itemVariants}
                >
                  Compare Live Petrol Prices from{' '}
                  <span className="from-yellow-300 via-yellow-200 to-yellow-300 inline-block animate-pulse bg-gradient-to-r bg-clip-text text-transparent">
                    250+ Stations
                  </span>{' '}
                  in Melbourne
                </MotionH1>

                {/* Subtitle - Fluid Typography */}
                <MotionP
                  className="mx-auto max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg lg:mx-0 lg:text-xl"
                  variants={itemVariants}
                >
                  Save up to{' '}
                  <span className="text-yellow-300 font-bold">20c/L</span> with
                  real-time fuel price updates. Find the cheapest unleaded,
                  diesel & premium near you today!
                </MotionP>

                {/* CTA Buttons - Touch-Friendly */}
                <MotionDiv
                  className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
                  variants={itemVariants}
                >
                  <a
                    href="#regions"
                    className="inline-flex min-h-[52px] touch-manipulation items-center justify-center gap-2 rounded-2xl border-2 border-white/30 bg-white/20 px-6 py-3 text-base font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/30 hover:shadow-xl active:scale-95 sm:px-8 sm:py-4 sm:text-lg"
                  >
                    <span>🗺️</span>
                    <span>Browse by Region</span>
                  </a>

                  <Link
                    to="/directory"
                    className="inline-flex min-h-[52px] touch-manipulation items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-base font-bold text-primary-600 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-xl active:scale-95 sm:px-8 sm:py-4 sm:text-lg"
                  >
                    <span>🏪</span>
                    <span>View All Stations</span>
                  </Link>
                </MotionDiv>

                {/* Stats - Responsive Grid */}
                <MotionDiv
                  className="grid grid-cols-3 gap-4 pt-6 sm:gap-6 sm:pt-8 lg:gap-8"
                  variants={itemVariants}
                >
                  <div className="space-y-1 text-center lg:text-left">
                    <div className="text-2xl font-extrabold text-white drop-shadow-lg sm:text-3xl lg:text-4xl xl:text-5xl">
                      250+
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wide text-white/80 sm:text-sm">
                      Stations
                    </div>
                  </div>
                  <div className="space-y-1 text-center lg:text-left">
                    <div className="text-yellow-300 text-2xl font-extrabold drop-shadow-lg sm:text-3xl lg:text-4xl xl:text-5xl">
                      Live
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wide text-white/80 sm:text-sm">
                      Updates
                    </div>
                  </div>
                  <div className="space-y-1 text-center lg:text-left">
                    <div className="text-2xl font-extrabold text-white drop-shadow-lg sm:text-3xl lg:text-4xl xl:text-5xl">
                      24/7
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wide text-white/80 sm:text-sm">
                      Monitoring
                    </div>
                  </div>
                </MotionDiv>
              </header>

              {/* Hero Image - Optimized */}
              <MotionDiv
                className="order-1 flex items-center justify-center lg:order-2"
                variants={itemVariants}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <figure className="group relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                  <div className="from-yellow-400 to-orange-500 absolute -inset-4 rounded-3xl bg-gradient-to-r opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-40" />
                  <div className="group-hover:shadow-3xl relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md transition-all duration-500 group-hover:-translate-y-2">
                    <img
                      src="/images/fuel-nozzles.svg"
                      alt="Fuel nozzles at petrol station showing different fuel types - Diesel, 98 Octane, 95 Octane, Unleaded, and 91 Octane"
                      className="h-auto w-full opacity-0 transition-opacity duration-300"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onLoad={(e) => {
                        e.target.style.opacity = '1';
                      }}
                      onError={(e) => {
                        console.warn('Failed to load fuel-nozzles image');
                        e.target.style.display = 'none';
                      }}
                    />
                    <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="rounded-lg bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                          Diesel
                        </span>
                        <span className="bg-red-600/60 rounded-lg px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                          98 Octane
                        </span>
                        <span className="bg-yellow-500/60 rounded-lg px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                          95 Octane
                        </span>
                        <span className="bg-green-600/60 rounded-lg px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                          Unleaded
                        </span>
                        <span className="bg-purple-600/60 rounded-lg px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                          91 Octane
                        </span>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </MotionDiv>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 transform sm:block">
            <MotionDiv
              className="h-10 w-6 rounded-full border-2 border-white/50 p-1"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="mx-auto h-3 w-1.5 rounded-full bg-white" />
            </MotionDiv>
          </div>
        </MotionDiv>

        {/* Region Selector */}
        <RegionSelector />

        {/* Features Section - Responsive Cards */}
        <MotionSection
          className="bg-gray-50 py-16 sm:py-20 lg:py-24 xl:py-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <MotionDiv
              className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:mb-6 sm:text-4xl lg:text-5xl xl:text-6xl">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Melbourne Fuel?
                </span>
              </h2>
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl">
                Comprehensive fuel price monitoring to help you save money on
                every fill-up
              </p>
            </MotionDiv>

            {/* Features Grid - Responsive */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
              {[
                {
                  icon: '🕐',
                  title: 'Real-Time Updates',
                  description:
                    'Get live fuel price updates from petrol stations across Melbourne with instant notifications when prices change',
                },
                {
                  icon: '🎯',
                  title: 'Location-Based Search',
                  description:
                    'Find the nearest and cheapest petrol stations in your area using our advanced location-based search system',
                },
                {
                  icon: '💰',
                  title: 'Save Money',
                  description:
                    'Compare prices from over 250 petrol stations and save up to 20 cents per liter on every fuel purchase',
                },
              ].map((feature, index) => (
                <article
                  key={index}
                  className="shadow-soft hover:shadow-strong group relative rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-500 hover:-translate-y-2 sm:p-8 lg:p-10"
                  itemScope
                  itemType="https://schema.org/Service"
                >
                  <MotionDiv
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 text-3xl transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:h-16 sm:w-16 sm:text-4xl lg:h-20 lg:w-20 lg:text-5xl">
                      {feature.icon}
                    </div>
                    <h3
                      itemProp="name"
                      className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600 sm:mb-4 sm:text-2xl"
                    >
                      {feature.title}
                    </h3>
                    <p
                      itemProp="description"
                      className="text-sm leading-relaxed text-gray-600 sm:text-base"
                    >
                      {feature.description}
                    </p>
                  </MotionDiv>
                </article>
              ))}
            </div>
          </div>
        </MotionSection>
      </main>
    </>
  );
};

export default HomePage;
