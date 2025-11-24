/**
 * ResponsiveNavigation Component
 * Responsive navigation with mobile menu integration
 * Features:
 * - Desktop navigation
 * - Mobile slide-in menu
 * - Responsive design
 * - Accessibility features
 * - Tailwind CSS styling
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { MobileMenu } from './MobileMenu';

import { cn } from '@/styles/system/css-in-js';

interface ResponsiveNavigationProps {
  className?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

const navigationItems: NavItem[] = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/directory', label: 'Directory', icon: '📋' },
  { href: '/map', label: 'Map View', icon: '🗺️' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
  { href: '/contact', label: 'Contact', icon: '📞' },
];

export function ResponsiveNavigation({ className }: ResponsiveNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed left-0 right-0 top-0 z-50',
        'transition-all duration-300',
        isScrolled
          ? 'border-b border-gray-200 bg-white/95 shadow-lg backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95'
          : 'bg-transparent',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 text-xl font-bold text-gray-900 transition-colors dark:text-white"
          >
            <span className="text-2xl">⛽</span>
            <span>Petrol Prices</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  )}
                >
                  {item.icon && (
                    <span className="text-lg" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Sign In
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default ResponsiveNavigation;
