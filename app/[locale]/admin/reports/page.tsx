'use client';

import { AlertTriangle, ArrowUpRight, ChevronLeft, ChevronRight, Clock3, MoreHorizontal, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import LabeledSearch from '@/components/admin/LabeledSearch';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import UserAvatar from '@/components/admin/UserAvatar';
import { useDeleteAdminReportMutation, useAdminReportsQuery } from '@/lib/queries/admin/reports';
import { useToast } from '@/components/ui/ToastProvider';
import Skeleton from '@/components/ui/Skeleton';

type Report = {
  id: string;
  reporter: string;
  reason: string;
  reporterImage?: string;
};

function ReportRowActionsMenu({
  reportId,
  onDelete,
  reporter,
}: {
  reportId: string;
  reporter: string;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations('admin.reports');
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
        aria-label={t('openActionsAriaLabel', { reporter })}
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
              onDelete(reportId);
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

export default function ReportsPage() {
  const t = useTranslations('admin.reports');
  const tModal = useTranslations('admin.modal');
  const { showToast } = useToast();
  const reportsQuery = useAdminReportsQuery();
  const deleteReportMutation = useDeleteAdminReportMutation();
  const [reporterQuery, setReporterQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const reports = useMemo(() => (reportsQuery.data ?? []) as Report[], [reportsQuery.data]);

  const filtered = useMemo(() => {
    const q = reporterQuery.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) => r.reporter.toLowerCase().includes(q));
  }, [reporterQuery, reports]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReportMutation.mutateAsync(deleteId);
      showToast(t('deleteConfirmLabel'), 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete report.', 'error');
    }
    setDeleteId(null);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <LabeledSearch
            id="reports-reporter-search"
            label={t('searchLabel')}
            value={reporterQuery}
            placeholder={t('searchPlaceholder')}
            onChange={setReporterQuery}
          />
        </div>

        <div className="bg-white rounded-xl border border-outline/20 shadow-sm overflow-visible">
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-on-surface/70 text-xs uppercase tracking-wider font-semibold border-b border-outline/15">
                <tr>
                  <th className="px-6 py-4">{t('table.reporter')}</th>
                  <th className="px-6 py-4">{t('table.reportedText')}</th>
                  <th className="px-6 py-4 text-right">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/15">
                {reportsQuery.isLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <Skeleton className="size-8 rounded-full" />
                          <div className="min-w-0 space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Skeleton className="ml-auto h-8 w-10 rounded-full" />
                      </td>
                    </tr>
                  ))}
                {reportsQuery.isError && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-on-surface/50">
                      <p className="mb-3">
                        {reportsQuery.error instanceof Error
                          ? reportsQuery.error.message
                          : 'Failed to load reports.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => reportsQuery.refetch()}
                        className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                )}
                {!reportsQuery.isLoading && !reportsQuery.isError && filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-white transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          imageUrl={r.reporterImage}
                          initials={r.reporter
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((s) => s[0]?.toUpperCase())
                            .join('')}
                          alt={r.reporter}
                          size={32}
                        />
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-on-surface">{r.reporter}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-on-surface/70 whitespace-pre-wrap wrap-break-word">
                        <span className="font-semibold text-on-surface/80">{t('reportLabel')}</span> {r.reason}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <ReportRowActionsMenu
                        reportId={r.id}
                        reporter={r.reporter}
                        onDelete={(id) => setDeleteId(id)}
                      />
                    </td>
                  </tr>
                ))}

                {!reportsQuery.isLoading && !reportsQuery.isError && filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-on-surface/50">
                      {t('emptyState')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-white border-t border-outline/20 flex items-center justify-between rounded-b-xl">
            <p className="text-xs text-on-surface/70 font-medium">
              {t('paginationShowing', { shown: filtered.length, total: reports.length })}
            </p>
            <div className="flex gap-2">
              <button className="p-1 rounded bg-white border border-outline/30 text-on-surface/40 disabled:opacity-50" disabled>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button className="p-1 rounded bg-white border border-outline/30 text-on-surface/60 hover:bg-white">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-on-surface/70 uppercase">
                {t('stats.weeklyResolutionRateTitle')}
              </span>
              <ArrowUpRight className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex items-end gap-2">
              <h2 className="text-2xl font-black text-on-surface">94.2%</h2>
              <span className="text-emerald-500 text-xs font-bold mb-1">+2.4%</span>
            </div>
            <p className="text-xs text-on-surface/60 mt-2">{t('stats.weeklyResolutionRateCaption')}</p>
          </div>
          <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-on-surface/70 uppercase">
                {t('stats.avgResponseTimeTitle')}
              </span>
              <Clock3 className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex items-end gap-2">
              <h2 className="text-2xl font-black text-on-surface">2.4 hrs</h2>
              <span className="text-emerald-500 text-xs font-bold mb-1">-15m</span>
            </div>
            <p className="text-xs text-on-surface/60 mt-2">{t('stats.avgResponseTimeCaption')}</p>
          </div>
          <div className="p-6 bg-red-100/60 rounded-xl border border-red-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-red-900 uppercase">
                {t('stats.criticalUnresolvedTitle')}
              </span>
              <AlertTriangle className="h-5 w-5 text-red-900" aria-hidden="true" />
            </div>
            <div className="flex items-end gap-2">
              <h2 className="text-2xl font-black text-red-900">03</h2>
            </div>
            <p className="text-xs text-red-900 mt-2 font-medium">{t('stats.criticalUnresolvedCaption')}</p>
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
    </div>
  );
}
