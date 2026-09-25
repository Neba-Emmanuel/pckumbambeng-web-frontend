import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { listAllItems } from '@/lib/server-api';

// Rebuild hourly so newly published sermons and announcements are picked up.
export const revalidate = 3600;

interface StaticRoute {
  path: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

const staticRoutes: StaticRoute[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/sermons', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/announcements', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/events', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/events/archive', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/events/cultural-harvest-2026', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/news', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/leadership', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/games', changeFrequency: 'monthly', priority: 0.4 },
];

function safeDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Fetch one list; never throws so a single failing endpoint keeps the sitemap alive. */
async function tryList(path: string) {
  try {
    return await listAllItems(path);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [sermons, announcements] = await Promise.all([
    tryList('/api/sermons'),
    tryList('/api/announcements'),
  ]);

  for (const sermon of sermons) {
    entries.push({
      url: absoluteUrl(`/sermons/${sermon.id}`),
      lastModified: safeDate(sermon.sermon_date),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  for (const announcement of announcements) {
    entries.push({
      url: absoluteUrl(`/announcements/${announcement.id}`),
      lastModified: safeDate(announcement.published_at ?? announcement.updated_at),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  return entries;
}
