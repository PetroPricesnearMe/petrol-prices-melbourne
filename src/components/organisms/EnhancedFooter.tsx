/**
 * EnhancedFooter Component
 *
 * A world-class footer with:
 * - Multi-column responsive layout
 * - WCAG 2.1 AA accessibility
 * - Dark mode support
 * - Social media integration
 * - Newsletter subscription
 * - Smooth animations
 * - Modern gradients and shadows
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Facebook, Twitter, Instagram, MapPin } from 'lucide-react';
import { type ReactNode } from 'react';

import { useMounted } from '@/hooks/useMounted';

export interface SocialLink {
  name: string;
  href: string;
  icon: ReactNode;
  ariaLabel: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface EnhancedFooterProps {
  /** Footer sections */
  sections?: FooterSection[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Company name */
  companyName?: string;
  /** Company description */
  description?: string;
  /** Copyright text */
  copyright?: string;
  /** Show newsletter signup */
  showNewsletter?: boolean;
  /** Custom className */
  className?: string;
}

const defaultSections: FooterSection[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Directory', href: '/directory' },
      { label: 'Price Trends', href: '/fuel-price-trends' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'How It Works', href: '/how-pricing-works' },
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

const defaultSocialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: <Facebook className="h-5 w-5" />,
    ariaLabel: 'Visit our Facebook page',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: <Twitter className="h-5 w-5" />,
    ariaLabel: 'Follow us on Twitter',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: <Instagram className="h-5 w-5" />,
    ariaLabel: 'Follow us on Instagram',
  },
];

/**
 * EnhancedFooter - Modern footer with animations
 */
export function EnhancedFooter({
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  companyName = 'Fuel Finder',
  description = 'Find the cheapest petrol prices near you with real-time updates.',
  copyright,
  showNewsletter = false,
  className = '',
}: EnhancedFooterProps) {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useMounted();
  const currentYear = mounted ? new Date().getFullYear() : 2025;

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
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
      },
    },
  };

  const finalVariants = shouldReduceMotion ? undefined : containerVariants;

  return (
    <motion.footer
      className={`bg-gradient-to-br from-gray-900 to-gray-800 text-white ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={finalVariants}
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="from-blue-400 to-purple-400 mb-4 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
              {companyName}
            </h3>
            <p className="mb-6 leading-relaxed text-gray-400">{description}</p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-visible:ring-blue-500 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4"
                  aria-label={social.ariaLabel}
                  whileHover={
                    shouldReduceMotion ? undefined : { y: -4, scale: 1.1 }
                  }
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {sections.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="mb-4 font-semibold text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-400 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:underline focus-visible:outline-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter Column */}
          {showNewsletter && (
            <motion.div variants={itemVariants}>
              <h4 className="mb-4 font-semibold text-white">Stay Updated</h4>
              <p className="mb-4 text-sm text-gray-400">
                Subscribe to get updates on price changes.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="focus:ring-blue-500 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="from-blue-500 to-purple-600 focus-visible:ring-blue-500 w-full transform rounded-xl bg-gradient-to-r px-4 py-2 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          )}
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-400 md:text-left">
              {copyright ||
                `© ${currentYear} ${companyName}. All rights reserved.`}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Melbourne, Australia</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default EnhancedFooter;
