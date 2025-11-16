/**
 * Modern Hero Component
 *
 * Features:
 * - Gradient background with animated orbs
 * - Parallax scroll effects
 * - Staggered text animations
 * - Floating elements
 * - Dark mode optimized
 * - Fully responsive
 * - WCAG AA compliant
 */

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface HeroProps {
  badge?: {
    text: string;
    icon?: React.ReactNode;
  };
  title: string;
  titleHighlight?: string;
  subtitle: string;
  ctaPrimary: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  ctaSecondary?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  image?: {
    src: string;
    alt: string;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
  className?: string;
}

// ============================================================================
// ANIMATED BACKGROUND ORBS
// ============================================================================

function AnimatedOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Primary Orb */}
      <motion.div
        className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-r from-primary-400/30 to-secondary-400/30 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary Orb */}
      <motion.div
        className="from-purple-400/20 to-pink-400/20 absolute -right-20 bottom-20 h-[500px] w-[500px] rounded-full bg-gradient-to-l blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Tertiary Orb */}
      <motion.div
        className="from-yellow-400/20 to-orange-400/20 absolute left-1/2 top-1/2 h-80 w-80 rounded-full bg-gradient-to-br blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.25, 0.35, 0.25],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
}

// ============================================================================
// FLOATING CARD COMPONENT
// ============================================================================

function FloatingCard({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={cn(
        'rounded-2xl border border-gray-200/50 bg-white/90 p-4 shadow-2xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/90',
        className
      )}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// MAIN HERO COMPONENT
// ============================================================================

export function Hero({
  badge,
  title,
  titleHighlight,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  image,
  stats,
  className,
}: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Parallax effect
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative flex min-h-screen items-center overflow-hidden',
        'bg-gradient-to-br from-gray-50 via-white to-gray-100',
        'dark:from-gray-900 dark:via-gray-900 dark:to-gray-800',
        className
      )}
    >
      {/* Animated Background */}
      <AnimatedOrbs />

      {/* Content Container */}
      <motion.div
        style={{ y, opacity }}
        className="container relative z-10 mx-auto px-4 py-20 md:py-32"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 rounded-full border border-gray-200/50 bg-white/80 px-4 py-2 shadow-lg backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-800/80"
              >
                {badge.icon && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {badge.icon}
                  </motion.span>
                )}
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {badge.text}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl font-bold leading-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl"
              >
                {title}{' '}
                {titleHighlight && (
                  <motion.span
                    initial={{ backgroundPosition: '0% 50%' }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-[length:200%_auto] bg-clip-text text-transparent"
                  >
                    {titleHighlight}
                  </motion.span>
                )}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-300 md:text-2xl"
              >
                {subtitle}
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              {/* Primary CTA */}
              <Link
                href={ctaPrimary.href}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center space-x-2">
                  {ctaPrimary.icon}
                  <span>{ctaPrimary.label}</span>
                  <motion.svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </motion.svg>
                </span>
              </Link>

              {/* Secondary CTA */}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="group inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white/80 px-8 py-4 font-semibold text-gray-900 backdrop-blur-md transition-all hover:scale-105 hover:border-primary-500 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:hover:border-primary-500"
                >
                  <span className="flex items-center space-x-2">
                    {ctaSecondary.icon}
                    <span>{ctaSecondary.label}</span>
                  </span>
                </Link>
              )}
            </motion.div>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-8 border-t border-gray-200 pt-8 dark:border-gray-700"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                      className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right Column - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Visual Container */}
              <motion.div
                className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  // Gradient Placeholder
                  <div className="to-purple-500 absolute inset-0 bg-gradient-to-br from-primary-500 via-secondary-500">
                    <div className="absolute inset-0 opacity-30">
                      <motion.div
                        className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-white/40 blur-2xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          x: [0, 20, 0],
                          y: [0, -20, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-white/30 blur-2xl"
                        animate={{
                          scale: [1, 1.3, 1],
                          x: [0, -20, 0],
                          y: [0, 20, 0],
                        }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Floating Cards */}
              <FloatingCard
                delay={0.8}
                className="absolute -left-6 -top-6 w-48"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 h-3 w-3 animate-pulse rounded-full" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Real-Time Data
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Updated 5 mins ago
                    </div>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard
                delay={1}
                className="absolute -bottom-6 -right-6 w-48"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 h-3 w-3 animate-pulse rounded-full" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      250+ Stations
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Across Melbourne
                    </div>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-2 text-gray-600 dark:text-gray-400"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Usage:
 *
 * <Hero
 *   badge={{
 *     text: 'Live Prices Available',
 *     icon: <span className="text-green-500">●</span>
 *   }}
 *   title="Find the"
 *   titleHighlight="Cheapest Petrol"
 *   subtitle="Compare real-time fuel prices from 250+ stations across Melbourne..."
 *   ctaPrimary={{
 *     label: 'Browse Stations',
 *     href: '/directory',
 *     icon: <SearchIcon />
 *   }}
 *   ctaSecondary={{
 *     label: 'View Trends',
 *     href: '/trends'
 *   }}
 *   stats={[
 *     { value: '250+', label: 'Stations' },
 *     { value: '50+', label: 'Suburbs' },
 *     { value: '10K+', label: 'Users' },
 *   ]}
 * />
 */
