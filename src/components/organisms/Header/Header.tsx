/**
 * Header Component (Organism)
 * 
 * Application header with navigation and branding
 */

import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import type { BaseProps } from '@/types/index';
import { cn } from '@/design-system/utils/styled';
import './Header.css';

export interface HeaderProps extends BaseProps {
  /** Site logo/brand */
  logo?: React.ReactNode;
  /** Logo text */
  logoText?: string;
  /** Navigation items */
  navItems?: Array<{
    label: string;
    href: string;
    active?: boolean;
    onClick?: (e: React.MouseEvent) => void;
  }>;
  /** Actions (buttons, etc.) */
  actions?: React.ReactNode;
  /** Sticky header */
  sticky?: boolean;
  /** Elevated (with shadow) */
  elevated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  logoText = 'Logo',
  navItems = [],
  actions,
  sticky = false,
  elevated = true,
  className,
  style,
  testId,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const classNames = cn(
    'header',
    sticky && 'header--sticky',
    elevated && 'header--elevated',
    mobileMenuOpen && 'header--mobile-menu-open',
    className
  );

  return (
    <header className={classNames} style={style} data-testid={testId}>
      <div className="header__container">
        {/* Logo/Brand */}
        <a href="/" className="header__brand">
          {logo && <span className="header__logo">{logo}</span>}
          <Text as="span" variant="h6" className="header__logo-text">
            {logoText}
          </Text>
        </a>

        {/* Desktop Navigation */}
        {navItems.length > 0 && (
          <nav className="header__nav" aria-label="Main navigation">
            <ul className="header__nav-list">
              {navItems.map((item, index) => (
                <li key={index} className="header__nav-item">
                  <a
                    href={item.href}
                    className={cn(
                      'header__nav-link',
                      item.active && 'header__nav-link--active'
                    )}
                    onClick={item.onClick}
                    aria-current={item.active ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Actions */}
        {actions && <div className="header__actions">{actions}</div>}

        {/* Mobile Menu Button */}
        {navItems.length > 0 && (
          <button
            type="button"
            className="header__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="header__mobile-toggle-icon">
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12H21M3 6H21M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      {navItems.length > 0 && (
        <div className="header__mobile-menu">
          <nav aria-label="Mobile navigation">
            <ul className="header__mobile-nav-list">
              {navItems.map((item, index) => (
                <li key={index} className="header__mobile-nav-item">
                  <a
                    href={item.href}
                    className={cn(
                      'header__mobile-nav-link',
                      item.active && 'header__mobile-nav-link--active'
                    )}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      item.onClick?.(e);
                    }}
                    aria-current={item.active ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {actions && <div className="header__mobile-actions">{actions}</div>}
        </div>
      )}
    </header>
  );
};

