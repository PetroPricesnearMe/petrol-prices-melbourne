/**
 * Station Amenities Page
 * Find stations by available amenities
 */

import type { Metadata } from 'next';

import { StationAmenitiesClient } from './StationAmenitiesClient';

export const metadata: Metadata = {
  title: 'Station Amenities | Find Stations with Specific Services',
  description:
    'Find petrol stations in Melbourne by amenities. Search for stations with car wash, shop, restrooms, ATM, air pump, electric charging, and more.',
  keywords: [
    'petrol station amenities',
    'car wash near me',
    'petrol station services',
    '24 hour petrol station',
    'electric charging station',
  ],
};

export default function StationAmenitiesPage() {
  return <StationAmenitiesClient />;
}
