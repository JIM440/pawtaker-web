'use client';

import { useEffect, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import type { Locale } from '@/lib/i18n/config';
import { setStoredLocale } from '@/lib/i18n/localeStorage';

interface LocaleSelectProps {
  className?: string;
  /** Show translated “Language” label above the select (mobile menus, forms). */
  showLabel?: boolean;
  labelClassName?: string;
  /** Override default select class (e.g. marketing hero on dark background). */
  selectClassName?: string;
  /** Override default chevron class. */
  chevronClassName?: string;
  /** Omit chevron (e.g. Figma hero language pill — icon is provided beside the control). */
  hideChevron?: boolean;
  /** Show EN / FR instead of full language names (marketing hero pill). */
  codeLabels?: boolean;
}

const LOCALES: Locale[] = ['en', 'fr'];

/**
 * Language follows the URL (next-intl). We persist that choice to localStorage
 * so it stays in sync — we do NOT override the route from an old stored value.
 */
export default function LocaleSelect({
  className,
  showLabel = false,
  labelClassName,
  selectClassName: selectClassNameProp,
  chevronClassName: chevronClassNameProp,
  hideChevron = false,
  codeLabels = false,
}: LocaleSelectProps) {
  const t = useTranslations('ui.localeSelect');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const reactId = useId();
  const selectId = `locale-select-${reactId}`;
  const labelId = `${selectId}-label`;

  const [selected, setSelected] = useState<Locale>(locale);

  // Route is source of truth: mirror it into the UI + localStorage (no redirect away from /fr/...).
  useEffect(() => {
    setSelected(locale);
    setStoredLocale(locale);
  }, [locale]);

  const defaultSelectClassName = showLabel
    ? 'w-full cursor-pointer appearance-none rounded-full border border-outline/30 bg-background-base px-3 py-2.5 pr-10 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25'
    : 'cursor-pointer appearance-none rounded-full border border-outline/30 bg-background-base px-3 py-1.5 pr-8 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25';

  const defaultChevronClassName = showLabel
    ? 'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/50'
    : 'pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/50';

  const selectClassName = selectClassNameProp ?? defaultSelectClassName;
  const chevronClassName = chevronClassNameProp ?? defaultChevronClassName;

  const selectControl = (
    <>
      <select
        id={selectId}
        value={selected}
        onChange={(e) => {
          const nextLocale = e.target.value as Locale;
          if (!LOCALES.includes(nextLocale)) return;

          setSelected(nextLocale);
          setStoredLocale(nextLocale);
          router.push(pathname, { locale: nextLocale });
        }}
        className={selectClassName}
        aria-labelledby={showLabel ? labelId : undefined}
        aria-label={showLabel ? undefined : t('ariaLabel')}
      >
        <option value="en">{codeLabels ? 'EN' : t('en')}</option>
        <option value="fr">{codeLabels ? 'FR' : t('fr')}</option>
      </select>
      {hideChevron ? null : <ChevronDown className={chevronClassName} aria-hidden="true" />}
    </>
  );

  if (!showLabel) {
    return <div className={`relative ${className ?? ''}`}>{selectControl}</div>;
  }

  return (
    <div className={`flex w-full flex-col gap-2 ${className ?? ''}`}>
      <label
        id={labelId}
        htmlFor={selectId}
        className={
          labelClassName ??
          'text-xs font-semibold uppercase tracking-wide text-slate-600'
        }
      >
        {t('label')}
      </label>
      <div className="relative w-full">{selectControl}</div>
    </div>
  );
}
