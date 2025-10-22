/**
 * Web Vitals Analytics API
 * Receives and stores Web Vitals metrics
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface WebVitalMetric {
  metric: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  page: string;
  timestamp: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data: WebVitalMetric = JSON.parse(req.body || '{}');

    // Validate data
    if (!data.metric || !data.value || !data.page) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    // Log metrics (in production, send to your analytics service)
    console.log('📊 Web Vital Received:', {
      metric: data.metric,
      value: Math.round(data.value),
      rating: data.rating,
      page: data.page,
    });

    // Store in database or analytics service
    // await storeMetric(data);

    // Send to external analytics (optional)
    // await sendToDatadog(data);
    // await sendToNewRelic(data);
    // await sendToSentry(data);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing web vitals:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Optional: Store metrics for analysis
// async function _storeMetric(data: WebVitalMetric) {
//   // Implementation depends on your storage solution
//   // Examples:
//   // - Store in database
//   // - Send to cloud storage
//   // - Aggregate in memory for periodic batch sending
// }
