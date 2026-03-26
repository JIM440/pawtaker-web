import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function POST(req: Request) {
  const result = await requireAdminClient();
  if (result instanceof NextResponse) return result;
  const { admin, userId } = result;

  const { subscription } = await req.json();

  if (!subscription?.endpoint) {
    return NextResponse.json({ error: 'Invalid subscription object.' }, { status: 400 });
  }

  // Delete any existing row for this exact endpoint first, then insert fresh.
  // This avoids the upsert JSONB expression conflict issue and handles
  // re-subscriptions cleanly (e.g. after browser clears service workers).
  await admin
    .from('admin_push_subscriptions')
    .delete()
    .eq('user_id', userId)
    .eq('subscription->>endpoint', subscription.endpoint);

  const { error } = await admin
    .from('admin_push_subscriptions')
    .insert({ user_id: userId, subscription });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
