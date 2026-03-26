Ready for review
Select text to add comments on the plan
Plan: Admin Notification System — Web Push + In-App (Sonner)
Context
The PawTaker admin panel needs real-time notifications when a mobile user submits a KYC document. The DB side is already done (admin_notifications table, push_subscription column on users, KYC trigger). This plan covers all remaining code: packages, service worker, API routes, React context, UI wiring. Toast uses Sonner (not the custom component from the guide doc).

What's Already Done (user confirmed)
admin_notifications table created in Supabase
push_subscription column added to users table
handle_kyc_submission_notification trigger attached to kyc_submissions
What Remains (DB)
Section 3.6 (update trigger to call push send route via HTTP extension) — must be done AFTER deployment, needs real production URL. Will be noted but not coded here.
Step 1 — Install Packages
npm install sonner web-push
npm install --save-dev @types/web-push
Step 2 — Environment Variables (user must add manually)
User runs once:

npx web-push generate-vapid-keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Add to .env.local:

NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...          # NO NEXT_PUBLIC_ prefix — security critical
VAPID_EMAIL=admin@pawtaker.com
INTERNAL_API_SECRET=...
Step 3 — Update lib/api/admin/auth.ts
Change: Return userId alongside admin so push subscribe route can save subscription to the correct user row.

Return type becomes { admin, userId: string } | NextResponse
Extract user.id from the already-fetched auth user and include in return
Step 4 — Create public/sw.js
Verbatim from section 3.3 of notifications.md.

Handles push event → shows OS notification
Handles notificationclick → focuses/opens /admin/kyc
Step 5 — Create API Routes
app/api/admin/push/subscribe/route.ts
POST — saves subscription JSON to users.push_subscription for the calling admin. Uses requireAdminClient() (now returns userId).

app/api/admin/push/send/route.ts
POST — sends web push to all admin subscribers. Validates x-internal-secret header. Fetches all admins with push_subscription IS NOT NULL, sends with webpush.sendNotification.

app/api/admin/notifications/route.ts (REPLACE existing mock)
GET — queries admin_notifications table with user join:

SELECT *, user:triggered_by(full_name, avatar_url)
ORDER BY created_at DESC LIMIT 50
Returns real rows. Changes existing mock-data route.

app/api/admin/notifications/mark-read/route.ts
PATCH — sets is_read = true for all unread notifications.

app/api/admin/notifications/[id]/mark-read/route.ts
PATCH — sets is_read = true for one notification by id.

Step 6 — Create components/admin/NotificationProvider.tsx
'use client' context provider that:

Fetches all notifications on mount from /api/admin/notifications
Subscribes to Supabase Realtime INSERT on admin_notifications table (uses createClient from @/lib/supabase/client)
On new row: prepend to list, call toast() from sonner with title + message + onClick → router.push to /admin/kyc
Exposes: notifications, unreadCount, markAllRead(), markOneRead(id)
Type for notification matches real table:

type AdminNotification = {
  id: string; type: string; title: string; message: string;
  is_read: boolean; created_at: string;
  triggered_by: string | null; reference_id: string | null; reference_type: string | null;
  user?: { full_name: string; avatar_url: string | null };
}
Step 7 — Create components/admin/PushSubscriber.tsx
'use client' component, renders null. On mount: registers /sw.js, requests permission, subscribes, POSTs to /api/admin/push/subscribe. Exact code from section 4.5.

Step 8 — Update components/admin/AdminHeaderActions.tsx
Replace React Query usage with useNotifications() from NotificationProvider:

unreadCount from context (not computed locally)
notifications from context
Bell badge shows unreadCount when > 0
markAllRead() from context (replaces local setMarkAllRead state hack)
Each notification item: onClick → markOneRead(n.id) then navigate if type === 'kyc_submitted'
Update field names: n.message instead of n.preview, format n.created_at for age, handle avatar from n.user?.avatar_url with fallback initials
Step 9 — Update lib/queries/admin/notifications.ts
Update AdminNotificationDto to match real table shape (or deprecate if not used elsewhere after context switch).

Step 10 — Update app/[locale]/admin/layout.tsx
Layout is a Server Component — add imports at top then wrap content:

import { NotificationProvider } from '@/components/admin/NotificationProvider';
import { PushSubscriber } from '@/components/admin/PushSubscriber';
import { Toaster } from 'sonner';
Wrap the returned JSX shell with <NotificationProvider>, add <PushSubscriber /> and <Toaster position="bottom-right" richColors /> inside it.

Critical Files
File	Action
lib/api/admin/auth.ts	Modify — add userId to return
public/sw.js	Create — service worker
app/api/admin/push/subscribe/route.ts	Create
app/api/admin/push/send/route.ts	Create
app/api/admin/notifications/route.ts	Replace mock with real query
app/api/admin/notifications/mark-read/route.ts	Create
app/api/admin/notifications/[id]/mark-read/route.ts	Create
components/admin/NotificationProvider.tsx	Create
components/admin/PushSubscriber.tsx	Create
components/admin/AdminHeaderActions.tsx	Modify — use context + new types
lib/queries/admin/notifications.ts	Modify — update DTO type
app/[locale]/admin/layout.tsx	Modify — wrap with provider + Toaster
Verification
npm run dev — no TS errors
Open admin panel — browser prompts for notification permission
Check Supabase: users row for admin should have push_subscription populated
Insert test row into admin_notifications manually in Supabase Table Editor
Confirm bell badge count increments live (Realtime working)
Confirm Sonner toast appears bottom-right with title + message
Click toast → navigates to /admin/kyc
Open bell dropdown → notification listed, click "Mark all read" → badge clears
Post-Deploy DB Step (manual, after production URL known)
Run Section 3.6 SQL in Supabase SQL Editor:

Enable http extension
Update trigger function to call https://your-domain.com/api/admin/push/send with x-internal-secret header