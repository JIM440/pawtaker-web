'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import LabeledSearch from '@/components/admin/LabeledSearch';
import LabeledSelect from '@/components/admin/LabeledSelect';
import UserAvatar from '@/components/admin/UserAvatar';
import { useToast } from '@/components/ui/ToastProvider';
import { useAdminRequestsQuery, useDeleteAdminRequestMutation } from '@/lib/queries/admin/requests';
import Skeleton from '@/components/ui/Skeleton';

type RequestStatus = 'ongoing' | 'completed' | 'canceled';
type StatusFilter = 'all' | RequestStatus;

type CareType = 'daytime' | 'play/walk' | 'vacation' | 'night';

interface CareRequest {
  id: string;
  petName: string;
  petBreed: string;
  petImage: string;
  ownerName: string;
  ownerImage: string;
  ownerEmail: string;
  careGivenByName: string;
  careGivenByImage: string;
  careGivenByEmail: string;
  careGivenByState: 'assigned' | 'not_assigned_yet' | 'not_completed';
  careType: CareType;
  serviceDates: string;
  status: RequestStatus;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');
}

function RequestActionsMenu({
  requestId,
  onDelete,
}: {
  requestId: string;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations('admin.requests');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded-full p-2 text-on-surface/50 transition-colors hover:bg-surface-container hover:text-on-surface"
        aria-label={t('openActionsAriaLabel')}
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-outline/20 bg-white py-1 shadow-lg ring-1 ring-black/5">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(requestId);
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-error hover:bg-error/5"
          >
            <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t('deleteConfirmLabel')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function RequestsPage() {
  const t = useTranslations('admin.requests');
  const tModal = useTranslations('admin.modal');
  const { showToast } = useToast();
  const requestsQuery = useAdminRequestsQuery();
  const deleteRequestMutation = useDeleteAdminRequestMutation();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const requests = useMemo(() => (requestsQuery.data ?? []) as CareRequest[], [requestsQuery.data]);

  const getCareGivenByDisplay = (request: CareRequest) => {
    if (request.careGivenByState === 'assigned') {
      return {
        name: request.careGivenByName,
        email: request.careGivenByEmail,
        image: request.careGivenByImage,
      };
    }

    if (request.careGivenByState === 'not_completed') {
      return {
        name: t('careGivenByNotCompleted'),
        email: t('careGivenByNotCompletedHint'),
        image: '',
      };
    }

    return {
      name: t('careGivenByNotAssignedYet'),
      email: t('careGivenByNotAssignedYetHint'),
      image: '',
    };
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      const matchStatus = status === 'all' ? true : r.status === status;
      const careGivenByDisplay = getCareGivenByDisplay(r);
      const hay = [
        r.petName,
        r.petBreed,
        r.ownerName,
        r.ownerEmail,
        careGivenByDisplay.name,
        careGivenByDisplay.email,
        r.careType,
        r.serviceDates,
      ]
        .join(' ')
        .toLowerCase();
      const matchSearch = !q || hay.includes(q);
      return matchStatus && matchSearch;
    });
  }, [requests, search, status, t]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRequestMutation.mutateAsync(deleteId);
      showToast(t('deleteConfirmLabel'), 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete request.', 'error');
    }
    setDeleteId(null);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:w-fit">
          <LabeledSelect
            id="care-requests-status"
            label={t('filters.statusLabel')}
            value={status}
            onChange={(next) => setStatus(next as StatusFilter)}
            options={[
              { value: 'all', label: t('statusAll') },
              { value: 'ongoing', label: t('statusOngoing') },
              { value: 'completed', label: t('statusCompleted') },
              { value: 'canceled', label: t('statusCanceled') },
            ]}
          />
        </div>

        <div className="w-full sm:max-w-md">
          <LabeledSearch
            id="care-requests-search"
            label={t('searchLabel')}
            value={search}
            placeholder={t('searchPlaceholder')}
            onChange={setSearch}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline/20 bg-white shadow-sm">
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline/10 bg-white text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">{t('table.petBreed')}</th>
                <th className="px-6 py-4">{t('table.owner')}</th>
                <th className="px-6 py-4">{t('table.careGivenBy')}</th>
                <th className="hidden px-6 py-4 sm:table-cell">{t('table.serviceDates')}</th>
                <th className="px-6 py-4">{t('table.careType')}</th>
                <th className="px-6 py-4">{t('table.status')}</th>
                <th className="px-6 py-4 text-center">{t('table.actions')}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline/10 text-sm">
              {requestsQuery.isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 sm:table-cell">
                      <Skeleton className="h-4 w-36" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                    </td>
                  </tr>
                ))}

              {requestsQuery.isError && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    <p className="mb-3">
                      {requestsQuery.error instanceof Error
                        ? requestsQuery.error.message
                        : 'Failed to load care requests.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => requestsQuery.refetch()}
                      className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              )}

              {!requestsQuery.isLoading && !requestsQuery.isError && filtered.map((r) => {
                const careGivenByDisplay = getCareGivenByDisplay(r);
                const statusClass =
                  r.status === 'ongoing'
                    ? 'bg-blue-100 text-blue-800'
                    : r.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-700';
                const statusLabel =
                  r.status === 'ongoing'
                    ? t('statusOngoing')
                    : r.status === 'completed'
                      ? t('statusCompleted')
                      : t('statusCanceled');

                const careTypeLabel =
                  r.careType === 'play/walk'
                    ? t('careTypePlayWalk')
                    : r.careType === 'daytime'
                      ? t('careTypeDaytime')
                      : r.careType === 'vacation'
                        ? t('careTypeVacation')
                        : t('careTypeNight');

                return (
                  <tr key={r.id} className="transition-colors hover:bg-white">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.petImage} alt={r.petName} className="size-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-on-surface">{r.petName}</div>
                          <div className="text-xs text-on-surface/60">{r.petBreed}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          imageUrl={r.ownerImage}
                          initials={getInitials(r.ownerName)}
                          alt={r.ownerName}
                          size={32}
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-on-surface">{r.ownerName}</div>
                          <div className="text-xs text-on-surface/60">{r.ownerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          imageUrl={careGivenByDisplay.image}
                          initials={getInitials(careGivenByDisplay.name)}
                          alt={careGivenByDisplay.name}
                          size={32}
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-on-surface">{careGivenByDisplay.name}</div>
                          <div className="text-xs text-on-surface/60">{careGivenByDisplay.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 sm:table-cell">
                      <div className="text-sm text-on-surface">{r.serviceDates}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {careTypeLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <RequestActionsMenu requestId={r.id} onDelete={setDeleteId} />
                    </td>
                  </tr>
                );
              })}

              {!requestsQuery.isLoading && !requestsQuery.isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    {t('emptyState')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between rounded-b-xl border-t border-outline/10 bg-white px-6 py-4 text-sm text-on-surface/70">
          <div>{t('paginationShowing', { shown: filtered.length, total: requests.length })}</div>
          <div className="flex gap-2">
            <button
              className="rounded border border-outline/30 bg-white p-2 text-on-surface/60 disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button className="rounded border border-outline/30 bg-white p-2 text-on-surface/80">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        title={t('deleteConfirmTitle')}
        description={t('deleteConfirmDesc')}
        confirmLabel={t('deleteConfirmLabel')}
        cancelLabel={tModal('cancel')}
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
