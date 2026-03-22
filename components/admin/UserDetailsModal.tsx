'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import UserAvatar from './UserAvatar';

/** Fields aligned with `public.users` in docs/mobileauthflow.md + admin table metrics */
export interface UserDetailsData {
  id: string;
  name: string;
  initials: string;
  email: string;
  avatarUrl?: string;
  city: string;
  bio: string;
  kycStatus: 'Approved' | 'Submitted' | 'Pending' | 'Rejected';
  isEmailVerified: boolean;
  pointsBalance: number;
  language: 'en' | 'fr';
  themePref: 'system' | 'light' | 'dark';
  petsCount: number;
  careGiven: number;
  careReceived: number;
  joined: string;
  status: 'Active' | 'Deactivated';
}

interface UserDetailsModalProps {
  isOpen: boolean;
  user: UserDetailsData | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-outline/10 py-3 last:border-b-0 sm:grid-cols-3 sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-on-surface/55">{label}</dt>
      <dd className="text-sm text-on-surface sm:col-span-2">{value}</dd>
    </div>
  );
}

export default function UserDetailsModal({ isOpen, user, onClose }: UserDetailsModalProps) {
  const t = useTranslations('admin.users');

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const kycPill =
    user.kycStatus === 'Approved'
      ? 'bg-emerald-100 text-emerald-800'
      : user.kycStatus === 'Submitted'
        ? 'bg-blue-100 text-blue-800'
        : user.kycStatus === 'Pending'
          ? 'bg-amber-100 text-amber-800'
          : 'bg-red-100 text-red-700';

  const kycLabel =
    user.kycStatus === 'Approved'
      ? t('kycStatusApproved')
      : user.kycStatus === 'Submitted'
        ? t('kycStatusSubmitted')
        : user.kycStatus === 'Pending'
          ? t('kycStatusPending')
          : t('kycStatusRejected');

  const statusPill =
    user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600';

  const langLabel = user.language === 'en' ? t('detailsLangEn') : t('detailsLangFr');
  const themeLabel =
    user.themePref === 'system'
      ? t('detailsThemeSystem')
      : user.themePref === 'light'
        ? t('detailsThemeLight')
        : t('detailsThemeDark');

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/55 px-4 py-8 backdrop-blur-[1px] sm:py-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-details-title"
    >
      <div
        className="flex max-h-[min(92vh,680px)] w-full max-w-[520px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-outline/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-outline/15 p-6">
          <h2 id="user-details-title" className="text-xl font-bold tracking-tight text-on-surface">
            {t('detailsModalTitle')}
          </h2>
          <p className="mt-1 text-sm text-on-surface/70">{t('detailsModalSubtitle')}</p>

          <div className="mt-5 flex items-start gap-4">
            <UserAvatar
              imageUrl={user.avatarUrl}
              initials={user.initials}
              alt={user.name}
              size={56}
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-on-surface">{user.name}</p>
              <p className="truncate text-sm text-on-surface/65">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-2">
          <h3 className="mb-2 pt-2 text-[11px] font-bold uppercase tracking-wider text-on-surface/50">
            {t('detailsSectionProfile')}
          </h3>
          <dl>
            <DetailRow label={t('detailsFieldId')} value={<span className="font-mono text-xs">{user.id}</span>} />
            <DetailRow label={t('detailsFieldEmail')} value={user.email} />
            <DetailRow label={t('detailsFieldFullName')} value={user.name} />
            <DetailRow label={t('detailsFieldCity')} value={user.city || '—'} />
            <DetailRow
              label={t('detailsFieldBio')}
              value={
                <span className="whitespace-pre-wrap">
                  {user.bio && user.bio.trim() ? user.bio : '—'}
                </span>
              }
            />
            <DetailRow
              label={t('detailsFieldKycStatus')}
              value={
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${kycPill}`}>
                  {kycLabel}
                </span>
              }
            />
            <DetailRow
              label={t('detailsFieldEmailVerified')}
              value={user.isEmailVerified ? t('detailsYes') : t('detailsNo')}
            />
            <DetailRow label={t('detailsFieldPoints')} value={user.pointsBalance.toLocaleString()} />
            <DetailRow label={t('detailsFieldLanguage')} value={langLabel} />
            <DetailRow label={t('detailsFieldTheme')} value={themeLabel} />
          </dl>

          <h3 className="mb-2 mt-6 border-t border-outline/10 pt-4 text-[11px] font-bold uppercase tracking-wider text-on-surface/50">
            {t('detailsSectionActivity')}
          </h3>
          <dl>
            <DetailRow label={t('columns.petsCount')} value={user.petsCount} />
            <DetailRow label={t('columns.careGiven')} value={user.careGiven} />
            <DetailRow label={t('columns.careReceived')} value={user.careReceived} />
            <DetailRow
              label={t('columns.status')}
              value={
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusPill}`}>
                  {user.status === 'Active' ? t('statusActive') : t('statusDeactivated')}
                </span>
              }
            />
            <DetailRow label={t('columns.joined')} value={user.joined} />
          </dl>
        </div>

        <div className="flex shrink-0 justify-end border-t border-outline/15 bg-white px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-26 cursor-pointer rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary/90"
          >
            {t('detailsClose')}
          </button>
        </div>
      </div>
    </div>
  );
}
