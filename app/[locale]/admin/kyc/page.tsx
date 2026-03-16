// Static content for KYC review
const PENDING_SUBMISSIONS = [
  { id: '1', document_type: 'passport', submitted_at: '2025-03-10T09:00:00Z', user: { full_name: 'Chris Lee', email: 'chris@example.com' } },
  { id: '2', document_type: 'drivers_license', submitted_at: '2025-03-12T14:20:00Z', user: { full_name: 'Morgan Taylor', email: 'morgan@example.com' } },
  { id: '3', document_type: 'national_id', submitted_at: '2025-03-14T11:30:00Z', user: { full_name: 'Riley Jones', email: 'riley@example.com' } },
];

const RECENT_REVIEWS = [
  { id: '1', user: 'Alex Brown', outcome: 'Approved', reviewed_at: '2025-03-13T10:00:00Z' },
  { id: '2', user: 'Sam Wilson', outcome: 'Approved', reviewed_at: '2025-03-11T14:00:00Z' },
];

export default function KYCPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-8">KYC Review</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Pending ({PENDING_SUBMISSIONS.length})</h2>
        <div className="space-y-4">
          {PENDING_SUBMISSIONS.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[#1A1A2E]">{sub.user.full_name}</p>
                  <p className="text-sm text-gray-500">{sub.user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {sub.document_type.replace('_', ' ')} · Submitted {new Date(sub.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                    Approve
                  </button>
                  <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Recently reviewed</h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Outcome</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {RECENT_REVIEWS.map((r) => (
                <tr key={r.id}>
                  <td className="px-6 py-4 font-medium text-[#1A1A2E]">{r.user}</td>
                  <td className="px-6 py-4">
                    <span className={r.outcome === 'Approved' ? 'text-green-600' : 'text-red-600'}>{r.outcome}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(r.reviewed_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
