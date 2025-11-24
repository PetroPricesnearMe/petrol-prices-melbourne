/**
 * Performance-Optimized Landing Page Component
 *
 * Conversion-optimized landing page with Core Web Vitals optimization,
 * lazy loading, and performance monitoring
 *
 * @module components/pages/PerformanceOptimizedLandingPage
 */

'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// LAZY LOADED COMPONENTS
// ============================================================================

// Removed: Testimonials and Pricing sections as per user request

// ============================================================================
// TYPES
// ============================================================================

interface PerformanceOptimizedLandingPageProps {
  className?: string;
}

// ============================================================================
// PERFORMANCE MONITORING HOOK
// ============================================================================

function usePerformanceMonitoring() {
  // Monitor Core Web Vitals
  if (typeof window !== 'undefined') {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.warn('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.warn('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          console.warn('CLS:', entry.value);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

// ============================================================================
// OPTIMIZED HERO SECTION
// ============================================================================

function OptimizedHeroSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800"
    >
      {/* Optimized Background with CSS instead of JS animations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800/50 to-transparent" />

        {/* Static gradient orbs for better performance */}
        <div className="from-yellow-400/20 to-orange-500/20 absolute left-20 top-20 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r blur-3xl" />
        <div className="from-pink-400/20 to-purple-500/20 animation-delay-2000 absolute bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Text Content */}
            <motion.div
              className="text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="bg-green-400 mr-2 h-2 w-2 animate-pulse rounded-full" />
                Live Fuel Prices Available
              </motion.div>

              {/* Main Heading - Critical for LCP */}
              <motion.h1
                className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Find the{' '}
                <span className="from-yellow-400 to-orange-500 bg-gradient-to-r bg-clip-text text-transparent">
                  Cheapest
                </span>{' '}
                Petrol Prices
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mb-8 text-xl leading-relaxed text-white/90 md:text-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Compare real-time fuel prices from 250+ stations across
                Melbourne. Save money on every fill-up with live unleaded,
                diesel, and premium prices.
              </motion.p>

              {/* CTA Buttons - Critical for conversion */}
              <motion.div
                className="mb-8 flex flex-col gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link
                  href="/directory"
                  className="inline-flex transform items-center justify-center rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/20"
                  aria-label="Browse all petrol stations to find cheapest prices"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Browse All Stations
                </Link>
                <Link
                  href="/fuel-price-trends"
                  className="inline-flex transform items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
                  aria-label="View fuel price trends and analytics"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  View Price Trends
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-wrap items-center gap-6 text-white/80"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="text-green-400 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="text-blue-400 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">
                    Official Service Victoria Data
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="text-green-400 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">No registration required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="text-green-400 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Real-time updates</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Optimized Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Main Image with priority loading */}
              <div className="relative">
                <motion.div
                  className="relative h-96 w-full overflow-hidden rounded-2xl shadow-2xl lg:h-[500px]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Gradient placeholder until hero image is available */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500">
                    {/* Decorative floating elements */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute left-10 top-10 h-32 w-32 animate-pulse-slow rounded-full bg-white/30 blur-3xl" />
                      <div
                        className="absolute bottom-10 right-10 h-40 w-40 animate-pulse-slow rounded-full bg-white/20 blur-3xl"
                        style={{ animationDelay: '1s' }}
                      />
                      <div
                        className="absolute left-1/3 top-1/2 h-24 w-24 animate-pulse-slow rounded-full bg-white/25 blur-2xl"
                        style={{ animationDelay: '0.5s' }}
                      />
                    </div>
                  </div>

                  {/* TODO: Replace with actual hero image once available:
                  <Image
                    src="/images/hero-petrol-station.jpg"
                    alt="Modern petrol station with fuel pumps showing competitive prices"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={85}
                  />
                  */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                {/* Floating Price Cards - Optimized animations */}
                <motion.div
                  className="absolute -left-4 -top-4 rounded-xl bg-white p-4 shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500 h-3 w-3 rounded-full" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        BP Collins St
                      </div>
                      <div className="text-xs text-gray-600">
                        Unleaded: 189.9¢
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -right-4 rounded-xl bg-white p-4 shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 h-3 w-3 rounded-full" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Shell Richmond
                      </div>
                      <div className="text-xs text-gray-600">
                        Diesel: 195.2¢
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transform text-white/60"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll down to see more content"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}

// ============================================================================
// OPTIMIZED FEATURES SECTION
// ============================================================================

function OptimizedFeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const features = [
    {
      icon: '⛽',
      title: 'Official Service Victoria Data',
      description:
        'Powered by Fair Fuel Open Data API - official government data with 24-hour updates from all registered Victorian fuel stations.',
    },
    {
      icon: '🏢',
      title: 'All Major Brands',
      description:
        'Compare prices across all major and independent fuel brands including BP, Shell, Caltex, Ampol, 7-Eleven, and more.',
    },
    {
      icon: '⛽',
      title: 'Complete Fuel Types',
      description:
        'Find prices for all fuel types: Unleaded 91, Premium 95/98, Diesel, E10, E85, LPG, and alternative fuels.',
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description:
        'Find stations by location, brand, amenities, and more with our advanced filtering system.',
    },
    {
      icon: '🗺️',
      title: 'Interactive Maps',
      description:
        'Explore stations on interactive maps with clustering and custom markers for easy navigation.',
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description:
        'Access our platform from any device with our fully responsive and mobile-optimized design.',
    },
    {
      icon: '🔔',
      title: 'Price Alerts',
      description:
        'Set up notifications for price drops and never miss a great deal on fuel.',
    },
    {
      icon: '📊',
      title: 'Price Trends',
      description:
        'Track historical price data and trends to find the best times to fill up.',
    },
  ];

  return (
    <section ref={ref} className="bg-white py-20 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Everything You Need to Save on Fuel
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              Our comprehensive platform provides all the tools you need to find
              the cheapest petrol prices and save money on every fill-up.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 transition-transform duration-300 group-hover:scale-110">
                    <span
                      className="text-2xl"
                      role="img"
                      aria-label={feature.title}
                    >
                      {feature.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// OPTIMIZED STATS SECTION
// ============================================================================

function OptimizedStatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const stats = [
    { value: '250+', label: 'Stations', description: 'Across Melbourne' },
    { value: '50+', label: 'Suburbs', description: 'Covered areas' },
    { value: '10K+', label: 'Users', description: 'Active monthly' },
    { value: '24/7', label: 'Updates', description: 'Live price data' },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 py-20"
    >
      {/* Optimized background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-secondary-600/50" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Trusted by Thousands of Drivers
            </h2>
            <p className="text-xl text-white/90">
              Join the community of smart drivers who save money on fuel every
              day.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  className="mb-2 text-3xl font-bold text-white md:text-4xl"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  {stat.value}
                </motion.div>
                <div className="mb-1 font-semibold text-white/90">
                  {stat.label}
                </div>
                <div className="text-sm text-white/70">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// OPTIMIZED CTA SECTION
// ============================================================================

function OptimizedCTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 py-20"
    >
      {/* Optimized background elements */}
      <div className="absolute inset-0">
        <div className="from-yellow-400/10 to-orange-500/10 absolute left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r blur-3xl" />
        <div className="from-pink-400/10 to-purple-500/10 animation-delay-2000 absolute bottom-20 right-20 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Ready to Start Saving?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
              Join thousands of drivers who are already saving money on fuel.
              Find the cheapest petrol prices near you in just a few clicks.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/directory"
                className="inline-flex transform items-center justify-center rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/20"
                aria-label="Find petrol stations near you to save money on fuel"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Find Stations Now
              </Link>
              <Link
                href="/about"
                className="inline-flex transform items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
                aria-label="Learn more about our fuel price comparison service"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// OPTIMIZED FOOTER
// ============================================================================

function OptimizedFooter() {
  const footerLinks = {
    product: [
      { name: 'Find Stations', href: '/directory' },
      { name: 'Price Trends', href: '/fuel-price-trends' },
      { name: 'Mobile App', href: '/mobile' },
      { name: 'API Access', href: '/api' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Community', href: '/community' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                  <span className="text-lg font-bold text-white">P</span>
                </div>
                <span className="text-2xl font-bold">Petrol Price Near Me</span>
              </div>
              <p className="mb-6 max-w-md text-gray-400">
                Find the cheapest petrol prices near you in Melbourne. Compare
                real-time fuel prices from 250+ stations and save money on every
                fill-up.
              </p>
              <div className="flex space-x-4">
                {[
                  {
                    href: '#',
                    label: 'Twitter',
                    icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
                  },
                  {
                    href: '#',
                    label: 'Facebook',
                    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                  },
                  {
                    href: '#',
                    label: 'LinkedIn',
                    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 transition-colors hover:text-white"
                    aria-label={social.label}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="mb-4 text-lg font-semibold capitalize">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-400 transition-colors hover:text-white"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-12 border-t border-gray-800 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 text-sm text-gray-400 md:mb-0">
                © 2024 Petrol Price Near Me. All rights reserved.
              </div>
              <div className="flex space-x-6">
                {footerLinks.legal.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PERFORMANCE-OPTIMIZED LANDING PAGE COMPONENT
// ============================================================================

export function PerformanceOptimizedLandingPage({
  className,
}: PerformanceOptimizedLandingPageProps) {
  usePerformanceMonitoring();

  return (
    <div className={cn('min-h-screen', className)}>
      {/* Hero Section - Critical above the fold */}
      <OptimizedHeroSection />

      {/* Features Section */}
      <OptimizedFeaturesSection />

      {/* Stats Section */}
      <OptimizedStatsSection />

      {/* CTA Section */}
      <OptimizedCTASection />

      {/* Footer */}
      <OptimizedFooter />
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { PerformanceOptimizedLandingPageProps };
