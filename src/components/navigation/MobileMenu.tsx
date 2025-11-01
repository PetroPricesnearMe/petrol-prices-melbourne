/**
 * MobileMenu Component
 * Slide-in mobile menu with hamburger toggle and smooth overlay effects
 * Features:
 * - Smooth slide-in animation
 * - Hamburger toggle with rotation
 * - Overlay with blur effect
 * - Responsive design
 * - Accessibility features
 * - Tailwind transitions
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/styles/system/css-in-js';
import { MobileMenuOverlay } from './MobileMenuOverlay';

interface MobileMenuProps {
  className?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

const navigationItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: '🏠',
    description: 'Find petrol stations near you',
  },
  {
    href: '/directory',
    label: 'Directory',
    icon: '📋',
    description: 'Browse all stations',
  },
  {
    href: '/map',
    label: 'Map View',
    icon: '🗺️',
    description: 'Interactive station map',
  },
  {
    href: '/about',
    label: 'About',
    icon: 'ℹ️',
    description: 'Learn about our service',
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: '📞',
    description: 'Get in touch',
  },
];

export function MobileMenu({ className }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Prevent body scroll when menu is open
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

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsOpen(!isOpen);

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  const closeMenu = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Hamburger Toggle Button */}
      <button
        onClick={toggleMenu}
        className={cn(
          'relative z-50 flex flex-col justify-center items-center',
          'w-10 h-10 rounded-lg',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'shadow-sm hover:shadow-md',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          isOpen && 'bg-gray-50 dark:bg-gray-700'
        )}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {/* Hamburger Lines */}
        <motion.span
          className={cn(
            'block w-5 h-0.5 bg-gray-700 dark:bg-gray-200',
            'transition-all duration-300 ease-in-out',
            'origin-center'
          )}
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : -3,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        <motion.span
          className={cn(
            'block w-5 h-0.5 bg-gray-700 dark:bg-gray-200',
            'transition-all duration-300 ease-in-out',
            'origin-center'
          )}
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        <motion.span
          className={cn(
            'block w-5 h-0.5 bg-gray-700 dark:bg-gray-200',
            'transition-all duration-300 ease-in-out',
            'origin-center'
          )}
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 0 : 3,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </button>

      {/* Overlay */}
      <MobileMenuOverlay isOpen={isOpen} onClose={closeMenu} />

      {/* Slide-in Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
              opacity: { duration: 0.2 }
            }}
            className={cn(
              'fixed top-0 left-0 z-50',
              'w-80 h-full',
              'bg-white dark:bg-gray-900',
              'border-r border-gray-200 dark:border-gray-700',
              'shadow-2xl',
              'overflow-y-auto'
            )}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Menu
              </h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-6 space-y-2">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl',
                        'transition-all duration-200',
                        'hover:bg-gray-50 dark:hover:bg-gray-800',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        isActive && 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                      )}
                    >
                      <span className="text-2xl" aria-hidden="true">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <div className={cn(
                          'font-semibold text-gray-900 dark:text-white',
                          isActive && 'text-blue-600 dark:text-blue-400'
                        )}>
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Menu Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
              <div className="space-y-4">
                {/* User Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <span className="text-lg">👤</span>
                    <span className="font-medium">Sign In</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <span className="text-lg">📧</span>
                    <span className="font-medium">Contact Us</span>
                  </button>
                </div>

                {/* App Info */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>Petrol Price Near Me</p>
                  <p className="mt-1">Version 2.0.0</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileMenu;
