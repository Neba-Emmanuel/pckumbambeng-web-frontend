import { cache } from 'react';

/**
 * Server-only data helpers used by `generateMetadata`, server-rendered pages
 * and the sitemap. Client components must keep using `lib/api-client`.
 *
 * Server-side fetches need an absolute URL, so they go straight to the
 * backend origin (the same origin `next.config.js` rewrites proxy to).
 */

export interface SermonDetail {
  preacher_image: string | null;
  id: number;
  title: string;
  speaker: string;
  sermon_date: string;
  content_type: 'audio' | 'text';
  text_content: string | null;
}

export interface AnnouncementDetail {
  id: number;
  title: string;
  body: string;
  published_at: string;
  attachment_path?: string;
  attachment_type?: string;
}

export interface CmsListItem {
  id: number;
  title?: string;
  sermon_date?: string;
  published_at?: string;
  updated_at?: string;
}

/** Thrown when the backend answers 404; callers convert this into `null`. */
export class BackendNotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'BackendNotFoundError';
  }
}

/**
 * Origin of the backend API. Mirrors `lib/api-base.ts`: in development the
 * client calls `NEXT_PUBLIC_API_URL` directly, and in production it calls
 * same-origin `/api` which `next.config.js` rewrites to `BACKEND_URL`.
 */
export function backendOrigin(): string {
  const origin =
    process.env.NODE_ENV === 'production'
      ? process.env.BACKEND_URL || 'http://localhost:3001'
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return origin.replace(/\/+$/, '');
}

async function fetchBackend<T>(path: string, revalidate: number): Promise<T> {
  const res = await fetch(`${backendOrigin()}${path}`, {
    headers: { accept: 'application/json' },
    next: { revalidate },
  });
  if (res.status === 404) throw new BackendNotFoundError();
  if (!res.ok) throw new Error(`Backend request failed (${res.status}): ${path}`);

  const body = await res.json();
  if (body && body.success === false) {
    throw new Error(body?.error?.message || `Request failed: ${path}`);
  }
  return (body?.data ?? body) as T;
}

/**
 * Fetch a sermon by id. Returns `null` for missing/invalid ids (→ `notFound()`)
 * and throws when the backend is unreachable so callers can fall back to
 * client-side rendering instead of hard-failing the page.
 *
 * Wrapped in React `cache` so `generateMetadata` and the page share one request.
 */
export const getSermon = cache(
  async (id: string): Promise<SermonDetail | null> => {
    if (!/^\d+$/.test(id)) return null;
    try {
      return await fetchBackend<SermonDetail>(`/api/sermons/${id}`, 300);
    } catch (error) {
      if (error instanceof BackendNotFoundError) return null;
      throw error;
    }
  }
);

/** Fetch an announcement by id. Same contract as {@link getSermon}. */
export const getAnnouncement = cache(
  async (id: string): Promise<AnnouncementDetail | null> => {
    if (!/^\d+$/.test(id)) return null;
    try {
      return await fetchBackend<AnnouncementDetail>(`/api/announcements/${id}`, 300);
    } catch (error) {
      if (error instanceof BackendNotFoundError) return null;
      throw error;
    }
  }
);

/**
 * Enumerate a paginated CMS list endpoint (sermons, announcements) for the
 * sitemap. Returns `[]` if the first page fails so the sitemap still renders
 * its static routes.
 */
export async function listAllItems(path: string): Promise<CmsListItem[]> {
  const items: CmsListItem[] = [];
  for (let page = 1; page <= 50; page += 1) {
    const res = await fetch(`${backendOrigin()}${path}?page=${page}`, {
      headers: { accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) break;
    const body = await res.json().catch(() => null);
    const data: unknown = body?.data;
    if (!Array.isArray(data) || data.length === 0) break;
    items.push(...(data as CmsListItem[]));
    const total: unknown = body?.meta?.total;
    if (typeof total === 'number' && items.length >= total) break;
    if ((data as unknown[]).length < 20) break;
  }
  return items;
}
