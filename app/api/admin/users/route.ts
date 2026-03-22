import { NextResponse } from 'next/server';
import { fetchNonAdminUsersForAdmin } from '@/lib/api/admin/users';
import { createAdminClient, createServerSideClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/users
 * Returns non-admin users from `public.users` (`is_admin = false`) for authenticated admin sessions only.
 */
export async function GET() {
  try {
    const supabaseAuth = await createServerSideClient();
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: users, error } = await fetchNonAdminUsersForAdmin(admin);

    if (error) {
      console.error('[api/admin/users]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: users ?? [] });
  } catch (e) {
    console.error('[api/admin/users]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
