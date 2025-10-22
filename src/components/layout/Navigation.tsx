/**
 * Main Navigation Component
 * Modern Next.js navigation with new styling architecture
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn, patterns, animations } from '@/styles/system/css-in-js';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/directory', label: 'Directory' },
  { href: '/fuel-price-trends', label: 'Price Trends' },
  { href: '/station-amenities', label: 'Amenities' },
  { href: '/blog', label: 'Blog' },
  { href: '/how-pricing-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        'sticky top-0 z-sticky bg-white dark:bg-gray-900 print-hidden transition-shadow',
        scrolled && 'shadow-md'
      )}
    >
      <div className={patterns.container()}>
        <div className={patterns.flex.between + ' py-4'}>
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'text-2xl font-bold',
              'text-primary-600 dark:text-primary-400',
              'hover:opacity-80 transition-opacity',
              'focus-primary'
            )}
          >
            <span className="hidden sm:inline">⛽ Petrol Price Near Me</span>
            <span className="sm:hidden">⛽ PPNM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  'focus-primary rounded-md px-3 py-2',
                  pathname === link.href
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                )}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden btn btn-ghost btn-sm"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className={cn(
              'lg:hidden pb-4',
              animations.safe('animate-slide-down')
            )}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 py-2">
                <ThemeToggle showLabel />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
