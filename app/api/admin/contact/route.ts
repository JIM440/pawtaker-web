import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const client = admin as unknown as {
      from: (table: string) => {
        select: (query: string) => {
          order: (column: string, opts: { ascending: boolean }) => Promise<{
            data: Array<Record<string, unknown>> | null;
            error: { message: string } | null;
          }>;
          in: (
            column: string,
            values: string[]
          ) => Promise<{
            data: Array<Record<string, unknown>> | null;
            error: { message: string } | null;
          }>;
        };
      };
    };

    const { data, error } = await client
      .from('threads')
      .select('id, participant_ids, last_message_at, created_at, last_message_preview')
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('[api/admin/contact] GET', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const threads = (data ?? []) as Array<{
      id?: string;
      participant_ids?: unknown;
      last_message_at?: string | null;
      created_at?: string | null;
      last_message_preview?: string | null;
    }>;

    const threadIds = threads
      .map((thread) => (typeof thread.id === 'string' ? thread.id : ''))
      .filter(Boolean);

    const participantIds = Array.from(
      new Set(
        threads.flatMap((thread) =>
          Array.isArray(thread.participant_ids)
            ? thread.participant_ids.filter((value): value is string => typeof value === 'string')
            : []
        )
      )
    );

    const { data: usersData, error: usersError } =
      participantIds.length > 0
        ? await admin
            .from('users')
            .select('id, full_name, display_name, email, avatar_url, city, is_admin')
            .in('id', participantIds)
        : { data: [], error: null };

    if (usersError) {
      console.error('[api/admin/contact] users lookup', usersError);
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    const { data: messagesData, error: messagesError } =
      threadIds.length > 0
        ? await (admin as unknown as {
            from: (table: string) => {
              select: (query: string) => {
                in: (
                  column: string,
                  values: string[]
                ) => {
                  order: (
                    column: string,
                    opts: { ascending: boolean }
                  ) => Promise<{
                    data: Array<Record<string, unknown>> | null;
                    error: { message: string } | null;
                  }>;
                };
              };
            };
          })
            .from('messages')
            .select('thread_id, content, metadata, created_at')
            .in('thread_id', threadIds)
            .order('created_at', { ascending: false })
        : { data: [], error: null };

    if (messagesError) {
      console.error('[api/admin/contact] messages lookup', messagesError);
      return NextResponse.json({ error: messagesError.message }, { status: 500 });
    }

    const userById = new Map((usersData ?? []).map((user) => [user.id, user] as const));
    const latestMessageByThreadId = new Map<string, Record<string, unknown>>();

    for (const message of messagesData ?? []) {
      const threadId = typeof message.thread_id === 'string' ? message.thread_id : null;
      if (!threadId || latestMessageByThreadId.has(threadId)) continue;
      latestMessageByThreadId.set(threadId, message);
    }

    const inquiries = threads.map((thread) => {
      const latestMessage = typeof thread.id === 'string' ? latestMessageByThreadId.get(thread.id) : undefined;
      const metadata =
        latestMessage && typeof latestMessage.metadata === 'object' && latestMessage.metadata !== null
          ? (latestMessage.metadata as Record<string, unknown>)
          : null;
      const source = metadata?.source === 'website' ? 'website' : 'app';
      const websiteName =
        typeof metadata?.contact_name === 'string' ? metadata.contact_name.trim() : '';
      const websiteEmail =
        typeof metadata?.contact_email === 'string' ? metadata.contact_email.trim() : '';
      const websiteCity =
        typeof metadata?.contact_city === 'string' ? metadata.contact_city.trim() : '';
      const threadParticipantIds = Array.isArray(thread.participant_ids)
        ? thread.participant_ids.filter((value): value is string => typeof value === 'string')
        : [];
      const participants = threadParticipantIds
        .map((participantId) => userById.get(participantId))
        .filter(Boolean);
      const primaryUser =
        participants.find((user) => !user?.is_admin) ??
        participants[0] ??
        null;

      const name =
        websiteName ||
        primaryUser?.full_name ||
        primaryUser?.display_name ||
        primaryUser?.email ||
        'Unknown';

      const initials = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((segment) => segment[0]?.toUpperCase())
        .join('') || 'U';

      return {
        id: String(thread.id ?? ''),
        name,
        email: websiteEmail || primaryUser?.email || '',
        location: websiteCity || primaryUser?.city || '',
        date: thread.last_message_at ?? thread.created_at ?? new Date().toISOString(),
        message:
          thread.last_message_preview?.trim() ||
          (typeof latestMessage?.content === 'string' && latestMessage.content.trim()) ||
          'No message preview available.',
        initials,
        imageUrl: primaryUser?.avatar_url ?? null,
        source,
        resolved: false,
      };
    });

    return NextResponse.json({ inquiries });
  } catch (e) {
    console.error('[api/admin/contact] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

