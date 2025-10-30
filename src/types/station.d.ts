/**
 * Station Type Definitions
 * Shared types for petrol station data
 */

export interface FuelPrices {
  unleaded: number | null;
  diesel: number | null;
  premium95: number | null;
  premium98: number | null;
  lpg: number | null;
}

export interface StationAmenities {
  carWash: boolean;
  cafe: boolean;
  atm: boolean;
  airPump: boolean;
  toilets: boolean;
  disabled: boolean;
  open24Hours: boolean;
}

export interface Station {
  id: number;
  name: string;
  brand: string;
  brandLogo: string | null;
  address: string;
  suburb: string;
  postcode: string;
  region: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  fuelPrices: FuelPrices;
  amenities: StationAmenities;
  lastUpdated: string;
  verified: boolean;
}

export interface StationsMetadata {
  totalStations: number;
  lastUpdated: string;
  suburbs: string[];
  brands: string[];
  regions: string[];
  priceRange: {
    unleaded: {
      min: number;
      max: number;
      average: string;
    };
  };
  stats: {
    byBrand: Record<string, number>;
    bySuburb: Record<string, number>;
  };
}

