export default function ReportsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-on-surface">User Reports</h1>
            <p className="text-on-surface/70 mt-1 text-sm">
              Review and manage reported behavior and content compliance.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-sm">
                🔍
              </span>
              <input
                type="search"
                placeholder="Search reports..."
                className="pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline/30 rounded-lg text-sm focus:ring-primary focus:border-primary w-64 outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline/30 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors">
              ☰ Filter
            </button>
          </div>
        </div>

        <div className="flex gap-8 border-b border-outline/20 mb-6">
          <button className="pb-4 border-b-2 border-primary text-primary text-sm font-bold">
            Pending (12)
          </button>
          <button className="pb-4 border-b-2 border-transparent text-on-surface/60 text-sm font-semibold hover:text-on-surface">
            In Review (5)
          </button>
          <button className="pb-4 border-b-2 border-transparent text-on-surface/60 text-sm font-semibold hover:text-on-surface">
            Resolved
          </button>
          <button className="pb-4 border-b-2 border-transparent text-on-surface/60 text-sm font-semibold hover:text-on-surface">
            Archived
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline/20 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container text-on-surface/70 text-xs uppercase tracking-wider font-semibold border-b border-outline/15">
                <tr>
                  <th className="px-6 py-4">Reporter</th>
                  <th className="px-6 py-4">Reported User</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/15">
                <tr className="bg-red-100/60">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-surface-container" />
                      <span className="text-sm font-medium text-on-surface">Sarah Jenkins</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-on-surface/80">Mike Wolf (@mikew)</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-red-500" />
                      <span className="text-sm font-semibold text-red-900">
                        Severe Harassment
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-900 text-white">
                      Urgent
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container-lowest border border-outline/20 hover:bg-surface-container transition-colors">
                        Dismiss
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-on-primary hover:bg-error/90 transition-colors">
                        Take Action
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-surface-container" />
                      <span className="text-sm font-medium text-on-surface">Alex Rivera</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-on-surface/80">PetStore_99</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-on-surface/70">Fraudulent Listing</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-surface-container text-on-surface/70">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container-lowest border border-outline/20 hover:bg-surface-container transition-colors">
                        Dismiss
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-on-primary hover:bg-error/90 transition-colors">
                        Take Action
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        🙂
                      </div>
                      <span className="text-sm font-medium text-on-surface">Anonymous_77</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-on-surface/80">BarkBuddy Admin</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-on-surface/70">Inappropriate Media</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-surface-container text-on-surface/70">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container-lowest border border-outline/20 hover:bg-surface-container transition-colors">
                        Dismiss
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-on-primary hover:bg-error/90 transition-colors">
                        Take Action
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-surface-container" />
                      <span className="text-sm font-medium text-on-surface">Emily Chen</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-on-surface/80">ScamBot_404</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-on-surface/70">Spam Activity</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-surface-container text-on-surface/70">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container-lowest border border-outline/20 hover:bg-surface-container transition-colors">
                        Dismiss
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-on-primary hover:bg-error/90 transition-colors">
                        Take Action
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-surface-container border-t border-outline/20 flex items-center justify-between">
            <p className="text-xs text-on-surface/70 font-medium">
              Showing 4 of 12 pending reports
            </p>
            <div className="flex gap-2">
              <button className="p-1 rounded bg-surface-container-lowest border border-outline/30 text-on-surface/40 disabled:opacity-50" disabled>
                ‹
              </button>
              <button className="p-1 rounded bg-surface-container-lowest border border-outline/30 text-on-surface/60 hover:bg-surface-container">
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-on-surface/70 uppercase">
                Weekly Resolution Rate
              </span>
              <span className="text-primary text-lg">⬈</span>
            </div>
            <div className="flex items-end gap-2">
              <h2 className="text-2xl font-black text-on-surface">94.2%</h2>
              <span className="text-emerald-500 text-xs font-bold mb-1">+2.4%</span>
            </div>
            <p className="text-xs text-on-surface/60 mt-2">Target benchmark: 90%</p>
          </div>
          <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-on-surface/70 uppercase">
                Avg. Response Time
              </span>
              <span className="text-primary text-lg">⏱</span>
            </div>
            <div className="flex items-end gap-2">
              <h2 className="text-2xl font-black text-on-surface">2.4 hrs</h2>
              <span className="text-emerald-500 text-xs font-bold mb-1">-15m</span>
            </div>
            <p className="text-xs text-on-surface/60 mt-2">Improved since last month</p>
          </div>
          <div className="p-6 bg-red-100/60 rounded-xl border border-red-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-red-900 uppercase">
                Critical Unresolved
              </span>
              <span className="text-red-900 text-lg">⚠️</span>
            </div>
            <div className="flex items-end gap-2">
              <h2 className="text-2xl font-black text-red-900">03</h2>
            </div>
            <p className="text-xs text-red-900 mt-2 font-medium">Requires immediate attention</p>
          </div>
        </div>
      </div>
    </div>
  );
}
