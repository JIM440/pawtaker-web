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
  const requestHeaders = await headers();
  const pathnameHeader = requestHeaders.get('x-pathname') ?? requestHeaders.get('next-url') ?? '';
  const parsedPathname = pathnameHeader.startsWith('http')
    ? new URL(pathnameHeader).pathname
    : pathnameHeader;
  const pathWithoutLocale = parsedPathname.replace(/^\/(en|fr)/, '') || '/';
  const isMarketingHome = pathWithoutLocale === '/' || pathWithoutLocale === '';
  const showMarketingChrome = new Set(['/', '/about', '/how-it-works', '/privacy', '/terms', '/articles']).has(pathWithoutLocale);
  const useLandingNavbarOnPage = new Set(['/privacy', '/terms', '/articles']).has(pathWithoutLocale);

  return (
    <div
      className={`min-h-screen overflow-x-clip ${isMarketingHome ? 'bg-[#f5f0f0]' : 'bg-white'} ${showMarketingChrome && !isMarketingHome && !useLandingNavbarOnPage ? 'pt-16' : ''}`}
    >
      {showMarketingChrome && !isMarketingHome && !useLandingNavbarOnPage ? (
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

