'use client';

import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import KycImageModal from './KycImageModal';

export interface KycSubmission {
  id: string;
  userName: string;
  userEmail: string;
  userInitials: string;
  submittedAt: string;
  documentType: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  images: string[];
  rejectionReason?: string;
}

interface KycCardProps {
  submission: KycSubmission;
  onStatusChange: (id: string, status: 'Approved' | 'Rejected', reason?: string) => void;
}

const STATUS_STYLES: Record<KycSubmission['status'], string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Approved: 'bg-emerald-100 text-emerald-800',
  Rejected: 'bg-red-100 text-red-700',
  Completed: 'bg-blue-100 text-blue-800',
};

export default function KycCard({ submission, onStatusChange }: KycCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const { images } = submission;

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
      <div className="bg-surface-container-lowest rounded-2xl border border-outline/20 shadow-sm overflow-hidden flex flex-col">
        {/* Image strip */}
        <div
          className="relative bg-slate-100 aspect-video cursor-pointer overflow-hidden"
          onClick={() => setIsImageModalOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[currentImage]}
            alt="KYC document"
            className="w-full h-full object-cover"
          />

          {/* Left arrow */}
          {currentImage > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentImage((i) => i - 1); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ‹
            </button>
          )}

          {/* Right arrow */}
          {currentImage < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentImage((i) => i + 1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ›
            </button>
          )}

          {/* Expand hint */}
          <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
            🔍 Expand
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 py-2 bg-slate-50 border-b border-outline/10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`size-1.5 rounded-full transition-colors ${i === currentImage ? 'bg-primary' : 'bg-outline/40'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {submission.userInitials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-on-surface text-sm truncate">{submission.userName}</p>
                <p className="text-xs text-on-surface/60 truncate">{submission.userEmail}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_STYLES[submission.status]}`}>
              {submission.status}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-on-surface/70 flex-1">
            <div className="flex items-center gap-1.5">
              <span>📄</span>
              <span>{submission.documentType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>📅</span>
              <span>Submitted {submission.submittedAt}</span>
            </div>
            {submission.rejectionReason && (
              <div className="mt-2 p-2 bg-red-50 rounded-lg text-red-700">
                <span className="font-medium">Reason: </span>{submission.rejectionReason}
              </div>
            )}
          </div>

          {/* Actions */}
          {submission.status === 'Pending' && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setIsApproveOpen(true)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => setIsRejectOpen(true)}
                className="flex-1 py-2.5 rounded-xl bg-error/10 text-error text-sm font-semibold hover:bg-error/20 transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image modal */}
      {isImageModalOpen && (
        <KycImageModal
          images={images}
          initialIndex={currentImage}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}

      {/* Approve confirmation */}
      <ConfirmationModal
        isOpen={isApproveOpen}
        title={`Approve KYC for ${submission.userName}?`}
        description="This will verify the user's identity and grant full platform access."
        confirmLabel="Approve"
        cancelLabel="Cancel"
        tone="default"
        onConfirm={handleApproveConfirm}
        onCancel={() => setIsApproveOpen(false)}
      />

      {/* Reject confirmation with reason */}
      <ConfirmationModal
        isOpen={isRejectOpen}
        title={`Reject KYC for ${submission.userName}?`}
        description="Please provide a reason. The user will be notified."
        confirmLabel="Reject"
        cancelLabel="Cancel"
        tone="danger"
        confirmDisabled={rejectionReason.trim() === ''}
        onConfirm={handleRejectConfirm}
        onCancel={() => { setIsRejectOpen(false); setRejectionReason(''); }}
      >
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Rejection reason (required)"
          rows={3}
          className="w-full mt-3 p-3 border border-outline/30 rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none bg-background-base"
        />
      </ConfirmationModal>
    </>
  );
}
