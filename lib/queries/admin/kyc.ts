'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AdminKycSubmissionDto } from '@/lib/api/admin/kyc';

export const ADMIN_KYC_QUERY_KEY = ['admin', 'kyc-submissions'] as const;

async function fetchAdminKycSubmissions(): Promise<AdminKycSubmissionDto[]> {
  const res = await fetch('/api/admin/kyc-submissions', { credentials: 'include' });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch KYC submissions.');
  return (json.submissions ?? []) as AdminKycSubmissionDto[];
}

async function patchKycStatus(payload: {
  id: string;
  status: 'approved' | 'rejected';
  reviewer_notes?: string;
}) {
  const res = await fetch(`/api/admin/kyc-submissions/${payload.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? 'Failed to update KYC status.');
  return json.submission;
}

export function useAdminKycSubmissionsQuery() {
  return useQuery({
    queryKey: ADMIN_KYC_QUERY_KEY,
    queryFn: fetchAdminKycSubmissions,
  });
}

export function useApproveKycSubmissionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => patchKycStatus({ id, status: 'approved' }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_KYC_QUERY_KEY });
    },
  });
}

export function useRejectKycSubmissionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewer_notes }: { id: string; reviewer_notes: string }) =>
      patchKycStatus({ id, status: 'rejected', reviewer_notes }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_KYC_QUERY_KEY });
    },
  });
}

