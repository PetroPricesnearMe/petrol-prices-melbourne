import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MotionDiv, MotionH1, MotionP, MotionSection, containerVariants, itemVariants } from '../src/components/MotionComponents';
import RegionSelectorNext from '../components/features/RegionSelectorNext';
import { trackPageView } from '../src/utils/analytics';
import { loadStationsFromGeoJSON } from '../lib/data/loadStations';
import { getRegionCounts } from '../src/config/regions';

// Structured data for homepage
const homepageStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Petrol Prices Near Me",
    "url": "https://www.petrolpricesnearme.com.au",
    "description": "Find the cheapest petrol prices in Melbourne with real-time fuel price updates from 700+ stations",
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

const heroContainerVariants = {
  ...containerVariants,
  visible: {
    ...containerVariants.visible,
    transition: {
      staggerChildren: 0.3
    }
  }
};

export default function HomePage({ regionCounts, totalStations }) {
  // Track page view on mount
  useEffect(() => {
    trackPageView('Home');
  }, []);

  return (
    <>
      <Head>
        <title>Petrol Prices Near Me - Find Cheapest Fuel in Melbourne | Live Updates</title>
        <meta 
          name="description" 
          content="Find the cheapest petrol prices in Melbourne with real-time fuel price updates. Compare prices from 700+ stations across Melbourne regions. Save money on every fill-up." 
        />
        <meta 
          name="keywords" 
          content="petrol prices melbourne, fuel prices melbourne, cheapest petrol, petrol stations near me, live fuel prices, melbourne petrol, fuel comparison" 
        />
        <link rel="canonical" href="/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
        />
      </Head>

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

                <Link href="/directory" className="btn btn-secondary hero-btn">
                  <span className="btn-text">View All Stations</span>
                </Link>
              </MotionDiv>

              <MotionDiv className="hero-stats" variants={itemVariants}>
                <div className="stat">
                  <div className="stat-number">{totalStations}+</div>
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
                  alt="Fuel nozzles at petrol station showing different fuel types"
                  className="nozzles-img"
                  loading="eager"
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

        {/* Region Selector */}
        <RegionSelectorNext regionCounts={regionCounts} totalStations={totalStations} />

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
              <article className="feature-card">
                <MotionDiv
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="feature-icon" aria-hidden="true">🕐</div>
                  <h3>Real-Time Updates</h3>
                  <p>Get live fuel price updates from petrol stations across Melbourne</p>
                </MotionDiv>
              </article>

              <article className="feature-card">
                <MotionDiv
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="feature-icon" aria-hidden="true">🎯</div>
                  <h3>Location-Based Search</h3>
                  <p>Find the nearest and cheapest petrol stations in your area</p>
                </MotionDiv>
              </article>

              <article className="feature-card">
                <MotionDiv
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="feature-icon" aria-hidden="true">💰</div>
                  <h3>Save Money</h3>
                  <p>Compare prices from 700+ petrol stations and save up to 20 cents per liter</p>
                </MotionDiv>
              </article>
            </div>
          </div>
        </MotionSection>
      </main>
    </>
  );
}

// Server-side data loading with ISR
export async function getStaticProps() {
  console.log('🏗️ [Build] Generating HomePage with static data...');
  
  const stations = await loadStationsFromGeoJSON();
  const regionCounts = getRegionCounts(stations);
  const totalStations = stations.length;

  return {
    props: {
      regionCounts,
      totalStations,
    },
    revalidate: 86400, // Regenerate every 24 hours (ISR)
  };
}

