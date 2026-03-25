import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/types';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Call at the top of every admin API route.
 * Returns a NextResponse for unauthorized access, or an admin client for privileged operations.
 */
export async function requireAdminClient(): Promise<
  { admin: ReturnType<typeof createAdminClient>; userId: string } | NextResponse
> {
  const cookieStore = await cookies();

  const authClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized - no valid session.' }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden - admin access required.' }, { status: 403 });
  }

  return { admin: adminClient, userId: user.id };
}

