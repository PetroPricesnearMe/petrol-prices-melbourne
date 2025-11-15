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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 shadow-lg' : 'py-4 shadow-sm'
      } ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Glassmorphism backdrop */}
      <div className="absolute inset-0 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="focus-visible:ring-blue-500 group flex items-center gap-3 rounded-lg text-2xl font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2"
            aria-label="Home"
          >
            {logo || (
              <>
                <div className="from-blue-500 to-purple-600 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-shadow group-hover:shadow-xl">
                  <span className="text-xl" role="img" aria-label="Fuel">
                    ⛽
                  </span>
                </div>
                <span className="from-blue-600 to-purple-600 hidden bg-gradient-to-r bg-clip-text text-transparent sm:block">
                  Fuel Finder
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-visible:ring-blue-500 relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
                  isActive(item.href)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Search & CTA */}
          <div className="hidden items-center gap-4 lg:flex">
            {showSearch && (
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="focus:ring-blue-500 w-64 rounded-xl border border-gray-200 bg-gray-100 py-2 pl-10 pr-4 text-gray-900 transition-all focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  aria-label="Search"
                />
              </div>
            )}
            <Link
              href="/directory"
              className="from-blue-500 to-purple-600 focus-visible:ring-blue-500 transform rounded-xl bg-gradient-to-r px-6 py-2 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="focus-visible:ring-blue-500 rounded-xl p-2 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-4 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen ? 'true' : 'false'}
          >
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
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
            className="fixed inset-0 top-16 z-40 bg-white dark:bg-gray-900 lg:hidden"
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
              <div className="space-y-2 p-4">
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
                      className={`flex items-center rounded-xl px-4 py-3 text-base font-semibold transition-all ${
                        isActive(item.href)
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
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
