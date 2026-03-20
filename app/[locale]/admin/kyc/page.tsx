'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import KycCard, { type KycSubmission } from '@/components/admin/KycCard';

const MOCK_SUBMISSIONS: KycSubmission[] = [
  {
    id: 'kyc1',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@example.com',
    userInitials: 'SJ',
    userImage: 'https://picsum.photos/seed/kyc-user-1/72',
    submittedAt: 'Mar 16, 2026',
    documentType: 'Government ID',
    status: 'Pending',
    images: [
      'https://picsum.photos/seed/kyc1a/400/250',
      'https://picsum.photos/seed/kyc1b/400/250',
      'https://picsum.photos/seed/kyc1c/400/250',
    ],
  },
  {
    id: 'kyc2',
    userName: 'Mike Ross',
    userEmail: 'mike.ross@example.com',
    userInitials: 'MR',
    userImage: 'https://picsum.photos/seed/kyc-user-2/72',
    submittedAt: 'Mar 15, 2026',
    documentType: 'Passport',
    status: 'Pending',
    images: ['https://picsum.photos/seed/kyc2a/400/250', 'https://picsum.photos/seed/kyc2b/400/250'],
  },
  {
    id: 'kyc3',
    userName: 'Emily Davis',
    userEmail: 'emily.d@example.com',
    userInitials: 'ED',
    userImage: 'https://picsum.photos/seed/kyc-user-3/72',
    submittedAt: 'Mar 12, 2026',
    documentType: "Driver's License",
    status: 'Approved',
    images: [
      'https://picsum.photos/seed/kyc3a/400/250',
      'https://picsum.photos/seed/kyc3b/400/250',
      'https://picsum.photos/seed/kyc3c/400/250',
    ],
  },
  {
    id: 'kyc4',
    userName: 'Chris Parker',
    userEmail: 'chris.p@example.com',
    userInitials: 'CP',
    userImage: 'https://picsum.photos/seed/kyc-user-4/72',
    submittedAt: 'Mar 10, 2026',
    documentType: 'Government ID',
    status: 'Rejected',
    rejectionReason: 'Document image was blurry and unreadable.',
    images: ['https://picsum.photos/seed/kyc4a/400/250', 'https://picsum.photos/seed/kyc4b/400/250'],
  },
  {
    id: 'kyc5',
    userName: 'Anna Taylor',
    userEmail: 'anna.t@example.com',
    userInitials: 'AT',
    userImage: 'https://picsum.photos/seed/kyc-user-5/72',
    submittedAt: 'Mar 8, 2026',
    documentType: 'Proof of Address',
    status: 'Approved',
    images: [
      'https://picsum.photos/seed/kyc5a/400/250',
      'https://picsum.photos/seed/kyc5b/400/250',
      'https://picsum.photos/seed/kyc5c/400/250',
    ],
  },
  {
    id: 'kyc6',
    userName: 'David Wilson',
    userEmail: 'david.w@example.com',
    userInitials: 'DW',
    userImage: 'https://picsum.photos/seed/kyc-user-6/72',
    submittedAt: 'Mar 7, 2026',
    documentType: 'Passport',
    status: 'Approved',
    images: ['https://picsum.photos/seed/kyc6a/400/250', 'https://picsum.photos/seed/kyc6b/400/250'],
  },
  {
    id: 'kyc7',
    userName: 'Laura Martinez',
    userEmail: 'laura.m@example.com',
    userInitials: 'LM',
    userImage: 'https://picsum.photos/seed/kyc-user-7/72',
    submittedAt: 'Mar 5, 2026',
    documentType: 'Government ID',
    status: 'Pending',
    images: [
      'https://picsum.photos/seed/kyc7a/400/250',
      'https://picsum.photos/seed/kyc7b/400/250',
      'https://picsum.photos/seed/kyc7c/400/250',
    ],
  },
];

type KycFilter = 'All' | 'Pending' | 'Approved' | 'Rejected';

function isApprovedLike(s: KycSubmission): boolean {
  return s.status === 'Approved';
}

export default function KYCPage() {
  const t = useTranslations('admin.kyc');
  const [submissions, setSubmissions] = useState<KycSubmission[]>(MOCK_SUBMISSIONS);
  const [activeFilter, setActiveFilter] = useState<KycFilter>('All');
  const [search, setSearch] = useState('');

  const counts: Record<KycFilter, number> = useMemo(() => {
    return {
      All: submissions.length,
      Pending: submissions.filter((s) => s.status === 'Pending').length,
      Approved: submissions.filter(isApprovedLike).length,
      Rejected: submissions.filter((s) => s.status === 'Rejected').length,
    };
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return submissions
      .filter((s) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Approved') return isApprovedLike(s);
        return s.status === activeFilter;
      })
      .filter(
        (s) =>
          !q ||
          s.userName.toLowerCase().includes(q) ||
          s.userEmail.toLowerCase().includes(q)
      );
  }, [submissions, activeFilter, search]);

  const handleStatusChange = (id: string, status: 'Approved' | 'Rejected', reason?: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, rejectionReason: reason } : s))
    );
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex flex-col gap-1 sm:w-auto">
            <select
              id="kyc-status-filter"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as KycFilter)}
              className="w-auto cursor-pointer appearance-none rounded-full border border-outline/30 bg-white px-3 py-1.5 pr-9 text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25"
              aria-label={t('filterByStatusAriaLabel')}
            >
              <option value="All">
                {t('all')} ({counts.All})
              </option>
              <option value="Pending">
                {t('filterPending')} ({counts.Pending})
              </option>
              <option value="Approved">
                {t('filterApproved')} ({counts.Approved})
              </option>
              <option value="Rejected">
                {t('filterRejected')} ({counts.Rejected})
              </option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/50"
              aria-hidden="true"
            />
          </div>

          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <label htmlFor="kyc-search" className="sr-only">
              {t('searchLabel')}
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/40"
              aria-hidden="true"
            />
            <input
              id="kyc-search"
              type="search"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full cursor-text rounded-full border border-outline/30 bg-white py-2 pl-9 pr-4 text-sm text-on-surface placeholder:text-on-surface/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Status counts moved into the select options */}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface/50">
          <Search className="mx-auto mb-3 h-10 w-10" aria-hidden="true" />
          <p className="text-sm">{t('emptyState')}</p>
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
