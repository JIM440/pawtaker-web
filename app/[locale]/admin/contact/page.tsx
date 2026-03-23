'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import ContactInquiryCard, {
  type ContactInquiry,
  type ContactMessageSource,
} from '@/components/admin/ContactInquiryCard';

type SourceFilter = 'all' | ContactMessageSource;

const MOCK_INQUIRIES: ContactInquiry[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie.martin@gmail.com',
    location: 'Paris, France',
    date: '2026-02-14T09:24:00.000Z',
    initials: 'SM',
    imageUrl: 'https://picsum.photos/seed/pet-1/80',
    source: 'app',
    message:
      'Hi! I just completed my first booking and everything went perfectly. The sitter sent daily updates and photos of my dog Max. Really happy with the experience!',
  },
  {
    id: '2',
    name: 'Daniel Ngoma',
    email: 'daniel.ngoma@yahoo.com',
    location: 'Douala, Cameroon',
    date: '2026-02-16T14:10:00.000Z',
    initials: 'DN',
    imageUrl: 'https://picsum.photos/seed/pet-2/80',
    source: 'website',
    message:
      'Hello, I submitted my ID for verification yesterday but my profile still shows as unverified. How long does the KYC process usually take?',
  },
  {
    id: '3',
    name: 'Emma Johnson',
    email: 'emma.johnson@outlook.com',
    location: 'London, UK',
    date: '2026-02-18T18:45:00.000Z',
    initials: 'EJ',
    imageUrl: 'https://picsum.photos/seed/pet-3/80',
    source: 'app',
    message:
      'I need to cancel my upcoming booking due to a family emergency. Will I get a full refund if I cancel now?',
  },
  {
    id: '4',
    name: 'Karim Benali',
    email: 'karim.benali@gmail.com',
    location: 'Marseille, France',
    date: '2026-02-19T11:20:00.000Z',
    initials: 'KB',
    imageUrl: 'https://picsum.photos/seed/pet-4/80',
    source: 'website',
    message:
      'There seems to be an issue with payments. My card was charged twice for the same booking. Can you please check and refund the duplicate transaction?',
  },
  {
    id: '5',
    name: 'Laura Schmidt',
    email: 'laura.schmidt@mail.com',
    location: 'Berlin, Germany',
    date: '2026-02-20T07:55:00.000Z',
    initials: 'LS',
    imageUrl: 'https://picsum.photos/seed/pet-5/80',
    source: 'app',
    message:
      'I love the app so far! It would be great if you could add a feature to track walks in real time. That would make me feel even more comfortable.',
  },
  {
    id: '6',
    name: 'James Okafor',
    email: 'james.okafor@gmail.com',
    location: 'Lagos, Nigeria',
    date: '2026-02-21T16:30:00.000Z',
    initials: 'JO',
    imageUrl: 'https://picsum.photos/seed/pet-6/80',
    source: 'website',
    message:
      'Please delete my account and all associated personal data. I no longer wish to use the service. This request is made under GDPR.',
  },
  {
    id: '7',
    name: 'Isabella Rossi',
    email: 'isabella.rossi@gmail.com',
    location: 'Milan, Italy',
    date: '2026-02-22T13:05:00.000Z',
    initials: 'IR',
    imageUrl: 'https://picsum.photos/seed/pet-7/80',
    source: 'app',
    message:
      'Can I book the same sitter for recurring weekly visits? I have a busy schedule and would prefer to keep the same person.',
  },
];

export default function ContactPage() {
  const t = useTranslations('admin.contact');
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(MOCK_INQUIRIES);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const displayInquiries = useMemo(() => {
    let list =
      sourceFilter === 'all' ? [...inquiries] : inquiries.filter((q) => q.source === sourceFilter);
    list.sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    });
    return list;
  }, [inquiries, sourceFilter, sortOrder]);

  const handleDelete = (id: string) => {
    setInquiries((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="p-6 md:p-8">
      {inquiries.length > 0 ? (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2 sm:min-w-[200px]">
            <label htmlFor="contact-filter" className="text-xs font-semibold uppercase tracking-wide text-on-surface/55">
              {t('filterLabel')}
            </label>
            <select
              id="contact-filter"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
              className="cursor-pointer rounded-xl border border-outline/30 bg-white px-4 py-2.5 text-sm font-medium text-on-surface shadow-sm outline-none ring-primary/20 focus-visible:ring-2"
            >
              <option value="all">{t('filterAll')}</option>
              <option value="website">{t('filterWeb')}</option>
              <option value="app">{t('filterMobile')}</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 sm:min-w-[200px]">
            <label htmlFor="contact-sort" className="text-xs font-semibold uppercase tracking-wide text-on-surface/55">
              {t('sortLabel')}
            </label>
            <select
              id="contact-sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="cursor-pointer rounded-xl border border-outline/30 bg-white px-4 py-2.5 text-sm font-medium text-on-surface shadow-sm outline-none ring-primary/20 focus-visible:ring-2"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="oldest">{t('sortOldest')}</option>
            </select>
          </div>
        </div>
      ) : null}

      {inquiries.length === 0 ? (
        <div className="mb-10 rounded-2xl border border-dashed border-outline/30 bg-surface-container-lowest/80 px-6 py-16 text-center text-sm text-on-surface/55">
          {t('emptyState')}
        </div>
      ) : displayInquiries.length === 0 ? (
        <div className="mb-10 rounded-2xl border border-dashed border-outline/30 bg-surface-container-lowest/80 px-6 py-16 text-center text-sm text-on-surface/55">
          {t('emptyFiltered')}
        </div>
      ) : (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayInquiries.map((inquiry) => (
            <ContactInquiryCard key={inquiry.id} inquiry={inquiry} onDelete={handleDelete} />
          ))}
        </div>
      )}
     </div>
  );
}
