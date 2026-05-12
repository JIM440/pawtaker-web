'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Star, Trash2 } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import UserAvatar from './UserAvatar';
import { useToast } from '@/components/ui/ToastProvider';
import { useAdminReviewsQuery, useDeleteAdminReviewMutation } from '@/lib/queries/admin/reviews';
import Skeleton from '@/components/ui/Skeleton';

interface Review {
  id: string;
  stars: 1 | 2 | 3 | 4 | 5;
  reviewerName: string;
  reviewerEmail: string;
  reviewerImage?: string;
  revieweeName: string;
  revieweeEmail: string;
  revieweeImage?: string;
  body: string;
  date: string;
}

type RatingFilter = 'all' | '1' | '2' | '3' | '4' | '5';
const REVIEW_EXCERPT_LIMIT = 50;

function truncateReviewBody(text: string, limit = REVIEW_EXCERPT_LIMIT) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? 'fill-primary text-primary' : 'fill-none text-outline/35'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function RowActionsMenu({
  reviewId,
  onDelete,
}: {
  reviewId: string;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations('admin.reviews');
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
    <div className="relative inline-flex justify-center" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded-full p-2 text-on-surface/50 transition-colors hover:bg-white hover:text-on-surface"
        aria-label={t('openActionsAriaLabel')}
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-outline/20 bg-white py-1 shadow-lg ring-1 ring-black/5">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(reviewId);
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

export default function ReviewsTable() {
  const t = useTranslations('admin.reviews');
  const tModal = useTranslations('admin.modal');
  const { showToast } = useToast();
  const reviewsQuery = useAdminReviewsQuery();
  const deleteReviewMutation = useDeleteAdminReviewMutation();
  const reviews = useMemo(() => (reviewsQuery.data ?? []) as Review[], [reviewsQuery.data]);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedReviewIds, setExpandedReviewIds] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((r) => {
      if (ratingFilter !== 'all' && r.stars !== Number(ratingFilter)) return false;
      if (!q) return true;
      const hay = [
        r.reviewerName,
        r.reviewerEmail,
        r.revieweeName,
        r.revieweeEmail,
        r.body,
        r.date,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [reviews, search, ratingFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReviewMutation.mutateAsync(deleteId);
      showToast(t('deleteConfirmLabel'), 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete review.', 'error');
    }
    setDeleteId(null);
  };

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviewIds((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  return (
    <>
      <p className="mb-6 max-w-2xl text-sm text-on-surface/70">{t('subtitle')}</p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <label htmlFor="reviews-search" className="sr-only">
            {t('searchLabel')}
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/40"
            aria-hidden="true"
          />
          <input
            id="reviews-search"
            type="search"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full cursor-text rounded-full border border-outline/30 bg-white py-2 pl-9 pr-4 text-sm text-on-surface placeholder:text-on-surface/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex w-full flex-col gap-1 sm:w-auto sm:min-w-[160px]">
          <label
            htmlFor="reviews-rating-filter"
            className="text-[11px] font-bold uppercase tracking-wide text-on-surface/50"
          >
            {t('ratingFilterLabel')}
          </label>
          <select
            id="reviews-rating-filter"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
            className="w-full cursor-pointer appearance-none rounded-full border border-outline/30 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25 sm:w-[180px]"
          >
            <option value="all">{t('filterAllRatings')}</option>
            <option value="5">{t('filterStars5')}</option>
            <option value="4">{t('filterStars4')}</option>
            <option value="3">{t('filterStars3')}</option>
            <option value="2">{t('filterStars2')}</option>
            <option value="1">{t('filterStars1')}</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-outline/20 bg-white shadow-sm">
        <div className="overflow-x-auto min-w-0 rounded-xl">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[14%]" />
              <col className="w-[22%]" />
              <col className="w-[22%]" />
              <col className="w-[30%]" />
              <col className="w-[8%]" />
              <col className="w-[4%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-outline/10 bg-white text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">{t('columns.stars')}</th>
                <th className="px-6 py-4">{t('columns.reviewer')}</th>
                <th className="px-6 py-4">{t('columns.reviewee')}</th>
                <th className="px-6 py-4">{t('columns.excerpt')}</th>
                <th className="hidden px-6 py-4 sm:table-cell">{t('columns.date')}</th>
                <th className="px-6 py-4 text-center">{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {reviewsQuery.isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="align-top px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="align-top px-6 py-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="align-top px-6 py-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-11/12" />
                        <Skeleton className="h-3 w-9/12" />
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 sm:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                    </td>
                  </tr>
                ))}
              {reviewsQuery.isError && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    <p className="mb-3">
                      {reviewsQuery.error instanceof Error
                        ? reviewsQuery.error.message
                        : 'Failed to load reviews.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => reviewsQuery.refetch()}
                      className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              )}
              {!reviewsQuery.isLoading && !reviewsQuery.isError && filtered.map((review) => (
                <tr key={review.id} className="transition-colors hover:bg-white">
                  <td className="align-top px-6 py-4">
                    <Stars count={review.stars} />
                  </td>
                  <td className="align-top px-6 py-4">
                    <div className="flex items-start gap-3">
                      <UserAvatar
                        imageUrl={review.reviewerImage}
                        initials={review.reviewerName
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((s) => s[0]?.toUpperCase())
                          .join('')}
                        alt={review.reviewerName}
                        size={32}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-on-surface">{review.reviewerName}</p>
                        <p className="text-xs text-on-surface/60">{review.reviewerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="align-top px-6 py-4">
                    <div className="flex items-start gap-3">
                      <UserAvatar
                        imageUrl={review.revieweeImage}
                        initials={review.revieweeName
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((s) => s[0]?.toUpperCase())
                          .join('')}
                        alt={review.revieweeName}
                        size={32}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-on-surface">{review.revieweeName}</p>
                        <p className="text-xs text-on-surface/60">{review.revieweeEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <p className="wrap-break-word text-on-surface/80">
                      {expandedReviewIds[review.id]
                        ? review.body
                        : truncateReviewBody(review.body)}
                    </p>
                    {review.body.length > REVIEW_EXCERPT_LIMIT && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(review.id)}
                        className="mt-1 text-xs font-semibold text-primary hover:underline"
                      >
                        {expandedReviewIds[review.id] ? t('seeLess') : t('seeMore')}
                      </button>
                    )}
                  </td>
                  <td className="hidden whitespace-nowrap px-6 py-4 align-top text-on-surface/60 sm:table-cell">
                    {review.date}
                  </td>
                  <td className="px-6 py-4 text-center align-top">
                    <RowActionsMenu reviewId={review.id} onDelete={(id) => setDeleteId(id)} />
                  </td>
                </tr>
              ))}
              {!reviewsQuery.isLoading && !reviewsQuery.isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    {t('emptyState')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-outline/10 bg-white px-6 py-4 text-sm text-on-surface/70">
          <div>
            {t('paginationShowing', { shown: filtered.length, total: reviews.length })}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="cursor-pointer rounded border border-outline/30 bg-white p-2 text-on-surface/60 disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="cursor-pointer rounded border border-outline/30 bg-white p-2 text-on-surface/80"
            >
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
    </>
  );
}
