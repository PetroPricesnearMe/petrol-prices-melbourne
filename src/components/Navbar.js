import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Navbar Component - Fully Responsive with Tailwind CSS
 * Mobile-first navigation with hamburger menu and smooth transitions
 * Touch-friendly interactions and accessibility compliant
 *
 * @component
 */
const Navbar = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef(null);
  const firstLinkRef = useRef(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
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

  // Keyboard navigation and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus first link when menu opens - with proper cleanup
    const timeoutId = setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId); // Properly clear the timeout
    };
  }, [isOpen]);

  const isActive = useCallback(
    (path) => {
      return pathname === path;
    },
    [pathname]
  );

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Navigation links configuration
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/directory', label: 'Directory' },
    { path: '/fuel-price-trends', label: 'Price Trends' },
    { path: '/station-amenities', label: 'Amenities' },
    { path: '/google-places', label: 'Google Search' },
    { path: '/how-pricing-works', label: 'How It Works' },
    { path: '/blog', label: 'Blog' },
    { path: '/faq', label: 'FAQ' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav
      className={`
        sticky top-0 z-50 w-full
        border-b border-gray-200
        bg-white/95 backdrop-blur-xl
        transition-all duration-300
        ${scrolled ? 'shadow-medium py-3' : 'shadow-soft py-4'}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Responsive */}
          <Link
            href="/"
            className="group flex min-h-[44px] items-center space-x-2 transition-transform duration-300 hover:scale-105"
            aria-label="Home - Melbourne Fuel"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-md transition-shadow duration-300 group-hover:shadow-lg sm:h-10 sm:w-10">
              <span className="text-lg sm:text-xl" role="img" aria-label="Fuel">
                ⛽
              </span>
            </div>
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
              Melbourne Fuel
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden items-center space-x-1 lg:flex">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                className={`
                  relative rounded-lg px-4 py-2 text-sm font-semibold
                  transition-all duration-300 hover:-translate-y-0.5
                  ${
                    isActive(path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-primary-50/50 hover:text-primary-600'
                  }
                `}
                aria-current={isActive(path) ? 'page' : undefined}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button - Touch-Friendly */}
          <button
            ref={menuButtonRef}
            onClick={handleToggle}
            className="relative flex h-11 w-11 touch-manipulation flex-col items-center justify-center rounded-xl bg-gray-100 transition-all duration-300 hover:bg-gray-200 active:scale-95 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`
                block h-0.5 w-6 rounded-full bg-gray-900 transition-all duration-300
                ${isOpen ? 'translate-y-2 rotate-45' : 'translate-y-0'}
              `}
            />
            <span
              className={`
                my-1.5 block h-0.5 w-6 rounded-full bg-gray-900 transition-all duration-300
                ${isOpen ? 'opacity-0' : 'opacity-100'}
              `}
            />
            <span
              className={`
                block h-0.5 w-6 rounded-full bg-gray-900 transition-all duration-300
                ${isOpen ? '-translate-y-2 -rotate-45' : 'translate-y-0'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity
          duration-300 lg:hidden
          ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}
        `}
        onClick={handleToggle}
        aria-hidden="true"
      />

      {/* Mobile Menu - Slide from Right */}
      <div
        id="mobile-menu"
        className={`
          shadow-strong ease-out fixed bottom-0 right-0 top-0 z-50 w-[280px]
          overflow-y-auto bg-white transition-transform
          duration-300 sm:w-[320px] lg:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Mobile Menu Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-500 to-secondary-500 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <span className="text-xl" role="img" aria-label="Fuel">
                  ⛽
                </span>
              </div>
              <span className="text-lg font-bold text-white">Menu</span>
            </div>
            <button
              onClick={handleToggle}
              className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 active:scale-95"
              aria-label="Close menu"
            >
              <span className="text-2xl font-light text-white">×</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Links - Touch-Friendly */}
        <div className="py-6">
          {navLinks.map(({ path, label }, index) => (
            <Link
              key={path}
              ref={index === 0 ? firstLinkRef : null}
              href={path}
              onClick={handleLinkClick}
              className={`
                flex min-h-[56px] touch-manipulation items-center justify-between border-l-4 px-6
                py-5 text-base font-semibold transition-all duration-300 active:bg-gray-100
                ${
                  isActive(path)
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-transparent text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-primary-600 active:bg-gray-100'
                }
              `}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isOpen ? 'slideInRight 0.3s ease-out' : 'none',
              }}
              aria-current={isActive(path) ? 'page' : undefined}
            >
              <span>{label}</span>
              {isActive(path) && (
                <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary-500 shadow-sm" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Footer */}
        <div className="sticky bottom-0 mt-auto bg-gradient-to-t from-gray-50 to-transparent p-6">
          <p className="text-center text-xs leading-relaxed text-gray-600">
            Melbourne&apos;s premier fuel price comparison service
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
