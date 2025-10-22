/**
 * Liveness Check API Endpoint
 * Indicates if the application is alive and running
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface LivenessResponse {
  alive: boolean;
  timestamp: string;
  uptime: number;
}

/**
 * Liveness probe handler
 * Used by container orchestrators to determine if the process is alive
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LivenessResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      alive: false,
      timestamp: new Date().toISOString(),
      uptime: 0
    });
  }

  // Prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  // Simple liveness check - if we can respond, we're alive
  return res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
