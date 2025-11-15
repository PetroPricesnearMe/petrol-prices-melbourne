/**
 * Fluid Layout Examples
 * Demonstrates the new grid, flex, and fluid typography systems
 */

import React from 'react';

// Example 1: Auto-fit Card Grid
export function ProductGrid() {
  const products = [
    { id: 1, name: 'Product 1', price: '$29.99', image: '🎨' },
    { id: 2, name: 'Product 2', price: '$39.99', image: '🎮' },
    { id: 3, name: 'Product 3', price: '$49.99', image: '📱' },
    { id: 4, name: 'Product 4', price: '$59.99', image: '💻' },
    { id: 5, name: 'Product 5', price: '$69.99', image: '⌚' },
    { id: 6, name: 'Product 6', price: '$79.99', image: '🎧' },
  ];

  return (
    <section className="section-spacing bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="stack-lg">
          <header className="stack text-center">
            <h2 className="text-balance text-6xl font-bold text-gray-900 dark:text-white">
              Featured Products
            </h2>
            <p className="text-measure mx-auto text-xl text-gray-600 dark:text-gray-400">
              Discover our hand-picked selection of premium items
            </p>
          </header>

          {/* Auto-fit grid: automatically adjusts columns based on space */}
          <div className="grid-auto-fit-lg">
            {products.map((product) => (
              <div
                key={product.id}
                className="card p-fluid-md stack transition-all duration-300 hover:shadow-xl"
              >
                <div className="text-center text-6xl">{product.image}</div>
                <div className="stack-sm">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {product.price}
                  </p>
                </div>
                <button className="w-full rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Example 2: Hero Section with Fluid Typography
export function FluidHeroSection() {
  return (
    <section className="section-spacing-lg relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />

      <div className="container relative z-10">
        <div className="stack-xl mx-auto max-w-5xl text-center">
          {/* Display size heading - scales 72px → 104px */}
          <h1 className="text-display-lg text-balance font-black leading-none">
            Scale Your Business
            <span className="text-yellow-300 block">To New Heights</span>
          </h1>

          {/* Fluid paragraph - scales smoothly */}
          <p className="text-fluid-xl text-measure mx-auto leading-relaxed text-white/90">
            Join thousands of companies using our platform to accelerate growth,
            streamline operations, and achieve remarkable results.
          </p>

          {/* Responsive button layout */}
          <div className="flex-responsive-center">
            <button className="hover:shadow-3xl rounded-2xl bg-white px-8 py-4 text-lg font-bold text-primary-700 shadow-2xl transition-all duration-300 hover:-translate-y-1">
              Get Started Free
            </button>
            <button className="rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20">
              Watch Demo
            </button>
          </div>

          {/* Stats with responsive flex */}
          <div className="flex-responsive-center pt-fluid-lg">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat, idx) => (
              <div key={idx} className="stack-sm px-8 text-center">
                <div className="text-5xl font-black">{stat.value}</div>
                <div className="text-sm uppercase tracking-wider text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Example 3: Feature Grid with Icons
export function FeatureGrid() {
  const features = [
    {
      id: 1,
      icon: '⚡',
      title: 'Lightning Fast',
      description:
        'Optimized performance ensures your application runs at blazing speeds.',
    },
    {
      id: 2,
      icon: '🔒',
      title: 'Secure by Default',
      description:
        'Enterprise-grade security built into every layer of the platform.',
    },
    {
      id: 3,
      icon: '📊',
      title: 'Analytics Dashboard',
      description:
        'Comprehensive insights to make data-driven decisions with confidence.',
    },
    {
      id: 4,
      icon: '🌍',
      title: 'Global Scale',
      description:
        'Deploy anywhere in the world with our distributed infrastructure.',
    },
    {
      id: 5,
      icon: '🎨',
      title: 'Customizable',
      description:
        'Tailor every aspect to match your brand and workflow perfectly.',
    },
    {
      id: 6,
      icon: '🚀',
      title: 'Continuous Deploy',
      description:
        'Push updates instantly with zero downtime automated deployments.',
    },
  ];

  return (
    <section className="section-spacing">
      <div className="container">
        <div className="stack-xl">
          <header className="stack mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-6xl font-bold text-gray-900 dark:text-white">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features designed to help you build, deploy, and scale
              with ease
            </p>
          </header>

          {/* Card grid with auto-fit */}
          <div className="card-grid">
            {features.map((feature) => (
              <article
                key={feature.id}
                className="card p-fluid-md stack transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-3xl shadow-lg">
                  {feature.icon}
                </div>
                <div className="stack-sm">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Example 4: Blog Article with Optimal Readability
export function BlogArticle() {
  return (
    <article className="section-spacing">
      <div className="content-container">
        <header className="stack-lg pb-fluid-lg border-b border-gray-200 dark:border-gray-800">
          {/* Fluid heading with text balance */}
          <h1 className="text-balance text-6xl font-bold text-gray-900 dark:text-white">
            Building Scalable Web Applications in 2025
          </h1>

          {/* Meta information with responsive flex */}
          <div className="flex-responsive-between text-gray-600 dark:text-gray-400">
            <div className="inline-flex-responsive">
              <span className="font-medium text-gray-900 dark:text-white">
                John Doe
              </span>
              <span>•</span>
              <time dateTime="2025-10-23">October 23, 2025</time>
            </div>
            <span>8 min read</span>
          </div>
        </header>

        {/* Content with vertical rhythm and optimal line length */}
        <div className="content-spacing text-measure text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          <p className="text-2xl font-medium text-gray-900 dark:text-white">
            In today&apos;s fast-paced digital landscape, building scalable web
            applications is more important than ever. Let&apos;s explore the key
            principles and modern techniques.
          </p>

          <h2 className="mt-fluid-lg text-4xl font-bold text-gray-900 dark:text-white">
            Why Scalability Matters
          </h2>

          <p>
            Scalability isn&apos;t just about handling more users—it&apos;s
            about maintaining performance, reliability, and user experience as
            your application grows. A well-architected scalable system can adapt
            to changing demands without requiring complete rewrites.
          </p>

          <p>
            Modern web applications face unique challenges: variable traffic
            patterns, global user bases, and ever-increasing expectations for
            speed and reliability. Building with scalability in mind from day
            one saves countless hours of refactoring later.
          </p>

          <h2 className="mt-fluid-lg text-4xl font-bold text-gray-900 dark:text-white">
            Key Principles
          </h2>

          <ul className="ml-4 list-inside list-disc space-y-2">
            <li>Design for horizontal scaling from the start</li>
            <li>Implement proper caching strategies at every layer</li>
            <li>Use asynchronous processing for heavy tasks</li>
            <li>Monitor and optimize database queries continuously</li>
            <li>Leverage CDNs for static asset delivery</li>
          </ul>

          <blockquote className="rounded-r-lg border-l-4 border-primary-500 bg-gray-50 py-4 pl-6 italic text-gray-900 dark:bg-gray-800 dark:text-white">
            &quot;The best time to think about scalability was yesterday. The
            second best time is now.&quot;
          </blockquote>

          <h2 className="mt-fluid-lg text-4xl font-bold text-gray-900 dark:text-white">
            Modern Architecture Patterns
          </h2>

          <p>
            Today&apos;s scalable applications often employ microservices
            architectures, serverless functions, and edge computing to
            distribute load and improve response times. These patterns allow
            teams to scale specific components independently based on demand.
          </p>

          <div className="p-fluid-md stack rounded-2xl border border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              💡 Pro Tip
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Start with a monolith and extract microservices only when you have
              clear scaling bottlenecks. Premature optimization is real—focus on
              shipping value first.
            </p>
          </div>

          <h2 className="mt-fluid-lg text-4xl font-bold text-gray-900 dark:text-white">
            Conclusion
          </h2>

          <p>
            Building scalable applications requires thoughtful architecture,
            proper tooling, and continuous optimization. By following these
            principles and patterns, you&apos;ll be well-equipped to handle
            growth and deliver exceptional user experiences at any scale.
          </p>
        </div>

        {/* Author card */}
        <footer className="mt-fluid-xl pt-fluid-lg border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 flex-shrink-0 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500" />
            <div className="stack-sm">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                John Doe
              </h3>
              <p className="text-measure text-gray-600 dark:text-gray-400">
                Senior Software Engineer with 10+ years building scalable
                systems. Passionate about performance, architecture, and
                developer experience.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}

// Example 5: Responsive Pricing Cards
export function PricingCards() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      features: [
        'Up to 10 team members',
        '100GB storage',
        'Basic analytics',
        'Email support',
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      features: [
        'Up to 50 team members',
        '1TB storage',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited team members',
        'Unlimited storage',
        'Enterprise analytics',
        '24/7 phone support',
        'Dedicated account manager',
        'Custom SLA',
      ],
      highlighted: false,
    },
  ];

  return (
    <section className="section-spacing-lg bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="stack-xl">
          <header className="stack mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-6xl font-bold text-gray-900 dark:text-white">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Flexible pricing that grows with your business
            </p>
          </header>

          {/* Responsive pricing grid */}
          <div className="grid-auto-fit-lg">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-fluid-md stack-lg relative ${
                  plan.highlighted
                    ? 'scale-105 shadow-2xl ring-4 ring-primary-500'
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-1 text-sm font-bold text-white shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="stack">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="stack-sm text-gray-600 dark:text-gray-400">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="text-xl text-primary-600 dark:text-primary-400">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full rounded-xl px-6 py-4 text-lg font-bold transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:-translate-y-1 hover:shadow-xl'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

          <p className="text-measure mx-auto text-center text-gray-600 dark:text-gray-400">
            All plans include 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}

// Example 6: Testimonial Grid
export function TestimonialGrid() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO, TechCorp',
      content:
        'This platform transformed how we operate. The scalability and performance are unmatched.',
      avatar: '👩‍💼',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'CTO, StartupXYZ',
      content:
        'Best decision we made this year. Our team productivity increased by 300%.',
      avatar: '👨‍💻',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Product Manager, InnovateCo',
      content:
        'The ease of use combined with powerful features is exactly what we needed.',
      avatar: '👩‍🚀',
    },
  ];

  return (
    <section className="section-spacing">
      <div className="container">
        <div className="stack-xl">
          <header className="stack text-center">
            <h2 className="text-balance text-6xl font-bold text-gray-900 dark:text-white">
              Loved by Teams Worldwide
            </h2>
            <p className="text-measure mx-auto text-xl text-gray-600 dark:text-gray-400">
              Don&apos;t just take our word for it
            </p>
          </header>

          <div className="grid-auto-fit-md">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.id}
                className="card p-fluid-md stack transition-all duration-300 hover:shadow-xl"
              >
                <p className="text-lg italic leading-relaxed text-gray-700 dark:text-gray-300">
                  &quot;{testimonial.content}&quot;
                </p>
                <footer className="mt-auto flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div className="stack-sm">
                    <cite className="text-base font-semibold not-italic text-gray-900 dark:text-white">
                      {testimonial.name}
                    </cite>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Main demo component combining all examples
export default function FluidLayoutExamples() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <FluidHeroSection />
      <FeatureGrid />
      <ProductGrid />
      <PricingCards />
      <TestimonialGrid />
      <BlogArticle />
    </div>
  );
}
