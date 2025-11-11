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
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary Orb */}
      <motion.div
        className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-primary-400/30 to-secondary-400/30 rounded-full blur-3xl"
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
        className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-l from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
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
        className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"
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
  className 
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
        'bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50',
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
        'relative min-h-screen flex items-center overflow-hidden',
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
        className="relative z-10 container mx-auto px-4 py-20 md:py-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200/50 dark:border-gray-700/50"
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
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white"
              >
                {title}{' '}
                {titleHighlight && (
                  <motion.span
                    initial={{ backgroundPosition: '0% 50%' }}
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent bg-[length:200%_auto]"
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
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
              >
                {subtitle}
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* Primary CTA */}
              <Link
                href={ctaPrimary.href}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50"
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
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </Link>

              {/* Secondary CTA */}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="group inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-900 dark:text-white bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:scale-105"
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
                className="flex flex-wrap gap-8 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                      className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
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
                className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
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
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-secondary-500 to-purple-500">
                    <div className="absolute inset-0 opacity-30">
                      <motion.div
                        className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/40 rounded-full blur-2xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          x: [0, 20, 0],
                          y: [0, -20, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/30 rounded-full blur-2xl"
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
                className="absolute -top-6 -left-6 w-48"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
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
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-2 text-gray-600 dark:text-gray-400"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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

