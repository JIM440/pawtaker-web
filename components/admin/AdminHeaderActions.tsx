'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import TopbarLangToggle from './TopbarLangToggle';

type AdminNotificationKey =
  | 'kycPending'
  | 'reportNew'
  | 'contactWeb'
  | 'reviewFlagged'
  | 'requestCompleted'
  | 'userRegistered'
  | 'contactApp';

type AdminNotification = {
  id: string;
  title: string;
  preview: string;
  age: string;
  avatarUrl: string;
  unread: boolean;
};

const NOTIFICATION_ORDER: { id: string; i18nKey: AdminNotificationKey; unread: boolean; avatarUrl: string }[] = [
  {
    id: 'n1',
    i18nKey: 'kycPending',
    unread: true,
    avatarUrl: 'https://picsum.photos/seed/admin-noti-kyc/64',
  },
  {
    id: 'n2',
    i18nKey: 'reportNew',
    unread: true,
    avatarUrl: 'https://picsum.photos/seed/admin-noti-report/64',
  },
  {
    id: 'n3',
    i18nKey: 'contactWeb',
    unread: false,
    avatarUrl: 'https://picsum.photos/seed/admin-noti-contact/64',
  },
  {
    id: 'n4',
    i18nKey: 'reviewFlagged',
    unread: false,
    avatarUrl: 'https://picsum.photos/seed/admin-noti-review/64',
  },
  {
    id: 'n5',
    i18nKey: 'requestCompleted',
    unread: false,
    avatarUrl: 'https://picsum.photos/seed/admin-noti-request/64',
  },
  {
    id: 'n6',
    i18nKey: 'userRegistered',
    unread: false,
    avatarUrl: 'https://picsum.photos/seed/admin-noti-user/64',
  },
  {
    id: 'n7',
    i18nKey: 'contactApp',
    unread: false,
    avatarUrl: 'https://picsum.photos/seed/admin-noti-app/64',
  },
];

export default function AdminHeaderActions() {
  const t = useTranslations('admin.notifications');
  const [open, setOpen] = useState(false);
  const [markAllRead, setMarkAllRead] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const notifications: AdminNotification[] = useMemo(
    () =>
      NOTIFICATION_ORDER.map((row) => ({
        id: row.id,
        title: t(`${row.i18nKey}.title`),
        preview: t(`${row.i18nKey}.preview`),
        age: t(`${row.i18nKey}.age`),
        avatarUrl: row.avatarUrl,
        unread: markAllRead ? false : row.unread,
      })),
    [t, markAllRead]
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  return (
    <div className="flex items-center gap-3">
      <TopbarLangToggle />

      <div ref={rootRef} className="relative">
        <button
          type="button"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-outline/30 bg-surface-container-low text-on-surface/70 transition-colors hover:bg-surface-container"
          aria-label={t('title')}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
        </button>

        {open && (
          <div className="absolute right-0 top-12 z-50 w-[min(100vw-2rem,380px)] rounded-xl border border-outline/20 bg-white shadow-xl">
            <div className="flex items-start justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-on-surface">{t('title')}</h3>
                {unreadCount > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-2 text-[11px] font-semibold text-on-primary">
                    {unreadCount}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-on-surface/60 hover:text-primary disabled:opacity-40"
                disabled={unreadCount === 0}
                onClick={() => setMarkAllRead(true)}
              >
                {t('markAllRead')}
              </button>
            </div>

            <div className="border-t border-outline/15" />

            <ul className="max-h-[420px] space-y-2 overflow-y-auto p-2">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`rounded-xl border border-outline/10 px-3 py-3 ${
                    n.unread ? 'bg-[#f5f0f0]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative size-9 shrink-0">
                      <Image
                        src={n.avatarUrl}
                        alt=""
                        fill
                        unoptimized
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-on-surface">{n.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-on-surface/60">{n.age}</span>
                        {n.unread ? (
                          <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        ) : null}
                      </div>
                      <div className="mt-2 rounded-lg border border-outline/10 bg-white/70 p-3 text-xs leading-relaxed text-on-surface/70">
                        {n.preview}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
