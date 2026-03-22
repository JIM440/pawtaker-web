'use client';

import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ConfirmationModal from './ConfirmationModal';
import UserAvatar from './UserAvatar';

function formatRelativeDate(
  dateStr: string,
  // Match `next-intl` translator typing: interpolation values are string/number/Date.
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

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  location: string;
  /** ISO date string or parseable date for relative time */
  date: string;
  message: string;
  initials: string;
  imageUrl?: string;
  /** Where the message was sent from */
  source: ContactMessageSource;
}

interface ContactInquiryCardProps {
  inquiry: ContactInquiry;
  onDelete: (id: string) => void;
}

export default function ContactInquiryCard({ inquiry, onDelete }: ContactInquiryCardProps) {
  const t = useTranslations('admin.contact');
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

  return (
    <>
      <article className="relative flex flex-col rounded-xl border border-outline/20 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <UserAvatar
              imageUrl={inquiry.imageUrl}
              initials={inquiry.initials}
              alt={inquiry.name}
              size={40}
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-on-surface">{inquiry.name}</p>
              <p className="mt-0.5 truncate text-xs text-on-surface/60" title={inquiry.email}>
                {inquiry.email}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                    inquiry.source === 'app'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {inquiry.source === 'app' ? t('sourceApp') : t('sourceWebsite')}
                </span>
                <span className="text-xs text-on-surface/55">
                  {formatRelativeDate(inquiry.date, t)}
                </span>
              </div>
            </div>
          </div>
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              className="cursor-pointer rounded-full p-1.5 text-black transition-colors hover:bg-transparent hover:text-black"
              aria-label={t('openActionsAriaLabel')}
              aria-expanded={menuOpen}
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-outline/20 bg-white py-1 shadow-lg ring-1 ring-black/5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setConfirmOpen(true);
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-error hover:bg-error/5"
                >
                  <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t('deleteConfirmLabel')}
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm leading-relaxed text-on-surface/80">{inquiry.message}</p>
      </article>

      <ConfirmationModal
        isOpen={confirmOpen}
        title={t('deleteConfirmTitle')}
        description={t('deleteConfirmDesc')}
        confirmLabel={t('deleteConfirmLabel')}
        tone="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
