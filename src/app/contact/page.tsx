/**
 * Contact Page
 * Contact information and ways to get in touch
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { CONTACT } from '@/config/constants';
import { cn, patterns } from '@/styles/system/css-in-js';

export const metadata: Metadata = {
  title: 'Contact Us | Petrol Price Near Me',
  description:
    'Get in touch with Petrol Price Near Me. Contact us via phone, email, or through our website. We&apos;re here to help you find the cheapest fuel prices in Melbourne.',
  openGraph: {
    title: 'Contact Us | Petrol Price Near Me',
    description: 'Get in touch with us for questions, feedback, or support.',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <header className="bg-gradient-primary text-white py-20">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <h1 className={cn(patterns.text.h1, 'text-white mb-4 text-center')}>
              Contact Us
            </h1>
            <p className={cn(patterns.text.body, 'text-white/90 text-center max-w-2xl')}>
              Have questions or feedback? We&apos;d love to hear from you!
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className={patterns.container() + ' py-16'}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Contact Information */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-6'}>Get In Touch</h2>
            <p className={patterns.text.body + ' mb-6'}>
              We&apos;re here to help! Reach out to us through any of the following methods:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Name */}
              <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Contact Name
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{CONTACT.NAME}</p>
                </div>
              </div>

              {/* Mobile */}
              <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Mobile</h3>
                  <a
                    href={`tel:${CONTACT.MOBILE_RAW}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline font-medium"
                  >
                    {CONTACT.MOBILE}
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Tap to call
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✉️</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                  <a
                    href={`mailto:${CONTACT.EMAIL}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline font-medium break-all"
                  >
                    {CONTACT.EMAIL}
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Click to send an email
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Can Help With */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-6'}>What We Can Help With</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Price Updates & Corrections
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Found an incorrect price? Let us know and we&apos;ll update it as soon as
                    possible.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Station Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Questions about station locations, amenities, or services? We&apos;re here to
                    help.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Feedback & Suggestions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Have ideas to improve our service? We&apos;d love to hear your feedback!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Technical Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Experiencing issues with the website? Contact us and we&apos;ll help resolve
                    the problem.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Response Time */}
          <section className="card p-8 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
            <h2 className={patterns.text.h2 + ' mb-4'}>Response Time</h2>
            <p className={patterns.text.body}>
              We aim to respond to all inquiries within 24-48 hours during business days. For urgent
              matters, please call us directly at{' '}
              <a
                href={`tel:${CONTACT.MOBILE_RAW}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold hover:underline"
              >
                {CONTACT.MOBILE}
              </a>
              .
            </p>
          </section>

          {/* Additional Resources */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-6'}>Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/faq"
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Frequently Asked Questions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find answers to common questions about our service
                </p>
              </Link>
              <Link
                href="/about"
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About Us</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn more about Petrol Price Near Me
                </p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <Link href="/directory" className="btn btn-primary btn-lg">
              Browse All Stations →
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}


