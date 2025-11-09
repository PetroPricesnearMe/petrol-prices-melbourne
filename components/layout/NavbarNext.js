'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useCallback } from 'react';

const NavbarNext = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = useCallback((path) => {
    return pathname === path ? 'active' : '';
  }, [pathname]);
  
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="nav-content">
          <Link href="/" className="nav-logo" aria-label="Home - Melbourne Fuel">
            <span className="logo-text">Melbourne Fuel</span>
          </Link>
          
          <div className={`nav-links ${isOpen ? 'nav-open' : ''}`}>
            <Link 
              href="/" 
              className={`nav-link ${isActive('/')}`}
              onClick={handleLinkClick}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link 
              href="/directory" 
              className={`nav-link ${isActive('/directory')}`}
              onClick={handleLinkClick}
              aria-current={pathname === '/directory' ? 'page' : undefined}
            >
              Directory
            </Link>
            <Link 
              href="/fuel-price-trends" 
              className={`nav-link ${isActive('/fuel-price-trends')}`}
              onClick={handleLinkClick}
              aria-current={pathname === '/fuel-price-trends' ? 'page' : undefined}
            >
              Price Trends
            </Link>
            <Link 
              href="/station-amenities" 
              className={`nav-link ${isActive('/station-amenities')}`}
              onClick={handleLinkClick}
              aria-current={pathname === '/station-amenities' ? 'page' : undefined}
            >
              Amenities
            </Link>
            <Link 
              href="/how-pricing-works" 
              className={`nav-link ${isActive('/how-pricing-works')}`}
              onClick={handleLinkClick}
              aria-current={pathname === '/how-pricing-works' ? 'page' : undefined}
            >
              How It Works
            </Link>
            <Link 
              href="/blog" 
              className={`nav-link ${isActive('/blog')}`}
              onClick={handleLinkClick}
              aria-current={pathname === '/blog' ? 'page' : undefined}
            >
              Blog
            </Link>
            <Link 
              href="/faq" 
              className={`nav-link ${isActive('/faq')}`}
              onClick={handleLinkClick}
              aria-current={pathname === '/faq' ? 'page' : undefined}
            >
              FAQ
            </Link>
            <Link 
              href="/about" 
              className={`nav-link ${isActive('/about')}`}
              onClick={handleLinkClick}
              aria-current={pathname === '/about' ? 'page' : undefined}
            >
              About
            </Link>
          </div>
          
          <button 
            className={`nav-toggle ${isOpen ? 'open' : ''}`}
            onClick={handleToggle}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
});

NavbarNext.displayName = 'NavbarNext';

export default NavbarNext;

