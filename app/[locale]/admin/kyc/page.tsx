'use client';

import { useState, useMemo } from 'react';
import KycCard, { type KycSubmission } from '@/components/admin/KycCard';

const MOCK_SUBMISSIONS: KycSubmission[] = [
  {
    id: 'kyc1', userName: 'Sarah Johnson', userEmail: 'sarah.j@example.com', userInitials: 'SJ',
    submittedAt: 'Mar 16, 2026', documentType: 'Government ID', status: 'Pending',
    images: ['https://picsum.photos/seed/kyc1a/400/250', 'https://picsum.photos/seed/kyc1b/400/250', 'https://picsum.photos/seed/kyc1c/400/250'],
  },
  {
    id: 'kyc2', userName: 'Mike Ross', userEmail: 'mike.ross@example.com', userInitials: 'MR',
    submittedAt: 'Mar 15, 2026', documentType: 'Passport', status: 'Pending',
    images: ['https://picsum.photos/seed/kyc2a/400/250', 'https://picsum.photos/seed/kyc2b/400/250'],
  },
  {
    id: 'kyc3', userName: 'Emily Davis', userEmail: 'emily.d@example.com', userInitials: 'ED',
    submittedAt: 'Mar 12, 2026', documentType: 'Driver\'s License', status: 'Approved',
    images: ['https://picsum.photos/seed/kyc3a/400/250', 'https://picsum.photos/seed/kyc3b/400/250', 'https://picsum.photos/seed/kyc3c/400/250'],
  },
  {
    id: 'kyc4', userName: 'Chris Parker', userEmail: 'chris.p@example.com', userInitials: 'CP',
    submittedAt: 'Mar 10, 2026', documentType: 'Government ID', status: 'Rejected',
    rejectionReason: 'Document image was blurry and unreadable.',
    images: ['https://picsum.photos/seed/kyc4a/400/250', 'https://picsum.photos/seed/kyc4b/400/250'],
  },
  {
    id: 'kyc5', userName: 'Anna Taylor', userEmail: 'anna.t@example.com', userInitials: 'AT',
    submittedAt: 'Mar 8, 2026', documentType: 'Proof of Address', status: 'Completed',
    images: ['https://picsum.photos/seed/kyc5a/400/250', 'https://picsum.photos/seed/kyc5b/400/250', 'https://picsum.photos/seed/kyc5c/400/250'],
  },
  {
    id: 'kyc6', userName: 'David Wilson', userEmail: 'david.w@example.com', userInitials: 'DW',
    submittedAt: 'Mar 7, 2026', documentType: 'Passport', status: 'Approved',
    images: ['https://picsum.photos/seed/kyc6a/400/250', 'https://picsum.photos/seed/kyc6b/400/250'],
  },
  {
    id: 'kyc7', userName: 'Laura Martinez', userEmail: 'laura.m@example.com', userInitials: 'LM',
    submittedAt: 'Mar 5, 2026', documentType: 'Government ID', status: 'Pending',
    images: ['https://picsum.photos/seed/kyc7a/400/250', 'https://picsum.photos/seed/kyc7b/400/250', 'https://picsum.photos/seed/kyc7c/400/250'],
  },
];

type FilterTab = 'All' | 'Pending' | 'Approved' | 'Rejected' | 'Completed';
const FILTER_TABS: FilterTab[] = ['All', 'Pending', 'Approved', 'Rejected', 'Completed'];

export default function KYCPage() {
  const [submissions, setSubmissions] = useState<KycSubmission[]>(MOCK_SUBMISSIONS);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return submissions
      .filter((s) => activeFilter === 'All' || s.status === activeFilter)
      .filter((s) => !q || s.userName.toLowerCase().includes(q) || s.userEmail.toLowerCase().includes(q));
  }, [submissions, activeFilter, search]);

  const handleStatusChange = (id: string, status: 'Approved' | 'Rejected', reason?: string) => {
    setSubmissions((prev) =>
      prev.map((s) => s.id === id ? { ...s, status, rejectionReason: reason } : s)
    );
  };

  const counts: Record<FilterTab, number> = {
    All: submissions.length,
    Pending: submissions.filter((s) => s.status === 'Pending').length,
    Approved: submissions.filter((s) => s.status === 'Approved').length,
    Rejected: submissions.filter((s) => s.status === 'Rejected').length,
    Completed: submissions.filter((s) => s.status === 'Completed').length,
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">KYC Reviews</h1>
          <p className="text-on-surface/70 text-sm mt-1">
            Verify user identities to ensure community safety.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-sm">🔍</span>
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-lowest border border-outline/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1 whitespace-nowrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
              activeFilter === tab
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest border border-outline/30 text-on-surface/70 hover:bg-surface-container'
            }`}
          >
            {tab} <span className="ml-1 opacity-70">({counts[tab]})</span>
          </button>
        ))}
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface/50">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">No submissions match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((submission) => (
            <KycCard
              key={submission.id}
              submission={submission}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
