/**
 * Health check endpoint
 * GET /api/health
 */
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    framework: 'Next.js'
  });
}

