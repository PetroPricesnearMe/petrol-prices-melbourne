import React, { useState, useEffect } from 'react';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';
import { trackPageView } from '../utils/analytics';
import './FAQPage.css';

const faqs = [
  {
    q: 'How do you get petrol prices?',
    a: 'We aggregate prices from public sources and community reports, then validate and surface them in a user-friendly directory and map. Our data comes from multiple sources including government APIs, station websites, and user submissions.',
    category: 'Data Sources'
  },
  {
    q: 'How often are prices updated?',
    a: 'Continuously. The directory sorts by most recently updated by default so you see fresh data first. Prices are typically updated every few hours during business hours.',
    category: 'Data Sources'
  },
  {
    q: 'Which areas are covered?',
    a: 'We focus on Melbourne and surrounding suburbs, with broader coverage growing over time. Currently covering 250+ stations across Greater Melbourne.',
    category: 'Coverage'
  },
  {
    q: 'Can I report a new price?',
    a: 'Yes. Use the "Report price" button on station cards to submit updates. All submissions are verified before being published.',
    category: 'User Input'
  },
  {
    q: 'Are the prices accurate?',
    a: 'We strive for accuracy by cross-referencing multiple sources and validating user submissions. However, prices can change frequently, so we recommend calling ahead for critical trips.',
    category: 'Accuracy'
  },
  {
    q: 'Why do prices vary so much between stations?',
    a: 'Prices vary due to location, competition, operating costs, and the weekly price cycle. Stations in high-rent areas or near highways often charge more due to convenience premiums.',
    category: 'Pricing'
  },
  {
    q: 'What is the fuel price cycle?',
    a: 'Australia has a weekly price cycle where prices typically start low on Sunday/Monday, rise through the week, peak on Friday/Saturday, then drop again. This varies by city and can be used to your advantage.',
    category: 'Pricing'
  },
  {
    q: 'How can I save money on fuel?',
    a: 'Fill up on Sunday/Monday when prices are lowest, use our price comparison tools, maintain your vehicle properly, drive efficiently, and consider alternative transport for short trips.',
    category: 'Saving Tips'
  },
  {
    q: 'Do you have a mobile app?',
    a: 'Our website is fully mobile-responsive and works like an app when added to your home screen. We\'re also developing a dedicated mobile app for even better functionality.',
    category: 'Mobile'
  },
  {
    q: 'Is this service free?',
    a: 'Yes, our basic price comparison service is completely free. We may introduce premium features in the future, but core functionality will always remain free.',
    category: 'Cost'
  },
  {
    q: 'How do I contact support?',
    a: 'You can reach us through our contact form, email support@petrolpricesnearme.com.au, or follow us on social media for updates and support.',
    category: 'Support'
  },
  {
    q: 'Can I use this for business purposes?',
    a: 'Yes, our data can be used for business purposes. Please contact us for API access and commercial licensing options.',
    category: 'Business'
  }
];

const FAQPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Track page view on mount
  useEffect(() => {
    trackPageView('FAQ');
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(faqs.map(faq => faq.category))];

  // Filter FAQs based on category and search term
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Generate FAQ structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <SEO
        title="FAQ - Melbourne Petrol Prices 2025 | Your Questions Answered"
        description="💡 Get answers to common questions about Melbourne fuel prices. Learn about price cycles, data sources, how to save up to 30c/L, and maximize your fuel savings. Expert tips & insights!"
        keywords="petrol prices faq melbourne, fuel price questions answered, melbourne petrol help guide, fuel price cycle explained, petrol station finder tips, fuel savings tips melbourne, how to save on petrol australia, fuel price monitoring faq, unleaded diesel premium prices melbourne"
        canonical="/faq"
        structuredData={faqStructuredData}
      />
      <div className="faq-page">
        <Breadcrumbs customCrumbs={[
          { label: 'Home', path: '/', icon: '🏠' },
          { label: 'FAQ', path: '/faq', isActive: true }
        ]} />
        <div className="faq-header">
          <div className="container">
            <header>
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800 }}>
                Frequently Asked Questions About Melbourne Petrol Prices
              </h1>
              <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', marginTop: '0.75rem' }}>
                Get instant answers to common questions about fuel prices, price cycles, our service, and proven strategies to save money on every fill-up
              </p>
            </header>

            <div className="faq-controls">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  name="faq-search"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  aria-label="Search FAQs"
                />
              </div>

              <div className="category-filter">
                <label htmlFor="faq-category-filter">Filter by category:</label>
                <select
                  id="faq-category-filter"
                  name="faq-category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="faq-content">
          <div className="container">
            <div className="faq-grid">
              {filteredFaqs.map((item, idx) => (
                <div key={idx} className="faq-item">
                  <div className="faq-question">
                    <span className="faq-category">{item.category}</span>
                    <h3>{item.q}</h3>
                  </div>
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No FAQs found</h3>
                <p>Try adjusting your search terms or category filter</p>
              </div>
            )}

            {/* Additional Help Section */}
            <div className="help-section">
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1.5rem' }}>
                Still Need Help? We're Here for You
              </h2>
              <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                Can't find what you're looking for? Our team is ready to assist you with any questions about fuel prices, our platform, or how to maximize your savings.
              </p>
              <div className="help-options">
                <div className="help-option">
                  <span className="help-icon">📧</span>
                  <h3>Email Support</h3>
                  <p>Get personalized help from our expert support team. We typically respond within 24 hours.</p>
                  <a href="mailto:support@petrolpricesnearme.com.au" className="help-link">
                    support@petrolpricesnearme.com.au
                  </a>
                </div>
                <div className="help-option">
                  <span className="help-icon">💬</span>
                  <h3>Live Chat</h3>
                  <p>Chat with us in real-time during business hours (Mon-Fri, 9am-5pm AEST)</p>
                  <button className="help-link">Start Chat (Coming Soon)</button>
                </div>
                <div className="help-option">
                  <span className="help-icon">📚</span>
                  <h3>Educational Resources</h3>
                  <p>Explore our comprehensive guides to understand fuel pricing and maximize your savings</p>
                  <a href="/how-pricing-works" className="help-link">View Complete Guide</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;


