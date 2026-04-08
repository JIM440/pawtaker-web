import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { externalLinkProps, getAppStoreUrls } from '@/lib/app-store-urls';

/** Figma footer: body/large & body/large-emphasized — 16px, tracking -0.2px, #665459 */
const headingClass =
  'pb-4 text-base font-bold leading-[18px] tracking-[-0.2px] text-[#665459]';

const linkClass =
  'inline-block max-w-full text-left text-base font-normal leading-6 tracking-[-0.2px] text-[#665459] transition-colors hover:text-[#8c4a60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c4a60]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f0f0] rounded-sm';

export async function MarketingFooter() {
  const t = await getTranslations('marketing.footer');
  const { ios: iosUrl, android: androidUrl } = getAppStoreUrls();

  return (
    <footer
      className="w-full border-t border-solid border-[#d5c2c6] bg-[#f5f0f0]"
      data-name="Footer"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16 xl:px-[80px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {/* Logo — full width on small screens, bounded on large */}
          <div className="shrink-0 lg:max-w-[min(100%,389px)]" data-name="Title">
            <Link
              href="/"
              className="block w-full max-w-[389px] rounded-sm sm:max-w-[320px]"
            >
              <Image
                src="/logos/primary-logo.svg"
                alt={t('brand')}
                width={389}
                height={98}
                className="h-auto w-full max-h-[72px] object-contain object-left sm:max-h-[88px] lg:max-h-[98px] lg:object-left"
              />
            </Link>
          </div>

          {/* Link columns — 1 col mobile, 2 cols tablet, 3 cols desktop */}
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-3 lg:gap-8 xl:max-w-[900px] xl:gap-10">
          <nav
            className="flex min-w-0 flex-col gap-3"
            aria-label={t('theAppTitle')}
            data-name="Text Link List"
          >
            <h2 className={headingClass}>{t('theAppTitle')}</h2>
            <ul className="flex flex-col gap-3">
              <li>
                <a href={iosUrl} {...externalLinkProps(iosUrl)} className={linkClass}>
                  {t('linkAppStore')}
                </a>
              </li>
              <li>
                <a href={androidUrl} {...externalLinkProps(androidUrl)} className={linkClass}>
                  {t('linkPlayStore')}
                </a>
              </li>
              <li>
                <a href="/articles" className={linkClass}>
                  {t('linkArticles')}
                </a>
              </li>
              <li>
                <Link href="/#why-pawtaker" className={linkClass}>
                  {t('linkWhyPawtaker')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav
            className="flex min-w-0 flex-col gap-3"
            aria-label={t('legalTitle')}
            data-name="Text Link List"
          >
            <h2 className={headingClass}>{t('legalTitle')}</h2>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/privacy" className={linkClass}>
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className={linkClass}>
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </nav>

          <div
            className="flex min-w-0 flex-col gap-3 sm:col-span-2 lg:col-span-1"
            data-name="Text Link List"
          >
            <h2 className={headingClass}>{t('contactTitle')}</h2>
            <ul className="flex flex-col gap-3">
              <li>
                <a href={`mailto:${t('contactEmail')}`} className={`${linkClass} break-all`}>
                  {t('contactEmail')}
                </a>
              </li>
            </ul>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
