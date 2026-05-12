'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import LocaleSelect from '@/components/i18n/LocaleSelect';

/**
 * `downloadLinksDesktop` / `downloadLinksMobile` are server-rendered `<StoreDownloadLinks />`
 * passed from the marketing layout so CTA text is not hydrated via client string props.
 */
export interface MarketingNavbarProps {
  downloadLinksDesktop: ReactNode;
  downloadLinksMobile: ReactNode;
}

export function MarketingNavbar({ downloadLinksDesktop, downloadLinksMobile }: MarketingNavbarProps) {
  const t = useTranslations('marketing');
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

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#837377]/20 bg-white/80 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-[1300px] items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex min-w-0 shrink items-center gap-2">
            <Image
              src="/logos/primary-logo.svg"
              alt={t('nav.brand')}
              width={200}
              height={56}
              className="h-9 w-auto sm:h-11"
              priority
            />
          </Link>

          {/* Desktop: download buttons + language */}
          <div className="hidden shrink-0 items-center gap-3 min-[950px]:flex">
            {downloadLinksDesktop}
            <LocaleSelect />
          </div>

          {/* Under 950px: language selector stays outside sidebar + menu button */}
          <div className="flex items-center min-[950px]:hidden">
            <LocaleSelect
              className="shrink-0"
              selectClassName="w-[100px] max-w-[100px] cursor-pointer appearance-none rounded-full border border-outline/30 bg-background-base px-3 pr-0 py-1.5 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25"
              labelClassName="w-[100px] pr-0"
            />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
              aria-expanded={menuOpen}
              aria-controls="marketing-mobile-menu"
              aria-label={t('nav.openMenu')}
            >
              <span className="flex w-[22px] flex-col justify-center gap-[5px]" aria-hidden>
                <span className="block h-0.5 w-full shrink-0 rounded-full bg-current" />
                <span className="block h-0.5 w-full shrink-0 rounded-full bg-current" />
                <span className="block h-0.5 w-full shrink-0 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu: outside header (viewport fixed). z above header (z-50) so hamburger sits behind overlay + drawer. */}
      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-100 bg-black/40 min-[950px]:hidden"
            aria-label={t('nav.closeMenu')}
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="marketing-mobile-menu"
            className="fixed bottom-0 right-0 top-0 z-110 flex w-[80vw] min-w-[200px] flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl min-[950px]:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.downloadMenu')}
          >
            <div className="relative flex min-h-0 flex-1 flex-col">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
                aria-label={t('nav.closeMenu')}
              >
                <X className="size-6" aria-hidden />
              </button>
              <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-16">
                <p className="pr-12 text-sm font-semibold text-slate-900">{t('nav.downloadMenu')}</p>
                <div
                  className="flex flex-col gap-3"
                  onClick={() => setMenuOpen(false)}
                  role="presentation"
                >
                  {downloadLinksMobile}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
