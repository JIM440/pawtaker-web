import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const { data, error } = await admin
      .from('user_blocks')
      .select('blocker_id, blocked_id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[api/admin/blocks] GET', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const blockRows = (data ?? []) as Array<{
      blocker_id?: string | null;
      blocked_id?: string | null;
      created_at?: string | null;
    }>;

    const userIds = Array.from(
      new Set(
        blockRows
          .flatMap((row) => [row.blocker_id, row.blocked_id])
          .filter((value): value is string => Boolean(value))
      )
    );

    const { data: usersData, error: usersError } =
      userIds.length > 0
        ? await admin
            .from('users')
            .select('id, full_name, display_name, email, avatar_url, city')
            .in('id', userIds)
        : { data: [], error: null };

    if (usersError) {
      console.error('[api/admin/blocks] users lookup', usersError);
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    const userById = new Map((usersData ?? []).map((user) => [user.id, user] as const));

    const blocks = blockRows.map((row, index) => {
      const blocker = row.blocker_id ? userById.get(row.blocker_id) : undefined;
      const blocked = row.blocked_id ? userById.get(row.blocked_id) : undefined;

      return {
        id: `${row.blocker_id ?? 'unknown'}-${row.blocked_id ?? 'unknown'}-${index}`,
        blockerName: blocker?.full_name ?? blocker?.display_name ?? blocker?.email ?? 'Unknown',
        blockerEmail: blocker?.email ?? '',
        blockerAvatarUrl: blocker?.avatar_url ?? null,
        blockedName: blocked?.full_name ?? blocked?.display_name ?? blocked?.email ?? 'Unknown',
        blockedEmail: blocked?.email ?? '',
        blockedAvatarUrl: blocked?.avatar_url ?? null,
        blockerCity: blocker?.city ?? '',
        blockedCity: blocked?.city ?? '',
        reason: null,
        createdAt: row.created_at ?? '',
      };
    });

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error('[api/admin/blocks] GET', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
