# Frontend deployment on Vercel

Deploy the backend first, then import this directory as a second Vercel project.
For a combined repository choose Root Directory `frontend`; for this standalone
frontend repository choose `.`. Select Next.js, Node.js 24.x, `npm ci`, and
`npm run build`. Leave the Output Directory at its default. No static export is
used: API proxying needs the Next.js server.

## Environment variables

- `BACKEND_URL`: required HTTPS origin of your backend, e.g.
  `https://church-api.vercel.app`. Do not include `/api` or a trailing path.
  Configure the correct backend for each Production/Preview environment.
- `FACEBOOK_NEWS_MODE`: leave unset or use `embed` for the free newsroom;
  `api` restores the legacy feed and requires configured backend tokens/polling.
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: optional, matching the backend push key.

The backend Blob store and all secrets belong in the BACKEND project. Production
browser requests use the frontend's own `/api` paths; Next.js proxies them to
BACKEND_URL. This keeps httpOnly login cookies first-party even when projects use
different vercel.app domains. Do not replace this with a cross-site public API URL.
`NEXT_PUBLIC_API_URL` is only used during local development.

`BACKEND_URL` is read at build time: redeploy after changing it. To test production
locally, set BACKEND_URL to the running local backend origin, then run
`npm run build` and `npm start`. Large uploads require Blob in production mode.

## Preview and launch

Deploy both projects as previews first with appropriate preview database/storage.
Make sure the backend URL is reachable by the frontend proxy (Vercel Deployment
Protection can otherwise return a sign-in page instead of JSON).

Verify `/api/health` through the FRONTEND domain, login/logout, contact submissions,
announcement attachments, sermon playback, event editing, and the custom harvest
page. Facebook embeds remain dependent on Facebook and visitors' browser settings.

The service worker is push-only and does not cache pages or API responses.

No project has been deployed and no custom domain has been attached by these
preparation changes. Configure the projects and environment values before
publishing. See the backend DEPLOYMENT.md for storage and database setup.
