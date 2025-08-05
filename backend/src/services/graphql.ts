import { gql } from 'apollo-server-express';
import { BaserowClient } from './BaserowClient';
import { PetrolStation, FuelPrice, StationQueryParams, PriceQueryParams } from '../types';

// GraphQL Schema
export const typeDefs = gql`
  type PetrolStation {
    id: ID!
    stationName: String!
    address: String!
    city: String!
    postalCode: String!
    region: String!
    country: String!
    latitude: Float!
    longitude: Float!
    category: String!
    locationDetails: String
    brand: [String!]
    fuelPrices: [FuelPrice!]
    createdAt: String
    updatedAt: String
  }

  type FuelPrice {
    id: ID!
    priceSource: String!
    fuelType: String!
    pricePerLiter: Float!
    lastUpdated: String!
    priceTrend: String!
    petrolStation: [Int!]
    locations: String
    createdAt: String
    updatedAt: String
  }

  type PaginatedStations {
    results: [PetrolStation!]!
    count: Int!
    next: String
    previous: String
  }

  type PaginatedPrices {
    results: [FuelPrice!]!
    count: Int!
    next: String
    previous: String
  }

  type Query {
    # Petrol Stations
    stations(
      size: Int
      page: Int
      search: String
      city: String
      region: String
    ): PaginatedStations!
    
    allStations: [PetrolStation!]!
    
    station(id: ID!): PetrolStation
    
    # Fuel Prices
    fuelPrices(
      size: Int
      page: Int
      fuelType: String
    ): PaginatedPrices!
    
    # Baserow Metadata
    tables: [Table!]!
    tableFields(tableId: Int!): [Field!]!
    
    # Health Check
    health: Health!
  }

  type Table {
    id: Int!
    name: String!
    order: Int!
    database_id: Int!
  }

  type Field {
    id: Int!
    name: String!
    type: String!
    table_id: Int!
  }

  type Health {
    status: String!
    timestamp: String!
    version: String!
  }

  type Mutation {
    # Create operations
    createStation(input: CreateStationInput!): PetrolStation!
    createFuelPrice(input: CreateFuelPriceInput!): FuelPrice!
    
    # Update operations
    updateStation(id: ID!, input: UpdateStationInput!): PetrolStation!
    linkPricesToStation(stationId: ID!, priceIds: [Int!]!): PetrolStation!
    
    # Delete operations
    deleteStation(id: ID!): Boolean!
  }

  input CreateStationInput {
    stationName: String!
    address: String!
    city: String!
    postalCode: String!
    region: String!
    country: String
    latitude: Float!
    longitude: Float!
    category: String
    locationDetails: String
    brand: [String!]
  }

  input UpdateStationInput {
    stationName: String
    address: String
    city: String
    postalCode: String
    region: String
    country: String
    latitude: Float
    longitude: Float
    category: String
    locationDetails: String
    brand: [String!]
  }

  input CreateFuelPriceInput {
    priceSource: String!
    fuelType: String!
    pricePerLiter: Float!
    lastUpdated: String!
    priceTrend: String!
    petrolStation: [Int!]
    locations: String
  }
`;

// GraphQL Resolvers
export const resolvers = {
  Query: {
    // Petrol Stations
    stations: async (_: any, args: any) => {
      const baserowClient = new BaserowClient();
      const params: StationQueryParams = {
        ...(args.size && { size: args.size }),
        ...(args.page && { page: args.page }),
        ...(args.search && { search: args.search }),
        user_field_names: true
      };
      
      if (args.city) {
        params.filter__field_5072132__equal = args.city;
      }
      
      if (args.region) {
        params.filter__field_5072134__equal = args.region;
      }
      
      return await baserowClient.getPetrolStations(params);
    },

    allStations: async () => {
      const baserowClient = new BaserowClient();
      return await baserowClient.getAllPetrolStations();
    },

    station: async (_: any, { id }: { id: string }) => {
      const baserowClient = new BaserowClient();
      return await baserowClient.getPetrolStation(parseInt(id, 10));
    },

    // Fuel Prices
    fuelPrices: async (_: any, args: any) => {
      const baserowClient = new BaserowClient();
      const params: PriceQueryParams = {
        ...(args.size && { size: args.size }),
        ...(args.page && { page: args.page }),
        user_field_names: true
      };
      
      if (args.fuelType) {
        params.filter__field_5072408__equal = args.fuelType;
      }
      
      return await baserowClient.getFuelPrices(params);
    },

    // Baserow Metadata
    tables: async () => {
      const baserowClient = new BaserowClient();
      const tables = await baserowClient.getAllTables();
      return tables.tables || [];
    },

    tableFields: async (_: any, { tableId }: { tableId: number }) => {
      const baserowClient = new BaserowClient();
      return await baserowClient.getTableFields(tableId);
    },

    // Health Check
    health: () => ({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })
  },

  Mutation: {
    // Create operations
    createStation: async (_: any, { input }: { input: any }) => {
      const baserowClient = new BaserowClient();
      return await baserowClient.createPetrolStation(input);
    },

    createFuelPrice: async (_: any, { input }: { input: any }) => {
      const baserowClient = new BaserowClient();
      return await baserowClient.createFuelPrice(input);
    },

    // Update operations
    updateStation: async (_: any, { id, input }: { id: string; input: any }) => {
      const baserowClient = new BaserowClient();
      return await baserowClient.updatePetrolStation(parseInt(id, 10), input);
    },

    linkPricesToStation: async (_: any, { stationId, priceIds }: { stationId: string; priceIds: number[] }) => {
      const baserowClient = new BaserowClient();
      return await baserowClient.linkFuelPricesToStation(parseInt(stationId, 10), priceIds);
    },

    // Delete operations
    deleteStation: async (_: any, { id }: { id: string }) => {
      const baserowClient = new BaserowClient();
      await baserowClient.deletePetrolStation(parseInt(id, 10));
      return true;
    }
  },

  // Field resolvers for nested data
  PetrolStation: {
    createdAt: (parent: PetrolStation) => parent.created_at,
    updatedAt: (parent: PetrolStation) => parent.updated_at
  },

  FuelPrice: {
    createdAt: (parent: FuelPrice) => parent.created_at,
    updatedAt: (parent: FuelPrice) => parent.updated_at
  }
}; 