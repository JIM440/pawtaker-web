'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import TopbarLangToggle from './TopbarLangToggle';
import { useAdminNotificationsQuery } from '@/lib/queries/admin/notifications';

type AdminNotification = {
  id: string;
  title: string;
  preview: string;
  age: string;
  avatarUrl: string;
  unread: boolean;
};

export default function AdminHeaderActions() {
  const t = useTranslations('admin.notifications');
  const notificationsQuery = useAdminNotificationsQuery();
  const [open, setOpen] = useState(false);
  const [markAllRead, setMarkAllRead] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const notifications: AdminNotification[] = useMemo(
    () => (notificationsQuery.data ?? []).map((row) => ({ ...row, unread: markAllRead ? false : row.unread })),
    [notificationsQuery.data, markAllRead]
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
              {notificationsQuery.isLoading ? (
                <li className="rounded-xl border border-outline/10 px-3 py-4 text-xs text-on-surface/60">
                  Loading...
                </li>
              ) : null}
              {notificationsQuery.isError ? (
                <li className="rounded-xl border border-outline/10 px-3 py-4 text-xs text-on-surface/60">
                  {notificationsQuery.error instanceof Error
                    ? notificationsQuery.error.message
                    : 'Failed to load notifications.'}
                </li>
              ) : null}
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
              {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.length === 0 ? (
                <li className="rounded-xl border border-outline/10 px-3 py-4 text-xs text-on-surface/60">
                  {t('title')}: 0
                </li>
              ) : null}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
