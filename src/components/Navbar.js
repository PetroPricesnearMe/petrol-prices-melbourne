import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Handle keyboard navigation
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-dropdown')) {
        setServicesOpen(false);
        setUserOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo" aria-label="Home - Melbourne Fuel">
            <span className="logo-icon" aria-hidden="true">⛽</span>
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
              to="/map" 
              className={`nav-link ${isActive('/map')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/map' ? 'page' : undefined}
            >
              Live Map
            </Link>
            <Link 
              to="/directory" 
              className={`nav-link ${isActive('/directory')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/directory' ? 'page' : undefined}
            >
              Directory
            </Link>
            
            {/* Services Dropdown */}
            <div className="nav-dropdown">
              <button 
                className={`nav-link dropdown-toggle ${servicesOpen ? 'active' : ''}`}
                onClick={() => setServicesOpen(!servicesOpen)}
                onKeyDown={(e) => handleKeyDown(e, () => setServicesOpen(!servicesOpen))}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                aria-label="Services menu"
              >
                Services
                <span className="dropdown-arrow" aria-hidden="true">▼</span>
              </button>
              <div 
                className={`dropdown-menu ${servicesOpen ? 'show' : ''}`}
                role="menu"
                aria-label="Services submenu"
              >
                <Link 
                  to="/roadside-assistance" 
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    setServicesOpen(false);
                  }}
                >
                  🚗 Roadside Assistance
                </Link>
                <Link 
                  to="/traffic" 
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    setServicesOpen(false);
                  }}
                >
                  🚦 Traffic
                </Link>
                <Link 
                  to="/car-washes" 
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    setServicesOpen(false);
                  }}
                >
                  🚿 Car Washes
                </Link>
                <Link 
                  to="/truck-stops" 
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    setServicesOpen(false);
                  }}
                >
                  🚛 Truck Stops
                </Link>
                <Link 
                  to="/service-stations" 
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    setServicesOpen(false);
                  }}
                >
                  ⏰ 24 Hour Service Stations
                </Link>
              </div>
            </div>
            
            <Link 
              to="/news" 
              className={`nav-link ${isActive('/news')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/news' ? 'page' : undefined}
            >
              News
            </Link>
            <Link 
              to="/station-brands" 
              className={`nav-link ${isActive('/station-brands')}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/station-brands' ? 'page' : undefined}
            >
              Station Brands
            </Link>
            
            {/* User Dropdown */}
            <div className="nav-dropdown">
              <button 
                className={`nav-link dropdown-toggle ${userOpen ? 'active' : ''}`}
                onClick={() => setUserOpen(!userOpen)}
                onKeyDown={(e) => handleKeyDown(e, () => setUserOpen(!userOpen))}
                aria-expanded={userOpen}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                Account
                <span className="dropdown-arrow" aria-hidden="true">▼</span>
              </button>
              <div 
                className={`dropdown-menu ${userOpen ? 'show' : ''}`}
                role="menu"
                aria-label="Account submenu"
              >
                <Link 
                  to="/sign-in" 
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    setUserOpen(false);
                  }}
                >
                  🔐 Sign In
                </Link>
                <Link 
                  to="/account" 
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    setUserOpen(false);
                  }}
                >
                  👤 My Account
                </Link>
                <Link 
                  to="/become-member" 
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    setUserOpen(false);
                  }}
                >
                  👥 Become a Member
                </Link>
              </div>
            </div>
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