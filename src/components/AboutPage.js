import React, { useEffect } from 'react';

import { trackPageView } from '../utils/analytics';

import Breadcrumbs from './Breadcrumbs';
import SEO from './SEO';

const AboutPage = () => {
  useEffect(() => {
    trackPageView('About');
  }, []);

  // About page structured data
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Petrol Prices Near Me",
    "description": "Learn about Melbourne's leading petrol price monitoring service",
    "mainEntity": {
      "@type": "Organization",
      "@id": "https://www.petrolpricesnearme.com.au",
      "name": "Petrol Prices Near Me",
      "description": "Australia's leading petrol price monitoring service providing real-time fuel prices across Melbourne",
      "foundingDate": "2024",
      "foundingLocation": {
        "@type": "City",
        "name": "Melbourne",
        "containedIn": {
          "@type": "State",
          "name": "Victoria"
        }
      },
      "areaServed": {
        "@type": "City",
        "name": "Melbourne"
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": -37.8136,
          "longitude": 144.9631
        },
        "geoRadius": "100km"
      }
    }
  };

  return (
    <>
      <SEO
        title="About Us - Melbourne Petrol Price Comparison | Petrol Prices Near Me"
        description="Learn about Petrol Prices Near Me, Australia's leading petrol price monitoring service. We help Melbourne drivers find the cheapest fuel prices from 250+ stations with real-time updates."
        keywords="about petrol prices near me, melbourne fuel monitoring, petrol price service, about us, fuel price comparison melbourne"
        canonical="/about"
        structuredData={aboutStructuredData}
      />
      <Breadcrumbs customCrumbs={[
        { label: 'Home', path: '/', icon: '🏠' },
        { label: 'About Us', path: '/about', isActive: true }
      ]} />
      <div className="container" style={{ padding: '2rem 0' }}>
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>About Petrol Prices Near Me</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Helping Melbourne drivers find the cheapest fuel, fast.</p>
        </header>

        <section style={{ display: 'grid', gap: '1rem' }}>
          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '0.75rem',
            padding: '1rem',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Our Mission</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              We want to make fuel pricing transparent and accessible. Compare live prices, explore suburb directories,
              and use our map to plan cheaper fill-ups.
            </p>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '0.75rem',
            padding: '1rem',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Melbourne First</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              The experience is tuned for Melbourne drivers: suburb suggestions, autocomplete, and suburb-centric
              navigation.
            </p>
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
            borderRadius: '0.75rem',
            padding: '2rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Why Choose Us?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>250+</h3>
                <p style={{ opacity: 0.9 }}>Petrol Stations</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>24/7</h3>
                <p style={{ opacity: 0.9 }}>Real-Time Updates</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>20¢</h3>
                <p style={{ opacity: 0.9 }}>Average Savings</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: '2rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Our Story</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Founded in Melbourne, Petrol Prices Near Me was created to address the frustration of inconsistent fuel pricing across the city.
            We saw how much money drivers were wasting simply because they didn&apos;t know where to find the cheapest fuel prices.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Today, we monitor over 250 petrol stations across Melbourne, providing real-time price updates that help thousands of drivers
            save money every day. Our platform combines cutting-edge technology with user-friendly design to make finding cheap fuel as
            easy as possible.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            We&apos;re committed to transparency, accuracy, and helping Melbourne drivers make informed decisions about where to fill up.
            Whether you&apos;re commuting to work or planning a road trip, we&apos;re here to help you save.
          </p>
        </section>
      </div>
    </>
  );
};

export default AboutPage;


