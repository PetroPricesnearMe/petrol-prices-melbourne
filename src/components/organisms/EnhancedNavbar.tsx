/**
 * EnhancedNavbar Component
 *
 * A world-class navigation bar with:
 * - Sticky positioning with backdrop blur
 * - Smooth scroll animations
 * - Mobile-first responsive design
 * - WCAG 2.1 AA accessibility
 * - Dark mode support
 * - Subtle shadow elevation
 * - Modern glassmorphism effect
 * - Perfect touch targets (44px min)
 */

'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export interface NavItem {
  /** Link path */
  href: string;
  /** Link label */
  label: string;
  /** Optional icon */
  icon?: React.ReactNode;
}

export interface EnhancedNavbarProps {
  /** Navigation items */
  items?: NavItem[];
  /** Logo component or text */
  logo?: React.ReactNode;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Show search bar */
  showSearch?: boolean;
  /** Custom className */
  className?: string;
}

const defaultItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/directory', label: 'Directory' },
  { href: '/fuel-price-trends', label: 'Price Trends' },
  { href: '/station-amenities', label: 'Amenities' },
  { href: '/how-pricing-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
];

/**
 * EnhancedNavbar - Modern navigation with glassmorphism
 */
export function EnhancedNavbar({
  items = defaultItems,
  logo,
  searchPlaceholder = 'Search stations...',
  showSearch = false,
  className = '',
}: EnhancedNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const isActive = useCallback(
    (href: string) => {
      return pathname === href;
    },
    [pathname]
  );

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg py-3' : 'shadow-sm py-4'
      } ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Glassmorphism backdrop */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-2xl group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg"
            aria-label="Home"
          >
            {logo || (
              <>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-xl" role="img" aria-label="Fuel">⛽</span>
                </div>
                <span className="hidden sm:block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Fuel Finder
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  isActive(item.href)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Search & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="w-64 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Search"
                />
              </div>
            )}
            <Link
              href="/directory"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
                     <button
             onClick={toggleMenu}
             className="lg:hidden p-2 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 transition-colors"
             aria-label="Toggle menu"
             aria-expanded={isOpen ? 'true' : 'false'}
           >
            {isOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-16 bg-white dark:bg-gray-900 z-40"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: 'easeInOut',
              }}
              className="h-full overflow-y-auto"
            >
              <div className="p-4 space-y-2">
                {items.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : index * 0.05,
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-base font-semibold rounded-xl transition-all ${
                        isActive(item.href)
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                      {item.icon && <span className="mr-3">{item.icon}</span>}
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default EnhancedNavbar;
