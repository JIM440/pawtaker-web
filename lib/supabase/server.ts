import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

/**
 * Cookie adapter safe for Server Components + Server Actions.
 * Next.js only allows cookie writes in Server Actions or Route Handlers.
 * Supabase may call setAll during getSession/getUser refresh — ignore when not allowed.
 */
function cookieAdapter(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // Called from RSC render (e.g. layout) — session refresh cookies cannot be set here.
        // Middleware or a future Server Action / Route Handler can refresh the session.
      }
    },
  };
}

/**
 * Server-side Supabase client — for use in RSC and Server Actions ONLY.
 * Uses service role key for admin operations.
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: cookieAdapter(cookieStore),
    }
  );
}

/**
 * Server-side Supabase client using the anon key (respects RLS).
 * Use for reading public data in RSC.
 */
export async function createServerSideClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: cookieAdapter(cookieStore),
    }
  );
}
