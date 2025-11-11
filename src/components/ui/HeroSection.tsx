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
    gradient: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-950',
    solid: 'bg-gray-900 dark:bg-black',
    image: 'bg-gray-900',
  };

  return (
    <section
      className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${backgroundStyles[variant]} ${className}`}
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
              className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl"
              animate={shouldReduceMotion ? {} : {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-[30rem] h-[30rem] bg-gradient-to-r from-pink-400/20 to-purple-500/30 rounded-full blur-3xl"
              animate={shouldReduceMotion ? {} : {
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent dark:from-black/50" aria-hidden="true" />
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
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70" aria-hidden="true" />
        </>
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          {showBadge && (
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20 dark:border-white/10"
              variants={itemVariants}
              role="status"
              aria-live="polite"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
              {badgeText}
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            id="hero-title"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-white/90 dark:text-white/80 mb-10 leading-relaxed max-w-3xl mx-auto"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            variants={itemVariants}
          >
            {/* Primary CTA */}
            <Link
              href={ctaHref}
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 hover:bg-gray-50 min-w-[200px]"
              aria-label={`${ctaText} - Main call to action`}
            >
              {ctaText}
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            {/* Secondary CTA */}
            {secondaryCtaText && (
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-white/30 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 min-w-[200px]"
                aria-label={`${secondaryCtaText} - Secondary action`}
              >
                {secondaryCtaText}
              </Link>
            )}
          </motion.div>

          {/* Trust Indicators */}
          {trustIndicators.length > 0 && (
            <motion.div
              className="flex flex-wrap justify-center items-center gap-6 text-white/80 dark:text-white/70"
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
            <motion.div variants={itemVariants}>
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 dark:text-white/40"
        animate={shouldReduceMotion ? {} : {
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-label="Scroll down to see more content"
        role="button"
        tabIndex={0}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}

export default HeroSection;

