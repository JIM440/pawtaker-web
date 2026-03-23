import { Apple, PlayCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { externalLinkProps, getAppStoreUrls } from '@/lib/app-store-urls';
import type { Locale } from '@/lib/i18n/config';

const DOWNLOAD_PRIMARY =
  'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-transparent bg-primary-container px-3 py-2.5 text-sm font-bold text-on-primary-container transition-colors hover:bg-primary-container/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:min-h-[40px] md:w-auto md:min-w-[140px] md:text-xs';

const DOWNLOAD_OUTLINE =
  'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-3 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:min-h-[40px] md:w-auto md:min-w-[140px] md:text-xs';

/**
 * Server-rendered store CTAs so copy matches SSR and hydration (avoids client string prop mismatches).
 */
export default async function StoreDownloadLinks({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'marketing.landing' });
  const { ios: iosUrl, android: androidUrl } = getAppStoreUrls();

  return (
    <>
      <a
        href={iosUrl}
        {...externalLinkProps(iosUrl)}
        className={DOWNLOAD_PRIMARY}
      >
        <Apple className="size-4 shrink-0" aria-hidden />
        {t('cta.downloadIos')}
      </a>
      <a
        href={androidUrl}
        {...externalLinkProps(androidUrl)}
        className={DOWNLOAD_OUTLINE}
      >
        <PlayCircle className="size-4 shrink-0" aria-hidden />
        {t('cta.downloadAndroid')}
      </a>
    </>
  );
}
