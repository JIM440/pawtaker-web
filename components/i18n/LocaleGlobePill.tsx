'use client';

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import type { Locale } from '@/lib/i18n/config';
import { setStoredLocale } from '@/lib/i18n/localeStorage';

interface LocaleGlobePillProps {
  className?: string;
}

export default function LocaleGlobePill({ className }: LocaleGlobePillProps) {
  const t = useTranslations('marketing.landing');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState<Locale>(locale);

  const languageLabels: Record<Locale, string> = {
    en: t('languageEnglish'),
    fr: t('languageFrancais'),
  };

  useEffect(() => {
    setSelected(locale);
    setStoredLocale(locale);
  }, [locale]);

  return (
    <label
      className={`relative flex h-10 w-full max-w-[110px] shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-full pl-4 py-2.5 ${className ?? ''}`}
      aria-label={t('languageLabel')}
    >
      <Globe className="pointer-events-none size-[18px] shrink-0 text-[#e1e2c7]" aria-hidden />
      <span className="pointer-events-none min-w-0 truncate text-sm font-medium leading-5 tracking-[0.1px] text-[#e1e2c7]">
        {languageLabels[selected]}
      </span>
      <select
        value={selected}
        onChange={(e) => {
          const nextLocale = e.target.value as Locale;
          if (nextLocale !== 'en' && nextLocale !== 'fr') return;
          setSelected(nextLocale);
          setStoredLocale(nextLocale);
          router.push(pathname, { locale: nextLocale });
        }}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent opacity-0"
        aria-label={t('languageLabel')}
      >
        <option value="en">{t('languageEnglish')}</option>
        <option value="fr">{t('languageFrancais')}</option>
      </select>
    </label>
  );
}
