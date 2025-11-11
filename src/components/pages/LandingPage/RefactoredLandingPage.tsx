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
import { Button, StatusBadge, Icon, IconFilled, SocialIcon, Section, SectionHeader, GridContainer } from './components';

// Data & Constants
import { FEATURES, STATS, TRUST_INDICATORS, HERO_CONTENT, SECTION_HEADINGS, FOOTER_LINKS, SOCIAL_LINKS, FLOATING_CARDS, BRAND } from './data';
import { ANIMATION_CONFIGS, TYPOGRAPHY, COLORS } from './constants';

// Types
import type { Feature, Stat } from './types';

// ============================================================================
// FEATURE CARD COMPONENT
// ============================================================================

function FeatureCard({ feature, animationConfig }: { feature: Feature; animationConfig: any }) {
  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
      {...animationConfig}
      whileHover={ANIMATION_CONFIGS.hoverLift.animate}
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl" role="img" aria-label={feature.title}>
            {feature.icon}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {feature.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

function StatCard({ stat, animationConfig, index }: { stat: Stat; animationConfig: any; index: number }) {
  return (
    <motion.div className="text-center" {...animationConfig}>
      <motion.div
        className={cn(TYPOGRAPHY.h2, 'text-white mb-2')}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
      >
        {stat.value}
      </motion.div>
      <div className="text-white/90 font-semibold mb-1">{stat.label}</div>
      <div className="text-white/70 text-sm">{stat.description}</div>
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
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800/50 to-transparent" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {HERO_CONTENT.titleHighlight}
                </span>{' '}
                {HERO_CONTENT.titleEnd}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className={cn(TYPOGRAPHY.subtitle, 'text-white/90 mb-8')}
                {...ANIMATION_CONFIGS.fadeInUp}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {HERO_CONTENT.subtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
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
                    <IconFilled name="check" className="text-green-400" size={20} />
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
                className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500"
                whileHover={ANIMATION_CONFIGS.hoverScale.animate}
                transition={ANIMATION_CONFIGS.hoverScale.transition}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
                    className={cn('absolute bg-white rounded-xl p-4 shadow-lg', positionClasses)}
                    {...(isTop ? ANIMATION_CONFIGS.floatVertical : ANIMATION_CONFIGS.floatVerticalReverse)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn('w-3 h-3 rounded-full', COLORS.status[card.status])} />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{card.title}</div>
                        <div className="text-xs text-gray-600">{card.subtitle}</div>
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
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
    <Section background="gradient" padding="lg" className="relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-secondary-600/50" />

      <div className="relative z-10">
        <motion.div {...ANIMATION_CONFIGS.fadeInUp} animate={isInView ? ANIMATION_CONFIGS.fadeInUp.animate : {}}>
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
    <Section background="dark" padding="lg" className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          {...ANIMATION_CONFIGS.fadeInUp}
          animate={isInView ? ANIMATION_CONFIGS.fadeInUp.animate : {}}
        >
          <h2 className={cn(TYPOGRAPHY.h2, 'text-white mb-6')}>
            {SECTION_HEADINGS.cta.title}
          </h2>
          <p className={cn(TYPOGRAPHY.body, 'text-white/90 mb-8 max-w-2xl mx-auto')}>
            {SECTION_HEADINGS.cta.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">{BRAND.logo}</span>
                </div>
                <span className="text-2xl font-bold">{BRAND.name}</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">{BRAND.description}</p>
              <div className="flex space-x-4">
                {SOCIAL_LINKS.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
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
                <h3 className="text-lg font-semibold mb-4 capitalize">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                {BRAND.copyright}
              </div>
              <div className="flex space-x-6">
                {FOOTER_LINKS.legal.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
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

