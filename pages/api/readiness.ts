/**
 * Readiness Check API Endpoint
 * Indicates if the application is ready to serve traffic
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface ReadinessResponse {
  ready: boolean;
  timestamp: string;
  message?: string;
}

/**
 * Readiness probe handler
 * Used by load balancers to determine if the instance can receive traffic
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReadinessResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      ready: false,
      timestamp: new Date().toISOString(),
      message: 'Method not allowed'
    });
  }

  try {
    // Check if required environment variables are set
    const requiredEnvVars = [
      'BASEROW_API_URL',
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      return res.status(503).json({
        ready: false,
        timestamp: new Date().toISOString(),
        message: `Missing required environment variables: ${missingVars.join(', ')}`,
      });
    }

    // Application is ready
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    return res.status(200).json({
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(503).json({
      ready: false,
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Readiness check failed',
    });
  }
}
