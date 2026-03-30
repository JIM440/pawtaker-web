import { NextResponse } from 'next/server';
import { fetchNonAdminUsersForAdmin } from '@/lib/api/admin/users';
import { requireAdminClient } from '@/lib/api/admin/auth';

/**
 * GET /api/admin/users
 * Returns non-admin users from `public.users` (`is_admin = false`) for authenticated admin sessions only.
 */
export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const { data: users, error } = await fetchNonAdminUsersForAdmin(admin);

    if (error) {
      console.error('[api/admin/users]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const userRows = (users ?? []) as Array<{ id: string } & Record<string, unknown>>;
    const userIds = userRows.map((u) => u.id).filter(Boolean);

    // NOTE: The project's Supabase `Database` type doesn't currently include the `pets` table.
    // We still query it at runtime for `pets_count`, so we use a minimal typed wrapper here.
    const petsClient = admin as unknown as {
      from: (table: string) => {
        select: (columns: string) => {
          in: (
            column: string,
            values: string[]
          ) => Promise<{
            data: Array<{ owner_id: string | null }> | null;
            error: { message: string } | null;
          }>;
        };
      };
    };

    const { data: petsOwners, error: petsErr } =
      userIds.length > 0
        ? await petsClient.from('pets').select('owner_id').in('owner_id', userIds)
        : { data: [], error: null };

    if (petsErr) {
      console.warn('[api/admin/users] pets count fallback:', petsErr.message);
      return NextResponse.json({
        users: userRows.map((u) => ({ ...u, pets_count: 0 })),
      });
    }

    const petsCountByOwnerId = new Map<string, number>();
    for (const row of petsOwners ?? []) {
      const ownerId = (row as { owner_id?: unknown }).owner_id;
      if (typeof ownerId !== 'string') continue;
      petsCountByOwnerId.set(ownerId, (petsCountByOwnerId.get(ownerId) ?? 0) + 1);
    }

    const usersWithPets = userRows.map((u) => ({
      ...u,
      pets_count: petsCountByOwnerId.get(u.id) ?? 0,
    }));

    return NextResponse.json({ users: usersWithPets });
  } catch (e) {
    console.error('[api/admin/users]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
