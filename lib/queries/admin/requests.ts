'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface AdminRequestDto {
  id: string;
  petName: string;
  petBreed: string;
  petImage?: string | null;
  ownerName: string;
  ownerImage?: string | null;
  ownerEmail: string;
  careGivenByName: string;
  careGivenByImage?: string | null;
  careGivenByEmail: string;
  careGivenByState: 'assigned' | 'not_assigned_yet' | 'not_completed';
  careType: 'daytime' | 'play/walk' | 'vacation' | 'night';
  serviceDates: string;
  status: 'ongoing' | 'completed' | 'canceled';
}

const QUERY_KEY = ['admin', 'requests'] as const;

export function useAdminRequestsQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/admin/requests', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch care requests.');
      return (json.requests ?? []) as AdminRequestDto[];
    },
  });
}

export function useDeleteAdminRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to delete request.');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

