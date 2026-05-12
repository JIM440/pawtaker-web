import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

type ContactPayload = {
  name?: string;
  email?: string;
  city?: string;
  subject?: string;
  message?: string;
  locale?: 'en' | 'fr';
};

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = normalizeText(body.name);
    const email = normalizeText(body.email).toLowerCase();
    const city = normalizeText(body.city);
    const subject = normalizeText(body.subject);
    const message = normalizeText(body.message);
    const locale = body.locale === 'fr' ? 'fr' : 'en';

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Name, email, subject, and message are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const admin = createAdminClient();
    const client = admin as unknown as {
      from: (table: string) => {
        select: (query: string) => {
          eq: (column: string, value: boolean) => {
            limit: (value: number) => Promise<{
              data: Array<Record<string, unknown>> | null;
              error: { message: string } | null;
            }>;
          };
        };
        insert: (value: Record<string, unknown> | Array<Record<string, unknown>>) => Promise<{
          data: Array<Record<string, unknown>> | null;
          error: { message: string } | null;
        }> & {
          select?: (query: string) => {
            single: () => Promise<{
              data: Record<string, unknown> | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };

    const { data: adminUsers, error: adminUsersError } = await client
      .from('users')
      .select('id')
      .eq('is_admin', true)
      .limit(1);

    if (adminUsersError) {
      console.error('[api/contact] admin user lookup', adminUsersError);
      return NextResponse.json({ error: 'Failed to route your message.' }, { status: 500 });
    }

    const adminUserId = typeof adminUsers?.[0]?.id === 'string' ? adminUsers[0].id : null;
    if (!adminUserId) {
      return NextResponse.json({ error: 'No admin recipient is configured.' }, { status: 500 });
    }

    const now = new Date().toISOString();
    const preview = `${subject} — ${message}`.slice(0, 280);
    const messageContent = [
      `Subject: ${subject}`,
      `Name: ${name}`,
      `Email: ${email}`,
      city ? `City: ${city}` : null,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const threadInsert = client.from('threads').insert({
      participant_ids: [adminUserId],
      request_id: null,
      last_message_at: now,
      created_at: now,
      last_message_preview: preview,
      last_sender_id: adminUserId,
    });

    if (!threadInsert.select) {
      return NextResponse.json({ error: 'Thread insert is not available.' }, { status: 500 });
    }

    const { data: threadData, error: threadError } = await threadInsert.select('id').single();

    if (threadError || !threadData?.id || typeof threadData.id !== 'string') {
      console.error('[api/contact] thread insert', threadError);
      return NextResponse.json({ error: 'Failed to submit your message.' }, { status: 500 });
    }

    const threadId = threadData.id;

    const { error: messageError } = await client.from('messages').insert({
      thread_id: threadId,
      sender_id: adminUserId,
      content: messageContent,
      type: 'text',
      metadata: {
        source: 'website',
        contact_name: name,
        contact_email: email,
        contact_city: city || null,
        subject,
        locale,
      },
      created_at: now,
      read_at: null,
    });

    if (messageError) {
      console.error('[api/contact] message insert', messageError);
      return NextResponse.json({ error: 'Failed to submit your message.' }, { status: 500 });
    }

    const { error: notificationError } = await client.from('admin_notifications').insert({
      type: 'contact_web',
      title: 'New contact message (website)',
      message: `${name} sent: ${subject}`,
      triggered_by: null,
      reference_id: threadId,
      reference_type: 'thread',
      is_read: false,
      created_at: now,
    });

    if (notificationError) {
      console.error('[api/contact] admin notification insert', notificationError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[api/contact] POST', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
