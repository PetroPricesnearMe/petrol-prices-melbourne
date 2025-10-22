import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
  const location = useLocation();

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
  }, [location.pathname]);

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

  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);
  
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
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
        bg-white/95 backdrop-blur-xl
        border-b border-gray-200
        transition-all duration-300
        ${scrolled ? 'shadow-medium py-3' : 'shadow-soft py-4'}
      `}
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Responsive */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group transition-transform duration-300 hover:scale-105 min-h-[44px]" 
            aria-label="Home - Melbourne Fuel"
          >
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <span className="text-lg sm:text-xl" role="img" aria-label="Fuel">⛽</span>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent tracking-tight">
              Melbourne Fuel
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`
                  relative px-4 py-2 text-sm font-semibold rounded-lg
                  transition-all duration-300 hover:-translate-y-0.5
                  ${isActive(path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/50'
                  }
                `}
                aria-current={isActive(path) ? 'page' : undefined}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button - Touch-Friendly */}
          <button
            onClick={handleToggle}
            className="lg:hidden relative flex flex-col items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 active:scale-95 touch-manipulation"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`
                block w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300
                ${isOpen ? 'rotate-45 translate-y-2' : 'translate-y-0'}
              `}
            />
            <span
              className={`
                block w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300 my-1.5
                ${isOpen ? 'opacity-0' : 'opacity-100'}
              `}
            />
            <span
              className={`
                block w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300
                ${isOpen ? '-rotate-45 -translate-y-2' : 'translate-y-0'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={handleToggle}
        aria-hidden="true"
      />

      {/* Mobile Menu - Slide from Right */}
      <div
        id="mobile-menu"
        className={`
          lg:hidden fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] z-50
          bg-white shadow-strong overflow-y-auto
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Mobile Menu Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-secondary-500 p-6 shadow-md z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl">
                <span className="text-xl" role="img" aria-label="Fuel">⛽</span>
              </div>
              <span className="text-lg font-bold text-white">Menu</span>
            </div>
            <button
              onClick={handleToggle}
              className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 active:scale-95 touch-manipulation"
              aria-label="Close menu"
            >
              <span className="text-white text-2xl font-light">×</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Links - Touch-Friendly */}
        <div className="py-4">
          {navLinks.map(({ path, label }, index) => (
            <Link
              key={path}
              to={path}
              onClick={handleLinkClick}
              className={`
                flex items-center justify-between px-6 py-4 text-base font-semibold
                transition-all duration-300 border-l-4 min-h-[56px]
                ${isActive(path)
                  ? 'text-primary-600 bg-primary-50 border-primary-500'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 border-transparent hover:border-gray-300'
                }
              `}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isOpen ? 'slideInRight 0.3s ease-out' : 'none'
              }}
              aria-current={isActive(path) ? 'page' : undefined}
            >
              <span>{label}</span>
              {isActive(path) && (
                <span className="flex items-center justify-center w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 to-transparent p-6 mt-auto">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            Melbourne&apos;s premier fuel price comparison service
          </p>
        </div>
      </div>

      <style jsx>{`
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
