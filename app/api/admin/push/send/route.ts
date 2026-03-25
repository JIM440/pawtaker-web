import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createAdminClient } from '@/lib/supabase/admin';

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  const authHeader = req.headers.get('x-internal-secret');
  if (authHeader !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, message, url } = await req.json();
  const admin = createAdminClient();

  const { data: admins, error } = await admin
    .from('users')
    .select('id, push_subscription')
    .eq('is_admin', true)
    .not('push_subscription', 'is', null);

  if (error || !admins?.length) {
    return NextResponse.json({ sent: 0 });
  }

  const payload = JSON.stringify({ title, message, url });

  const results = await Promise.allSettled(
    admins.map((a) =>
      webpush.sendNotification(a.push_subscription as unknown as webpush.PushSubscription, payload)
    )
  );

  const sent   = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return NextResponse.json({ sent, failed });
}
