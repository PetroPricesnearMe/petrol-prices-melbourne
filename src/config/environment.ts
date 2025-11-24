/**
 * Environment Configuration
 * Central configuration management for all environments
 */

export type Environment = 'development' | 'test' | 'preview' | 'production';

interface EnvironmentConfig {
  env: Environment;
  isDevelopment: boolean;
  isTest: boolean;
  isPreview: boolean;
  isProduction: boolean;
  api: {
    url: string;
    timeout: number;
  };
  baserow: {
    apiUrl: string;
    apiToken: string;
    databaseId: string;
    stationsTableId: string;
    pricesTableId: string;
  };
  fairFuel: {
    enabled: boolean;
    baseUrl: string;
    consumerId?: string;
    userAgent: string;
    cacheTtlMs: number;
    requestTimeoutMs: number;
  };
  features: {
    analytics: boolean;
    pwa: boolean;
    debugMode: boolean;
    cache: boolean;
  };
  monitoring: {
    sentryDsn?: string;
    sentryEnv: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  security: {
    rateLimitMax: number;
    rateLimitWindow: number;
    corsOrigin: string;
  };
  cache: {
    ttl: number;
    enabled: boolean;
  };
}

const getEnvironment = (): Environment => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || 'development';

  if (['development', 'test', 'preview', 'production'].includes(env)) {
    return env as Environment;
  }

  return 'development';
};

const env = getEnvironment();

export const config: EnvironmentConfig = {
  env,
  isDevelopment: env === 'development',
  isTest: env === 'test',
  isPreview: env === 'preview',
  isProduction: env === 'production',

  api: {
    url: process.env.NEXT_PUBLIC_API_URL ||
         (env === 'production'
           ? 'https://your-production-url.com/api'
           : 'http://localhost:3000/api'),
    timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
  },

  baserow: {
    apiUrl: process.env.BASEROW_API_URL || 'https://api.baserow.io',
    apiToken: process.env.BASEROW_API_TOKEN || '',
    databaseId: process.env.BASEROW_DATABASE_ID || '',
    stationsTableId: process.env.BASEROW_STATIONS_TABLE_ID || '623329',
    pricesTableId: process.env.BASEROW_PRICES_TABLE_ID || '623330',
  },

  fairFuel: {
    enabled: Boolean(process.env.FAIRFUEL_CONSUMER_ID),
    baseUrl:
      process.env.FAIRFUEL_API_BASE_URL ||
      'https://api.fuel.service.vic.gov.au/open-data/v1',
    consumerId: process.env.FAIRFUEL_CONSUMER_ID,
    userAgent:
      process.env.FAIRFUEL_USER_AGENT || 'petrol-price-near-me/2.0.0',
    cacheTtlMs: parseInt(process.env.FAIRFUEL_CACHE_TTL_MS || '900000', 10),
    requestTimeoutMs: parseInt(
      process.env.FAIRFUEL_REQUEST_TIMEOUT_MS || '15000',
      10
    ),
  },

  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    pwa: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
    debugMode: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
    cache: process.env.ENABLE_CACHE !== 'false',
  },

  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    sentryEnv: process.env.SENTRY_ENV || env,
    logLevel: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
  },

  security: {
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300', 10),
    enabled: process.env.ENABLE_CACHE !== 'false',
  },
};

// Validate required environment variables in production
if (config.isProduction) {
  const required = [
    'BASEROW_API_TOKEN',
    'BASEROW_DATABASE_ID',
    'NEXTAUTH_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${missing.join(', ')}`
    );
  }
}

export default config;
