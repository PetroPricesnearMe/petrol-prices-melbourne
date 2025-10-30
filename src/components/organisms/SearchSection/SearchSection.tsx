'use client';

import { SearchBar } from '@/components/molecules/SearchBar';

export function SearchSection() {
  const handleSearch = (query: string) => {
    console.warn('Search functionality to be implemented:', query);
  };

  return (
    <section className="section-padding">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Search for Petrol Stations
          </h2>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </section>
  );
}

