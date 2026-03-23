'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock, MoreHorizontal, Star, Tag, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ConfirmationModal from './ConfirmationModal';

function formatRelativeDate(
  dateStr: string,
  t: (key: string, values?: Record<string, string | number | Date>) => string
): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  const diffMs = Date.now() - d.getTime();
  if (diffMs < 0) return t('relativeJustNow');

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return t('relativeJustNow');
  if (diffMin < 60) return t('relativeMinutesAgo', { count: Math.max(1, diffMin) });
  if (diffHours < 24) return t('relativeHoursAgo', { count: diffHours });
  if (diffDays < 30) return t('relativeDaysAgo', { count: diffDays });
  if (diffDays < 365) return t('relativeMonthsAgo', { count: Math.floor(diffDays / 30) });
  return t('relativeYearsAgo', { count: Math.floor(diffDays / 365) });
}

export type ContactMessageSource = 'app' | 'website';

export type FeedbackSentiment = 'positive' | 'negative' | 'neutral';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  location: string;
  date: string;
  message: string;
  initials: string;
  imageUrl?: string;
  source: ContactMessageSource;
  /** Optional sentiment label (e.g. “Positive feedback”) */
  sentiment?: FeedbackSentiment;
  /** Read-only from API */
  resolved?: boolean;
}

interface ContactInquiryCardProps {
  inquiry: ContactInquiry;
  onDelete: (id: string) => void;
}

const sentimentDotClass: Record<FeedbackSentiment, string> = {
  positive: 'bg-emerald-500',
  negative: 'bg-rose-500',
  neutral: 'bg-slate-400',
};

export default function ContactInquiryCard({ inquiry, onDelete }: ContactInquiryCardProps) {
  const t = useTranslations('admin.contact');
  const tModal = useTranslations('admin.modal');
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  const handleDeleteConfirm = () => {
    onDelete(inquiry.id);
    setConfirmOpen(false);
    setMenuOpen(false);
  };

  const sentiment = inquiry.sentiment;
  const dotClass = sentiment ? sentimentDotClass[sentiment] : 'bg-slate-400';

  return (
    <>
      <article className="relative flex flex-col rounded-2xl border border-outline/25 bg-white p-5 shadow-sm">
        {/* Avatar | name + email | overflow menu — horizontal */}
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-container ring-1 ring-outline/15">
            {inquiry.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote user avatars; avoid remotePatterns sprawl
              <img
                src={inquiry.imageUrl}
                alt=""
                className="h-full w-full object-cover"
                width={48}
                height={48}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-on-surface/80">
                {inquiry.initials}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              {sentiment ? (
                <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} aria-hidden />
              ) : null}
              <h3 className="truncate text-base font-semibold leading-tight text-on-surface">{inquiry.name}</h3>
            </div>
            <p className="truncate text-sm leading-tight text-on-surface/65" title={inquiry.email}>
              {inquiry.email}
            </p>
          </div>
          <div className="relative shrink-0 self-start" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              className="cursor-pointer rounded-full p-1.5 text-on-surface/70 transition-colors hover:bg-surface-container hover:text-on-surface"
              aria-label={t('openActionsAriaLabel')}
              aria-expanded={menuOpen}
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 min-w-[160px] rounded-xl border border-outline/20 bg-white py-1 shadow-lg ring-1 ring-black/5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setConfirmOpen(true);
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm text-error hover:bg-error/5"
                >
                  <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t('deleteConfirmLabel')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sentiment / feedback line */}
        {sentiment && (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-on-surface">
            <Star className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            <span>{t(feedbackLabelKey(sentiment))}</span>
          </p>
        )}

        {/* Message */}
        <p className={`text-sm leading-relaxed text-on-surface/85 ${sentiment ? 'mt-3' : 'mt-4'}`}>
          {inquiry.message}
        </p>

        {/* Source + time */}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-on-surface/55">
          <span className="inline-flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 shrink-0 text-on-surface/45" aria-hidden />
            <span className="font-medium uppercase tracking-wide text-on-surface/70">
              {inquiry.source === 'app' ? t('sourceApp') : t('sourceWebsite')}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-on-surface/45" aria-hidden />
            {formatRelativeDate(inquiry.date, t)}
          </span>
          {inquiry.resolved ? (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
              {t('resolvedBadge')}
            </span>
          ) : null}
        </div>
      </article>

      <ConfirmationModal
        isOpen={confirmOpen}
        title={t('deleteConfirmTitle')}
        description={t('deleteConfirmDesc')}
        confirmLabel={t('deleteConfirmLabel')}
        cancelLabel={tModal('cancel')}
        tone="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

function feedbackLabelKey(sentiment: FeedbackSentiment): string {
  switch (sentiment) {
    case 'positive':
      return 'feedbackPositive';
    case 'negative':
      return 'feedbackNegative';
    default:
      return 'feedbackNeutral';
  }
}
