import type { Station, FuelPrice } from '@/types/station';
import { StationCategory } from '@/types/station';
import logger from '@/utils/logger';

export function flattenStationFuelPrices(stations: Station[]): FuelPrice[] {
  return stations.flatMap((station) => {
    if (!Array.isArray(station.fuelPrices)) {
      return [];
    }
    return station.fuelPrices.map((price) => ({
      ...price,
      stationId: station.id,
    }));
  });
}

export function transformBaserowToStations(data: Array<Record<string, unknown>>): Station[] {
  return data.map(transformBaserowToStation).filter(Boolean) as Station[];
}

export function transformBaserowToStation(data: Record<string, unknown>): Station | null {
  try {
    const lat = data.Latitude ? parseFloat(String(data.Latitude)) : 0;
    const lng = data.Longitude ? parseFloat(String(data.Longitude)) : 0;
    const category = data.Category
      ? (String(data.Category) as StationCategory)
      : StationCategory.PETROL_STATION;

    return {
      id: Number(data.id) || 0,
      name: (data['Station Name'] as string) || '',
      brand: Array.isArray(data.brand) ? (data.brand[0] as string) || '' : '',
      address: (data.Address as string) || '',
      suburb: (data.City as string) || '',
      city: (data.City as string) || '',
      postcode: (data['Postal Code'] as string) || '',
      region: (data.Region as string) || '',
      latitude: lat,
      longitude: lng,
      category,
      fuelPrices: [],
      amenities: {},
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Error transforming Baserow data:', error);
    return null;
  }
}

export function transformBaserowToFuelPrices(
  data: Array<Record<string, unknown>>
): FuelPrice[] {
  return data.map((item) => {
    const pricePerLiter = item['Price Per Liter']
      ? parseFloat(String(item['Price Per Liter'])) || 0
      : 0;
    return {
      id: Number(item.id) || 0,
      stationId: Array.isArray(item['Petrol Station'])
        ? Number(item['Petrol Station'][0]) || 0
        : 0,
      fuelType: (item['Fuel Type'] as string) || '',
      pricePerLiter,
      lastUpdated:
        (item['Last Updated'] as string) || new Date().toISOString(),
    };
  });
}

export function transformStationToBaserow(
  station: Partial<Station>
): Record<string, string | number | undefined> {
  return {
    'Station Name': station.name,
    Address: station.address,
    City: station.suburb || station.city,
    Region: station.region,
    'Postal Code': station.postcode,
    Latitude: station.latitude?.toString(),
    Longitude: station.longitude?.toString(),
    Category: station.category,
  };
}

export function sortStations(stations: Station[], sortBy: string): Station[] {
  switch (sortBy) {
    case 'name':
      return [...stations].sort((a, b) => a.name.localeCompare(b.name));
    case 'price-low':
      return [...stations].sort((a, b) => {
        let aPrice = Infinity;
        let bPrice = Infinity;

        if (a.fuelPrices && Array.isArray(a.fuelPrices)) {
          const prices = a.fuelPrices.map((fp: FuelPrice) => fp.pricePerLiter || 0);
          if (prices.length > 0) aPrice = Math.min(...prices);
        }

        if (b.fuelPrices && Array.isArray(b.fuelPrices)) {
          const prices = b.fuelPrices.map((fp: FuelPrice) => fp.pricePerLiter || 0);
          if (prices.length > 0) bPrice = Math.min(...prices);
        }

        return aPrice - bPrice;
      });
    case 'suburb':
      return [...stations].sort((a, b) => (a.suburb || '').localeCompare(b.suburb || ''));
    default:
      return stations;
  }
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


