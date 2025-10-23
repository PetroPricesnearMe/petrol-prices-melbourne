/**
 * Pagination Examples
 *
 * Demonstrates various usage patterns for the Pagination and PaginatedGrid components
 */

import React, { useState } from 'react';
import Pagination from '../common/Pagination';
import { PaginatedGrid } from '../common/PaginatedGrid';

// Example card component
const ExampleCard: React.FC<{ item: any }> = ({ item }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full flex flex-col">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {item.title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 flex-1">
      {item.description}
    </p>
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <span className="text-sm text-gray-500">ID: {item.id}</span>
    </div>
  </div>
);

// Generate sample data
const generateSampleData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is a sample description for item ${i + 1}. It demonstrates how the pagination system works with dynamic content.`,
  }));

/**
 * Example 1: Basic Pagination
 */
export const BasicPaginationExample: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const items = generateSampleData(50);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Example 1: Basic Pagination</h2>
        <p className="text-gray-600 mb-6">
          Simple pagination with manual grid layout
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {currentItems.map((item) => (
          <div key={item.id} className="h-full">
            <ExampleCard item={item} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={items.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

/**
 * Example 2: PaginatedGrid (All-in-One)
 */
export const PaginatedGridExample: React.FC = () => {
  const items = generateSampleData(50);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Example 2: PaginatedGrid</h2>
        <p className="text-gray-600 mb-6">
          Everything built-in: grid, pagination, and animations
        </p>
      </div>

      <PaginatedGrid
        items={items}
        renderItem={(item) => <ExampleCard item={item} />}
        itemsPerPage={12}
        gap="md"
      />
    </div>
  );
};

/**
 * Example 3: Custom Styling
 */
export const CustomStyledExample: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const items = generateSampleData(30);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Example 3: Custom Styling</h2>
        <p className="text-gray-600 mb-6">
          Large size with slide animation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
        {currentItems.map((item) => (
          <div key={item.id} className="h-full">
            <ExampleCard item={item} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        size="lg"
        animationType="slide"
        showItemsInfo={true}
      />
    </div>
  );
};

/**
 * Example 4: Different Column Configurations
 */
export const CustomColumnsExample: React.FC = () => {
  const items = generateSampleData(40);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Example 4: Custom Columns</h2>
        <p className="text-gray-600 mb-6">
          1 column on mobile, 2 on tablet, 4 on desktop, 5 on large screens
        </p>
      </div>

      <PaginatedGrid
        items={items}
        renderItem={(item) => <ExampleCard item={item} />}
        itemsPerPage={20}
        gap="lg"
        columns={{
          base: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
        }}
        animationType="scale"
      />
    </div>
  );
};

/**
 * Example 5: Loading and Empty States
 */
export const StatesExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const items = showEmpty ? [] : generateSampleData(24);

  const customLoadingState = (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent mb-4"></div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          Loading awesome content...
        </p>
      </div>
    </div>
  );

  const customEmptyState = (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="text-8xl mb-4">📭</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No items found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Try adding some items or adjusting your filters
        </p>
        <button
          onClick={() => setShowEmpty(false)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Show Items
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Example 5: Loading & Empty States</h2>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 2000);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Simulate Loading
          </button>
          <button
            onClick={() => setShowEmpty(!showEmpty)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Toggle Empty State
          </button>
        </div>
      </div>

      <PaginatedGrid
        items={items}
        renderItem={(item) => <ExampleCard item={item} />}
        itemsPerPage={12}
        loading={isLoading}
        loadingState={customLoadingState}
        emptyState={customEmptyState}
      />
    </div>
  );
};

/**
 * Example 6: Minimal Configuration
 */
export const MinimalExample: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const items = generateSampleData(25);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Example 6: Minimal Setup</h2>
        <p className="text-gray-600 mb-6">
          Pagination without extra features
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {currentItems.map((item) => (
          <div key={item.id} className="h-full">
            <ExampleCard item={item} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        showFirstLast={false}
        showItemsInfo={false}
        scrollToTop={false}
      />
    </div>
  );
};

/**
 * Example 7: Pagination with Both Top and Bottom
 */
export const DoublePaginationExample: React.FC = () => {
  const items = generateSampleData(60);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Example 7: Top & Bottom Pagination</h2>
        <p className="text-gray-600 mb-6">
          Pagination controls at both ends for convenience
        </p>
      </div>

      <PaginatedGrid
        items={items}
        renderItem={(item) => <ExampleCard item={item} />}
        itemsPerPage={16}
        paginationPosition="both"
        gap="md"
      />
    </div>
  );
};

/**
 * Main demo component that showcases all examples
 */
export const PaginationDemo: React.FC = () => {
  const [activeExample, setActiveExample] = useState(0);

  const examples = [
    { name: 'Basic Pagination', component: BasicPaginationExample },
    { name: 'PaginatedGrid', component: PaginatedGridExample },
    { name: 'Custom Styling', component: CustomStyledExample },
    { name: 'Custom Columns', component: CustomColumnsExample },
    { name: 'Loading & Empty', component: StatesExample },
    { name: 'Minimal Setup', component: MinimalExample },
    { name: 'Double Pagination', component: DoublePaginationExample },
  ];

  const ActiveComponent = examples[activeExample].component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pagination System Examples
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore different implementations of the pagination system
          </p>
        </header>

        {/* Example selector */}
        <nav className="mb-8 flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveExample(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeExample === index
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {example.name}
            </button>
          ))}
        </nav>

        {/* Active example */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <ActiveComponent />
        </div>

        {/* Code snippet hint */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Keyboard Navigation
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            Try using arrow keys (← →), Home, and End to navigate pages when pagination is focused!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaginationDemo;
