import type { Locale } from './config';

const LOCALE_STORAGE_KEY = 'pawtaker_locale';

export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (raw === 'en' || raw === 'fr') return raw;
  return null;
}

export function setStoredLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export { LOCALE_STORAGE_KEY };

