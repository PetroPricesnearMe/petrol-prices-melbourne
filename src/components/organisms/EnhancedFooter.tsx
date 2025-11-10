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
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
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
    icon: <Facebook className="w-5 h-5" />,
    ariaLabel: 'Visit our Facebook page',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: <Twitter className="w-5 h-5" />,
    ariaLabel: 'Follow us on Twitter',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: <Instagram className="w-5 h-5" />,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {companyName}
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500"
                  aria-label={social.ariaLabel}
                  whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.1 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:text-white focus-visible:underline"
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
              <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-4 text-sm">
                Subscribe to get updates on price changes.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500"
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
          className="pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {copyright ||
                `© ${currentYear} ${companyName}. All rights reserved.`}
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Melbourne, Australia</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default EnhancedFooter;
