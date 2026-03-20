'use client';

import { useTranslations } from 'next-intl';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const t = useTranslations('admin.profile');
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/55 backdrop-blur-[1px] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] rounded-xl bg-white p-6 shadow-2xl ring-1 ring-outline/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center gap-4">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">{t('title')}</h2>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="size-14 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-primary ring-2 ring-primary/10">
            <span className="flex size-full items-center justify-center text-lg font-bold text-on-primary">
              AA
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">{t('name')}</p>
            <p className="text-xs text-on-surface/70">{t('email')}</p>
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              {t('role')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
