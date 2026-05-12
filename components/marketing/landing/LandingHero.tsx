'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { StoreLinkAndroidOnPrimary, StoreLinkIos } from '@/components/marketing/landing/StoreButtons';
import LocaleGlobePill from '@/components/i18n/LocaleGlobePill';

/** Drawer panel is full viewport height; inner content uses `pt-[52px]` to match hero nav (same as section `pt-[52px]`, padding not `top` offset). */

/** Drawer: enters from fully off-screen right; slow enough to read the slide */
const DRAWER_MS = 920;
const DRAWER_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function LandingHero() {
  const t = useTranslations('marketing.landing');
  const tNav = useTranslations('marketing.nav');
  const heroTitle = `${t('hero.line1')}${t('hero.line2')}${t('hero.line3')}`.replace(/\s+/g, ' ').trim();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerEntered, setDrawerEntered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const prevDrawerEnteredRef = useRef<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const fn = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      setDrawerEntered(false);
      return;
    }
    if (reduceMotion) {
      setDrawerEntered(true);
      return;
    }
    setDrawerEntered(false);
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setDrawerEntered(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [menuOpen, reduceMotion]);

  useEffect(() => {
    if (!menuOpen) {
      prevDrawerEnteredRef.current = null;
      return;
    }
    const wasEntered = prevDrawerEnteredRef.current;
    if (wasEntered === true && drawerEntered === false) {
      const ms = reduceMotion ? 0 : DRAWER_MS;
      const tId = window.setTimeout(() => setMenuOpen(false), ms);
      return () => window.clearTimeout(tId);
    }
    prevDrawerEnteredRef.current = drawerEntered;
  }, [drawerEntered, menuOpen, reduceMotion]);

  const requestCloseDrawer = useCallback(() => {
    if (!drawerEntered) {
      setMenuOpen(false);
      return;
    }
    setDrawerEntered(false);
  }, [drawerEntered]);

  useEffect(() => {
    if (menuOpen) {
      // Prevent pre-drawer layout shift when scrollbar disappears.
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestCloseDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, requestCloseDrawer]);

  const drawerTranslate =
    reduceMotion || drawerEntered ? 'translate3d(0,0,0)' : 'translate3d(100%,0,0)';
  const drawerTransition = reduceMotion ? 'none' : `transform ${DRAWER_MS}ms ${DRAWER_EASE}`;

  const mobileMenu =
    menuOpen ? (
      <>
        <button
          type="button"
          className={`fixed inset-0 z-100 bg-black/50 motion-reduce:transition-none min-[950px]:hidden ${
            drawerEntered ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          style={{
            transitionProperty: 'opacity',
            transitionDuration: reduceMotion ? '0ms' : `${DRAWER_MS}ms`,
            transitionTimingFunction: DRAWER_EASE,
          }}
          aria-label={tNav('closeMenu')}
          onClick={requestCloseDrawer}
        />
        <div
          id="landing-mobile-menu"
          className="fixed bottom-0 right-0 top-0 z-110 flex w-[min(88vw,360px)] flex-col overflow-y-auto border-l border-[#d5c2c6]/40 bg-[#8c4a60] shadow-2xl min-[950px]:hidden"
          style={{
            transform: drawerTranslate,
            transition: drawerTransition,
            willChange: reduceMotion ? undefined : 'transform',
          }}
          role="dialog"
          aria-modal="true"
          aria-label={tNav('downloadMenu')}
        >
          <div className="flex flex-1 flex-col px-4 pb-8 pt-[52px]">
            <div className="mb-6 flex items-start justify-between gap-3">
              <Link href="/" className="min-w-0 shrink py-1 pr-2" onClick={requestCloseDrawer}>
                <Image
                  src="/logos/yellow-icon.svg"
                  alt={tNav('brand')}
                  width={200}
                  height={51}
                  className="h-auto w-[min(200px,58vw)] max-w-[200px]"
                  unoptimized
                />
              </Link>
              <button
                type="button"
                onClick={requestCloseDrawer}
                className="-ml-1 -mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#e1e2c7] hover:bg-white/10"
                aria-label={tNav('closeMenu')}
              >
                <X className="size-6" aria-hidden />
              </button>
            </div>
            <p className="mb-4 text-sm font-semibold text-[#e1e2c7]">{tNav('downloadMenu')}</p>
            <div className="grid grid-cols-1 gap-3">
              <div role="presentation" onClick={requestCloseDrawer}>
                <StoreLinkIos className="inline-flex h-12 w-full max-w-none items-center justify-center gap-2 rounded-full bg-[#ffd9e2] px-4 py-3 text-sm font-medium text-on-primary-container" />
              </div>
              <div role="presentation" onClick={requestCloseDrawer}>
                <StoreLinkAndroidOnPrimary className="inline-flex min-h-[52px] w-full max-w-none items-center justify-center gap-2 rounded-full border border-[#d5c2c6] border-solid bg-transparent px-4 py-3.5 text-sm font-medium text-[#e1e2c7]" />
              </div>
              <div className="mt-2 border-t border-[#d5c2c6]/40 pt-4">
                <LocaleGlobePill />
              </div>
            </div>
            <p className="text-center mt-auto pt-8 text-sm leading-6 tracking-[-0.2px] text-[#e1e2c7]/85">
              {t('sidebarFooter')}
            </p>
          </div>
        </div>
      </>
    ) : null;

  return (
    <section
      className="flex w-full flex-col bg-[#8c4a60] px-5 pt-[52px] text-[#e1e2c7] sm:px-8 lg:px-10 xl:px-[80px] min-[800px]:min-h-screen"
      aria-labelledby="landing-hero-heading"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col">
        <header className="flex shrink-0 items-start justify-between gap-3 pb-8 sm:items-center min-[800px]:pb-4">
          <Link href="/" className="relative block min-w-0 shrink py-1">
            <Image
              src="/logos/yellow-icon.svg"
              alt={tNav('brand')}
              width={310}
              height={79}
              className="h-auto w-[min(200px,58vw)] max-w-[310px] sm:w-[min(260px,40vw)]"
              unoptimized
            />
          </Link>

          {/* Desktop controls only from 950px+ */}
          <div className="hidden max-w-[min(100%,920px)] flex-1 items-center justify-end gap-2 min-[950px]:flex lg:gap-3">
            <StoreLinkIos className="inline-flex min-h-[48px] w-auto max-w-none shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#ffd9e2] px-4 py-3 text-sm font-medium leading-5 tracking-[-0.2px] text-on-primary-container transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e1e2c7]/40" />
            <StoreLinkAndroidOnPrimary className="inline-flex min-h-[52px] w-auto max-w-none shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#d5c2c6] border-solid bg-transparent px-4 py-3.5 text-sm font-medium leading-5 tracking-[-0.2px] text-[#e1e2c7] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e1e2c7]/35" />
            <LocaleGlobePill />
          </div>

          <div className="flex items-center gap-1 min-[950px]:hidden">
            <LocaleGlobePill />
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#e1e2c7] transition-colors hover:bg-white/10"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="landing-mobile-menu"
              aria-label={tNav('openMenu')}
            >
              <span className="flex w-[22px] flex-col justify-center gap-[5px]" aria-hidden>
                <span className="block h-0.5 w-full shrink-0 rounded-full bg-current" />
                <span className="block h-0.5 w-full shrink-0 rounded-full bg-current" />
                <span className="block h-0.5 w-full shrink-0 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </header>

        {/* Under 800px: 1 col; from 800px: 2 cols + gap; grid flex-1 fills viewport below header on desktop */}
        <div className="grid w-full flex-1 grid-cols-1 gap-10 pb-10 pt-4 min-[800px]:min-h-0 min-[800px]:grid-cols-2 min-[800px]:items-center min-[800px]:gap-8 min-[800px]:pb-10 min-[800px]:pt-4 xl:gap-12">
          <div className="mx-auto flex min-w-0 w-full max-w-xl flex-col items-center gap-6 text-center min-[800px]:mx-0 min-[800px]:max-w-[560px] min-[800px]:items-stretch min-[800px]:text-left xl:max-w-[640px]">
            <h1
              id="landing-hero-heading"
              className="w-full text-center font-wobblite font-bold text-[#e1e2c7] tracking-[-0.5px] min-[800px]:text-left"
            >
              <span className="block w-full text-center text-[clamp(2.5rem,12vw,6.25rem)] leading-[0.8] min-[800px]:text-left xl:text-[100px] xl:leading-[80px]">
                {heroTitle}
              </span>
            </h1>
            <div className="mx-auto w-full max-w-[540px] text-center text-[18px] font-normal leading-6 tracking-[-0.25px] text-[#e1e2c7] min-[800px]:mx-0 min-[800px]:max-w-none min-[800px]:text-left">
              <p className="mb-0">{t('hero.subA')}</p>
              <p className="mt-1">{t('hero.subB')}</p>
            </div>
            <div className="mx-auto inline-grid w-auto max-w-[688px] grid-cols-1 gap-2 sm:grid sm:w-full sm:grid-cols-2 sm:gap-2 min-[800px]:mx-0 min-[800px]:max-w-none">
              <StoreLinkIos gridCell gridMode="hero" />
              <StoreLinkAndroidOnPrimary gridCell gridMode="hero" />
            </div>
          </div>

          <div className="flex min-w-0 w-full flex-col items-center justify-center min-[800px]:h-full min-[800px]:items-center min-[800px]:justify-end">
            <Image
              src="/images/hero-img.svg"
              alt={t('hero.imageAlt')}
              width={562}
              height={654}
              priority
              fetchPriority="high"
              className="animate-float-y-slow h-auto w-full max-w-[min(100%,562px)] object-contain object-right min-[800px]:h-full min-[800px]:max-w-none"
              sizes="(max-width: 799px) 100vw, (max-width: 1440px) 45vw, 562px"
            />
          </div>
        </div>
      </div>

      {mobileMenu ? createPortal(mobileMenu, document.body) : null}
    </section>
  );
}
