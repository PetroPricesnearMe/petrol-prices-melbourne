/**
 * Pagination Examples
 *
 * Demonstrates various usage patterns for the Pagination and PaginatedGrid components
 */

import React, { useState } from 'react';

import { PaginatedGrid } from '../common/PaginatedGrid';
import Pagination from '../common/Pagination';

// Example card component
const ExampleCard: React.FC<{ item: Record<string, unknown> }> = ({ item }) => (
  <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
      {item.title}
    </h3>
    <p className="flex-1 text-gray-600 dark:text-gray-400">
      {item.description}
    </p>
    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
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
        <h2 className="mb-4 text-2xl font-bold">Example 1: Basic Pagination</h2>
        <p className="mb-6 text-gray-600">
          Simple pagination with manual grid layout
        </p>
      </div>

      <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <h2 className="mb-4 text-2xl font-bold">Example 2: PaginatedGrid</h2>
        <p className="mb-6 text-gray-600">
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
        <h2 className="mb-4 text-2xl font-bold">Example 3: Custom Styling</h2>
        <p className="mb-6 text-gray-600">Large size with slide animation</p>
      </div>

      <div className="grid auto-rows-fr grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <h2 className="mb-4 text-2xl font-bold">Example 4: Custom Columns</h2>
        <p className="mb-6 text-gray-600">
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
        <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          Loading awesome content...
        </p>
      </div>
    </div>
  );

  const customEmptyState = (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mb-4 text-8xl">📭</div>
        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          No items found
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Try adding some items or adjusting your filters
        </p>
        <button
          onClick={() => setShowEmpty(false)}
          className="rounded-lg bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700"
        >
          Show Items
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">
          Example 5: Loading & Empty States
        </h2>
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 2000);
            }}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-white"
          >
            Simulate Loading
          </button>
          <button
            onClick={() => setShowEmpty(!showEmpty)}
            className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
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
        <h2 className="mb-4 text-2xl font-bold">Example 6: Minimal Setup</h2>
        <p className="mb-6 text-gray-600">Pagination without extra features</p>
      </div>

      <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <h2 className="mb-4 text-2xl font-bold">
          Example 7: Top & Bottom Pagination
        </h2>
        <p className="mb-6 text-gray-600">
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
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
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
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                activeExample === index
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {example.name}
            </button>
          ))}
        </nav>

        {/* Active example */}
        <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <ActiveComponent />
        </div>

        {/* Code snippet hint */}
        <div className="bg-blue-50 dark:bg-blue-900/20 mt-8 rounded-lg p-6">
          <h3 className="text-blue-900 dark:text-blue-100 mb-2 text-lg font-semibold">
            💡 Keyboard Navigation
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            Try using arrow keys (← →), Home, and End to navigate pages when
            pagination is focused!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaginationDemo;
