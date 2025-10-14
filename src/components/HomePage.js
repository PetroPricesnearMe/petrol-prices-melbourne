import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MotionDiv, MotionH1, MotionP, MotionSection, containerVariants, itemVariants } from './MotionComponents';
// import RegionSelector from './RegionSelector'; // Unused - keeping for future toggle functionality
import SEO from './SEO';
import { trackPageView } from '../utils/analytics';
import './HomePage.css';

const HomePage = () => {
  // const [viewMode, setViewMode] = useState('map'); // 'map' or 'cards' - unused for now

  // Track page view on mount
  useEffect(() => {
    trackPageView('Home');
  }, []);

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

  // Structured data for homepage
  const homepageStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Petrol Prices Near Me",
      "url": "https://www.petrolpricesnearme.com.au",
      "description": "Find the cheapest petrol prices in Melbourne with real-time fuel price updates from 250+ stations",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.petrolpricesnearme.com.au/directory?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Petrol Prices Near Me",
      "description": "Melbourne's premier fuel price comparison service",
      "areaServed": {
        "@type": "City",
        "name": "Melbourne",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Melbourne",
          "addressRegion": "VIC",
          "addressCountry": "AU"
        }
      },
      "priceRange": "$$"
    }
  ];

  return (
    <>
      <SEO
        title="Petrol Prices Near Me - Find Cheapest Fuel in Melbourne | Live Updates"
        description="Find the cheapest petrol prices in Melbourne with real-time fuel price updates. Compare prices from 250+ stations across Melbourne regions. Save money on every fill-up."
        keywords="petrol prices melbourne, fuel prices melbourne, cheapest petrol, petrol stations near me, live fuel prices, melbourne petrol, fuel comparison"
        canonical="/"
        structuredData={homepageStructuredData}
      />
      <main className="home-page">
        <MotionDiv
          className="hero-section"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          role="banner"
          aria-label="Hero section"
        >
          <div className="hero-background">
            <div className="hero-gradient"></div>
          </div>

          <div className="container">
            <header className="hero-content">
              <MotionDiv className="hero-badge" variants={itemVariants}>
                <span>Live Fuel Prices</span>
              </MotionDiv>

              <MotionH1 className="hero-title" variants={itemVariants}>
                Melbourne Petrol Prices - Find Cheapest Fuel Near You
              </MotionH1>

              <MotionP className="hero-subtitle" variants={itemVariants}>
                Find the cheapest fuel prices in Melbourne with real-time updates
                and interactive maps. Save money on every fill-up.
              </MotionP>

              <MotionDiv className="hero-buttons" variants={itemVariants}>
                <a href="#regions" className="btn btn-primary hero-btn">
                  <span className="btn-text">Browse by Region</span>
                </a>

                <Link to="/directory" className="btn btn-secondary hero-btn">
                  <span className="btn-text">View All Stations</span>
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
            </header>

            {/* Fuel Nozzle Image */}
            <MotionDiv
              className="hero-image-container"
              variants={itemVariants}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <figure className="fuel-nozzles-image">
                <img
                  src="/images/fuel-nozzles.svg"
                  alt="Fuel nozzles at petrol station showing different fuel types - Diesel, 98 Octane, 95 Octane, Unleaded, and 91 Octane"
                  className="nozzles-img"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  onLoad={(e) => {
                    e.target.style.opacity = '1';
                  }}
                  onError={(e) => {
                    console.warn('Failed to load fuel-nozzles image');
                    e.target.style.display = 'none';
                  }}
                  style={{
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                />
                <figcaption className="image-overlay">
                  <div className="fuel-types">
                    <span className="fuel-type diesel">Diesel</span>
                    <span className="fuel-type octane-98">98 Octane</span>
                    <span className="fuel-type octane-95">95 Octane</span>
                    <span className="fuel-type unleaded">Unleaded</span>
                    <span className="fuel-type octane-91">91 Octane</span>
                  </div>
                </figcaption>
              </figure>
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

        {/* Optional: Toggle between map and card view */}
        {/* Uncomment below to show both with toggle */}
        {/*
        <div className="view-toggle-container">
          <button
            className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            🗺️ Map View
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            📋 Card View
          </button>
        </div>
        {viewMode === 'map' ? <MelbourneRegionalMap /> : <RegionSelector />}
        */}

        <MotionSection
          className="features-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container">
            <MotionDiv
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">Why Choose Melbourne Fuel?</h2>
              <p className="section-subtitle">Comprehensive fuel price monitoring to help you save money on every fill-up</p>
            </MotionDiv>

            <div className="features-grid">
              <article
                className="feature-card"
                itemScope
                itemType="https://schema.org/Service"
              >
                <MotionDiv
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="feature-icon" aria-hidden="true">🕐</div>
                  <h3 itemProp="name">Real-Time Updates</h3>
                  <p itemProp="description">Get live fuel price updates from petrol stations across Melbourne with instant notifications when prices change</p>
                </MotionDiv>
              </article>

              <article
                className="feature-card"
                itemScope
                itemType="https://schema.org/Service"
              >
                <MotionDiv
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="feature-icon" aria-hidden="true">🎯</div>
                  <h3 itemProp="name">Location-Based Search</h3>
                  <p itemProp="description">Find the nearest and cheapest petrol stations in your area using our advanced location-based search system</p>
                </MotionDiv>
              </article>

              <article
                className="feature-card"
                itemScope
                itemType="https://schema.org/Service"
              >
                <MotionDiv
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="feature-icon" aria-hidden="true">💰</div>
                  <h3 itemProp="name">Save Money</h3>
                  <p itemProp="description">Compare prices from over 250 petrol stations and save up to 20 cents per liter on every fuel purchase</p>
                </MotionDiv>
              </article>
            </div>
          </div>
        </MotionSection>
      </main>
    </>
  );
};

export default HomePage;