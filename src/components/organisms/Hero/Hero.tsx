/**
 * Hero Component - Modern hero section for directory introduction
 *
 * Features:
 * - Animated text and CTA with Framer Motion
 * - Responsive design (mobile-first)
 * - WCAG 2.1 AA compliant
 * - Lighthouse 100 accessibility score optimized
 * - Modern gradient background
 * - Perfect color contrast
 *
 * @component
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin, TrendingDown, Search } from 'lucide-react';
import Link from 'next/link';

import {
  fadeInUp,
  fadeIn,
  scaleIn,
  ANIMATION_DURATION,
  ANIMATION_EASING,
} from '@/utils/animations';

export interface HeroProps {
  /** Custom heading text */
  heading?: string;
  /** Custom subtitle text */
  subtitle?: string;
  /** Primary CTA text */
  primaryCtaText?: string;
  /** Primary CTA link */
  primaryCtaLink?: string;
  /** Secondary CTA text */
  secondaryCtaText?: string;
  /** Secondary CTA link */
  secondaryCtaLink?: string;
  /** Show background illustration */
  showIllustration?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Hero - Modern hero section with animations
 *
 * Accessibility features:
 * - Semantic HTML (header, h1, p)
 * - ARIA labels for screen readers
 * - Keyboard navigation support
 * - High contrast text
 * - Focus indicators
 * - Reduced motion support
 */
export function Hero({
  heading = 'Find the Cheapest Petrol Near You',
  subtitle = 'Compare fuel prices from thousands of stations across Australia. Save money on every fill-up with real-time price updates.',
  primaryCtaText = 'Find Stations',
  primaryCtaLink = '/directory',
  secondaryCtaText = 'How It Works',
  secondaryCtaLink = '/how-pricing-works',
  showIllustration = true,
  className = '',
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : ANIMATION_DURATION.normal,
        ease: ANIMATION_EASING.easeOut,
        delay: 0.1,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : ANIMATION_DURATION.normal,
        ease: ANIMATION_EASING.easeOut,
        delay: 0.3,
      },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : ANIMATION_DURATION.normal,
        ease: ANIMATION_EASING.easeOut,
        delay: 0.5,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : ANIMATION_DURATION.normal,
        ease: ANIMATION_EASING.easeOut,
        delay: 0.7,
      },
    },
  };

  const illustrationVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : ANIMATION_DURATION.slow,
        ease: ANIMATION_EASING.easeOut,
        delay: 0.4,
      },
    },
  };

  return (
    <header
      className={`relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${className}`}
      aria-label="Hero section"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" aria-hidden="true" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
            >
              <TrendingDown className="w-4 h-4" aria-hidden="true" />
              <span>Save on Every Fill-Up</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={headingVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              {heading.split(' ').slice(0, -3).join(' ')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                {heading.split(' ').slice(-3).join(' ')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={subtitleVariants}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={ctaVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {/* Primary CTA */}
              <Link
                href={primaryCtaLink}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 active:scale-95"
                aria-label={`${primaryCtaText} - Navigate to station directory`}
              >
                <Search className="w-5 h-5" aria-hidden="true" />
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>

              {/* Secondary CTA */}
              <Link
                href={secondaryCtaLink}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 active:scale-95"
                aria-label={`${secondaryCtaText} - Learn how pricing works`}
              >
                <span>{secondaryCtaText}</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={statsVariants}
              className="mt-12 grid grid-cols-3 gap-6 sm:gap-8"
            >
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  5,000+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Stations
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  Live
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Prices
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  $100+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Saved/Year
                </div>
              </div>
            </motion.div>
          </div>

          {/* Illustration Column */}
          {showIllustration && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={illustrationVariants}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main Illustration */}
                <div className="relative z-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                  {/* Mock Station Card */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            BP Station
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            2.5 km away
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          165.9¢
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          per liter
                        </div>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Unleaded
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          165.9¢
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Diesel
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          172.5¢
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Premium
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          189.9¢
                        </div>
                      </div>
                    </div>

                    {/* Savings Badge */}
                    <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                        Save $8.50 vs average
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-xl flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-2xl font-bold text-white">$</span>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-xl flex items-center justify-center"
                  aria-hidden="true"
                >
                  <MapPin className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="currentColor"
            className="text-white dark:text-gray-950"
          />
        </svg>
      </div>
    </header>
  );
}
