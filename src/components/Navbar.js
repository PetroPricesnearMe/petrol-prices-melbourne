import React, { useState } from 'react';
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

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">⛽</span>
            <span className="logo-text">Melbourne Fuel</span>
          </Link>
          
          <div className={`nav-links ${isOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/')}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/map" 
              className={`nav-link ${isActive('/map')}`}
              onClick={() => setIsOpen(false)}
            >
              Live Map
            </Link>
            <Link 
              to="/directory" 
              className={`nav-link ${isActive('/directory')}`}
              onClick={() => setIsOpen(false)}
            >
              Directory
            </Link>
            
            {/* Services Dropdown */}
            <div className="nav-dropdown">
              <button 
                className={`nav-link dropdown-toggle ${servicesOpen ? 'active' : ''}`}
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className={`dropdown-menu ${servicesOpen ? 'show' : ''}`}>
                <Link 
                  to="/roadside-assistance" 
                  className="dropdown-item"
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
            >
              News
            </Link>
            <Link 
              to="/station-brands" 
              className={`nav-link ${isActive('/station-brands')}`}
              onClick={() => setIsOpen(false)}
            >
              Station Brands
            </Link>
            
            {/* User Dropdown */}
            <div className="nav-dropdown">
              <button 
                className={`nav-link dropdown-toggle ${userOpen ? 'active' : ''}`}
                onClick={() => setUserOpen(!userOpen)}
              >
                Account
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className={`dropdown-menu ${userOpen ? 'show' : ''}`}>
                <Link 
                  to="/sign-in" 
                  className="dropdown-item"
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
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 