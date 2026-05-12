'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import UserAvatar from '@/components/admin/UserAvatar';
import LabeledSearch from '@/components/admin/LabeledSearch';
import Skeleton from '@/components/ui/Skeleton';
import { useAdminBlocksQuery, type AdminBlockRow } from '@/lib/queries/admin/blocks';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase())
    .join('');
}

function formatDate(value: string, locale: 'en' | 'fr') {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default function AdminBlocksPage() {
  const t = useTranslations('admin.blocks');
  const locale = useLocale() === 'fr' ? 'fr' : 'en';
  const blocksQuery = useAdminBlocksQuery();
  const [search, setSearch] = useState('');

  const blocks = useMemo(() => blocksQuery.data ?? [], [blocksQuery.data]);

  const filteredBlocks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blocks.filter((row) => {
      const haystack = [
        row.blockerName,
        row.blockerEmail,
        row.blockedName,
        row.blockedEmail,
        row.blockerCity,
        row.blockedCity,
        row.reason ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return !q || haystack.includes(q);
    });
  }, [blocks, search]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 w-full sm:max-w-md">
        <LabeledSearch
          id="blocks-search"
          label={t('searchLabel')}
          value={search}
          placeholder={t('searchPlaceholder')}
          onChange={setSearch}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-outline/20 bg-white shadow-sm">
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline/10 bg-white text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">{t('table.blocker')}</th>
                <th className="px-6 py-4">{t('table.blocked')}</th>
                <th className="hidden px-6 py-4 md:table-cell">{t('table.reason')}</th>
                <th className="hidden px-6 py-4 lg:table-cell">{t('table.createdAt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {blocksQuery.isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 md:table-cell"><Skeleton className="h-4 w-40" /></td>
                    <td className="hidden px-6 py-4 lg:table-cell"><Skeleton className="h-4 w-24" /></td>
                  </tr>
                ))}

              {blocksQuery.isError && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    {blocksQuery.error instanceof Error
                      ? blocksQuery.error.message
                      : 'Failed to load user blocks.'}
                  </td>
                </tr>
              )}

              {!blocksQuery.isLoading &&
                !blocksQuery.isError &&
                filteredBlocks.map((row: AdminBlockRow) => (
                  <tr key={row.id} className="transition-colors hover:bg-white">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          imageUrl={row.blockerAvatarUrl ?? undefined}
                          initials={getInitials(row.blockerName)}
                          alt={row.blockerName}
                          size={36}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-on-surface">{row.blockerName}</div>
                          <div className="text-xs text-on-surface/60">{row.blockerEmail}</div>
                          {row.blockerCity ? (
                            <div className="mt-1 text-xs text-on-surface/50">{row.blockerCity}</div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          imageUrl={row.blockedAvatarUrl ?? undefined}
                          initials={getInitials(row.blockedName)}
                          alt={row.blockedName}
                          size={36}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-on-surface">{row.blockedName}</div>
                          <div className="text-xs text-on-surface/60">{row.blockedEmail}</div>
                          {row.blockedCity ? (
                            <div className="mt-1 text-xs text-on-surface/50">{row.blockedCity}</div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 align-top md:table-cell">
                      <span className="text-sm text-on-surface/70">
                        {row.reason ?? t('reasonUnavailable')}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 align-top text-on-surface/60 lg:table-cell">
                      {formatDate(row.createdAt, locale)}
                    </td>
                  </tr>
                ))}

              {!blocksQuery.isLoading && !blocksQuery.isError && filteredBlocks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    {t('emptyState')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between rounded-b-xl border-t border-outline/10 bg-white px-6 py-4 text-sm text-on-surface/70">
          <div>{t('paginationShowing', { shown: filteredBlocks.length, total: blocks.length })}</div>
          <div className="flex gap-2">
            <button className="rounded border border-outline/30 bg-white p-2 text-on-surface/60 disabled:opacity-50" disabled>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button className="rounded border border-outline/30 bg-white p-2 text-on-surface/80">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
