/**
 * Contact Us Page
 * Fully accessible contact page with WCAG 2.1 AA compliance
 * Features: Email, phone, contact form, social links
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

import { Container, Section } from '@/components/layout/ResponsiveGrid';

export const metadata: Metadata = {
  title: 'Contact Us | Petrol Price Near Me',
  description:
    'Get in touch with Petrol Price Near Me. Email us at petrolpricesnearme@gmail.com or call 0423 530 204. We\'re here to help Melbourne drivers save on fuel.',
  openGraph: {
    title: 'Contact Petrol Price Near Me',
    description: 'Questions about fuel prices? Get in touch with our team.',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <Section 
        spacing="lg" 
        background="white"
        className="border-b border-gray-200 dark:border-gray-700"
      >
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4">
              Have questions about fuel prices or our service? We&apos;d love to hear from you.
            </p>
            <p 
              className="text-base text-gray-500 dark:text-gray-400"
              aria-label="Average response time"
            >
              ⏱️ We typically respond within 24 hours
            </p>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="xl">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Choose your preferred way to reach us. We&apos;re here to help!
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Email */}
                <article 
                  className="card p-6 hover:shadow-lg transition-shadow duration-200"
                  aria-label="Email contact information"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Email Us
                      </h3>
                      <a
                        href="mailto:petrolpricesnearme@gmail.com"
                        className="text-lg font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded underline break-all"
                        aria-label="Send email to petrolpricesnearme@gmail.com"
                      >
                        petrolpricesnearme@gmail.com
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        For general inquiries and support
                      </p>
                    </div>
                  </div>
                </article>

                {/* Phone */}
                <article 
                  className="card p-6 hover:shadow-lg transition-shadow duration-200"
                  aria-label="Phone contact information"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Call Us
                      </h3>
                      <a
                        href="tel:+61423530204"
                        className="text-lg font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded underline"
                        aria-label="Call 0423 530 204"
                      >
                        0423 530 204
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Mon-Fri, 9am-5pm AEST
                      </p>
                    </div>
                  </div>
                </article>

                {/* Location */}
                <article 
                  className="card p-6 hover:shadow-lg transition-shadow duration-200"
                  aria-label="Location information"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Location
                      </h3>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Melbourne, VIC
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Australia
                      </p>
                    </div>
                  </div>
                </article>
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    aria-label="Follow us on Twitter"
                  >
                    <span className="sr-only">Twitter</span>
                    <span aria-hidden="true">𝕏</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    aria-label="Follow us on Facebook"
                  >
                    <span className="sr-only">Facebook</span>
                    <span aria-hidden="true">f</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                <form 
                  action="#" 
                  method="POST" 
                  className="space-y-6"
                  aria-label="Contact form"
                  noValidate
                >
                  {/* Name */}
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Full Name <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      aria-required="true"
                      aria-describedby="name-error"
                      className="input w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
                      placeholder="John Smith"
                    />
                    <p id="name-error" className="sr-only" role="alert"></p>
                  </div>

                  {/* Email */}
                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Email Address <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      aria-required="true"
                      aria-describedby="email-error email-help"
                      autoComplete="email"
                      className="input w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
                      placeholder="john@example.com"
                    />
                    <p id="email-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      We&apos;ll never share your email
                    </p>
                    <p id="email-error" className="sr-only" role="alert"></p>
                  </div>

                  {/* Phone (Optional) */}
                  <div>
                    <label 
                      htmlFor="phone" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Phone Number <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      autoComplete="tel"
                      aria-describedby="phone-help"
                      className="input w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
                      placeholder="0400 000 000"
                    />
                    <p id="phone-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      For urgent inquiries
                    </p>
                  </div>

                  {/* Subject */}
                  <div>
                    <label 
                      htmlFor="subject" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Subject <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      aria-required="true"
                      className="input w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
                    >
                      <option value="">Select a topic...</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label 
                      htmlFor="message" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Message <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      aria-required="true"
                      aria-describedby="message-help"
                      className="input w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y min-h-[120px]"
                      placeholder="Tell us how we can help you..."
                    />
                    <p id="message-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum 10 characters
                    </p>
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        By submitting this form, you agree to our{' '}
                        <Link 
                          href="/privacy" 
                          className="text-primary-600 dark:text-primary-400 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                        >
                          Privacy Policy
                        </Link>.
                        We respect your privacy and will never share your information.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary flex-1 sm:flex-initial min-w-[200px] min-h-[44px] flex items-center justify-center gap-2 focus:ring-4 focus:ring-primary-300 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      aria-label="Send message"
                    >
                      <Send className="w-5 h-5" aria-hidden="true" />
                      <span>Send Message</span>
                    </button>
                    <button
                      type="reset"
                      className="btn btn-outlined min-h-[44px] focus:ring-4 focus:ring-gray-300 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      aria-label="Clear form"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section spacing="lg" background="white">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <article className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How often are prices updated?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our prices are updated in real-time from official sources, ensuring you always have the latest information.
              </p>
            </article>

            <article className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is the service free?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Petrol Price Near Me is completely free to use. No registration or payment required.
              </p>
            </article>

            <article className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I report incorrect prices?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely! Please email us at petrolpricesnearme@gmail.com with the station details and we&apos;ll investigate.
              </p>
            </article>

            <article className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you cover all of Melbourne?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We cover 250+ stations across Melbourne metro area. If you find a station missing, let us know!
              </p>
            </article>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/faq" 
              className="btn btn-outlined min-h-[44px] focus:ring-4 focus:ring-primary-300 focus:ring-offset-2"
            >
              View All FAQs →
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}

