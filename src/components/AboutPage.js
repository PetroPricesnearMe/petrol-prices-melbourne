import React from 'react';

const AboutPage = () => {
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
    </div>
  );
};

export default AboutPage;


