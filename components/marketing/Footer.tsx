import Image from 'next/image';
import { Mail, MapPin } from 'lucide-react';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';

function footerLinkClass(pathWithoutLocale: string, href: string, isHash = false) {
  if (isHash) {
    return 'inline-block max-w-full rounded-full px-2 py-1 text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary';
  }
  const active =
    href === '/'
      ? pathWithoutLocale === '/' || pathWithoutLocale === ''
      : pathWithoutLocale === href || pathWithoutLocale.startsWith(`${href}/`);
  return [
    'inline-block max-w-full rounded-full px-3 py-1 text-sm font-medium transition-colors',
    active
      ? 'bg-primary/10 text-primary shadow-sm'
      : 'text-slate-700 hover:bg-primary/5 hover:text-primary',
  ].join(' ');
}

export async function MarketingFooter() {
  const t = await getTranslations('marketing.footer');
  const year = new Date().getFullYear();
  const pathname = (await headers()).get('x-pathname') ?? '';
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || pathname;

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 rounded-sm';

  return (
    <footer className="overflow-x-clip border-t border-slate-200 bg-slate-50 px-4 py-14 text-slate-900 sm:px-6 lg:px-16">
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
        <div className="min-w-0 md:col-span-4">
          <div className="mb-5">
            <Image
              src="/logos/primary-logo.png"
              alt={t('brand')}
              width={280}
              height={84}
              className="h-auto w-[220px] max-w-full shrink-0 sm:w-[260px]"
            />
          </div>
          <p className="max-w-sm break-words text-sm leading-relaxed text-slate-600">{t('description')}</p>
        </div>

        <div className="min-w-0 md:col-span-3">
          <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('platformTitle')}
          </h5>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/how-it-works"
                className={`${footerLinkClass(pathWithoutLocale, '/how-it-works')} ${focusRing}`}
              >
                {t('platformHowItWorks')}
              </Link>
            </li>
            <li>
              <Link href="/about" className={`${footerLinkClass(pathWithoutLocale, '/about')} ${focusRing}`}>
                {t('platformSafetyMeasures')}
              </Link>
            </li>
            <li>
              <Link href="/about" className={`${footerLinkClass(pathWithoutLocale, '/about')} ${focusRing}`}>
                {t('platformCommunityPoints')}
              </Link>
            </li>
          </ul>
        </div>

        <div className="min-w-0 md:col-span-3">
          <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('companyTitle')}
          </h5>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/about" className={`${footerLinkClass(pathWithoutLocale, '/about')} ${focusRing}`}>
                {t('companyOurStory')}
              </Link>
            </li>
            <li>
              <a href="#" className={`${footerLinkClass(pathWithoutLocale, '#', true)} ${focusRing}`}>
                {t('companyCareers')}
              </a>
            </li>
            <li>
              <Link
                href="/privacy"
                className={`${footerLinkClass(pathWithoutLocale, '/privacy')} ${focusRing}`}
              >
                {t('privacyPolicy')}
              </Link>
            </li>
            <li>
              <Link href="/terms" className={`${footerLinkClass(pathWithoutLocale, '/terms')} ${focusRing}`}>
                {t('termsOfService')}
              </Link>
            </li>
          </ul>
        </div>

        <div className="min-w-0 md:col-span-2">
          <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('contactTitle')}
          </h5>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a
                href={`mailto:${t('contactEmail')}`}
                className={`max-w-full break-all text-slate-700 transition-colors hover:text-primary ${focusRing}`}
              >
                {t('contactEmail')}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="break-words text-slate-600">{t('contactLocation')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1300px] border-t border-slate-200 pt-8 text-center text-xs text-slate-500">
        {t('copyrightLine', { year })}
      </div>
    </footer>
  );
}
