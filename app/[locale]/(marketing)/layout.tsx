import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { MarketingNavbar } from '@/components/marketing/Navbar';
import { MarketingScrollToTop } from '@/components/marketing/MarketingScrollToTop';
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
  const isMarketingHome = pathWithoutLocale === '/' || pathWithoutLocale === '';
  const showMarketingChrome = new Set(['/', '/about', '/how-it-works', '/privacy', '/terms']).has(
    pathWithoutLocale
  );

  return (
    <div
      className={`min-h-screen overflow-x-clip ${isMarketingHome ? 'bg-[#f5f0f0]' : 'bg-white'} ${showMarketingChrome && !isMarketingHome ? 'pt-16' : ''}`}
    >
      {showMarketingChrome && !isMarketingHome ? (
        <MarketingNavbar
          downloadLinksDesktop={<StoreDownloadLinks locale={resolvedLocale} variant="navbarDesktop" />}
          downloadLinksMobile={<StoreDownloadLinks locale={resolvedLocale} />}
        />
      ) : null}
      {children}
      {showMarketingChrome ? <MarketingFooter /> : null}
      {showMarketingChrome ? <MarketingScrollToTop /> : null}
    </div>
  );
}

