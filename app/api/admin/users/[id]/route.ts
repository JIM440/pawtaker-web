import { NextRequest, NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;
    const { id } = await context.params;
    const body = (await request.json()) as { is_deactivated?: boolean };

    if (!id) return NextResponse.json({ error: 'User id is required.' }, { status: 400 });
    if (typeof body.is_deactivated !== 'boolean') {
      return NextResponse.json({ error: '`is_deactivated` must be a boolean.' }, { status: 400 });
    }

    const { error } = await admin.from('users').update({ is_deactivated: body.is_deactivated }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/admin/users/:id] PATCH', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;
    const { id } = await context.params;

    if (!id) return NextResponse.json({ error: 'User id is required.' }, { status: 400 });

    const { error } = await admin.from('users').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/admin/users/:id] DELETE', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

