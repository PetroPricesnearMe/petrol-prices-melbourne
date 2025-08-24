import React from 'react';

const faqs = [
  {
    q: 'How do you get petrol prices?',
    a: 'We aggregate prices from public sources and community reports, then validate and surface them in a user-friendly directory and map.'
  },
  {
    q: 'How often are prices updated?',
    a: 'Continuously. The directory sorts by most recently updated by default so you see fresh data first.'
  },
  {
    q: 'Which areas are covered?',
    a: 'We focus on Melbourne and surrounding suburbs, with broader coverage growing over time.'
  },
  {
    q: 'Can I report a new price?',
    a: 'Yes. Use the “Report price” button on station cards to submit updates.'
  }
];

const FAQPage = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Answers about Melbourne petrol prices and how to use the site.</p>
      </header>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {faqs.map((item, idx) => (
          <details key={idx} style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '0.75rem',
            padding: '1rem',
            boxShadow: 'var(--shadow)'
          }}>
            <summary style={{
              cursor: 'pointer',
              fontWeight: 700,
              outline: 'none'
            }}>
              {item.q}
            </summary>
            <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;


