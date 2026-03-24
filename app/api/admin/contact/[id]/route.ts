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

    if (!id) return NextResponse.json({ error: 'Message id is required.' }, { status: 400 });

    const client = admin as unknown as {
      from: (table: string) => {
        delete: () => { eq: (column: string, value: string) => Promise<{ error: { message: string } | null }> };
      };
    };
    const { error } = await client.from('contact_messages').delete().eq('id', id);
    if (error) {
      console.warn('[api/admin/contact/:id] DELETE no-op:', error.message);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/admin/contact/:id] DELETE', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

