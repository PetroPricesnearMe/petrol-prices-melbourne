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
    "Get in touch with Petrol Price Near Me. Email us at petrolpricesnearme@gmail.com or call 0423 530 204. We're here to help Melbourne drivers save on fuel.",
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
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Get In Touch
            </h1>
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              Have questions about fuel prices or our service? We&apos;d love to
              hear from you.
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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-6 lg:col-span-1">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  Contact Information
                </h2>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  Choose your preferred way to reach us. We&apos;re here to
                  help!
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Email */}
                <article
                  className="card p-6 transition-shadow duration-200 hover:shadow-lg"
                  aria-label="Email contact information"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30"
                      aria-hidden="true"
                    >
                      <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Email Us
                      </h3>
                      <a
                        href="mailto:petrolpricesnearme@gmail.com"
                        className="break-all rounded text-lg font-semibold text-primary-600 underline hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-primary-400 dark:hover:text-primary-300 dark:focus:ring-offset-gray-900"
                        aria-label="Send email to petrolpricesnearme@gmail.com"
                      >
                        petrolpricesnearme@gmail.com
                      </a>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        For general inquiries and support
                      </p>
                    </div>
                  </div>
                </article>

                {/* Phone */}
                <article
                  className="card p-6 transition-shadow duration-200 hover:shadow-lg"
                  aria-label="Phone contact information"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="bg-green-100 dark:bg-green-900/30 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                      aria-hidden="true"
                    >
                      <Phone className="text-green-600 dark:text-green-400 h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Call Us
                      </h3>
                      <a
                        href="tel:+61423530204"
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 focus:ring-green-500 rounded text-lg font-semibold underline focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        aria-label="Call 0423 530 204"
                      >
                        0423 530 204
                      </a>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Mon-Fri, 9am-5pm AEST
                      </p>
                    </div>
                  </div>
                </article>

                {/* Location */}
                <article
                  className="card p-6 transition-shadow duration-200 hover:shadow-lg"
                  aria-label="Location information"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="bg-blue-100 dark:bg-blue-900/30 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                      aria-hidden="true"
                    >
                      <MapPin className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Location
                      </h3>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Melbourne, VIC
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Australia
                      </p>
                    </div>
                  </div>
                </article>
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900"
                    aria-label="Follow us on Twitter"
                  >
                    <span className="sr-only">Twitter</span>
                    <span aria-hidden="true">𝕏</span>
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900"
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
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Send Us a Message
                </h2>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
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
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name{' '}
                      <span className="text-red-500" aria-label="required">
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      aria-required="true"
                      aria-describedby="name-error"
                      className="input min-h-[44px] w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                      placeholder="John Smith"
                    />
                    <p id="name-error" className="sr-only" role="alert"></p>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address{' '}
                      <span className="text-red-500" aria-label="required">
                        *
                      </span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      aria-required="true"
                      aria-describedby="email-error email-help"
                      autoComplete="email"
                      className="input min-h-[44px] w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                      placeholder="john@example.com"
                    />
                    <p
                      id="email-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      We&apos;ll never share your email
                    </p>
                    <p id="email-error" className="sr-only" role="alert"></p>
                  </div>

                  {/* Phone (Optional) */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Phone Number{' '}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      autoComplete="tel"
                      aria-describedby="phone-help"
                      className="input min-h-[44px] w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                      placeholder="0400 000 000"
                    />
                    <p
                      id="phone-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      For urgent inquiries
                    </p>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Subject{' '}
                      <span className="text-red-500" aria-label="required">
                        *
                      </span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      aria-required="true"
                      className="input min-h-[44px] w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
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
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Message{' '}
                      <span className="text-red-500" aria-label="required">
                        *
                      </span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      aria-required="true"
                      aria-describedby="message-help"
                      className="input min-h-[120px] w-full resize-y focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us how we can help you..."
                    />
                    <p
                      id="message-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      Minimum 10 characters
                    </p>
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 rounded-lg border p-4">
                    <div className="flex gap-3">
                      <CheckCircle
                        className="text-blue-600 dark:text-blue-400 mt-0.5 h-5 w-5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        By submitting this form, you agree to our{' '}
                        <Link
                          href="/privacy"
                          className="rounded text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-primary-400"
                        >
                          Privacy Policy
                        </Link>
                        . We respect your privacy and will never share your
                        information.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="btn-primary btn flex min-h-[44px] min-w-[200px] flex-1 items-center justify-center gap-2 focus:ring-4 focus:ring-primary-300 focus:ring-offset-2 dark:focus:ring-offset-gray-900 sm:flex-initial"
                      aria-label="Send message"
                    >
                      <Send className="h-5 w-5" aria-hidden="true" />
                      <span>Send Message</span>
                    </button>
                    <button
                      type="reset"
                      className="btn-outlined btn min-h-[44px] focus:ring-4 focus:ring-gray-300 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Quick answers to common questions
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            <article className="card p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                How often are prices updated?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our prices are updated in real-time from official sources,
                ensuring you always have the latest information.
              </p>
            </article>

            <article className="card p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Is the service free?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Petrol Price Near Me is completely free to use. No
                registration or payment required.
              </p>
            </article>

            <article className="card p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Can I report incorrect prices?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely! Please email us at petrolpricesnearme@gmail.com with
                the station details and we&apos;ll investigate.
              </p>
            </article>

            <article className="card p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Do you cover all of Melbourne?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We cover 250+ stations across Melbourne metro area. If you find
                a station missing, let us know!
              </p>
            </article>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/faq"
              className="btn-outlined btn min-h-[44px] focus:ring-4 focus:ring-primary-300 focus:ring-offset-2"
            >
              View All FAQs →
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
