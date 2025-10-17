'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import BreadcrumbsNext from '../components/layout/BreadcrumbsNext';
import { MELBOURNE_REGIONS } from '../src/config/regions';
import { trackPageView } from '../src/utils/analytics';

// Dynamically import StationCards with SSR disabled to avoid window/localStorage issues
const StationCards = dynamic(() => import('../src/components/StationCards'), {
  ssr: false,
  loading: () => (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '3px solid #f3f4f6',
        borderTop: '3px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }} />
      <p style={{ color: '#6b7280' }}>Loading stations...</p>
    </div>
  )
});

export default function DirectoryPage() {
  const router = useRouter();
  const { region: regionParam } = router.query;
  
  const selectedRegion = regionParam ? MELBOURNE_REGIONS[regionParam.toUpperCase()] : null;

  // Load stations data on client side
  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        // Fetch the GeoJSON data from the public folder
        const response = await fetch('/data/stations.geojson');
        const geojson = await response.json();
        
        if (geojson.features && Array.isArray(geojson.features)) {
          const loadedStations = geojson.features.map((feature, index) => {
            const props = feature.properties || {};
            const coords = feature.geometry?.coordinates || [0, 0];
            
            // Extract brand from station owner
            const owner = props.station_owner || '';
            let brand = owner;
            
            // Normalize brand names
            if (owner.includes('7-ELEVEN') || owner.includes('7 ELEVEN')) {
              brand = '7-Eleven';
            } else if (owner.includes('BP')) {
              brand = 'BP';
            } else if (owner.includes('SHELL')) {
              brand = 'Shell';
            } else if (owner.includes('CALTEX')) {
              brand = 'Caltex';
            } else if (owner.includes('AMPOL')) {
              brand = 'Ampol';
            } else if (owner.includes('MOBIL')) {
              brand = 'Mobil';
            } else if (owner.includes('UNITED')) {
              brand = 'United';
            }
            
            return {
              id: props.objectid || index + 1,
              name: props.station_name || 'Unknown Station',
              address: props.station_address || props.gnaf_formatted_address || '',
              city: props.station_suburb || props.gnaf_suburb || '',
              postalCode: props.station_postcode || props.gnaf_postcode || '',
              state: props.station_state || 'VIC',
              brand: brand,
              latitude: coords[1],
              longitude: coords[0],
              lat: coords[1],
              lng: coords[0],
              fuelPrices: [],
              lastUpdated: props.station_revised_date || new Date().toISOString(),
            };
          });
          
          setStations(loadedStations);
          console.log(`✅ Loaded ${loadedStations.length} stations from GeoJSON`);
        }
      } catch (error) {
        console.error('❌ Error loading stations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStations();
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('🗺️ DirectoryPage mounted (Next.js)');
    console.log('📋 Region param from URL:', regionParam);
    console.log('🎯 Selected region:', selectedRegion?.name || 'All Stations');
    console.log('📊 Loaded stations:', stations.length);
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // SEO data
  const pageTitle = selectedRegion
    ? `${selectedRegion.name} Petrol Stations - Live Fuel Prices`
    : 'Melbourne Petrol Stations Directory - Live Fuel Prices';

  const pageDescription = selectedRegion
    ? `Find the cheapest petrol prices in ${selectedRegion.name}, Melbourne. Compare real-time fuel prices from petrol stations in the area.`
    : `Browse 700+ petrol stations across Melbourne. Compare live fuel prices and find the cheapest petrol near you.`;

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
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>Loading stations...</p>
          </div>
        )}
        
        {!loading && (
          <>
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
          </>
        )}
      </div>
    </>
  );
}


