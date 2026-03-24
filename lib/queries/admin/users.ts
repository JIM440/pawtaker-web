'use client';

import { useQuery } from '@tanstack/react-query';
import type { AdminUserRow } from '@/lib/api/admin/users';

export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'] as const;

async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  const res = await fetch('/api/admin/users', { credentials: 'include' });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch users.');
  return (json.users ?? []) as AdminUserRow[];
}

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: fetchAdminUsers,
  });
}
