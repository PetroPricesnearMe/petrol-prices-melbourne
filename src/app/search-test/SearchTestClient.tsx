'use client';

import { useState, useEffect } from 'react';

import type { SearchCategory } from '@/components/molecules/AdvancedSearchBar';
import { AdvancedSearchBar } from '@/components/molecules/AdvancedSearchBar';
import { cn, patterns } from '@/styles/system/css-in-js';

// Type definitions for test stations
interface TestFuelPrices {
  unleaded: number;
  diesel: number;
  premium95: number;
}

interface TestStation {
  id: number;
  name: string;
  brand: string;
  address: string;
  suburb: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
  fuelPrices: TestFuelPrices;
}

// Mock station data for testing
const generateMockStations = (): TestStation[] => {
  const brands = [
    'Shell',
    'BP',
    'Caltex',
    '7-Eleven',
    'Mobil',
    'United',
    'Coles Express',
    'Liberty',
  ];
  const suburbs = [
    'Carlton',
    'Fitzroy',
    'Richmond',
    'South Yarra',
    'Collingwood',
    'Brunswick',
    'Northcote',
  ];
  const stations = [];

  for (let i = 0; i < 50; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const suburb = suburbs[Math.floor(Math.random() * suburbs.length)];

    stations.push({
      id: i + 1,
      name: `${brand} ${suburb}`,
      brand: brand,
      address: `${Math.floor(Math.random() * 500) + 1} ${suburb} Road`,
      suburb: suburb,
      city: suburb,
      postcode: `30${Math.floor(Math.random() * 99)}`,
      latitude: -37.8136 + (Math.random() - 0.5) * 0.1,
      longitude: 144.9631 + (Math.random() - 0.5) * 0.1,
      fuelPrices: {
        unleaded: 180 + Math.random() * 40,
        diesel: 190 + Math.random() * 35,
        premium95: 195 + Math.random() * 40,
      },
    });
  }

  return stations;
};

const categories: SearchCategory[] = [
  { id: 'all', label: 'All', icon: '🔍' },
  { id: 'brand', label: 'Brand', icon: '🏢' },
  { id: 'suburb', label: 'Suburb', icon: '📍' },
  { id: 'fuel', label: 'Fuel Type', icon: '⛽' },
];

export function SearchTestClient() {
  const [stations, setStations] = useState<TestStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<TestStation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const mockData = generateMockStations();
    setStations(mockData);
    setFilteredStations(mockData);
  }, []);

  const handleSearch = (query: string, results: TestStation[]) => {
    setSearchQuery(query);
    setFilteredStations(results);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Define search keys based on category
  const getSearchKeys = () => {
    switch (selectedCategory) {
      case 'brand':
        return ['brand'];
      case 'suburb':
        return ['suburb', 'address'];
      case 'fuel':
        return [
          'fuelPrices.unleaded',
          'fuelPrices.diesel',
          'fuelPrices.premium95',
        ];
      default:
        return ['name', 'brand', 'suburb', 'address'];
    }
  };

  // Custom result renderer
  const renderResult = (station: TestStation) => (
    <div className="flex flex-col">
      <div className="font-semibold text-gray-900 dark:text-white">
        {station.name}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {station.address}, {station.suburb}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className={patterns.container()}>
          <div className="py-8">
            <h1 className={cn(patterns.text.h1, 'mb-4')}>
              🔍 Advanced Search Bar - Test Page
            </h1>
            <p
              className={cn(
                patterns.text.body,
                'mb-6 text-gray-600 dark:text-gray-400'
              )}
            >
              Testing fuzzy search, autocomplete, and category filters
            </p>

            {/* Feature Badges */}
            <div className="mb-8 flex flex-wrap gap-3">
              <span className="badge badge-success">
                ✓ Fuse.js Fuzzy Search
              </span>
              <span className="badge badge-success">✓ Autocomplete</span>
              <span className="badge badge-success">✓ Category Filters</span>
              <span className="badge badge-success">✓ Keyboard Navigation</span>
              <span className="badge badge-success">✓ Recent Searches</span>
              <span className="badge badge-success">✓ Mobile Responsive</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-8">
        <div className={patterns.container()}>
          <div className="mx-auto max-w-4xl">
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-8 rounded-lg border p-6">
              <h2 className="text-blue-900 dark:text-blue-100 mb-3 text-lg font-bold">
                🧪 How to Test
              </h2>
              <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
                <li>
                  <strong>Autocomplete:</strong> Start typing &quot;Shell&quot;
                  or &quot;Carlton&quot; - suggestions appear
                </li>
                <li>
                  <strong>Fuzzy Search:</strong> Try typos like &quot;Shel&quot;
                  or &quot;Carton&quot; - still finds matches!
                </li>
                <li>
                  <strong>Category Filter:</strong> Click category buttons to
                  filter by brand/suburb/fuel
                </li>
                <li>
                  <strong>Keyboard Nav:</strong> Use ↑ ↓ arrows, Enter to
                  select, ESC to close
                </li>
                <li>
                  <strong>Recent Searches:</strong> Click input when empty to
                  see recent searches
                </li>
                <li>
                  <strong>Clear:</strong> Click X button or press ESC to clear
                </li>
              </ul>
            </div>

            {/* Advanced Search Bar */}
            <div className="mb-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <AdvancedSearchBar
                data={stations}
                searchKeys={getSearchKeys()}
                placeholder="Try typing: Shell, Carlton, BP, or even typos like &apos;Carton&apos;..."
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                categories={categories}
                selectedCategory={selectedCategory}
                maxSuggestions={8}
                debounceDelay={150}
                enableRecentSearches={true}
                renderResult={renderResult}
                loading={false}
              />
            </div>

            {/* Search Results */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Search Results</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {searchQuery ? (
                    <span>
                      Query:{' '}
                      <strong className="text-blue-600 dark:text-blue-400">
                        &quot;{searchQuery}&quot;
                      </strong>{' '}
                      • {filteredStations.length} results
                    </span>
                  ) : (
                    <span>Showing all {stations.length} stations</span>
                  )}
                </div>
              </div>

              {/* Results Grid */}
              {filteredStations.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mb-4 text-6xl">🔍</div>
                  <h3 className="mb-2 text-lg font-semibold">
                    No stations found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try a different search term or category
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredStations.slice(0, 12).map((station) => (
                    <article
                      key={station.id}
                      className="hover:border-blue-500 dark:hover:border-blue-400 rounded-lg border border-gray-200 p-4 transition-colors dark:border-gray-700"
                      aria-label={`Station: ${station.name} in ${station.suburb}`}
                    >
                      <h3 className="mb-1 font-bold">{station.name}</h3>
                      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        📍 {station.address}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-primary text-xs">
                          {station.brand}
                        </span>
                        <span className="badge badge-secondary text-xs">
                          {station.suburb}
                        </span>
                      </div>
                      <div className="mt-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Unleaded:
                          </span>
                          <span className="font-bold">
                            {station.fuelPrices.unleaded.toFixed(1)}¢
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Show More */}
              {filteredStations.length > 12 && (
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing 12 of {filteredStations.length} results
                  </p>
                </div>
              )}
            </div>

            {/* Debug Info */}
            <details className="mt-8 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
              <summary className="mb-4 cursor-pointer font-bold">
                🐛 Debug Information
              </summary>
              <div className="space-y-4 font-mono text-sm">
                <div>
                  <strong>Total Stations:</strong> {stations.length}
                </div>
                <div>
                  <strong>Filtered Results:</strong> {filteredStations.length}
                </div>
                <div>
                  <strong>Search Query:</strong> {searchQuery || '(none)'}
                </div>
                <div>
                  <strong>Selected Category:</strong> {selectedCategory}
                </div>
                <div>
                  <strong>Search Keys:</strong> {getSearchKeys().join(', ')}
                </div>
                <div>
                  <strong>First Result:</strong>
                  <pre className="mt-2 overflow-auto rounded bg-white p-3 dark:bg-gray-900">
                    {JSON.stringify(filteredStations[0], null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
