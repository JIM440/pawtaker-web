export default function RequestsPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Care Requests</h1>
          <p className="text-on-surface/70 text-sm mt-1">
            Review and manage community pet care matching.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline/30 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors">
            <span className="text-sm">☰</span>
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <span className="text-sm">＋</span>
            New Request
          </button>
        </div>
      </div>

      <div className="flex border-b border-outline/20 mb-6 overflow-x-auto whitespace-nowrap">
        <button className="px-6 py-3 text-sm font-bold border-b-2 border-primary text-primary">
          All Requests
        </button>
        <button className="px-6 py-3 text-sm font-medium text-on-surface/60 hover:text-primary transition-colors">
          Open
        </button>
        <button className="px-6 py-3 text-sm font-medium text-on-surface/60 hover:text-primary transition-colors">
          Matched
        </button>
        <button className="px-6 py-3 text-sm font-medium text-on-surface/60 hover:text-primary transition-colors">
          Active
        </button>
        <button className="px-6 py-3 text-sm font-medium text-on-surface/60 hover:text-primary transition-colors">
          Completed
        </button>
        <button className="px-6 py-3 text-sm font-medium text-on-surface/60 hover:text-primary transition-colors">
          Cancelled
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline/10 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">Pet &amp; Breed</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Service Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Points</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
                      <span>🐶</span>
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">Buddy</div>
                      <div className="text-xs text-on-surface/60">Golden Retriever</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-on-surface">Sarah Johnson</div>
                  <div className="text-xs text-on-surface/60">Premium Member</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-on-surface">Oct 12 - Oct 15</div>
                  <div className="text-xs text-on-surface/60">3 Nights</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Open
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-primary">450 pts</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 text-on-surface/60">
                    <button className="p-2 hover:bg-surface-container rounded-lg">
                      <span>👁️</span>
                    </button>
                    <button className="p-2 hover:bg-surface-container rounded-lg">
                      <span>⋮</span>
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface/40">
                      <span>🐱</span>
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">Luna</div>
                      <div className="text-xs text-on-surface/60">Siamese</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-on-surface">Mike Ross</div>
                  <div className="text-xs text-on-surface/60">Standard Member</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-on-surface">Oct 14 - Oct 14</div>
                  <div className="text-xs text-on-surface/60">Day Care</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Matched
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-primary">150 pts</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-on-surface/60">
                    <button className="p-2 hover:bg-surface-container rounded-lg">
                      <span>👁️</span>
                    </button>
                    <button className="p-2 hover:bg-surface-container rounded-lg">
                      <span>⋮</span>
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
                      <span>🐕</span>
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">Max</div>
                      <div className="text-xs text-on-surface/60">Beagle</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-on-surface">Emily Davis</div>
                  <div className="text-xs text-on-surface/60">Premium Member</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-on-surface">Oct 10 - Oct 20</div>
                  <div className="text-xs text-on-surface/60">10 Nights</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-primary">1200 pts</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-on-surface/60">
                    <button className="p-2 hover:bg-surface-container rounded-lg">
                      <span>👁️</span>
                    </button>
                    <button className="p-2 hover:bg-surface-container rounded-lg">
                      <span>⋮</span>
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface/40">
                      <span>🐰</span>
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">Bella</div>
                      <div className="text-xs text-on-surface/60">Rabbit</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-on-surface">Chris Pratt</div>
                  <div className="text-xs text-on-surface/60">Standard Member</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-on-surface">Oct 01 - Oct 03</div>
                  <div className="text-xs text-on-surface/60">2 Nights</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-primary">300 pts</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-on-surface/60">
                    <button className="p-2 hover:bg-surface-container rounded-lg">
                      <span>👁️</span>
                    </button>
                    <button className="p-2 hover:bg-surface-container rounded-lg">
                      <span>⋮</span>
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
                      <span>🐩</span>
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">Charlie</div>
                      <div className="text-xs text-on-surface/60">Poodle</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-on-surface">Anna Taylor</div>
                  <div className="text-xs text-on-surface/60">Standard Member</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-on-surface">Oct 05 - Oct 06</div>
                  <div className="text-xs text-on-surface/60">1 Night</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Cancelled
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-primary">0 pts</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-on-surface/60">
                    <button className="p-2 hover:bg-surface-container rounded-lg">
                      <span>👁️</span>
                    </button>
                    <button className="p-2 hover:bg-surface-container rounded-lg">
                      <span>⋮</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-surface-container border-t border-outline/10 flex items-center justify-between text-sm text-on-surface/70">
          <div>
            Showing <span className="font-semibold">1</span> to <span className="font-semibold">5</span> of{' '}
            <span className="font-semibold">42</span> requests
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/60 disabled:opacity-50" disabled>
              ‹
            </button>
            <button className="p-2 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/80">
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline/20 shadow-sm">
          <div className="text-on-surface/70 text-xs font-bold uppercase tracking-wider mb-2">
            Completion Rate
          </div>
          <div className="flex items-end gap-2">
            <div className="text-2xl font-black text-on-surface">94.2%</div>
            <div className="text-emerald-500 text-xs font-bold flex items-center mb-1">
              ↑ 2%
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline/20 shadow-sm">
          <div className="text-on-surface/70 text-xs font-bold uppercase tracking-wider mb-2">
            Avg. Response Time
          </div>
          <div className="flex items-end gap-2">
            <div className="text-2xl font-black text-on-surface">18m</div>
            <div className="text-emerald-500 text-xs font-bold flex items-center mb-1">
              ↓ 4m
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline/20 shadow-sm">
          <div className="text-on-surface/70 text-xs font-bold uppercase tracking-wider mb-2">
            Total Points Exchanged
          </div>
          <div className="flex items-end gap-2">
            <div className="text-2xl font-black text-on-surface">12.4k</div>
            <div className="text-primary text-xs font-bold flex items-center mb-1">pts</div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline/20 shadow-sm">
          <div className="text-on-surface/70 text-xs font-bold uppercase tracking-wider mb-2">
            Active Caretakers
          </div>
          <div className="flex items-end gap-2">
            <div className="text-2xl font-black text-on-surface">156</div>
            <div className="text-on-surface/60 text-xs font-bold flex items-center mb-1">
              members
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
