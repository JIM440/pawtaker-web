'use client';

import { useEffect, useId } from 'react';
import { useTranslations } from 'next-intl';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  variant?: 'confirmation' | 'feedback';
  onClose?: () => void;
  status?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  showCancel?: boolean;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  variant = 'confirmation',
  onClose,
  status = 'default',
  confirmLabel,
  cancelLabel,
  tone = 'default',
  showCancel = true,
  confirmDisabled = false,
  onConfirm,
  onCancel,
  children,
}: ConfirmationModalProps) {
  const tModal = useTranslations('admin.modal');
  const titleId = useId();

  const resolvedConfirmLabel =
    confirmLabel ?? (variant === 'feedback' ? tModal('gotIt') : tModal('confirm'));
  const resolvedCancelLabel = cancelLabel ?? tModal('cancel');

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const confirmToneClass =
    tone === 'danger'
      ? 'bg-error text-white hover:bg-error/90'
      : 'bg-primary text-on-primary hover:bg-primary/90';
  const feedbackToneClass = {
    default: 'bg-primary text-on-primary hover:bg-primary/90',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    danger: 'bg-error text-white hover:bg-error/90',
    warning: 'bg-amber-500 text-white hover:bg-amber-600',
    info: 'bg-secondary text-white hover:bg-secondary/90',
  }[status];

  const handleClose = onClose ?? onCancel;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[1px]"
        aria-label={tModal('backdropClose')}
        onClick={handleClose}
      />
      <div
        className="relative z-10 w-full max-w-[520px] rounded-xl bg-white p-6 shadow-2xl ring-1 ring-outline/20"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="mb-2 text-xl font-bold tracking-tight text-on-surface">
          {title}
        </h2>
        <p className="mb-4 text-sm text-on-surface/75">{description}</p>
        {children}
        <div className="mt-6 flex items-center justify-end gap-2">
          {variant === 'confirmation' && showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="min-w-24 cursor-pointer rounded-full border border-outline/40 px-4 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            >
              {resolvedCancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={`${
              variant === 'confirmation' && showCancel ? 'min-w-24' : 'w-full'
            } cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              variant === 'feedback' ? feedbackToneClass : confirmToneClass
            }`}
          >
            {resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
