import dotenv from 'dotenv';
import { Config, EnvironmentVariables } from '../types';

// Load environment variables
dotenv.config();

const env = process.env as EnvironmentVariables;

const config: Config = {
  // Server Configuration
  port: parseInt(env.PORT || '3001', 10),
  nodeEnv: env.NODE_ENV || 'development',
  
  // Baserow API Configuration
  baserow: {
    token: env.BASEROW_TOKEN || 'WXGOdiCeNmvdj5NszzAdvIug3InwQQXP',
    apiUrl: env.BASEROW_API_URL || 'https://api.baserow.io/api',
    databaseId: 265358,
    tables: {
      petrolStations: {
        id: 623329,
        name: 'Petrol Stations'
      },
      fuelPrices: {
        id: 623330,
        name: 'Fuel Prices'
      },
      airtableImport: {
        id: 623331,
        name: 'Airtable import report'
      }
    },
    fieldIds: {
      petrolStations: {
        stationName: 'field_5072130',
        address: 'field_5072131',
        city: 'field_5072132',
        postalCode: 'field_5072133',
        region: 'field_5072134',
        country: 'field_5072135',
        latitude: 'field_5072136',
        longitude: 'field_5072137',
        category: 'field_5072138',
        fuelPrices: 'field_5072139',
        locationDetails: 'field_5072140'
      }
    }
  },
  
  // CORS Configuration
  cors: {
    origin: env.FRONTEND_URL ? [env.FRONTEND_URL] : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  
  // Application Settings
  app: {
    name: env.APP_NAME || 'Petrol Prices Near Me',
    description: env.APP_DESCRIPTION || 'Melbourne Petrol Stations'
  },

  // Redis Configuration (optional)
  ...(env.REDIS_HOST && {
    redis: {
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT || '6379', 10),
      ...(env.REDIS_PASSWORD && { password: env.REDIS_PASSWORD }),
      ...(env.REDIS_DB && { db: parseInt(env.REDIS_DB, 10) })
    }
  }),

  // Sentry Configuration (optional)
  ...(env.SENTRY_DSN && {
    sentry: {
      dsn: env.SENTRY_DSN,
      environment: env.SENTRY_ENVIRONMENT || env.NODE_ENV || 'development',
      tracesSampleRate: parseFloat(env.SENTRY_TRACES_SAMPLE_RATE || '0.1')
    }
  })
};

export default config; 