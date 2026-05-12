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

    const { error: messagesError } = await client.from('messages').delete().eq('thread_id', id);
    if (messagesError) {
      return NextResponse.json({ error: messagesError.message }, { status: 500 });
    }

    const { error: threadError } = await client.from('threads').delete().eq('id', id);
    if (threadError) {
      return NextResponse.json({ error: threadError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/admin/contact/:id] DELETE', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

