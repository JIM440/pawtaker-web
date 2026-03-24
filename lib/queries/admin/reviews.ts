'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface AdminReviewDto {
  id: string;
  stars: number;
  reviewerName: string;
  reviewerEmail: string;
  reviewerImage?: string | null;
  revieweeName: string;
  revieweeEmail: string;
  revieweeImage?: string | null;
  body: string;
  date: string;
}

const QUERY_KEY = ['admin', 'reviews'] as const;

export function useAdminReviewsQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/admin/reviews', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch reviews.');
      return (json.reviews ?? []) as AdminReviewDto[];
    },
  });
}

export function useDeleteAdminReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to delete review.');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

