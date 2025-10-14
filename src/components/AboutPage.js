import React, { useEffect } from 'react';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';
import { trackPageView } from '../utils/analytics';

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
        title="About Us - Australia's #1 Fuel Price Comparison Platform | Petrol Prices Near Me"
        description="🚗 Learn how Petrol Prices Near Me helps Melbourne drivers save money on fuel. Real-time price monitoring from 250+ stations since 2024. Trusted by thousands of motorists. FREE forever!"
        keywords="about petrol prices near me, melbourne fuel monitoring service, petrol price comparison platform australia, about us ppnm, fuel price service melbourne, real-time petrol monitoring, australian fuel price app, melbourne motorists fuel savings"
        canonical="/about"
        structuredData={aboutStructuredData}
      />
      <Breadcrumbs customCrumbs={[
        { label: 'Home', path: '/', icon: '🏠' },
        { label: 'About Us', path: '/about', isActive: true }
      ]} />
      <div className="container" style={{ padding: '2rem 0' }}>
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.5rem' }}>
            About Petrol Prices Near Me
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: 1.6 }}>
            Australia's most trusted fuel price comparison platform, helping Melbourne drivers save money on every fill-up since 2024.
          </p>
        </header>

        <section style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              💡 Our Mission: Making Fuel Pricing Transparent for All Australians
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.8, fontSize: '1.05rem' }}>
              We believe every Australian motorist deserves access to transparent, real-time fuel pricing information.
              Our mission is simple: help you find the cheapest petrol prices in your area and save money on every fill-up. 
              Compare live prices, explore detailed station directories, and use our interactive map to plan smarter, 
              more economical fuel stops. No ads, no gimmicks—just honest, up-to-date fuel pricing at your fingertips.
            </p>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              🎯 Built Specifically for Melbourne Drivers
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.8, fontSize: '1.05rem' }}>
              Unlike generic fuel apps, we've designed our platform specifically for Melbourne motorists. Our service 
              features intelligent suburb suggestions, local area autocomplete, suburb-centric navigation, and detailed 
              coverage of all Melbourne regions from the CBD to outer suburbs. We understand Melbourne's unique fuel 
              market, including weekly price cycles, regional variations, and seasonal trends. Whether you're in 
              Doncaster, Dandenong, or the Docklands, we've got you covered with hyper-local fuel pricing data.
            </p>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              ⚡ Real-Time Data You Can Trust
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.8, fontSize: '1.05rem' }}>
              Our advanced monitoring system tracks prices from 250+ petrol stations across Melbourne, updating 
              hourly to ensure you always have the most current information. We aggregate data from multiple trusted 
              sources including government APIs, direct station feeds, and verified community reports. Every price 
              is timestamped and validated before it appears on our platform, giving you confidence that the prices 
              you see are accurate and up-to-date.
            </p>
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
            borderRadius: '0.75rem',
            padding: '2.5rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
              Why Thousands of Melburnians Choose Us Daily
            </h2>
            <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.05rem' }}>
              Join our growing community of smart drivers saving money on fuel
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <h3 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>250+</h3>
                <p style={{ opacity: 0.95, fontSize: '1.1rem', fontWeight: 500 }}>Petrol Stations Monitored</p>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.25rem' }}>Across Greater Melbourne</p>
              </div>
              <div>
                <h3 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>24/7</h3>
                <p style={{ opacity: 0.95, fontSize: '1.1rem', fontWeight: 500 }}>Real-Time Price Updates</p>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.25rem' }}>Updated Every Hour</p>
              </div>
              <div>
                <h3 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>30¢</h3>
                <p style={{ opacity: 0.95, fontSize: '1.1rem', fontWeight: 500 }}>Average Savings Per Liter</p>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.25rem' }}>Up to $520/year per driver</p>
              </div>
              <div>
                <h3 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>100%</h3>
                <p style={{ opacity: 0.95, fontSize: '1.1rem', fontWeight: 500 }}>Free Forever</p>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.25rem' }}>No hidden costs or subscriptions</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: '2rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Our Story</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Founded in Melbourne, Petrol Prices Near Me was created to address the frustration of inconsistent fuel pricing across the city.
            We saw how much money drivers were wasting simply because they didn't know where to find the cheapest fuel prices.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Today, we monitor over 250 petrol stations across Melbourne, providing real-time price updates that help thousands of drivers
            save money every day. Our platform combines cutting-edge technology with user-friendly design to make finding cheap fuel as
            easy as possible.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            We're committed to transparency, accuracy, and helping Melbourne drivers make informed decisions about where to fill up.
            Whether you're commuting to work or planning a road trip, we're here to help you save.
          </p>
        </section>
      </div>
    </>
  );
};

export default AboutPage;


