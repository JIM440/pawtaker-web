/**
 * Public Supabase key for browser + server clients (anon / publishable).
 *
 * Supabase Dashboard may label this "anon" / "public" — JWT (`eyJ...`) or newer
 * `sb_publishable_...`. Either works with `@supabase/supabase-js`.
 *
 * Support both env names so Vercel/deployments match common tutorials (ANON_KEY)
 * and our docs (PUBLISHABLE_DEFAULT_KEY).
 */
export function getSupabasePublicKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key?.trim()) {
    throw new Error(
      'Missing Supabase public key: set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment (e.g. Vercel → Environment Variables).'
    );
  }
  return key.trim();
}
