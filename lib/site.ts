import type { Metadata } from 'next';

export const SITE_NAME = 'PC Kumba-Mbeng';

export const DEFAULT_DESCRIPTION =
  'Presbyterian Church in Cameroon — Kumba-Mbeng Congregation. Join us for worship, sermons, events and fellowship in Kumba, Cameroon.';

export const DEFAULT_OG_IMAGE = '/hero-banner.png';
export const DEFAULT_OG_IMAGE_ALT = 'Congregation worship at PC Kumba-Mbeng';

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  // Vercel provides these at build/runtime until a custom domain is attached.
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;
  const preview = process.env.VERCEL_URL;
  if (preview) return `https://${preview}`;
  return 'http://localhost:3000';
}

/** Canonical origin for canonical URLs, sitemaps and social previews. */
export const SITE_URL = resolveSiteUrl();

/** Build an absolute URL from a site-relative path (or pass through absolute URLs). */
export function absoluteUrl(path: string = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Resolve an uploads path (blob URL or relative) to an absolute URL for social crawlers. */
export function resolveUploadUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return absoluteUrl(`/uploads/${path.replace(/^\/?uploads\//, '')}`);
}

export interface PageMetaOptions {
  /** Page title. The root layout template appends " | PC Kumba-Mbeng" unless `absoluteTitle`. */
  title?: string;
  description?: string;
  /** Canonical path (e.g. `/sermons/42`). Omit to leave the canonical unset. */
  path?: string;
  /** Image for social previews — absolute or site-relative. Defaults to the site banner. */
  image?: string;
  imageAlt?: string;
  /** Mark the page as noindex (e.g. missing resources, login). */
  noindex?: boolean;
  type?: 'website' | 'article';
  /** Use the title verbatim instead of appending the site name. */
  absoluteTitle?: boolean;
}

/**
 * Builds a complete Metadata object so every page ships title, description,
 * canonical URL, Open Graph and Twitter card tags together. Shallow-merging
 * with parent layouts is per top-level key, so this always returns the full
 * `openGraph`/`twitter` objects to avoid inheriting a parent's page title.
 *
 * The title is returned as `{ absolute }` with the site-name suffix already
 * appended — title templates only apply from the nearest ancestor layout, so
 * a plain string title on a dynamic page (e.g. `/sermons/[id]`) would lose
 * the suffix defined in the root layout.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  noindex,
  type = 'website',
  absoluteTitle,
}: PageMetaOptions = {}): Metadata {
  const desc = description ?? DEFAULT_DESCRIPTION;
  const fullTitle =
    absoluteTitle || !title ? (title ?? SITE_NAME) : `${title} | ${SITE_NAME}`;
  const canonical = path ? absoluteUrl(path) : undefined;
  const imageUrl = absoluteUrl(image ?? DEFAULT_OG_IMAGE);

  return {
    ...(title ? { title: { absolute: fullTitle } } : {}),
    description: desc,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: fullTitle,
      description: desc,
      siteName: SITE_NAME,
      locale: 'en_US',
      type,
      ...(canonical ? { url: canonical } : {}),
      images: [{ url: imageUrl, alt: imageAlt ?? DEFAULT_OG_IMAGE_ALT }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [imageUrl],
    },
  };
}
