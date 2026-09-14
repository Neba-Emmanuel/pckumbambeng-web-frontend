// Push-only worker: never cache authenticated API responses or application HTML.
self.addEventListener('push', event => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); } catch { return; }
  event.waitUntil(self.registration.showNotification(payload.title || 'PC Kumba-Mbeng', {
    body: payload.body || '',
    icon: '/pcc-logo.png',
    data: { url: payload.url || '/' },
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  let target;
  try { target = new URL(event.notification.data?.url || '/', self.location.origin); }
  catch { target = new URL('/', self.location.origin); }
  if (target.origin !== self.location.origin) target = new URL('/', self.location.origin);
  event.waitUntil(clients.openWindow(target.href));
});
