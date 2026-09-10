// Service Worker for PC Kumba-Mbeng PWA push notifications

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = {
      title: 'PC Kumba-Mbeng',
      body: event.data.text(),
      url: '/',
    };
  }

  const { title, body, url } = payload;

  const options = {
    body: body || '',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    data: { url: url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title || 'PC Kumba-Mbeng', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window with the app is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      return clients.openWindow(url);
    })
  );
});
