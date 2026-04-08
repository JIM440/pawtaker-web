import { MarketingLandingPage } from '@/components/marketing/landing/MarketingLandingPage';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = locale === 'fr' || locale === 'en' ? locale : 'en';

  return <MarketingLandingPage locale={resolvedLocale} />;
}
