'use client';

import { useQuery } from '@tanstack/react-query';

export interface AdminDashboardData {
  metrics: {
    totalUsers: number;
    totalVerifiedUsers: number;
    activeCareContracts: number;
    pointsInCirculation: number;
    pendingKyc: number;
    openReports: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    desc: string;
    time: string;
    type: 'user' | 'care' | 'kyc' | 'report';
  }>;
  charts: {
    growth: Array<{ month: string; users: number }>;
    careActivity: Array<{ week: string; given: number; received: number }>;
  };
}

const QUERY_KEY = ['admin', 'dashboard'] as const;

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/admin/dashboard', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch dashboard data.');
      return json as AdminDashboardData;
    },
  });
}

