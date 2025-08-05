import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import config from '../config';
import {
  PetrolStation,
  FuelPrice,
  CreatePetrolStationRequest,
  UpdatePetrolStationRequest,
  CreateFuelPriceRequest,
  StationQueryParams,
  PriceQueryParams,
  PaginatedResponse,
  ApiError,
  BaserowError
} from '../types';

/**
 * Comprehensive Baserow API Client
 * Supports full CRUD operations for Petrol Stations and Fuel Prices tables
 * 
 * Authentication: Uses Bearer Token authentication
 * API Documentation: https://api.baserow.io/api/redoc/
 */
export class BaserowClient {
  private config = config.baserow;
  private client: AxiosInstance;

  constructor() {
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: this.config.apiUrl,
      headers: {
        'Authorization': `Token ${this.config.token}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000 // 15 second timeout
    });

    // Add request/response interceptors for better error handling
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error: AxiosError) => {
        console.error('❌ Request Error:', error.message);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // ==================== FIELD METADATA OPERATIONS ====================

  /**
   * Get field metadata for a table
   * @param tableId - Table ID
   * @returns Promise<Object> Field metadata
   */
  async getTableFields(tableId: number): Promise<any> {
    try {
      const response = await this.client.get(`/database/fields/table/${tableId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fields for table ${tableId}:`, (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get all tables in the database
   * @returns Promise<Object> All tables metadata
   */
  async getAllTables(): Promise<any> {
    try {
      const response = await this.client.get('/database/tables/all-tables/');
      return response.data;
    } catch (error) {
      console.error('Error fetching all tables:', (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  // ==================== PETROL STATIONS OPERATIONS ====================

  /**
   * Get all petrol stations with pagination support
   * @param params - Query parameters
   * @returns Promise<PaginatedResponse<PetrolStation>> Petrol stations data
   */
  async getPetrolStations(params: StationQueryParams = {}): Promise<PaginatedResponse<PetrolStation>> {
    try {
      const defaultParams = {
        user_field_names: true,
        size: 50,
        ...params
      };
      
      const response = await this.client.get(
        `/database/rows/table/${this.config.tables.petrolStations.id}/`,
        { params: defaultParams }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching petrol stations:', (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get all petrol stations without pagination
   * @param params - Query parameters
   * @returns Promise<PetrolStation[]> All petrol stations
   */
  async getAllPetrolStations(params: StationQueryParams = {}): Promise<PetrolStation[]> {
    try {
      const allStations: PetrolStation[] = [];
      let nextUrl: string | null = `/database/rows/table/${this.config.tables.petrolStations.id}/`;
      
      const defaultParams = {
        user_field_names: true,
        size: 200, // Larger page size for efficiency
        ...params
      };

      while (nextUrl) {
        const response: AxiosResponse = await this.client.get(nextUrl, { params: defaultParams });
        const data: any = response.data;
        
        if (data.results) {
          allStations.push(...data.results.map((station: any) => this.transformStationData(station)));
        }
        
        nextUrl = data.next;
      }

      return allStations;
    } catch (error) {
      console.error('Error fetching all petrol stations:', (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get a specific petrol station by ID
   * @param stationId - Station ID
   * @returns Promise<PetrolStation> Station data
   */
  async getPetrolStation(stationId: number): Promise<PetrolStation> {
    try {
      const response = await this.client.get(
        `/database/rows/table/${this.config.tables.petrolStations.id}/${stationId}/`,
        { params: { user_field_names: true } }
      );
      
      return this.transformStationData(response.data);
    } catch (error) {
      console.error(`Error fetching station ${stationId}:`, (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Create a new petrol station
   * @param stationData - Station data
   * @returns Promise<PetrolStation> Created station
   */
  async createPetrolStation(stationData: CreatePetrolStationRequest): Promise<PetrolStation> {
    try {
      const response = await this.client.post(
        `/database/rows/table/${this.config.tables.petrolStations.id}/`,
        stationData
      );
      
      return this.transformStationData(response.data);
    } catch (error) {
      console.error('Error creating petrol station:', (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Update an existing petrol station
   * @param stationId - Station ID
   * @param updateData - Update data
   * @returns Promise<PetrolStation> Updated station
   */
  async updatePetrolStation(stationId: number, updateData: UpdatePetrolStationRequest): Promise<PetrolStation> {
    try {
      const response = await this.client.patch(
        `/database/rows/table/${this.config.tables.petrolStations.id}/${stationId}/`,
        updateData
      );
      
      return this.transformStationData(response.data);
    } catch (error) {
      console.error(`Error updating station ${stationId}:`, (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Delete a petrol station
   * @param stationId - Station ID
   * @returns Promise<void>
   */
  async deletePetrolStation(stationId: number): Promise<void> {
    try {
      await this.client.delete(
        `/database/rows/table/${this.config.tables.petrolStations.id}/${stationId}/`
      );
    } catch (error) {
      console.error(`Error deleting station ${stationId}:`, (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  // ==================== FUEL PRICES OPERATIONS ====================

  /**
   * Get fuel prices with pagination support
   * @param params - Query parameters
   * @returns Promise<PaginatedResponse<FuelPrice>> Fuel prices data
   */
  async getFuelPrices(params: PriceQueryParams = {}): Promise<PaginatedResponse<FuelPrice>> {
    try {
      const defaultParams = {
        user_field_names: true,
        size: 50,
        ...params
      };
      
      const response = await this.client.get(
        `/database/rows/table/${this.config.tables.fuelPrices.id}/`,
        { params: defaultParams }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching fuel prices:', (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Create a new fuel price entry
   * @param priceData - Price data
   * @returns Promise<FuelPrice> Created price entry
   */
  async createFuelPrice(priceData: CreateFuelPriceRequest): Promise<FuelPrice> {
    try {
      const response = await this.client.post(
        `/database/rows/table/${this.config.tables.fuelPrices.id}/`,
        priceData
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating fuel price:', (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Link fuel prices to a station
   * @param stationId - Station ID
   * @param priceIds - Array of price IDs
   * @returns Promise<PetrolStation> Updated station
   */
  async linkFuelPricesToStation(stationId: number, priceIds: number[]): Promise<PetrolStation> {
    try {
      const response = await this.client.patch(
        `/database/rows/table/${this.config.tables.petrolStations.id}/${stationId}/`,
        {
          [this.config.fieldIds.petrolStations.fuelPrices]: priceIds
        }
      );
      
      return this.transformStationData(response.data);
    } catch (error) {
      console.error(`Error linking prices to station ${stationId}:`, (error as AxiosError).message);
      throw this.handleError(error as AxiosError);
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Transform raw station data to our interface
   * @param data - Raw station data from Baserow
   * @returns PetrolStation - Transformed station data
   */
  private transformStationData(data: any): PetrolStation {
    return {
      id: data.id,
      stationName: data[this.config.fieldIds.petrolStations.stationName] || '',
      address: data[this.config.fieldIds.petrolStations.address] || '',
      city: data[this.config.fieldIds.petrolStations.city] || '',
      postalCode: data[this.config.fieldIds.petrolStations.postalCode] || '',
      region: data[this.config.fieldIds.petrolStations.region] || '',
      country: data[this.config.fieldIds.petrolStations.country] || 'AUSTRALIA',
      latitude: parseFloat(data[this.config.fieldIds.petrolStations.latitude]) || 0,
      longitude: parseFloat(data[this.config.fieldIds.petrolStations.longitude]) || 0,
      category: data[this.config.fieldIds.petrolStations.category] || '',
      fuelPrices: data[this.config.fieldIds.petrolStations.fuelPrices] || [],
      locationDetails: data[this.config.fieldIds.petrolStations.locationDetails] || '',
      brand: data.brand || [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  /**
   * Handle API errors consistently
   * @param error - Axios error
   * @returns ApiError - Standardized error
   */
  private handleError(error: AxiosError): ApiError {
    const apiError = new Error() as ApiError;
    
    if (error.response) {
      // Server responded with error status
      apiError.status = error.response.status;
      apiError.message = (error.response.data as BaserowError)?.error || error.message;
    } else if (error.request) {
      // Request was made but no response received
      apiError.status = 503;
      apiError.message = 'Service unavailable';
    } else {
      // Something else happened
      apiError.status = 500;
      apiError.message = error.message || 'Internal server error';
    }
    
    return apiError;
  }

  /**
   * Test connection to Baserow API
   * @returns Promise<Object> Connection test result
   */
  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      await this.client.get('/database/tables/all-tables/');
      return {
        connected: true,
        message: 'Successfully connected to Baserow API'
      };
    } catch (error) {
      return {
        connected: false,
        message: `Connection failed: ${(error as AxiosError).message}`
      };
    }
  }
} 