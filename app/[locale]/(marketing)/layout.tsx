import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing/Navbar';
import { MarketingFooter } from '@/components/marketing/Footer';
import LocaleSync from '@/components/i18n/LocaleSync';
import type { Locale } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'PawTaker — Community Pet Care',
  description:
    'Community-driven, points-based pet sitting. Earn and spend trust instead of money.',
};

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // Next.js types `params.locale` as a plain string.
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale: Locale = locale === 'fr' || locale === 'en' ? locale : 'en';

  return (
    <div className="min-h-screen bg-white pt-16">
      <MarketingNavbar />
      <LocaleSync currentLocale={resolvedLocale} />
      {children}
      <MarketingFooter />
    </div>
  );
}

