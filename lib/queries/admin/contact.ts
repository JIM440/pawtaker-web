'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ContactInquiry } from '@/components/admin/ContactInquiryCard';

const QUERY_KEY = ['admin', 'contact'] as const;

export function useAdminContactQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/admin/contact', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch contact inquiries.');
      return (json.inquiries ?? []) as ContactInquiry[];
    },
  });
}

export function useDeleteAdminContactMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to delete contact inquiry.');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

