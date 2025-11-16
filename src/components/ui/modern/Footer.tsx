/**
 * Modern Footer Component
 *
 * Features:
 * - Multi-column layout with newsletter
 * - Social media icons with hover effects
 * - Animated gradient backgrounds
 * - Dark mode optimized
 * - Responsive design
 * - Smooth transitions
 * - WCAG AA compliant
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterProps {
  brand: {
    name: string;
    logo?: string;
    tagline?: string;
  };
  sections: FooterSection[];
  socialLinks?: SocialLink[];
  newsletter?: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  copyright?: string;
  className?: string;
}

// ============================================================================
// NEWSLETTER COMPONENT
// ============================================================================

function NewsletterSection({
  title,
  description,
  placeholder,
  buttonText,
}: {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus('success');
    setEmail('');

    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            className={cn(
              'w-full rounded-xl px-4 py-3',
              'bg-gray-100 dark:bg-gray-800',
              'border-2 border-transparent',
              'focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900',
              'text-gray-900 dark:text-white',
              'placeholder:text-gray-500',
              'transition-all duration-200',
              'outline-none'
            )}
          />
        </div>

        <motion.button
          type="submit"
          disabled={status === 'loading'}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'w-full rounded-xl px-6 py-3 font-semibold',
            'bg-gradient-to-r from-primary-600 to-primary-700',
            'hover:from-primary-700 hover:to-primary-800',
            'text-white shadow-lg hover:shadow-xl',
            'transition-all duration-200',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {status === 'loading'
            ? 'Subscribing...'
            : status === 'success'
              ? '✓ Subscribed!'
              : buttonText}
        </motion.button>
      </form>
    </div>
  );
}

// ============================================================================
// MAIN FOOTER COMPONENT
// ============================================================================

export function Footer({
  brand,
  sections,
  socialLinks,
  newsletter,
  copyright,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        'relative border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900',
        className
      )}
    >
      {/* Gradient Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 blur-3xl" />
        <div className="from-purple-500/10 to-pink-500/10 absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 lg:col-span-4"
          >
            {/* Logo */}
            <Link href="/" className="group inline-flex items-center space-x-3">
              {brand.logo && (
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {brand.logo}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {brand.name}
                </div>
                {brand.tagline && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {brand.tagline}
                  </div>
                )}
              </div>
            </Link>

            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'rounded-xl p-3',
                      'bg-white dark:bg-gray-800',
                      'border border-gray-200 dark:border-gray-700',
                      'hover:border-primary-500 dark:hover:border-primary-500',
                      'text-gray-600 dark:text-gray-400',
                      'hover:text-primary-600 dark:hover:text-primary-400',
                      'transition-all duration-200',
                      'shadow-sm hover:shadow-md'
                    )}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Link Sections */}
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (sectionIndex + 1) * 0.1 }}
              className="lg:col-span-2"
            >
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                    >
                      <span>{link.label}</span>
                      <motion.svg
                        className="ml-1 h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </motion.svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter Section */}
          {newsletter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (sections.length + 1) * 0.1 }}
              className="lg:col-span-4"
            >
              <NewsletterSection {...newsletter} />
            </motion.div>
          )}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-800"
        >
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {copyright ||
                `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`}
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          'fixed bottom-8 right-8 z-50',
          'rounded-full p-4',
          'bg-gradient-to-r from-primary-600 to-primary-700',
          'text-white shadow-2xl',
          'hover:shadow-primary-500/50',
          'transition-all duration-200'
        )}
        aria-label="Scroll to top"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </footer>
  );
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Usage:
 *
 * <Footer
 *   brand={{
 *     name: 'Petrol Price Near Me',
 *     logo: 'P',
 *     tagline: 'Find the cheapest fuel prices'
 *   }}
 *   sections={[
 *     {
 *       title: 'Product',
 *       links: [
 *         { label: 'Find Stations', href: '/directory' },
 *         { label: 'Price Trends', href: '/trends' },
 *         { label: 'Mobile App', href: '/mobile' },
 *       ]
 *     },
 *     {
 *       title: 'Company',
 *       links: [
 *         { label: 'About', href: '/about' },
 *         { label: 'Contact', href: '/contact' },
 *       ]
 *     },
 *   ]}
 *   socialLinks={[
 *     {
 *       name: 'Twitter',
 *       href: 'https://twitter.com',
 *       icon: <TwitterIcon />
 *     },
 *   ]}
 *   newsletter={{
 *     title: 'Stay Updated',
 *     description: 'Get fuel price alerts and savings tips',
 *     placeholder: 'Enter your email',
 *     buttonText: 'Subscribe'
 *   }}
 * />
 */
