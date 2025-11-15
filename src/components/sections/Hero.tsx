/**
 * Hero Section Component
 * Responsive hero with clear typography hierarchy, high-contrast CTA,
 * and smooth fade-in animations via Framer Motion
 *
 * @example
 * ```tsx
 * <Hero
 *   title="Find the Cheapest Petrol Near You"
 *   subtitle="Compare prices from 250+ stations"
 *   description="Save money on every fill-up with real-time fuel prices"
 *   ctaText="Search Stations"
 *   ctaHref="/directory"
 * />
 * ```
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/layout/ResponsiveGrid';
import { Button } from '@/components/ui/primitives/Button';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface HeroProps {
  /** Main heading (h1) */
  title: string;
  /** Subheading (h2) */
  subtitle?: string;
  /** Description paragraph */
  description?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA button href */
  ctaHref?: string;
  /** Secondary CTA text */
  secondaryCtaText?: string;
  /** Secondary CTA href */
  secondaryCtaHref?: string;
  /** Background variant */
  variant?: 'default' | 'gradient' | 'image' | 'minimal';
  /** Background image URL (for image variant) */
  backgroundImage?: string;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Custom className */
  className?: string;
  /** Show search bar */
  showSearch?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth animation
    },
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Hero Section with animations and responsive design
 */
export function Hero({
  title,
  subtitle,
  description,
  ctaText = 'Get Started',
  ctaHref = '/directory',
  secondaryCtaText,
  secondaryCtaHref,
  variant = 'gradient',
  backgroundImage,
  overlayOpacity = 0.4,
  className,
  showSearch = false,
  searchPlaceholder = 'Search stations, suburbs, or postcodes...',
}: HeroProps) {
  // Background styles based on variant
  const backgroundStyles = {
    default: 'bg-white dark:bg-gray-900',
    gradient:
      'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800',
    image: backgroundImage
      ? `bg-cover bg-center bg-no-repeat`
      : 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800',
    minimal: 'bg-gray-50 dark:bg-gray-800',
  };

  const textColorStyles = {
    default: 'text-gray-900 dark:text-white',
    gradient: 'text-white',
    image: 'text-white',
    minimal: 'text-gray-900 dark:text-white',
  };

  return (
    <section
      className={cn(
        'relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh]',
        'flex items-center justify-center',
        'overflow-hidden',
        backgroundStyles[variant],
        className
      )}
      style={
        variant === 'image' && backgroundImage
          ? ({
              backgroundImage: `url(${backgroundImage})`,
            } as React.CSSProperties)
          : undefined
      }
      aria-label="Hero section"
    >
      {/* Overlay for image variant */}
      {variant === 'image' && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity } as React.CSSProperties}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <Container size="xl" className="relative z-10">
        <motion.div
          className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title (h1) */}
          <motion.h1
            className={cn(
              'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
              'font-bold leading-tight tracking-tight',
              'mb-4 sm:mb-6',
              textColorStyles[variant]
            )}
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          {/* Subtitle (h2) */}
          {subtitle && (
            <motion.h2
              className={cn(
                'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
                'font-semibold leading-relaxed',
                'mb-4 sm:mb-6',
                variant === 'gradient' || variant === 'image'
                  ? 'text-white/90'
                  : 'text-gray-700 dark:text-gray-300'
              )}
              variants={itemVariants}
            >
              {subtitle}
            </motion.h2>
          )}

          {/* Description (p) */}
          {description && (
            <motion.p
              className={cn(
                'text-base sm:text-lg md:text-xl lg:text-2xl',
                'mx-auto max-w-3xl leading-relaxed',
                'mb-8 sm:mb-10 lg:mb-12',
                variant === 'gradient' || variant === 'image'
                  ? 'text-white/90'
                  : 'text-gray-600 dark:text-gray-400'
              )}
              variants={itemVariants}
            >
              {description}
            </motion.p>
          )}

          {/* Search Bar (optional) */}
          {showSearch && (
            <motion.div
              className="mx-auto mb-8 max-w-2xl sm:mb-10"
              variants={itemVariants}
            >
              <div className="relative">
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  className={cn(
                    'w-full px-6 py-4 pl-14',
                    'rounded-xl text-lg',
                    'bg-white/95 dark:bg-gray-900/95',
                    'text-gray-900 dark:text-white',
                    'border-2 border-gray-200 dark:border-gray-700',
                    'focus:outline-none focus:ring-4',
                    variant === 'gradient' || variant === 'image'
                      ? 'focus:border-white focus:ring-white/50'
                      : 'focus:border-primary-500 focus:ring-primary-300',
                    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                    'shadow-xl',
                    'min-h-[60px]' // Touch-friendly
                  )}
                  aria-label="Search for petrol stations"
                />
                <Search
                  className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2',
                    'h-6 w-6',
                    variant === 'gradient' || variant === 'image'
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  )}
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
            variants={itemVariants}
          >
            {/* Primary CTA */}
            {ctaText && (
              <Link href={ctaHref} prefetch>
                <Button
                  variant={
                    variant === 'gradient' || variant === 'image'
                      ? 'outlined'
                      : 'primary'
                  }
                  size="lg"
                  className={cn(
                    'min-w-[200px]',
                    variant === 'gradient' || variant === 'image'
                      ? 'border-2 border-white bg-white text-primary-600 hover:bg-gray-50'
                      : ''
                  )}
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  {ctaText}
                </Button>
              </Link>
            )}

            {/* Secondary CTA */}
            {secondaryCtaText && secondaryCtaHref && (
              <Link href={secondaryCtaHref} prefetch>
                <Button
                  variant={
                    variant === 'gradient' || variant === 'image'
                      ? 'ghost'
                      : 'outlined'
                  }
                  size="lg"
                  className={cn(
                    'min-w-[200px]',
                    variant === 'gradient' || variant === 'image'
                      ? 'border-white text-white hover:bg-white/10'
                      : ''
                  )}
                >
                  {secondaryCtaText}
                </Button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </Container>

      {/* Decorative elements (optional) */}
      {variant === 'gradient' && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
      )}
    </section>
  );
}

export default Hero;
