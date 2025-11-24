/**
 * Fair Fuel Open Data API Types
 * Typed interfaces derived from the Service Victoria documentation.
 */

export type FairFuelFuelTypeCode =
  | 'U91'
  | 'P95'
  | 'P98'
  | 'DSL'
  | 'PDSL'
  | 'E10'
  | 'E85'
  | 'B20'
  | 'LPG'
  | 'LNG'
  | 'CNG';

export interface FairFuelPriceResponse {
  fuelPriceDetails: FairFuelPriceDetail[];
}

export interface FairFuelPriceDetail {
  fuelStation: FairFuelStation;
  fuelPrices: FairFuelPriceItem[];
  updatedAt: string;
}

export interface FairFuelStation {
  id: string;
  name: string;
  brandId?: string;
  address?: string;
  contactPhone?: string;
  location?: {
    latitude: number | null;
    longitude: number | null;
  };
}

export interface FairFuelPriceItem {
  fuelType: FairFuelFuelTypeCode | string;
  price: number | null;
  isAvailable: boolean;
  updatedAt: string;
}

