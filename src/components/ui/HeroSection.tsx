/**
 * Modern HeroSection Component
 *
 * A world-class hero section with:
 * - Fluid animations using Framer Motion
 * - Responsive mobile-first design
 * - WCAG 2.1 AA accessibility compliance
 * - Dark mode support with Tailwind's dark: variants
 * - Optimized for Core Web Vitals
 * - Semantic HTML structure
 *
 * @component
 * @example
 * <HeroSection
 *   title="Find the Best Deals"
 *   subtitle="Save money on every purchase"
 *   ctaText="Get Started"
 *   ctaHref="/signup"
 * />
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { type ReactNode } from 'react';

export interface HeroSectionProps {
  /** Main heading text */
  title: string | ReactNode;
  /** Subtitle or description */
  subtitle?: string | ReactNode;
  /** Primary CTA button text */
  ctaText?: string;
  /** Primary CTA button link */
  ctaHref?: string;
  /** Secondary CTA button text */
  secondaryCtaText?: string;
  /** Secondary CTA button link */
  secondaryCtaHref?: string;
  /** Background variant */
  variant?: 'gradient' | 'solid' | 'image';
  /** Background image URL (when variant is 'image') */
  backgroundImage?: string;
  /** Show animated badge */
  showBadge?: boolean;
  /** Badge text */
  badgeText?: string;
  /** Custom className */
  className?: string;
  /** Children elements (e.g., custom graphics) */
  children?: ReactNode;
  /** Trust indicators */
  trustIndicators?: Array<{ icon: ReactNode; text: string }>;
}

/**
 * HeroSection - Modern, accessible hero component
 */
export function HeroSection({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaHref = '#',
  secondaryCtaText,
  secondaryCtaHref = '#',
  variant = 'gradient',
  backgroundImage,
  showBadge = false,
  badgeText = 'New Feature',
  className = '',
  children,
  trustIndicators = [],
}: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants with respect to prefers-reduced-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.001 : 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  // Background styles based on variant
  const backgroundStyles = {
    gradient:
      'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-950',
    solid: 'bg-gray-900 dark:bg-black',
    image: 'bg-gray-900',
  };

  return (
    <section
      className={`relative flex min-h-[90vh] items-center justify-center overflow-hidden ${backgroundStyles[variant]} ${className}`}
      aria-labelledby="hero-title"
    >
      {/* Background Effects */}
      {variant === 'gradient' && (
        <>
          {/* Animated gradient orbs */}
          <div
            className="absolute inset-0 opacity-30 dark:opacity-20"
            aria-hidden="true"
          >
            <motion.div
              className="from-yellow-400/30 to-orange-500/30 absolute left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-r blur-3xl"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }
              }
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="from-pink-400/20 to-purple-500/30 absolute bottom-20 right-20 h-[30rem] w-[30rem] rounded-full bg-gradient-to-r blur-3xl"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }
              }
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </div>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent dark:from-black/50"
            aria-hidden="true"
          />
        </>
      )}

      {/* Background Image */}
      {variant === 'image' && backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/70"
            aria-hidden="true"
          />
        </>
      )}

      {/* Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          {showBadge && (
            <motion.div
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              variants={itemVariants}
              role="status"
              aria-live="polite"
            >
              <span
                className="bg-green-400 h-2 w-2 animate-pulse rounded-full"
                aria-hidden="true"
              />
              {badgeText}
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            id="hero-title"
            className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/90 dark:text-white/80 sm:text-xl md:text-2xl"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={itemVariants}
          >
            {/* Primary CTA */}
            <Link
              href={ctaHref}
              className="group inline-flex min-w-[200px] transform items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30"
              aria-label={`${ctaText} - Main call to action`}
            >
              {ctaText}
              <svg
                className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            {/* Secondary CTA */}
            {secondaryCtaText && (
              <Link
                href={secondaryCtaHref}
                className="inline-flex min-w-[200px] transform items-center justify-center rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
                aria-label={`${secondaryCtaText} - Secondary action`}
              >
                {secondaryCtaText}
              </Link>
            )}
          </motion.div>

          {/* Trust Indicators */}
          {trustIndicators.length > 0 && (
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-white/80 dark:text-white/70"
              variants={itemVariants}
            >
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-green-400" aria-hidden="true">
                    {indicator.icon}
                  </span>
                  <span className="text-sm sm:text-base">{indicator.text}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Custom Children */}
          {children && (
            <motion.div variants={itemVariants}>{children}</motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transform text-white/60 dark:text-white/40"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, 10, 0],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-label="Scroll down to see more content"
        role="button"
        tabIndex={0}
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

export default HeroSection;
