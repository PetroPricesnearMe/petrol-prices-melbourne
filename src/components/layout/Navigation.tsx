/**
 * Main Navigation Component
 * Modern Next.js navigation with new styling architecture
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Keyboard navigation and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus first link when menu opens
    firstLinkRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        'print-hidden sticky top-0 z-sticky bg-white transition-shadow dark:bg-gray-900',
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
              'transition-opacity hover:opacity-80',
              'focus-primary'
            )}
          >
            <span className="hidden sm:inline">⛽ Petrol Price Near Me</span>
            <span className="sm:hidden">⛽ PPNM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  'focus-primary rounded-md px-3 py-2',
                  pathname === link.href
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                )}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button - Touch-Friendly */}
          <button
            ref={menuButtonRef}
            onClick={handleToggle}
            className="btn-ghost btn-sm focus-primary btn min-h-[44px] min-w-[44px] touch-manipulation lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="h-6 w-6"
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
        <div
          id="mobile-menu"
          ref={menuRef}
          className={cn(
            'max-h-[calc(100vh-80px)] overflow-y-auto lg:hidden',
            !isOpen && 'hidden'
          )}
          aria-hidden={!isOpen}
        >
          {isOpen && (
            <div className={cn('pb-4', animations.safe('animate-slide-down'))}>
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    ref={index === 0 ? firstLinkRef : null}
                    href={link.href}
                    className={cn(
                      'block rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      'focus-primary flex min-h-[44px] touch-manipulation items-center',
                      pathname === link.href
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    )}
                    aria-current={pathname === link.href ? 'page' : undefined}
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
      </div>
    </nav>
  );
}

export default Navigation;
