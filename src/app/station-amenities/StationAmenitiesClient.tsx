/**
 * Station Amenities Client Component
 * Filter stations by available amenities
 */

'use client';

import { useState, useMemo } from 'react';

import { cn, patterns, animations } from '@/styles/system/css-in-js';

const amenities = [
  { key: 'all', label: 'All Stations', icon: '⛽' },
  { key: 'carWash', label: 'Car Wash', icon: '🚿' },
  { key: 'shop', label: 'Convenience Store', icon: '🏪' },
  { key: 'restroom', label: 'Restrooms', icon: '🚻' },
  { key: 'atm', label: 'ATM', icon: '🏧' },
  { key: 'airPump', label: 'Air Pump', icon: '💨' },
  { key: 'electricCharging', label: 'EV Charging', icon: '🔌' },
  { key: 'cafe', label: 'Café', icon: '☕' },
  { key: '24hours', label: '24/7 Open', icon: '🌙' },
];

// Mock data
const mockStations = [
  {
    id: 1,
    name: 'Shell Coles Express',
    brand: 'Shell',
    address: '123 Main St, Melbourne VIC 3000',
    amenities: {
      carWash: true,
      shop: true,
      restroom: true,
      atm: true,
      airPump: true,
      electricCharging: false,
      cafe: false,
      '24hours': true,
    },
    fuelPrices: [
      { type: 'Unleaded', price: 1.85 },
      { type: 'Diesel', price: 1.75 },
    ],
  },
];

export function StationAmenitiesClient() {
  const [selectedAmenity, setSelectedAmenity] = useState('all');

  const filteredStations = useMemo(() => {
    if (selectedAmenity === 'all') return mockStations;
    return mockStations.filter((station) => station.amenities[selectedAmenity as keyof typeof station.amenities]);
  }, [selectedAmenity]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-12">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <h1 className={cn(patterns.text.h1, 'text-gradient-primary text-center mb-4')}>
              Station Amenities
            </h1>
            <p className={cn(patterns.text.body, 'text-center max-w-2xl')}>
              Find petrol stations with the services you need
            </p>
          </div>
        </div>
      </header>

      {/* Amenity Filter */}
      <section className="bg-gray-100 dark:bg-gray-800 py-8 print-hidden">
        <div className={patterns.container()}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {amenities.map((amenity) => {
              const count = amenity.key === 'all'
                ? mockStations.length
                : mockStations.filter((s) => s.amenities[amenity.key as keyof typeof s.amenities]).length;

              return (
                <button
                  key={amenity.key}
                  onClick={() => setSelectedAmenity(amenity.key)}
                  className={cn(
                    'btn',
                    selectedAmenity === amenity.key ? 'btn-primary' : 'btn-outline',
                    'flex-col h-auto py-4'
                  )}
                >
                  <span className="text-2xl mb-1">{amenity.icon}</span>
                  <span className="text-sm">{amenity.label}</span>
                  <span className="badge badge-secondary mt-2">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Station List */}
      <section className="py-12">
        <div className={patterns.container()}>
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Found <strong>{filteredStations.length}</strong> station
              {filteredStations.length !== 1 && 's'}
              {selectedAmenity !== 'all' && (
                <> with <strong>{amenities.find((a) => a.key === selectedAmenity)?.label}</strong></>
              )}
            </p>
          </div>

          <div className={patterns.grid(3, 'lg')}>
            {filteredStations.map((station, index) => (
              <div
                key={station.id}
                className={cn('card-hover print-avoid-break', animations.safe('animate-fade-in'))}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {station.name}
                  </h3>
                  <span className="badge badge-primary">{station.brand}</span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📍 {station.address}
                  </p>

                  {/* Amenities */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Available Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(station.amenities)
                        .filter(([_, hasIt]) => hasIt)
                        .map(([key]) => {
                          const amenity = amenities.find((a) => a.key === key);
                          return amenity ? (
                            <span key={key} className="badge badge-success">
                              {amenity.icon} {amenity.label}
                            </span>
                          ) : null;
                        })}
                    </div>
                  </div>

                  {/* Prices */}
                  {station.fuelPrices.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Current Prices:</h4>
                      <div className="space-y-1">
                        {station.fuelPrices.map((price, i) => (
                          <div key={i} className={patterns.flex.between + ' text-sm'}>
                            <span className="text-gray-600 dark:text-gray-400">{price.type}</span>
                            <span className="font-bold text-primary-600">${price.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
