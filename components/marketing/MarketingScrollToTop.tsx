'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SCROLL_THRESHOLD_PX = 480;

/**
 * FAB: after scrolling past {@link SCROLL_THRESHOLD_PX}, jump back to top of the page.
 * Uses design tokens: `bg-primary` + `text-on-primary`.
 */
export function MarketingScrollToTop() {
  const t = useTranslations('marketing');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'instant' });
      }}
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg shadow-primary/25 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 sm:bottom-8 sm:right-8"
      aria-label={t('scrollToTop')}
    >
      <ChevronUp className="size-6 shrink-0" aria-hidden />
    </button>
  );
}
