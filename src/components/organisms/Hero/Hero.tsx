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
  ANIMATION_DURATION,
  ANIMATION_EASING,
  fadeIn,
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
      className={`from-blue-50 to-green-50 relative overflow-hidden bg-gradient-to-br via-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${className}`}
      aria-label="Hero section"
    >
      {/* Background Pattern */}
      <div
        className="bg-grid-pattern absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        aria-hidden="true"
      />

      {/* Gradient Orbs */}
      <div
        className="bg-blue-400/20 absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="bg-green-400/20 absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content Column */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              <TrendingDown className="h-4 w-4" aria-hidden="true" />
              <span>Save on Every Fill-Up</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={headingVariants}
              className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              {heading.split(' ').slice(0, -3).join(' ')}{' '}
              <span className="from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-gradient-to-r bg-clip-text text-transparent">
                {heading.split(' ').slice(-3).join(' ')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={subtitleVariants}
              className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl lg:mx-0"
            >
              {subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={ctaVariants}
              className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
            >
              {/* Primary CTA */}
              <Link
                href={primaryCtaLink}
                className="from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/30 hover:shadow-blue-500/40 focus:ring-blue-500/50 group inline-flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 active:scale-95"
                aria-label={`${primaryCtaText} - Navigate to station directory`}
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                <span>{primaryCtaText}</span>
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>

              {/* Secondary CTA */}
              <Link
                href={secondaryCtaLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 font-semibold text-gray-900 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500/20 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700"
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
                <div className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  5,000+
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Stations
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  Live
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Prices
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  $100+
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
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
                <div className="relative z-10 rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                  {/* Mock Station Card */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="from-blue-500 to-blue-600 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br">
                          <MapPin
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
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
                        <div className="text-green-600 dark:text-green-400 text-2xl font-bold">
                          165.9¢
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          per liter
                        </div>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
                        <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                          Unleaded
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          165.9¢
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
                        <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                          Diesel
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          172.5¢
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
                        <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                          Premium
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          189.9¢
                        </div>
                      </div>
                    </div>

                    {/* Savings Badge */}
                    <div className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 flex items-center justify-center gap-2 rounded-xl border p-3">
                      <TrendingDown
                        className="text-green-600 dark:text-green-400 h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="text-green-700 dark:text-green-300 text-sm font-semibold">
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
                    ease: 'easeInOut',
                  }}
                  className="from-green-400 to-green-500 absolute -right-6 -top-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl"
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
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                  className="from-blue-400 to-blue-500 absolute -bottom-6 -left-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br shadow-xl"
                  aria-hidden="true"
                >
                  <MapPin className="h-8 w-8 text-white" />
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
          className="h-auto w-full"
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
