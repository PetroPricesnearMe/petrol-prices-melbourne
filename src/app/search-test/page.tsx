/**
 * Search Bar Test Page
 *
 * Comprehensive testing page for the advanced search bar
 * Tests all features: autocomplete, fuzzy search, categories, keyboard nav
 */

import type { Metadata } from 'next';

import { SearchTestClient } from './SearchTestClient';

export const metadata: Metadata = {
  title: 'Advanced Search Test | Petrol Price Near Me',
  description: 'Testing advanced search functionality',
  robots: 'noindex, nofollow',
};

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default function SearchTestPage() {
  return <SearchTestClient />;
}
