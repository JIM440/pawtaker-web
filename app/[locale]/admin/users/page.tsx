export default function UsersPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-on-surface">User Management</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline/30 text-sm font-medium text-on-surface hover:bg-surface-container-lowest">
            ⭳ Export List
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex-1 min-w-[260px] max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface/40">
              🔍
            </span>
            <input
              type="search"
              name="search"
              placeholder="Search by name or email..."
              className="block w-full rounded-lg border border-outline/30 bg-surface-container-lowest py-2.5 pl-9 pr-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder:text-on-surface/40"
            />
          </div>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-opacity">
          <span>＋</span>
          Add New User
        </button>
      </div>

      <div className="rounded-xl border border-outline/30 bg-surface-container-lowest overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-container border-b border-outline/20">
                <th className="px-6 py-4 text-xs font-semibold text-on-surface/70 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface/70 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface/70 uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface/70 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface/70 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 border-b border-outline/20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/15">
              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      AJ
                    </div>
                    <span className="text-sm font-semibold text-on-surface">Alice Johnson</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface/70">
                  alice@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <span className="size-1.5 bg-emerald-500 rounded-full mr-1.5" />
                    Approved
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                  1,250
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface/60">
                  Oct 12, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-on-surface/40 hover:text-primary transition-colors">
                    ⋮
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      BS
                    </div>
                    <span className="text-sm font-semibold text-on-surface">Bob Smith</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface/70">
                  bob@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    <span className="size-1.5 bg-amber-500 rounded-full mr-1.5" />
                    Submitted
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                  450
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface/60">
                  Nov 05, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-on-surface/40 hover:text-primary transition-colors">
                    ⋮
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      CD
                    </div>
                    <span className="text-sm font-semibold text-on-surface">Charlie Davis</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface/70">
                  charlie@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surface-container text-on-surface/70">
                    <span className="size-1.5 bg-on-surface/40 rounded-full mr-1.5" />
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                  0
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface/60">
                  Jan 15, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-on-surface/40 hover:text-primary transition-colors">
                    ⋮
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      DP
                    </div>
                    <span className="text-sm font-semibold text-on-surface">Diana Prince</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface/70">
                  diana@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <span className="size-1.5 bg-red-500 rounded-full mr-1.5" />
                    Rejected
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                  890
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface/60">
                  Sep 20, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-on-surface/40 hover:text-primary transition-colors">
                    ⋮
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      EW
                    </div>
                    <span className="text-sm font-semibold text-on-surface">Evan Wright</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface/70">
                  evan@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <span className="size-1.5 bg-emerald-500 rounded-full mr-1.5" />
                    Approved
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                  2,100
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface/60">
                  Aug 30, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-on-surface/40 hover:text-primary transition-colors">
                    ⋮
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-surface-container border-t border-outline/20 flex items-center justify-between text-xs text-on-surface/70">
          <span>Showing 1 to 5 of 2,451 users</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/80 hover:bg-surface-container">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
