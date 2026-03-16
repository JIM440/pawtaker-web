// Static content for care requests
const STATIC_REQUESTS = [
  { id: '1', care_type: 'boarding', status: 'active' as const, points_offered: 80, start_date: '2025-03-20', end_date: '2025-03-25', created_at: '2025-03-01T10:00:00Z', owner: 'Jane Doe' },
  { id: '2', care_type: 'drop-in', status: 'active' as const, points_offered: 15, start_date: '2025-03-18', end_date: '2025-03-18', created_at: '2025-03-05T14:00:00Z', owner: 'John Smith' },
  { id: '3', care_type: 'walking', status: 'completed' as const, points_offered: 20, start_date: '2025-03-10', end_date: '2025-03-10', created_at: '2025-03-08T09:00:00Z', owner: 'Sam Wilson' },
  { id: '4', care_type: 'boarding', status: 'active' as const, points_offered: 100, start_date: '2025-03-22', end_date: '2025-03-28', created_at: '2025-03-12T08:00:00Z', owner: 'Jordan Reed' },
  { id: '5', care_type: 'day_care', status: 'cancelled' as const, points_offered: 30, start_date: '2025-03-15', end_date: '2025-03-15', created_at: '2025-03-10T12:00:00Z', owner: 'Alex Brown' },
];

export default function RequestsPage() {
  const activeCount = STATIC_REQUESTS.filter((r) => r.status === 'active').length;
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Care Requests</h1>
        <span className="text-sm text-gray-500">{activeCount} active · {STATIC_REQUESTS.length} total</span>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Owner', 'Type', 'Status', 'Points', 'Start', 'End', 'Created'].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {STATIC_REQUESTS.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-600">{req.owner ?? '—'}</td>
                <td className="px-6 py-4 font-medium capitalize text-[#1A1A2E]">{req.care_type.replace('_', ' ')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    req.status === 'active' ? 'bg-green-100 text-green-700' :
                    req.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    req.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{req.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{req.points_offered}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(req.start_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(req.end_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-gray-400">{new Date(req.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
