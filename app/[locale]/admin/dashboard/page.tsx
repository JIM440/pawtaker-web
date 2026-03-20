import DashboardCharts from '@/components/admin/DashboardCharts';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Flag, PawPrint, Plus, ShieldCheck, Sparkles, User, Users, WalletCards } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const METRICS = [
  { labelKey: 'totalVerifiedUsers', value: '9,840', icon: Users, bg: 'bg-primary', delta: '+124 this week', deltaColor: 'text-white/70' },
  { labelKey: 'activeCareContracts', value: '312', icon: PawPrint, bg: 'bg-secondary', delta: '+18 today', deltaColor: 'text-white/70' },
  { labelKey: 'pointsInCirculation', value: '847,200', icon: WalletCards, bg: 'bg-tertiary', delta: '+12,400 this week', deltaColor: 'text-white/70' },
  { labelKey: 'pendingKyc', value: '24', icon: ShieldCheck, bg: 'bg-error', delta: '6 urgent', deltaColor: 'text-white/70' },
] satisfies { labelKey: string; value: string; icon: LucideIcon; bg: string; delta: string; deltaColor: string }[];

const ACTIVITY = [
  { icon: Plus, iconBg: 'bg-primary/10', iconColor: 'text-primary', title: 'New KYC submission from Sarah J.', desc: 'Waiting for document verification', time: '2 mins ago' },
  { icon: PawPrint, iconBg: 'bg-secondary/10', iconColor: 'text-secondary', title: 'Care Request #8924 completed', desc: 'Marked as successful by Mike R.', time: '15 mins ago' },
  { icon: Flag, iconBg: 'bg-error/10', iconColor: 'text-error', title: 'New report: Profile "LuluPaws"', desc: 'Inappropriate content flagged by community', time: '42 mins ago' },
  { icon: CheckCircle2, iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary', title: 'KYC approved for David Wilson', desc: 'Identity verified by auto-check system', time: '1 hour ago' },
  { icon: Sparkles, iconBg: 'bg-primary/10', iconColor: 'text-primary', title: 'New review submitted by Emily D.', desc: '5-star review for care session #3041', time: '2 hours ago' },
  { icon: User, iconBg: 'bg-secondary/10', iconColor: 'text-secondary', title: 'New user joined: Chris Parker', desc: 'Registered and completed onboarding', time: '3 hours ago' },
] satisfies { icon: LucideIcon; iconBg: string; iconColor: string; title: string; desc: string; time: string }[];

export default async function DashboardPage() {
  const t = await getTranslations('admin.dashboard');
  return (
    <div className="p-6 md:p-8 space-y-8">
      <header className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
        <div className="text-sm font-medium text-on-surface/60 sm:text-right">Mar 18, 2026</div>
      </header>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((m) => (
          <div key={m.labelKey} className={`${m.bg} p-6 rounded-xl shadow-sm text-on-primary flex flex-col justify-between h-36`}>
            <div className="flex justify-between items-start">
              <p className="text-xs font-medium text-white/80 uppercase tracking-wider leading-tight max-w-[70%]">
                {t(m.labelKey)}
              </p>
              <m.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-bold">{m.value}</p>
              <p className={`text-xs mt-1 ${m.deltaColor}`}>{m.delta}</p>
            </div>
          </div>
        ))}
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
          {ACTIVITY.map((item) => {
            const ActivityIcon = item.icon;
            return (
            <div
              key={item.title}
              className="bg-white p-3 rounded-xl shadow-sm border border-outline/15 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`size-9 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <ActivityIcon className={`h-4 w-4 ${item.iconColor}`} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{item.title}</p>
                  <p className="text-xs text-on-surface/70 truncate">{item.desc}</p>
                </div>
              </div>
              <span className="text-xs text-on-surface/50 font-medium shrink-0">{item.time}</span>
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
