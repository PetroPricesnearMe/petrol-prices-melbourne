import React from 'react';
import { Link } from 'react-router-dom';
import { MotionDiv, MotionH1, MotionP, MotionSection, containerVariants, itemVariants } from './MotionComponents';
import './HomePage.css';

const HomePage = () => {
  // Override stagger timing for homepage
  const heroContainerVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <div className="home-page">
      <MotionDiv 
        className="hero-section"
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-background">
          <div className="hero-gradient"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <MotionDiv className="hero-badge" variants={itemVariants}>
              <span>Live Fuel Prices</span>
            </MotionDiv>
            
            <MotionH1 className="hero-title" variants={itemVariants}>
              Petrol Prices Monitoring
            </MotionH1>
            
            <MotionP className="hero-subtitle" variants={itemVariants}>
              Find the cheapest fuel prices in Melbourne with real-time updates 
              and interactive maps. Save money on every fill-up.
            </MotionP>
            
            <MotionDiv className="hero-buttons" variants={itemVariants}>
              <Link to="/map" className="btn btn-primary hero-btn">
                <span className="btn-text">Preview Live Map</span>
              </Link>
              
              <Link to="/directory" className="btn btn-secondary hero-btn">
                <span className="btn-text">Latest Fuel Prices in Melbourne</span>
              </Link>
            </MotionDiv>
            
            <MotionDiv className="hero-stats" variants={itemVariants}>
              <div className="stat">
                <div className="stat-number">250+</div>
                <div className="stat-label">Petrol Stations</div>
              </div>
              <div className="stat">
                <div className="stat-number">Live</div>
                <div className="stat-label">Price Updates</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Monitoring</div>
              </div>
            </MotionDiv>
          </div>
          
          {/* Fuel Nozzle Image */}
          <MotionDiv 
            className="hero-image-container"
            variants={itemVariants}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="fuel-nozzles-image">
              <img 
                src="/images/fuel-nozzles.jpg" 
                alt="Fuel nozzles at petrol station showing different fuel types - Diesel, 98 Octane, 95 Octane, Unleaded, and 91 Octane"
                className="nozzles-img"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onLoad={(e) => {
                  e.target.style.opacity = '1';
                }}
                onError={(e) => {
                  console.warn('Failed to load fuel-nozzles.jpg image');
                  e.target.style.display = 'none';
                }}
                style={{
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
              <div className="image-overlay">
                <div className="fuel-types">
                  <span className="fuel-type diesel">Diesel</span>
                  <span className="fuel-type octane-98">98 Octane</span>
                  <span className="fuel-type octane-95">95 Octane</span>
                  <span className="fuel-type unleaded">Unleaded</span>
                  <span className="fuel-type octane-91">91 Octane</span>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
        
        <div className="hero-scroll-indicator">
          <MotionDiv 
            className="scroll-dot"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></MotionDiv>
        </div>
      </MotionDiv>
      
      <MotionSection 
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="features-grid">
            <MotionDiv 
              className="feature-card"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">🕐</div>
              <h3>Real-Time Updates</h3>
              <p>Get live fuel price updates from petrol stations across Melbourne</p>
            </MotionDiv>
            
            <MotionDiv 
              className="feature-card"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">🎯</div>
              <h3>Location-Based</h3>
              <p>Find the nearest and cheapest petrol stations in your area</p>
            </MotionDiv>
            
            <MotionDiv 
              className="feature-card"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">💰</div>
              <h3>Save Money</h3>
              <p>Compare prices and save on every fuel purchase</p>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>
    </div>
  );
};

export default HomePage; 