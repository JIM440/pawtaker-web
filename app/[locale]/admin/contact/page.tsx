'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ContactInquiryCard, {
  type ContactInquiry,
} from '@/components/admin/ContactInquiryCard';

const MOCK_INQUIRIES: ContactInquiry[] = [
  {
    id: '1',
    name: 'Udo Ryna',
    email: 'udo@example.com',
    location: 'Kumba, Cameroon',
    date: '2025-12-23T12:00:00.000Z',
    initials: 'UR',
    imageUrl: 'https://picsum.photos/seed/contact-1/80',
    source: 'app',
    message:
      'I thank God for helping me succeed with my first booking. The sitter was kind and sent photos every day.',
  },
  {
    id: '2',
    name: 'Marie Dubois',
    email: 'marie.d@example.com',
    location: 'Lyon, France',
    date: '2026-01-04T10:30:00.000Z',
    initials: 'MD',
    imageUrl: 'https://picsum.photos/seed/contact-2/80',
    source: 'website',
    message:
      'Question about verification: how long does KYC usually take? I uploaded my documents yesterday.',
  },
  {
    id: '3',
    name: 'James Okon',
    email: 'j.okon@example.com',
    location: 'Douala, Cameroon',
    date: '2026-01-12T08:00:00.000Z',
    initials: 'JO',
    imageUrl: 'https://picsum.photos/seed/contact-3/80',
    source: 'website',
    message:
      'Please delete my account and all associated data under GDPR. I no longer use the service.',
  },
];

export default function ContactPage() {
  const t = useTranslations('admin.contact');
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(MOCK_INQUIRIES);

  const handleDelete = (id: string) => {
    setInquiries((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="p-6 md:p-8">
      {inquiries.length === 0 ? (
        <div className="mb-10 rounded-2xl border border-dashed border-outline/30 bg-surface-container-lowest/80 px-6 py-16 text-center text-sm text-on-surface/55">
          {t('emptyState')}
        </div>
      ) : (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {inquiries.map((inquiry) => (
            <ContactInquiryCard key={inquiry.id} inquiry={inquiry} onDelete={handleDelete} />
          ))}
        </div>
      )}

    </div>
  );
}
