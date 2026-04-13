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

    const userById = new Map((usersData ?? []).map((user) => [user.id, user] as const));

    const inquiries = threads.map((thread) => {
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
        primaryUser?.full_name ??
        primaryUser?.display_name ??
        primaryUser?.email ??
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
        email: primaryUser?.email ?? '',
        location: primaryUser?.city ?? '',
        date: thread.last_message_at ?? thread.created_at ?? new Date().toISOString(),
        message: thread.last_message_preview?.trim() || 'No message preview available.',
        initials,
        imageUrl: primaryUser?.avatar_url ?? null,
        source: 'app' as const,
        resolved: false,
      };
    });

    return NextResponse.json({ inquiries });
  } catch (e) {
    console.error('[api/admin/contact] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

