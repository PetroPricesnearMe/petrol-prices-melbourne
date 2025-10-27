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

import { fadeInUp, scaleIn, ANIMATION_DURATION, ANIMATION_EASING } from '@/utils/animations';

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
      className={`relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden ${className}`}
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-pink-900/70" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
        )}

        {/* Animated background orbs */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"
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
              className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          {/* Badge */}
          {showBadges && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={badgesVariants}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" aria-hidden="true" />
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
          >
            {title.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              {title.split(' ').slice(-2).join(' ')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial="hidden"
              animate="visible"
              variants={subtitleVariants}
              className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={ctaVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href={primaryCtaLink}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
              aria-label={primaryCtaText}
            >
              {primaryCtaText}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity -z-10" />
            </Link>

            {secondaryCtaText && secondaryCtaLink && (
              <Link
                href={secondaryCtaLink}
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border-2 border-white/30 shadow-lg hover:bg-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
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
                <TrendingDown className="w-5 h-5 text-green-300" aria-hidden="true" />
                <span className="text-sm font-medium">Save up to $50/month</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">250+ Stations</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" aria-hidden="true" />
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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-gray-900" aria-hidden="true" />
    </section>
  );
}

export default EnhancedHeroSection;
