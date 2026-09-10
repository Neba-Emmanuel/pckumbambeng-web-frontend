// Vercel serverless function: injects Open Graph / Twitter meta tags into the
// SPA's index.html for /trainings/:slug requests so social shares (WhatsApp,
// Facebook, X, LinkedIn) display the training's real image, title, and summary.

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
    const slug = extractSlug(req, "trainings");

    let training = null;
    if (slug) {
      try {
        const apiRes = await fetch(
          `${API_URL}/trainings/${encodeURIComponent(slug)}`
        );
        if (apiRes.ok) training = await apiRes.json();
      } catch (e) {
        // Fall back to defaults below.
      }
    }

    const html = await renderWithMeta({
      title: training?.title
        ? `${training.title} - MTMKay Training`
        : "MTMKay Trainings",
      description: buildDescription(
        training?.summary,
        "Explore IT trainings in cybersecurity, cloud, web development and more at MTMKay."
      ),
      image: training?.imageUrl,
      pageUrl: `${SITE_URL}/trainings/${slug}`,
    });

    sendHtml(res, html);
  } catch (err) {
    res.setHeader("Location", "/");
    res.status(302).end();
  }
}
