/**
 * Suburb Auto-Suggest Hook
 * 
 * Provides suburb suggestions based on user input using existing dataset
 * 
 * @module hooks/useSuburbSuggestions
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

import { debouncedFetch } from '@/lib/api/enhanced-fetcher';
import metadataJson from '@/data/stations-metadata.json';

// ============================================================================
// TYPES
// ============================================================================

export interface SuburbSuggestion {
  name: string;
  stationCount: number;
  displayName: string;
  url: string;
}

interface UseSuburbSuggestionsOptions {
  minChars?: number;
  maxResults?: number;
  debounceMs?: number;
  enabled?: boolean;
}

// ============================================================================
// SUBURB DATA
// ============================================================================

/**
 * Get all suburbs from metadata with station counts
 */
function getAllSuburbs(): SuburbSuggestion[] {
  const suburbs = metadataJson.suburbs || [];
  const stats = metadataJson.stats?.bySuburb || {};

  return suburbs
    .map((suburb) => {
      const stationCount = stats[suburb] || 0;
      return {
        name: suburb,
        stationCount,
        displayName: formatSuburbName(suburb),
        url: `/directory/${suburb.toLowerCase().replace(/\s+/g, '-')}`,
      };
    })
    .filter((suburb) => suburb.stationCount > 0) // Only show suburbs with stations
    .sort((a, b) => b.stationCount - a.stationCount); // Sort by station count
}

/**
 * Format suburb name for display
 */
function formatSuburbName(suburb: string): string {
  return suburb
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Search suburbs by query
 */
async function searchSuburbs(query: string, maxResults: number = 10): Promise<SuburbSuggestion[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const allSuburbs = getAllSuburbs();
  const lowerQuery = query.toLowerCase().trim();

  // Filter and score suburbs
  const matches = allSuburbs
    .map((suburb) => {
      const lowerName = suburb.name.toLowerCase();
      const lowerDisplay = suburb.displayName.toLowerCase();

      // Calculate relevance score
      let score = 0;

      // Exact match gets highest score
      if (lowerName === lowerQuery || lowerDisplay === lowerQuery) {
        score = 1000;
      }
      // Starts with query
      else if (lowerName.startsWith(lowerQuery) || lowerDisplay.startsWith(lowerQuery)) {
        score = 500;
      }
      // Contains query
      else if (lowerName.includes(lowerQuery) || lowerDisplay.includes(lowerQuery)) {
        score = 100;
      }
      // Word boundary match
      else if (
        lowerName.split(' ').some((word) => word.startsWith(lowerQuery)) ||
        lowerDisplay.split(' ').some((word) => word.startsWith(lowerQuery))
      ) {
        score = 200;
      }

      // Boost score by station count (more stations = more relevant)
      score += suburb.stationCount * 0.1;

      return { suburb, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ suburb }) => suburb);

  return matches;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for suburb auto-suggestions
 */
export function useSuburbSuggestions(
  query: string,
  options: UseSuburbSuggestionsOptions = {}
) {
  const {
    minChars = 2,
    maxResults = 8,
    debounceMs = 200,
    enabled = true,
  } = options;

  const [suggestions, setSuggestions] = useState<SuburbSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Memoize all suburbs for quick access
  const allSuburbs = useMemo(() => getAllSuburbs(), []);

  // Search function with debouncing
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!enabled || searchQuery.length < minChars) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await debouncedFetch(
          () => searchSuburbs(searchQuery, maxResults),
          debounceMs,
          `suburb_suggest_${searchQuery.toLowerCase()}`
        );
        setSuggestions(results);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [enabled, minChars, maxResults, debounceMs]
  );

  // Trigger search when query changes
  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  // Get popular suburbs (for initial suggestions)
  const popularSuburbs = useMemo(() => {
    return allSuburbs.slice(0, 5);
  }, [allSuburbs]);

  return {
    suggestions,
    loading,
    error,
    popularSuburbs,
    hasResults: suggestions.length > 0,
  };
}

