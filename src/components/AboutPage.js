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
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            About Petrol Prices Near Me
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
            Melbourne's most trusted fuel price comparison platform, helping thousands of drivers save money every day since 2024.
          </p>
        </header>

        {/* Hero Stats */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '3rem' 
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            borderRadius: '1rem', 
            padding: '2rem', 
            textAlign: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>250+</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Petrol Stations Monitored</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
            borderRadius: '1rem', 
            padding: '2rem', 
            textAlign: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>24/7</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Real-Time Price Updates</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
            borderRadius: '1rem', 
            padding: '2rem', 
            textAlign: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>20¢/L</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Average Savings Per Fill</div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              🎯 Our Mission
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.8, fontSize: '1.05rem' }}>
              To empower every Melbourne driver with transparent, real-time fuel pricing information, making it easy to find the cheapest petrol and save money on every fill-up.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
              We believe that fuel pricing should be transparent and accessible to everyone. By aggregating prices from hundreds of petrol stations and presenting them in an easy-to-use format, we help Melburnians make informed decisions and keep more money in their pockets.
            </p>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              🚗 Built for Melbourne Drivers
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.8, fontSize: '1.05rem' }}>
              Our platform is specifically designed for Melbourne's unique geography and fuel market. From CBD to outer suburbs, we cover every corner of Greater Melbourne.
            </p>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 2, fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
              <li>✅ Suburb-specific search and autocomplete</li>
              <li>✅ Interactive regional maps of Melbourne</li>
              <li>✅ Coverage of all Melbourne metropolitan areas</li>
              <li>✅ Local brand and station recognition</li>
              <li>✅ Melbourne fuel price cycle tracking</li>
            </ul>
          </div>
        </section>

        {/* Our Story */}
        <section style={{ marginBottom: '3rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '2rem', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            📖 Our Story
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1.05rem' }}>
            Founded in Melbourne in 2024, Petrol Prices Near Me was born from a simple frustration: why should finding the cheapest fuel be so difficult? We noticed that petrol prices could vary by 30 cents per liter between stations just a few kilometers apart, yet there was no easy way for everyday drivers to compare prices.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1.05rem' }}>
            What started as a simple price comparison tool has grown into Melbourne's most comprehensive fuel price monitoring platform. Today, we track over 250 petrol stations across Greater Melbourne, providing hourly updates and helping thousands of drivers save money every single day.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1.05rem' }}>
            Our platform combines cutting-edge technology with user-friendly design. We use government APIs, verified community reports, and station data to ensure accuracy. Our interactive maps, intelligent search, and price trend analysis make it easier than ever to find cheap fuel near you.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
            We're committed to transparency, accuracy, and helping Melbourne drivers make informed decisions. Whether you're commuting to work, running errands, or planning a road trip, we're here to help you save money on every fill-up.
          </p>
        </section>

        {/* What We Offer */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
            What We Offer
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗺️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Interactive Maps
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Visual exploration of petrol prices across Melbourne with our easy-to-use regional maps and station locator.
              </p>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Price Trends & Analytics
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Track historical price patterns, understand the fuel price cycle, and know the best time to fill up.
              </p>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Advanced Filters
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Filter by fuel type, brand, region, and amenities to find exactly what you need, when you need it.
              </p>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Mobile-Friendly
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Access fuel prices on the go with our fully responsive design that works perfectly on any device.
              </p>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏪</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Station Amenities
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Find stations with conveniences like car washes, ATMs, restrooms, and 24-hour service.
              </p>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💯</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                100% Free
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                No registration, no subscription, no hidden fees. Just free, accurate fuel price information for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section style={{ marginBottom: '3rem', background: 'var(--background-gray)', borderRadius: '1rem', padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>
            Our Core Values
          </h2>
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>🔒</div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Transparency</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  We believe fuel pricing should be open and accessible. No hidden agendas, just accurate data you can trust.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>✓</div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Accuracy</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  We verify all price data from multiple sources and update hourly to ensure you get the most current information.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>🤝</div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Community</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Built by Melbourne drivers, for Melbourne drivers. We listen to feedback and continuously improve based on your needs.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>🚀</div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Innovation</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  We constantly innovate to make fuel price comparison easier, faster, and more helpful for all Melburnians.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ marginTop: '3rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
            borderRadius: '1rem',
            padding: '2.5rem',
            color: 'white',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Join Thousands of Smart Melbourne Drivers</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.95, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Start saving money on fuel today. It's free, fast, and easy to use.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/directory" className="btn" style={{ background: 'white', color: 'var(--primary-color)', padding: '1rem 2rem', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: 600 }}>
                Find Cheap Fuel Now
              </a>
              <a href="/fuel-price-trends" className="btn" style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid white', color: 'white', padding: '1rem 2rem', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: 600 }}>
                View Price Trends
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;


