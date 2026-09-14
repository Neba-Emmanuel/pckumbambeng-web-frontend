/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optional isolated output for local production checks alongside a dev server.
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  async rewrites() {
    const backend = process.env.BACKEND_URL?.replace(/\/$/, '');
    if (!backend) {
      if (process.env.VERCEL) throw new Error('Set BACKEND_URL to the backend HTTPS origin before deploying the frontend.');
      return [];
    }
    const url = new URL(backend);
    if (url.pathname !== '/' || url.search || url.hash || url.username || url.password || (process.env.VERCEL && url.protocol !== 'https:')) {
      throw new Error('BACKEND_URL must be an HTTPS origin without a path, query, or credentials.');
    }
    return [
      { source: '/api/:path*', destination: `${backend}/api/:path*` },
      { source: '/uploads/:path*', destination: `${backend}/uploads/:path*` },
    ];
  },
};

module.exports = nextConfig;
