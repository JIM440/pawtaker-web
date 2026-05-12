'use client';

import { useQuery } from '@tanstack/react-query';

export interface AdminBlockRow {
  id: string;
  blockerName: string;
  blockerEmail: string;
  blockerAvatarUrl?: string | null;
  blockedName: string;
  blockedEmail: string;
  blockedAvatarUrl?: string | null;
  blockerCity: string;
  blockedCity: string;
  reason: string | null;
  createdAt: string;
}

const QUERY_KEY = ['admin', 'blocks'] as const;

export function useAdminBlocksQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/admin/blocks', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch user blocks.');
      return (json.blocks ?? []) as AdminBlockRow[];
    },
  });
}
