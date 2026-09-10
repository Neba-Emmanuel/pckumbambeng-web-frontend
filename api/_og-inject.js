// Shared helpers for injecting Open Graph / Twitter meta tags into the SPA's
// index.html for server-rendered link previews. Used by blog-og.js and
// training-og.js. Crawlers don't run JavaScript, so this gives them the real
// title, image, and description while real users still get the full SPA.

export const SITE_URL = "https://www.mtmkay.com";
export const API_URL = "https://mtmkay-backend.vercel.app/api";
export const DEFAULT_IMAGE = `${SITE_URL}/mtmkay_logo.png`;

// Escape values before placing them inside HTML attributes.
export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Strip HTML tags and collapse whitespace to build a plain-text excerpt.
export function buildDescription(content, fallback) {
  if (!content) return fallback || "Learn more on the MTMKay website.";
  const plain = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return fallback || "Learn more on the MTMKay website.";
  if (plain.length <= 160) return plain;
  return plain.substring(0, 157) + "...";
}

// Replace (or insert) a meta tag identified by property/name in the <head>.
export function upsertMeta(html, attr, key, value) {
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`;
  const pattern = new RegExp(
    `<meta[^>]*\\b${attr}=["']${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>`,
    "i"
  );
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

// Fetch the deployed index.html and inject the given preview metadata.
export async function renderWithMeta({ title, description, image, pageUrl }) {
  const htmlRes = await fetch(`${SITE_URL}/index.html`);
  let html = await htmlRes.text();

  const safeImage =
    image && /^https?:\/\//i.test(image) ? image : DEFAULT_IMAGE;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`
  );

  html = upsertMeta(html, "name", "description", description);
  html = upsertMeta(html, "property", "og:type", "article");
  html = upsertMeta(html, "property", "og:title", title);
  html = upsertMeta(html, "property", "og:description", description);
  html = upsertMeta(html, "property", "og:url", pageUrl);
  html = upsertMeta(html, "property", "og:image", safeImage);
  html = upsertMeta(html, "name", "twitter:card", "summary_large_image");
  html = upsertMeta(html, "name", "twitter:title", title);
  html = upsertMeta(html, "name", "twitter:description", description);
  html = upsertMeta(html, "name", "twitter:image", safeImage);

  html = html.replace(
    /<link[^>]*rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(pageUrl)}" />`
  );

  return html;
}

// Extract the slug from Vercel's query param or by parsing the request URL.
export function extractSlug(req, prefix) {
  return (
    (req.query && req.query.slug) ||
    (req.url || "")
      .split("?")[0]
      .replace(new RegExp(`^/${prefix}/`), "")
      .replace(/\/$/, "")
  );
}

// Send the rendered HTML with edge caching, or redirect home on failure.
export function sendHtml(res, html) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=300, stale-while-revalidate=600"
  );
  res.status(200).send(html);
}
