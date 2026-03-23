import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { MarketingNavbar } from '@/components/marketing/Navbar';
import StoreDownloadLinks from '@/components/marketing/StoreDownloadLinks';
import { MarketingFooter } from '@/components/marketing/Footer';
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
  const pathname = (await headers()).get('x-pathname') ?? '';
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/';
  const showMarketingChrome = new Set(['/', '/about', '/how-it-works', '/privacy', '/terms']).has(
    pathWithoutLocale
  );

  return (
    <div className={`min-h-screen bg-white ${showMarketingChrome ? 'pt-16' : ''}`}>
      {showMarketingChrome ? (
        <MarketingNavbar
          downloadLinksDesktop={<StoreDownloadLinks locale={resolvedLocale} />}
          downloadLinksMobile={<StoreDownloadLinks locale={resolvedLocale} />}
        />
      ) : null}
      {children}
      {showMarketingChrome ? <MarketingFooter /> : null}
    </div>
  );
}

