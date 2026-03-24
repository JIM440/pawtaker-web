import { NextRequest, NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;
    const { id } = await context.params;

    if (!id) return NextResponse.json({ error: 'Request id is required.' }, { status: 400 });

    const { error } = await admin.from('care_requests').delete().eq('id', id);
    if (error) {
      console.error('[api/admin/requests/:id] DELETE', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/admin/requests/:id] DELETE', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

