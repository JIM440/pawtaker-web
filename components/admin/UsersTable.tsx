'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Ban, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ConfirmationModal from './ConfirmationModal';
import LabeledSearch from './LabeledSearch';
import LabeledSelect from './LabeledSelect';
import UserAvatar from './UserAvatar';
import UserDetailsModal, { type UserDetailsData } from './UserDetailsModal';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/ToastProvider';
import { useAdminUsersQuery, useDeactivateAdminUserMutation, useDeleteAdminUserMutation } from '@/lib/queries/admin/users';
import type { AdminUserListRow } from '@/lib/queries/admin/users';

type User = UserDetailsData;

const KYC_STATUS_MAP: Record<AdminUserListRow['kyc_status'], User['kycStatus']> = {
  not_submitted: 'Pending',
  pending: 'Pending',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
};

function mapRowToUser(row: AdminUserListRow): User {
  const name = row.full_name ?? row.display_name ?? row.email;
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

  const joined = new Date(row.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    id: row.id,
    name,
    initials,
    email: row.email,
    avatarUrl: row.avatar_url ?? undefined,
    city: row.city ?? '',
    bio: row.bio ?? '',
    kycStatus: KYC_STATUS_MAP[row.kyc_status],
    isEmailVerified: row.is_email_verified,
    pointsBalance: row.points_balance,
    language: row.language,
    themePref: row.theme_pref,
    petsCount: row.pets_count,
    careGiven: row.care_given_count,
    careReceived: row.care_received_count,
    joined,
    status: row.is_deactivated ? 'Deactivated' : 'Active',
  };
}

const KYC_COLORS: Record<User['kycStatus'], string> = {
  Approved: 'bg-emerald-100 text-emerald-800',
  Submitted: 'bg-blue-100 text-blue-800',
  Pending: 'bg-amber-100 text-amber-800',
  Rejected: 'bg-red-100 text-red-700',
};

type SortKey =
  | 'none'
  | 'pets-desc'
  | 'pets-asc'
  | 'care-given-desc'
  | 'care-given-asc'
  | 'care-received-desc'
  | 'care-received-asc';

function UserRowActionsMenu({
  userId,
  userName,
  isDeactivated,
  onViewDetails,
  onDeactivate,
  onDelete,
}: {
  userId: string;
  userName: string;
  isDeactivated: boolean;
  onViewDetails: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations('admin.users');
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
        className="cursor-pointer rounded-full p-2 text-on-surface/50 transition-colors hover:bg-white hover:text-on-surface"
        aria-label={t('openActionsAriaLabel', { userName })}
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[188px] rounded-lg border border-outline/20 bg-white py-1 shadow-lg ring-1 ring-black/5">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onViewDetails(userId);
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container transition-colors"
          >
            <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t('viewDetails')}
          </button>
          <button
            type="button"
            disabled={isDeactivated}
            onClick={() => {
              if (isDeactivated) return;
              setOpen(false);
              onDeactivate(userId);
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Ban className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t('deactivateConfirmLabel')}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(userId);
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

export default function UsersTable() {
  const t = useTranslations('admin.users');
  const tModal = useTranslations('admin.modal');
  const { showToast } = useToast();
  const usersQuery = useAdminUsersQuery();
  const deactivateMutation = useDeactivateAdminUserMutation();
  const deleteMutation = useDeleteAdminUserMutation();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('none');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [detailsUserId, setDetailsUserId] = useState<string | null>(null);

  const users = useMemo<User[]>(() => {
    return (usersQuery.data ?? []).map((row) => mapRowToUser(row));
  }, [usersQuery.data]);

  const detailsUser = useMemo(
    () => (detailsUserId ? users.find((u) => u.id === detailsUserId) ?? null : null),
    [users, detailsUserId]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));

    if (sort === 'pets-desc') result = [...result].sort((a, b) => b.petsCount - a.petsCount);
    if (sort === 'pets-asc') result = [...result].sort((a, b) => a.petsCount - b.petsCount);
    if (sort === 'care-given-desc') result = [...result].sort((a, b) => b.careGiven - a.careGiven);
    if (sort === 'care-given-asc') result = [...result].sort((a, b) => a.careGiven - b.careGiven);
    if (sort === 'care-received-desc') result = [...result].sort((a, b) => b.careReceived - a.careReceived);
    if (sort === 'care-received-asc') result = [...result].sort((a, b) => a.careReceived - b.careReceived);

    return result;
  }, [users, search, sort]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      showToast(t('deleteConfirmLabel'), 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete user.', 'error');
    }
    setDeleteId(null);
  };

  const handleDeactivate = async () => {
    if (!deactivateId) return;
    try {
      await deactivateMutation.mutateAsync(deactivateId);
      showToast(t('deactivateConfirmLabel'), 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to deactivate user.', 'error');
    }
    setDeactivateId(null);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-md">
          <LabeledSearch
            id="users-search"
            label={t('searchLabel')}
            value={search}
            placeholder={t('searchPlaceholder')}
            onChange={setSearch}
          />
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
          <div className="w-full sm:w-fit">
            <LabeledSelect
              id="users-sort"
              label={t('sortLabel')}
              value={sort}
              onChange={(next) => setSort(next as SortKey)}
              options={[
                { value: 'none', label: t('sortDefault') },
                { value: 'pets-desc', label: t('sortPetsDesc') },
                { value: 'pets-asc', label: t('sortPetsAsc') },
                { value: 'care-given-desc', label: t('sortCareGivenDesc') },
                { value: 'care-given-asc', label: t('sortCareGivenAsc') },
                { value: 'care-received-desc', label: t('sortCareReceivedDesc') },
                { value: 'care-received-asc', label: t('sortCareReceivedAsc') },
              ]}
            />
          </div>
          <button className="whitespace-nowrap rounded-xl border border-outline/30 bg-white px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-white transition-colors">
            {t('exportList')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-outline/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-w-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-outline/10 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">{t('columns.user')}</th>
                <th className="px-6 py-4 hidden sm:table-cell">{t('columns.kyc')}</th>
                <th className="px-6 py-4">{t('columns.petsCount')}</th>
                <th className="px-6 py-4">{t('columns.careGiven')}</th>
                <th className="px-6 py-4">{t('columns.careReceived')}</th>
                <th className="px-6 py-4 hidden md:table-cell">{t('columns.status')}</th>
                <th className="px-6 py-4 hidden lg:table-cell">{t('columns.joined')}</th>
                <th className="px-6 py-4 text-center">{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {usersQuery.isLoading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 shrink-0 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-28" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-6" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-6" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-6" /></td>
                    <td className="px-6 py-4 hidden md:table-cell"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="px-6 py-4 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-8 rounded-full" /></td>
                  </tr>
                ))
              )}
              {usersQuery.isError && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    <p className="mb-3">
                      {usersQuery.error instanceof Error ? usersQuery.error.message : 'Failed to load users.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => usersQuery.refetch()}
                      className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              )}
              {!usersQuery.isLoading && !usersQuery.isError && filtered.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-white transition-colors ${user.status === 'Deactivated' ? 'opacity-60' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        imageUrl={user.avatarUrl}
                        initials={user.initials}
                        alt={user.name}
                        size={36}
                      />
                      <div>
                        <p className="font-semibold text-on-surface">{user.name}</p>
                        <p className="text-xs text-on-surface/60">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${KYC_COLORS[user.kycStatus]}`}>
                      {user.kycStatus === 'Approved'
                        ? t('kycStatusApproved')
                        : user.kycStatus === 'Submitted'
                          ? t('kycStatusSubmitted')
                          : user.kycStatus === 'Pending'
                            ? t('kycStatusPending')
                            : t('kycStatusRejected')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-on-surface">{user.petsCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-on-surface">{user.careGiven}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-on-surface">{user.careReceived}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {user.status === 'Active' ? t('statusActive') : t('statusDeactivated')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface/60 hidden lg:table-cell">{user.joined}</td>
                  <td className="px-6 py-4">
                    <UserRowActionsMenu
                      userId={user.id}
                      userName={user.name}
                      isDeactivated={user.status === 'Deactivated'}
                      onViewDetails={(id) => setDetailsUserId(id)}
                      onDeactivate={(id) => setDeactivateId(id)}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  </td>
                </tr>
              ))}
              {!usersQuery.isLoading && !usersQuery.isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    {t('emptyState')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-white border-t border-outline/10 flex items-center justify-between text-sm text-on-surface/70 rounded-b-xl">
          <div>{t('paginationShowing', { shown: filtered.length, total: users.length })}</div>
          <div className="flex gap-2">
            <button className="p-2 rounded border border-outline/30 bg-white text-on-surface/60 disabled:opacity-50" disabled>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button className="p-2 rounded border border-outline/30 bg-white text-on-surface/80">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
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

      {/* Deactivate confirmation */}
      <ConfirmationModal
        isOpen={!!deactivateId}
        title={t('deactivateConfirmTitle')}
        description={t('deactivateConfirmDesc')}
        confirmLabel={t('deactivateConfirmLabel')}
        cancelLabel={tModal('cancel')}
        tone="default"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateId(null)}
      />

      <UserDetailsModal
        isOpen={!!detailsUserId}
        user={detailsUser}
        onClose={() => setDetailsUserId(null)}
      />
    </>
  );
}
