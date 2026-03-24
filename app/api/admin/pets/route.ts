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
        };
      };
    };

    const { data, error } = await client
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[api/admin/pets] GET fallback to empty:', error.message);
      return NextResponse.json({ pets: [] });
    }

    const pets = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? 'Unnamed',
      image: row.image_url ?? null,
      species: row.species ?? 'Other',
      breed: row.breed ?? '-',
      ownerName: row.owner_name ?? 'Unknown',
      ownerImage: row.owner_avatar_url ?? null,
      ownerEmail: row.owner_email ?? '',
      dob: row.dob ?? '2020-01-01',
      tags: Array.isArray(row.tags) ? row.tags : [],
      careRequests: Number(row.care_requests_count ?? 0),
    }));

    return NextResponse.json({ pets });
  } catch (e) {
    console.error('[api/admin/pets] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

