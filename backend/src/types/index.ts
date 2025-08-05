// Core Type Definitions for Melbourne Petrol Stations Backend

export interface Config {
  port: number;
  nodeEnv: string;
  baserow: BaserowConfig;
  cors: CorsConfig;
  app: AppConfig;
  redis?: RedisConfig;
  sentry?: SentryConfig;
}

export interface BaserowConfig {
  token: string;
  apiUrl: string;
  databaseId: number;
  tables: {
    petrolStations: TableConfig;
    fuelPrices: TableConfig;
    airtableImport: TableConfig;
  };
  fieldIds: {
    petrolStations: PetrolStationFields;
  };
}

export interface TableConfig {
  id: number;
  name: string;
}

export interface PetrolStationFields {
  stationName: string;
  address: string;
  city: string;
  postalCode: string;
  region: string;
  country: string;
  latitude: string;
  longitude: string;
  category: string;
  fuelPrices: string;
  locationDetails: string;
}

export interface CorsConfig {
  origin: string | string[];
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

export interface AppConfig {
  name: string;
  description: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Petrol Station Types
export interface PetrolStation {
  id: number;
  stationName: string;
  address: string;
  city: string;
  postalCode: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  category: string;
  fuelPrices?: FuelPrice[];
  locationDetails?: string;
  brand?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CreatePetrolStationRequest {
  stationName: string;
  address: string;
  city: string;
  postalCode: string;
  region: string;
  country?: string;
  latitude: number;
  longitude: number;
  category?: string;
  locationDetails?: string;
  brand?: string[];
}

export interface UpdatePetrolStationRequest extends Partial<CreatePetrolStationRequest> {}

// Fuel Price Types
export interface FuelPrice {
  id: number;
  priceSource: string;
  fuelType: string;
  pricePerLiter: number;
  lastUpdated: string;
  priceTrend: string;
  petrolStation?: number[];
  locations?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFuelPriceRequest {
  priceSource: string;
  fuelType: string;
  pricePerLiter: number;
  lastUpdated: string;
  priceTrend: string;
  petrolStation?: number[];
  locations?: string;
}

export interface UpdateFuelPriceRequest extends Partial<CreateFuelPriceRequest> {}

// Query Parameters
export interface StationQueryParams {
  size?: number;
  page?: number;
  search?: string;
  user_field_names?: boolean;
  order_by?: string;
  filter__field_5072132__equal?: string; // city filter
  filter__field_5072134__equal?: string; // region filter
}

export interface PriceQueryParams {
  size?: number;
  page?: number;
  user_field_names?: boolean;
  order_by?: string;
  filter__field_5072408__equal?: string; // fuel type filter
}

// Socket.io Types
export interface SocketEvents {
  connection: (socket: any) => void;
  disconnect: (socket: any) => void;
  requestLiveUpdates: () => void;
  stationsData: (data: PetrolStation[]) => void;
  liveUpdatesEnabled: (enabled: boolean) => void;
  error: (error: { message: string }) => void;
}

// Error Types
export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export interface BaserowError {
  error: string;
  detail?: string;
  code?: string;
}

// GraphQL Types
export interface GraphQLContext {
  user?: any;
  req: any;
  res: any;
}

// Rate Limiting Types
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

// Cache Types
export interface CacheConfig {
  ttl: number;
  keyPrefix: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Environment Variables
export interface EnvironmentVariables {
  PORT?: string;
  NODE_ENV?: string;
  BASEROW_TOKEN?: string;
  BASEROW_API_URL?: string;
  FRONTEND_URL?: string;
  APP_NAME?: string;
  APP_DESCRIPTION?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: string;
  REDIS_PASSWORD?: string;
  REDIS_DB?: string;
  SENTRY_DSN?: string;
  SENTRY_ENVIRONMENT?: string;
  SENTRY_TRACES_SAMPLE_RATE?: string;
}

// Express Types
export interface ExpressRequest extends Request {
  user?: any;
  rateLimit?: any;
}

export interface ExpressResponse extends Response {
  // Add any custom response properties here
}

// Middleware Types
export interface MiddlewareFunction {
  (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void | Promise<void>;
}

export interface ErrorMiddlewareFunction {
  (err: Error, req: ExpressRequest, res: ExpressResponse, next: NextFunction): void;
}

// Import Express types
import { Request, Response, NextFunction } from 'express'; 