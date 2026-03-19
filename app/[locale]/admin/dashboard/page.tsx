import DashboardCharts from '@/components/admin/DashboardCharts';

const METRICS = [
  { label: 'Total Verified Users', value: '9,840', icon: '👥', bg: 'bg-primary', delta: '+124 this week', deltaColor: 'text-white/70' },
  { label: 'Active Care Contracts', value: '312', icon: '🤝', bg: 'bg-secondary', delta: '+18 today', deltaColor: 'text-white/70' },
  { label: 'Points in Circulation', value: '847,200', icon: '⭐', bg: 'bg-tertiary', delta: '+12,400 this week', deltaColor: 'text-white/70' },
  { label: 'Pending KYC Submissions', value: '24', icon: '🪪', bg: 'bg-error', delta: '6 urgent', deltaColor: 'text-white/70' },
];

const ACTIVITY = [
  { icon: '➕', iconBg: 'bg-primary/10', iconColor: 'text-primary', title: 'New KYC submission from Sarah J.', desc: 'Waiting for document verification', time: '2 mins ago' },
  { icon: '🐾', iconBg: 'bg-secondary/10', iconColor: 'text-secondary', title: 'Care Request #8924 completed', desc: 'Marked as successful by Mike R.', time: '15 mins ago' },
  { icon: '🚩', iconBg: 'bg-error/10', iconColor: 'text-error', title: 'New report: Profile "LuluPaws"', desc: 'Inappropriate content flagged by community', time: '42 mins ago' },
  { icon: '✔️', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary', title: 'KYC approved for David Wilson', desc: 'Identity verified by auto-check system', time: '1 hour ago' },
  { icon: '🌟', iconBg: 'bg-primary/10', iconColor: 'text-primary', title: 'New review submitted by Emily D.', desc: '5-star review for care session #3041', time: '2 hours ago' },
  { icon: '👤', iconBg: 'bg-secondary/10', iconColor: 'text-secondary', title: 'New user joined: Chris Parker', desc: 'Registered and completed onboarding', time: '3 hours ago' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Dashboard</h1>
          <p className="text-on-surface/70 text-sm">
            Welcome back — here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="hidden sm:block text-sm font-medium text-on-surface/60">
          Mar 18, 2026
        </div>
      </header>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((m) => (
          <div key={m.label} className={`${m.bg} p-6 rounded-xl shadow-sm text-on-primary flex flex-col justify-between h-36`}>
            <div className="flex justify-between items-start">
              <p className="text-xs font-medium text-white/80 uppercase tracking-wider leading-tight max-w-[70%]">
                {m.label}
              </p>
              <span className="text-xl">{m.icon}</span>
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
          <h2 className="text-xl font-bold text-on-surface">Recent Activity</h2>
          <button className="text-primary font-semibold text-sm hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {ACTIVITY.map((item) => (
            <div
              key={item.title}
              className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline/15 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`size-10 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <span className={item.iconColor}>{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{item.title}</p>
                  <p className="text-xs text-on-surface/70 truncate">{item.desc}</p>
                </div>
              </div>
              <span className="text-xs text-on-surface/50 font-medium shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
