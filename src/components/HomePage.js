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
        title="Petrol Prices Melbourne | Cheapest Fuel Near Me - Live Price Comparison 2025"
        description="Find the cheapest petrol prices in Melbourne today. Compare live fuel prices from 250+ stations. Save up to 20c/L on unleaded, diesel & premium. Updated every hour. Free price alerts!"
        keywords="petrol prices melbourne, fuel prices melbourne, cheapest petrol near me, petrol stations melbourne, fuel price comparison melbourne, live petrol prices, melbourne fuel prices today, unleaded prices melbourne, diesel prices melbourne, premium unleaded melbourne, 91 octane melbourne, 95 octane melbourne, 98 octane melbourne, e10 prices melbourne, lpg prices melbourne, petrol price comparison, fuel finder melbourne, cheap fuel melbourne, petrol prices victoria, petrol stations near me, melbourne petrol map, fuel savings melbourne, petrol price trends melbourne, best fuel prices melbourne, melbourne petrol stations, fuel costs melbourne"
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
                Find the Cheapest Petrol Prices in Melbourne
              </MotionH1>

              <MotionP className="hero-subtitle" variants={itemVariants}>
                Compare live fuel prices from 250+ Melbourne petrol stations updated hourly. 
                Save up to 20c per liter on unleaded, diesel, premium & E10. Free, fast, and easy to use.
              </MotionP>

              <MotionDiv className="hero-buttons" variants={itemVariants}>
                <Link to="/directory" className="btn btn-primary hero-btn" aria-label="Browse petrol stations by Melbourne region">
                  <span className="btn-text">🗺️ Find Cheap Fuel Now</span>
                </Link>

                <Link to="/fuel-price-trends" className="btn btn-secondary hero-btn" aria-label="View fuel price trends and analytics">
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
              <h2 className="section-title">Why Choose Petrol Prices Near Me?</h2>
              <p className="section-subtitle">Australia's most comprehensive fuel price monitoring platform designed to save you money on every single fill-up</p>
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
                  <h3 itemProp="name">Hourly Price Updates</h3>
                  <p itemProp="description">Get live fuel price updates from 250+ petrol stations across Melbourne updated every hour, 24/7. Never miss a price drop with our real-time monitoring system.</p>
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
                  <h3 itemProp="name">Smart Location Search</h3>
                  <p itemProp="description">Find the nearest and cheapest petrol stations instantly using our intelligent location-based search. Filter by fuel type, brand, and distance to get exactly what you need.</p>
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
                  <h3 itemProp="name">Guaranteed Savings</h3>
                  <p itemProp="description">Compare prices from over 250 petrol stations and save up to 20 cents per liter on every fill-up. That's $8-15 savings per tank, or hundreds annually!</p>
                </MotionDiv>
              </article>
            </div>
          </div>
        </MotionSection>

        {/* How It Works Section */}
        <MotionSection
          className="how-it-works-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ backgroundColor: 'var(--background-gray)', padding: '4rem 0' }}
        >
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title">How to Find Cheap Petrol in 3 Easy Steps</h2>
              <p className="section-subtitle">Start saving money on fuel in under a minute</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Step 1: Choose Your Location
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Browse by region or use our interactive map to select your Melbourne suburb. We cover all areas from CBD to outer suburbs.
                </p>
              </div>

              <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛽</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Step 2: Filter by Fuel Type
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Select your preferred fuel type: Unleaded 91, Premium 95/98, Diesel, E10, or LPG. Filter by brand if you have a preference.
                </p>
              </div>

              <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💵</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Step 3: Compare & Save
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  View real-time prices sorted from cheapest to most expensive. Get directions and save up to 20c/L on your next fill-up!
                </p>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* Fuel Types Coverage Section */}
        <MotionSection
          className="fuel-types-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ padding: '4rem 0' }}
        >
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title">All Fuel Types, All Prices, All in One Place</h2>
              <p className="section-subtitle">Compare prices for every type of fuel available in Melbourne</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <article style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '1rem', color: 'white', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>⛽ Unleaded 91</h3>
                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Regular unleaded petrol - the most common fuel type for everyday vehicles</p>
              </article>

              <article style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '1rem', color: 'white', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>🏆 Premium 95</h3>
                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Premium unleaded for better performance and fuel efficiency</p>
              </article>

              <article style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '1rem', color: 'white', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>⭐ Premium 98</h3>
                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>High-octane premium fuel for high-performance vehicles</p>
              </article>

              <article style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', borderRadius: '1rem', color: 'white', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>🚛 Diesel</h3>
                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Diesel fuel for trucks, vans, and diesel-powered vehicles</p>
              </article>

              <article style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', borderRadius: '1rem', color: 'white', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>🌱 E10 Ethanol</h3>
                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Eco-friendly ethanol blend - 10% ethanol, 90% unleaded</p>
              </article>

              <article style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', borderRadius: '1rem', color: '#333', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>💨 LPG Autogas</h3>
                <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Liquefied petroleum gas - economical alternative fuel option</p>
              </article>
            </div>
          </div>
        </MotionSection>

        {/* Coverage Area Section */}
        <MotionSection
          className="coverage-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ backgroundColor: 'var(--background-gray)', padding: '4rem 0' }}
        >
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title">Comprehensive Melbourne Coverage</h2>
              <p className="section-subtitle">We monitor petrol prices across all Melbourne regions - from inner city to outer suburbs</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {['Melbourne CBD', 'North Melbourne', 'South Melbourne', 'East Melbourne', 'West Melbourne', 'Dandenong', 'Frankston', 'Werribee', 'Craigieburn', 'Pakenham', 'Sunbury', 'Mornington Peninsula'].map((area) => (
                <div key={area} style={{ padding: '1rem', background: 'white', borderRadius: '0.5rem', textAlign: 'center', border: '2px solid var(--border-color)', transition: 'all 0.3s ease' }}>
                  <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>📍 {area}</span>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                250+ Petrol Stations Monitored Daily
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
                Our comprehensive database includes all major brands: Coles Express, Woolworths Metro, 7-Eleven, BP, Shell, Caltex, United, Liberty, and independent stations across Greater Melbourne.
              </p>
              <Link to="/directory" className="btn btn-primary" style={{ display: 'inline-block' }}>
                Explore All Regions
              </Link>
            </div>
          </div>
        </MotionSection>

        {/* CTA Section */}
        <MotionSection
          className="cta-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ padding: '4rem 0' }}
        >
          <div className="container">
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', 
              borderRadius: '1.5rem', 
              padding: '3rem 2rem', 
              textAlign: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
                Ready to Start Saving on Fuel?
              </h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.95, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Join thousands of Melbourne drivers who save money every day by comparing petrol prices. It's free, fast, and easy!
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/directory" className="btn" style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid white', color: 'white', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  🗺️ Browse by Region
                </Link>
                <Link to="/fuel-price-trends" className="btn" style={{ background: 'white', color: 'var(--primary-color)', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  📊 View Price Trends
                </Link>
              </div>
            </div>
          </div>
        </MotionSection>
      </main>
    </>
  );
};

export default HomePage;