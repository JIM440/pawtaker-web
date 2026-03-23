import type { Locale } from './config';

/** Matches next-intl default `localeCookie.name` so middleware picks it up on full page loads. */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

const ONE_YEAR_S = 60 * 60 * 24 * 365;

/**
 * Persists locale for the middleware (`localeDetection` reads this cookie).
 * SameSite=Lax matches next-intl’s default `localeCookie` behavior.
 */
export function setLocaleCookie(locale: Locale) {
  if (typeof document === 'undefined') return;
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=${ONE_YEAR_S};SameSite=Lax`;
}

export function getLocaleFromCookie(): Locale | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE_NAME}=(en|fr)(?:;|$)`));
  if (m?.[1] === 'en' || m?.[1] === 'fr') return m[1];
  return null;
}
