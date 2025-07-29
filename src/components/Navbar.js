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