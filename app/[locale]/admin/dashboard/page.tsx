// Static content for admin dashboard
const STATIC_METRICS = {
  totalUsers: 124,
  activeRequests: 18,
  pendingKyc: 5,
  openReports: 2,
};

const RECENT_ACTIVITY = [
  { id: 1, text: 'New user Jane D. signed up', time: '2 hours ago' },
  { id: 2, text: 'KYC approved for Chris Lee', time: '5 hours ago' },
  { id: 3, text: 'Care request #42 completed', time: 'Yesterday' },
];

export default function DashboardPage() {
  const cards = [
    { label: 'Total Users', value: STATIC_METRICS.totalUsers, colorClass: 'text-primary' },
    { label: 'Active Requests', value: STATIC_METRICS.activeRequests, colorClass: 'text-secondary' },
    { label: 'Pending KYC', value: STATIC_METRICS.pendingKyc, colorClass: 'text-tertiary' },
    { label: 'Open Reports', value: STATIC_METRICS.openReports, colorClass: 'text-error' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-on-surface mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-surface-container-lowest rounded-2xl p-6 border border-frame-stroke shadow-sm">
            <p className="text-sm text-on-surface/70 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.colorClass}`}>{card.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-surface-container-lowest rounded-2xl border border-frame-stroke shadow-sm p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-on-surface mb-4">Recent activity</h2>
        <ul className="space-y-3">
          {RECENT_ACTIVITY.map((a) => (
            <li key={a.id} className="flex justify-between text-sm text-on-surface/80">
              <span>{a.text}</span>
              <span className="text-on-surface/60">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
