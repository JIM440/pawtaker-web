'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useDeactivateAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_deactivated: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to deactivate user.');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}

export function useDeleteAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to delete user.');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}
