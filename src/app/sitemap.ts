import { MetadataRoute } from 'next';
import { getDatabase } from '../lib/data/store';

function parseSafeDate(dateStr?: string): Date {
  if (!dateStr) return new Date();
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split('.');
    const parsed = new Date(`${y}-${m}-${d}`);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://map.org.ua';
  const db = await getDatabase();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/who-we-are`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reports`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const newsPages: MetadataRoute.Sitemap = db.news
    .filter((item) => item.status === 'published')
    .map((item) => ({
      url: `${baseUrl}/news/${item.slug || item.id}`,
      lastModified: parseSafeDate(item.date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [...staticPages, ...newsPages];
}
