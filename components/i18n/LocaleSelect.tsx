'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import type { Locale } from '@/lib/i18n/config';
import { getStoredLocale, setStoredLocale } from '@/lib/i18n/localeStorage';
import { useTranslations } from 'next-intl';

interface LocaleSelectProps {
  locale: Locale;
  className?: string;
}

const LOCALES: Locale[] = ['en', 'fr'];

export default function LocaleSelect({ locale, className }: LocaleSelectProps) {
  const t = useTranslations('ui.localeSelect');
  const router = useRouter();
  const pathname = usePathname();

  const [selected, setSelected] = useState<Locale>(locale);

  // Keep the UI in sync with the user's saved preference.
  useEffect(() => {
    const storedLocale = getStoredLocale();
    if (!storedLocale) return;
    if (storedLocale === locale) {
      setSelected(locale);
      return;
    }

    setSelected(storedLocale);
    router.push(pathname, { locale: storedLocale });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, pathname]);

  return (
    <div className={`relative ${className ?? ''}`}>
      <select
        value={selected}
        onChange={(e) => {
          const nextLocale = e.target.value as Locale;
          if (!LOCALES.includes(nextLocale)) return;

          setSelected(nextLocale);
          setStoredLocale(nextLocale);
          router.push(pathname, { locale: nextLocale });
        }}
        className="cursor-pointer appearance-none rounded-full border border-outline/30 bg-background-base px-3 py-1.5 pr-8 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25"
        aria-label={t('ariaLabel')}
      >
        <option value="en">{t('en')}</option>
        <option value="fr">{t('fr')}</option>
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/50"
        aria-hidden="true"
      />
    </div>
  );
}

