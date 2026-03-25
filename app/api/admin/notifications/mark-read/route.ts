import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

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
