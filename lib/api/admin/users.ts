import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

export type AdminUserRow = Database['public']['Tables']['users']['Row'];

/**
 * Fetches platform users from `public.users` who are not admins.
 * Matches `is_admin = false` OR `is_admin IS NULL` (Supabase often leaves NULL until set).
 * Rows with `is_admin = true` are excluded. Use with service-role client after verifying the caller is an admin.
 */
export async function fetchNonAdminUsersForAdmin(supabase: SupabaseClient<Database>) {
  return supabase
    .from('users')
    .select('*')
    .or('is_admin.eq.false,is_admin.is.null')
    .order('created_at', { ascending: false });
}
