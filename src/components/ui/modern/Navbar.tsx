/**
 * Modern Navbar Component
 * 
 * Features:
 * - Smooth scroll animations
 * - Glass morphism effect
 * - Mobile-responsive with slide-in menu
 * - Dark mode support
 * - Hover micro-interactions
 * - Accessibility compliant
 */

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

interface NavbarProps {
  brand: {
    name: string;
    logo?: string;
  };
  items: NavItem[];
  cta?: {
    label: string;
    href: string;
  };
  className?: string;
}

// ============================================================================
// MOBILE MENU COMPONENT
// ============================================================================

function MobileMenu({ 
  isOpen, 
  onClose, 
  items, 
  cta 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: NavItem[]; 
  cta?: { label: string; href: string } 
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-40',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6 space-y-8">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {items.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <span className="text-lg font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                      {item.badge}
                    </span>
                  )}
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA Button */}
          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: items.length * 0.05 }}
            >
              <Link
                href={cta.href}
                onClick={onClose}
                className="block w-full px-6 py-4 text-center font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl"
              >
                {cta.label}
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ============================================================================
// MAIN NAVBAR COMPONENT
// ============================================================================

export function Navbar({ brand, items, cta, className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Transform values for scroll animations
  const navbarBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)']
  );

  const navbarBackgroundDark = useTransform(
    scrollY,
    [0, 50],
    ['rgba(17, 24, 39, 0)', 'rgba(17, 24, 39, 0.8)']
  );

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'py-3 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
            : 'py-5',
          className
        )}
        style={{
          backgroundColor: isScrolled ? 'var(--navbar-bg)' : 'transparent',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              {brand.logo ? (
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{brand.logo}</span>
                  </div>
                </div>
              ) : null}
              <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {brand.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {/* Underline animation */}
                  <motion.div
                    className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              ))}
            </div>

            {/* CTA + Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Desktop CTA */}
              {cta && (
                <Link
                  href={cta.href}
                  className="hidden md:inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {cta.label}
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={items}
        cta={cta}
      />
    </>
  );
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Usage:
 * 
 * <Navbar
 *   brand={{ name: 'Petrol Price Near Me', logo: 'P' }}
 *   items={[
 *     { label: 'Directory', href: '/directory' },
 *     { label: 'Map', href: '/map' },
 *     { label: 'Trends', href: '/fuel-price-trends' },
 *     { label: 'FAQ', href: '/faq' },
 *   ]}
 *   cta={{ label: 'Find Stations', href: '/directory' }}
 * />
 */

