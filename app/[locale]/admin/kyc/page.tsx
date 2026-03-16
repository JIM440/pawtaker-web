export default function KYCPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-on-surface tracking-tight">KYC Review</h1>
            <p className="text-on-surface/70 mt-1 text-sm">
              Verify user identities to ensure safety within the community.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-sm">
                🔍
              </span>
              <input
                type="search"
                placeholder="Search users..."
                className="pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline/30 rounded-lg text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none w-64"
              />
            </div>
            <button className="p-2 border border-outline/30 rounded-lg hover:bg-surface-container-lowest transition-colors text-on-surface/70">
              ⚙️
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest border border-outline/15 p-5 rounded-xl">
            <p className="text-on-surface/70 text-sm font-medium">Pending Review</p>
            <p className="text-2xl font-bold mt-1 text-primary">24</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline/15 p-5 rounded-xl">
            <p className="text-on-surface/70 text-sm font-medium">Verified This Week</p>
            <p className="text-2xl font-bold mt-1 text-emerald-500">142</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline/15 p-5 rounded-xl">
            <p className="text-on-surface/70 text-sm font-medium">Rejection Rate</p>
            <p className="text-2xl font-bold mt-1 text-on-surface">4.2%</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline/20 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-container border-b border-outline/15 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Document Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submission Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10">
              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">John Doe</p>
                      <p className="text-xs text-on-surface/60">john.doe@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="text-on-surface/40 text-sm">🪪</span>
                    <span className="text-sm">Government ID</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface/70">Oct 24, 2023 14:20</td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-primary/90 transition-all">
                      Approve
                    </button>
                    <button className="border border-red-400 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                      Reject
                    </button>
                    <button className="p-1.5 text-on-surface/50 hover:text-on-surface">
                      👁️
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface/70 text-xs">
                      JS
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Jane Smith</p>
                      <p className="text-xs text-on-surface/60">jane.smith@webmail.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="text-on-surface/40 text-sm">📍</span>
                    <span className="text-sm">Proof of Address</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
                    Approved
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface/70">Oct 23, 2023 09:15</td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-on-surface/40 cursor-not-allowed px-3 py-1.5 text-xs font-bold" disabled>
                      Verified
                    </button>
                    <button className="p-1.5 text-on-surface/50 hover:text-on-surface">
                      ⋮
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface/70 text-xs">
                      MR
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Mike Ross</p>
                      <p className="text-xs text-on-surface/60">mike.ross@pearson.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="text-on-surface/40 text-sm">🚗</span>
                    <span className="text-sm">Driver&apos;s License</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                    Rejected
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface/70">Oct 22, 2023 18:40</td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="border border-outline/30 text-on-surface/80 hover:bg-surface-container-lowest px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                      Re-evaluate
                    </button>
                    <button className="p-1.5 text-on-surface/50 hover:text-on-surface">
                      ?
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                      SC
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Sarah Connor</p>
                      <p className="text-xs text-on-surface/60">sarah.c@resistance.org</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="text-on-surface/40 text-sm">🌍</span>
                    <span className="text-sm">Passport</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface/70">Oct 22, 2023 11:05</td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-primary/90 transition-all">
                      Approve
                    </button>
                    <button className="border border-red-400 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                      Reject
                    </button>
                    <button className="p-1.5 text-on-surface/50 hover:text-on-surface">
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="px-6 py-4 bg-surface-container border-t border-outline/15 flex items-center justify-between">
            <p className="text-xs text-on-surface/70">
              Showing <span className="font-bold">1-4</span> of <span className="font-bold">24</span> reviews
            </p>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-outline/30 bg-surface-container-lowest text-on-surface/40 disabled:opacity-50" disabled>
                ‹
              </button>
              <button className="p-2 rounded-lg border border-outline/30 bg-surface-container-lowest text-on-surface/70 hover:bg-surface-container">
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest border border-outline/20 p-6 rounded-xl">
            <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="text-primary">!</span>
              Immediate Review Required
            </h2>
            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="w-24 h-24 bg-surface-container rounded-lg shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">Alex Johnson</p>
                <p className="text-xs text-on-surface/70 mb-2">
                  ID Card - Submitted 2 hours ago
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="bg-primary text-on-primary px-3 py-1 rounded text-xs font-bold">
                    Approve
                  </button>
                  <button className="bg-surface-container border border-outline/20 px-3 py-1 rounded text-xs font-bold">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline/20 p-6 rounded-xl">
            <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="text-emerald-500">⟳</span>
              Recently Processed
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-on-surface">Emily Watson</span>
                </div>
                <span className="text-on-surface/60 text-xs">15 mins ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-red-500" />
                  <span className="font-medium text-on-surface">Tom Hardy</span>
                </div>
                <span className="text-on-surface/60 text-xs">42 mins ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-on-surface">Lisa Ray</span>
                </div>
                <span className="text-on-surface/60 text-xs">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
