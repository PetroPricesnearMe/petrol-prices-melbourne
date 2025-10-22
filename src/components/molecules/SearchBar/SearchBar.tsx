'use client';

import { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search for petrol stations...',
  isLoading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        fullWidth
        leftIcon={
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
      />
      <Button type="submit" isLoading={isLoading}>
        Search
      </Button>
    </form>
  );
}

