'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { StoreLinkAndroidOnPrimary, StoreLinkIos } from '@/components/marketing/landing/StoreButtons';
import LocaleGlobePill from '@/components/i18n/LocaleGlobePill';

const DRAWER_MS = 920;
const DRAWER_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function LandingNavbar() {
  const t = useTranslations('marketing.nav');
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerEntered, setDrawerEntered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const lastScrollYRef = useRef(0);
  const scrollDeltaRef = useRef(0);
  const prevDrawerEnteredRef = useRef<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handleChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

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
        if (!cancelled) {
          setDrawerEntered(true);
        }
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
      const timeout = window.setTimeout(() => setMenuOpen(false), reduceMotion ? 0 : DRAWER_MS);
      return () => window.clearTimeout(timeout);
    }

    prevDrawerEnteredRef.current = drawerEntered;
  }, [drawerEntered, menuOpen, reduceMotion]);

  useEffect(() => {
    const HIDE_AFTER_SCROLL = 140;
    const PIN_AFTER_SCROLL = 56;
    const SHOW_THRESHOLD = 28;
    const HIDE_THRESHOLD = 72;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;
      const delta = currentScrollY - previousScrollY;
      const nearTop = currentScrollY <= PIN_AFTER_SCROLL;

      if (Math.abs(delta) < 2) {
        return;
      }

      setIsPinned(currentScrollY > PIN_AFTER_SCROLL);

      if (nearTop || menuOpen) {
        setIsVisible(true);
        scrollDeltaRef.current = 0;
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const directionChanged =
        (delta > 0 && scrollDeltaRef.current < 0) || (delta < 0 && scrollDeltaRef.current > 0);

      if (directionChanged) {
        scrollDeltaRef.current = 0;
      }

      scrollDeltaRef.current += delta;

      if (scrollDeltaRef.current <= -SHOW_THRESHOLD) {
        setIsVisible(true);
        scrollDeltaRef.current = 0;
      } else if (
        scrollDeltaRef.current >= HIDE_THRESHOLD &&
        currentScrollY > HIDE_AFTER_SCROLL
      ) {
        setIsVisible(false);
        scrollDeltaRef.current = 0;
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuOpen]);

  function requestCloseDrawer() {
    if (!drawerEntered) {
      setMenuOpen(false);
      return;
    }

    setDrawerEntered(false);
  }

  const drawerTranslate =
    reduceMotion || drawerEntered ? 'translate3d(0,0,0)' : 'translate3d(100%,0,0)';
  const drawerTransition = reduceMotion ? 'none' : `transform ${DRAWER_MS}ms ${DRAWER_EASE}`;

  return (
    <>
      <div className="relative z-50 h-[108px] bg-[#8c4a60] sm:h-[116px]">
        <header
          className={`w-full px-5 text-[#e1e2c7] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-8 lg:px-10 xl:px-[80px] ${
            isPinned ? 'fixed left-0 right-0 top-0 bg-[#8c4a60]/96 backdrop-blur-sm' : 'relative bg-[#8c4a60]'
          } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
        >
          <div className="mx-auto flex w-full max-w-[1440px] items-start justify-between gap-3 py-8 sm:items-center">
            <Link href="/" className="relative block min-w-0 shrink py-1">
              <Image
                src="/logos/yellow-icon.svg"
                alt={t('brand')}
                width={310}
                height={79}
                className="h-auto w-[min(200px,58vw)] max-w-[310px] sm:w-[min(260px,40vw)]"
                unoptimized
              />
            </Link>

            <div className="hidden max-w-[min(100%,920px)] flex-1 items-center justify-end gap-2 min-[950px]:flex lg:gap-3">
              <StoreLinkIos className="inline-flex min-h-[48px] w-auto max-w-none shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#ffd9e2] px-4 py-3 text-sm font-medium leading-5 tracking-[-0.2px] text-on-primary-container transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e1e2c7]/40" />
              <StoreLinkAndroidOnPrimary className="inline-flex min-h-[52px] w-auto max-w-none shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#d5c2c6] border-solid bg-transparent px-4 py-3.5 text-sm font-medium leading-5 tracking-[-0.2px] text-[#e1e2c7] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e1e2c7]/35" />
              <LocaleGlobePill />
            </div>

            <div className="flex items-center gap-0 min-[950px]:hidden">
              <LocaleGlobePill />
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#e1e2c7] transition-colors hover:bg-white/10"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="legal-mobile-menu"
                aria-label={t('openMenu')}
              >
                <span className="flex w-[22px] flex-col justify-center gap-[5px]" aria-hidden>
                  <span className="block h-0.5 w-full shrink-0 rounded-full bg-current" />
                  <span className="block h-0.5 w-full shrink-0 rounded-full bg-current" />
                  <span className="block h-0.5 w-full shrink-0 rounded-full bg-current" />
                </span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className={`fixed inset-0 z-100 bg-black/40 min-[950px]:hidden ${
              drawerEntered ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            style={{
              transitionProperty: 'opacity',
              transitionDuration: reduceMotion ? '0ms' : `${DRAWER_MS}ms`,
              transitionTimingFunction: DRAWER_EASE,
            }}
            aria-label={t('closeMenu')}
            onClick={requestCloseDrawer}
          />
          <div
            id="legal-mobile-menu"
            className="fixed bottom-0 right-0 top-0 z-110 flex w-[80vw] min-w-[200px] flex-col overflow-y-auto border-l border-[#d5c2c6]/40 bg-[#8c4a60] shadow-2xl min-[950px]:hidden"
            style={{
              transform: drawerTranslate,
              transition: drawerTransition,
              willChange: reduceMotion ? undefined : 'transform',
            }}
            role="dialog"
            aria-modal="true"
            aria-label={t('downloadMenu')}
          >
            <div className="relative flex min-h-0 flex-1 flex-col">
              <button
                type="button"
                onClick={requestCloseDrawer}
                className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#e1e2c7] transition-colors hover:bg-white/10"
                aria-label={t('closeMenu')}
              >
                <X className="size-6" aria-hidden />
              </button>
              <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-16">
                <p className="pr-12 text-sm font-semibold text-[#e1e2c7]">{t('downloadMenu')}</p>
                <div className="border-b border-[#d5c2c6]/30 pb-4">
                  <LocaleGlobePill />
                </div>
                <div className="flex flex-col gap-3" onClick={requestCloseDrawer} role="presentation">
                  <StoreLinkIos className="inline-flex h-12 w-full max-w-none items-center justify-center gap-2 rounded-full bg-[#ffd9e2] px-4 py-3 text-sm font-medium text-on-primary-container" />
                  <StoreLinkAndroidOnPrimary className="inline-flex min-h-[52px] w-full max-w-none items-center justify-center gap-2 rounded-full border border-[#d5c2c6] border-solid bg-transparent px-4 py-3.5 text-sm font-medium text-[#e1e2c7]" />
                </div>
                <p className="mt-auto pt-4 text-center text-sm leading-6 tracking-[-0.2px] text-[#e1e2c7]/85">
                  Start sharing the joy of pet care with your neighbours today. It takes less than 2 minutes to
                  get started.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
