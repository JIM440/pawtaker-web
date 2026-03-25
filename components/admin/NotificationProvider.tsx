'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export type AdminNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  triggered_by: string | null;
  reference_id: string | null;
  reference_type: string | null;
  user?: {
    full_name: string;
    avatar_url: string | null;
  } | null;
};

type NotificationContextType = {
  notifications: AdminNotification[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
  markOneRead: (id: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAllRead: async () => {},
  markOneRead: async () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Fetch existing notifications on mount
  useEffect(() => {
    fetch('/api/admin/notifications', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications ?? []));
  }, []);

  // Supabase Realtime — listen for new notifications
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'admin_notifications',
        },
        (payload) => {
          const newNotif = payload.new as AdminNotification;

          setNotifications((prev) => [newNotif, ...prev]);

          // Show Sonner toast
          toast(newNotif.title, {
            description: newNotif.message,
            duration: 6000,
            action: {
              label: 'View',
              onClick: () => {
                if (newNotif.type === 'kyc_submitted') {
                  router.push('/admin/kyc');
                }
              },
            },
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [router]);

  const markAllRead = useCallback(async () => {
    await fetch('/api/admin/notifications/mark-read', {
      method: 'PATCH',
      credentials: 'include',
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, []);

  const markOneRead = useCallback(async (id: string) => {
    await fetch(`/api/admin/notifications/${id}/mark-read`, {
      method: 'PATCH',
      credentials: 'include',
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markOneRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
