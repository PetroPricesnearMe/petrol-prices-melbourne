import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const BlogPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="blog-page">
      <motion.div 
        className="blog-header"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          <motion.h1 className="blog-title" variants={itemVariants}>
            Complete Guide to Finding the Cheapest Petrol Prices in Melbourne in 2024
          </motion.h1>
          <motion.div className="blog-meta" variants={itemVariants}>
            <span className="publish-date">Published: February 8, 2024</span>
            <span className="read-time">⏱️ 8 min read</span>
            <span className="category">📊 Fuel Price Guide</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.article 
        className="blog-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          <motion.section className="blog-section" variants={itemVariants}>
            <h2>Why Melbourne Petrol Prices Vary So Much</h2>
            <p>
              Melbourne petrol prices can fluctuate dramatically throughout the week, sometimes by as much as 20-30 cents per litre. 
              Understanding these variations is crucial for finding the <strong>cheapest petrol prices in Melbourne</strong> and saving money on every fill-up.
            </p>
            <p>
              The main factors affecting <strong>fuel prices near me</strong> include:
            </p>
            <ul>
              <li><strong>Weekly Price Cycles:</strong> Most Melbourne petrol stations follow a predictable weekly pattern</li>
              <li><strong>Brand Competition:</strong> Major brands like Shell, BP, and Caltex compete aggressively</li>
              <li><strong>Location Premium:</strong> CBD and high-traffic areas often have higher prices</li>
              <li><strong>Fuel Type Differences:</strong> Diesel, 91, 95, and 98 octane prices vary significantly</li>
            </ul>
          </motion.section>

          <motion.section className="blog-section" variants={itemVariants}>
            <h2>How to Use Our Live Fuel Price Map</h2>
            <p>
              Our <strong>interactive fuel price map Melbourne</strong> is the most comprehensive tool for finding the cheapest petrol stations. 
              Here's how to get the most out of it:
            </p>
            <div className="feature-highlight">
              <h3>🎯 Key Features:</h3>
              <ul>
                <li><strong>Real-time Updates:</strong> Prices update every 30 minutes</li>
                <li><strong>Multiple Fuel Types:</strong> Compare unleaded, diesel, and premium fuels</li>
                <li><strong>Distance Filtering:</strong> Find stations within your preferred radius</li>
                <li><strong>Price Alerts:</strong> Get notified when prices drop</li>
              </ul>
            </div>
            <p>
              Simply zoom to your area, click on any station marker, and view detailed pricing information. 
              Our <strong>live fuel prices</strong> are sourced directly from station databases and updated continuously.
            </p>
          </motion.section>

          <motion.section className="blog-section" variants={itemVariants}>
            <h2>Top 10 Cheapest Petrol Stations in Melbourne</h2>
            <p>
              Based on our latest data, here are the most affordable <strong>petrol stations Melbourne</strong> has to offer:
            </p>
            <div className="stations-list">
              <div className="station-item">
                <h4>1. United Petroleum - Footscray</h4>
                <p>Average unleaded price: $1.75/L | Diesel: $1.72/L</p>
              </div>
              <div className="station-item">
                <h4>2. Metro Petroleum - Brunswick</h4>
                <p>Average unleaded price: $1.77/L | Diesel: $1.74/L</p>
              </div>
              <div className="station-item">
                <h4>3. 7-Eleven - North Melbourne</h4>
                <p>Average unleaded price: $1.78/L | Diesel: $1.75/L</p>
              </div>
            </div>
            <p>
              <Link to="/directory" className="cta-link">View our complete directory of 250+ Melbourne petrol stations →</Link>
            </p>
          </motion.section>

          <motion.section className="blog-section" variants={itemVariants}>
            <h2>Understanding Different Fuel Types and Prices</h2>
            <p>
              Not all fuels are created equal. Understanding the differences helps you make informed decisions about <strong>fuel price comparison Melbourne</strong>:
            </p>
            <div className="fuel-types-grid">
              <div className="fuel-type-card">
                <h4>⛽ Unleaded 91</h4>
                <p>Standard fuel for most vehicles. Usually the cheapest option.</p>
                <span className="price-range">$1.75 - $1.95/L</span>
              </div>
              <div className="fuel-type-card">
                <h4>🔥 Premium 95</h4>
                <p>Higher octane for performance vehicles. Better fuel economy.</p>
                <span className="price-range">$1.85 - $2.05/L</span>
              </div>
              <div className="fuel-type-card">
                <h4>🏁 Premium 98</h4>
                <p>Highest octane for sports cars and turbo engines.</p>
                <span className="price-range">$1.95 - $2.15/L</span>
              </div>
              <div className="fuel-type-card">
                <h4>🚛 Diesel</h4>
                <p>For diesel vehicles. Often cheaper than unleaded.</p>
                <span className="price-range">$1.70 - $1.90/L</span>
              </div>
            </div>
          </motion.section>

          <motion.section className="blog-section" variants={itemVariants}>
            <h2>Best Times to Buy Petrol in Melbourne</h2>
            <p>
              Timing is everything when it comes to <strong>melbourne petrol prices today</strong>. Here's when to fill up:
            </p>
            <div className="timing-tips">
              <h3>📅 Weekly Price Cycle:</h3>
              <ul>
                <li><strong>Tuesday-Wednesday:</strong> Usually the cheapest days</li>
                <li><strong>Thursday-Sunday:</strong> Prices typically increase</li>
                <li><strong>Monday:</strong> Variable, often mid-range prices</li>
              </ul>
              
              <h3>⏰ Daily Timing:</h3>
              <ul>
                <li><strong>Early Morning (6-8 AM):</strong> Often lower prices</li>
                <li><strong>Lunch Time (12-2 PM):</strong> Peak pricing</li>
                <li><strong>Evening (6-8 PM):</strong> Competitive pricing</li>
              </ul>
            </div>
          </motion.section>

          <motion.section className="blog-section" variants={itemVariants}>
            <h2>Mobile Apps vs. Our Website: Which is Better?</h2>
            <p>
              While mobile apps are convenient, our website offers several advantages for <strong>petrol station finder Melbourne</strong> users:
            </p>
            <div className="comparison-table">
              <div className="comparison-row">
                <div className="feature">Real-time Updates</div>
                <div className="our-site">✅ Every 30 minutes</div>
                <div className="apps">❌ Often delayed</div>
              </div>
              <div className="comparison-row">
                <div className="feature">Interactive Map</div>
                <div className="our-site">✅ Full-screen experience</div>
                <div className="apps">❌ Limited view</div>
              </div>
              <div className="comparison-row">
                <div className="feature">Price History</div>
                <div className="our-site">✅ 30-day trends</div>
                <div className="apps">❌ Limited data</div>
              </div>
              <div className="comparison-row">
                <div className="feature">No App Required</div>
                <div className="our-site">✅ Works on any device</div>
                <div className="apps">❌ App store only</div>
              </div>
            </div>
          </motion.section>

          <motion.section className="blog-section" variants={itemVariants}>
            <h2>Pro Tips for Maximum Savings</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <h4>🎯 Use Our Price Alerts</h4>
                <p>Set up notifications for when prices drop in your area</p>
              </div>
              <div className="tip-card">
                <h4>🗺️ Plan Your Route</h4>
                <p>Use our map to find the cheapest station along your journey</p>
              </div>
              <div className="tip-card">
                <h4>⏰ Time Your Fill-ups</h4>
                <p>Fill up on Tuesday-Wednesday for the best prices</p>
              </div>
              <div className="tip-card">
                <h4>📱 Bookmark Our Site</h4>
                <p>Add to your home screen for quick access</p>
              </div>
            </div>
          </motion.section>

          <motion.section className="blog-section cta-section" variants={itemVariants}>
            <h2>Start Saving on Fuel Today</h2>
            <p>
              Don't overpay for petrol again. Use our <strong>live fuel prices Melbourne</strong> tool to find the cheapest stations near you.
            </p>
            <div className="cta-buttons">
              <Link to="/map" className="btn btn-primary">
                🗺️ View Interactive Map
              </Link>
              <Link to="/directory" className="btn btn-secondary">
                📋 Browse All Stations
              </Link>
            </div>
          </motion.section>
        </div>
      </motion.article>
    </div>
  );
};

export default BlogPage; 