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
