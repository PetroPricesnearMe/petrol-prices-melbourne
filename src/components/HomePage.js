import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="home-page">
      <motion.div 
        className="hero-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-background">
          <div className="hero-gradient"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <motion.div className="hero-badge" variants={itemVariants}>
              <span className="badge-icon">🚗</span>
              <span>Live Fuel Prices</span>
            </motion.div>
            
            <motion.h1 className="hero-title" variants={itemVariants}>
              Petrol Prices Near Me
            </motion.h1>
            
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Find the cheapest fuel prices in Melbourne with real-time updates 
              and interactive maps. Save money on every fill-up.
            </motion.p>
            
            <motion.div className="hero-buttons" variants={itemVariants}>
              <Link to="/map" className="btn btn-primary hero-btn">
                <span className="btn-text">Preview Live Map</span>
                <span className="btn-icon">🗺️</span>
              </Link>
              
              <Link to="/directory" className="btn btn-secondary hero-btn">
                <span className="btn-text">Latest Fuel Prices in Melbourne</span>
                <span className="btn-icon">⛽</span>
              </Link>
            </motion.div>
            
            <motion.div className="hero-stats" variants={itemVariants}>
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
            </motion.div>
          </div>
          
          {/* Fuel Nozzle Image */}
          <motion.div 
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
          </motion.div>
        </div>
        
        <div className="hero-scroll-indicator">
          <motion.div 
            className="scroll-dot"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
        </div>
      </motion.div>
      
      <motion.section 
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">🕐</div>
              <h3>Real-Time Updates</h3>
              <p>Get live fuel price updates from petrol stations across Melbourne</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">🎯</div>
              <h3>Location-Based</h3>
              <p>Find the nearest and cheapest petrol stations in your area</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">💰</div>
              <h3>Save Money</h3>
              <p>Compare prices and save on every fuel purchase</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage; 