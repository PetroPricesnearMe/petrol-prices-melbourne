/**
 * Footer Component (Organism)
 *
 * Application footer with links and information
 */

import React from 'react';

import { cn } from '@/design-system/utils/styled';
import { useMounted } from '@/hooks/useMounted';
import type { BaseProps } from '@/types/index';

import { Text } from '../../atoms/Text';
import './Footer.css';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps extends BaseProps {
  /** Footer sections with links */
  sections?: FooterSection[];
  /** Copyright text */
  copyright?: string;
  /** Social links */
  socialLinks?: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
  }>;
  /** Additional bottom content */
  bottomContent?: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({
  sections = [],
  copyright,
  socialLinks = [],
  bottomContent,
  className,
  style,
  testId,
}) => {
  const classNames = cn('footer', className);
  const mounted = useMounted();
  const currentYear = mounted ? new Date().getFullYear() : 2025;

  return (
    <footer className={classNames} style={style} data-testid={testId}>
      <div className="footer__container">
        {/* Main footer content */}
        {sections.length > 0 && (
          <div className="footer__sections">
            {sections.map((section, index) => (
              <div key={index} className="footer__section">
                <Text as="h3" variant="label" className="footer__section-title">
                  {section.title}
                </Text>
                <ul className="footer__link-list">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="footer__link-item">
                      <a
                        href={link.href}
                        className="footer__link"
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                      >
                        {link.label}
                        {link.external && (
                          <svg
                            className="footer__link-external-icon"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M11 7.667v3.666a1.167 1.167 0 01-1.167 1.167H2.167A1.167 1.167 0 011 11.333V3.667A1.167 1.167 0 012.167 2.5h3.666M8.75 1h4.083v4.083M5.833 8.167L12.833 1.167"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="footer__social">
            <Text as="h3" variant="label" className="footer__social-title">
              Follow Us
            </Text>
            <div className="footer__social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="footer__social-link"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom section */}
        <div className="footer__bottom">
          {copyright && (
            <Text
              variant="bodySmall"
              color="secondary"
              className="footer__copyright"
            >
              {copyright.replace('{year}', currentYear.toString())}
            </Text>
          )}
          {bottomContent && (
            <div className="footer__bottom-content">{bottomContent}</div>
          )}
        </div>
      </div>
    </footer>
  );
};
