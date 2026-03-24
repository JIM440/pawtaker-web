'use client';

import { useQuery } from '@tanstack/react-query';

export interface AdminNotificationDto {
  id: string;
  title: string;
  preview: string;
  age: string;
  avatarUrl: string;
  unread: boolean;
}

const QUERY_KEY = ['admin', 'notifications'] as const;

export function useAdminNotificationsQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/admin/notifications', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch notifications.');
      return (json.notifications ?? []) as AdminNotificationDto[];
    },
  });
}

