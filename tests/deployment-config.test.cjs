const { test } = require('node:test');
const assert = require('node:assert/strict');
const config = require('../next.config');

test('production proxy accepts only a configured backend origin', async () => {
  const oldBackend = process.env.BACKEND_URL;
  const oldVercel = process.env.VERCEL;
  process.env.VERCEL = '1';
  try {
    delete process.env.BACKEND_URL;
    await assert.rejects(config.rewrites(), /BACKEND_URL/);
    for (const url of ['http://example.com', 'https://example.com/api', 'https://user:pass@example.com', 'https://example.com?x=1']) {
      process.env.BACKEND_URL = url;
      await assert.rejects(config.rewrites());
    }
    process.env.BACKEND_URL = 'https://church-api.vercel.app/';
    assert.deepEqual(await config.rewrites(), [
      { source: '/api/:path*', destination: 'https://church-api.vercel.app/api/:path*' },
      { source: '/uploads/:path*', destination: 'https://church-api.vercel.app/uploads/:path*' },
    ]);
  } finally {
    if (oldBackend === undefined) delete process.env.BACKEND_URL; else process.env.BACKEND_URL = oldBackend;
    if (oldVercel === undefined) delete process.env.VERCEL; else process.env.VERCEL = oldVercel;
  }
});
