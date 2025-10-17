'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { MotionDiv } from '../src/components/MotionComponents';
import { MELBOURNE_REGIONS, getStationRegion } from '../src/config/regions';
import AdvancedFilters from '../src/components/AdvancedFilters';
import StationMap from '../src/components/StationMap';
import StationCards from '../src/components/StationCards';
import BreadcrumbsNext from '../components/layout/BreadcrumbsNext';
import { generateFuelPriceListingData } from '../src/components/SEO';
import { trackPageView, trackSearch, trackFilter, trackStationInteraction } from '../src/utils/analytics';
import { loadStationsFromGeoJSON } from '../lib/data/loadStations';

const ITEMS_PER_PAGE = 12;

export default function DirectoryPage({ allStations, selectedRegionData }) {
  const router = useRouter();
  const { region: regionParam } = router.query;
  
  const [stations] = useState(allStations);
  const [filteredStations, setFilteredStations] = useState(allStations);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const [viewMode, setViewMode] = useState('cards');
  const [selectedStation, setSelectedStation] = useState(null);

  const selectedRegion = regionParam ? MELBOURNE_REGIONS[regionParam.toUpperCase()] : null;

  // Debug logging
  useEffect(() => {
    console.log('🗺️ DirectoryPage mounted (Next.js)');
    console.log('📋 Region param from URL:', regionParam);
    console.log('🎯 Selected region:', selectedRegion?.name || 'All Stations');
    console.log('📊 Pre-loaded stations:', stations.length);
  }, [regionParam, selectedRegion, stations.length]);

  // Track page view
  useEffect(() => {
    trackPageView(selectedRegion ? `Directory - ${selectedRegion.name}` : 'Directory - All Stations');
  }, [selectedRegion]);

  // Apply filters
  const applyFilters = useCallback((filters) => {
    let filtered = [...stations];

    // Filter by region
    if (selectedRegion) {
      filtered = filtered.filter(station => {
        const stationRegion = getStationRegion(
          station.latitude,
          station.longitude,
          station.city
        );
        return stationRegion.id === selectedRegion.id;
      });
    }

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(search) ||
        station.city.toLowerCase().includes(search) ||
        station.address.toLowerCase().includes(search)
      );
      trackSearch(filters.search, filtered.length);
    }

    // Other filters (fuel type, brand, price range, etc.)
    if (filters.fuelType && filters.fuelType !== 'all') {
      filtered = filtered.filter(station =>
        station.fuelPrices?.some(fp => fp.fuelType.toLowerCase() === filters.fuelType.toLowerCase())
      );
      trackFilter('fuel_type', filters.fuelType);
    }

    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(station =>
        station.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
      trackFilter('brand', filters.brand);
    }

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price-low':
            const avgPriceA = a.fuelPrices?.reduce((sum, fp) => sum + fp.price, 0) / (a.fuelPrices?.length || 1) || Infinity;
            const avgPriceB = b.fuelPrices?.reduce((sum, fp) => sum + fp.price, 0) / (b.fuelPrices?.length || 1) || Infinity;
            return avgPriceA - avgPriceB;
          default:
            return 0;
        }
      });
    }

    setFilteredStations(filtered);
    setCurrentPage(1);
  }, [stations, selectedRegion]);

  // Handle filter changes
  const handleFilterChange = useCallback((filters) => {
    setActiveFilters(filters);
    applyFilters(filters);
  }, [applyFilters]);

  // Initial filter application
  useEffect(() => {
    applyFilters(activeFilters);
  }, [applyFilters, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStations = filteredStations.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SEO data
  const pageTitle = selectedRegion
    ? `${selectedRegion.name} Petrol Stations - Live Fuel Prices`
    : 'Melbourne Petrol Stations Directory - Live Fuel Prices';

  const pageDescription = selectedRegion
    ? `Find the cheapest petrol prices in ${selectedRegion.name}, Melbourne. Compare real-time fuel prices from ${filteredStations.length}+ stations.`
    : `Browse ${filteredStations.length}+ petrol stations across Melbourne. Compare live fuel prices and find the cheapest petrol near you.`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta 
          name="keywords" 
          content={`petrol prices ${selectedRegion?.name || 'melbourne'}, fuel prices ${selectedRegion?.name || 'melbourne'}, cheapest petrol, station directory`} 
        />
        <link rel="canonical" href={`/directory${regionParam ? `?region=${regionParam}` : ''}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFuelPriceListingData(filteredStations.slice(0, 10))) }}
        />
      </Head>

      <div className="directory-page">
        <BreadcrumbsNext customCrumbs={selectedRegion ? [
          { label: 'Home', path: '/', icon: '🏠' },
          { label: 'Station Directory', path: '/directory' },
          { label: selectedRegion.name, path: `/directory?region=${regionParam}`, isActive: true }
        ] : undefined} />

        {/* Header */}
        <div className="directory-header">
          <div className="container">
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="header-content">
                <Link href="/" className="back-link" aria-label="Back to regions">
                  ← Back to Regions
                </Link>
                <h1>
                  {selectedRegion ? selectedRegion.name : 'All Melbourne Petrol Stations'}
                </h1>
                {selectedRegion && (
                  <p className="region-description">
                    {selectedRegion.description}
                  </p>
                )}
                <div className="header-stats">
                  <div className="stat">
                    <span className="stat-number">{filteredStations.length}</span>
                    <span className="stat-label">Stations Found</span>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>

        {/* Filters */}
        <AdvancedFilters
          onFilterChange={handleFilterChange}
          stationsCount={filteredStations.length}
          totalStations={stations.length}
        />

        {/* View Toggle */}
        <div className="view-controls">
          <div className="container">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
              >
                📋 Cards
              </button>
              <button
                className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                🗺️ Map
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'map' ? (
          <StationMap 
            stations={filteredStations}
            onStationClick={(station) => setSelectedStation(station)}
          />
        ) : (
          <StationCards
            stations={currentStations}
            onStationClick={(station) => setSelectedStation(station)}
          />
        )}

        {/* Pagination */}
        {viewMode !== 'map' && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Server-side data loading with ISR
export async function getStaticProps(context) {
  console.log('🏗️ [Build] Generating DirectoryPage...');
  
  const stations = await loadStationsFromGeoJSON();
  
  // Normalize station data
  const normalizedStations = stations.map(station => ({
    ...station,
    fuelPrices: station.prices ? Object.entries(station.prices).map(([fuelType, price]) => ({
      fuelType,
      price: parseFloat(price || 0)
    })) : []
  }));

  return {
    props: {
      allStations: normalizedStations,
      selectedRegionData: null,
    },
    revalidate: 86400, // ISR: Regenerate every 24 hours
  };
}

