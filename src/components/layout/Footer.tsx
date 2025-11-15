/**
 * Footer Component
 * Responsive footer with navigation links, social icons, contact info
 * Brand consistent design with adaptive multi-column layout
 *
 * @example
 * ```tsx
 * <Footer
 *   logo={<Logo />}
 *   links={footerLinks}
 *   socialLinks={socialLinks}
 *   contactInfo={contactInfo}
 * />
 * ```
 */

'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/layout/ResponsiveGrid';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface FooterProps {
  /** Logo component or text */
  logo?: React.ReactNode;
  /** Link groups (columns) */
  linkGroups?: FooterLinkGroup[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Contact information */
  contactInfo?: ContactInfo;
  /** Copyright text */
  copyright?: string;
  /** Custom className */
  className?: string;
}

// ============================================================================
// DEFAULT SOCIAL ICONS
// ============================================================================

const defaultSocialIcons = {
  facebook: <Facebook className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Responsive footer with brand consistency
 */
export function Footer({
  logo,
  linkGroups = [],
  socialLinks = [],
  contactInfo,
  copyright = `© ${new Date().getFullYear()} Petrol Price Near Me. All rights reserved.`,
  className,
}: FooterProps) {
  // Default link groups if none provided
  const defaultLinkGroups: FooterLinkGroup[] = [
    {
      title: 'Navigation',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Directory', href: '/directory' },
        { label: 'Price Trends', href: '/fuel-price-trends' },
        { label: 'About', href: '/about' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'How It Works', href: '/how-pricing-works' },
        { label: 'Station Amenities', href: '/station-amenities' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ];

  const groups = linkGroups.length > 0 ? linkGroups : defaultLinkGroups;

  return (
    <footer
      className={cn(
        'bg-gray-900 text-gray-300',
        'border-t border-gray-800',
        className
      )}
      role="contentinfo"
      aria-label="Site footer"
    >
      <Container size="xl">
        <div className="py-12 sm:py-16 lg:py-20">
          {/* Main Footer Content */}
          <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {/* Brand Column */}
            <motion.div
              className="sm:col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {logo ? (
                <div className="mb-4">{logo}</div>
              ) : (
                <h3 className="mb-4 text-2xl font-bold text-white">
                  ⛽ Petrol Price Near Me
                </h3>
              )}

              <p className="mb-6 max-w-sm text-sm text-gray-400">
                Find the cheapest petrol prices across Melbourne. Compare
                real-time fuel prices from 250+ stations and save money on every
                fill-up.
              </p>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'h-10 w-10',
                        'flex items-center justify-center',
                        'bg-gray-800 hover:bg-gray-700',
                        'rounded-lg transition-colors duration-200',
                        'focus:outline-none focus:ring-4 focus:ring-primary-500/50',
                        'text-gray-400 hover:text-white',
                        'min-h-[44px] min-w-[44px]' // Touch target
                      )}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Link Groups */}
            {groups.map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className={cn(
                          'text-sm text-gray-400 hover:text-white',
                          'transition-colors duration-200',
                          'rounded focus:outline-none focus:ring-2 focus:ring-primary-500',
                          'inline-block py-1'
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact Column */}
            {contactInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: groups.length * 0.1 }}
              >
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                  Contact
                </h4>
                <ul className="space-y-3">
                  {contactInfo.email && (
                    <li>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className={cn(
                          'flex items-center gap-3 text-sm text-gray-400 hover:text-white',
                          'transition-colors duration-200',
                          'rounded focus:outline-none focus:ring-2 focus:ring-primary-500',
                          'py-1'
                        )}
                        aria-label={`Email us at ${contactInfo.email}`}
                      >
                        <Mail
                          className="h-4 w-4 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="break-all">{contactInfo.email}</span>
                      </a>
                    </li>
                  )}

                  {contactInfo.phone && (
                    <li>
                      <a
                        href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                        className={cn(
                          'flex items-center gap-3 text-sm text-gray-400 hover:text-white',
                          'transition-colors duration-200',
                          'rounded focus:outline-none focus:ring-2 focus:ring-primary-500',
                          'py-1'
                        )}
                        aria-label={`Call us at ${contactInfo.phone}`}
                      >
                        <Phone
                          className="h-4 w-4 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>{contactInfo.phone}</span>
                      </a>
                    </li>
                  )}

                  {contactInfo.address && (
                    <li>
                      <div
                        className={cn(
                          'flex items-start gap-3 text-sm text-gray-400',
                          'py-1'
                        )}
                      >
                        <MapPin
                          className="mt-0.5 h-4 w-4 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>{contactInfo.address}</span>
                      </div>
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Bottom Bar */}
          <motion.div
            className="border-t border-gray-800 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-center text-sm text-gray-500 sm:text-left">
                {copyright}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <Link
                  href="/privacy"
                  className="rounded transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="rounded transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Terms
                </Link>
                <Link
                  href="/contact"
                  className="rounded transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
