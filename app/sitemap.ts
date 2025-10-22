/**
 * Next.js Sitemap Route
 * Automatically generates sitemap.xml
 */

import { MetadataRoute } from 'next';
import { generateCompleteSitemap } from '@/lib/seo/sitemap';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return await generateCompleteSitemap();
}
