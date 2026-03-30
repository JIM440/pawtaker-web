import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const { data, error } = await admin
      .from('admin_notifications')
      .select('id,type,title,message,triggered_by,reference_id,reference_type,is_read,created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;
    const triggeredByIds = Array.from(
      new Set(
        rows
          .map((r) => r.triggered_by)
          .filter((v): v is string => typeof v === 'string' && v.length > 0)
      )
    );

    const { data: usersData } = triggeredByIds.length
      ? await admin
          .from('users')
          .select('id, full_name, display_name, avatar_url')
          .in('id', triggeredByIds)
      : { data: [] };

    const userById = new Map(
      (usersData ?? []).map((u) => [u.id, u] as const)
    );

    const notifications = rows.map((r) => {
      const triggeredBy = typeof r.triggered_by === 'string' ? r.triggered_by : null;
      const user = triggeredBy ? userById.get(triggeredBy) ?? null : null;

      return {
        id: String(r.id),
        type: String(r.type ?? ''),
        title: typeof r.title === 'string' && r.title ? r.title : String(r.type ?? ''),
        message: typeof r.message === 'string' ? r.message : '',
        triggered_by: triggeredBy,
        reference_id: typeof r.reference_id === 'string' ? r.reference_id : null,
        reference_type: typeof r.reference_type === 'string' ? r.reference_type : null,
        is_read: Boolean(r.is_read),
        created_at: String(r.created_at ?? ''),
        user:
          user
            ? {
                full_name: user.full_name ?? user.display_name ?? '',
                avatar_url: user.avatar_url ?? null,
              }
            : null,
      };
    });

    return NextResponse.json({ notifications });
  } catch (e) {
    console.error('[api/admin/notifications] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
