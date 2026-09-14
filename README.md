# PC Kumba-Mbeng frontend

Run commands from this directory:

```sh
npm install
npm run dev
```

Open the Local URL printed by Next.js (normally http://localhost:3000).
If that port is occupied, Next.js chooses the next available port.

For a production server, run `npm run build` followed by `npm start`.

The active Next.js application lives in `app/`, with shared code in
`components/`, `lib/`, and `providers/`. PostCSS explicitly loads
`tailwind.config.ts` for its styles.

The older Vite application is retained in `App.tsx`, `index.tsx`, and `src/`.
Its screens live in `src/views/` because Next.js reserves `src/pages/` for routes.
The Next.js TypeScript configuration checks the active application only.

## Contact form and admin inbox

The public `/contact` page submits to `POST /api/contact` using
`NEXT_PUBLIC_API_URL`. It collects name, email, optional phone, subject, and
message. The backend validates submissions and allows five submissions per IP
per 15 minutes. Messages are saved in MySQL; they are not sent as emails.

Administrators can read submissions at `/admin/contact-messages` through the
Contact Messages navigation item. Its API, `GET /api/admin/contact-messages`,
requires an administrator session and supports `?page=1` (20 messages per page).

Before starting an updated backend, run `npm run migrate` from `backend/` to
create the contact table. Restart the backend to load new routes. Ensure its
`CORS_ORIGIN` matches the frontend's actual origin, including its port.

The map uses a Google Maps search for the church's listed address; update the
`mapQuery` in the contact page if a verified map location becomes available.

To check the contact API with a mocked database, run from `backend/`:

```sh
npm run build
node --test tests/contact.test.cjs
```

## Facebook embed trial

The News page currently embeds the public CBS Radio Buea and CBS Radio Bamenda
Facebook timelines without API tokens. Facebook controls the content inside each
frame; browser settings and Facebook restrictions can affect whether posts load.
Each section includes a direct page link as a fallback.

To restore the previous API-backed News page, set `FACEBOOK_NEWS_MODE=api` in
`.env.local` and restart development (or rebuild for production). Remove that
setting to return to the embeds. The original feed is preserved in
`components/LegacyFacebookFeed.tsx`; backend sources and polling are unchanged.

Deployment setup: see [DEPLOYMENT.md](./DEPLOYMENT.md).
