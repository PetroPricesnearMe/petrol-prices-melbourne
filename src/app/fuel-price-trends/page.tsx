/**
 * Fuel Price Trends Page
 * Track and analyze fuel price movements
 */

import type { Metadata } from 'next';

import { FuelTrendsClient } from './FuelTrendsClient';

export const metadata: Metadata = {
  title: 'Fuel Price Trends | Track Melbourne Fuel Prices',
  description:
    'Track fuel price trends in Melbourne with real-time analysis and historical data. View price cycles, compare fuel types, and predict when to fill up for maximum savings.',
  keywords: [
    'fuel price trends melbourne',
    'petrol price history',
    'fuel price cycle',
    'petrol price analysis',
    'melbourne fuel trends',
  ],
};

export default function FuelPriceTrendsPage() {
  return <FuelTrendsClient />;
}
