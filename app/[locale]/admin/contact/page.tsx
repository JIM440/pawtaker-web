'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import ContactInquiryCard, {
  type ContactInquiry,
  type ContactMessageSource,
} from '@/components/admin/ContactInquiryCard';
import { useToast } from '@/components/ui/ToastProvider';
import { useAdminContactQuery, useDeleteAdminContactMutation } from '@/lib/queries/admin/contact';
import Skeleton from '@/components/ui/Skeleton';

type SourceFilter = 'all' | ContactMessageSource;

export default function ContactPage() {
  const t = useTranslations('admin.contact');
  const { showToast } = useToast();
  const inquiriesQuery = useAdminContactQuery();
  const deleteInquiryMutation = useDeleteAdminContactMutation();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const inquiries = useMemo(() => (inquiriesQuery.data ?? []) as ContactInquiry[], [inquiriesQuery.data]);

  const displayInquiries = useMemo(() => {
    const list =
      sourceFilter === 'all' ? [...inquiries] : inquiries.filter((q) => q.source === sourceFilter);
    list.sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    });
    return list;
  }, [inquiries, sourceFilter, sortOrder]);

  const handleDelete = async (id: string) => {
    try {
      await deleteInquiryMutation.mutateAsync(id);
      showToast(t('deleteConfirmLabel'), 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete inquiry.', 'error');
    }
  };

  return (
    <div className="p-6 md:p-8">
      {inquiries.length > 0 ? (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2 sm:min-w-[200px]">
            <label htmlFor="contact-filter" className="text-xs font-semibold uppercase tracking-wide text-on-surface/55">
              {t('filterLabel')}
            </label>
            <select
              id="contact-filter"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
              className="cursor-pointer rounded-xl border border-outline/30 bg-white px-4 py-2.5 text-sm font-medium text-on-surface shadow-sm outline-none ring-primary/20 focus-visible:ring-2"
            >
              <option value="all">{t('filterAll')}</option>
              <option value="website">{t('filterWeb')}</option>
              <option value="app">{t('filterMobile')}</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 sm:min-w-[200px]">
            <label htmlFor="contact-sort" className="text-xs font-semibold uppercase tracking-wide text-on-surface/55">
              {t('sortLabel')}
            </label>
            <select
              id="contact-sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="cursor-pointer rounded-xl border border-outline/30 bg-white px-4 py-2.5 text-sm font-medium text-on-surface shadow-sm outline-none ring-primary/20 focus-visible:ring-2"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="oldest">{t('sortOldest')}</option>
            </select>
          </div>
        </div>
      ) : null}

      {inquiriesQuery.isLoading ? (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-dashed border-outline/30 bg-surface-container-lowest/60 px-5 py-6"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-9/12" />
              </div>
            </div>
          ))}
        </div>
      ) : inquiriesQuery.isError ? (
        <div className="mb-10 rounded-2xl border border-dashed border-outline/30 bg-surface-container-lowest/80 px-6 py-16 text-center text-sm text-on-surface/55">
          <p className="mb-3">
            {inquiriesQuery.error instanceof Error
              ? inquiriesQuery.error.message
              : 'Failed to load contact inquiries.'}
          </p>
          <button
            type="button"
            onClick={() => inquiriesQuery.refetch()}
            className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="mb-10 rounded-2xl border border-dashed border-outline/30 bg-surface-container-lowest/80 px-6 py-16 text-center text-sm text-on-surface/55">
          {t('emptyState')}
        </div>
      ) : displayInquiries.length === 0 ? (
        <div className="mb-10 rounded-2xl border border-dashed border-outline/30 bg-surface-container-lowest/80 px-6 py-16 text-center text-sm text-on-surface/55">
          {t('emptyFiltered')}
        </div>
      ) : (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayInquiries.map((inquiry) => (
            <ContactInquiryCard key={inquiry.id} inquiry={inquiry} onDelete={handleDelete} />
          ))}
        </div>
      )}
     </div>
  );
}
