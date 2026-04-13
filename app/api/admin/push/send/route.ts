import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createAdminClient } from '@/lib/supabase/admin';

const vapidEmail = process.env.VAPID_EMAIL;
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const hasVapidConfig = Boolean(vapidEmail && vapidPublicKey && vapidPrivateKey);

if (hasVapidConfig) {
  webpush.setVapidDetails(
    `mailto:${vapidEmail}`,
    vapidPublicKey!,
    vapidPrivateKey!
  );
}

export async function POST(req: Request) {
  if (!hasVapidConfig) {
    return NextResponse.json(
      { error: 'Push notifications are not configured.' },
      { status: 503 }
    );
  }

  // This route is called by the DB trigger; validate with internal secret only.
  const authHeader = req.headers.get('x-internal-secret');
  if (authHeader !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, message, url } = await req.json();
  const admin = createAdminClient();

  // Get all subscriptions for all admins across all devices.
  const { data: subs, error } = await admin
    .from('admin_push_subscriptions')
    .select('id, subscription');

  if (error || !subs?.length) {
    return NextResponse.json({ sent: 0, failed: 0 });
  }

  const uniqueSubs = Array.from(
    new Map(
      subs
        .filter((row) => {
          const endpoint = (row.subscription as { endpoint?: unknown } | null)?.endpoint;
          return typeof endpoint === 'string' && endpoint.length > 0;
        })
        .map((row) => [String((row.subscription as { endpoint: string }).endpoint), row] as const)
    ).values()
  );

  const payload = JSON.stringify({ title, message, url });

  let sent = 0;
  let failed = 0;

  for (const row of uniqueSubs) {
    try {
      await webpush.sendNotification(
        row.subscription as unknown as webpush.PushSubscription,
        payload
      );
      sent++;
    } catch (err: unknown) {
      failed++;

      // 404/410 means the subscription is expired or unsubscribed.
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await admin
          .from('admin_push_subscriptions')
          .delete()
          .eq('id', row.id);
      }
    }
  }

  return NextResponse.json({ sent, failed });
}
