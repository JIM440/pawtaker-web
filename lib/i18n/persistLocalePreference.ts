import type { Locale } from './config';

let inFlightLocale: Locale | null = null;

/**
 * Persist the locale for authenticated users without blocking UI navigation.
 * Anonymous visitors still rely on localStorage + NEXT_LOCALE cookie.
 */
export async function persistLocalePreference(locale: Locale) {
  if (typeof window === 'undefined') return;
  if (inFlightLocale === locale) return;

  inFlightLocale = locale;

  try {
    const res = await fetch('/api/locale', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ locale }),
      keepalive: true,
    });

    if (!res.ok && res.status !== 401) {
      console.warn('[locale] Failed to persist locale preference.');
    }
  } catch (error) {
    console.warn('[locale] Failed to persist locale preference.', error);
  } finally {
    if (inFlightLocale === locale) {
      inFlightLocale = null;
    }
  }
}
