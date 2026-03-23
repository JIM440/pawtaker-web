import Image from 'next/image';
import { Home } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('ui.notFound');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-base px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-outline/20 bg-white p-8 text-center shadow-xl shadow-primary/10 ring-1 ring-outline/10">
        <div className="mx-auto mb-5 flex items-center justify-center">
          <Image
            src="/logos/primary-logo.png"
            alt="PawTaker"
            width={260}
            height={78}
            className="h-auto w-[220px] object-contain sm:w-[260px]"
          />
        </div>
        <p className="font-wobblite text-5xl font-bold leading-none text-primary">404</p>
        <h1 className="mt-4 text-xl font-bold tracking-tight text-on-surface">{t('title')}</h1>
        <p className="mt-2 text-sm leading-relaxed text-on-surface/70">{t('description')}</p>
        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-md shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Home className="h-4 w-4 shrink-0" aria-hidden />
          {t('backHome')}
        </Link>
      </div>
    </div>
  );
}
