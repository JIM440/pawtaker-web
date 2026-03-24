import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    // `contact_messages` might not exist in all environments yet.
    const client = admin as unknown as {
      from: (table: string) => {
        select: (query: string) => {
          order: (column: string, opts: { ascending: boolean }) => Promise<{
            data: Array<Record<string, unknown>> | null;
            error: { message: string } | null;
          }>;
        };
      };
    };

    const { data, error } = await client
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[api/admin/contact] GET fallback to empty:', error.message);
      return NextResponse.json({ inquiries: [] });
    }

    const inquiries = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? 'Unknown',
      email: row.email ?? '',
      location: row.location ?? '',
      date: row.created_at ?? new Date().toISOString(),
      message: row.message ?? '',
      initials: String(row.name ?? 'U')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join(''),
      imageUrl: row.avatar_url ?? null,
      source: row.source === 'app' ? 'app' : 'website',
      sentiment:
        row.sentiment === 'positive' || row.sentiment === 'negative' || row.sentiment === 'neutral'
          ? row.sentiment
          : undefined,
      resolved: Boolean(row.resolved),
    }));

    return NextResponse.json({ inquiries });
  } catch (e) {
    console.error('[api/admin/contact] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

