// public/sw.js
// Service worker for PawTaker admin web push notifications

// Listen for incoming push messages from the server
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();

  // Show the OS-level notification
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:  data.message,
      icon:  '/logos/logomark-dusty-plum.png',
      badge: '/logos/coloured-favicon.png',
      data: {
        url: data.url ?? '/admin/kyc',
      },
    })
  );
});

// Handle notification click — open the correct admin page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? '/admin/kyc';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If admin panel is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          client.focus();
          return client.navigate(targetUrl);
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
