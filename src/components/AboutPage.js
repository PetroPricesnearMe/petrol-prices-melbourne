import React, { useEffect } from 'react';

const AboutPage = () => {
  useEffect(() => {
    // Set page title and meta tags
    document.title = 'About Us - Melbourne Petrol Price Comparison | Petrol Prices Near Me';
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Learn about Petrol Prices Near Me, Australia\'s leading petrol price monitoring service. We help Melbourne drivers find the cheapest fuel prices from 250+ stations with real-time updates.';
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = 'https://petrolpricesnearme.com.au/about';
    }
    
    return () => {
      // Reset title on unmount
      document.title = 'Melbourne Petrol Prices - Find Cheapest Fuel Near You | Live Price Comparison';
    };
  }, []);

  return (
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
  );
};

export default AboutPage;


