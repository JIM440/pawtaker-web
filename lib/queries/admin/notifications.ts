'use client';

// The notifications system is now driven by NotificationProvider (Supabase Realtime + context).
// This file is kept for any legacy imports; the canonical type lives in NotificationProvider.tsx.

export type AdminNotificationDto = {
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
