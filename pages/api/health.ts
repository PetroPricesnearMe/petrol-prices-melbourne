/**
 * Health Check API Endpoint
 * Monitors application health and dependencies
 */

import type { NextApiRequest, NextApiResponse } from 'next';

type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

interface HealthCheckResponse {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: {
      status: HealthStatus;
      responseTime?: number;
      error?: string;
    };
    memory: {
      status: HealthStatus;
      usage: {
        heapUsed: number;
        heapTotal: number;
        percentage: number;
      };
    };
    environment: {
      status: HealthStatus;
      node: string;
      platform: string;
    };
  };
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<{ status: HealthStatus; responseTime?: number; error?: string }> {
  const startTime = Date.now();

  try {
    // Check Baserow API
    const baserowUrl = process.env.BASEROW_API_URL || 'https://api.baserow.io';
    const token = process.env.BASEROW_API_TOKEN;

    if (!token) {
      return {
        status: 'degraded',
        error: 'Database token not configured',
      };
    }

    const response = await fetch(`${baserowUrl}/api/user/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        status: 'healthy',
        responseTime,
      };
    } else {
      return {
        status: 'degraded',
        responseTime,
        error: `Database returned status ${response.status}`,
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      status: 'unhealthy',
      responseTime,
      error: error instanceof Error ? error.message : 'Database check failed',
    };
  }
}

/**
 * Check memory usage
 */
function checkMemory(): { status: HealthStatus; usage: any } {
  const memoryUsage = process.memoryUsage();
  const heapUsedPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

  let status: HealthStatus = 'healthy';
  if (heapUsedPercentage > 90) {
    status = 'unhealthy';
  } else if (heapUsedPercentage > 75) {
    status = 'degraded';
  }

  return {
    status,
    usage: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round(heapUsedPercentage),
    },
  };
}

/**
 * Check environment
 */
function checkEnvironment(): { status: HealthStatus; node: string; platform: string } {
  return {
    status: 'healthy',
    node: process.version,
    platform: process.platform,
  };
}

/**
 * Determine overall health status
 */
function determineOverallStatus(checks: HealthCheckResponse['checks']): HealthStatus {
  const statuses = [
    checks.database.status,
    checks.memory.status,
    checks.environment.status,
  ];

  if (statuses.includes('unhealthy')) {
    return 'unhealthy';
  }
  if (statuses.includes('degraded')) {
    return 'degraded';
  }
  return 'healthy';
}

/**
 * Health check endpoint handler
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse | { error: string }>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Run all health checks
    const [database, memory, environment] = await Promise.all([
      checkDatabase(),
      Promise.resolve(checkMemory()),
      Promise.resolve(checkEnvironment()),
    ]);

    const checks = {
      database,
      memory,
      environment,
    };

    const status = determineOverallStatus(checks);

    const response: HealthCheckResponse = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
      checks,
    };

    // Set appropriate status code
    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

    // Add cache headers to prevent caching of health checks
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(statusCode).json(response);
  } catch (error) {
    console.error('Health check failed:', error);

    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
      checks: {
        database: {
          status: 'unhealthy',
          error: 'Health check failed',
        },
        memory: checkMemory(),
        environment: checkEnvironment(),
      },
    });
  }
}
