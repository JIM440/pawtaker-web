'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface AdminPetDto {
  id: string;
  name: string;
  image?: string | null;
  species: string;
  breed: string;
  ownerName: string;
  ownerImage?: string | null;
  ownerEmail: string;
  dob: string;
  tags: string[];
  careRequests: number;
}

const QUERY_KEY = ['admin', 'pets'] as const;

export function useAdminPetsQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/admin/pets', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch pets.');
      return (json.pets ?? []) as AdminPetDto[];
    },
  });
}

export function useDeleteAdminPetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/pets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to delete pet.');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

