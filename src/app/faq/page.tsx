/**
 * FAQ Page
 * Frequently asked questions about fuel prices and our service
 */

import type { Metadata } from 'next';

import { FAQClient } from './FAQClient';

export const metadata: Metadata = {
  title: 'FAQ | Frequently Asked Questions',
  description:
    'Find answers to common questions about fuel prices in Melbourne. Learn about price cycles, data sources, coverage areas, and how to save money on petrol.',
  keywords: [
    'petrol prices faq',
    'fuel price questions',
    'melbourne petrol help',
    'fuel price cycle',
    'petrol station finder',
  ],
};

export default function FAQPage() {
  return <FAQClient />;
}
