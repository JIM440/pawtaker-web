🐾  PawTaker — Admin Panel
Notifications Implementation Guide
Web Push + In-App  •  For the Junior Developer  •  v1.0  •  March 2026

Framework
Next.js 16 App Router	Push Library
web-push + VAPID	In-App
Supabase Realtime

0.  Purpose & Scope
This document is the complete implementation guide for the PawTaker admin panel notification system. It covers both Web Push notifications and In-App notifications triggered when a mobile user submits a KYC document.
The mobile app side (Expo push notifications for approve/reject) is out of scope for this document and will be covered separately.

Item	Details
Trigger event	Mobile user submits KYC — kyc_submissions row inserted in Supabase
Web Push	Admin receives OS-level popup even when browser is closed
In-App	Bell icon badge count updates live + toast popup appears + dropdown shows new item
Navigation on click	Clicking push notification or toast takes admin to /admin/kyc
Badge count	Shows number of NEW unread notifications since admin last checked
Table to create	admin_notifications (new — does not exist yet)
Table to alter	users — add push_subscription column
Files to create	public/sw.js, lib/notifications/, components/admin/NotificationProvider.tsx
Files to modify	lib/supabase/admin.ts, app/[locale]/admin/layout.tsx, components/admin/Topbar


1.  Architecture Overview
Before writing any code, understand the full picture of how the two notification types work together.

1.1  Full Flow
MOBILE USER SUBMITS KYC
        ↓
Row inserted into kyc_submissions table in Supabase
        ↓
Supabase DB Trigger fires → inserts row into admin_notifications
        ↓
        ┌──────────────────────────────┬──────────────────────────────────┐
        │  WEB PUSH (browser closed)   │  IN-APP (browser open)           │
        │                              │                                  │
        │  Next.js API route called    │  Supabase Realtime listener      │
        │  by DB trigger/edge function │  fires in NotificationProvider   │
        │         ↓                    │         ↓                        │
        │  web-push sends to admin     │  Bell badge count +1             │
        │  browser push service        │  Toast popup appears             │
        │         ↓                    │  Dropdown shows new item         │
        │  OS shows native popup       │                                  │
        │  Admin clicks → /admin/kyc   │  Admin clicks → /admin/kyc       │
        └──────────────────────────────┴──────────────────────────────────┘

✅  NOTE  The admin_notifications table is the single source of truth for both notification types. Web push reads from it. In-app reads from it. This keeps everything consistent.

1.2  The Two Technologies
Technology	What it does and when it applies
Web Push (web-push package + VAPID keys + Service Worker)	Sends an OS-level notification to the admin's browser even when the browser tab is closed. Requires the admin to grant permission once. Works in Chrome, Edge, Firefox on desktop. Requires HTTPS in production.
Supabase Realtime (in-app)	Listens for new rows in admin_notifications while the browser is open. Updates the bell badge count live. Shows a toast popup. Powers the notification dropdown panel. No extra service needed — uses existing Supabase connection.


2.  Database Setup
Two database changes are needed before writing any code. Run both in the Supabase SQL Editor.

2.1	Create the admin_notifications Table

This table stores every notification for the admin panel. It is designed to support multiple notification types in the future — not just KYC.

CREATE TABLE public.admin_notifications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What kind of notification this is
  -- kyc_submitted is first. Future values: new_user, new_message, dispute etc.
  type           TEXT NOT NULL,

  -- Human readable strings shown in the dropdown and push notification
  title          TEXT NOT NULL,
  message        TEXT NOT NULL,

  -- The user who triggered this notification (for avatar + name display)
  triggered_by   UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,

  -- Link back to the entity that caused this notification
  -- e.g. for kyc_submitted: reference_type='kyc_submissions', reference_id=submission.id
  reference_id   UUID NULL,
  reference_type TEXT NULL,

  -- Track which admin has read this (NULL = unread)
  is_read        BOOLEAN NOT NULL DEFAULT false,

  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast unread count queries
CREATE INDEX idx_admin_notifications_is_read
  ON public.admin_notifications(is_read, created_at DESC);

-- Grant service_role full access
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.admin_notifications TO service_role;

2.2	Add push_subscription Column to users Table

The admin's browser push subscription object needs to be stored so the server knows where to send web push notifications. It is stored on the admin's user row.

ALTER TABLE public.users
ADD COLUMN push_subscription JSONB NULL;

-- This stores the full PushSubscription object from the browser:
-- {
--   endpoint: 'https://fcm.googleapis.com/...',
--   keys: {
--     p256dh: '...',
--     auth: '...'
--   }
-- }

2.3	Create the DB Trigger for KYC Submissions

This trigger fires automatically every time a row is inserted into kyc_submissions. It creates the admin_notifications row immediately — no API call needed from the mobile app.

CREATE OR REPLACE FUNCTION public.handle_kyc_submission_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
BEGIN
  -- Get the user's name for the notification message
  SELECT full_name INTO v_full_name
  FROM public.users
  WHERE id = NEW.user_id;

  -- Insert the admin notification
  INSERT INTO public.admin_notifications (
    type,
    title,
    message,
    triggered_by,
    reference_id,
    reference_type,
    is_read
  ) VALUES (
    'kyc_submitted',
    'New KYC Submission',
    COALESCE(v_full_name, 'A user') || ' submitted their identity documents for verification.',
    NEW.user_id,
    NEW.id,
    'kyc_submissions',
    false
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to kyc_submissions
CREATE TRIGGER on_kyc_submission_created
  AFTER INSERT ON public.kyc_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_kyc_submission_notification();

⚠️  NOTE  Run all three SQL blocks above in the SQL Editor before writing any code. Verify the admin_notifications table appears in Table Editor and the trigger appears in Database → Functions.


3.  Web Push Setup
Web Push requires four things: VAPID keys, a service worker file, a subscribe API route, and a send API route. Follow the steps in order.

3.1	Install the web-push Package

npm install web-push
npm install --save-dev @types/web-push

3.2	Generate VAPID Keys

Run this ONE TIME in your terminal. Copy the output — you will never generate these again. If you regenerate them all existing push subscriptions become invalid.

npx web-push generate-vapid-keys

# Output will look like:
# Public Key:  BOP3x7aBcDe...
# Private Key: xYz9a1bCd...

Add both keys to your .env.local file:

# .env.local

# Public key is safe to expose to the browser
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BOP3x7aBcDe...   ← paste your public key here

# Private key must NEVER be exposed to the browser
VAPID_PRIVATE_KEY=xYz9a1bCd...               ← paste your private key here

# Your admin contact email (required by VAPID spec)
VAPID_EMAIL=admin@pawtaker.com

🚫  IMPORTANT  VAPID_PRIVATE_KEY must NOT have the NEXT_PUBLIC_ prefix. If it does, it gets bundled into the browser JavaScript and exposed to anyone — a serious security vulnerability.

3.3	Create the Service Worker  —  public/sw.js

Create this file at the root of your public folder. The service worker runs in the background in the admin's browser and handles incoming push messages even when the tab is closed.

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
      icon:  '/icon-192.png',   // add your app icon to /public/
      badge: '/icon-72.png',    // small badge icon
      data: {
        url: data.url ?? '/admin/kyc',  // where to go on click
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

3.4	Subscribe API Route  —  app/api/admin/push/subscribe/route.ts

This route is called by the browser when the admin grants push notification permission. It saves their push subscription object to the users table.

import { NextResponse } from 'next/server';
import { requireAdminClient } from '../../../../../lib/api/admin/auth';

export async function POST(req: Request) {
  const result = await requireAdminClient();
  if (result instanceof NextResponse) return result;
  const { admin, userId } = result;  // Note: update requireAdminClient to also return userId

  const { subscription } = await req.json();

  if (!subscription?.endpoint) {
    return NextResponse.json({ error: 'Invalid subscription object.' }, { status: 400 });
  }

  // Save the full subscription object to the admin's user row
  const { error } = await admin
    .from('users')
    .update({ push_subscription: subscription })
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

⚠️  NOTE  requireAdminClient() currently returns { admin }. Update it to also return { admin, userId } where userId is the authenticated user's id. This is needed here and for future admin-specific operations.

3.5	Send Push API Route  —  app/api/admin/push/send/route.ts

This route sends the actual web push notification to all admin subscribers. It is called internally after a new admin_notifications row is created.

import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createAdminClient } from '../../../../../lib/supabase/admin';

// Configure VAPID details once
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  // This route is called server-to-server — validate with a shared secret
  const authHeader = req.headers.get('x-internal-secret');
  if (authHeader !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, message, url } = await req.json();
  const admin = createAdminClient();

  // Get all admin users who have a push subscription saved
  const { data: admins, error } = await admin
    .from('users')
    .select('id, push_subscription')
    .eq('is_admin', true)
    .not('push_subscription', 'is', null);

  if (error || !admins?.length) {
    return NextResponse.json({ sent: 0 });
  }

  const payload = JSON.stringify({ title, message, url });

  // Send to all admin subscribers
  const results = await Promise.allSettled(
    admins.map((a) =>
      webpush.sendNotification(a.push_subscription as webpush.PushSubscription, payload)
    )
  );

  const sent    = results.filter((r) => r.status === 'fulfilled').length;
  const failed  = results.filter((r) => r.status === 'rejected').length;

  return NextResponse.json({ sent, failed });
}

Add the internal secret to your .env.local:

# .env.local
INTERNAL_API_SECRET=some-long-random-string-only-your-server-knows

# Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

3.6	Update the DB Trigger to Call the Send Route

The DB trigger from Section 2.3 inserts the notification row. Now update it to also call the send push route using Supabase's http extension so the web push fires automatically.

-- First enable the http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Update the trigger function to also send web push
CREATE OR REPLACE FUNCTION public.handle_kyc_submission_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_notif_id  UUID;
BEGIN
  SELECT full_name INTO v_full_name
  FROM public.users WHERE id = NEW.user_id;

  -- Insert admin notification row
  INSERT INTO public.admin_notifications (
    type, title, message, triggered_by,
    reference_id, reference_type, is_read
  ) VALUES (
    'kyc_submitted',
    'New KYC Submission',
    COALESCE(v_full_name, 'A user') || ' submitted their identity documents.',
    NEW.user_id, NEW.id, 'kyc_submissions', false
  ) RETURNING id INTO v_notif_id;

  -- Call the web push send route
  PERFORM extensions.http_post(
    'https://your-domain.com/api/admin/push/send',
    json_build_object(
      'title',   'New KYC Submission',
      'message', COALESCE(v_full_name, 'A user') || ' submitted their identity documents.',
      'url',     '/admin/kyc'
    )::text,
    'application/json',
    json_build_object('x-internal-secret', 'YOUR_INTERNAL_API_SECRET')::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

⚠️  NOTE  Replace 'https://your-domain.com' with your actual deployment URL and 'YOUR_INTERNAL_API_SECRET' with the value from your .env. In local development, use ngrok to expose localhost.


4.  In-App Notifications
The in-app system has three parts: a React context provider that manages state, a Supabase Realtime subscription that listens for new rows, and the UI components (bell badge + toast + dropdown). The dropdown UI already exists as mock data — we are wiring it to real data.

4.1	Create the Notification Context  —  components/admin/NotificationProvider.tsx

This provider wraps the admin layout and makes notification state available to all admin components including the topbar bell icon.

'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// Use the public/anon client for Realtime subscriptions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

type AdminNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  triggered_by: string | null;
  reference_id: string | null;
  reference_type: string | null;
  // joined from users table
  user?: {
    full_name: string;
    avatar_url: string | null;
  };
};

type NotificationContextType = {
  notifications: AdminNotification[];
  unreadCount: number;
  toast: AdminNotification | null;
  markAllRead: () => Promise<void>;
  markOneRead: (id: string) => Promise<void>;
  dismissToast: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  toast: null,
  markAllRead: async () => {},
  markOneRead: async () => {},
  dismissToast: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [toast, setToast] = useState<AdminNotification | null>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // ── Fetch existing notifications on mount ──────────────────────
  useEffect(() => {
    fetch('/api/admin/notifications')
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications ?? []));
  }, []);

  // ── Supabase Realtime — listen for new notifications ───────────
  useEffect(() => {
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'admin_notifications',
        },
        async (payload) => {
          const newNotif = payload.new as AdminNotification;

          // Fetch the user details for avatar/name
          if (newNotif.triggered_by) {
            const res = await fetch(`/api/admin/users/${newNotif.triggered_by}/public`);
            const userData = await res.json();
            newNotif.user = userData.user;
          }

          // Add to top of list
          setNotifications((prev) => [newNotif, ...prev]);

          // Show toast for 5 seconds
          setToast(newNotif);
          setTimeout(() => setToast(null), 5000);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Mark all as read ───────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    await fetch('/api/admin/notifications/mark-read', { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, []);

  // ── Mark one as read ───────────────────────────────────────────
  const markOneRead = useCallback(async (id: string) => {
    await fetch(`/api/admin/notifications/${id}/mark-read`, { method: 'PATCH' });
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, is_read: true } : n)
    );
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, toast, markAllRead, markOneRead, dismissToast }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);

4.2	Create the Notifications API Route  —  app/api/admin/notifications/route.ts

This route fetches all notifications with the triggering user's avatar and name joined in.

import { NextResponse } from 'next/server';
import { requireAdminClient } from '../../../../lib/api/admin/auth';

export async function GET() {
  const result = await requireAdminClient();
  if (result instanceof NextResponse) return result;
  const { admin } = result;

  const { data, error } = await admin
    .from('admin_notifications')
    .select(`
      *,
      user:triggered_by (
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notifications: data ?? [] });
}

4.3	Create Mark-Read Routes

File: app/api/admin/notifications/mark-read/route.ts  (marks ALL as read)

import { NextResponse } from 'next/server';
import { requireAdminClient } from '../../../../../lib/api/admin/auth';

export async function PATCH() {
  const result = await requireAdminClient();
  if (result instanceof NextResponse) return result;
  const { admin } = result;

  const { error } = await admin
    .from('admin_notifications')
    .update({ is_read: true })
    .eq('is_read', false);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

File: app/api/admin/notifications/[id]/mark-read/route.ts  (marks ONE as read)

import { NextResponse } from 'next/server';
import { requireAdminClient } from '../../../../../../lib/api/admin/auth';

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const result = await requireAdminClient();
  if (result instanceof NextResponse) return result;
  const { admin } = result;

  const { error } = await admin
    .from('admin_notifications')
    .update({ is_read: true })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

4.4	Add NotificationProvider to Admin Layout

File: app/[locale]/admin/layout.tsx — wrap the admin shell with the provider:

import { NotificationProvider } from '../../../components/admin/NotificationProvider';
import { PushSubscriber } from '../../../components/admin/PushSubscriber';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <PushSubscriber />     {/* registers service worker + asks for push permission */}
      <div className="admin-shell">
        {/* your existing sidebar + topbar + content */}
        {children}
      </div>
    </NotificationProvider>
  );
}

4.5	Create the PushSubscriber Component  —  components/admin/PushSubscriber.tsx

This component registers the service worker and asks the admin for push notification permission. It runs once when the admin layout mounts.

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
      console.warn('Web Push not supported in this browser.');
      return;
    }

    async function setupPush() {
      try {
        // Step 1 — Register the service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[Push] Service worker registered.');

        // Step 2 — Request permission from the admin
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('[Push] Permission denied.');
          return;
        }

        // Step 3 — Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly:      true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        });

        // Step 4 — Save subscription to Supabase via our API route
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

  return null;  // this component renders nothing
}

4.6	Wire the Topbar Bell Icon to Real Data

The topbar already has a bell icon and dropdown UI. Replace the mock data with the useNotifications hook:

// In your existing Topbar component
'use client';
import { useNotifications } from './NotificationProvider';
import { useRouter } from 'next/navigation';

export function Topbar() {
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();
  const router = useRouter();

  const handleNotificationClick = (notif: AdminNotification) => {
    markOneRead(notif.id);
    // Navigate based on notification type
    if (notif.type === 'kyc_submitted') {
      router.push('/admin/kyc');
    }
    // Future types: add more cases here
  };

  return (
    // ... your existing topbar JSX
    // Replace mock notifications with: notifications
    // Replace mock unread count with: unreadCount
    // Replace mock markAllRead with: markAllRead
    // Wire notification item onClick to: handleNotificationClick(notif)
  );
}

4.7	Create the Toast Component  —  components/admin/NotificationToast.tsx

This toast appears in the bottom-right corner when a new notification arrives. It shows the user avatar and message. Add it inside the NotificationProvider render.

'use client';
import { useNotifications } from './NotificationProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function NotificationToast() {
  const { toast, dismissToast } = useNotifications();
  const router = useRouter();

  if (!toast) return null;

  const handleClick = () => {
    dismissToast();
    if (toast.type === 'kyc_submitted') router.push('/admin/kyc');
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3
                 bg-white border border-gray-200 shadow-lg rounded-xl
                 p-4 cursor-pointer max-w-sm hover:shadow-xl transition-shadow"
    >
      {/* Avatar */}
      {toast.user?.avatar_url ? (
        <Image
          src={toast.user.avatar_url}
          alt={toast.user.full_name}
          width={40} height={40}
          className="rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center
                        justify-center text-blue-600 font-bold shrink-0">
          {toast.user?.full_name?.[0] ?? '?'}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate">
          {toast.title}
        </p>
        <p className="text-sm text-gray-500 truncate">{toast.message}</p>
      </div>

      {/* Dismiss */}
      <button
        onClick={(e) => { e.stopPropagation(); dismissToast(); }}
        className="text-gray-400 hover:text-gray-600 shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

Add NotificationToast to the NotificationProvider render:

// Inside NotificationProvider return:
return (
  <NotificationContext.Provider value={{...}}>
    {children}
    <NotificationToast />   {/* ← add this */}
  </NotificationContext.Provider>
);


5.  Implementation Checklist
Complete every item in order. Do not skip the database steps.

Database (Supabase SQL Editor)
1.	Create admin_notifications table (Section 2.1)
2.	Add push_subscription column to users table (Section 2.2)
3.	Create handle_kyc_submission_notification trigger function (Section 2.3)
4.	Attach trigger to kyc_submissions table (Section 2.3)
5.	Enable http extension and update trigger to call push send route (Section 3.6)
6.	Grant service_role SELECT, INSERT, UPDATE, DELETE on admin_notifications

Environment Variables
7.	Run npx web-push generate-vapid-keys and copy output
8.	Add NEXT_PUBLIC_VAPID_PUBLIC_KEY to .env.local
9.	Add VAPID_PRIVATE_KEY to .env.local (no NEXT_PUBLIC_ prefix)
10.	Add VAPID_EMAIL to .env.local
11.	Add INTERNAL_API_SECRET to .env.local

Packages
12.	npm install web-push
13.	npm install --save-dev @types/web-push

Files to Create
14.	public/sw.js — service worker (Section 3.3)
15.	app/api/admin/push/subscribe/route.ts (Section 3.4)
16.	app/api/admin/push/send/route.ts (Section 3.5)
17.	app/api/admin/notifications/route.ts (Section 4.2)
18.	app/api/admin/notifications/mark-read/route.ts (Section 4.3)
19.	app/api/admin/notifications/[id]/mark-read/route.ts (Section 4.3)
20.	components/admin/NotificationProvider.tsx (Section 4.1)
21.	components/admin/PushSubscriber.tsx (Section 4.5)
22.	components/admin/NotificationToast.tsx (Section 4.7)

Files to Modify
23.	lib/api/admin/auth.ts — update requireAdminClient to also return userId (Section 3.4 note)
24.	app/[locale]/admin/layout.tsx — wrap with NotificationProvider + add PushSubscriber (Section 4.4)
25.	components/admin/Topbar — replace mock data with useNotifications hook (Section 4.6)

Testing
26.	Open admin panel — browser should ask for notification permission
27.	Check Supabase DB: users row for admin should have push_subscription populated
28.	Submit a KYC from the mobile app
29.	Confirm admin_notifications row appears in Supabase Table Editor
30.	Confirm bell badge count increments in the admin panel
31.	Confirm toast appears in bottom-right corner with avatar and message
32.	Confirm OS-level push notification appears (close the browser tab first to test this)
33.	Click the push notification — confirm browser opens and navigates to /admin/kyc
34.	Click Mark all as read — confirm badge clears


6.  Common Errors & How to Fix Them

Error	Fix
Browser does not ask for notification permission	PushSubscriber component is not mounted. Confirm it is inside the admin layout and that it is a 'use client' component.
Permission prompt appears but push notifications never arrive	Check the service worker is registered at /sw.js. Open DevTools → Application → Service Workers to confirm.
web-push sendNotification throws 'InvalidVapidKey'	The VAPID keys were not generated correctly or the public key was not converted with urlBase64ToUint8Array. Regenerate keys and try again.
Realtime listener fires but no toast appears	The toast state is being set but the NotificationToast component is not rendered inside NotificationProvider. Check layout.
push_subscription is null in users table	PushSubscriber ran but the /api/admin/push/subscribe API route returned an error. Check the Network tab in DevTools for the POST request.
DB trigger fires but web push not sent	The http extension may not be enabled. Run: CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions; in SQL Editor.
Notification click does not navigate to /admin/kyc	The notificationclick event in sw.js is not finding the open window. Check the clients.matchAll logic matches your actual admin URL structure.
VAPID_PRIVATE_KEY undefined on server	You added it to .env.local but did not restart the dev server. Always restart after changing env variables.


End of Document  •  PawTaker Admin Notifications  •  v1.0  •  March 2026


-- Step 1: Enable the http extension
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Step 2: Update the trigger function to also send web push
CREATE OR REPLACE FUNCTION public.handle_kyc_submission_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_notif_id  UUID;
BEGIN
  SELECT full_name INTO v_full_name
  FROM public.users WHERE id = NEW.user_id;

  INSERT INTO public.admin_notifications (
    type, title, message, triggered_by,
    reference_id, reference_type, is_read
  ) VALUES (
    'kyc_submitted',
    'New KYC Submission',
    COALESCE(v_full_name, 'A user') || ' submitted their identity documents.',
    NEW.user_id, NEW.id, 'kyc_submissions', false
  ) RETURNING id INTO v_notif_id;

  PERFORM extensions.http_post(
    'https://pawtaker-web.vercel.app/api/admin/push/send',
    json_build_object(
      'title',   'New KYC Submission',
      'message', COALESCE(v_full_name, 'A user') || ' submitted their identity documents.',
      'url',     '/admin/kyc'
    )::text,
    'application/json',
    json_build_object('x-internal-secret', 'af2af114808372fc1ed57bac0ad03c25e2ecb319137b930a221550e73270b442')::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
