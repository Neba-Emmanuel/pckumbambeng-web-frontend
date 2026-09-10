// Vercel serverless function: injects Open Graph / Twitter meta tags into the
// SPA's index.html for /blog/:slug requests so social shares (WhatsApp,
// Facebook, X, LinkedIn) display the blog's real image, title, and excerpt.

import {
  API_URL,
  SITE_URL,
  buildDescription,
  extractSlug,
  renderWithMeta,
  sendHtml,
} from "./_og-inject.js";

export default async function handler(req, res) {
  try {
    const slug = extractSlug(req, "blog");

    let blog = null;
    if (slug) {
      try {
        const apiRes = await fetch(
          `${API_URL}/blogs/${encodeURIComponent(slug)}`
        );
        if (apiRes.ok) blog = await apiRes.json();
      } catch (e) {
        // Fall back to defaults below.
      }
    }

    const html = await renderWithMeta({
      title: blog?.title ? `${blog.title} - MTMKay Blog` : "MTMKay Blog",
      description: buildDescription(
        blog?.content,
        "Read the latest articles on the MTMKay blog."
      ),
      image: blog?.imageUrl,
      pageUrl: `${SITE_URL}/blog/${slug}`,
    });

    sendHtml(res, html);
  } catch (err) {
    res.setHeader("Location", "/");
    res.status(302).end();
  }
}
