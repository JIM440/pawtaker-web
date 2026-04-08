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
      .select('id, reviewer_id, reviewee_id, rating, comment, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[api/admin/reviews] GET fallback to empty:', error.message);
      return NextResponse.json({ reviews: [] });
    }

    const reviewRows = (data ?? []) as Array<{
      id: string;
      reviewer_id?: string | null;
      reviewee_id?: string | null;
      rating?: number | null;
      comment?: string | null;
      created_at?: string | null;
    }>;

    const userIds = Array.from(
      new Set(
        reviewRows.flatMap((row) => [row.reviewer_id, row.reviewee_id]).filter((value): value is string => Boolean(value))
      )
    );

    const { data: usersData, error: usersError } =
      userIds.length > 0
        ? await admin
            .from('users')
            .select('id, full_name, display_name, email, avatar_url')
            .in('id', userIds)
        : { data: [], error: null };

    if (usersError) {
      console.warn('[api/admin/reviews] users lookup fallback:', usersError.message);
    }

    const userById = new Map(
      (usersData ?? []).map((user) => [user.id, user] as const)
    );

    const reviews = reviewRows.map((reviewRow) => {
      const reviewer = reviewRow.reviewer_id ? userById.get(reviewRow.reviewer_id) : undefined;
      const reviewee = reviewRow.reviewee_id ? userById.get(reviewRow.reviewee_id) : undefined;

      return {
        id: reviewRow.id,
        stars: Number(reviewRow.rating ?? 0),
        reviewerName: reviewer?.full_name ?? reviewer?.display_name ?? reviewer?.email ?? 'Unknown',
        reviewerEmail: reviewer?.email ?? '',
        reviewerImage: reviewer?.avatar_url ?? null,
        revieweeName: reviewee?.full_name ?? reviewee?.display_name ?? reviewee?.email ?? 'Unknown',
        revieweeEmail: reviewee?.email ?? '',
        revieweeImage: reviewee?.avatar_url ?? null,
        body: reviewRow.comment ?? '',
        date: reviewRow.created_at ? new Date(reviewRow.created_at).toLocaleDateString('en-US') : '',
      };
    });

    return NextResponse.json({ reviews });
  } catch (e) {
    console.error('[api/admin/reviews] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

