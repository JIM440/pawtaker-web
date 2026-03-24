'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface AdminReportDto {
  id: string;
  reporter: string;
  reason: string;
  details: string;
  status: string;
  createdAt: string;
  reporterImage?: string | null;
}

const QUERY_KEY = ['admin', 'reports'] as const;

export function useAdminReportsQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/admin/reports', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch reports.');
      return (json.reports ?? []) as AdminReportDto[];
    },
  });
}

export function useDeleteAdminReportMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to delete report.');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

