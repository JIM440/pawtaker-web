import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdminClient();
  if (result instanceof NextResponse) return result;
  const { admin } = result;
  const { id } = await params;

  const { error } = await admin
    .from('admin_notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
