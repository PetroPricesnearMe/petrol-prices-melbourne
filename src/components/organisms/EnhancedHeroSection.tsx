/**
 * Enhanced HeroSection Component
 *
 * A world-class hero section with:
 * - Fluid responsive design (mobile-first)
 * - WCAG 2.1 AA accessibility compliance
 * - Smooth Framer Motion animations
 * - Dark mode support
 * - Subtle hover effects and transitions
 * - Modern gradient backgrounds
 * - Consistent border-radius (2xl)
 * - Elevated shadows and depth
 * - Perfect color contrast
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';

import { fadeInUp, scaleIn } from '@/utils/animations';

export interface EnhancedHeroSectionProps {
  /** Main heading text */
  title: string;
  /** Subtitle/description text */
  subtitle?: string;
  /** Primary CTA text */
  primaryCtaText?: string;
  /** Primary CTA link */
  primaryCtaLink?: string;
  /** Secondary CTA text */
  secondaryCtaText?: string;
  /** Secondary CTA link */
  secondaryCtaLink?: string;
  /** Background image URL */
  backgroundImage?: string;
  /** Show animated badges/stats */
  showBadges?: boolean;
  /** Custom className */
  className?: string;
  /** Custom content/children */
  children?: ReactNode;
}

/**
 * EnhancedHeroSection - Modern, accessible hero with animations
 */
export function EnhancedHeroSection({
  title,
  subtitle,
  primaryCtaText = 'Find Stations',
  primaryCtaLink = '/directory',
  secondaryCtaText = 'Learn More',
  secondaryCtaLink = '/how-pricing-works',
  backgroundImage,
  showBadges = true,
  className = '',
  children,
}: EnhancedHeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const headingVariants = fadeInUp;
  const subtitleVariants = {
    ...fadeInUp,
    visible: {
      ...fadeInUp.visible,
      transition: { ...fadeInUp.visible.transition, delay: 0.2 },
    },
  };
  const ctaVariants = scaleIn;
  const badgesVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: 0.4,
      },
    },
  };

  return (
    <section
      className={`relative flex min-h-[80vh] items-center justify-center overflow-hidden md:min-h-screen ${className}`}
      role="banner"
      aria-label="Hero section"
    >
      {/* Background with Gradient */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={backgroundImage}
                alt=""
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
            <div className="from-blue-900/90 via-purple-900/80 to-pink-900/70 absolute inset-0 bg-gradient-to-br" />
          </>
        ) : (
          <div className="from-blue-600 via-purple-600 to-pink-600 absolute inset-0 bg-gradient-to-br" />
        )}

        {/* Animated background orbs */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="bg-yellow-400/20 absolute left-20 top-20 h-72 w-72 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              aria-hidden="true"
            />
            <motion.div
              className="bg-pink-400/20 absolute bottom-20 right-20 h-96 w-96 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.2, 0.4],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              aria-hidden="true"
            />
          </>
        )}

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          {showBadges && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={badgesVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-lg backdrop-blur-md"
            >
              <Sparkles
                className="text-yellow-300 h-4 w-4"
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-white">
                Real-time fuel prices updated daily
              </span>
            </motion.div>
          )}

          {/* Main Heading */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={headingVariants}
            className="mb-6 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {title.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="from-yellow-300 via-orange-400 to-pink-400 bg-gradient-to-r bg-clip-text text-transparent">
              {title.split(' ').slice(-2).join(' ')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial="hidden"
              animate="visible"
              variants={subtitleVariants}
              className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-200 sm:text-xl md:text-2xl"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={ctaVariants}
            className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href={primaryCtaLink}
              className="text-blue-700 focus-visible:ring-yellow-300 focus-visible:ring-offset-blue-600 group relative inline-flex transform items-center justify-center rounded-2xl bg-white px-8 py-4 font-bold shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2"
              aria-label={primaryCtaText}
            >
              {primaryCtaText}
              <ArrowRight
                className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
              <span className="from-yellow-300 to-orange-300 absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>

            {secondaryCtaText && secondaryCtaLink && (
              <Link
                href={secondaryCtaLink}
                className="inline-flex items-center justify-center rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                aria-label={secondaryCtaText}
              >
                {secondaryCtaText}
              </Link>
            )}
          </motion.div>

          {/* Stats/Badges */}
          {showBadges && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={badgesVariants}
              className="flex flex-wrap items-center justify-center gap-6 text-white"
            >
              <div className="flex items-center gap-2">
                <TrendingDown
                  className="text-green-300 h-5 w-5"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium">
                  Save up to $50/month
                </span>
              </div>
              <div
                className="hidden h-1 w-1 rounded-full bg-white/40 sm:block"
                aria-hidden="true"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">250+ Stations</span>
              </div>
              <div
                className="hidden h-1 w-1 rounded-full bg-white/40 sm:block"
                aria-hidden="true"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Real-time Prices</span>
              </div>
            </motion.div>
          )}

          {/* Custom content */}
          {children}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-gray-900"
        aria-hidden="true"
      />
    </section>
  );
}

export default EnhancedHeroSection;
