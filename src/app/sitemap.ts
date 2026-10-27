import { MetadataRoute } from 'next';
import { getDatabase } from '../lib/data/store';
import { LOCALES, SITE_URL, localizePath } from '../lib/i18n';

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
  const db = await getDatabase();

  // Every page is listed once per language, each entry carrying hreflang alternates
  const entry = (
    path: string,
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>,
    priority: number,
    lastModified: Date = new Date()
  ): MetadataRoute.Sitemap =>
    LOCALES.map((lang) => ({
      url: `${SITE_URL}${localizePath(path, lang)}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          uk: `${SITE_URL}${localizePath(path, 'ua')}`,
          en: `${SITE_URL}${localizePath(path, 'en')}`,
        },
      },
    }));

  const staticPages: MetadataRoute.Sitemap = [
    ...entry('/', 'daily', 1.0),
    ...entry('/who-we-are', 'monthly', 0.9),
    ...entry('/projects', 'weekly', 0.9),
    ...entry('/news', 'daily', 0.8),
    ...entry('/reports', 'monthly', 0.7),
    ...entry('/contacts', 'monthly', 0.7),
    ...entry('/privacy-policy', 'yearly', 0.3),
  ];

  const newsPages: MetadataRoute.Sitemap = db.news
    .filter((item) => item.status === 'published')
    .flatMap((item) => entry(`/news/${item.slug || item.id}`, 'weekly', 0.8, parseSafeDate(item.date)));

  return [...staticPages, ...newsPages];
}
