/**
 * Baserow Type Definitions
 *
 * Type-safe interfaces for Baserow data structures
 */

export interface BaserowRow {
  id: number;
  created_on: string;
  updated_on: string;
  [fieldName: string]: unknown;
}

// Petrol Stations Table
export interface PetrolStation extends BaserowRow {
  Station_Name: string;
  Address: string;
  City: string;
  Postal_Code: string;
  Region: string;
  Country: string;
  Latitude: number;
  Longitude: number;
  Category: string;
  Location_Details: string;
  Fuel_Prices: number[]; // Array of fuel price IDs
}

// Fuel Prices Table
export interface FuelPrice extends BaserowRow {
  Price_Per_Liter: string;
  Fuel_Type: string;
  Last_Updated: string;
  Price_Trend: string;
  Price_Source: string;
  Petrol_Station: number[]; // Array of station IDs
  Locations: string;
}

export interface FetchOptions {
  page?: number;
  size?: number;
  filters?: BaserowFilter[];
  orderBy?: string;
  search?: string;
}

export interface BaserowFilter {
  field: string;
  type:
    | 'equal'
    | 'not_equal'
    | 'contains'
    | 'contains_not'
    | 'filename_contains'
    | 'has_file_type'
    | 'date_equal'
    | 'date_not_equal'
    | 'date_before'
    | 'date_after'
    | 'date_before_day'
    | 'date_after_day'
    | 'number_equal'
    | 'number_not_equal'
    | 'number_higher_than'
    | 'number_lower_than'
    | 'boolean'
    | 'empty'
    | 'not_empty';
  value: unknown;
}

export interface BaserowResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Table IDs (configure based on your Baserow setup)
export const BASEROW_TABLES = {
  PETROL_STATIONS: process.env.BASEROW_PETROL_STATIONS_TABLE_ID || '623329',
  FUEL_PRICES: process.env.BASEROW_FUEL_PRICES_TABLE_ID || '623330',
} as const;
