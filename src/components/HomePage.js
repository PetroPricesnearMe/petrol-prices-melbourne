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
        title="Melbourne Petrol Prices 2025 | Find Cheapest Fuel Near You - Save Up to 30c/L Today"
        description="🚗 Australia's #1 fuel price comparison! Compare real-time petrol prices from 250+ Melbourne stations. Save up to 30c/L on unleaded, diesel & premium fuel. Live price alerts updated hourly. 100% FREE & easy to use!"
        keywords="melbourne petrol prices 2025, cheapest fuel melbourne today, petrol prices near me now, petrol stations melbourne, fuel price comparison melbourne australia, live petrol prices vic, melbourne fuel prices today updated, unleaded 91 prices melbourne, diesel prices melbourne vic, premium unleaded 95 melbourne, 98 octane melbourne, e10 prices melbourne, lpg prices melbourne, petrol price cycle melbourne, fuel savings melbourne, cheap petrol melbourne suburbs, petrol station finder melbourne, melbourne petrol map interactive, fuel costs melbourne 2025, best fuel prices melbourne, shell bp caltex prices melbourne"
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
              <MotionH1 className="hero-title" variants={itemVariants}>
                Find the Cheapest Petrol Prices in Melbourne Today
              </MotionH1>

              <MotionP className="hero-subtitle" variants={itemVariants}>
                Compare live fuel prices from 250+ stations across Melbourne. 
                Save up to 30c per liter with real-time price updates on unleaded, 
                diesel & premium fuel. Smart. Simple. Free.
              </MotionP>

              <MotionDiv className="hero-buttons" variants={itemVariants}>
                <Link to="/directory" className="btn btn-primary hero-btn">
                  <span className="btn-text">🔍 Find Cheapest Fuel Now</span>
                </Link>

                <Link to="/fuel-price-trends" className="btn btn-secondary hero-btn">
                  <span className="btn-text">📊 View Price Trends</span>
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
              <h2 className="section-title">Why Thousands of Melburnians Trust Us to Save Money on Fuel</h2>
              <p className="section-subtitle">Real-time price monitoring across 250+ petrol stations • Free forever • Updated hourly</p>
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
                  <div className="feature-icon" aria-hidden="true">⚡</div>
                  <h3 itemProp="name">Live Price Updates Every Hour</h3>
                  <p itemProp="description">Get real-time fuel price updates from 250+ Melbourne petrol stations. Never miss a price drop with instant alerts sent straight to your device.</p>
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
                  <div className="feature-icon" aria-hidden="true">📍</div>
                  <h3 itemProp="name">Smart Location-Based Search</h3>
                  <p itemProp="description">Instantly find the nearest AND cheapest petrol stations in your suburb with our GPS-powered search. View prices on an interactive map and get directions with one tap.</p>
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
                  <h3 itemProp="name">Save Up to 30c Per Liter on Every Fill-Up</h3>
                  <p itemProp="description">Compare prices across 250+ stations in seconds. Our users save an average of $520 per year by filling up at the right station at the right time. Track your savings with our built-in calculator.</p>
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