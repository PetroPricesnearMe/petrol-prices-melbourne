/**
 * Responsive Footer Component
 *
 * A comprehensive, responsive footer with:
 * - Multi-column navigation sections
 * - Contact information display
 * - Social media links
 * - Adaptive grid layout
 * - Newsletter subscription
 * - Mobile-first responsive design
 *
 * Features:
 * - Responsive grid that adapts from 1 to 4 columns
 * - Staggered entrance animations
 * - Dark mode support
 * - Accessibility compliant (WCAG 2.1 AA)
 * - SEO friendly links
 */

'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/utils';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}

export interface FooterNavigationSection {
  title: string;
  links: FooterLink[];
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  businessHours?: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  ariaLabel?: string;
}

export interface ResponsiveFooterProps {
  /** Company name or logo */
  companyName?: string;
  /** Company description */
  description?: string;
  /** Company logo (React node) */
  logo?: React.ReactNode;
  /** Navigation sections with links */
  navigationSections?: FooterNavigationSection[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Contact information */
  contactInfo?: ContactInfo;
  /** Newsletter subscription configuration */
  newsletter?: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
    onSubmit: (email: string) => void;
  };
  /** Copyright text template (supports {year} placeholder) */
  copyright?: string;
  /** Bottom links */
  bottomLinks?: Array<{ label: string; href: string }>;
  /** Additional CSS classes */
  className?: string;
  /** Enable animations */
  animate?: boolean;
}

export const ResponsiveFooter: React.FC<ResponsiveFooterProps> = ({
  companyName = 'Petrol Prices Near Me',
  description = 'Find the cheapest petrol prices near you with real-time updates from 250+ stations across Melbourne.',
  logo,
  navigationSections = [],
  socialLinks = [],
  contactInfo = {},
  newsletter,
  copyright = '© {year} Petrol Prices Near Me. All rights reserved.',
  bottomLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  className,
  animate = true,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const mounted = useMounted();
  const currentYear = mounted ? new Date().getFullYear() : 2025;

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletter || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await newsletter.onSubmit(email.trim());
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerClass = cn(
    'bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800',
    'text-gray-700 dark:text-gray-300',
    className
  );

  const containerClasses = cn(
    'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    'py-8 sm:py-12 lg:py-16'
  );

  const gridClasses = cn(
    'grid gap-8 sm:gap-10 lg:gap-12',
    // Responsive grid: 1 column on mobile, 2-4 columns on larger screens
    'grid-cols-1',
    'sm:grid-cols-2',
    'lg:grid-cols-3',
    'xl:grid-cols-4'
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const FooterContent = (
    <div className={gridClasses}>
      {/* Brand Section */}
      <div className="flex flex-col space-y-4">
        {logo && (
          <div className="mb-4 text-2xl" aria-hidden="true">
            {logo}
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {companyName}
        </h2>
        <p className="text-sm leading-relaxed">{description}</p>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.ariaLabel || `Follow us on ${social.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:border-primary-300 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-primary-700 dark:hover:text-primary-400"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      {navigationSections.map((section, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a
                  href={link.href}
                  className="group inline-flex items-center gap-1 text-sm text-gray-600 transition-colors duration-200 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                  {link.external && (
                    <svg
                      className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100"
                      fill="none"
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                    >
                      <path
                        d="M9.5 3.5v3m0-3h-3m3 0L3.5 9.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </a>
                {link.description && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
                    {link.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Contact Information */}
      {(contactInfo.email || contactInfo.phone || contactInfo.address) && (
        <div className="flex flex-col space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
            Contact Us
          </h3>
          <div className="space-y-3">
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-start space-x-3 text-sm text-gray-600 transition-colors duration-200 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <rect
                    x="1.5"
                    y="3.5"
                    width="13"
                    height="9"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M2.5 5.5l5.5 3.5 5.5-3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{contactInfo.email}</span>
              </a>
            )}

            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-start space-x-3 text-sm text-gray-600 transition-colors duration-200 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <rect
                    x="2.5"
                    y="1.5"
                    width="11"
                    height="13"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="8" cy="8" r="0.5" fill="currentColor" />
                </svg>
                <span>{contactInfo.phone}</span>
              </a>
            )}

            {contactInfo.address && (
              <div className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    d="M8 1.5c-2.75 0-5 2.25-5 5 0 3.75 5 8.5 5 8.5s5-4.75 5-8.5c0-2.75-2.25-5-5-5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
                <span className="line-clamp-2">{contactInfo.address}</span>
              </div>
            )}

            {contactInfo.businessHours && (
              <div className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 4v4l3 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{contactInfo.businessHours}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Newsletter Subscription */}
      {newsletter && (
        <div className="flex flex-col space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
            {newsletter.title}
          </h3>
          <p className="text-sm leading-relaxed">{newsletter.description}</p>

          {!subscribed ? (
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.placeholder}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800"
                  required
                  disabled={isSubmitting}
                  aria-label="Newsletter email"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="min-h-[44px] rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? '...' : newsletter.buttonText}
                </button>
              </div>
            </form>
          ) : (
            <div className="dark:text-success-400 flex items-center space-x-2 text-sm text-success-600">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  d="M16.667 5L7.5 14.167 3.333 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Thank you for subscribing!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <motion.footer
      className={footerClass}
      variants={animate ? containerVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      whileInView={animate ? 'visible' : undefined}
      viewport={animate ? { once: true, margin: '-100px' } : undefined}
    >
      <div className={containerClasses}>
        {animate ? (
          <motion.div variants={containerVariants}>{FooterContent}</motion.div>
        ) : (
          FooterContent
        )}

        {/* Footer Bottom */}
        <motion.div
          className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800 sm:mt-12 sm:pt-8"
          variants={animate ? itemVariants : undefined}
        >
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 sm:text-left">
              {copyright.replace('{year}', currentYear.toString())}
            </p>
            {bottomLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 sm:justify-end sm:gap-6">
                {bottomLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors duration-200 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default ResponsiveFooter;
