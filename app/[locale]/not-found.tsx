import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { LandingNavbar } from '@/components/marketing/landing/LandingNavbar';
import { MarketingFooter } from '@/components/marketing/Footer';

export default async function NotFound() {
  const t = await getTranslations('ui.notFound');

  return (
    <div className="min-h-screen bg-[#f5f0f0]">
      <LandingNavbar />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-5 pb-12 pt-36 font-sans text-on-surface sm:px-8">
        <div className="w-full max-w-[420px] text-center">
          <div className="mx-auto mb-5 flex items-center justify-center">
            <Image
              src="/images/error-try-again.svg"
              alt={t('imageAlt')}
              width={170}
              height={170}
              className="h-auto w-[170px]"
            />
          </div>
          <h1 className="font-wobblite text-7xl font-bold leading-none text-primary">404</h1>
          <p className="mt-1 text-sm text-on-surface/70">{t('description')}</p>
          <Link
            href="/"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-outline/30 bg-transparent px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
          >
            {t('backHome')}
          </Link>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
