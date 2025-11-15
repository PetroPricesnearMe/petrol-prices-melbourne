/**
 * Enhanced Landing Page Component
 *
 * Conversion-optimized landing page with hero section, feature highlights,
 * testimonials, pricing, and comprehensive footer with Framer Motion animations
 *
 * @module components/pages/EnhancedLandingPage
 */

'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface EnhancedLandingPageProps {
  className?: string;
}

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

interface PricingPlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
  icon: string;
}

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
};

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="from-yellow-400/20 to-orange-500/20 absolute left-20 top-20 h-72 w-72 rounded-full bg-gradient-to-r blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="from-pink-400/20 to-purple-500/20 absolute bottom-20 right-20 h-96 w-96 rounded-full bg-gradient-to-r blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Text Content */}
            <motion.div
              className="text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="bg-green-400 mr-2 h-2 w-2 animate-pulse rounded-full" />
                Live Fuel Prices Available
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Find the{' '}
                <span className="from-yellow-400 to-orange-500 bg-gradient-to-r bg-clip-text text-transparent">
                  Cheapest
                </span>{' '}
                Petrol Prices
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mb-8 text-xl leading-relaxed text-white/90 md:text-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Compare real-time fuel prices from 250+ stations across
                Melbourne. Save money on every fill-up with live unleaded,
                diesel, and premium prices.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="mb-8 flex flex-col gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link
                  href="/directory"
                  className="inline-flex transform items-center justify-center rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/90"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Browse All Stations
                </Link>
                <Link
                  href="/fuel-price-trends"
                  className="inline-flex transform items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  View Price Trends
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-wrap items-center gap-6 text-white/80"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="text-green-400 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="text-green-400 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">No registration required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="text-green-400 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Real-time updates</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Elements */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Main Image */}
              <div className="relative">
                <motion.div
                  className="relative h-96 w-full overflow-hidden rounded-2xl shadow-2xl lg:h-[500px]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/hero-petrol-station.jpg"
                    alt="Petrol Station"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                {/* Floating Price Cards */}
                <motion.div
                  className="absolute -left-4 -top-4 rounded-xl bg-white p-4 shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500 h-3 w-3 rounded-full" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        BP Collins St
                      </div>
                      <div className="text-xs text-gray-600">
                        Unleaded: 189.9¢
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -right-4 rounded-xl bg-white p-4 shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 h-3 w-3 rounded-full" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Shell Richmond
                      </div>
                      <div className="text-xs text-gray-600">
                        Diesel: 195.2¢
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transform text-white/60"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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

// ============================================================================
// FEATURES SECTION COMPONENT
// ============================================================================

function FeaturesSection() {
  const features: FeatureProps[] = [
    {
      icon: '⛽',
      title: 'Live Price Updates',
      description:
        'Get real-time fuel prices updated every few minutes from stations across Melbourne.',
      delay: 0,
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description:
        'Find stations by location, brand, amenities, and more with our advanced filtering system.',
      delay: 0.1,
    },
    {
      icon: '🗺️',
      title: 'Interactive Maps',
      description:
        'Explore stations on interactive maps with clustering and custom markers for easy navigation.',
      delay: 0.2,
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description:
        'Access our platform from any device with our fully responsive and mobile-optimized design.',
      delay: 0.3,
    },
    {
      icon: '🔔',
      title: 'Price Alerts',
      description:
        'Set up notifications for price drops and never miss a great deal on fuel.',
      delay: 0.4,
    },
    {
      icon: '📊',
      title: 'Price Trends',
      description:
        'Track historical price data and trends to find the best times to fill up.',
      delay: 0.5,
    },
  ];

  return (
    <section className="bg-white py-20 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Everything You Need to Save on Fuel
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              Our comprehensive platform provides all the tools you need to find
              the cheapest petrol prices and save money on every fill-up.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-2xl">{feature.icon}</span>
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
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION COMPONENT
// ============================================================================

function TestimonialsSection() {
  const testimonials: TestimonialProps[] = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      company: 'TechCorp',
      content:
        'This app has saved me hundreds of dollars! I check it every morning before heading to work and always find the cheapest prices nearby.',
      avatar: '/images/testimonials/sarah.jpg',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Delivery Driver',
      company: 'FastDelivery',
      content:
        'As someone who drives all day, finding cheap fuel is crucial. This platform makes it so easy to compare prices and plan my routes efficiently.',
      avatar: '/images/testimonials/mike.jpg',
      rating: 5,
    },
    {
      name: 'Emma Wilson',
      role: 'Student',
      company: 'Melbourne University',
      content:
        'Being a student on a budget, every cent counts. This app helps me save money on fuel so I can spend it on more important things.',
      avatar: '/images/testimonials/emma.jpg',
      rating: 5,
    },
  ];

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              What Our Users Say
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              Join thousands of satisfied users who are already saving money on
              fuel every day.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                {/* Rating */}
                <div className="mb-4 flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="text-yellow-400 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <blockquote className="mb-6 italic text-gray-600 dark:text-gray-400">
                  &quot;{testimonial.content}&quot;
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PRICING SECTION COMPONENT
// ============================================================================

function PricingSection() {
  const plans: PricingPlanProps[] = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description:
        'Perfect for occasional users who want to save money on fuel',
      features: [
        'Access to all station prices',
        'Basic search and filters',
        'Mobile app access',
        'Price alerts (5 per month)',
        'Community support',
      ],
      ctaText: 'Get Started Free',
      ctaLink: '/directory',
      icon: '🆓',
    },
    {
      name: 'Pro',
      price: '$4.99',
      period: 'per month',
      description: 'Best for regular commuters who want advanced features',
      features: [
        'Everything in Free',
        'Unlimited price alerts',
        'Advanced analytics',
        'Route optimization',
        'Priority support',
        'Historical price data',
        'Export data to CSV',
      ],
      ctaText: 'Start Pro Trial',
      ctaLink: '/pricing',
      popular: true,
      icon: '⭐',
    },
    {
      name: 'Business',
      price: '$19.99',
      period: 'per month',
      description: 'Ideal for fleet managers and delivery companies',
      features: [
        'Everything in Pro',
        'Multi-user accounts',
        'Fleet management tools',
        'API access',
        'Custom reporting',
        'Dedicated support',
        'White-label options',
      ],
      ctaText: 'Contact Sales',
      ctaLink: '/contact',
      icon: '🏢',
    },
  ];

  return (
    <section className="bg-white py-20 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Choose Your Plan
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              Start saving money on fuel today. All plans include access to live
              price data and our mobile app.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={cn(
                  'relative rounded-2xl border-2 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800',
                  plan.popular
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-gray-200 dark:border-gray-700'
                )}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <span className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
                    <span className="text-2xl">{plan.icon}</span>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 text-center">
                  <div className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {plan.period}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <svg
                        className="text-green-500 mr-3 h-5 w-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.ctaLink}
                  className={cn(
                    'block w-full rounded-xl px-6 py-3 text-center font-semibold transition-all duration-300',
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  )}
                >
                  {plan.ctaText}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS SECTION COMPONENT
// ============================================================================

function StatsSection() {
  const stats = [
    { value: '250+', label: 'Stations', description: 'Across Melbourne' },
    { value: '50+', label: 'Suburbs', description: 'Covered areas' },
    { value: '10K+', label: 'Users', description: 'Active monthly' },
    { value: '24/7', label: 'Updates', description: 'Live price data' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-secondary-600/50" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Trusted by Thousands of Drivers
            </h2>
            <p className="text-xl text-white/90">
              Join the community of smart drivers who save money on fuel every
              day.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="mb-2 text-3xl font-bold text-white md:text-4xl"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <div className="mb-1 font-semibold text-white/90">
                  {stat.label}
                </div>
                <div className="text-sm text-white/70">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION COMPONENT
// ============================================================================

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 py-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="from-yellow-400/10 to-orange-500/10 absolute left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-r blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="from-pink-400/10 to-purple-500/10 absolute bottom-20 right-20 h-80 w-80 rounded-full bg-gradient-to-r blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Ready to Start Saving?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
              Join thousands of drivers who are already saving money on fuel.
              Find the cheapest petrol prices near you in just a few clicks.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/directory"
                className="inline-flex transform items-center justify-center rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/90"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Find Stations Now
              </Link>
              <Link
                href="/about"
                className="inline-flex transform items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

function Footer() {
  const footerLinks = {
    product: [
      { name: 'Find Stations', href: '/directory' },
      { name: 'Price Trends', href: '/fuel-price-trends' },
      { name: 'Mobile App', href: '/mobile' },
      { name: 'API Access', href: '/api' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Community', href: '/community' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                  <span className="text-lg font-bold text-white">P</span>
                </div>
                <span className="text-2xl font-bold">Petrol Price Near Me</span>
              </div>
              <p className="mb-6 max-w-md text-gray-400">
                Find the cheapest petrol prices near you in Melbourne. Compare
                real-time fuel prices from 250+ stations and save money on every
                fill-up.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Sections */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Product</h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link, index) => (
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

            <div>
              <h3 className="mb-4 text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
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

            <div>
              <h3 className="mb-4 text-lg font-semibold">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link, index) => (
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
          </div>

          {/* Bottom Section */}
          <div className="mt-12 border-t border-gray-800 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 text-sm text-gray-400 md:mb-0">
                © 2024 Petrol Price Near Me. All rights reserved.
              </div>
              <div className="flex space-x-6">
                {footerLinks.legal.map((link, index) => (
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
// MAIN ENHANCED LANDING PAGE COMPONENT
// ============================================================================

export function EnhancedLandingPage({ className }: EnhancedLandingPageProps) {
  return (
    <div className={cn('min-h-screen', className)}>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  EnhancedLandingPage,
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
  StatsSection,
  CTASection,
  Footer,
};
export type {
  EnhancedLandingPageProps,
  TestimonialProps,
  PricingPlanProps,
  FeatureProps,
};
