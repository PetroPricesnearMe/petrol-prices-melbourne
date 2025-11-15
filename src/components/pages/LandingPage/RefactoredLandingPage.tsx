/**
 * Refactored Performance-Optimized Landing Page
 *
 * ✅ Modular Architecture
 * ✅ Type-Safe with TypeScript
 * ✅ DRY Principles
 * ✅ Separated Concerns
 * ✅ Reusable Components
 * ✅ Custom Hooks
 * ✅ Optimized Bundle Size
 * ✅ Modern React Patterns
 *
 * @module components/pages/RefactoredLandingPage
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Hooks
import {
  usePerformanceMonitoring,
  useAnimatedSection,
  useStaggerAnimation,
} from './hooks';

// Components
import {
  Button,
  StatusBadge,
  Icon,
  IconFilled,
  SocialIcon,
  Section,
  SectionHeader,
  GridContainer,
} from './components';

// Data & Constants
import {
  FEATURES,
  STATS,
  TRUST_INDICATORS,
  HERO_CONTENT,
  SECTION_HEADINGS,
  FOOTER_LINKS,
  SOCIAL_LINKS,
  FLOATING_CARDS,
  BRAND,
} from './data';
import { ANIMATION_CONFIGS, TYPOGRAPHY, COLORS } from './constants';

// Types
import type { Feature, Stat } from './types';

// ============================================================================
// FEATURE CARD COMPONENT
// ============================================================================

function FeatureCard({
  feature,
  animationConfig,
}: {
  feature: Feature;
  animationConfig: any;
}) {
  return (
    <motion.div
      className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
      {...animationConfig}
      whileHover={ANIMATION_CONFIGS.hoverLift.animate}
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 transition-transform duration-300 group-hover:scale-110">
          <span className="text-2xl" role="img" aria-label={feature.title}>
            {feature.icon}
          </span>
        </div>

        {/* Content */}
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {feature.title}
        </h3>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

function StatCard({
  stat,
  animationConfig,
  index,
}: {
  stat: Stat;
  animationConfig: any;
  index: number;
}) {
  return (
    <motion.div className="text-center" {...animationConfig}>
      <motion.div
        className={cn(TYPOGRAPHY.h2, 'mb-2 text-white')}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
      >
        {stat.value}
      </motion.div>
      <div className="mb-1 font-semibold text-white/90">{stat.label}</div>
      <div className="text-sm text-white/70">{stat.description}</div>
    </motion.div>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  const { ref, isInView } = useAnimatedSection();

  return (
    <Section
      ref={ref}
      background="gradient"
      padding="none"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800/50 to-transparent" />
        <div className="from-yellow-400/20 to-orange-500/20 absolute left-20 top-20 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r blur-3xl" />
        <div
          className="from-pink-400/20 to-purple-500/20 absolute bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r blur-3xl"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Content */}
            <motion.div
              className="text-white"
              initial={ANIMATION_CONFIGS.fadeInLeft.initial}
              animate={isInView ? ANIMATION_CONFIGS.fadeInLeft.animate : {}}
              transition={ANIMATION_CONFIGS.fadeInLeft.transition}
            >
              {/* Badge */}
              <StatusBadge text={HERO_CONTENT.badge} status="success" />

              {/* Main Heading */}
              <motion.h1
                className={cn(TYPOGRAPHY.h1, 'mb-6 mt-6')}
                {...ANIMATION_CONFIGS.fadeInUp}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {HERO_CONTENT.title}{' '}
                <span className="from-yellow-400 to-orange-500 bg-gradient-to-r bg-clip-text text-transparent">
                  {HERO_CONTENT.titleHighlight}
                </span>{' '}
                {HERO_CONTENT.titleEnd}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className={cn(TYPOGRAPHY.subtitle, 'mb-8 text-white/90')}
                {...ANIMATION_CONFIGS.fadeInUp}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {HERO_CONTENT.subtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="mb-8 flex flex-col gap-4 sm:flex-row"
                {...ANIMATION_CONFIGS.fadeInUp}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  href={HERO_CONTENT.cta.primary.href}
                  ariaLabel={HERO_CONTENT.cta.primary.ariaLabel}
                  icon={<Icon name="search" size={20} />}
                  iconPosition="left"
                >
                  {HERO_CONTENT.cta.primary.text}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  href={HERO_CONTENT.cta.secondary.href}
                  ariaLabel={HERO_CONTENT.cta.secondary.ariaLabel}
                  icon={<Icon name="chart" size={20} />}
                  iconPosition="left"
                >
                  {HERO_CONTENT.cta.secondary.text}
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-wrap items-center gap-6 text-white/80"
                {...ANIMATION_CONFIGS.fadeInUp}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {TRUST_INDICATORS.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <IconFilled
                      name="check"
                      className="text-green-400"
                      size={20}
                    />
                    <span className="text-sm">{indicator.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div
              className="relative"
              initial={ANIMATION_CONFIGS.fadeInRight.initial}
              animate={isInView ? ANIMATION_CONFIGS.fadeInRight.animate : {}}
              transition={ANIMATION_CONFIGS.fadeInRight.transition}
            >
              <motion.div
                className="relative h-96 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 shadow-2xl lg:h-[500px]"
                whileHover={ANIMATION_CONFIGS.hoverScale.animate}
                transition={ANIMATION_CONFIGS.hoverScale.transition}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute left-10 top-10 h-32 w-32 animate-pulse rounded-full bg-white/30 blur-3xl" />
                  <div
                    className="absolute bottom-10 right-10 h-40 w-40 animate-pulse rounded-full bg-white/20 blur-3xl"
                    style={{ animationDelay: '1s' }}
                  />
                </div>
              </motion.div>

              {/* Floating Cards */}
              {FLOATING_CARDS.map((card, index) => {
                const isTop = card.position.includes('top');
                const isLeft = card.position.includes('left');
                const positionClasses = `${isTop ? '-top-4' : '-bottom-4'} ${isLeft ? '-left-4' : '-right-4'}`;

                return (
                  <motion.div
                    key={index}
                    className={cn(
                      'absolute rounded-xl bg-white p-4 shadow-lg',
                      positionClasses
                    )}
                    {...(isTop
                      ? ANIMATION_CONFIGS.floatVertical
                      : ANIMATION_CONFIGS.floatVerticalReverse)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          'h-3 w-3 rounded-full',
                          COLORS.status[card.status]
                        )}
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {card.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {card.subtitle}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transform text-white/60"
        {...ANIMATION_CONFIGS.scrollBounce}
        aria-label="Scroll down"
      >
        <Icon name="arrow-down" size={24} />
      </motion.div>
    </Section>
  );
}

// ============================================================================
// FEATURES SECTION
// ============================================================================

function FeaturesSection() {
  const { ref, isInView } = useAnimatedSection();
  const animations = useStaggerAnimation(FEATURES.length);

  return (
    <Section ref={ref} background="white" padding="lg">
      <motion.div
        {...ANIMATION_CONFIGS.fadeInUp}
        animate={isInView ? ANIMATION_CONFIGS.fadeInUp.animate : {}}
      >
        <SectionHeader
          title={SECTION_HEADINGS.features.title}
          description={SECTION_HEADINGS.features.description}
          centered
        />
      </motion.div>

      <GridContainer columns={3}>
        {FEATURES.map((feature, index) => (
          <FeatureCard
            key={index}
            feature={feature}
            animationConfig={{
              ...animations[index],
              animate: isInView ? animations[index].animate : {},
            }}
          />
        ))}
      </GridContainer>
    </Section>
  );
}

// ============================================================================
// STATS SECTION
// ============================================================================

function StatsSection() {
  const { ref, isInView } = useAnimatedSection();
  const animations = useStaggerAnimation(STATS.length);

  return (
    <Section
      background="gradient"
      padding="lg"
      className="relative overflow-hidden"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-secondary-600/50" />

      <div className="relative z-10">
        <motion.div
          {...ANIMATION_CONFIGS.fadeInUp}
          animate={isInView ? ANIMATION_CONFIGS.fadeInUp.animate : {}}
        >
          <SectionHeader
            title={SECTION_HEADINGS.stats.title}
            description={SECTION_HEADINGS.stats.description}
            centered
          />
        </motion.div>

        <GridContainer columns={4} gap="lg">
          {STATS.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              index={index}
              animationConfig={{
                ...animations[index],
                animate: isInView ? animations[index].animate : {},
              }}
            />
          ))}
        </GridContainer>
      </div>
    </Section>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================

function CTASection() {
  const { ref, isInView } = useAnimatedSection();

  return (
    <Section
      background="dark"
      padding="lg"
      className="relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="from-yellow-400/10 to-orange-500/10 absolute left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r blur-3xl" />
        <div
          className="from-pink-400/10 to-purple-500/10 absolute bottom-20 right-20 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r blur-3xl"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          {...ANIMATION_CONFIGS.fadeInUp}
          animate={isInView ? ANIMATION_CONFIGS.fadeInUp.animate : {}}
        >
          <h2 className={cn(TYPOGRAPHY.h2, 'mb-6 text-white')}>
            {SECTION_HEADINGS.cta.title}
          </h2>
          <p
            className={cn(
              TYPOGRAPHY.body,
              'mx-auto mb-8 max-w-2xl text-white/90'
            )}
          >
            {SECTION_HEADINGS.cta.description}
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              href="/directory"
              ariaLabel="Find petrol stations near you"
              icon={<Icon name="search" size={20} />}
            >
              Find Stations Now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/about"
              ariaLabel="Learn more about our service"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ============================================================================
// FOOTER SECTION
// ============================================================================

function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                  <span className="text-lg font-bold text-white">
                    {BRAND.logo}
                  </span>
                </div>
                <span className="text-2xl font-bold">{BRAND.name}</span>
              </div>
              <p className="mb-6 max-w-md text-gray-400">{BRAND.description}</p>
              <div className="flex space-x-4">
                {SOCIAL_LINKS.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 transition-colors hover:text-white"
                    aria-label={social.label}
                  >
                    <SocialIcon name={social.icon as any} size={24} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h3 className="mb-4 text-lg font-semibold capitalize">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-400 transition-colors hover:text-white"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-12 border-t border-gray-800 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 text-sm text-gray-400 md:mb-0">
                {BRAND.copyright}
              </div>
              <div className="flex space-x-6">
                {FOOTER_LINKS.legal.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================================

export function RefactoredLandingPage({ className }: { className?: string }) {
  // Performance monitoring
  usePerformanceMonitoring();

  return (
    <div className={cn('min-h-screen', className)}>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
