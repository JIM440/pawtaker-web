'use client';

import { useState, useMemo } from 'react';
import ConfirmationModal from './ConfirmationModal';

interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  kycStatus: 'Approved' | 'Submitted' | 'Pending' | 'Rejected';
  points: number;
  careGiven: number;
  careReceived: number;
  joined: string;
  status: 'Active' | 'Deactivated';
}

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sarah Johnson', initials: 'SJ', email: 'sarah.j@example.com', kycStatus: 'Approved', points: 1240, careGiven: 18, careReceived: 12, joined: 'Jan 15, 2025', status: 'Active' },
  { id: 'u2', name: 'Mike Ross', initials: 'MR', email: 'mike.ross@example.com', kycStatus: 'Submitted', points: 320, careGiven: 4, careReceived: 7, joined: 'Feb 22, 2025', status: 'Active' },
  { id: 'u3', name: 'Emily Davis', initials: 'ED', email: 'emily.d@example.com', kycStatus: 'Approved', points: 875, careGiven: 11, careReceived: 9, joined: 'Mar 10, 2025', status: 'Active' },
  { id: 'u4', name: 'Chris Parker', initials: 'CP', email: 'chris.p@example.com', kycStatus: 'Pending', points: 50, careGiven: 1, careReceived: 0, joined: 'Mar 17, 2026', status: 'Active' },
  { id: 'u5', name: 'Anna Taylor', initials: 'AT', email: 'anna.t@example.com', kycStatus: 'Rejected', points: 0, careGiven: 0, careReceived: 0, joined: 'Nov 3, 2024', status: 'Deactivated' },
  { id: 'u6', name: 'David Wilson', initials: 'DW', email: 'david.w@example.com', kycStatus: 'Approved', points: 2100, careGiven: 27, careReceived: 14, joined: 'Sep 5, 2024', status: 'Active' },
  { id: 'u7', name: 'Laura Martinez', initials: 'LM', email: 'laura.m@example.com', kycStatus: 'Approved', points: 560, careGiven: 8, careReceived: 6, joined: 'Dec 20, 2024', status: 'Active' },
];

const KYC_COLORS: Record<User['kycStatus'], string> = {
  Approved: 'bg-emerald-100 text-emerald-800',
  Submitted: 'bg-blue-100 text-blue-800',
  Pending: 'bg-amber-100 text-amber-800',
  Rejected: 'bg-red-100 text-red-700',
};

type SortKey = 'points-desc' | 'points-asc' | 'care-given' | 'care-received';

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('points-desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
    if (sort === 'points-desc') result = [...result].sort((a, b) => b.points - a.points);
    if (sort === 'points-asc') result = [...result].sort((a, b) => a.points - b.points);
    if (sort === 'care-given') result = [...result].sort((a, b) => b.careGiven - a.careGiven);
    if (sort === 'care-received') result = [...result].sort((a, b) => b.careReceived - a.careReceived);
    return result;
  }, [users, search, sort]);

  const handleDelete = () => {
    if (!deleteId) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    setDeleteId(null);
  };

  const handleDeactivate = () => {
    if (!deactivateId) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === deactivateId ? { ...u, status: 'Deactivated' as const } : u))
    );
    setDeactivateId(null);
  };

  const deleteUser = users.find((u) => u.id === deleteId);
  const deactivateUser = users.find((u) => u.id === deactivateId);

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-sm">🔍</span>
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-lowest border border-outline/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="px-4 py-2.5 bg-surface-container-lowest border border-outline/30 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="points-desc">Points (High to Low)</option>
          <option value="points-asc">Points (Low to High)</option>
          <option value="care-given">Most Care Given</option>
          <option value="care-received">Most Care Received</option>
        </select>
        <button className="px-4 py-2.5 bg-surface-container-lowest border border-outline/30 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap">
          Export List
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container border-b border-outline/10 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4 hidden sm:table-cell">KYC Status</th>
                <th className="px-6 py-4">Points</th>
                <th className="px-6 py-4 hidden md:table-cell">Status</th>
                <th className="px-6 py-4 hidden lg:table-cell">Joined</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-surface-container transition-colors ${user.status === 'Deactivated' ? 'opacity-60' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {user.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">{user.name}</p>
                        <p className="text-xs text-on-surface/60">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${KYC_COLORS[user.kycStatus]}`}>
                      {user.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">{user.points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface/60 hidden lg:table-cell">{user.joined}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setDeactivateId(user.id)}
                        disabled={user.status === 'Deactivated'}
                        title="Deactivate account"
                        className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        🚫
                      </button>
                      <button
                        onClick={() => setDeleteId(user.id)}
                        title="Delete user"
                        className="p-2 hover:bg-red-50 rounded-lg text-error transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-surface-container border-t border-outline/10 flex items-center justify-between text-sm text-on-surface/70">
          <div>Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{users.length}</span> users</div>
          <div className="flex gap-2">
            <button className="p-2 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/60 disabled:opacity-50" disabled>‹</button>
            <button className="p-2 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/80">›</button>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmationModal
        isOpen={!!deleteId}
        title={`Delete ${deleteUser?.name ?? 'user'}?`}
        description="This action cannot be undone. All user data will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Deactivate confirmation */}
      <ConfirmationModal
        isOpen={!!deactivateId}
        title={`Deactivate ${deactivateUser?.name ?? 'account'}?`}
        description="The user will lose access to the platform. This can be reversed later."
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        tone="default"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateId(null)}
      />
    </>
  );
}
