/**
 * Modern Navbar Component
 * Sticky, responsive navbar with mobile menu
 * Features smooth animations, active link highlighting, and accessibility
 *
 * @example
 * ```tsx
 * <Navbar
 *   logo={<Logo />}
 *   links={[
 *     { href: '/', label: 'Home' },
 *     { href: '/directory', label: 'Directory' },
 *   ]}
 * />
 * ```
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Container } from '@/components/layout/ResponsiveGrid';
import { Button } from '@/components/ui/primitives/Button';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export interface NavbarProps {
  /** Logo component or text */
  logo?: React.ReactNode;
  /** Navigation links */
  links?: NavLink[];
  /** Show search button */
  showSearch?: boolean;
  /** Search button onClick */
  onSearchClick?: () => void;
  /** CTA button */
  cta?: {
    text: string;
    href: string;
  };
  /** Custom className */
  className?: string;
  /** Sticky navbar */
  sticky?: boolean;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const menuItemVariants = {
  closed: {
    opacity: 0,
    x: -20,
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Modern responsive navbar with mobile menu
 */
export function Navbar({
  logo,
  links = [],
  showSearch = false,
  onSearchClick,
  cta,
  className,
  sticky = true,
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if link is active
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        'w-full bg-white dark:bg-gray-900',
        'border-b border-gray-200 dark:border-gray-800',
        sticky && 'sticky top-0 z-50',
        scrolled && 'shadow-md',
        'transition-shadow duration-200',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <Container size="full" padding={false}>
        <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo ? (
              <Link
                href="/"
                className="flex items-center rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-300"
                aria-label="Home"
              >
                {logo}
              </Link>
            ) : (
              <Link
                href="/"
                className="rounded-lg text-2xl font-bold text-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-primary-400"
                aria-label="Home"
              >
                ⛽ PPNM
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'rounded-lg px-4 py-2',
                  'text-sm font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-4 focus:ring-primary-300',
                  isActiveLink(link.href)
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400'
                )}
                aria-current={isActiveLink(link.href) ? 'page' : undefined}
              >
                <span className="flex items-center gap-2">
                  {link.icon && <span className="h-4 w-4">{link.icon}</span>}
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden items-center gap-4 lg:flex">
            {/* Search Button */}
            {showSearch && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSearchClick}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* CTA Button */}
            {cta && (
              <Link href={cta.href} prefetch>
                <Button variant="primary" size="md">
                  {cta.text}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className={cn(
              'lg:hidden',
              'rounded-lg p-2',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'focus:outline-none focus:ring-4 focus:ring-primary-300',
              'min-h-[44px] min-w-[44px]', // Touch target
              'flex items-center justify-center'
            )}
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-2 px-4 py-6">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'block rounded-lg px-4 py-3',
                        'text-base font-medium transition-all duration-200',
                        'focus:outline-none focus:ring-4 focus:ring-primary-300',
                        isActiveLink(link.href)
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      )}
                      aria-current={
                        isActiveLink(link.href) ? 'page' : undefined
                      }
                    >
                      <span className="flex items-center gap-3">
                        {link.icon && (
                          <span className="h-5 w-5">{link.icon}</span>
                        )}
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile CTA */}
                {cta && (
                  <motion.div
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: links.length * 0.05 }}
                    className="pt-4"
                  >
                    <Link href={cta.href} prefetch>
                      <Button variant="primary" fullWidth size="lg">
                        {cta.text}
                      </Button>
                    </Link>
                  </motion.div>
                )}

                {/* Mobile Search */}
                {showSearch && (
                  <motion.div
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: (links.length + 1) * 0.05 }}
                    className="pt-2"
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      size="lg"
                      leftIcon={<Search className="h-5 w-5" />}
                      onClick={onSearchClick}
                    >
                      Search
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </nav>
  );
}

export default Navbar;
