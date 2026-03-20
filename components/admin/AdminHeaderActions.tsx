'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import TopbarLangToggle from './TopbarLangToggle';
import Image from 'next/image';

type AdminNotification = {
  id: string;
  title: string;
  age: string;
  avatarUrl: string;
  unread: boolean;
  preview?: string;
};

interface AdminHeaderActionsProps {
  locale: string;
}

export default function AdminHeaderActions({ locale }: AdminHeaderActionsProps) {
  const t = useTranslations('admin.notifications');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const notifications: AdminNotification[] = [
    {
      id: 'n1',
      title: 'Mark Webber reacted to your recent post',
      age: '1m ago',
      avatarUrl: 'https://picsum.photos/seed/noti-1/64/64',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Angela Gray followed you',
      age: '5m ago',
      avatarUrl: 'https://picsum.photos/seed/noti-2/64/64',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Jacob Thompsonap has joined your group Chess Club',
      age: '1 day ago',
      avatarUrl: 'https://picsum.photos/seed/noti-3/64/64',
      unread: false,
    },
    {
      id: 'n4',
      title: 'Rizky Hasanuda sent you a private message',
      age: '5 days ago',
      avatarUrl: 'https://picsum.photos/seed/noti-4/64/64',
      unread: false,
      preview:
        "Hello, thanks for setting up the Chess Club. I've been a member for a few weeks now and I'm already having lots of fun and improving my game.",
    },
    {
      id: 'n5',
      title: 'Kimberly Smita commented on your picture',
      age: '1 week ago',
      avatarUrl: 'https://picsum.photos/seed/noti-5/64/64',
      unread: false,
    },
    {
      id: 'n6',
      title: 'Nathan Petersa reacted to your recent post',
      age: '2 weeks ago',
      avatarUrl: 'https://picsum.photos/seed/noti-6/64/64',
      unread: false,
    },
    {
      id: 'n7',
      title: 'Anna Kim left the group Chess Club',
      age: '2 weeks ago',
      avatarUrl: 'https://picsum.photos/seed/noti-7/64/64',
      unread: false,
    },
  ];

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
      <TopbarLangToggle locale={locale} />

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
          <div className="absolute right-0 top-12 z-50 w-[380px] rounded-xl border border-outline/20 bg-white shadow-xl">
            <div className="flex items-start justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-on-surface">{t('title')}</h3>
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-2 text-[11px] font-semibold text-on-primary">
                  {unreadCount}
                </span>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-on-surface/60 hover:text-primary"
                onClick={() => {
                  // UI only for now.
                  setOpen(false);
                }}
              >
                {t('markAllRead')}
              </button>
            </div>

            <div className="border-t border-outline/15" />

            <ul className="max-h-[420px] overflow-y-auto p-2 space-y-2">
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
                        alt="Notification avatar"
                        fill
                        unoptimized
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-on-surface">{n.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-on-surface/60">{n.age}</span>
                        {n.unread && <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />}
                      </div>
                      {n.preview && (
                        <div className="mt-2 rounded-lg border border-outline/10 bg-white/70 p-3 text-xs text-on-surface/70 whitespace-pre-wrap">
                          {n.preview}
                        </div>
                      )}
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
