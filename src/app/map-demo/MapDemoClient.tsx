'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

import { cn, patterns } from '@/styles/system/css-in-js';

// Dynamically import map components to avoid SSR issues with Leaflet
const InteractiveStationMap = dynamic(
  () => import('@/components/InteractiveStationMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] animate-pulse rounded-lg bg-gray-100" />
    ),
  }
);

const ViewToggle = dynamic(() => import('@/components/ViewToggle'), {
  ssr: false,
});

// Mock station data for demo
const generateMockStations = () => {
  const stations = [];
  const brands = [
    'Shell',
    'BP',
    'Caltex',
    '7-Eleven',
    'Mobil',
    'United Petroleum',
  ];
  const suburbs = [
    'Melbourne CBD',
    'Carlton',
    'Fitzroy',
    'Richmond',
    'Collingwood',
    'South Yarra',
  ];

  // Melbourne CBD center: -37.8136, 144.9631
  const centerLat = -37.8136;
  const centerLng = 144.9631;

  for (let i = 0; i < 100; i++) {
    // Generate random coordinates around Melbourne CBD
    const lat = centerLat + (Math.random() - 0.5) * 0.2; // ~20km radius
    const lng = centerLng + (Math.random() - 0.5) * 0.2;

    const brand = brands[Math.floor(Math.random() * brands.length)];
    const suburb = suburbs[Math.floor(Math.random() * suburbs.length)];

    // Generate random fuel prices
    const unleadedPrice = 180 + Math.random() * 40; // 180-220 cents
    const dieselPrice = 190 + Math.random() * 35;
    const premium95Price = 195 + Math.random() * 40;

    stations.push({
      id: i + 1,
      name: `${brand} ${suburb}`,
      address: `${Math.floor(Math.random() * 500) + 1} ${suburb} Road`,
      city: suburb,
      suburb: suburb,
      latitude: lat,
      longitude: lng,
      brand: brand,
      fuelPrices: [
        {
          fuelType: 'Unleaded 91',
          price: parseFloat(unleadedPrice.toFixed(2)) / 100,
        },
        { fuelType: 'Diesel', price: parseFloat(dieselPrice.toFixed(2)) / 100 },
        {
          fuelType: 'Premium 95',
          price: parseFloat(premium95Price.toFixed(2)) / 100,
        },
      ],
    });
  }

  return stations;
};

export function MapDemoClient() {
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('map');
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [stations, setStations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stations
    setTimeout(() => {
      setStations(generateMockStations());
      setIsLoading(false);
    }, 500);
  }, []);

  const handleStationClick = (station: Record<string, unknown>) => {
    setSelectedStation(station);
    console.log('Station clicked:', station);
  };

  const handleFullScreenToggle = () => {
    setIsMapFullScreen(!isMapFullScreen);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-primary-600"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading map demo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className={patterns.container()}>
          <div className="py-8">
            <h1 className={cn(patterns.text.h1, 'mb-4')}>
              🗺️ Interactive Map Demo
            </h1>
            <p
              className={cn(
                patterns.text.body,
                'mb-6 text-gray-600 dark:text-gray-400'
              )}
            >
              Experience our fully-featured interactive map with clustering,
              real-time location tracking, and color-coded fuel price markers.
            </p>

            {/* Feature Badges */}
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="badge badge-success">✓ Leaflet Integration</span>
              <span className="badge badge-success">✓ Marker Clustering</span>
              <span className="badge badge-success">✓ Full-Screen Mode</span>
              <span className="badge badge-success">✓ Responsive Design</span>
              <span className="badge badge-success">✓ Color-Coded Pins</span>
              <span className="badge badge-success">✓ User Location</span>
            </div>

            {/* View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ViewToggle
                currentView={viewMode}
                onViewChange={setViewMode}
                showGrid={true}
                size="md"
              />

              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {stations.length} stations loaded
                </span>
                {selectedStation && (
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    Selected: {selectedStation.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {/* Map View */}
        {viewMode === 'map' && (
          <div className={isMapFullScreen ? '' : patterns.container()}>
            <div className="mb-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-3 text-lg font-bold">📍 Map Features</h2>
                <ul className="grid grid-cols-1 gap-3 text-sm text-gray-600 dark:text-gray-400 md:grid-cols-2">
                  <li>✓ Click markers to view station details</li>
                  <li>✓ Clusters automatically group nearby stations</li>
                  <li>✓ Color-coded pins based on fuel prices</li>
                  <li>✓ Full-screen mode for mobile & desktop</li>
                  <li>✓ User location tracking (requires permission)</li>
                  <li>✓ Get directions to any station</li>
                </ul>
              </div>
            </div>

            <InteractiveStationMap
              stations={stations}
              onStationClick={handleStationClick}
              selectedStation={selectedStation}
              height={isMapFullScreen ? '100vh' : 600}
              fullScreen={isMapFullScreen}
              onFullScreenToggle={handleFullScreenToggle}
              showUserLocation={true}
              center={[-37.8136, 144.9631]}
              zoom={12}
            />

            {/* Legend Explanation */}
            {!isMapFullScreen && (
              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 font-bold">🎨 Map Legend</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 flex h-12 w-12 items-center justify-center rounded-full text-xl text-white">
                      ⛽
                    </div>
                    <div>
                      <div className="font-semibold">Low Price</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        &lt; $1.80/L
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500 flex h-12 w-12 items-center justify-center rounded-full text-xl text-white">
                      ⛽
                    </div>
                    <div>
                      <div className="font-semibold">Medium Price</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        $1.80 - $2.00/L
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500 flex h-12 w-12 items-center justify-center rounded-full text-xl text-white">
                      ⛽
                    </div>
                    <div>
                      <div className="font-semibold">High Price</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        &gt; $2.00/L
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className={patterns.container()}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stations.slice(0, 12).map((station) => (
                <div
                  key={station.id}
                  className="card card-hover cursor-pointer"
                  onClick={() => {
                    setSelectedStation(station);
                    setViewMode('map');
                  }}
                >
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-bold">{station.name}</h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      📍 {station.address}
                    </p>
                    {station.fuelPrices && (
                      <div className="space-y-2">
                        {station.fuelPrices
                          .slice(0, 3)
                          .map((fp: Record<string, unknown>, idx: number) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span>{fp.fuelType}</span>
                              <span className="font-bold">
                                ${fp.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <button className="btn-primary btn-sm btn w-full">
                      View on Map
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className={patterns.container()}>
            <div className="space-y-4">
              {stations.slice(0, 12).map((station) => (
                <div
                  key={station.id}
                  className="card card-hover cursor-pointer"
                  onClick={() => {
                    setSelectedStation(station);
                    setViewMode('map');
                  }}
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row">
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-bold">
                          {station.name}
                        </h3>
                        <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                          📍 {station.address}, {station.suburb}
                        </p>
                        <span className="badge badge-primary">
                          {station.brand}
                        </span>
                      </div>
                      <div className="flex flex-col gap-4 md:flex-row">
                        {station.fuelPrices && (
                          <div className="space-y-2">
                            {station.fuelPrices.map(
                              (fp: Record<string, unknown>, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex justify-between gap-8 text-sm"
                                >
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {fp.fuelType}:
                                  </span>
                                  <span className="font-bold">
                                    ${fp.price.toFixed(2)}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                        <button className="btn-primary btn-sm btn whitespace-nowrap">
                          View on Map
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Instructions Section */}
      {!isMapFullScreen && (
        <section className="border-t border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-800">
          <div className={patterns.container()}>
            <h2 className={cn(patterns.text.h2, 'mb-8 text-center')}>
              How to Use the Interactive Map
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 text-5xl">🖱️</div>
                <h3 className="mb-2 font-bold">Click & Explore</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click on any marker to view station details, fuel prices, and
                  get directions
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 text-5xl">🔍</div>
                <h3 className="mb-2 font-bold">Zoom & Cluster</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Zoom out to see clusters, zoom in to see individual stations
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 text-5xl">📱</div>
                <h3 className="mb-2 font-bold">Mobile Friendly</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use full-screen mode for the best mobile experience
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
