'use client';

import { useState, useEffect } from 'react';

import type { SearchCategory } from '@/components/molecules/AdvancedSearchBar';
import { AdvancedSearchBar } from '@/components/molecules/AdvancedSearchBar';
import { cn, patterns } from '@/styles/system/css-in-js';

// Mock station data for testing
const generateMockStations = () => {
  const brands = ['Shell', 'BP', 'Caltex', '7-Eleven', 'Mobil', 'United', 'Coles Express', 'Liberty'];
  const suburbs = ['Carlton', 'Fitzroy', 'Richmond', 'South Yarra', 'Collingwood', 'Brunswick', 'Northcote'];
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
  const [stations, setStations] = useState<any[]>([]);
  const [filteredStations, setFilteredStations] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [_loading, _setLoading] = useState(false);

  useEffect(() => {
    const mockData = generateMockStations();
    setStations(mockData);
    setFilteredStations(mockData);
  }, []);

  const handleSearch = (query: string, results: unknown[]) => {
    console.log('🔍 Search Query:', query);
    console.log('📊 Results Count:', results.length);
    console.log('📋 Results:', results.slice(0, 5));

    setSearchQuery(query);
    setFilteredStations(results);
  };

  const handleCategoryChange = (categoryId: string) => {
    console.log('🏷️ Category Changed:', categoryId);
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
        return ['fuelPrices.unleaded', 'fuelPrices.diesel', 'fuelPrices.premium95'];
      default:
        return ['name', 'brand', 'suburb', 'address'];
    }
  };

  // Custom result renderer
  const renderResult = (station: Record<string, unknown>) => (
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
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className={patterns.container()}>
          <div className="py-8">
            <h1 className={cn(patterns.text.h1, 'mb-4')}>
              🔍 Advanced Search Bar - Test Page
            </h1>
            <p className={cn(patterns.text.body, 'text-gray-600 dark:text-gray-400 mb-6')}>
              Testing fuzzy search, autocomplete, and category filters
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="badge badge-success">✓ Fuse.js Fuzzy Search</span>
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
          <div className="max-w-4xl mx-auto">
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
              <h2 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-100">
                🧪 How to Test
              </h2>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li><strong>Autocomplete:</strong> Start typing &quot;Shell&quot; or &quot;Carlton&quot; - suggestions appear</li>
                <li><strong>Fuzzy Search:</strong> Try typos like &quot;Shel&quot; or &quot;Carton&quot; - still finds matches!</li>
                <li><strong>Category Filter:</strong> Click category buttons to filter by brand/suburb/fuel</li>
                <li><strong>Keyboard Nav:</strong> Use ↑ ↓ arrows, Enter to select, ESC to close</li>
                <li><strong>Recent Searches:</strong> Click input when empty to see recent searches</li>
                <li><strong>Clear:</strong> Click X button or press ESC to clear</li>
              </ul>
            </div>

            {/* Advanced Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <AdvancedSearchBar
                data={stations}
                searchKeys={getSearchKeys()}
                placeholder="Try typing: Shell, Carlton, BP, or even typos like 'Carton'..."
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                categories={categories}
                selectedCategory={selectedCategory}
                maxSuggestions={8}
                debounceDelay={150}
                enableRecentSearches={true}
                renderResult={renderResult}
                loading={loading}
              />
            </div>

            {/* Search Results */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Search Results
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {searchQuery ? (
                    <span>
                      Query: <strong className="text-blue-600 dark:text-blue-400">&quot;{searchQuery}&quot;</strong>
                      {' '}• {filteredStations.length} results
                    </span>
                  ) : (
                    <span>Showing all {stations.length} stations</span>
                  )}
                </div>
              </div>

              {/* Results Grid */}
              {filteredStations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">No stations found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try a different search term or category
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStations.slice(0, 12).map((station) => (
                    <div
                      key={station.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                    >
                      <h3 className="font-bold mb-1">{station.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        📍 {station.address}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="badge badge-primary text-xs">{station.brand}</span>
                        <span className="badge badge-secondary text-xs">{station.suburb}</span>
                      </div>
                      <div className="mt-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Unleaded:</span>
                          <span className="font-bold">{station.fuelPrices.unleaded.toFixed(1)}¢</span>
                        </div>
                      </div>
                    </div>
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
            <details className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <summary className="cursor-pointer font-bold mb-4">
                🐛 Debug Information
              </summary>
              <div className="space-y-4 text-sm font-mono">
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
                  <pre className="mt-2 p-3 bg-white dark:bg-gray-900 rounded overflow-auto">
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
