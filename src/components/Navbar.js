import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

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
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link 
              to="/directory" 
              className={`nav-link ${isActive('/directory')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/directory' ? 'page' : undefined}
            >
              Directory
            </Link>
            <Link 
              to="/fuel-price-trends" 
              className={`nav-link ${isActive('/fuel-price-trends')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/fuel-price-trends' ? 'page' : undefined}
            >
              Price Trends
            </Link>
            <Link 
              to="/station-amenities" 
              className={`nav-link ${isActive('/station-amenities')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/station-amenities' ? 'page' : undefined}
            >
              Amenities
            </Link>
            <Link 
              to="/how-pricing-works" 
              className={`nav-link ${isActive('/how-pricing-works')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/how-pricing-works' ? 'page' : undefined}
            >
              How It Works
            </Link>
            <Link 
              to="/blog" 
              className={`nav-link ${isActive('/blog')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/blog' ? 'page' : undefined}
            >
              Blog
            </Link>
            <Link 
              to="/faq" 
              className={`nav-link ${isActive('/faq')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/faq' ? 'page' : undefined}
            >
              FAQ
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/about' ? 'page' : undefined}
            >
              About
            </Link>
          </div>

          <button 
            className="nav-toggle"
            onClick={() => setIsOpen(!isOpen)}
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
};

export default Navbar; 