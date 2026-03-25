'use client';

import { useEffect } from 'react';

// Convert VAPID public key to the format the browser Push API needs
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function PushSubscriber() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[Push] Web Push not supported in this browser.');
      return;
    }

    async function setupPush() {
      try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[Push] Service worker registered.');

        // Request permission from the admin
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('[Push] Permission denied.');
          return;
        }

        // Subscribe to push notifications
        const keyArray = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!);
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly:      true,
          applicationServerKey: keyArray.buffer as ArrayBuffer,
        });

        // Save subscription to Supabase via API route
        await fetch('/api/admin/push/subscribe', {
          method:      'POST',
          headers:     { 'Content-Type': 'application/json' },
          credentials: 'include',
          body:        JSON.stringify({ subscription }),
        });

        console.log('[Push] Subscribed and saved successfully.');
      } catch (err) {
        console.error('[Push] Setup failed:', err);
      }
    }

    setupPush();
  }, []);

  return null;
}
