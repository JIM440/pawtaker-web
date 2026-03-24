'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import KycCard, { type KycSubmission } from '@/components/admin/KycCard';
import Skeleton from '@/components/ui/Skeleton';
import {
  useAdminKycSubmissionsQuery,
  useApproveKycSubmissionMutation,
  useRejectKycSubmissionMutation,
} from '@/lib/queries/admin/kyc';

type KycFilter = 'All' | 'Pending' | 'Approved' | 'Rejected';

function isApprovedLike(s: KycSubmission): boolean {
  return s.status === 'Approved';
}

export default function KYCPage() {
  const t = useTranslations('admin.kyc');
  const [activeFilter, setActiveFilter] = useState<KycFilter>('All');
  const [search, setSearch] = useState('');
  const kycQuery = useAdminKycSubmissionsQuery();
  const approveMutation = useApproveKycSubmissionMutation();
  const rejectMutation = useRejectKycSubmissionMutation();

  const submissions: KycSubmission[] = useMemo(() => {
    const formatDate = (value: string) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    return (kycQuery.data ?? []).map((s) => ({
      id: s.id,
      userName: s.userName,
      userEmail: s.userEmail,
      userInitials: s.userInitials,
      userImage: s.userImage ?? undefined,
      submittedAt: formatDate(s.submittedAt),
      documentType: s.documentType,
      status: s.status,
      images: s.images,
      rejectionReason: s.rejectionReason,
    }));
  }, [kycQuery.data]);

  const counts: Record<KycFilter, number> = useMemo(() => {
    return {
      All: submissions.length,
      Pending: submissions.filter((s) => s.status === 'Pending').length,
      Approved: submissions.filter(isApprovedLike).length,
      Rejected: submissions.filter((s) => s.status === 'Rejected').length,
    };
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return submissions
      .filter((s) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Approved') return isApprovedLike(s);
        return s.status === activeFilter;
      })
      .filter(
        (s) =>
          !q ||
          s.userName.toLowerCase().includes(q) ||
          s.userEmail.toLowerCase().includes(q)
      );
  }, [submissions, activeFilter, search]);

  const handleStatusChange = async (id: string, status: 'Approved' | 'Rejected', reason?: string) => {
    try {
      if (status === 'Approved') {
        await approveMutation.mutateAsync({ id });
      } else {
        await rejectMutation.mutateAsync({ id, reviewer_notes: reason ?? '' });
      }
    } catch (error) {
      console.error('[admin/kyc] failed to update status', error);
    }
  };

  return (
    <div className="overflow-x-hidden p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5 sm:w-auto">
            <label
              htmlFor="kyc-status-filter"
              className="text-[11px] font-bold uppercase tracking-wide text-on-surface/50"
            >
              {t('filterStatusLabel')}
            </label>
            <div className="relative w-full sm:w-fit">
              <select
                id="kyc-status-filter"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as KycFilter)}
                className="w-full min-w-40 cursor-pointer appearance-none rounded-full border border-outline/30 bg-white px-3 py-1.5 pr-9 text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25 sm:w-auto"
              >
                <option value="All">
                  {t('all')} ({counts.All})
                </option>
                <option value="Pending">
                  {t('filterPending')} ({counts.Pending})
                </option>
                <option value="Approved">
                  {t('filterApproved')} ({counts.Approved})
                </option>
                <option value="Rejected">
                  {t('filterRejected')} ({counts.Rejected})
                </option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/50"
                aria-hidden="true"
              />
            </div>
          </div>

        <div className="relative min-w-0 w-full sm:max-w-md">
          <label htmlFor="kyc-search" className="sr-only">
            {t('searchLabel')}
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/40"
            aria-hidden="true"
          />
          <input
            id="kyc-search"
            type="search"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full cursor-text rounded-full border border-outline/30 bg-white py-2 pl-9 pr-4 text-sm text-on-surface placeholder:text-on-surface/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {kycQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-outline/20 bg-white shadow-sm"
            >
              <Skeleton className="h-[190px] w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : kycQuery.isError ? (
        <div className="text-center py-16 text-on-surface/60">
          <p className="text-sm mb-4">
            {kycQuery.error instanceof Error ? kycQuery.error.message : 'Failed to load KYC submissions.'}
          </p>
          <button
            type="button"
            onClick={() => kycQuery.refetch()}
            className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface/50">
          <Search className="mx-auto mb-3 h-10 w-10" aria-hidden="true" />
          <p className="text-sm">{t('emptyState')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((submission) => (
            <KycCard
              key={submission.id}
              submission={submission}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
