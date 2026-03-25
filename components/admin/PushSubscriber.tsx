'use client';

import { useEffect, useId, useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

async function subscribeAndSave(registration: ServiceWorkerRegistration) {
  const keyArray = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly:      true,
    applicationServerKey: keyArray.buffer as ArrayBuffer,
  });
  await fetch('/api/admin/push/subscribe', {
    method:      'POST',
    headers:     { 'Content-Type': 'application/json' },
    credentials: 'include',
    body:        JSON.stringify({ subscription }),
  });
}

type Status = 'idle' | 'prompt' | 'loading' | 'success';

export function PushSubscriber() {
  const titleId  = useId();
  const [status,       setStatus]       = useState<Status>('idle');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    async function init() {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);

        const perm = Notification.permission;
        if (perm === 'granted') {
          // Already allowed — subscribe silently
          await subscribeAndSave(reg);
        } else if (perm === 'default') {
          // Not yet asked — show our prompt
          setStatus('prompt');
        }
        // 'denied' → nothing we can do, stay silent
      } catch (err) {
        console.error('[Push] Init failed:', err);
      }
    }

    init();
  }, []);

  const handleEnable = async () => {
    if (!registration) return;
    setStatus('loading');
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        setStatus('idle'); // dismissed or denied — close quietly
        return;
      }
      await subscribeAndSave(registration);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('[Push] Subscribe failed:', err);
      setStatus('idle');
    }
  };

  if (status === 'idle') return null;

  // ── Success modal ─────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-80 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
        <div
          className="relative z-10 w-full max-w-[520px] rounded-xl bg-white p-6 shadow-2xl ring-1 ring-outline/20"
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-7 w-7 text-emerald-600" aria-hidden="true" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-xl font-bold tracking-tight text-on-surface">
            Notifications enabled!
          </h2>
          <p className="text-center text-sm text-on-surface/75">
            You&apos;ll now receive instant alerts when a user submits KYC documents.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="w-full inline-flex items-center justify-center cursor-pointer rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Prompt modal (status === 'prompt' | 'loading') ────────────────────────
  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[1px]"
        aria-label="Dismiss"
        onClick={() => setStatus('idle')}
      />
      <div
        className="relative z-10 w-full max-w-[520px] rounded-xl bg-white p-6 shadow-2xl ring-1 ring-outline/20"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
        </div>
        <h2 id={titleId} className="mb-2 text-center text-xl font-bold tracking-tight text-on-surface">
          Enable push notifications
        </h2>
        <p className="text-center text-sm text-on-surface/75">
          Get instant OS-level alerts when a user submits KYC documents — even when this tab is in the background.
        </p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setStatus('idle')}
            disabled={status === 'loading'}
            className="min-w-24 cursor-pointer rounded-full border border-outline/40 px-4 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-40"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={handleEnable}
            disabled={status === 'loading'}
            className="min-w-24 inline-flex items-center justify-center gap-2 cursor-pointer rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === 'loading' ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Enabling…
              </>
            ) : (
              'Enable notifications'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
