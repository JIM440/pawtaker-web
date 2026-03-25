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

  const { error } = await admin
    .from('users')
    .update({ push_subscription: subscription })
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
