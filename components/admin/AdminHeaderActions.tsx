'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from '@/lib/i18n/navigation';
import TopbarLangToggle from './TopbarLangToggle';
import { useNotifications, type AdminNotification } from './NotificationProvider';

function formatAge(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AdminHeaderActions() {
  const t = useTranslations('admin.notifications');
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

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

  const handleNotificationClick = (n: AdminNotification) => {
    markOneRead(n.id);
    if (n.type === 'kyc_submitted') {
      router.push('/admin/kyc');
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      <TopbarLangToggle />

      <div ref={rootRef} className="relative">
        <button
          type="button"
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-outline/30 bg-surface-container-low text-on-surface/70 transition-colors hover:bg-surface-container"
          aria-label={t('title')}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
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
                onClick={() => markAllRead()}
              >
                {t('markAllRead')}
              </button>
            </div>

            <div className="border-t border-outline/15" />

            <ul className="max-h-[420px] space-y-2 overflow-y-auto p-2">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`cursor-pointer rounded-xl border border-outline/10 px-3 py-3 transition-colors hover:bg-[#f5f0f0]/60 ${
                    !n.is_read ? 'bg-[#f5f0f0]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative size-9 shrink-0">
                      {n.user?.avatar_url ? (
                        <Image
                          src={n.user.avatar_url}
                          alt={n.user.full_name ?? ''}
                          fill
                          unoptimized
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {n.user?.full_name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-on-surface">{n.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-on-surface/60">{formatAge(n.created_at)}</span>
                        {!n.is_read ? (
                          <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        ) : null}
                      </div>
                      <div className="mt-2 rounded-lg border border-outline/10 bg-white/70 p-3 text-xs leading-relaxed text-on-surface/70">
                        {n.message}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {notifications.length === 0 ? (
                <li className="rounded-xl border border-outline/10 px-3 py-4 text-xs text-on-surface/60">
                  No notifications yet.
                </li>
              ) : null}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
