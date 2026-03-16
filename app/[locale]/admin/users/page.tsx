// Static content for admin users list
const STATIC_USERS = [
  { id: '1', full_name: 'Jane Doe', email: 'jane@example.com', kyc_status: 'approved' as const, points_balance: 120, created_at: '2025-02-01T10:00:00Z' },
  { id: '2', full_name: 'John Smith', email: 'john@example.com', kyc_status: 'submitted' as const, points_balance: 45, created_at: '2025-02-05T14:30:00Z' },
  { id: '3', full_name: 'Alex Brown', email: 'alex@example.com', kyc_status: 'pending' as const, points_balance: 0, created_at: '2025-03-01T09:15:00Z' },
  { id: '4', full_name: 'Sam Wilson', email: 'sam@example.com', kyc_status: 'approved' as const, points_balance: 200, created_at: '2025-01-20T11:00:00Z' },
  { id: '5', full_name: 'PawTaker Admin', email: 'pawtaker.test.email@gmail.com', kyc_status: 'approved' as const, points_balance: 0, created_at: '2025-01-01T00:00:00Z' },
  { id: '6', full_name: 'Jordan Reed', email: 'jordan@example.com', kyc_status: 'approved' as const, points_balance: 85, created_at: '2025-02-15T08:00:00Z' },
  { id: '7', full_name: 'Casey Kim', email: 'casey@example.com', kyc_status: 'rejected' as const, points_balance: 0, created_at: '2025-03-10T16:45:00Z' },
];

export default function UsersPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Users</h1>
        <input
          type="search"
          placeholder="Search by name or email..."
          className="border border-outline/50 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <p className="text-sm text-gray-500 mb-4">{STATIC_USERS.length} users</p>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Name', 'Email', 'KYC Status', 'Points', 'Joined'].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {STATIC_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#1A1A2E]">{user.full_name ?? '—'}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.kyc_status === 'approved' ? 'bg-green-100 text-green-700' :
                    user.kyc_status === 'rejected' ? 'bg-red-100 text-red-700' :
                    user.kyc_status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {user.kyc_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.points_balance}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
