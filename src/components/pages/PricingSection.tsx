/**
 * Pricing Section Component
 *
 * Pricing plans with features and CTAs
 */

'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

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

export function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const plans: PricingPlanProps[] = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for occasional users who want to save money on fuel',
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
    <section ref={ref} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Start saving money on fuel today. All plans include access to live price data and our mobile app.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={cn(
                  'relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2',
                  plan.popular
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-gray-200 dark:border-gray-700'
                )}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl" role="img" aria-label={plan.name}>
                      {plan.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.price}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {plan.period}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.ctaLink}
                  className={cn(
                    'block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4',
                    plan.popular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500/20'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:ring-gray-500/20'
                  )}
                  aria-label={`${plan.ctaText} for ${plan.name} plan`}
                >
                  {plan.ctaText}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
