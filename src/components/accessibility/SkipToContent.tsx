/**
 * Skip to Content Link
 *
 * Provides keyboard users a way to skip repetitive navigation
 * and jump directly to main content.
 *
 * WCAG 2.1 Level A - Bypass Blocks (2.4.1)
 */

'use client';

import { useEffect, useState } from 'react';
import './SkipToContent.css';

interface SkipLink {
  href: string;
  label: string;
}

const defaultSkipLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' },
];

interface SkipToContentProps {
  links?: SkipLink[];
  className?: string;
}

export function SkipToContent({ links = defaultSkipLinks, className = '' }: SkipToContentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if target elements exist
    const validLinks = links.filter(link => {
      const target = document.querySelector(link.href);
      return target !== null;
    });

    if (validLinks.length === 0) {
      console.warn('⚠️ SkipToContent: No valid target elements found. Make sure to add id attributes to your landmark elements.');
    }
  }, [links]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    const target = document.querySelector(href);
    if (target) {
      // Focus the target element
      (target as HTMLElement).focus();

      // If the element isn't naturally focusable, set tabindex
      if (!(target as HTMLElement).hasAttribute('tabindex')) {
        (target as HTMLElement).setAttribute('tabindex', '-1');
      }

      // Scroll to the target smoothly
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Jumped to ${href.replace('#', '')}`;
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    } else {
      console.warn(`SkipToContent: Target element ${href} not found`);
    }
  };

  return (
    <nav
      className={`skip-to-content ${className}`}
      aria-label="Skip links"
      role="navigation"
    >
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-link"
          onClick={(e) => handleClick(e, link.href)}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export default SkipToContent;
