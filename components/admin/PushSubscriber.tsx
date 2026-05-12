'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

async function saveSubscription(subscription: PushSubscription, timeoutMs = 7000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('/api/admin/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ subscription }),
      signal: controller.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json?.error ?? 'Failed to save push subscription.');
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function removeSubscription(endpoint: string, timeoutMs = 7000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('/api/admin/push/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ endpoint }),
      signal: controller.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json?.error ?? 'Failed to remove push subscription.');
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function createPushSubscription(registration: ServiceWorkerRegistration) {
  const keyArray = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!);
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: keyArray.buffer as ArrayBuffer,
  });
}

type PushState = 'checking' | 'enabled' | 'disabled' | 'denied' | 'unsupported';

type PushNotificationsContextType = {
  isBusy: boolean;
  isEnabled: boolean;
  isSupported: boolean;
  state: PushState;
  openPrompt: () => void;
  disablePush: () => Promise<void>;
  enablePush: () => Promise<void>;
};

const PushNotificationsContext = createContext<PushNotificationsContextType>({
  isBusy: false,
  isEnabled: false,
  isSupported: false,
  state: 'checking',
  openPrompt: () => {},
  disablePush: async () => {},
  enablePush: async () => {},
});

const PROMPT_DISMISSED_AT_KEY = 'pawtaker-admin-push-prompt-dismissed-at';
const PROMPT_REMINDER_MS = 12 * 60 * 60 * 1000;

function shouldOpenPrompt(force = false) {
  if (force) return true;
  const raw = window.localStorage.getItem(PROMPT_DISMISSED_AT_KEY);
  const dismissedAt = raw ? Number(raw) : 0;
  return !dismissedAt || Number.isNaN(dismissedAt) || Date.now() - dismissedAt > PROMPT_REMINDER_MS;
}

function rememberPromptDismissal() {
  window.localStorage.setItem(PROMPT_DISMISSED_AT_KEY, String(Date.now()));
}

function PushPromptModal({
  busy,
  errorMessage,
  onClose,
  onEnable,
  denied,
}: {
  busy: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onEnable: () => void;
  denied: boolean;
}) {
  const titleId = useId();

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[1px]"
        aria-label="Dismiss"
        onClick={onClose}
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
          {denied ? 'Turn notifications back on' : 'Enable push notifications'}
        </h2>
        <p className="text-center text-sm text-on-surface/75">
          {denied
            ? 'This browser is currently blocking notifications. Please allow notifications in your browser site settings, then try again here.'
            : "Get instant OS-level alerts when a user submits KYC documents, even when this tab is in the background."}
        </p>
        {errorMessage ? (
          <p className="mt-3 text-center text-xs font-medium text-error">{errorMessage}</p>
        ) : null}
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-w-24 cursor-pointer rounded-full border border-outline/40 px-4 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-40"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={onEnable}
            disabled={busy}
            className="min-w-24 inline-flex items-center justify-center gap-2 cursor-pointer rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Working...
              </>
            ) : denied ? (
              'Try again'
            ) : (
              'Enable notifications'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PushSubscriber({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PushState>('checking');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [busy, setBusy] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshState = useCallback(async (reg: ServiceWorkerRegistration) => {
    const permission = Notification.permission;
    if (permission === 'denied') {
      setState('denied');
      return;
    }
    if (permission !== 'granted') {
      setState('disabled');
      return;
    }

    const existing = await reg.pushManager.getSubscription();
    if (existing) {
      try {
        await saveSubscription(existing);
      } catch (err) {
        console.error('[Push] Save existing subscription failed:', err);
      }
      setState('enabled');
      return;
    }

    setState('disabled');
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setState('unsupported');
      return;
    }

    let cancelled = false;

    async function init() {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        if (cancelled) return;
        setRegistration(reg);
        await refreshState(reg);

        const permission = Notification.permission;
        if ((permission === 'default' || permission === 'denied') && shouldOpenPrompt()) {
          setPromptOpen(true);
        }
      } catch (err) {
        console.error('[Push] Init failed:', err);
        if (!cancelled) {
          setState('unsupported');
        }
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [refreshState]);

  const openPrompt = useCallback(() => {
    setErrorMessage(null);
    setPromptOpen(true);
  }, []);

  const closePrompt = useCallback(() => {
    rememberPromptDismissal();
    setPromptOpen(false);
  }, []);

  const enablePush = useCallback(async () => {
    if (!registration) return;

    setBusy(true);
    setErrorMessage(null);

    try {
      let permission = Notification.permission;

      if (permission !== 'granted') {
        permission = await Promise.race<NotificationPermission>([
          Notification.requestPermission(),
          new Promise<never>((_, reject) =>
            window.setTimeout(() => reject(new Error('Permission prompt timed out.')), 15000)
          ),
        ]);
      }

      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'disabled');
        setErrorMessage(
          permission === 'denied'
            ? 'Notifications are blocked in this browser. Please enable them in site settings and try again.'
            : 'Notifications were not enabled.'
        );
        toast.error(
          permission === 'denied'
            ? 'Notifications are blocked in this browser.'
            : 'Notifications were not enabled.'
        );
        return;
      }

      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await Promise.race<PushSubscription>([
          createPushSubscription(registration),
          new Promise<never>((_, reject) =>
            window.setTimeout(() => reject(new Error('Creating push subscription took too long.')), 12000)
          ),
        ]));

      await saveSubscription(subscription);
      setState('enabled');
      setPromptOpen(false);
      setShowSuccess(true);
      window.setTimeout(() => setShowSuccess(false), 3000);
      toast.success('Push notifications enabled for this device.');
    } catch (err) {
      console.error('[Push] Subscribe failed:', err);
      const message =
        err instanceof Error ? err.message : 'Could not enable notifications. Please try again.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }, [registration]);

  const disablePush = useCallback(async () => {
    if (!registration) return;

    setBusy(true);
    try {
      const existing = await registration.pushManager.getSubscription();
      if (existing) {
        const endpoint = existing.endpoint;
        await existing.unsubscribe();
        await removeSubscription(endpoint);
      }
      setState(Notification.permission === 'denied' ? 'denied' : 'disabled');
      toast.success('Push notifications turned off for this device.');
    } catch (err) {
      console.error('[Push] Disable failed:', err);
      toast.error(err instanceof Error ? err.message : 'Could not turn off notifications.');
    } finally {
      setBusy(false);
    }
  }, [registration]);

  const value = useMemo<PushNotificationsContextType>(
    () => ({
      isBusy: busy,
      isEnabled: state === 'enabled',
      isSupported: state !== 'unsupported',
      state,
      openPrompt,
      disablePush,
      enablePush,
    }),
    [busy, state, openPrompt, disablePush, enablePush]
  );

  return (
    <PushNotificationsContext.Provider value={value}>
      {children}

      {showSuccess ? (
        <div className="fixed inset-0 z-80 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
          <div
            className="relative z-10 w-full max-w-[520px] rounded-xl bg-white p-6 shadow-2xl ring-1 ring-outline/20"
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>
            </div>
            <h2 className="mb-2 text-center text-xl font-bold tracking-tight text-on-surface">
              Notifications enabled!
            </h2>
            <p className="text-center text-sm text-on-surface/75">
              You&apos;ll now receive instant alerts on this device when a user submits KYC documents.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {promptOpen ? (
        <PushPromptModal
          busy={busy}
          errorMessage={errorMessage}
          onClose={closePrompt}
          onEnable={() => void enablePush()}
          denied={state === 'denied'}
        />
      ) : null}
    </PushNotificationsContext.Provider>
  );
}

export function usePushNotifications() {
  return useContext(PushNotificationsContext);
}
