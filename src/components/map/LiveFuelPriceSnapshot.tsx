/**
 * Live Fuel Price Snapshot Component
 * 
 * Displays cheapest prices for each fuel type in a responsive card grid
 * Used for SEO and user engagement on the map pillar page
 */

'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { cn, patterns } from '@/styles/system/css-in-js';

interface FuelPrices {
  unleaded: number | null;
  diesel: number | null;
  premium95: number | null;
  premium98: number | null;
  lpg: number | null;
}

interface Station {
  id: number;
  name: string;
  brand: string;
  suburb: string;
  fuelPrices: FuelPrices;
}

interface Props {
  stations: Station[];
}

interface PriceSnapshot {
  fuelType: string;
  label: string;
  price: number;
  station: Station;
  average?: number;
  highest?: number;
}

export function LiveFuelPriceSnapshot({ stations }: Props) {
  const snapshots = useMemo(() => {
    const results: PriceSnapshot[] = [];
    
    // Calculate cheapest U91 (Unleaded)
    const u91Stations = stations
      .filter(s => s.fuelPrices.unleaded !== null)
      .map(s => ({ station: s, price: s.fuelPrices.unleaded! }))
      .sort((a, b) => a.price - b.price);
    
    if (u91Stations.length > 0) {
      const cheapest = u91Stations[0];
      const prices = u91Stations.map(s => s.price);
      const average = prices.reduce((a, b) => a + b, 0) / prices.length;
      const highest = Math.max(...prices);
      
      results.push({
        fuelType: 'unleaded',
        label: 'Unleaded 91',
        price: cheapest.price,
        station: cheapest.station,
        average,
        highest,
      });
    }
    
    // Calculate cheapest U95 (Premium 95)
    const u95Stations = stations
      .filter(s => s.fuelPrices.premium95 !== null)
      .map(s => ({ station: s, price: s.fuelPrices.premium95! }))
      .sort((a, b) => a.price - b.price);
    
    if (u95Stations.length > 0) {
      const cheapest = u95Stations[0];
      const prices = u95Stations.map(s => s.price);
      const average = prices.reduce((a, b) => a + b, 0) / prices.length;
      const highest = Math.max(...prices);
      
      results.push({
        fuelType: 'premium95',
        label: 'Premium 95',
        price: cheapest.price,
        station: cheapest.station,
        average,
        highest,
      });
    }
    
    // Calculate cheapest U98 (Premium 98)
    const u98Stations = stations
      .filter(s => s.fuelPrices.premium98 !== null)
      .map(s => ({ station: s, price: s.fuelPrices.premium98! }))
      .sort((a, b) => a.price - b.price);
    
    if (u98Stations.length > 0) {
      const cheapest = u98Stations[0];
      const prices = u98Stations.map(s => s.price);
      const average = prices.reduce((a, b) => a + b, 0) / prices.length;
      const highest = Math.max(...prices);
      
      results.push({
        fuelType: 'premium98',
        label: 'Premium 98',
        price: cheapest.price,
        station: cheapest.station,
        average,
        highest,
      });
    }
    
    // Calculate cheapest Diesel
    const dieselStations = stations
      .filter(s => s.fuelPrices.diesel !== null)
      .map(s => ({ station: s, price: s.fuelPrices.diesel! }))
      .sort((a, b) => a.price - b.price);
    
    if (dieselStations.length > 0) {
      const cheapest = dieselStations[0];
      const prices = dieselStations.map(s => s.price);
      const average = prices.reduce((a, b) => a + b, 0) / prices.length;
      const highest = Math.max(...prices);
      
      results.push({
        fuelType: 'diesel',
        label: 'Diesel',
        price: cheapest.price,
        station: cheapest.station,
        average,
        highest,
      });
    }
    
    return results;
  }, [stations]);
  
  const getPriceColor = (price: number) => {
    if (price < 180) return 'text-success-600 dark:text-success-400';
    if (price <= 200) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  };
  
  const getSuburbSlug = (suburb: string) => {
    return suburb.toLowerCase().replace(/\s+/g, '-');
  };
  
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className={patterns.container()}>
        <div className="mb-8 text-center">
          <h2 className={cn(patterns.text.h2, 'mb-3')}>
            Live Fuel Price Snapshot – Melbourne Today
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find the cheapest fuel prices across Melbourne. Prices updated daily from verified stations.
          </p>
        </div>
        
        <div className={patterns.grid(3, 'md', 4, 'lg')}>
          {snapshots.map((snapshot) => (
            <div
              key={snapshot.fuelType}
              className="card card-hover bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Cheapest {snapshot.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Today&apos;s Best Price
                  </p>
                </div>
                
                <div className="mb-4">
                  <div className={cn('text-3xl font-bold mb-2', getPriceColor(snapshot.price))}>
                    {snapshot.price.toFixed(1)}¢/L
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{snapshot.station.name}</p>
                    <p className="text-xs">{snapshot.station.suburb}</p>
                  </div>
                </div>
                
                {snapshot.average && snapshot.highest && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average:</span>
                      <span className="font-medium">{snapshot.average.toFixed(1)}¢/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Highest:</span>
                      <span className="font-medium text-error-600">{snapshot.highest.toFixed(1)}¢/L</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/melbourne/${getSuburbSlug(snapshot.station.suburb)}/${snapshot.fuelType}`}
                    className="btn btn-sm btn-outline w-full text-xs"
                  >
                    View {snapshot.station.suburb} Prices →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link
            href="/directory"
            className="btn btn-primary"
          >
            View All Stations & Prices →
          </Link>
        </div>
      </div>
    </section>
  );
}

