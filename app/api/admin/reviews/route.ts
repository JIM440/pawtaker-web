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
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[api/admin/reviews] GET fallback to empty:', error.message);
      return NextResponse.json({ reviews: [] });
    }

    const reviews = (data ?? []).map((row) => {
      const reviewRow = row as {
        id: string;
        rating?: number | null;
        reviewer_name?: string | null;
        reviewer_email?: string | null;
        reviewer_avatar_url?: string | null;
        reviewee_name?: string | null;
        reviewee_email?: string | null;
        reviewee_avatar_url?: string | null;
        body?: string | null;
        created_at?: string | null;
      };
      return {
        id: reviewRow.id,
        stars: Number(reviewRow.rating ?? 0),
        reviewerName: reviewRow.reviewer_name ?? 'Unknown',
        reviewerEmail: reviewRow.reviewer_email ?? '',
        reviewerImage: reviewRow.reviewer_avatar_url ?? null,
        revieweeName: reviewRow.reviewee_name ?? 'Unknown',
        revieweeEmail: reviewRow.reviewee_email ?? '',
        revieweeImage: reviewRow.reviewee_avatar_url ?? null,
        body: reviewRow.body ?? '',
        date: reviewRow.created_at ? new Date(reviewRow.created_at).toLocaleDateString('en-US') : '',
      };
    });

    return NextResponse.json({ reviews });
  } catch (e) {
    console.error('[api/admin/reviews] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

