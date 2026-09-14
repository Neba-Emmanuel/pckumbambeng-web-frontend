// Production requests stay on the frontend origin so admin cookies work on
// separate Vercel projects. Next.js forwards /api and /uploads to the backend.
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? ''
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
