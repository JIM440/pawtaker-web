'use client';

import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ConfirmationModal from './ConfirmationModal';
import KycImageModal from './KycImageModal';
import UserAvatar from './UserAvatar';

export interface KycSubmission {
  id: string;
  userName: string;
  userEmail: string;
  userInitials: string;
  userImage?: string;
  submittedAt: string;
  documentType: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  images: string[];
  rejectionReason?: string;
}

interface KycCardProps {
  submission: KycSubmission;
  onStatusChange: (id: string, status: 'Approved' | 'Rejected', reason?: string) => void;
}

const BADGE_APPROVED = 'bg-emerald-100 text-emerald-800 border border-emerald-200/80';
const BADGE_PENDING = 'bg-amber-100/90 text-amber-900 border border-amber-200/80';
const BADGE_REJECTED = 'bg-error-container text-error border border-error/20';

function normalizeKycImages(images: string[]): string[] {
  // Requirement: always show exactly 3 images (and thus 3 dots) in the KYC card/modal.
  if (!images?.length) return ['', '', ''];

  const base = images.slice(0, 3);
  while (base.length < 3) base.push(base[base.length - 1]);
  return base;
}

function badgeForStatus(
  status: KycSubmission['status'],
  // Match `next-intl` translator typing: interpolation values are string/number/Date.
  t: (key: string, values?: Record<string, string | number | Date>) => string
) {
  if (status === 'Approved') return { label: t('approved'), className: BADGE_APPROVED };
  if (status === 'Rejected') return { label: t('rejected'), className: BADGE_REJECTED };
  return { label: t('pending'), className: BADGE_PENDING };
}

export default function KycCard({ submission, onStatusChange }: KycCardProps) {
  const t = useTranslations('admin.kyc');
  const tModal = useTranslations('admin.modal');
  const [currentImage, setCurrentImage] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const images = normalizeKycImages(submission.images);
  const badge = badgeForStatus(submission.status, t);

  const handleApproveConfirm = () => {
    onStatusChange(submission.id, 'Approved');
    setIsApproveOpen(false);
  };

  const handleRejectConfirm = () => {
    onStatusChange(submission.id, 'Rejected', rejectionReason);
    setIsRejectOpen(false);
    setRejectionReason('');
  };

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-2xl border border-outline/20 bg-white shadow-sm">
        <div
          className="relative aspect-video cursor-pointer overflow-hidden bg-slate-100"
          onClick={() => setIsImageModalOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[currentImage]}
            alt={t('documentAlt')}
            className="h-full w-full object-cover"
          />
          {currentImage > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImage((i) => i - 1);
              }}
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {currentImage < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImage((i) => i + 1);
              }}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <div className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-white/40 px-2 py-0.5 text-xs text-white">
            <Expand className="h-3 w-3" aria-hidden="true" />
            {t('expand')}
          </div>

          {/* Image pagination dots (on top of image) */}
          <div className="absolute left-0 right-0 bottom-3 z-20 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  // Ensure dot click doesn't trigger the image modal
                  e.stopPropagation();
                  setCurrentImage(i);
                }}
                className={`size-1.5 cursor-pointer rounded-full transition-colors ${
                  i === currentImage ? 'bg-primary' : 'bg-white/75 hover:bg-white/90'
                }`}
                aria-label={t('showImageAriaLabel', { index: i + 1 })}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar
                imageUrl={submission.userImage}
                initials={submission.userInitials}
                alt={submission.userName}
                size={36}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-on-surface">{submission.userName}</p>
                <p className="truncate text-xs text-on-surface/60">{submission.userEmail}</p>
              </div>
            </div>
            <span
              className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>

          <div className="flex-1 space-y-1.5 text-xs text-on-surface/70">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden="true" />
              <span>
                {t('submitted')} {submission.submittedAt}
              </span>
            </div>
            {submission.rejectionReason && (
              <div className="mt-2 rounded-lg border border-error/15 bg-error-container/80 p-2 text-xs text-error">
                <span className="font-medium">{t('rejectionReasonLabel')}: </span>
                {submission.rejectionReason}
              </div>
            )}
          </div>

          {submission.status === 'Pending' && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setIsApproveOpen(true)}
                className="flex-1 cursor-pointer rounded-full bg-primary py-2.5 text-sm font-semibold text-on-primary shadow-sm shadow-primary/15 transition-colors hover:bg-primary/90"
              >
                {t('approve')}
              </button>
              <button
                type="button"
                onClick={() => setIsRejectOpen(true)}
                className="flex-1 cursor-pointer rounded-full border border-error/25 bg-error/12 py-2.5 text-sm font-semibold text-error transition-colors hover:bg-error/18"
              >
                {t('reject')}
              </button>
            </div>
          )}
        </div>
      </div>

      {isImageModalOpen && (
        <KycImageModal
          images={images}
          initialIndex={currentImage}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}

      <ConfirmationModal
        isOpen={isApproveOpen}
        title={t('approveConfirmTitle')}
        description={t('approveConfirmDesc')}
        confirmLabel={t('approveConfirmLabel')}
        cancelLabel={tModal('cancel')}
        tone="default"
        onConfirm={handleApproveConfirm}
        onCancel={() => setIsApproveOpen(false)}
      />

      <ConfirmationModal
        isOpen={isRejectOpen}
        title={t('rejectConfirmTitle')}
        description={t('rejectConfirmDesc')}
        confirmLabel={t('rejectConfirmLabel')}
        cancelLabel={tModal('cancel')}
        tone="danger"
        confirmDisabled={rejectionReason.trim() === ''}
        onConfirm={handleRejectConfirm}
        onCancel={() => {
          setIsRejectOpen(false);
          setRejectionReason('');
        }}
      >
        <div className="mt-1 text-xs text-on-surface/60">
          {t('rejectionMessagePreviewNote')}
        </div>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder={t('rejectionReasonPlaceholder')}
          rows={3}
          className="mt-3 w-full resize-none rounded-xl border border-outline/30 bg-background-base p-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
      </ConfirmationModal>
    </>
  );
}
