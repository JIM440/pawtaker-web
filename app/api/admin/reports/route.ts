import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const { data, error } = await admin
      .from('reports')
      .select('id, reason, details, status, created_at, reporter_id, users!reports_reporter_id_fkey(full_name, display_name, email, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[api/admin/reports] GET', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const reports = (data ?? []).map((row) => {
      const reportRow = row as {
        id: string;
        reason: string;
        details: string | null;
        status: string;
        created_at: string;
        users?: {
          full_name?: string | null;
          display_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
        } | null;
      };
      const reporter = reportRow.users ?? null;
      const reporterName = reporter?.full_name || reporter?.display_name || reporter?.email || 'Unknown';
      return {
        id: reportRow.id,
        reporter: reporterName,
        reason: reportRow.reason,
        details: reportRow.details ?? '',
        status: reportRow.status,
        createdAt: reportRow.created_at,
        reporterImage: reporter?.avatar_url ?? null,
      };
    });

    return NextResponse.json({ reports });
  } catch (e) {
    console.error('[api/admin/reports] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

