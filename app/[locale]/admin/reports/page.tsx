// Static content for reports
const OPEN_REPORTS = [
  { id: '1', reason: 'Inappropriate message', details: 'User reported receiving an off-topic message in chat.', created_at: '2025-03-12T11:00:00Z', reporter: 'Jane D.' },
  { id: '2', reason: 'No-show', details: 'Sitter did not show up for agreed drop-in visit.', created_at: '2025-03-14T09:30:00Z', reporter: 'John S.' },
  { id: '3', reason: 'Pet safety concern', details: 'Owner says pet was left alone longer than agreed.', created_at: '2025-03-15T08:00:00Z', reporter: 'Sam W.' },
];

const RESOLVED_REPORTS = [
  { id: '1', reason: 'Payment dispute', resolved_at: '2025-03-10T16:00:00Z', outcome: 'Dismissed' },
  { id: '2', reason: 'Spam profile', resolved_at: '2025-03-08T11:00:00Z', outcome: 'User suspended' },
];

export default function ReportsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-8">Reports</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Open ({OPEN_REPORTS.length})</h2>
        <div className="space-y-4">
          {OPEN_REPORTS.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-[#1A1A2E]">{report.reason}</p>
                <span className="text-xs text-gray-400">{new Date(report.created_at).toLocaleDateString()}</span>
              </div>
              {report.details && <p className="text-sm text-gray-600 mb-2">{report.details}</p>}
              <p className="text-xs text-gray-400 mb-4">Reported by {report.reporter ?? '—'}</p>
              <div className="flex gap-2">
                <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200">
                  Mark Reviewed
                </button>
                <button className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-200">
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Resolved</h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Outcome</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Resolved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {RESOLVED_REPORTS.map((r) => (
                <tr key={r.id}>
                  <td className="px-6 py-4 font-medium text-[#1A1A2E]">{r.reason}</td>
                  <td className="px-6 py-4 text-gray-600">{r.outcome}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(r.resolved_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
