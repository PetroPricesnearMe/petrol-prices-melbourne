import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
// CSS imported in pages/_app.js for Next.js compatibility

const Navbar = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = useCallback((path) => {
    return location.pathname === path ? 'active' : '';
  }, [location.pathname]);
  
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
          <Link to="/" className="nav-logo" aria-label="Home - Melbourne Fuel">
            <span className="logo-text">Melbourne Fuel</span>
          </Link>
          
          <div className={`nav-links ${isOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/')}`}
              onClick={handleLinkClick}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link 
              to="/directory" 
              className={`nav-link ${isActive('/directory')}`}
              onClick={handleLinkClick}
              aria-current={location.pathname === '/directory' ? 'page' : undefined}
            >
              Directory
            </Link>
            <Link 
              to="/fuel-price-trends" 
              className={`nav-link ${isActive('/fuel-price-trends')}`}
              onClick={handleLinkClick}
              aria-current={location.pathname === '/fuel-price-trends' ? 'page' : undefined}
            >
              Price Trends
            </Link>
            <Link 
              to="/station-amenities" 
              className={`nav-link ${isActive('/station-amenities')}`}
              onClick={handleLinkClick}
              aria-current={location.pathname === '/station-amenities' ? 'page' : undefined}
            >
              Amenities
            </Link>
            <Link 
              to="/how-pricing-works" 
              className={`nav-link ${isActive('/how-pricing-works')}`}
              onClick={handleLinkClick}
              aria-current={location.pathname === '/how-pricing-works' ? 'page' : undefined}
            >
              How It Works
            </Link>
            <Link 
              to="/blog" 
              className={`nav-link ${isActive('/blog')}`}
              onClick={handleLinkClick}
              aria-current={location.pathname === '/blog' ? 'page' : undefined}
            >
              Blog
            </Link>
            <Link 
              to="/faq" 
              className={`nav-link ${isActive('/faq')}`}
              onClick={handleLinkClick}
              aria-current={location.pathname === '/faq' ? 'page' : undefined}
            >
              FAQ
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about')}`}
              onClick={handleLinkClick}
              aria-current={location.pathname === '/about' ? 'page' : undefined}
            >
              About
            </Link>
          </div>

          <button 
            className="nav-toggle"
            onClick={handleToggle}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="nav-links"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar; 