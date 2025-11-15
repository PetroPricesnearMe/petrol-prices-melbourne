/**
 * Modern Footer Component
 *
 * Responsive footer with multi-column navigation, contact info, social links
 * and adaptive grid layout for optimal performance and user experience
 *
 * Features:
 * - Multi-column responsive layout
 * - Contact information section
 * - Social media links
 * - Newsletter subscription
 * - Accessibility compliant
 * - Dark mode support
 * - Mobile-first design
 */

'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/styles/system/css-in-js';
import './ModernFooter.css';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  color?: string;
}

export interface ModernFooterProps {
  /** Footer sections with navigation links */
  sections?: FooterSection[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Contact information */
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
    businessHours?: string;
  };
  /** Newsletter subscription */
  newsletter?: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
    onSubmit: (email: string) => void;
  };
  /** Copyright text */
  copyright?: string;
  /** Additional CSS classes */
  className?: string;
  /** Logo component */
  logo?: React.ReactNode;
  /** Company description */
  description?: string;
}

export const ModernFooter: React.FC<ModernFooterProps> = ({
  sections = [],
  socialLinks = [],
  contactInfo = {},
  newsletter,
  copyright = '© {year} Petrol Prices Near Me. All rights reserved.',
  className = '',
  logo,
  description = 'Find the cheapest petrol prices near you with real-time updates from 250+ stations across Melbourne.',
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

  return (
    <motion.footer
      className={cn('modern-footer', className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <motion.div className="footer-brand" variants={itemVariants}>
            {logo && <div className="footer-logo">{logo}</div>}
            <h2 className="footer-brand-title">Petrol Prices Near Me</h2>
            <p className="footer-description">{description}</p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="footer-social">
                <h3 className="footer-social-title">Follow Us</h3>
                <div className="footer-social-links">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className="footer-social-link"
                      style={
                        {
                          '--social-color': social.color,
                        } as React.CSSProperties
                      }
                      aria-label={`Follow us on ${social.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Sections */}
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              className="footer-section"
              variants={itemVariants}
            >
              <h3 className="footer-section-title">{section.title}</h3>
              <ul className="footer-links">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="footer-link-item">
                    <a
                      href={link.href}
                      className="footer-link"
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                      {link.external && (
                        <svg
                          className="footer-link-external"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M9.5 3.5v3M9.5 3.5h-3M9.5 3.5L3.5 9.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </a>
                    {link.description && (
                      <p className="footer-link-description">
                        {link.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Information */}
          {(contactInfo.email || contactInfo.phone || contactInfo.address) && (
            <motion.div className="footer-contact" variants={itemVariants}>
              <h3 className="footer-section-title">Contact Us</h3>
              <div className="footer-contact-info">
                {contactInfo.email && (
                  <div className="footer-contact-item">
                    <svg
                      className="footer-contact-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M2.5 4.5h11a1 1 0 011 1v5a1 1 0 01-1 1h-11a1 1 0 01-1-1v-5a1 1 0 011-1z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.5 5.5l4.5 3 4.5-3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="footer-contact-link"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                )}

                {contactInfo.phone && (
                  <div className="footer-contact-item">
                    <svg
                      className="footer-contact-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3.5 1.5h9a1 1 0 011 1v11a1 1 0 01-1 1h-9a1 1 0 01-1-1v-11a1 1 0 011-1z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.5 4.5h3M6.5 6.5h3M6.5 8.5h2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="footer-contact-link"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                )}

                {contactInfo.address && (
                  <div className="footer-contact-item">
                    <svg
                      className="footer-contact-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M8 1.5c-2.5 0-4.5 2-4.5 4.5 0 3.5 4.5 7.5 4.5 7.5s4.5-4 4.5-7.5c0-2.5-2-4.5-4.5-4.5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="8" cy="6" r="1.5" fill="currentColor" />
                    </svg>
                    <span className="footer-contact-text">
                      {contactInfo.address}
                    </span>
                  </div>
                )}

                {contactInfo.businessHours && (
                  <div className="footer-contact-item">
                    <svg
                      className="footer-contact-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="6.5"
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
                    <span className="footer-contact-text">
                      {contactInfo.businessHours}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Newsletter Subscription */}
          {newsletter && (
            <motion.div className="footer-newsletter" variants={itemVariants}>
              <h3 className="footer-section-title">{newsletter.title}</h3>
              <p className="footer-newsletter-description">
                {newsletter.description}
              </p>

              {!subscribed ? (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="footer-newsletter-form"
                >
                  <div className="footer-newsletter-input-group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={newsletter.placeholder}
                      className="footer-newsletter-input"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      className="footer-newsletter-button"
                      disabled={isSubmitting || !email.trim()}
                    >
                      {isSubmitting ? (
                        <svg
                          className="footer-newsletter-spinner"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="6"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            d="M8 2a6 6 0 016 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        newsletter.buttonText
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="footer-newsletter-success">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
            </motion.div>
          )}
        </div>

        {/* Footer Bottom */}
        <motion.div className="footer-bottom" variants={itemVariants}>
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              {copyright.replace('{year}', currentYear.toString())}
            </p>
            <div className="footer-bottom-links">
              <a href="/privacy" className="footer-bottom-link">
                Privacy Policy
              </a>
              <a href="/terms" className="footer-bottom-link">
                Terms of Service
              </a>
              <a href="/cookies" className="footer-bottom-link">
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default ModernFooter;
