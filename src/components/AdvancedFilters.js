import React, { useState, useEffect } from 'react';
import './AdvancedFilters.css';

/**
 * Advanced Filters Component
 * Provides comprehensive filtering and search for station listings
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Array} props.stations - All available stations for filter options
 * @param {Object} props.activeFilters - Currently active filters
 */
const AdvancedFilters = ({ onFilterChange, stations = [], activeFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(activeFilters.search || '');
  const [selectedFuelType, setSelectedFuelType] = useState(activeFilters.fuelType || 'all');
  const [selectedBrand, setSelectedBrand] = useState(activeFilters.brand || 'all');
  const [priceRange, setPriceRange] = useState(activeFilters.priceRange || { min: '', max: '' });
  const [sortBy, setSortBy] = useState(activeFilters.sortBy || 'name');
  const [selectedRegion, setSelectedRegion] = useState(activeFilters.region || 'all');

  // Extract unique values from stations
  const fuelTypes = ['all', ...new Set(
    stations.flatMap(s => s.fuelPrices?.map(fp => fp.fuelType) || [])
  )].filter(Boolean);

  const brands = ['all', ...new Set(
    stations.map(s => s.brand).filter(Boolean)
  )];

  const regions = ['all', 'North Melbourne', 'South Melbourne', 'East Melbourne', 'West Melbourne', 'CBD'];

  // Update parent component when filters change
  useEffect(() => {
    const filters = {
      search: searchTerm,
      fuelType: selectedFuelType,
      brand: selectedBrand,
      priceRange,
      sortBy,
      region: selectedRegion
    };
    onFilterChange(filters);
  }, [searchTerm, selectedFuelType, selectedBrand, priceRange, sortBy, selectedRegion, onFilterChange]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedFuelType('all');
    setSelectedBrand('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
    setSelectedRegion('all');
  };

  const activeFilterCount = [
    searchTerm,
    selectedFuelType !== 'all',
    selectedBrand !== 'all',
    priceRange.min || priceRange.max,
    selectedRegion !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="advanced-filters">
      {/* Search Bar */}
      <div className="filter-search-container">
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            name="station-search"
            className="filter-search-input"
            placeholder="Search by station name, address, suburb..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search stations"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <button
          className={`toggle-filters-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-controls="filter-panel"
        >
          <span className="filter-icon" aria-hidden="true">⚙️</span>
          Filters
          {activeFilterCount > 0 && (
            <span className="filter-badge" aria-label={`${activeFilterCount} filters active`}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div id="filter-panel" className="filter-panel" role="region" aria-label="Filter options">
          <div className="filter-grid">
            {/* Fuel Type Filter */}
            <div className="filter-group">
              <label htmlFor="fuel-type-filter" className="filter-label">
                ⛽ Fuel Type
              </label>
              <select
                id="fuel-type-filter"
                name="fuel-type-filter"
                className="filter-select"
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
              >
                <option value="all">All Fuel Types</option>
                {fuelTypes.filter(ft => ft !== 'all').map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <label htmlFor="brand-filter" className="filter-label">
                🏪 Brand
              </label>
              <select
                id="brand-filter"
                name="brand-filter"
                className="filter-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="all">All Brands</option>
                {brands.filter(b => b !== 'all').map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="filter-group">
              <label htmlFor="region-filter" className="filter-label">
                📍 Region
              </label>
              <select
                id="region-filter"
                name="region-filter"
                className="filter-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label htmlFor="sort-filter" className="filter-label">
                🔄 Sort By
              </label>
              <select
                id="sort-filter"
                name="sort-filter"
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="distance">Distance (Nearest)</option>
                <option value="updated">Recently Updated</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group filter-group-wide">
              <label className="filter-label">
                💰 Price Range (per liter)
              </label>
              <div className="price-range-inputs">
                <input
                  type="number"
                  className="price-input"
                  placeholder="Min"
                  step="0.01"
                  min="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  aria-label="Minimum price"
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  className="price-input"
                  placeholder="Max"
                  step="0.01"
                  min="0"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="filter-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleClearFilters}
              disabled={activeFilterCount === 0}
            >
              Clear All Filters
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowFilters(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="active-filters-tags">
          {searchTerm && (
            <span className="filter-tag">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')} aria-label="Remove search filter">✕</button>
            </span>
          )}
          {selectedFuelType !== 'all' && (
            <span className="filter-tag">
              Fuel: {selectedFuelType}
              <button onClick={() => setSelectedFuelType('all')} aria-label="Remove fuel type filter">✕</button>
            </span>
          )}
          {selectedBrand !== 'all' && (
            <span className="filter-tag">
              Brand: {selectedBrand}
              <button onClick={() => setSelectedBrand('all')} aria-label="Remove brand filter">✕</button>
            </span>
          )}
          {selectedRegion !== 'all' && (
            <span className="filter-tag">
              Region: {selectedRegion}
              <button onClick={() => setSelectedRegion('all')} aria-label="Remove region filter">✕</button>
            </span>
          )}
          {(priceRange.min || priceRange.max) && (
            <span className="filter-tag">
              Price: ${priceRange.min || '0'} - ${priceRange.max || '∞'}
              <button onClick={() => setPriceRange({ min: '', max: '' })} aria-label="Remove price filter">✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;

