/**
 * Example usage of MapLibreMap component
 * 
 * This file demonstrates how to use the MapLibreMap component
 * with your station data.
 */

'use client';

import { useState } from 'react';

import { MapLibreMap } from './MapLibreMap';

import type { Station } from '@/types/station';

/**
 * Example page component using the map
 */
export function MapExamplePage() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Example station data
  const exampleStations: Station[] = [
    {
      id: 1,
      name: 'BP Melbourne Central',
      brand: 'BP',
      latitude: -37.8136,
      longitude: 144.9631,
      logoUrl: '/logos/bp.png', // Optional: path to brand logo
      address: '123 Collins Street',
      suburb: 'Melbourne',
      postcode: '3000',
      fuelPrices: {
        unleaded: 195.5,
        diesel: 205.0,
        premium95: 210.0,
      },
    },
    {
      id: 2,
      name: 'Shell Docklands',
      brand: 'Shell',
      latitude: -37.8150,
      longitude: 144.9500,
      logoUrl: '/logos/shell.png',
      address: '456 Harbour Esplanade',
      suburb: 'Docklands',
      postcode: '3008',
      fuelPrices: {
        unleaded: 198.0,
        diesel: 207.5,
      },
    },
    // Add more stations...
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Melbourne Petrol Stations Map</h1>

      {/* Map Component */}
      <div className="mb-6">
        <MapLibreMap
          stations={exampleStations}
          selectedStation={selectedStation}
          onStationSelect={setSelectedStation}
          defaultZoom={11}
          defaultCenter={{ latitude: -37.8136, longitude: 144.9631 }}
          enableClustering={true}
          enableLazyLoad={true}
          height="600px"
          className="rounded-lg shadow-xl"
        />
      </div>

      {/* Selected Station Info */}
      {selectedStation && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 text-2xl font-semibold">{selectedStation.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedStation.address}, {selectedStation.suburb} {selectedStation.postcode}
          </p>
          {selectedStation.fuelPrices && (
            <div className="mt-4">
              <h3 className="mb-2 font-semibold">Fuel Prices</h3>
              <ul className="space-y-1">
                {Object.entries(selectedStation.fuelPrices).map(([type, price]) => (
                  <li key={type} className="flex justify-between">
                    <span className="capitalize">{type}:</span>
                    <span className="font-medium">
                      {price ? `${price.toFixed(1)}¢/L` : 'N/A'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Minimal example - just the map
 */
export function SimpleMapExample() {
  const stations: Station[] = [
    // Your station data here
  ];

  return (
    <MapLibreMap
      stations={stations}
      height="500px"
    />
  );
}

