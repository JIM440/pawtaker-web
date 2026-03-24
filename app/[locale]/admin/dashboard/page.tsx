'use client';

import DashboardCharts from '@/components/admin/DashboardCharts';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Flag, PawPrint, ShieldCheck, User, Users, WalletCards } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAdminDashboardQuery, type AdminDashboardData } from '@/lib/queries/admin/dashboard';

const METRICS = [
  { labelKey: 'totalVerifiedUsers', icon: Users, bg: 'bg-primary', deltaColor: 'text-white/70' },
  { labelKey: 'activeCareContracts', icon: PawPrint, bg: 'bg-secondary', deltaColor: 'text-white/70' },
  { labelKey: 'pointsInCirculation', icon: WalletCards, bg: 'bg-tertiary', deltaColor: 'text-white/70' },
  { labelKey: 'pendingKyc', icon: ShieldCheck, bg: 'bg-error', deltaColor: 'text-white/70' },
] satisfies { labelKey: string; icon: LucideIcon; bg: string; deltaColor: string }[];

export default function DashboardPage() {
  const t = useTranslations('admin.dashboard');
  const dashboardQuery = useAdminDashboardQuery();
  const data = dashboardQuery.data;
  return (
    <div className="p-6 md:p-8 space-y-8">
      <header className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
        <div className="text-sm font-medium text-on-surface/60 sm:text-right">{new Date().toLocaleDateString()}</div>
      </header>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((m) => {
          const value =
            m.labelKey === 'totalVerifiedUsers'
              ? data?.metrics.totalVerifiedUsers
              : m.labelKey === 'activeCareContracts'
                ? data?.metrics.activeCareContracts
                : m.labelKey === 'pointsInCirculation'
                  ? data?.metrics.pointsInCirculation
                  : m.labelKey === 'pendingKyc'
                    ? data?.metrics.pendingKyc
                    : undefined;
          return (
          <div key={m.labelKey} className={`${m.bg} p-6 rounded-xl shadow-sm text-on-primary flex flex-col justify-between h-36`}>
            <div className="flex justify-between items-start">
              <p className="text-xs font-medium text-white/80 uppercase tracking-wider leading-tight max-w-[70%]">
                {t(m.labelKey)}
              </p>
              <m.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-bold">{(value ?? 0).toLocaleString()}</p>
              <p className={`text-xs mt-1 ${m.deltaColor}`}>Live</p>
            </div>
          </div>
          );
        })}
      </div>

      {/* Charts */}
      <DashboardCharts />

      {/* Recent activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface">{t('recentActivity')}</h2>
          <button className="text-primary font-semibold text-sm hover:underline">{t('viewAll')}</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {(data?.recentActivity ?? []).map((item: AdminDashboardData['recentActivity'][number]) => {
            const activityType = item.type;
            const ActivityIcon =
              activityType === 'user'
                ? User
                : activityType === 'care'
                  ? PawPrint
                  : activityType === 'kyc'
                    ? CheckCircle2
                    : Flag;
            return (
            <div
              key={item.id}
              className="bg-white p-3 rounded-xl shadow-sm border border-outline/15 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ActivityIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{item.title}</p>
                  <p className="text-xs text-on-surface/70 truncate">{item.desc}</p>
                </div>
              </div>
              <span className="text-xs text-on-surface/50 font-medium shrink-0">
                {item.time ? new Date(item.time).toLocaleString() : ''}
              </span>
            </div>
            );
          })}
          {dashboardQuery.isLoading ? (
            <p className="text-sm text-on-surface/60">Loading activity...</p>
          ) : null}
          {!dashboardQuery.isLoading && !dashboardQuery.isError && (data?.recentActivity?.length ?? 0) === 0 ? (
            <p className="text-sm text-on-surface/60">No recent activity.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
