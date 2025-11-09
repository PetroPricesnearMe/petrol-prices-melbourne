/**
 * SidebarFilter Component
 * Collapsible sidebar filter for directory results with toggleable checkboxes and price ranges
 * Features:
 * - Collapsible sidebar with smooth animations
 * - Toggleable checkboxes for categories
 * - Price range sliders
 * - Tailwind transitions
 * - Mobile responsive design
 * - Accessibility features
 */

'use client';

import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';

import { cn } from '@/styles/system/css-in-js';

interface FilterOption {
  id: string;
  label: string;
  count: number;
  checked: boolean;
}

interface PriceRange {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
}

interface SidebarFilterProps {
  isOpen: boolean;
  onToggle: () => void;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

interface FilterState {
  brands: string[];
  suburbs: string[];
  fuelTypes: string[];
  priceRange: [number, number];
  verifiedOnly: boolean;
  hasPrices: boolean;
}

const defaultFilters: FilterState = {
  brands: [],
  suburbs: [],
  fuelTypes: [],
  priceRange: [0, 300],
  verifiedOnly: false,
  hasPrices: true,
};

export function SidebarFilter({ isOpen, onToggle, onFiltersChange, className }: SidebarFilterProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['brands', 'price']));

  // Mock data - in real app, this would come from props or API
  const filterOptions = {
    brands: [
      { id: 'bp', label: 'BP', count: 45 },
      { id: 'shell', label: 'Shell', count: 38 },
      { id: 'caltex', label: 'Caltex', count: 32 },
      { id: '7eleven', label: '7-Eleven', count: 28 },
      { id: 'coles', label: 'Coles Express', count: 25 },
      { id: 'woolworths', label: 'Woolworths', count: 22 },
      { id: 'united', label: 'United', count: 18 },
      { id: 'puma', label: 'Puma', count: 15 },
    ],
    suburbs: [
      { id: 'melbourne', label: 'Melbourne', count: 52 },
      { id: 'richmond', label: 'Richmond', count: 28 },
      { id: 'southbank', label: 'Southbank', count: 25 },
      { id: 'carlton', label: 'Carlton', count: 22 },
      { id: 'fitzroy', label: 'Fitzroy', count: 18 },
      { id: 'st-kilda', label: 'St Kilda', count: 15 },
      { id: 'prahran', label: 'Prahran', count: 12 },
      { id: 'south-yarra', label: 'South Yarra', count: 10 },
    ],
    fuelTypes: [
      { id: 'unleaded', label: 'Unleaded 91', count: 180 },
      { id: 'diesel', label: 'Diesel', count: 165 },
      { id: 'premium95', label: 'Premium 95', count: 142 },
      { id: 'premium98', label: 'Premium 98', count: 128 },
      { id: 'lpg', label: 'LPG', count: 95 },
    ],
  };

  const priceRange: PriceRange = {
    min: 0,
    max: 300,
    currentMin: filters.priceRange[0],
    currentMax: filters.priceRange[1],
  };

  // Update filters when state changes
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  }, []);

  const handleCheckboxChange = useCallback((category: keyof FilterState, optionId: string) => {
    setFilters(prev => {
      const currentArray = prev[category] as string[];
      const newArray = currentArray.includes(optionId)
        ? currentArray.filter(id => id !== optionId)
        : [...currentArray, optionId];

      return {
        ...prev,
        [category]: newArray,
      };
    });
  }, []);

  const handlePriceRangeChange = useCallback((newRange: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newRange,
    }));
  }, []);

  const handleToggleFilter = useCallback((filterKey: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    count += filters.brands.length;
    count += filters.suburbs.length;
    count += filters.fuelTypes.length;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 300) count += 1;
    if (filters.verifiedOnly) count += 1;
    if (!filters.hasPrices) count += 1;
    return count;
  }, [filters]);

  const FilterSection = ({ title, children, sectionId }: { title: string; children: React.ReactNode; sectionId: string }) => {
    const isExpanded = expandedSections.has(sectionId);

    return (
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => toggleSection(sectionId)}
          className="flex items-center justify-between w-full py-2 text-left"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const CheckboxGroup = ({ options, category }: { options: FilterOption[]; category: keyof FilterState }) => (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {options.map((option) => (
        <label
          key={option.id}
          className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={(filters[category] as string[]).includes(option.id)}
              onChange={() => handleCheckboxChange(category, option.id)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              {option.label}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {option.count}
          </span>
        </label>
      ))}
    </div>
  );

  const PriceRangeSlider = () => {
    const [localRange, setLocalRange] = useState<[number, number]>(filters.priceRange);

    const handleSliderChange = (index: number, value: number) => {
      const newRange: [number, number] = [...localRange];
      newRange[index] = value;

      // Ensure min doesn't exceed max and vice versa
      if (index === 0 && value > newRange[1]) {
        newRange[1] = value;
      } else if (index === 1 && value < newRange[0]) {
        newRange[0] = value;
      }

      setLocalRange(newRange);
      handlePriceRangeChange(newRange);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>${localRange[0].toFixed(1)}¢</span>
          <span>${localRange[1].toFixed(1)}¢</span>
        </div>

        <div className="relative">
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={localRange[0]}
            onChange={(e) => handleSliderChange(0, Number(e.target.value))}
            className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((localRange[0] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, #e5e7eb ${((localRange[0] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, #e5e7eb 100%)`
            }}
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={localRange[1]}
            onChange={(e) => handleSliderChange(1, Number(e.target.value))}
            className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${((localRange[1] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, #3b82f6 ${((localRange[1] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, #3b82f6 100%)`
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 lg:z-auto',
          'w-80 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700',
          'lg:translate-x-0 lg:opacity-100',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onToggle}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Brands */}
            <FilterSection title="Brands" sectionId="brands">
              <CheckboxGroup options={filterOptions.brands} category="brands" />
            </FilterSection>

            {/* Suburbs */}
            <FilterSection title="Suburbs" sectionId="suburbs">
              <CheckboxGroup options={filterOptions.suburbs} category="suburbs" />
            </FilterSection>

            {/* Fuel Types */}
            <FilterSection title="Fuel Types" sectionId="fuelTypes">
              <CheckboxGroup options={filterOptions.fuelTypes} category="fuelTypes" />
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range" sectionId="price">
              <PriceRangeSlider />
            </FilterSection>

            {/* Additional Filters */}
            <FilterSection title="Additional" sectionId="additional">
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={() => handleToggleFilter('verifiedOnly')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Verified Stations Only
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.hasPrices}
                    onChange={() => handleToggleFilter('hasPrices')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Has Current Prices
                  </span>
                </label>
              </div>
            </FilterSection>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default SidebarFilter;
