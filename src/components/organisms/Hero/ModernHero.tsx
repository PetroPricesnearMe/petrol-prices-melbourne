/**
 * Modern Hero Section Component
 *
 * A visually stunning hero section designed for the petrol station directory.
 * Features smooth animations, modern gradients, and full accessibility compliance.
 *
 * Design Specifications:
 * - Bold, attention-grabbing heading
 * - Informative subtitle
 * - Prominent CTA button
 * - Animated gradient background
 * - Framer Motion animations (fade-in, slide-up)
 * - WCAG 2.1 AA compliant (Lighthouse 100)
 * - Fully responsive mobile design
 *
 * @component
 * @example
 * ```tsx
 * <ModernHero />
 * ```
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin, TrendingDown, Zap } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  fadeIn,
  ANIMATION_DURATION,
  ANIMATION_EASING,
} from '@/utils/animations';

// ============================================================================
// TYPES
// ============================================================================

export interface ModernHeroProps {
  /** Custom heading text */
  heading?: string;
  /** Custom subtitle text */
  subtitle?: string;
  /** Primary CTA button text */
  ctaText?: string;
  /** Primary CTA button link */
  ctaLink?: string;
  /** Custom className */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ModernHero - Modern hero section with animations and accessibility
 *
 * Accessibility Features:
 * - Semantic HTML (header, h1, p, button)
 * - ARIA labels for screen readers
 * - Keyboard navigation support
 * - High contrast text (WCAG AA compliant)
 * - Focus indicators with visible rings
 * - Reduced motion support
 * - Proper heading hierarchy
 */
export function ModernHero({
  heading = 'Find the Cheapest Petrol Prices Near You',
  subtitle = 'Compare real-time fuel prices from 250+ stations across Melbourne. Save money on every fill-up with instant price updates and location-based recommendations.',
  ctaText = 'Explore Stations',
  ctaLink = '/directory',
  className = '',
}: ModernHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants with reduced motion support
  const headingVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : ANIMATION_DURATION.normal,
        ease: ANIMATION_EASING.easeOut,
        delay: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : ANIMATION_DURATION.normal,
        ease: ANIMATION_EASING.easeOut,
        delay: shouldReduceMotion ? 0 : 0.4,
      },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : ANIMATION_DURATION.normal,
        ease: ANIMATION_EASING.easeOut,
        delay: shouldReduceMotion ? 0 : 0.6,
      },
    },
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : ANIMATION_DURATION.slow,
        ease: ANIMATION_EASING.smooth,
      },
    },
  };

  // Animated gradient orbs for background
  const orb1Variants = {
    animate: {
      scale: shouldReduceMotion ? 1 : [1, 1.2, 1],
      opacity: shouldReduceMotion ? 0.3 : [0.3, 0.5, 0.3],
      x: shouldReduceMotion ? 0 : [0, 20, 0],
      y: shouldReduceMotion ? 0 : [0, -20, 0],
    },
    transition: {
      duration: shouldReduceMotion ? 0 : 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  const orb2Variants = {
    animate: {
      scale: shouldReduceMotion ? 1 : [1.2, 1, 1.2],
      opacity: shouldReduceMotion ? 0.2 : [0.2, 0.4, 0.2],
      x: shouldReduceMotion ? 0 : [0, -30, 0],
      y: shouldReduceMotion ? 0 : [0, 30, 0],
    },
    transition: {
      duration: shouldReduceMotion ? 0 : 10,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 1,
    },
  };

  const orb3Variants = {
    animate: {
      scale: shouldReduceMotion ? 1 : [1, 1.3, 1],
      opacity: shouldReduceMotion ? 0.15 : [0.15, 0.35, 0.15],
      x: shouldReduceMotion ? 0 : [0, 15, 0],
      y: shouldReduceMotion ? 0 : [0, 25, 0],
    },
    transition: {
      duration: shouldReduceMotion ? 0 : 12,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 2,
    },
  };

  return (
    <header
      className={cn(
        'relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden',
        'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800',
        'dark:from-primary-900 dark:via-primary-800 dark:to-primary-950',
        className
      )}
      role="banner"
      aria-label="Hero section"
    >
      {/* Animated Background Gradient Layers */}
      <motion.div
        className="absolute inset-0"
        initial="hidden"
        animate="visible"
        variants={backgroundVariants}
        aria-hidden="true"
      >
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/80 to-primary-800/90" />
        
        {/* Additional gradient layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-700/30 to-primary-600/40" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl"
          {...orb1Variants}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-green-400/25 to-emerald-500/25 rounded-full blur-3xl"
          {...orb2Variants}
          aria-hidden="true"
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl"
          {...orb3Variants}
          aria-hidden="true"
        />
      </motion.div>

      {/* Decorative Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNFYySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 sm:mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm sm:text-base font-medium shadow-lg"
            role="status"
            aria-label="Featured badge"
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span>Live Price Updates</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={headingVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight tracking-tight"
          >
            {heading.split(' ').slice(0, -4).join(' ')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300">
              {heading.split(' ').slice(-4).join(' ')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={subtitleVariants}
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={ctaVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href={ctaLink}
              className={cn(
                'group inline-flex items-center justify-center gap-3',
                'px-8 py-4 sm:px-10 sm:py-5',
                'text-base sm:text-lg font-semibold',
                'bg-white text-primary-700',
                'rounded-xl shadow-2xl',
                'hover:bg-gray-50 hover:shadow-3xl',
                'transform hover:scale-105 active:scale-95',
                'transition-all duration-300',
                'focus:outline-none focus:ring-4 focus:ring-white/50',
                'min-h-[56px] sm:min-h-[60px]', // Minimum touch target size
                'w-full sm:w-auto'
              )}
              aria-label={`${ctaText} - Navigate to station directory`}
            >
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              <span>{ctaText}</span>
              <ArrowRight
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: shouldReduceMotion ? 0 : ANIMATION_DURATION.normal,
                  delay: shouldReduceMotion ? 0 : 0.8,
                },
              },
            }}
            className="mt-12 sm:mt-16"
          >
            <ul
              className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-white/80 list-none"
              aria-label="Trust indicators"
            >
              <li className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-green-300" aria-hidden="true" />
                <span className="text-sm sm:text-base font-medium">Save up to 20¢/L</span>
              </li>
              <li className="hidden sm:block w-1 h-1 rounded-full bg-white/40" aria-hidden="true" />
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-300" aria-hidden="true" />
                <span className="text-sm sm:text-base font-medium">250+ Stations</span>
              </li>
              <li className="hidden sm:block w-1 h-1 rounded-full bg-white/40" aria-hidden="true" />
              <li className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300" aria-hidden="true" />
                <span className="text-sm sm:text-base font-medium">Real-Time Prices</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
          aria-hidden="true"
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

// ============================================================================
// EXPORTS
// ============================================================================

export default ModernHero;

