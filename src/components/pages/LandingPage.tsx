/**
 * Landing Page Component
 *
 * Visually appealing landing page with hero section, directory highlights,
 * call-to-action buttons, and gradient layered backgrounds
 *
 * @module components/pages/LandingPage
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface LandingPageProps {
  className?: string;
}

interface HeroSectionProps {
  className?: string;
}

interface DirectoryHighlightProps {
  title: string;
  description: string;
  image: string;
  stats: {
    count: number;
    label: string;
  };
  features: string[];
  ctaText: string;
  ctaLink: string;
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

interface StatsSectionProps {
  stats: Array<{
    value: string;
    label: string;
    description: string;
  }>;
}

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

/**
 * Hero section with gradient backgrounds and animated elements
 */
function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-screen items-center overflow-hidden',
        className
      )}
    >
      {/* Gradient Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />

        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800/50 to-transparent" />

        {/* Animated gradient orbs */}
        <motion.div
          className="from-yellow-400/20 to-orange-500/20 absolute left-20 top-20 h-72 w-72 rounded-full bg-gradient-to-r blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="from-pink-400/20 to-purple-500/20 absolute bottom-20 right-20 h-96 w-96 rounded-full bg-gradient-to-r blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="from-cyan-400/20 to-blue-500/20 absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Text Content */}
            <motion.div
              className="text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="bg-green-400 mr-2 h-2 w-2 animate-pulse rounded-full" />
                Live Fuel Prices Available
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Compare real-time fuel prices from 250+ stations across
                Melbourne. Save money on every fill-up with live unleaded,
                diesel, and premium prices.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="mb-8 flex flex-col gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link
                  href="/directory"
                  className="inline-flex transform items-center justify-center rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/90"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  className="inline-flex transform items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="mb-1 text-2xl font-bold text-white md:text-3xl">
                    250+
                  </div>
                  <div className="text-sm text-white/80">Petrol Stations</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl font-bold text-white md:text-3xl">
                    50+
                  </div>
                  <div className="text-sm text-white/80">Melbourne Suburbs</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl font-bold text-white md:text-3xl">
                    24/7
                  </div>
                  <div className="text-sm text-white/80">Live Updates</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Elements */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Main Image */}
              <div className="relative">
                <motion.div
                  className="relative h-96 w-full overflow-hidden rounded-2xl shadow-2xl lg:h-[500px]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/hero-petrol-station.jpg"
                    alt="Petrol Station"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                {/* Floating Cards */}
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
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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
// FEATURE CARDS COMPONENT
// ============================================================================

/**
 * Feature card component with animations
 */
function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 transition-transform duration-300 group-hover:scale-110">
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Content */}
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// DIRECTORY HIGHLIGHTS COMPONENT
// ============================================================================

/**
 * Directory highlights section
 */
function DirectoryHighlights() {
  const highlights: DirectoryHighlightProps[] = [
    {
      title: 'Real-Time Price Updates',
      description:
        'Get the latest fuel prices updated every few minutes from stations across Melbourne.',
      image: '/images/features/real-time-prices.jpg',
      stats: { count: 250, label: 'Stations' },
      features: [
        'Live Price Updates',
        'Multiple Fuel Types',
        'Price Alerts',
        'Historical Data',
      ],
      ctaText: 'View Live Prices',
      ctaLink: '/directory',
    },
    {
      title: 'Smart Search & Filters',
      description:
        'Find the perfect station with advanced filters for location, brand, amenities, and more.',
      image: '/images/features/smart-search.jpg',
      stats: { count: 50, label: 'Suburbs' },
      features: [
        'Location-Based Search',
        'Brand Filtering',
        'Amenity Search',
        'Distance Sorting',
      ],
      ctaText: 'Start Searching',
      ctaLink: '/directory',
    },
    {
      title: 'Interactive Maps',
      description:
        'Explore stations on interactive maps with clustering and custom markers for easy navigation.',
      image: '/images/features/interactive-maps.jpg',
      stats: { count: 24, label: 'Hours' },
      features: [
        'Interactive Maps',
        'Station Clustering',
        'Route Planning',
        'Street View',
      ],
      ctaText: 'Explore Maps',
      ctaLink: '/map',
    },
  ];

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              Discover the features that make finding cheap petrol prices easier
              than ever before.
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={highlight.image}
                    alt={highlight.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Stats Badge */}
                  <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
                    <span className="text-sm font-bold text-gray-900">
                      {highlight.stats.count}+ {highlight.stats.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                    {highlight.title}
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {highlight.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6 space-y-2">
                    {highlight.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-2"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={highlight.ctaLink}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-primary-700"
                  >
                    {highlight.ctaText}
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
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
// STATS SECTION COMPONENT
// ============================================================================

/**
 * Statistics section with animated counters
 */
function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 py-20">
      {/* Background Pattern */}
      <div className="bg-pattern-dots absolute inset-0 opacity-10" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
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
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="mb-2 text-3xl font-bold text-white md:text-4xl"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
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
// CTA SECTION COMPONENT
// ============================================================================

/**
 * Call-to-action section
 */
function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 py-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="from-yellow-400/10 to-orange-500/10 absolute left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-r blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="from-pink-400/10 to-purple-500/10 absolute bottom-20 right-20 h-80 w-80 rounded-full bg-gradient-to-r blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
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
                className="inline-flex transform items-center justify-center rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/90"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
                className="inline-flex transform items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
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
// MAIN LANDING PAGE COMPONENT
// ============================================================================

/**
 * Complete landing page with all sections
 */
export function LandingPage({ className }: LandingPageProps) {
  const stats = [
    { value: '250+', label: 'Stations', description: 'Across Melbourne' },
    { value: '50+', label: 'Suburbs', description: 'Covered areas' },
    { value: '10K+', label: 'Users', description: 'Active monthly' },
    { value: '24/7', label: 'Updates', description: 'Live price data' },
  ];

  const features = [
    {
      icon: '⛽',
      title: 'Live Price Updates',
      description:
        'Get real-time fuel prices updated every few minutes from stations across Melbourne.',
      delay: 0,
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description:
        'Find stations by location, brand, amenities, and more with our advanced filtering system.',
      delay: 0.1,
    },
    {
      icon: '🗺️',
      title: 'Interactive Maps',
      description:
        'Explore stations on interactive maps with clustering and custom markers for easy navigation.',
      delay: 0.2,
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description:
        'Access our platform from any device with our fully responsive and mobile-optimized design.',
      delay: 0.3,
    },
  ];

  return (
    <div className={cn('min-h-screen', className)}>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="bg-white py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                Everything You Need to Save on Fuel
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
                Our comprehensive platform provides all the tools you need to
                find the cheapest petrol prices and save money on every fill-up.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={feature.delay}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directory Highlights */}
      <DirectoryHighlights />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  LandingPage,
  HeroSection,
  DirectoryHighlights,
  StatsSection,
  CTASection,
};
export type {
  LandingPageProps,
  HeroSectionProps,
  DirectoryHighlightProps,
  FeatureCardProps,
  StatsSectionProps,
};
