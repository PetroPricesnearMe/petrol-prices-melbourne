/**
 * FAQ Client Component
 * Interactive FAQ with search and filtering
 */

'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

import { cn, patterns, animations } from '@/styles/system/css-in-js';

const faqs = [
  {
    question: 'How do you get petrol prices?',
    answer:
      'We aggregate prices from public sources and community reports, then validate and surface them in a user-friendly directory and map. Our data comes from multiple sources including government APIs, station websites, and user submissions.',
    category: 'Data Sources',
  },
  {
    question: 'How often are prices updated?',
    answer:
      'Continuously. The directory sorts by most recently updated by default so you see fresh data first. Prices are typically updated every few hours during business hours.',
    category: 'Data Sources',
  },
  {
    question: 'Which areas are covered?',
    answer:
      'We focus on Melbourne and surrounding suburbs, with broader coverage growing over time. Currently covering 250+ stations across Greater Melbourne.',
    category: 'Coverage',
  },
  {
    question: 'Can I report a new price?',
    answer:
      'Yes. Use the "Report price" button on station cards to submit updates. All submissions are verified before being published.',
    category: 'User Input',
  },
  {
    question: 'Are the prices accurate?',
    answer:
      'We strive for accuracy by cross-referencing multiple sources and validating user submissions. However, prices can change frequently, so we recommend calling ahead for critical trips.',
    category: 'Accuracy',
  },
  {
    question: 'Why do prices vary so much between stations?',
    answer:
      'Prices vary due to location, competition, operating costs, and the weekly price cycle. Stations in high-rent areas or near highways often charge more due to convenience premiums.',
    category: 'Pricing',
  },
  {
    question: 'What is the fuel price cycle?',
    answer:
      'Australia has a weekly price cycle where prices typically start low on Sunday/Monday, rise through the week, peak on Friday/Saturday, then drop again. This varies by city and can be used to your advantage.',
    category: 'Pricing',
  },
  {
    question: 'How can I save money on fuel?',
    answer:
      'Fill up on Sunday/Monday when prices are lowest, use our price comparison tools, maintain your vehicle properly, drive efficiently, and consider alternative transport for short trips.',
    category: 'Saving Tips',
  },
  {
    question: 'Do you have a mobile app?',
    answer:
      'Our website is fully mobile-responsive and works like an app when added to your home screen. We&apos;re also developing a dedicated mobile app for even better functionality.',
    category: 'Mobile',
  },
  {
    question: 'Is this service free?',
    answer:
      'Yes, our basic price comparison service is completely free. We may introduce premium features in the future, but core functionality will always remain free.',
    category: 'Cost',
  },
];

export function FAQClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...new Set(faqs.map((faq) => faq.category))],
    []
  );

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'All' || faq.category === selectedCategory;
      const matchesSearch =
        !searchTerm ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-12">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter + ' mb-8'}>
            <h1 className={cn(patterns.text.h1, 'text-gradient-primary text-center mb-4')}>
              Frequently Asked Questions
            </h1>
            <p className={cn(patterns.text.body, 'text-center max-w-2xl')}>
              Find answers to common questions about fuel prices, our service, and how to save money
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="search"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-12"
              />
            </div>

            <div className={patterns.flex.center + ' gap-2 flex-wrap'}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'btn btn-sm',
                    selectedCategory === category ? 'btn-primary' : 'btn-ghost'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* FAQ List */}
      <section className="py-12">
        <div className={patterns.container()}>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className={patterns.text.h3}>No FAQs found</h3>
              <p className={patterns.text.body + ' mt-2'}>
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={cn(
                    'card p-6',
                    animations.safe('animate-fade-in')
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="badge badge-primary mb-3">{faq.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Contact Section */}
          <section className="mt-16 max-w-4xl mx-auto">
            <div className="card p-8 text-center">
              <h2 className={patterns.text.h2 + ' mb-6'}>Still need help?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-3">📧</div>
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Get personalized help
                  </p>
                  <a
                    href="mailto:support@petrolpricenearme.com.au"
                    className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                  >
                    support@petrolpricenearme.com.au
                  </a>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Real-time assistance
                  </p>
                  <button className="btn btn-primary btn-sm">Start Chat</button>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="font-semibold mb-2">Learn More</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Comprehensive guides
                  </p>
                  <Link href="/blog" className="btn btn-outline btn-sm">
                    View Guides
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
