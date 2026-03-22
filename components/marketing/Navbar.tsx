'use client';

import Image from 'next/image';
import { Apple, Menu, PlayCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import LocaleSelect from '@/components/i18n/LocaleSelect';
import { externalLinkProps, getAppStoreUrls } from '@/lib/app-store-urls';

export function MarketingNavbar() {
  const locale = useLocale();
  const t = useTranslations('marketing');
  const tLanding = useTranslations('marketing.landing');
  const { ios: iosUrl, android: androidUrl } = getAppStoreUrls();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const downloadBtnPrimaryContainerClass =
    'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-transparent bg-primary-container px-3 py-2.5 text-sm font-bold text-on-primary-container transition-colors hover:bg-primary-container/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:min-h-[40px] md:w-auto md:min-w-[140px] md:text-xs';

  const downloadBtnOutlineClass =
    'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-3 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:min-h-[40px] md:w-auto md:min-w-[140px] md:text-xs';

  const DownloadLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <a
        href={iosUrl}
        {...externalLinkProps(iosUrl)}
        className={downloadBtnPrimaryContainerClass}
        onClick={onNavigate}
      >
        <Apple className="size-4 shrink-0" aria-hidden />
        <span>{tLanding('cta.downloadIos')}</span>
      </a>
      <a
        href={androidUrl}
        {...externalLinkProps(androidUrl)}
        className={downloadBtnOutlineClass}
        onClick={onNavigate}
      >
        <PlayCircle className="size-4 shrink-0" aria-hidden />
        <span>{tLanding('cta.downloadAndroid')}</span>
      </a>
    </>
  );

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#837377]/20 bg-white/80 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-[1300px] items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex min-w-0 shrink items-center gap-2">
            <Image
              src="/logos/primary-logo.png"
              alt={t('nav.brand')}
              width={200}
              height={56}
              className="h-9 w-auto sm:h-11"
              priority
            />
          </Link>

          {/* Desktop: download buttons + language */}
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <DownloadLinks />
            <LocaleSelect locale={locale as 'en' | 'fr'} />
          </div>

          {/* Mobile: hamburger */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
              aria-expanded={menuOpen}
              aria-controls="marketing-mobile-menu"
              aria-label={t('nav.openMenu')}
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu: rendered outside header so position:fixed is viewport-relative (header backdrop-filter would trap fixed children) */}
      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            aria-label={t('nav.closeMenu')}
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="marketing-mobile-menu"
            className="fixed bottom-0 right-0 top-0 z-60 flex w-[80vw] h-screen min-w-[200px] flex-col overflow-y-auto border-l border-slate-200 bg-white px-4 py-6 shadow-2xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.downloadMenu')}
          >
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="flex shrink-0 items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  {t('nav.downloadMenu')}
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                  aria-label={t('nav.closeMenu')}
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <div className="flex flex-1 flex-col justify-start gap-3">
                <DownloadLinks onNavigate={() => setMenuOpen(false)} />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
