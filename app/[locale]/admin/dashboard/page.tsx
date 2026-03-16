export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Dashboard</h1>
          <p className="text-on-surface/70 text-sm">
            Welcome back, here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm font-medium text-on-surface/70">
            Oct 24, 2023
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-primary p-6 rounded-xl shadow-sm text-on-primary flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
              Total Users
            </p>
          </div>
          <p className="text-3xl font-bold">12,450</p>
        </div>
        <div className="bg-secondary p-6 rounded-xl shadow-sm text-on-primary flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
              Active Requests
            </p>
          </div>
          <p className="text-3xl font-bold">842</p>
        </div>
        <div className="bg-tertiary p-6 rounded-xl shadow-sm text-on-primary flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
              Pending KYC
            </p>
          </div>
          <p className="text-3xl font-bold">156</p>
        </div>
        <div className="bg-error p-6 rounded-xl shadow-sm text-on-primary flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
              Open Reports
            </p>
          </div>
          <p className="text-3xl font-bold">42</p>
        </div>
      </div>

      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface">Recent Activity</h2>
          <button className="text-primary font-semibold text-sm hover:underline">
            View All
          </button>
        </div>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline/15 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary">➕</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  New KYC submission from Sarah J.
                </p>
                <p className="text-xs text-on-surface/70">
                  Waiting for document verification
                </p>
              </div>
            </div>
            <span className="text-xs text-on-surface/50 font-medium">2 mins ago</span>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline/15 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="text-secondary">🐾</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  Care Request #8924 completed
                </p>
                <p className="text-xs text-on-surface/70">
                  Marked as successful by Mike R.
                </p>
              </div>
            </div>
            <span className="text-xs text-on-surface/50 font-medium">15 mins ago</span>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline/15 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-error/10 flex items-center justify-center">
                <span className="text-error">🚩</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  New report: Profile &quot;LuluPaws&quot;
                </p>
                <p className="text-xs text-on-surface/70">
                  Inappropriate content flagged by community
                </p>
              </div>
            </div>
            <span className="text-xs text-on-surface/50 font-medium">42 mins ago</span>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline/15 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-tertiary/10 flex items-center justify-center">
                <span className="text-tertiary">✔️</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  KYC approved for David Wilson
                </p>
                <p className="text-xs text-on-surface/70">
                  Identity verified by auto-check system
                </p>
              </div>
            </div>
            <span className="text-xs text-on-surface/50 font-medium">1 hour ago</span>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline/15 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary">⏰</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  System maintenance scheduled
                </p>
                <p className="text-xs text-on-surface/70">
                  Scheduled for Sunday, 02:00 AM UTC
                </p>
              </div>
            </div>
            <span className="text-xs text-on-surface/50 font-medium">3 hours ago</span>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline/15 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="text-secondary">$</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  Payout processed: $1,240.00
                </p>
                <p className="text-xs text-on-surface/70">
                  Batch processing for week 42 completed
                </p>
              </div>
            </div>
            <span className="text-xs text-on-surface/50 font-medium">5 hours ago</span>
          </div>
        </div>
      </section>
    </div>
  );
}
