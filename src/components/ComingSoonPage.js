import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ComingSoonPage.css';

const ComingSoonPage = ({ title, description, icon }) => {
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
    <div className="coming-soon-page">
      <motion.div 
        className="coming-soon-hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-background">
          <div className="hero-gradient"></div>
        </div>
        
        <div className="container">
          <div className="coming-soon-content">
            <motion.div className="page-icon" variants={itemVariants}>
              <span className="icon">{icon}</span>
            </motion.div>
            
            <motion.h1 className="page-title" variants={itemVariants}>
              {title}
            </motion.h1>
            
            <motion.div className="coming-soon-badge" variants={itemVariants}>
              <span className="badge-icon">🚧</span>
              <span>Coming Soon</span>
            </motion.div>
            
            <motion.p className="page-description" variants={itemVariants}>
              {description}
            </motion.p>
            
            <motion.div className="coming-soon-actions" variants={itemVariants}>
              <Link to="/" className="btn btn-primary">
                <span className="btn-text">Back to Home</span>
                <span className="btn-icon">🏠</span>
              </Link>
              
              <Link to="/map" className="btn btn-secondary">
                <span className="btn-text">View Live Map</span>
                <span className="btn-icon">🗺️</span>
              </Link>
            </motion.div>
            
            <motion.div className="coming-soon-features" variants={itemVariants}>
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">Fast & Reliable</div>
              </div>
              <div className="feature">
                <div className="feature-icon">📱</div>
                <div className="feature-text">Mobile Friendly</div>
              </div>
              <div className="feature">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">Secure</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoonPage; 