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
    <section className={cn('relative min-h-screen flex items-center overflow-hidden', className)}>
      {/* Gradient Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />

        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800/50 to-transparent" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-purple-500/20 rounded-full blur-3xl"
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
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"
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
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column - Text Content */}
            <motion.div
              className="text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Live Fuel Prices Available
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Find the{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Cheapest
                </span>{' '}
                Petrol Prices
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Compare real-time fuel prices from 250+ stations across Melbourne.
                Save money on every fill-up with live unleaded, diesel, and premium prices.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link
                  href="/directory"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse All Stations
                </Link>
                <Link
                  href="/fuel-price-trends"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">250+</div>
                  <div className="text-white/80 text-sm">Petrol Stations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">50+</div>
                  <div className="text-white/80 text-sm">Melbourne Suburbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-white/80 text-sm">Live Updates</div>
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
                  className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
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
                  className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">BP Collins St</div>
                      <div className="text-xs text-gray-600">Unleaded: 189.9¢</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Shell Richmond</div>
                      <div className="text-xs text-gray-600">Diesel: 195.2¢</div>
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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
function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
      description: 'Get the latest fuel prices updated every few minutes from stations across Melbourne.',
      image: '/images/features/real-time-prices.jpg',
      stats: { count: 250, label: 'Stations' },
      features: ['Live Price Updates', 'Multiple Fuel Types', 'Price Alerts', 'Historical Data'],
      ctaText: 'View Live Prices',
      ctaLink: '/directory',
    },
    {
      title: 'Smart Search & Filters',
      description: 'Find the perfect station with advanced filters for location, brand, amenities, and more.',
      image: '/images/features/smart-search.jpg',
      stats: { count: 50, label: 'Suburbs' },
      features: ['Location-Based Search', 'Brand Filtering', 'Amenity Search', 'Distance Sorting'],
      ctaText: 'Start Searching',
      ctaLink: '/directory',
    },
    {
      title: 'Interactive Maps',
      description: 'Explore stations on interactive maps with clustering and custom markers for easy navigation.',
      image: '/images/features/interactive-maps.jpg',
      stats: { count: 24, label: 'Hours' },
      features: ['Interactive Maps', 'Station Clustering', 'Route Planning', 'Street View'],
      ctaText: 'Explore Maps',
      ctaLink: '/map',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover the features that make finding cheap petrol prices easier than ever before.
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
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
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-bold text-gray-900">
                      {highlight.stats.count}+ {highlight.stats.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {highlight.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {highlight.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={highlight.ctaLink}
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    {highlight.ctaText}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
    <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-pattern-dots" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Trusted by Thousands of Drivers
            </h2>
            <p className="text-xl text-white/90">
              Join the community of smart drivers who save money on fuel every day.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-white/90 font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-white/70 text-sm">
                  {stat.description}
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
// CTA SECTION COMPONENT
// ============================================================================

/**
 * Call-to-action section
 */
function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-purple-500/10 rounded-full blur-3xl"
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of drivers who are already saving money on fuel.
              Find the cheapest petrol prices near you in just a few clicks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/directory"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Stations Now
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
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
      description: 'Get real-time fuel prices updated every few minutes from stations across Melbourne.',
      delay: 0,
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find stations by location, brand, amenities, and more with our advanced filtering system.',
      delay: 0.1,
    },
    {
      icon: '🗺️',
      title: 'Interactive Maps',
      description: 'Explore stations on interactive maps with clustering and custom markers for easy navigation.',
      delay: 0.2,
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description: 'Access our platform from any device with our fully responsive and mobile-optimized design.',
      delay: 0.3,
    },
  ];

  return (
    <div className={cn('min-h-screen', className)}>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need to Save on Fuel
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our comprehensive platform provides all the tools you need to find the cheapest petrol prices and save money on every fill-up.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

export { LandingPage, HeroSection, DirectoryHighlights, StatsSection, CTASection };
export type { LandingPageProps, HeroSectionProps, DirectoryHighlightProps, FeatureCardProps, StatsSectionProps };
